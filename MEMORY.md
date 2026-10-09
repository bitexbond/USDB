# MEMORY — USDBOND 官网

最后更新：2026-10-09

**状态：站点已完成并全部自检通过；以 BitEX 孵化项目的名义发布，目标地址
https://usdb.bitex.bond 。尚未实际部署 —— 需要你完成 GitHub 建仓、推送与 DNS 配置。**

## 本次（第二轮）：BitEX 孵化名义 + usdb.bitex.bond

### 改了什么

- **域名**：`site.config.mjs` 的 `siteUrl` 由占位值改为 `https://usdb.bitex.bond`。
  仍可用 `SITE_URL=` 环境变量覆盖。
- **孵化品牌**：新增 `site.incubator` 配置块（BitEX / Hong Kong BitExchange
  Company Limited / bitex.bond / X 与 GitHub 账号 / 中英措辞）。改这一处会同步到：
  - 页头之上的**孵化关系条**（首屏可见，不抢主品牌注意力）
  - 页脚的**孵化关系声明**（划清孵化方与发行主体的界限）
  - 语言网关页脚
  - 结构化数据与 `llms.txt`
- **部署**：新增 `public/CNAME`（usdb.bitex.bond）与
  `.github/workflows/deploy.yml`（GitHub Pages，构建前跑完整自检）。
- **OG 图**：底行改为 `Incubated by BitEX · usdb.bitex.bond`，14 张已重新生成。
- **自我检查**：断言数 1185 → 1332。新增孵化条可见性、页脚声明、
  孵化实体建模、CNAME 与 siteUrl 一致性、旧域名残留检测。

### 修掉的一个实体建模问题

最初把 BitEX 的 X/GitHub 同时写进了 USDBOND 的 `sameAs`，那等于宣称这两个账号是
USDBOND 自己的。GEO 的目的正是让实体可被消歧，这么做会让 AI 知识图谱把 BitEX
和 USDBOND 混为一谈。已改为：BitEX 是**独立的 Organization 节点**（带自己的
`sameAs`），USDBOND 通过 `parentOrganization` 关联它。自检里有断言防止回退。

### 顺带修的

`serve.mjs` 端口被占用时会抛出未捕获的 `EADDRINUSE` 堆栈 —— 这是要交付给用户
自己跑的脚本，已改为友好提示并给出换端口/结束占用的命令。

## 第一轮：站点本体

### 交付物

| 路径 | 内容 |
| - | - |
| `content/{zh,en}/*.md` | 7 页 × 2 语言内容，102 条结构化问答 |
| `build.mjs` | 构建脚本：Markdown → HTML + JSON-LD + sitemap/robots/llms.txt |
| `site.config.mjs` | 域名、品牌、孵化方、页面清单、UI 文案 |
| `src/templates/layout.mjs` | HTML 模板（页面 / 语言网关 / 404） |
| `src/styles/main.css` | 设计系统，深浅色 + 响应式 + 打印 |
| `src/scripts/gateway.js` | 语言分流（IP 优先于浏览器语言） |
| `src/scripts/site.js` | 记住用户显式选择的语言 |
| `public/og/*.png` | 14 张 OG 社交图 |
| `tools/make-og.py` | OG 图生成工具（一次性，改文案后重跑） |
| `test/gateway.test.mjs` | 语言分流 15 条用例 |
| `test/selfcheck.mjs` | 产物自检 1332 项断言 |
| `.github/workflows/deploy.yml` | GitHub Pages 构建与发布 |

### 语言分流（按 IP 选择语言）

优先级：`?lang=` → localStorage 偏好 → **IP 归属地** → 浏览器语言 → 站点默认值。
CN/TW/HK/MO 走中文，其余走英文。

三个刻意的设计决定：

1. **IP 优先于浏览器语言。** 人在中国、浏览器是英文的用户，按浏览器语言会被送到
   `/en/`，但 IP 表明他大概率想要中文。
2. **爬虫不跳转。** `/` 是 hreflang 的 `x-default` 目标，让不同爬虫看到不同语言
   会稀释 hreflang 信号，所以 Googlebot/GPTBot 等停留在网关上。
3. **隐私优先。** 默认只查同源 `/cdn-cgi/trace`；非 Cloudflare 环境才回落到
   ipapi.co / ipwho.is。**bitex.bond 已在 Cloudflare 上，所以橙云打开后
   同源查询即可命中，第三方回落不会被触发。**


