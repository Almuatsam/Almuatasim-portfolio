#!/usr/bin/env node
// Writes dist/en/plain/index.html and dist/ar/plain/index.html: the built
// index.html with the Plain Version's server-rendered markup and its own head
// tags in place. Runs after `vite build` and `vite build --ssr`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { siteUrl } from './site-url.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = siteUrl();
const template = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
const { renderPlain, routeHeads } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-ssr.js')).href);

const escape = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const setContent = (html, selector, value) => html.replace(new RegExp(`(<meta ${selector} content=")[^"]*(")`), `$1${escape(value)}$2`);

const alternatesFor = (slug) => {
  const path = (lang) => (slug ? `/${lang}/${slug}` : `/${lang}`);
  return [
    `<link rel="alternate" hreflang="en" href="${site}${path('en')}" />`,
    `<link rel="alternate" hreflang="ar" href="${site}${path('ar')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${site}${path('en')}" />`,
  ].join(`
    `);
};

/** The built index.html with one route's own head: language, title,
 * description, canonical, hreflang, Open Graph and Twitter tags. */
function pageFor(lang, slug, title, description, { html = '', dropPreload = false } = {}) {
  const url = `${site}/${lang}${slug ? `/${slug}` : ''}`;
  let page = template
    .replace('<html lang="en">', `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />
    ${alternatesFor(slug)}`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/<meta property="og:image:height"[^>]*>/, (tag) => `${tag}
    <meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : 'en_US'}" />`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (dropPreload) page = page.replace(/\s*<link rel="preload" as="image"[^>]*>/, '');
  for (const selector of ['name="description"', 'property="og:title"', 'property="og:description"', 'name="twitter:title"', 'name="twitter:description"']) {
    page = setContent(page, selector, selector.includes('title') ? title : description);
  }
  return page;
}

const write = (lang, slug, page) => {
  const dir = join(root, 'dist', lang, ...(slug ? [slug] : []));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page);
};

for (const lang of ['en', 'ar']) {
  const { html, title, description } = await renderPlain(lang);
  write(lang, 'plain', pageFor(lang, 'plain', title, description, { html, dropPreload: true }));
  for (const route of await routeHeads(lang)) write(lang, route.slug, pageFor(lang, route.slug, route.title, route.description));
}
console.log('prerendered /en/plain and /ar/plain, and the head of every book route');
