/**
 * HTML 模板。所有输出都是静态字符串拼接，无运行时依赖。
 * 无障碍与 SEO 相关的取舍都集中在这里，改一处即全站生效。
 */
import { site, pages, navLabels, ui } from '../../site.config.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** 页面 URL 路径：首页为 /<locale>/，其余为 /<locale>/<slug>/ */
export function pathFor(locale, slug) {
  return slug === 'index' ? `/${locale}/` : `/${locale}/${slug}/`;
}

export function absUrl(p) {
  return site.siteUrl + p;
}

export const otherLocale = (locale) => (locale === 'zh' ? 'en' : 'zh');

/** 面包屑 / 导航共用的页面标题 */
export function labelFor(slug, locale) {
  return navLabels[slug]?.[locale] ?? slug;
}

function navHtml(locale, currentSlug, t) {
  return pages
    .map((p) => {
      const label = labelFor(p.slug, locale);
      const current = p.slug === currentSlug;
      return `<li><a href="${pathFor(locale, p.slug)}"${current ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`;
    })
    .join('\n          ');
}

function head({ locale, slug, fm, title, description, ogImage, jsonLd, mdPath }) {
  const t = ui[locale];
  const other = otherLocale(locale);
  const canonical = absUrl(pathFor(locale, slug));
  const altZh = absUrl(pathFor('zh', slug));
  const altEn = absUrl(pathFor('en', slug));

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">

<!-- 语言与地区替代版本：zh/en 互为 hreflang，x-default 指向语言网关 -->
<link rel="alternate" hreflang="zh" href="${altZh}">
<link rel="alternate" hreflang="en" href="${altEn}">
<link rel="alternate" hreflang="x-default" href="${absUrl('/')}">
<link rel="alternate" type="text/markdown" href="${absUrl(mdPath)}" title="Markdown source">

<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="${site.themeColor}">
<meta name="color-scheme" content="dark light">

<!-- Open Graph -->
<meta property="og:type" content="${fm.schema === 'Article' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${locale === 'zh' ? 'zh_CN' : 'en_US'}">
<meta property="og:locale:alternate" content="${locale === 'zh' ? 'en_US' : 'zh_CN'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${absUrl(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(fm.h1)} — ${esc(site.name)} (${esc(site.token)})">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${absUrl(ogImage)}">
<meta name="twitter:image:alt" content="${esc(fm.h1)} — ${esc(site.name)} (${esc(site.token)})">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon.svg">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="/assets/main.css">

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;
}

/**
 * 渲染完整页面。
 * @param {{locale:string, slug:string, fm:object, title:string, description:string,
 *          bodyHtml:string, toc:Array, jsonLd:object,
 *          ogImage:string, mdPath:string, updated:string}} o
 */
