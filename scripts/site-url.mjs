// The public address of the site, for the sitemap, robots.txt and the
// prerendered pages. It comes from VITE_SITE_URL (the environment, or an
// .env file), the same value the app is built with. A production build
// without it stops with a message instead of publishing a wrong address.
import { loadEnv } from 'vite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function siteUrl({ devFallback = false } = {}) {
  const value = process.env.VITE_SITE_URL || loadEnv('production', root, 'VITE_').VITE_SITE_URL;
  if (value) {
    new URL(value); // throws on a malformed address
    return value.replace(/\/$/, '');
  }
  if (devFallback) return 'http://localhost:5173';
  console.error('VITE_SITE_URL is not set. Set it to the public address (for example https://example.com) before building.');
  process.exit(1);
}
