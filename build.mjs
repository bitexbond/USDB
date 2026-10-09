#!/usr/bin/env node
/**
 * USDBOND 静态站构建脚本。
 *
 *   node build.mjs              # 生成 dist/
 *   SITE_URL=https://x.com node build.mjs
 *
 * 设计取舍：所有内容处理都在构建期完成，产物是纯静态 HTML —— 无 JS 框架、
 * 无客户端渲染、无外部字体请求。这是 SEO 与 Core Web Vitals 上最省事的一步。
 */
import { readFile, writeFile, mkdir, rm, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { marked } from 'marked';
import { site, pages, navLabels, ui } from './site.config.mjs';
import { renderPage, renderGateway, render404, pathFor, absUrl, labelFor } from './src/templates/layout.mjs';

const ROOT = import.meta.dirname;
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

/* ------------------------------------------------------------------ 工具 */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const stripTags = (s) => s.replace(/<[^>]*>/g, '');

/** 标题 → URL 锚点。保留 CJK 字符，去掉中英标点。 */
export function slugify(text) {
  return (
    stripTags(text)
      .trim()
      .toLowerCase()
      .replace(/[\s\u3000]+/g, ' ')
      .replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^_`{|}~]/g, '')
      .replace(/[、。，：；！？（）〈〉《》「」『』【】〔〕“”‘’·—…－～]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}

/**
 * 解析 frontmatter。只支持本项目实际用到的 YAML 子集：
 *   key: 标量
 *   key: [a, b, c]
 *   key:
 *     - 标量
 *     - subkey: 值
 */
export function parseFrontmatter(raw, sourceName = '(unknown)') {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) throw new Error(`${sourceName}: 缺少 frontmatter（文件必须以 --- 开头）`);

  const fm = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;

  const scalar = (v) => {
    const t = v.trim();
    if (!t) return '';
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
    return t;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) {
      i++;
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`${sourceName}: frontmatter 第 ${i + 1} 行无法解析：${line}`);

    const [, key, rest] = kv;
    if (rest.trim() === '') {
      // 列表块
      const items = [];
      i++;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        const first = lines[i].replace(/^\s+-\s+/, '');
        const sub = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(first);
        if (sub) {
          const obj = { [sub[1]]: scalar(sub[2]) };
          i++;
          while (i < lines.length && /^\s{4,}\S/.test(lines[i]) && !/^\s+-\s+/.test(lines[i])) {
            const s2 = /^\s+([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[i]);
            if (!s2) throw new Error(`${sourceName}: frontmatter 第 ${i + 1} 行无法解析：${lines[i]}`);
            obj[s2[1]] = scalar(s2[2]);
            i++;
          }
          items.push(obj);
        } else {
          items.push(scalar(first));
          i++;
        }
      }
      fm[key] = items;
    } else if (/^\[.*\]$/.test(rest.trim())) {
      fm[key] = rest
        .trim()
        .slice(1, -1)
        .split(',')
        .map((s) => scalar(s))
        .filter(Boolean);
      i++;
    } else {
      fm[key] = scalar(rest);
      i++;
    }
  }

  return { fm, body: raw.slice(m[0].length) };
}

/**
 * 把 `### Q: 问题？` 段落抽出为结构化问答。
 * 这样同一份 Markdown 既渲染成正文，又直接喂给 FAQPage 结构化数据，
 * 不需要在两处维护相同内容。
 */
export function extractFaqs(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  const faqs = [];

  for (let i = 0; i < lines.length; ) {
    const m = /^###\s+Q:\s*(.+?)\s*$/.exec(lines[i]);
    if (!m) {
      out.push(lines[i++]);
      continue;
    }
    const question = m[1];
    const body = [];
    i++;
    while (i < lines.length && !/^#{2,3}\s/.test(lines[i])) body.push(lines[i++]);

    const index = faqs.length;
    faqs.push({ question, md: body.join('\n').trim() });
    out.push(`<!--faq-slot-${index}-->`);
  }

  return { md: out.join('\n'), faqs };
}

/** 渲染 Markdown，并补上锚点、表格容器与问答块。 */
export function renderBody(md, faqs) {
  marked.setOptions({ gfm: true, breaks: false });
  let html = marked.parse(md);

  // 单次遍历同时处理标题与表格：表格容器需要一个可读的无障碍名称，
  // 而唯一合理的来源就是它前面的那个标题。
  const seen = new Map();
  const toc = [];
  let lastHeading = '';

  html = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>|<table>([\s\S]*?)<\/table>/g,
    (full, depth, inner, tableInner) => {
      if (tableInner === undefined) {
        const text = stripTags(inner).trim();
        let id = slugify(text);
        const n = seen.get(id) ?? 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n + 1}`;
        toc.push({ depth: Number(depth), id, text });
        lastHeading = text;
        // 锚点是纯视觉affordance，目录已提供等效的无障碍导航，故对辅助技术隐藏
        return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a></h${depth}>`;
      }
      // 宽表格在窄屏上横向滚动，而不是撑破布局；可聚焦以便键盘用户滚动
      return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(lastHeading)}">\n<table>${tableInner}</table>\n</div>`;
    },
  );

  // 把问答块就地填回占位符位置。
  // 必须就地替换而不是统一追加到文末 —— faq.md 的问答是按 `## 分类` 组织的，
  // 追加到文末会让所有分类标题变成空壳。也必须在标题锚点扫描之后做，
  // 这样问答的 h3 不会进入目录（27 条问答会把目录撑爆）。
  html = html.replace(/<!--faq-slot-(\d+)-->/g, (full, n) => {
    const f = faqs[Number(n)];
    if (!f) return '';
    return `<div class="qa" id="qa-${slugify(f.question)}">
<h3 class="qa__q">${esc(f.question)}</h3>
<div class="qa__a">
${marked.parse(f.md)}
</div>
</div>`;
  });

  return { html, toc };
}

/* ------------------------------------------------------- 结构化数据 (GEO) */

function jsonLdFor({ locale, slug, fm, faqs, title, description, updated, pageUrl }) {
  const orgId = `${absUrl('/')}#organization`;
  const siteId = `${absUrl('/')}#website`;
  const fundId = `${absUrl('/')}#fund`;
  const crumbsId = `${pageUrl}#breadcrumb`;
  const lang = locale === 'zh' ? 'zh-Hans' : 'en';

  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: site.name,
      legalName: site.legalName,
      alternateName: [site.token, `${site.name} (${site.token})`],
      url: absUrl('/'),
      logo: { '@type': 'ImageObject', url: absUrl('/favicon.svg') },
      description: site.description[locale],
      ...(site.email ? { email: site.email } : {}),
      ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: absUrl('/'),
      name: `${site.name} (${site.token})`,
      description: site.description[locale],
      publisher: { '@id': orgId },
      inLanguage: site.locales.map((l) => (l === 'zh' ? 'zh-Hans' : 'en')),
    },
    {
      '@type': 'InvestmentFund',
      '@id': fundId,
      name: site.legalName,
      alternateName: [site.name, site.token],
      url: absUrl('/'),
      description: site.description.en,
      provider: { '@id': orgId },
      category: 'Government money market fund under SEC Rule 2a-7',
      identifier: { '@type': 'PropertyValue', propertyID: 'ticker', value: site.token },
    },
  ];

  const pageTypes = [fm.schema || 'WebPage'];
  if (faqs.length) pageTypes.push('FAQPage');

  const pageNode = {
    '@type': pageTypes.length === 1 ? pageTypes[0] : pageTypes,
    '@id': pageUrl,
    url: pageUrl,
    name: title,
    headline: fm.h1,
    description,
    inLanguage: lang,
    isPartOf: { '@id': siteId },
    about: { '@id': fundId },
    breadcrumb: { '@id': crumbsId },
    dateModified: updated,
    ...(fm.keywords?.length ? { keywords: fm.keywords.join(', ') } : {}),
    ...(faqs.length
      ? {
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: stripTags(marked.parseInline(f.md)).replace(/\s+/g, ' ').trim() },
          })),
        }
      : {}),
  };
  graph.push(pageNode);

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': crumbsId,
    itemListElement:
      slug === 'index'
        ? [{ '@type': 'ListItem', position: 1, name: labelFor('index', locale), item: pageUrl }]
        : [
            { '@type': 'ListItem', position: 1, name: labelFor('index', locale), item: absUrl(pathFor(locale, 'index')) },
            { '@type': 'ListItem', position: 2, name: fm.nav ?? labelFor(slug, locale), item: pageUrl },
          ],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ------------------------------------------------------------ 站点级文件 */

