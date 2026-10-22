#!/usr/bin/env node
// Favicon set from one of the owner's stamp stickers (sticker 1): an SVG,
// a 32px PNG and a 180px apple-touch icon, on the paper colour. Outputs are
// committed in public/, so this only needs to run when the sticker changes.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sticker = join(root, 'assets', 'images', 'stickers', 'sticker-1.png');
const publicDir = join(root, 'public');
const PAPER = { r: 247, g: 245, b: 239, alpha: 1 };

async function squareIcon(size, stickerWidth) {
  const stamp = await sharp(sticker).resize({ width: stickerWidth }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: stamp, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

writeFileSync(join(publicDir, 'favicon-32.png'), await squareIcon(32, 30));
writeFileSync(join(publicDir, 'apple-touch-icon.png'), await squareIcon(180, 160));

const stamp96 = await sharp(sticker).resize({ width: 96 }).png({ compressionLevel: 9 }).toBuffer();
const { height } = await sharp(stamp96).metadata();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96"><rect width="96" height="96" rx="14" fill="#f7f5ef"/><image href="data:image/png;base64,${stamp96.toString('base64')}" x="0" y="${(96 - height) / 2}" width="96" height="${height}"/></svg>\n`;
writeFileSync(join(publicDir, 'favicon.svg'), svg);
console.log('icons written');
