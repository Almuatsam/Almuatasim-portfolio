import type { ImgHTMLAttributes } from 'react';
import { imageEntry, variantUrl, type ImageFormat } from '../../lib/images';

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> & {
  /** The original's path as it was in public/ (for example "/art/choice.jpg"). */
  src: string;
  alt: string;
};

/** A sensible guess for full-width page images: the page width on a phone,
 * about one page of the book on a desktop. Thumbnails pass their own. */
const DEFAULT_SIZES = '(max-width: 899px) calc(100vw - 56px), 540px';
/** The width the plain <img> falls back to (browsers without AVIF or WebP). */
const FALLBACK_WIDTH = 800;

function srcSetFor(src: string, widths: number[], format: ImageFormat): string {
  return widths.map((width) => `${variantUrl(src, width, format)} ${width}w`).join(', ');
}

/** Serves an image as AVIF, then WebP, in several widths. Files the
 * pipeline does not know (an SVG, say) render as a plain <img>. */
export function Picture({ src, alt, sizes = DEFAULT_SIZES, ...rest }: PictureProps) {
  const entry = imageEntry(src);
  if (!entry) return <img src={src} alt={alt} {...rest} />;

  const fallbackWidth = entry.widths.find((width) => width >= FALLBACK_WIDTH) ?? entry.widths[entry.widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(src, entry.widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(src, entry.widths, 'webp')} sizes={sizes} />
      <img src={variantUrl(src, fallbackWidth, 'webp')} alt={alt} {...rest} />
    </picture>
  );
}
