/**
 * 语言网关。
 *
 * 分流优先级：URL 参数 → 用户显式选择 → IP 归属地 → 浏览器语言 → 站点默认值。
 *
 * 为什么 IP 排在浏览器语言前面：一位在中国、但浏览器语言设为英文的用户，按浏览器
 * 语言会被送去 /en/，而他大概率想要中文。IP 反映"人在哪里"，浏览器语言反映"系统
 * 怎么装的"——对内容站来说前者更接近真实意图。
 *
 * 同步部分在 <head> 中以阻塞脚本执行，因此命中 URL 参数或已存偏好时不会闪屏；
 * 只有需要查 IP 时才落到网关页面上等一会儿，而页面本身就是品牌化的过渡态。
 *
 * 隐私：默认只查同源的 /cdn-cgi/trace（Cloudflare 提供，零第三方请求）。
 * 非 Cloudflare 托管时才回落到第三方 IP 接口，可用 ALLOW_THIRD_PARTY_GEO 关闭。
 */
(function () {
  'use strict';

  var LOCALES = ['zh', 'en'];
  /** IP 归属地属于以下地区时选中文，其余选英文。 */
  var ZH_REGIONS = ['CN', 'TW', 'HK', 'MO'];
  /** 是否允许在非 Cloudflare 环境下调用第三方 IP 接口（会把访客 IP 暴露给该服务）。 */
  var ALLOW_THIRD_PARTY_GEO = true;
  /** 地理查询总时间预算，超时即用浏览器语言兜底。 */
  var GEO_BUDGET_MS = 1200;

  var STORE_KEY = 'usdbond:lang';
  var SEEN_KEY = 'usdbond:gateway-seen';

  var DEFAULT_LOCALE = document.documentElement.getAttribute('data-default-locale') || 'zh';
  var CRAWLER =
    /bot|crawl|spider|slurp|bingpreview|googlebot|baiduspider|yandex|duckduck|facebookexternalhit|twitterbot|linkedinbot|applebot|petalibot|semrush|ahrefs|gptbot|oai-searchbot|claudebot|perplexitybot|ccbot|bytespider|amazonbot|meta-externalagent|python-requests|curl|wget|axios|node-fetch|go-http-client/i;

  /* ----------------------------------------------------------- 小工具 */

  function readPref() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      return LOCALES.indexOf(v) >= 0 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function savePref(locale) {
    try {
      localStorage.setItem(STORE_KEY, locale);
    } catch (e) {
      /* 隐私模式下静默失败 */
    }
  }

  function sessionSeen() {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch (e) {
      /* 忽略 */
    }
  }

  /** 跳转到目标语言；成功返回 true。 */
  function go(locale) {
    if (LOCALES.indexOf(locale) < 0) return false;
    location.replace('/' + locale + '/');
    return true;
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function setHint(text, hide) {
    ready(function () {
      var el = document.getElementById('geo-hint');
      if (!el) return;
      if (hide) el.hidden = true;
      else if (text) el.textContent = text;
    });
  }

  function fromBrowserLanguage() {
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var tag = String(langs[i] || '').toLowerCase();
      if (tag.indexOf('zh') === 0) return 'zh';
      if (tag.indexOf('en') === 0) return 'en';
    }
    return DEFAULT_LOCALE;
  }

  function localeForRegion(code) {
    if (!code) return null;
    return ZH_REGIONS.indexOf(String(code).toUpperCase()) >= 0 ? 'zh' : 'en';
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) {
          done = true;
          reject(new Error('timeout'));
        }
      }, ms);
      promise.then(
        function (v) {
          if (done) return;
          done = true;
          clearTimeout(timer);
          resolve(v);
        },
        function (e) {
          if (done) return;
          done = true;
          clearTimeout(timer);
          reject(e);
        },
      );
    });
  }

  /* ------------------------------------------------------ IP 归属地查询 */

  /** 同源查询：Cloudflare 托管的站点走这条路，零第三方请求。 */
  function viaSameOriginTrace() {
    return fetch('/cdn-cgi/trace', { cache: 'no-store', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('no trace');
        return r.text();
      })
      .then(function (text) {
        var m = /^loc=([A-Z]{2})$/m.exec(text);
        if (!m || m[1] === 'XX' || m[1] === 'T1') throw new Error('no loc');
        return m[1];
      });
  }

  function viaIpApiCo() {
    return fetch('https://ipapi.co/country/', { cache: 'no-store', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('ipapi failed');
        return r.text();
      })
      .then(function (t) {
        var code = t.trim();
        if (!/^[A-Za-z]{2}$/.test(code)) throw new Error('bad country');
        return code.toUpperCase();
      });
  }

  function viaIpWhoIs() {
    return fetch('https://ipwho.is/?fields=country_code', { cache: 'no-store', credentials: 'omit' })
      .then(function (r) {
        if (!r.ok) throw new Error('ipwho failed');
        return r.json();
      })
      .then(function (j) {
        if (!j || !j.country_code) throw new Error('no country_code');
        return String(j.country_code).toUpperCase();
      });
  }

  function detectRegion() {
    var chain = ALLOW_THIRD_PARTY_GEO
      ? [viaSameOriginTrace, viaIpApiCo, viaIpWhoIs]
      : [viaSameOriginTrace];

    return chain.reduce(function (p, fn) {
      return p.catch(function () {
        return fn();
      });
    }, Promise.reject(new Error('start'))).catch(function () {
      return null;
    });
  }

  /* --------------------------------------------------------- 同步阶段 */

  var forced = new URLSearchParams(location.search).get('lang');
  if (forced && LOCALES.indexOf(forced) >= 0) {
    savePref(forced);
    markSeen();
    if (go(forced)) return;
  }

  var pref = readPref();
  if (pref) {
    markSeen();
    if (go(pref)) return;
  }

  /* --------------------------------------------------------- 异步阶段 */

  // 爬虫留在网关上：网关本身是可索引的双语入口，也是 hreflang x-default 的目标。
  // 让爬虫按 IP 跳转只会让不同爬虫看到不同语言，稀释 hreflang 信号。
  var isCrawler = CRAWLER.test(navigator.userAgent || '') || navigator.webdriver === true;

  // 同一会话内已经自动跳过一次，说明用户是主动回到网关的，不要再把他弹走。
  if (isCrawler || sessionSeen()) {
    setHint(null, true);
    return;
  }

  setHint('正在根据您的位置选择语言… / Selecting your language…');

  withTimeout(detectRegion(), GEO_BUDGET_MS)
    .then(function (region) {
      return localeForRegion(region) || fromBrowserLanguage();
    })
    .catch(function () {
      return fromBrowserLanguage();
    })
    .then(function (locale) {
      markSeen();
      if (!go(locale)) setHint(null, true);
    });
})();
