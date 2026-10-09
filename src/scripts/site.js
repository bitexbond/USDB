/**
 * 全站唯一的客户端脚本，约 1KB。
 *
 * 只做一件事：记住用户显式点击过的语言，让下一次访问语言网关时直接命中，
 * 不再按 IP 猜。语言切换本身是普通 <a href>，禁用 JS 也完全可用。
 */
(function () {
  'use strict';

  var KEY = 'usdbond:lang';

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-lang]') : null;
    if (!a) return;
    try {
      localStorage.setItem(KEY, a.getAttribute('data-lang'));
    } catch (err) {
      /* 隐私模式下静默失败，链接照常跳转 */
    }
  });
})();
