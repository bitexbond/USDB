/**
 * USDBOND 站点配置 —— 构建期的唯一事实来源。
 *
 * 部署前必须修改 siteUrl。默认值使用 RFC 2606 保留的 .example 顶级域，
 * 保证绝不会指向他人真实域名。也可用环境变量覆盖，无需改动本文件：
 *
 *   SITE_URL=https://your-domain.com npm run build
 */
export const site = {
  // 站点根 URL，末尾不带斜杠。可用 SITE_URL 环境变量覆盖。
  siteUrl: (process.env.SITE_URL || 'https://usdbond.example').replace(/\/+$/, ''),

  // 站点名与代币标识
  name: 'USDBOND',
  token: 'USDB',
  legalName: 'USDBOND Government Money Market Fund',

  // 品牌副标题
  tagline: {
    zh: '链上稳定股票',
    en: 'The On-Chain Stable Equity',
  },

  // 站点级描述，用于 Organization / WebSite 结构化数据
  description: {
    zh: 'USDBOND（USDB）是 1940 年《投资公司法》下的注册投资公司份额，每枚锚定 $1.00，全年 365 天每日空投美国国债收益。',
    en: 'USDBOND (USDB) is a registered investment company share under the Investment Company Act of 1940, pegged at $1.00, with daily US Treasury yield airdropped 365 days a year.',
  },

  // 联系与实体信息（用于结构化数据；请按实际主体替换）
  email: 'ir@usdbond.example',

  // 品牌色（同时写入 webmanifest 与 theme-color）
  themeColor: '#080b11',

  // 默认语言：IP 无法判定时的兜底
  defaultLocale: 'zh',
  locales: ['zh', 'en'],

  // 内容更新日期，页面未单独声明 updated 时使用
  defaultUpdated: '2026-10-09',

  // 社交/实体同链（sameAs），提升 AI 引擎的实体识别置信度。留空则不出现在结构化数据中。
  sameAs: [],
};

/** 页面清单：slug 同时决定文件路径与 URL。 */
export const pages = [
  { slug: 'index', order: 1, priority: 1.0, changefreq: 'weekly' },
  { slug: 'whitepaper', order: 2, priority: 0.9, changefreq: 'monthly' },
  { slug: 'yield', order: 3, priority: 0.9, changefreq: 'monthly' },
  { slug: 'comparison', order: 4, priority: 0.9, changefreq: 'monthly' },
  { slug: 'compliance', order: 5, priority: 0.8, changefreq: 'monthly' },
  { slug: 'risks', order: 6, priority: 0.8, changefreq: 'monthly' },
  { slug: 'faq', order: 7, priority: 0.8, changefreq: 'monthly' },
];

/** 导航标签（按语言），用于生成 header/footer 与面包屑。 */
export const navLabels = {
  index: { zh: '首页', en: 'Home' },
  whitepaper: { zh: '白皮书', en: 'Whitepaper' },
  yield: { zh: '收益机制', en: 'Yield Mechanics' },
  comparison: { zh: '商业对比', en: 'Comparison' },
  compliance: { zh: '合规架构', en: 'Compliance' },
  risks: { zh: '风险因素', en: 'Risks' },
  faq: { zh: '常见问题', en: 'FAQ' },
};

/** 全站 UI 文案（双语）。 */
export const ui = {
  zh: {
    langName: '中文',
    switchTo: 'English',
    switchHref: '/en/',
    skipToContent: '跳到主要内容',
    menu: '菜单',
    breadcrumbHome: '首页',
    toc: '本页目录',
    updated: '最后更新',
    relatedTitle: '相关内容',
    faqTitle: '常见问题速览',
    keyFacts: '关键事实',
    disclaimer:
      'USDBOND 白皮书仅供参考，不构成证券发行要约、要约邀请或投资建议。USDB 份额属于证券，其发行与销售受适用证券法律法规约束，仅面向完成 KYC/AML 验证的合格投资者。潜在投资者在作出投资决策前应阅读完整发行文件并咨询专业顾问。投资涉及风险，包括可能损失全部本金。',
    copyright: 'USDBOND。保留所有权利。',
    ctaWhitepaper: '阅读白皮书',
    ctaFaq: '查看常见问题',
    tocToggle: '展开目录',
  },
  en: {
    langName: 'English',
    switchTo: '中文',
    switchHref: '/zh/',
    skipToContent: 'Skip to main content',
    menu: 'Menu',
    breadcrumbHome: 'Home',
    toc: 'On this page',
    updated: 'Last updated',
    relatedTitle: 'Related',
    faqTitle: 'Quick answers',
    keyFacts: 'Key facts',
    disclaimer:
      'This whitepaper is provided for informational purposes only and does not constitute an offer to sell, a solicitation of an offer to buy, or investment advice. USDB shares are securities; their offer and sale are subject to applicable securities laws and are available only to eligible investors who have completed KYC/AML verification. Prospective investors should read the full offering documents and consult a professional adviser before making any investment decision. Investing involves risk, including possible loss of principal.',
    copyright: 'USDBOND. All rights reserved.',
    ctaWhitepaper: 'Read the whitepaper',
    ctaFaq: 'View FAQ',
    tocToggle: 'Expand table of contents',
  },
};
