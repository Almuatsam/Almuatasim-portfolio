#!/usr/bin/env node
// Writes dist/en/plain/index.html and dist/ar/plain/index.html: the built
// index.html with the Plain Version's server-rendered markup and its own head
// tags in place. Runs after `vite build` and `vite build --ssr`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteDefault = readFileSync(join(root, 'src', 'config', 'site.ts'), 'utf8').match(/\?\? '([^']+)'/)[1];
const site = (process.env.VITE_SITE_URL ?? siteDefault).replace(/\/$/, '');
const template = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
const { renderPlain } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-ssr.js')).href);

const escape = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const setContent = (html, selector, value) => html.replace(new RegExp(`(<meta ${selector} content=")[^"]*(")`), `$1${escape(value)}$2`);

const alternates = [
  `<link rel="alternate" hreflang="en" href="${site}/en/plain" />`,
  `<link rel="alternate" hreflang="ar" href="${site}/ar/plain" />`,
  `<link rel="alternate" hreflang="x-default" href="${site}/en/plain" />`,
].join('\n    ');

for (const lang of ['en', 'ar']) {
  const { html, title, description } = await renderPlain(lang);
  const url = `${site}/${lang}/plain`;
  let page = template
    .replace('<html lang="en">', `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />\n    ${alternates}`)
    .replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/<meta property="og:image:height"[^>]*>/, (tag) => `${tag}\n    <meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : 'en_US'}" />`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  for (const selector of ['name="description"', 'property="og:title"', 'property="og:description"', 'name="twitter:title"', 'name="twitter:description"']) {
    page = setContent(page, selector, selector.includes('title') ? title : description);
  }
  const dir = join(root, 'dist', lang, 'plain');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page);
}
console.log('prerendered /en/plain and /ar/plain');
