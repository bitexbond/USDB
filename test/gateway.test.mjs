#!/usr/bin/env node
/**
 * 语言网关决策逻辑测试。
 *
 * 分流规则是"按 IP 选语言"这个明确需求的全部实现，而且它只在浏览器里跑、
 * 错了也没人会立刻发现（页面照常能开，只是语言不对）。所以把它放进一个
 * 最小假 DOM 里真跑一遍，而不是靠读代码相信它。
 *
 *   node test/gateway.test.mjs
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const CODE = readFileSync(path.join(import.meta.dirname, '..', 'src/scripts/gateway.js'), 'utf8');

let failures = 0;
let checks = 0;

/**
 * 在假环境里跑一次网关脚本。
 * @returns {Promise<{replaced:string[], stored:Map<string,string>}>}
 */
async function run({
  search = '',
  langs = ['en-US', 'en'],
  stored = null,
  seen = false,
  trace = null,
  ipapi = null,
  ipwho = null,
  ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/121 Safari/537.36',
  webdriver = false,
  defaultLocale = 'zh',
  geoBudgetMs = 20,
} = {}) {
  const replaced = [];
  const store = new Map();
  const session = new Map();
  if (stored) store.set('usdbond:lang', stored);
  if (seen) session.set('usdbond:gateway-seen', '1');

  const fail = () => Promise.reject(new Error('unavailable'));

  const fetchFake = (url) => {
    if (url === '/cdn-cgi/trace') {
      return trace ? Promise.resolve({ ok: true, text: () => Promise.resolve(`fl=1\nloc=${trace}\n`) }) : fail();
    }
    if (url.startsWith('https://ipapi.co/')) {
      return ipapi ? Promise.resolve({ ok: true, text: () => Promise.resolve(ipapi) }) : fail();
    }
    if (url.startsWith('https://ipwho.is/')) {
      return ipwho ? Promise.resolve({ ok: true, json: () => Promise.resolve({ country_code: ipwho }) }) : fail();
    }
    return fail();
  };

  // 缩短地理查询预算，测试不必真的等
  const code = CODE.replace(/var GEO_BUDGET_MS = \d+;/, `var GEO_BUDGET_MS = ${geoBudgetMs};`);

  const sandbox = {
    console,
    Promise,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    fetch: fetchFake,
    location: { search, replace: (u) => replaced.push(u) },
    navigator: { languages: langs, language: langs[0], userAgent: ua, webdriver },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
    },
    sessionStorage: {
      getItem: (k) => (session.has(k) ? session.get(k) : null),
      setItem: (k, v) => session.set(k, String(v)),
    },
    document: {
      documentElement: { getAttribute: (k) => (k === 'data-default-locale' ? defaultLocale : null) },
      readyState: 'complete',
      addEventListener: () => {},
      getElementById: () => null,
    },
  };

  vm.runInContext(code, vm.createContext(sandbox));

  // 等异步分流走完
  await new Promise((r) => setTimeout(r, 60));
  return { replaced, stored: store };
}

function expect(label, actual, want) {
  checks++;
  const a = JSON.stringify(actual);
  const w = JSON.stringify(want);
  if (a === w) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}\n      期望 ${w}\n      实际 ${a}`);
  }
}

const tests = [
  [
    'URL ?lang=en 优先于一切，并写入偏好',
    { search: '?lang=en', langs: ['zh-CN'], trace: 'CN' },
    (r) => [r.replaced, r.stored.get('usdbond:lang')],
    [['/en/'], 'en'],
  ],
  [
    '已存偏好优先于 IP',
    { stored: 'zh', trace: 'US', langs: ['en-US'] },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    'IP 归属地为中国 → 中文（即使浏览器语言是英文）',
    { trace: 'CN', langs: ['en-US', 'en'] },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    'IP 归属地为中国台湾 → 中文',
    { trace: 'TW', langs: ['en-US'] },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    'IP 归属地为美国 → 英文（即使浏览器语言是中文）',
    { trace: 'US', langs: ['zh-CN', 'zh'] },
    (r) => r.replaced,
    ['/en/'],
  ],
  [
    '无 Cloudflare trace 时回退到 ipapi.co',
    { ipapi: 'CN\n', langs: ['en-US'] },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    'ipapi 不可用时回退到 ipwho.is',
    { ipwho: 'JP', langs: ['zh-CN'] },
    (r) => r.replaced,
    ['/en/'],
  ],
  [
    '全部地理查询失败 → 回退浏览器语言（中文）',
    { langs: ['zh-Hans-CN', 'zh'] },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    '全部地理查询失败 + 浏览器语言为第三方语言 → 站点默认语言',
    { langs: ['fr-FR', 'fr'], defaultLocale: 'zh' },
    (r) => r.replaced,
    ['/zh/'],
  ],
  [
    'default-locale 为 en 时，第三方语言用户落到英文',
    { langs: ['de-DE'], defaultLocale: 'en' },
    (r) => r.replaced,
    ['/en/'],
  ],
  [
    '非法 ?lang 值被忽略',
    { search: '?lang=fr', langs: ['ja-JP'], trace: 'JP' },
    (r) => r.replaced,
    ['/en/'],
  ],
  [
    '爬虫不跳转（保留 x-default 网关）',
    { trace: 'US', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    (r) => r.replaced,
    [],
  ],
  [
    'AI 抓取器不跳转',
    { trace: 'US', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot' },
    (r) => r.replaced,
    [],
  ],
  [
    '无头浏览器（webdriver）不跳转',
    { trace: 'US', webdriver: true },
    (r) => r.replaced,
    [],
  ],
  [
    '同会话内二次访问网关不重复弹走',
    { seen: true, trace: 'US', langs: ['zh-CN'] },
    (r) => r.replaced,
    [],
  ],
];

console.log('语言网关分流测试\n');

for (const [label, opts, pick, want] of tests) {
  const result = await run(opts);
  expect(label, pick(result), want);
}

console.log(
  failures === 0
    ? `\n✓ 网关测试通过：${checks}/${checks}\n`
    : `\n✗ 网关测试失败：${checks} 项中 ${failures} 项未通过\n`,
);

process.exit(failures === 0 ? 0 : 1);
