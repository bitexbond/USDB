# USDBOND 官网

USDBOND（USDB）的双语静态站点，含 SEO 与 GEO（生成式引擎优化）实现。

内容源是仓库里的两份中文文档（白皮书、商业模型对比），拆成 7 个页面并译成英文，
由构建脚本生成纯静态 HTML。产物没有任何运行时框架、没有外部字体请求、没有客户端渲染。

## 快速开始

```bash
npm install
npm run build      # 生成 dist/
npm run serve      # 本地预览 http://127.0.0.1:4173
npm run check      # 网关测试 + 构建 + 产物自检（1073 项断言）
```

部署前**必须**改域名，否则 canonical / og:url / sitemap 会写入占位域名：

```bash
SITE_URL=https://your-domain.com npm run build
```

或直接改 `site.config.mjs` 里的 `siteUrl`。

## 目录结构

```
content/zh/*.md        中文内容（唯一事实来源）
content/en/*.md        英文内容
site.config.mjs        站点配置：域名、品牌、页面清单、UI 文案
build.mjs              构建脚本：Markdown → HTML + 结构化数据 + 站点级文件
src/templates/         HTML 模板
src/styles/main.css    设计系统（深/浅色、响应式、打印）
src/scripts/           gateway.js（语言分流）、site.js（偏好记忆）
public/                favicon、manifest、og/ 社交图
tools/make-og.py       一次性工具：生成 OG 图片
test/                  网关决策测试、构建产物自检
dist/                  构建产物（gitignore，部署这个目录）
```

## 内容维护

### frontmatter

每个 `content/<locale>/<slug>.md` 以 YAML 子集开头：

```yaml
---
slug: index              # 决定 URL，与文件名一致
title: ...               # <title>，建议 15–120 字符
description: ...         # meta description，建议 70–230 字符
h1: ...                  # 页面 H1
lead: ...                # 导语，写成"结论先行"的一句话
nav: 首页                # 导航与面包屑标签
order: 1
updated: 2026-10-09      # 输出到 <time>、sitemap lastmod、dateModified
schema: WebPage          # WebPage | Article | FAQPage
keywords: [a, b, c]
heroStats:               # 可选，首页数据卡
  - value: $1.00
    label: 恒定 NAV
    note: Rule 2a-7 摊余成本法
---
```

解析器只支持这个子集（标量、行内数组、列表、列表套键值）。值里不要出现 ASCII 的
`": "`（冒号加空格），会被当成新的键。中文全角冒号 `：` 不受影响。

### 问答写法

用 `### Q: 问题？` 起一条问答，正文写到下一个 `##` 或 `###` 为止：

```markdown
### Q: USDBOND 是什么？

USDBOND（代币代码 USDB）是一种链上稳定股票……
```

构建脚本会把这套写法**同时**用于两处：渲染页面正文，以及生成 `FAQPage`
结构化数据。一份内容两处生效，不需要维护重复数据。

新增问答后页面里问答数量会变，注意同步更新文案里的数字（如"27 个高频问题"）
和 `tools/make-og.py` 里对应的 OG 图标题。

### 其他约定

