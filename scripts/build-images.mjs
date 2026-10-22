#!/usr/bin/env node
// Image pipeline. Reads the full-size originals in assets/images and writes
// AVIF and WebP copies at 480, 800, 1200 and 1600px wide (never wider than the
// original) into public/img, plus src/generated/images.json, the list the
// <Picture> component reads to build its srcset. Runs before dev and build;
// outputs newer than their source are skipped, so repeat runs are quick.
import { mkdirSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'assets', 'images');
const outDir = join(root, 'public', 'img');
const manifestPath = join(root, 'src', 'generated', 'images.json');

const WIDTHS = [480, 800, 1200, 1600];
const AVIF = { quality: 52, effort: 4 };
const WEBP = { quality: 78, effort: 5 };

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (['.jpg', '.jpeg', '.png'].includes(extname(entry.name).toLowerCase())) yield full;
  }
}

function widthsFor(originalWidth) {
  const set = new Set(WIDTHS.filter((w) => w < originalWidth));
  set.add(Math.min(originalWidth, WIDTHS[WIDTHS.length - 1]));
  return [...set].sort((a, b) => a - b);
}

const isFresh = (target, sourceMtime) => existsSync(target) && statSync(target).mtimeMs >= sourceMtime;

const manifest = {};
let written = 0;

for (const file of walk(sourceDir)) {
  const logical = '/' + relative(sourceDir, file).split(sep).join('/');
  const stem = logical.slice(0, logical.length - extname(logical).length);
  const sourceMtime = statSync(file).mtimeMs;
  const meta = await sharp(file).metadata();
  const widths = widthsFor(meta.width);
  manifest[logical] = { w: meta.width, h: meta.height, widths };

  for (const width of widths) {
    for (const [format, options] of [['avif', AVIF], ['webp', WEBP]]) {
      const target = join(outDir, `${stem}-${width}.${format}`);
      if (isFresh(target, sourceMtime)) continue;
      mkdirSync(dirname(target), { recursive: true });
      await sharp(file).resize({ width, withoutEnlargement: true })[format](options).toFile(target);
      written += 1;
    }
  }
}

mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
console.log(`images: ${Object.keys(manifest).length} sources, ${written} files written`);
