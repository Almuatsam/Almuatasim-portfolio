#!/usr/bin/env node
// sitemap.xml: every chapter route in both languages (plus the Plain Version),
// each with hreflang alternates, and robots.txt pointing at it. The domain
// comes from VITE_SITE_URL (see src/config/site.ts).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = (process.env.VITE_SITE_URL ?? readSiteDefault()).replace(/\/$/, '');

function readSiteDefault() {
  const source = readFileSync(join(root, 'src', 'config', 'site.ts'), 'utf8');
  return source.match(/\?\? '([^']+)'/)[1];
}

const chapters = readFileSync(join(root, 'src', 'content', 'chapters.ts'), 'utf8');
const slugs = [...chapters.matchAll(/\{ id: '\w+', order: \d+, slug: '([^']*)'/g)].map((match) => match[1]);
slugs.push('plain');

const path = (lang, slug) => (slug ? `/${lang}/${slug}` : `/${lang}`);
const entry = (lang, slug) => `  <url>
    <loc>${site}${path(lang, slug)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${site}${path('en', slug)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${site}${path('ar', slug)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${path('en', slug)}"/>
  </url>`;

const body = slugs.flatMap((slug) => ['en', 'ar'].map((lang) => entry(lang, slug))).join('\n');
writeFileSync(
  join(root, 'public', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`,
);
writeFileSync(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap: ${slugs.length * 2} urls for ${site}`);
