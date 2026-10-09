#!/usr/bin/env node
/**
 * 本地预览服务器。仅用于开发自检 —— 生产环境请用 GitHub Pages / Netlify /
 * Cloudflare Pages 等静态托管，它们会正确处理缓存头与目录索引。
 *
 *   node serve.mjs          # http://127.0.0.1:4173
 *   PORT=8080 node serve.mjs
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, 'dist');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolveTarget(urlPath) {
  // 解码并规范化，确保任何请求都落在 dist/ 内
  let rel;
  try {
    rel = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const abs = path.resolve(ROOT, '.' + path.posix.normalize(rel));
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null;

  try {
    const s = await stat(abs);
    if (s.isDirectory()) {
      const idx = path.join(abs, 'index.html');
      await stat(idx);
      return idx;
    }
    return abs;
  } catch {
    // 无扩展名的路径回退到 404 页面，便于直接打开 /zh/nope/ 预览效果
    if (!path.extname(abs)) {
      try {
        const f = path.join(ROOT, '404.html');
        await stat(f);
        return f;
      } catch {
        return null;
      }
    }
    return null;
  }
}

createServer(async (req, res) => {
  const target = await resolveTarget(req.url || '/');
  if (!target) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404');
    return;
  }

  const is404 = target.endsWith(`${path.sep}404.html`);
  const type = TYPES[path.extname(target)] || 'application/octet-stream';

  res.writeHead(is404 ? 404 : 200, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, HOST, () => {
  console.log(`\n  USDBOND 预览：http://${HOST}:${PORT}/\n  语言网关 → /zh/ 或 /en/\n`);
});
