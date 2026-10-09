# MEMORY — USDBOND 官网

最后更新：2026-10-09

## 这次做了什么

把工作区里的两份中文原始文档（白皮书、USDB/USDT/USDC 商业模型对比）做成了一个
**中英双语静态站点**，并按需求实现了 SEO 与 GEO 优化。

技术路线：`content/*.md` 为唯一事实来源 → `build.mjs` 生成纯静态 HTML 到 `dist/`。
无框架、无外部字体、无客户端渲染。

### 交付物

| 路径 | 内容 |
| - | - |
| `content/{zh,en}/*.md` | 7 页 × 2 语言内容，102 条结构化问答 |
| `build.mjs` | 构建脚本：Markdown → HTML + JSON-LD + sitemap/robots/llms.txt |
| `site.config.mjs` | 域名、品牌、页面清单、UI 文案（**改域名改这里**） |
| `src/templates/layout.mjs` | HTML 模板（页面 / 语言网关 / 404） |
| `src/styles/main.css` | 设计系统，深浅色 + 响应式 + 打印 |
| `src/scripts/gateway.js` | 语言分流（IP 优先于浏览器语言） |
| `src/scripts/site.js` | 记住用户显式选择的语言 |
| `public/og/*.png` | 14 张 OG 社交图 |
| `tools/make-og.py` | OG 图生成工具（一次性，改文案后重跑） |
| `test/gateway.test.mjs` | 语言分流 15 条用例 |
| `test/selfcheck.mjs` | 产物自检 1179 项断言 |

### 语言分流（按 IP 选择语言）

优先级：`?lang=` → localStorage 偏好 → **IP 归属地** → 浏览器语言 → 站点默认值。
CN/TW/HK/MO 走中文，其余走英文。

三个刻意的设计决定：

1. **IP 优先于浏览器语言。** 人在中国、浏览器是英文的用户，按浏览器语言会被送到
   `/en/`，但 IP 表明他大概率想要中文。
2. **爬虫不跳转。** `/` 是 hreflang 的 `x-default` 目标，让不同爬虫看到不同语言
   会稀释 hreflang 信号，所以 Googlebot/GPTBot 等停留在网关上。
3. **隐私优先。** 默认只查同源 `/cdn-cgi/trace`；非 Cloudflare 环境才回落到
   ipapi.co / ipwho.is。要彻底关闭第三方查询见 README。

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
npm run check   # ✓ 1179 项断言全部通过
```

覆盖：title/description 全站唯一、canonical、hreflang 配对、结构化数据可解析、
FAQPage 条数与页面问答数一致、内部链接与资源可达、sitemap 与 llms.txt 覆盖完整、
容器标签闭合、CSS 变量无未定义引用、产物不含本机路径与用户名。

本地服务器冒烟测试：全部路由 200，缺失路径回退 404 页面。

真实浏览器验证（headless Chrome，非模拟）：

- 访问 `/` 自动落到 `/en/`（该环境查不到 IP 归属地，按浏览器语言回退，符合预期）
- `/?lang=zh` 正确强制中文
- `/zh/whitepaper/`、`/en/faq/` 正常渲染，标题、表格、代码块、27 条问答与
  27 条 Question 结构化数据都在渲染后的 DOM 里
- 控制台无报错，无资源加载失败


## 还剩什么 / 需要用户复核

### 必须做的

1. **改域名。** `site.config.mjs` 的 `siteUrl` 目前是 RFC 2606 保留的占位值
   `https://usdbond.example`。不改的话 canonical / og:url / sitemap 全是错的。
   也可以在构建时用 `SITE_URL=https://... npm run build` 覆盖。
2. **核校事实与合规表述。** 内容全部来自工作区的两份原始文档，其中监管进展
   （OCC NPRM 2026-02-25、CLARITY Act 讨论稿）与竞品财务数据（Tether/Circle
   季度数字）都是文档记录时点的口径。**这是证券类内容，上线前必须由业务方
   逐条核对，并补齐发行文件要求的披露。**
3. **补联系方式与实体信息。** `site.config.mjs` 里的 `email` 是占位值，
   `sameAs` 是空数组（留空则不出现在结构化数据中）。填入真实的官网/社交账号
   能显著提升 AI 引擎的实体识别置信度。

### 可以考虑的

- `dist/` 已 gitignore。若要走 GitHub Pages 的分支部署，需要删掉这条忽略规则
  或改用 CI 构建。
- 目前没有 RSS、没有站点搜索、没有分析统计 —— 都没被要求，需要再加。
- 视觉正确性只做了无头浏览器渲染验证（DOM 结构、控制台、资源加载），
  **没有做截图比对或跨浏览器/真机验证**。排版与配色建议你自己开一次
  `npm run serve` 用眼睛过一遍。
- 语言网关的第三方 IP 查询（ipapi.co / ipwho.is）涉及把访客 IP 发给第三方。
  如果站点面向欧盟用户，考虑关掉它，见 README 的说明。