export function renderPage(o) {
  const { locale, slug, fm, title, description, bodyHtml, toc, jsonLd, ogImage, mdPath, updated } = o;
  const t = ui[locale];
  const other = otherLocale(locale);
  const isHome = slug === 'index';

  const stats =
    isHome && Array.isArray(fm.heroStats)
      ? `<dl class="stats">
${fm.heroStats
  .map(
    (s) => `        <div class="stat">
          <dt class="stat__label">${esc(s.label)}</dt>
          <dd class="stat__value">${esc(s.value)}</dd>
          <p class="stat__note">${esc(s.note)}</p>
        </div>`,
  )
  .join('\n')}
      </dl>`
      : '';

  const tocHtml = toc.length
    ? `<nav class="toc" aria-labelledby="toc-h">
        <h2 id="toc-h" class="toc__title">${esc(t.toc)}</h2>
        <ol class="toc__list">
${toc
  .map(
    (h) =>
      `          <li class="toc__item toc__item--h${h.depth}"><a href="#${h.id}">${esc(h.text)}</a></li>`,
  )
  .join('\n')}
        </ol>
      </nav>`
    : '';

  const crumbs = isHome
    ? ''
    : `<nav class="crumbs" aria-label="Breadcrumb"><ol>
          <li><a href="${pathFor(locale, 'index')}">${esc(t.breadcrumbHome)}</a></li>
          <li><span aria-current="page">${esc(fm.nav ?? labelFor(slug, locale))}</span></li>
        </ol></nav>`;

  return `<!doctype html>
<html lang="${locale === 'zh' ? 'zh-Hans' : 'en'}">
<head>
${head({ locale, slug, fm, title, description, ogImage, jsonLd, mdPath })}
</head>
<body>
<a class="skip" href="#main">${esc(t.skipToContent)}</a>

<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="${pathFor(locale, 'index')}">
      <span class="brand__mark" aria-hidden="true">U</span>
      <span class="brand__text">
        <strong>${esc(site.name)}</strong>
        <span class="brand__tag">${esc(site.tagline[locale])}</span>
      </span>
    </a>
    <nav class="site-nav" aria-label="${esc(t.menu)}">
      <ul>
          ${navHtml(locale, slug, t)}
      </ul>
    </nav>
    <a class="lang-switch" href="${pathFor(other, slug)}" hreflang="${other}" lang="${other === 'zh' ? 'zh-Hans' : 'en'}" data-lang="${other}">
      <span aria-hidden="true">◎</span> ${esc(t.switchTo)}
    </a>
  </div>
</header>

<main id="main">
${crumbs}
  <div class="wrap page">
    <div class="page__head">
      ${fm.kicker ? `<p class="kicker">${esc(fm.kicker)}</p>` : ''}
      <h1>${esc(fm.h1)}</h1>
      ${fm.lead ? `<p class="lead">${esc(fm.lead)}</p>` : ''}
      <p class="meta"><time datetime="${updated}">${esc(t.updated)}：${updated}</time></p>
    </div>
${stats}
    <div class="page__body">
${tocHtml}
      <article class="prose">
${bodyHtml}
      </article>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">
    <nav class="footer-nav" aria-label="Footer">
      <ul>
        ${pages.map((p) => `<li><a href="${pathFor(locale, p.slug)}">${esc(labelFor(p.slug, locale))}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <p class="disclaimer">${esc(t.disclaimer)}</p>
    <p class="copyright">© ${new Date(site.defaultUpdated).getUTCFullYear()} ${esc(site.copyright)} <a href="${pathFor(other, slug)}" hreflang="${other}" data-lang="${other}">${esc(t.switchTo)}</a></p>
  </div>
</footer>

<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

/** 语言网关：静态内容对爬虫可见，脚本仅对真人做 IP/浏览器语言分流。 */
export function renderGateway({ jsonLd }) {
  const links = pages
    .map(
      (p) =>
        `<li><a href="${pathFor('zh', p.slug)}">${esc(labelFor(p.slug, 'zh'))}</a><span class="sep" aria-hidden="true">/</span><a href="${pathFor('en', p.slug)}" hreflang="en">${esc(labelFor(p.slug, 'en'))}</a></li>`,
    )
    .join('\n          ');

  return `<!doctype html>
<html lang="${site.defaultLocale === 'zh' ? 'zh-Hans' : 'en'}" data-default-locale="${site.defaultLocale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.name)} (${esc(site.token)}) — ${esc(site.tagline.zh)} / ${esc(site.tagline.en)}</title>
<meta name="description" content="${esc(site.description.zh)}">
<link rel="canonical" href="${absUrl('/')}">
<link rel="alternate" hreflang="zh" href="${absUrl('/zh/')}">
<link rel="alternate" hreflang="en" href="${absUrl('/en/')}">
<link rel="alternate" hreflang="x-default" href="${absUrl('/')}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="${site.themeColor}">
<meta name="color-scheme" content="dark light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(site.name)} (${esc(site.token)}) — ${esc(site.tagline.en)}">
<meta property="og:description" content="${esc(site.description.en)}">
<meta property="og:url" content="${absUrl('/')}">
<meta property="og:image" content="${absUrl('/og/home.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="stylesheet" href="/assets/main.css">
<script src="/assets/gateway.js"></script>
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body class="gateway">
<main id="main" class="gateway__main">
  <div class="wrap gateway__inner">
    <span class="brand__mark brand__mark--lg" aria-hidden="true">U</span>
    <h1>${esc(site.name)} <span class="token">${esc(site.token)}</span></h1>
    <p class="gateway__tag"><span lang="zh-Hans">${esc(site.tagline.zh)}</span> <span class="sep" aria-hidden="true">·</span> <span lang="en">${esc(site.tagline.en)}</span></p>

    <p class="gateway__lead" lang="zh-Hans">${esc(site.description.zh)}</p>
    <p class="gateway__lead" lang="en">${esc(site.description.en)}</p>

    <div class="gateway__langs">
      <a class="btn btn--primary" href="/zh/" hreflang="zh" lang="zh-Hans" data-lang="zh">中文</a>
      <a class="btn" href="/en/" hreflang="en" lang="en" data-lang="en">English</a>
    </div>
    <p class="gateway__hint" id="geo-hint" aria-live="polite">正在根据您的位置选择语言… / Selecting your language…</p>

    <nav class="gateway__index" aria-label="Contents">
      <ul>
          ${links}
      </ul>
    </nav>
  </div>
</main>
</body>
</html>
`;
}

/** 404：双语，给出返回路径而不是死胡同。 */
export function render404() {
  return `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — ${esc(site.name)}</title>
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="${site.themeColor}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/main.css">
</head>
<body>
<main id="main" class="wrap page">
  <h1>404</h1>
  <p class="lead">页面不存在。<span lang="en">Page not found.</span></p>
  <p><a class="btn btn--primary" href="/zh/">中文首页</a> <a class="btn" href="/en/" hreflang="en">English home</a></p>
  <nav class="footer-nav" aria-label="Sitemap"><ul>
    ${pages.map((p) => `<li><a href="${pathFor('zh', p.slug)}">${esc(labelFor(p.slug, 'zh'))}</a></li>`).join('\n    ')}
  </ul></nav>
</main>
</body>
</html>
`;
}