function sitemapXml(urls) {
  const rows = urls
    .map((u) => {
      const alt = site.locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${l === 'zh' ? 'zh-Hans' : 'en'}" href="${absUrl(pathFor(l, u.slug))}"/>`)
        .join('\n');
      return `  <url>
    <loc>${absUrl(pathFor(u.locale, u.slug))}</loc>
${alt}
    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl('/')}"/>
    <lastmod>${u.updated}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${absUrl('/')}</loc>
    <lastmod>${site.defaultUpdated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${rows}
</urlset>
`;
}

/**
 * robots.txt：显式放行主流 AI 抓取器。
 * GEO 的前提是被引用，而被引用的前提是被抓取 —— 默认拒绝 AI 爬虫会直接
 * 让内容从生成式答案里消失。
 */
function robotsTxt() {
  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot',
    'Applebot-Extended',
    'meta-externalagent',
    'Bytespider',
    'CCBot',
    'Amazonbot',
    'cohere-ai',
    'DuckAssistBot',
    'MistralAI-User',
    'YouBot',
    'AI2Bot',
  ];
  return `# ${site.name} (${site.token})
User-agent: *
Allow: /

# 生成式引擎抓取器：显式允许，确保内容可被 AI 检索与引用
${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n')}

Sitemap: ${absUrl('/sitemap.xml')}
`;
}

/** llms.txt —— llmstxt.org 约定：给模型一份精简、带链接的站点索引。 */
function llmsTxt(entries) {
  const section = (locale, heading) => {
    const rows = entries
      .filter((e) => e.locale === locale)
      .map((e) => `- [${e.fm.h1}](${absUrl(pathFor(locale, e.slug))}): ${e.fm.description}`);
    return `## ${heading}\n\n${rows.join('\n')}`;
  };

  return `# ${site.name} (${site.token})

> ${site.description.zh}

> ${site.description.en}

USDBOND (USDB) is a registered investment company share under the Investment Company Act of 1940,
pegged at a constant $1.00 NAV under SEC Rule 2a-7, that airdrops US Treasury yield to eligible
whitelisted holders every day of the year, including weekends and holidays. USDB is a security,
not a payment stablecoin. Issuer revenue comes from a management fee (e.g. 0.15% p.a.) rather than
from reserve spread.

Key figures: constant NAV $1.00 · airdrop 365 days/year · net yield ~3.35% (3.5% Treasury yield less
0.15% management fee) · government securities \u2265 99.5% of assets · WAM \u2264 60 days · WAL \u2264 120 days ·
snapshot daily at 00:00 UTC · planned chains Ethereum, Solana, Polygon, Base.

${section('zh', '中文内容')}

${section('en', 'English content')}

## Optional

- [Full content, single file](${absUrl('/llms-full.txt')}): every page of this site as plain Markdown
- [Sitemap](${absUrl('/sitemap.xml')})
- [Whitepaper in Markdown](${absUrl('/en/whitepaper.md')})
`;
}

/* ----------------------------------------------------------------- 构建 */

async function ensureLocales() {
  const missing = [];
  for (const locale of site.locales) {
    for (const p of pages) {
      const f = path.join(CONTENT, locale, `${p.slug}.md`);
      if (!existsSync(f)) missing.push(path.relative(ROOT, f));
    }
  }
  if (missing.length) {
    throw new Error(`缺少内容文件，构建中止：\n  - ${missing.join('\n  - ')}\n（先补齐双语内容，或临时用另一语言的文件复制占位）`);
  }
}

async function copyDir(from, to) {
  if (!existsSync(from)) return;
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dst);
    else await copyFile(src, dst);
  }
}

