#!/usr/bin/env node
/**
 * 构建产物自检。跑在 `npm run check` 里（先 build 再 check）。
 *
 * 存在的意义：SEO/GEO 的产出大多是"看不见的"——canonical、hreflang、结构化数据、
 * sitemap。这些东西错了页面照样能看，只是白做。所以把它们变成会失败的断言，
 * 而不是靠肉眼抽查。
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { site, pages } from '../site.config.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');

let failures = 0;
let checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (cond) return true;
  failures++;
  console.error(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  return false;
}

function group(name) {
  console.log(`\n${name}`);
}

const read = (p) => readFile(p, 'utf8');
const exists = (p) => existsSync(p);

/** URL 路径 → dist 内的文件路径 */
function urlToFile(url) {
  let u = url.split('#')[0].split('?')[0];
  const base = site.siteUrl.replace(/\/+$/, '');
  if (u.startsWith(base)) u = u.slice(base.length) || '/';
  if (!u.startsWith('/')) return null;
  const abs = path.join(DIST, u);
  if (u.endsWith('/')) return path.join(abs, 'index.html');
  return path.extname(abs) ? abs : path.join(abs, 'index.html');
}

const attrs = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

async function main() {
  if (!exists(DIST)) {
    console.error('dist/ 不存在 —— 先运行 npm run build');
    process.exit(1);
  }

  const pageFiles = [];
  for (const locale of site.locales) {
    for (const p of pages) {
      pageFiles.push({
        locale,
        slug: p.slug,
        url: p.slug === 'index' ? `/${locale}/` : `/${locale}/${p.slug}/`,
        file: p.slug === 'index' ? path.join(DIST, locale, 'index.html') : path.join(DIST, locale, p.slug, 'index.html'),
        md: path.join(DIST, locale, `${p.slug}.md`),
      });
    }
  }

  /* ---------------------------------------------- 每个页面的头部与结构化数据 */
  group('页面元数据 / SEO');

  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const pf of pageFiles) {
    const tag = pf.url;
    if (!ok(exists(pf.file), `${tag} 页面文件存在`)) continue;
    const html = await read(pf.file);

    const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? '';
    ok(title.length >= 15 && title.length <= 120, `${tag} title 长度合理 (${title.length})`, title);
    ok(!seenTitles.has(title), `${tag} title 全站唯一`, `与 ${seenTitles.get(title)} 重复：${title}`);
    seenTitles.set(title, tag);

    const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
    ok(desc.length >= 70 && desc.length <= 230, `${tag} description 长度合理 (${desc.length})`, desc);
    ok(!seenDescriptions.has(desc), `${tag} description 全站唯一`, `与 ${seenDescriptions.get(desc)} 重复`);
    seenDescriptions.set(desc, tag);

    // canonical
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    ok(canonical === site.siteUrl + pf.url, `${tag} canonical 正确`, `实际 ${canonical}`);

    // hreflang 三件套
    const hreflangs = attrs(html, /<link rel="alternate" hreflang="([^"]+)"/g);
    ok(
      ['zh', 'en', 'x-default'].every((h) => hreflangs.includes(h)),
      `${tag} hreflang 完整 (zh/en/x-default)`,
      `实际 ${hreflangs.join(', ')}`,
    );
    const zhHref = new RegExp(`hreflang="zh" href="([^"]+)"`).exec(html)?.[1];
    const enHref = new RegExp(`hreflang="en" href="([^"]+)"`).exec(html)?.[1];
    const sameSlug = pf.slug === 'index' ? '' : `${pf.slug}/`;
    ok(
      zhHref === `${site.siteUrl}/zh/${sameSlug}` && enHref === `${site.siteUrl}/en/${sameSlug}`,
      `${tag} hreflang 指向同一页面的对应语言`,
      `zh=${zhHref} en=${enHref}`,
    );

    // 社交卡片
    ok(/<meta property="og:image" content="[^"]+"/.test(html), `${tag} 有 og:image`);
    ok(/<meta name="twitter:card" content="summary_large_image"/.test(html), `${tag} 有 twitter card`);
    ok(/<meta property="og:locale" content="(zh_CN|en_US)"/.test(html), `${tag} 有 og:locale`);

    // Markdown 备用表示
    ok(
      new RegExp(`<link rel="alternate" type="text/markdown" href="${site.siteUrl}/${pf.locale}/${pf.slug}\\.md"`).test(html),
      `${tag} 有 text/markdown 备用链接`,
    );
    ok(exists(pf.md), `${tag} 原始 Markdown 已发布 (${pf.slug}.md)`);

    // 结构性要求
    const h1s = html.match(/<h1[ >]/g) ?? [];
    ok(h1s.length === 1, `${tag} 恰好一个 h1`, `实际 ${h1s.length} 个`);
    ok(/<html lang="(zh-Hans|en)"/.test(html), `${tag} html lang 已设置`);
    ok(/class="skip"/.test(html), `${tag} 有跳到主要内容链接`);

    // 标题锚点唯一
    const ids = attrs(html, /<h[23] id="([^"]+)"/g);
    ok(new Set(ids).size === ids.length, `${tag} 标题锚点唯一`, `重复：${ids.join(', ')}`);

    // 未替换的占位符
    ok(!html.includes('faq-slot-'), `${tag} 无遗留的问答占位符`);

    // 结构化数据
    const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    ok(ldBlocks.length >= 1, `${tag} 至少一段 JSON-LD`);

    let graph = null;
    for (const b of ldBlocks) {
      try {
        const parsed = JSON.parse(b);
        ok(!!parsed['@context'], `${tag} JSON-LD 含 @context`);
        if (parsed['@graph']) graph = parsed['@graph'];
      } catch (e) {
        ok(false, `${tag} JSON-LD 可解析`, e.message);
      }
    }

    if (ok(!!graph, `${tag} JSON-LD 有 @graph`)) {
      const pageUrl = site.siteUrl + pf.url;
      const pageNode = graph.find((n) => n['@id'] === pageUrl);
      if (ok(!!pageNode, `${tag} @graph 含本页节点 (@id = ${pageUrl})`)) {
        ok(!!pageNode.description, `${tag} 本页节点含 description`);
        ok(!!pageNode.inLanguage, `${tag} 本页节点含 inLanguage`);
        ok(!!pageNode.isPartOf, `${tag} 本页节点 isPartOf WebSite`);
        ok(!!pageNode.about, `${tag} 本页节点 about 指向基金实体`);
        ok(!!pageNode.dateModified, `${tag} 本页节点含 dateModified`);
      }
      ok(!!graph.find((n) => n['@id'] === `${site.siteUrl}/#fund`), `${tag} @graph 含 InvestmentFund 实体`);
      ok(!!graph.find((n) => String(n['@type']).includes('BreadcrumbList')), `${tag} @graph 含 BreadcrumbList`);
      ok(!!graph.find((n) => n['@type'] === 'Organization'), `${tag} @graph 含 Organization`);
    }

    // FAQPage 与页面内问答数量一致
    const qaCount = (html.match(/class="qa__q"/g) ?? []).length;
    if (graph) {
      const faqNode = graph.find((n) => String(n['@type']).includes('FAQPage'));
      if (qaCount > 0) {
        if (ok(!!faqNode, `${tag} 有 ${qaCount} 条问答时应输出 FAQPage`)) {
          ok(
            faqNode.mainEntity.length === qaCount,
            `${tag} FAQPage 条目数与页面问答数一致 (${faqNode.mainEntity.length} vs ${qaCount})`,
          );
          ok(
            faqNode.mainEntity.every((q) => q['@type'] === 'Question' && q.acceptedAnswer?.text?.length > 20),
            `${tag} 每条 Question 都有非空 acceptedAnswer`,
          );
        }
      } else {
        ok(!faqNode, `${tag} 无问答时不应输出 FAQPage`);
      }
    }

    // 资源与内部链接可达
    const assets = [
      ...attrs(html, /<link rel="stylesheet" href="([^"]+)"/g),
      ...attrs(html, /<script src="([^"]+)"/g),
      ...attrs(html, /<link rel="icon" href="([^"]+)"/g),
      ...attrs(html, /<link rel="manifest" href="([^"]+)"/g),
      ...attrs(html, /<meta property="og:image" content="([^"]+)"/g),
    ];
    for (const a of new Set(assets)) {
      const f = urlToFile(a);
      ok(!!f && exists(f), `${tag} 资源可达 ${a}`);
    }

    const links = new Set(attrs(html, /href="(\/[^"]*)"/g));
    for (const l of links) {
      if (l.startsWith('//')) continue;
      const f = urlToFile(l);
      ok(!!f && exists(f), `${tag} 内部链接可达 ${l}`);
    }
  }

  /* -------------------------------------------------- 跨语言内容纯净度 */
  group('跨语言链接完整性');

  for (const pf of pageFiles) {
    if (!exists(pf.file)) continue;
    const html = await read(pf.file);
    const article = /<article class="prose">([\s\S]*?)<\/article>/.exec(html)?.[1] ?? '';
    const otherLocale = pf.locale === 'zh' ? 'en' : 'zh';
    const wrong = [...article.matchAll(new RegExp(`href="/${otherLocale}/[^"]*"`, 'g'))].map((m) => m[0]);
    ok(wrong.length === 0, `${pf.url} 正文未串到 ${otherLocale} 版本`, wrong.slice(0, 3).join(', '));
  }

  /* ---------------------------------------------------------- 站点级文件 */
  group('站点级 SEO / GEO 文件');

  const sitemap = exists(path.join(DIST, 'sitemap.xml')) ? await read(path.join(DIST, 'sitemap.xml')) : '';
  ok(!!sitemap, 'sitemap.xml 存在');
  ok(sitemap.startsWith('<?xml'), 'sitemap.xml 以 XML 声明开头');
  ok(sitemap.includes('xmlns:xhtml'), 'sitemap.xml 声明了 xhtml 命名空间');
  for (const pf of pageFiles) {
    ok(sitemap.includes(`<loc>${site.siteUrl}${pf.url}</loc>`), `sitemap 含 ${pf.url}`);
  }
  ok((sitemap.match(/<lastmod>/g) ?? []).length >= pageFiles.length, 'sitemap 每页都有 lastmod');

  const robots = exists(path.join(DIST, 'robots.txt')) ? await read(path.join(DIST, 'robots.txt')) : '';
  ok(!!robots, 'robots.txt 存在');
  ok(robots.includes(`Sitemap: ${site.siteUrl}/sitemap.xml`), 'robots.txt 指向 sitemap');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot']) {
    ok(robots.includes(`User-agent: ${bot}`), `robots.txt 显式放行 ${bot}`);
  }

  const llms = exists(path.join(DIST, 'llms.txt')) ? await read(path.join(DIST, 'llms.txt')) : '';
  ok(!!llms, 'llms.txt 存在');
  ok(llms.startsWith('# '), 'llms.txt 以 H1 开头');
  ok(llms.includes('\n> '), 'llms.txt 含摘要 blockquote');
  for (const pf of pageFiles) {
    ok(llms.includes(`${site.siteUrl}${pf.url}`), `llms.txt 收录 ${pf.url}`);
  }

  const llmsFull = exists(path.join(DIST, 'llms-full.txt')) ? await read(path.join(DIST, 'llms-full.txt')) : '';
  ok(!!llmsFull, 'llms-full.txt 存在');
  ok(llmsFull.length > 20000, `llms-full.txt 内容量充足 (${llmsFull.length} 字节)`);

  for (const f of ['index.html', '404.html', '.nojekyll', 'manifest.webmanifest', 'favicon.svg', '_headers']) {
    ok(exists(path.join(DIST, f)), `dist/${f} 存在`);
  }

  /* ------------------------------------------------------ 无开发机信息泄漏 */
  group('交付卫生（不泄漏本机信息）');

  // 本机用户名从运行时取，不写死在仓库里 —— 否则这个防护清单本身
  // 就成了它要防的那种泄漏。
  const localUser = (() => {
    try {
      return os.userInfo().username;
    } catch {
      return null;
    }
  })();

  const banned = [
    [/\/home\/[a-z0-9_-]+/i, '本机用户目录路径'],
    [/\/Users\/[a-z0-9_-]+/i, 'macOS 用户目录路径'],
    [/\.ssh\b/i, 'SSH 目录'],
    [/\.local\/share/i, '系统目录'],
    [/\bhomedir\b/i, 'homedir 字面量'],
  ];
  if (localUser && localUser.length >= 3) {
    banned.push([new RegExp(`\\b${localUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'), '本机用户名']);
  }

  async function walk(dir) {
    const out = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(p)));
      else out.push(p);
    }
    return out;
  }

  const all = await walk(DIST);
  ok(all.length > 20, `产物文件数正常 (${all.length})`);

  for (const f of all) {
    const s = await stat(f);
    if (s.size > 2_000_000) continue; // 二进制大文件跳过
    let text;
    try {
      text = await read(f);
    } catch {
      continue;
    }
    for (const [re, label] of banned) {
      const m = re.exec(text);
      ok(!m, `${path.relative(DIST, f)} 未泄漏${label}`, m ? `命中：${m[0]}` : '');
    }
  }

  /* ------------------------------------------------------------------ 汇总 */
  console.log(
    failures === 0
      ? `\n✓ 自检通过：${checks} 项断言全部通过\n`
      : `\n✗ 自检失败：${checks} 项断言中 ${failures} 项未通过\n`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
