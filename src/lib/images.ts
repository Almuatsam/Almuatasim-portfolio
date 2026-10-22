import manifest from '../generated/images.json';

export interface ImageEntry {
  w: number;
  h: number;
  widths: number[];
}

const IMAGES = manifest as Record<string, ImageEntry>;

export type ImageFormat = 'avif' | 'webp';

export function imageEntry(src: string): ImageEntry | undefined {
  return IMAGES[src];
}

/** The generated copy of `src` at `width` (see scripts/build-images.mjs). */
export function variantUrl(src: string, width: number, format: ImageFormat): string {
  const dot = src.lastIndexOf('.');
  return `/img${src.slice(0, dot)}-${width}.${format}`;
}

/** What the full-screen viewer opens: the largest copy, up to 1600px wide. */
export function viewerSrc(src: string): string {
  const entry = imageEntry(src);
  if (!entry) return src;
  return variantUrl(src, entry.widths[entry.widths.length - 1], 'webp');
}