async function main() {
  await ensureLocales();

  if (site.siteUrl.includes('.example')) {
    console.warn(
      `\n⚠  siteUrl 仍是占位值 ${site.siteUrl}\n` +
        `   canonical / og:url / sitemap 会写入这个域名。\n` +
        `   部署前请设置 SITE_URL=https://你的域名 或修改 site.config.mjs。\n`,
    );
  }

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const built = [];
  const missingOg = new Set();

  for (const locale of site.locales) {
    for (const p of pages) {
      const src = path.join(CONTENT, locale, `${p.slug}.md`);
      const raw = await readFile(src, 'utf8');
      const { fm, body } = parseFrontmatter(raw, path.relative(ROOT, src));
      const { md, faqs } = extractFaqs(body);
      const { html, toc } = renderBody(md, faqs);

      const validFm = parseFrontmatter(raw, path.relative(ROOT, src)).fm;
      if (!validFm.title) console.warn(`⚠  ${src}: 缺少 title`);
      if (!validFm.description) console.warn(`⚠  ${src}: 缺少 description`);

      const updated = fm.updated || site.defaultUpdated;
      const pageUrl = absUrl(pathFor(locale, p.slug));
      const ogImage = `/og/${locale}-${p.slug}.png`;
      if (!existsSync(path.join(ROOT, 'public', ogImage))) missingOg.add(ogImage);

      const mdPath = `/${locale}/${p.slug}.md`;

      const jsonLd = jsonLdFor({
        locale,
        slug: p.slug,
        fm,
        faqs,
        title: fm.title,
        description: fm.description,
        updated,
        pageUrl,
      });

      const out = renderPage({
        locale,
        slug: p.slug,
        fm,
        title: fm.title,
        description: fm.description,
        bodyHtml: html,
        toc,
        jsonLd,
        ogImage,
        mdPath,
        updated,
      });

      const dir = p.slug === 'index' ? path.join(DIST, locale) : path.join(DIST, locale, p.slug);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), out, 'utf8');

      // 原始 Markdown 一并发布：AI 抓取器与开发者都能直接取到干净正文
      const cleanMd = `# ${fm.h1}\n\n> ${fm.lead}\n\n${body.trim()}\n`;
      await writeFile(path.join(DIST, locale, `${p.slug}.md`), cleanMd, 'utf8');

      built.push({ locale, slug: p.slug, fm, updated, faqs, html: cleanMd, priority: p.priority, changefreq: p.changefreq });
      console.log(`  ✓ ${pathFor(locale, p.slug)}  (${faqs.length} Q&A)`);
    }
  }

  // 语言网关
  const gatewayLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${absUrl('/')}#website`,
        url: absUrl('/'),
        name: `${site.name} (${site.token})`,
        inLanguage: ['zh-Hans', 'en'],
      },
    ],
  };
  await writeFile(path.join(DIST, 'index.html'), renderGateway({ jsonLd: gatewayLd }), 'utf8');
  await writeFile(path.join(DIST, '404.html'), render404(), 'utf8');

  // 站点级文件
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(built), 'utf8');
  await writeFile(path.join(DIST, 'robots.txt'), robotsTxt(), 'utf8');
  await writeFile(path.join(DIST, 'llms.txt'), llmsTxt(built), 'utf8');
  await writeFile(
    path.join(DIST, 'llms-full.txt'),
    `${site.name} (${site.token}) — 完整内容 / full content\nSource: ${absUrl('/')}\n\n${built
      .map((b) => `\n\n${'='.repeat(72)}\n# [${b.locale}] ${b.fm.h1} — ${absUrl(pathFor(b.locale, b.slug))}\n${'='.repeat(72)}\n\n${b.html}`)
      .join('')}`,
    'utf8',
  );
  await writeFile(path.join(DIST, '.nojekyll'), '', 'utf8');

  // 静态资源
  await copyDir(path.join(ROOT, 'public'), DIST);
  await mkdir(path.join(DIST, 'assets'), { recursive: true });
  await copyFile(path.join(ROOT, 'src/styles/main.css'), path.join(DIST, 'assets/main.css'));
  await copyFile(path.join(ROOT, 'src/scripts/site.js'), path.join(DIST, 'assets/site.js'));
  await copyFile(path.join(ROOT, 'src/scripts/gateway.js'), path.join(DIST, 'assets/gateway.js'));

  // 安全与缓存头（Netlify / Cloudflare Pages 直接生效；其他托管忽略此文件）
  await writeFile(
    path.join(DIST, '_headers'),
    `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://ipapi.co https://ipwho.is; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.md
  Content-Type: text/markdown; charset=utf-8
  Cache-Control: public, max-age=3600

/llms.txt
  Content-Type: text/plain; charset=utf-8

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
`,
    'utf8',
  );

  // 自检产物清单
  const countQa = built.reduce((n, b) => n + b.faqs.length, 0);
  console.log(
    `\n构建完成 → ${path.relative(process.cwd(), DIST)}/\n` +
      `  页面 ${built.length} 个（${site.locales.length} 语言 × ${pages.length} 页）\n` +
      `  结构化问答 ${countQa} 条\n` +
      `  siteUrl: ${site.siteUrl}\n` +
      (missingOg.size ? `  ⚠ 缺少 OG 图片 ${missingOg.size} 张，运行 \`npm run og\` 生成\n` : ''),
  );
}

main().catch((err) => {
  console.error(`\n构建失败：${err.message}\n`);
  process.exit(1);
});
