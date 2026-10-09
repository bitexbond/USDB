/**
 * USDBOND 站点配置 —— 构建期的唯一事实来源。
 *
 * 域名的权威值来自 SITE_URL 环境变量，其次是本文件的 siteUrl：
 *
 *   SITE_URL=https://usdb.bitex.bond npm run build
 */
export const site = {
  // 站点根 URL，末尾不带斜杠。可用 SITE_URL 环境变量覆盖。
  siteUrl: (process.env.SITE_URL || 'https://usdb.bitex.bond').replace(/\/+$/, ''),

  // 站点名与代币标识
  name: 'USDBOND',
  token: 'USDB',
  legalName: 'USDBOND Government Money Market Fund',

  // 品牌副标题
  tagline: {
    zh: '链上稳定股票',
    en: 'The On-Chain Stable Equity',
  },

  /**
   * 孵化方。USDBOND 以 BitEX 孵化项目的名义发布。
   * 事实以 bitex.bond 官网为准；改这里会同步影响页头页脚、结构化数据与 llms.txt。
   */
  incubator: {
    name: 'BitEX',
    url: 'https://bitex.bond/',
    legalName: 'Hong Kong BitExchange Company Limited',
    logo: 'https://bitex.bond/bitex_logo.png',
    sameAs: ['https://x.com/bitexbond', 'https://github.com/bitexbond'],
    tagline: {
      zh: 'Crypto Bond Exchange',
      en: 'Crypto Bond Exchange',
    },
    // 页头/页脚与 llms.txt 中的措辞
    statement: {
      zh: '由 BitEX 孵化',
      en: 'Incubated by BitEX',
    },
  },

  // 站点级描述，用于 Organization / WebSite 结构化数据
  description: {
    zh: 'USDBOND（USDB）是 1940 年《投资公司法》下的注册投资公司份额，每枚锚定 $1.00，全年 365 天每日空投美国国债收益。由 BitEX 孵化。',
    en: 'USDBOND (USDB) is a registered investment company share under the Investment Company Act of 1940, pegged at $1.00, with daily US Treasury yield airdropped 365 days a year. Incubated by BitEX.',
  },

  // 对外联络：USDBOND 尚无独立公开渠道，因此留空。
  // BitEX 的 X/GitHub 属于孵化方本身，写在 incubator.sameAs 上 ——
  // 挂到 USDBOND 的 sameAs 会让知识图谱把两个实体混为一谈。
  email: '',
  sameAs: [],

  // 默认语言：IP 无法判定时的兜底
  defaultLocale: 'zh',
  locales: ['zh', 'en'],

  // 内容更新日期，页面未单独声明 updated 时使用
  defaultUpdated: '2026-10-09',
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
    // 孵化关系声明。与上面的法律免责声明分开呈现：前者是事实陈述，后者是法律声明
    incubatorNote:
      'USDBOND 以 BitEX 孵化项目的名义发布。BitEX 由 Hong Kong BitExchange Company Limited 运营，与 USDBOND 基金的发行主体相互独立；孵化关系不构成对 USDB 的发行、赎回、担保、背书或投资建议。',
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
    // 孵化关系声明。与上面的法律免责声明分开呈现：前者是事实陈述，后者是法律声明
    incubatorNote:
      'USDBOND is published as a BitEX-incubated project. BitEX is operated by Hong Kong BitExchange Company Limited, which is independent of the issuer of the USDBOND fund. The incubation relationship does not constitute issuance, redemption, a guarantee, an endorsement, or investment advice in respect of USDB.',
    disclaimer:
      'This whitepaper is provided for informational purposes only and does not constitute an offer to sell, a solicitation of an offer to buy, or investment advice. USDB shares are securities; their offer and sale are subject to applicable securities laws and are available only to eligible investors who have completed KYC/AML verification. Prospective investors should read the full offering documents and consult a professional adviser before making any investment decision. Investing involves risk, including possible loss of principal.',
    copyright: 'USDBOND. All rights reserved.',
    ctaWhitepaper: 'Read the whitepaper',
    ctaFaq: 'View FAQ',
    tocToggle: 'Expand table of contents',
  },
};