- `> 引用` 会渲染成提示框，用来放定义或风险提示。
- 表格用标准 GFM 表格；构建时会套一层可横向滚动的容器。
- 代码块用裸 ` ``` ` 起头（marked 会把语言标记原样带上，这里不需要）。
- 标题锚点由标题文本生成；中文标题会保留汉字。

## SEO 实现

| 项 | 位置 |
| - | - |
| 唯一 title / description | 每页 frontmatter，自检断言全站唯一 |
| canonical | 每页绝对 URL |
| hreflang | zh / en / x-default 三件套，逐页互指同一 slug |
| Open Graph + Twitter Card | 含 1200×630 图片、image:alt、og:locale |
| 面包屑 | 可见导航 + BreadcrumbList 结构化数据 |
| sitemap.xml | 含 xhtml:link 语言替代与 lastmod |
| robots.txt | 显式放行主流 AI 抓取器 |
| 语义化标题层级 | 每页恰好一个 h1 |
| 内部链接 | 头部导航、页脚导航、正文互链 |
| Core Web Vitals | 无外部字体、无框架、单 CSS 单 JS、图片全带尺寸 |
| 安全头 | `dist/_headers`（Netlify / Cloudflare Pages 生效） |

## GEO 实现（生成式引擎优化）

目标是让 ChatGPT / Perplexity / Google AI Overviews / 中文 AI 引擎能**抓取并愿意引用**这个站点。

| 手段 | 说明 |
| - | - |
| `llms.txt` | llmstxt.org 约定：站点摘要 + 关键数字 + 逐页链接 |
| `llms-full.txt` | 全站内容合并为单个纯文本，便于整站投喂 |
| 原始 Markdown | 每页额外发布 `/<locale>/<slug>.md`，并用 `<link rel="alternate" type="text/markdown">` 标注 |
| 结构化数据 | `@graph` 含 Organization、WebSite、InvestmentFund 实体、页面节点、BreadcrumbList、FAQPage |
| FAQPage | 102 条问答来自正文本身，不是另写的副本 |
| 结论先行 | 每节首句直接给结论与数字，便于被摘录 |
| 实体显式化 | 关键句始终写"USDBOND (USDB)"而非代词，强化实体消歧 |
| AI 爬虫放行 | robots.txt 显式允许 GPTBot、ClaudeBot、PerplexityBot 等 20 个 UA |
| 可引用的原子事实 | 关键数字集中成表格与"关键事实"块 |

## 语言分流

`/` 是语言网关，分流优先级：

1. `?lang=zh|en` URL 参数
2. 用户显式点击过语言切换（localStorage）
3. **IP 归属地** —— CN / TW / HK / MO 走中文，其余走英文
4. 浏览器语言
5. `site.config.mjs` 的 `defaultLocale`

第 1、2 步在 `<head>` 的阻塞脚本里同步完成，不会闪屏；第 3 步是异步的，网关页面
本身是可索引的双语入口，等待期间显示的是它。

设计取舍：

- **爬虫不跳转。** Googlebot、GPTBot 等停留在 `/`，因为 `/` 是 hreflang 的
  `x-default` 目标。让爬虫按 IP 跳转只会让不同爬虫看到不同语言，稀释 hreflang 信号。
- **同一会话只自动跳一次。** 用户主动点回 `/` 说明他想选语言，不该再被弹走。
- **隐私优先。** 默认只查同源的 `/cdn-cgi/trace`（Cloudflare 托管时零第三方请求）。
  非 Cloudflare 环境才回落到 ipapi.co / ipwho.is。要彻底关闭第三方查询，把
  `src/scripts/gateway.js` 里的 `ALLOW_THIRD_PARTY_GEO` 改成 `false`
  （代价：非 Cloudflare 托管时 IP 分流失效，退化为浏览器语言判断）。

分流规则的测试在 `test/gateway.test.mjs`，15 条用例覆盖优先级顺序与各种回退。

## 部署

产物是 `dist/`，纯静态，任何静态托管都能直接用。

```bash
SITE_URL=https://your-domain.com npm run build
# 然后把 dist/ 上传到托管商
```

- **GitHub Pages**：`dist/` 已被 gitignore。要么在 CI 里构建后发布，
  要么临时删掉 `.gitignore` 里的 `dist/` 直接提交产物。产物里的 `.nojekyll` 已生成。
- **Cloudflare Pages / Netlify**：构建命令 `npm run build`，发布目录 `dist`。
  两者都会读取 `dist/_headers` 应用 CSP 等安全响应头。**推荐 Cloudflare** ——
  语言网关的同源 IP 查询在那里可用，且不产生任何第三方请求。
- **本地直接看**：`npm run serve`。

## 测试

```bash
npm run check
```

- `test/gateway.test.mjs` —— 语言分流优先级与回退（假 DOM 里真跑 gateway.js）
- `test/selfcheck.mjs` —— 产物自检：每页 title/description 唯一性、canonical、
  hreflang 配对、结构化数据可解析、FAQPage 条数与页面问答数一致、内部链接与
  资源可达、sitemap/llms.txt 覆盖完整、**产物中不含本机路径或用户名**

改完内容或模板跑一次 `npm run check` 再提交。

## 已知限制

- 本仓库的内容来自两份中文原始文档，其中提到的监管进展、竞品财务数据均为文档
  记录时点的口径。**上线前应由业务方核校事实与合规表述。**
- `dist/` 不提交，所以仓库本身不能直接当站点根目录用，需要先构建。
- OG 图片是构建产物的一部分（`public/og/`，已提交）。改文案后要跑
  `python3 tools/make-og.py` 重新生成，脚本会在文字过高时以非零退出码提示。
- 站点未做真实流量压测与浏览器矩阵验证，只在本地服务器上做了路由冒烟测试。
