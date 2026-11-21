// Genera un HTML completo por cada página (español e inglés) para GitHub Pages y Google.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const SITE = 'https://www.hoteltamalodge.com';
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
const today = new Date().toISOString().slice(0, 10);

for (const r of ssr.routes) {
  const html = template
    .replace('<html lang="es">', `<html lang="${r.lang}">`)
    .replace('<!--head-->', ssr.head(r.key, r.lang))
    .replace('<!--app-->', ssr.render(r.path));
  const out = path.join(dist, r.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (r.key === 'review') { console.log('✓', r.path, '(sin sitemap)'); continue; }
  const pair = ssr.routes.filter((x) => x.key === r.key);
  sitemap += `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n` +
    pair.map((p) => `    <xhtml:link rel="alternate" hreflang="${p.lang}" href="${SITE}${p.path}"/>\n`).join('') +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pair.find((p) => p.lang === 'es').path}"/>\n  </url>\n`;
  console.log('✓', r.path);
}
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap + '</urlset>\n');

// 404: GitHub Pages la muestra para direcciones que no existen
const notFound = fs.readFileSync(path.join(root, 'scripts', '404.html'), 'utf8');
fs.writeFileSync(path.join(dist, '404.html'), notFound);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Sitemap y 404 listos.');