### 过程中修掉的两个真实缺陷

- **问答块没有就地回填。** 原本所有问答被统一追加到文章末尾，导致 `faq.md` 的
  `## 分类` 标题全部变成空壳、27 条问答堆在页尾。已改为按占位符就地替换，
  并确认问答的 `h3` 不进入目录。
- **泄漏防护清单硬编码了本机用户名。** `test/selfcheck.mjs` 的禁用词列表里
  写着本机用户名，一旦发布仓库，这个"防泄漏"清单本身就成了泄漏源。
  已改为运行时从 `os.userInfo()` 取。

另外修正了原文的问答数量口径：正文实际有 27 条问答，原文写的是 25 / 20。

## 验证状态

```bash
npm run check   # ✓ 1332 项断言全部通过
```

覆盖：title/description 全站唯一、canonical、hreflang 配对、结构化数据可解析、
FAQPage 条数与页面问答数一致、内部链接与资源可达、sitemap 与 llms.txt 覆盖完整、
CNAME 与 siteUrl 主机名一致、无旧域名残留、孵化关系可见性与其实体建模、
容器标签闭合、CSS 变量无未定义引用、产物不含本机路径与用户名。

真实浏览器验证（headless Chrome，非模拟）：

- 访问 `/` 自动落到 `/en/`（该环境查不到 IP 归属地，按浏览器语言回退，符合预期）
- `/?lang=zh` 正确强制中文
- `/zh/whitepaper/`、`/en/faq/` 正常渲染，标题、表格、代码块、27 条问答与
  27 条 Question 结构化数据都在渲染后的 DOM 里
- 孵化关系条在渲染后可见，链回 bitex.bond 且带 `rel="noopener"`
- canonical / og:url 域名已是 `usdb.bitex.bond`
- 控制台无报错，无资源加载失败

## 还剩什么 / 需要用户复核

### 必须做的（部署）

1. **推仓库到 GitHub。** 本地仓库已有 8 个 commit，无 remote。
2. **仓库 Settings → Pages → Source 选 "GitHub Actions"**，
   然后 Custom domain 填 `usdb.bitex.bond`。
3. **在 bitex.bond 的 Cloudflare zone 加 DNS 记录**：
   `usdb` CNAME → `<你的org>.github.io`，**先用灰云**等 GitHub 签好证书，
   再切橙云；SSL/TLS 模式设 Full (strict)。
   顺序反了证书签发容易卡住，详见 README。
4. **确认 GitHub Pages 不支持 `_headers`。** CSP 等安全头需要改用
   Cloudflare Transform Rules 配置，README 里给了现成规则文本。

### 必须做的（内容与法务）

5. **核校事实与合规表述。** 内容全部来自工作区的两份原始文档，其中监管进展
   （OCC NPRM 2026-02-25、CLARITY Act 讨论稿）与竞品财务数据（Tether/Circle
   季度数字）都是文档记录时点的口径。**这是证券类内容，上线前必须由业务方
   逐条核对，并补齐发行文件要求的披露。**
6. **确认孵化关系的事实基础。** 页脚声明写了"BitEX 由 Hong Kong BitExchange
   Company Limited 运营，与 USDBOND 基金的发行主体相互独立"。这句话是证券法
   语境下的事实陈述，**需要 BitEX 方面确认后再上线**。措辞集中在
   `site.config.mjs` 的 `incubator` 块与 `ui.*.incubatorNote`。

### 可以考虑的

- USDBOND 尚无独立的官方社交账号，所以 `site.sameAs` 留空、`email` 留空。
  有账号后填进 `site.config.mjs` 能显著提升 AI 引擎的实体识别置信度。
- 目前没有 RSS、没有站点搜索、没有分析统计 —— 都没被要求，需要再加。
- 视觉正确性只做了无头浏览器渲染验证（DOM 结构、控制台、资源加载），
  **没有做截图比对或跨浏览器/真机验证**。排版与配色建议你自己开一次
  `npm run serve` 用眼睛过一遍。
- 语言网关的第三方 IP 查询（ipapi.co / ipwho.is）涉及把访客 IP 发给第三方。
  橙云状态下同源 `/cdn-cgi/trace` 会命中，第三方根本不会被调用；
  若未来迁到非 Cloudflare 托管且面向欧盟用户，考虑关掉它，见 README。
