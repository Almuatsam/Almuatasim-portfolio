import { CanvasTexture, SRGBColorSpace } from 'three';

const NAME_LATIN = 'Almuatasim Alfarsi';
const NAME_ARABIC = 'المعتصم الفارسي';

// 3x resolution relative to the label's on-screen size at a 1160px-wide
// spread, so the type stays crisp under any reasonable viewport/DPR.
const CANVAS_W = 1536;
const CANVAS_H = 660;

/** Renders the bilingual name label once into a canvas texture, waiting
 * for fonts to be ready so it never falls back to a system serif. Sizes
 * and colours match the 2D cover's label exactly (Soria for the Latin
 * name, the Arabic name 1.1x larger per the brief's Arabic type scale).
 * Display Font - Soria.md step 8 — explicitly requests Soria (and the
 * Arabic partner) rather than only awaiting `fonts.ready`, since ready
 * only covers fonts some other element has already requested — nothing
 * else on the cover page necessarily has, this early. */
export async function drawNameLabelTexture(): Promise<CanvasTexture> {
  if (typeof document !== 'undefined' && document.fonts) {
    await Promise.all([
      document.fonts.load('400 64px Soria'),
      document.fonts.load('700 64px Amiri'),
      document.fonts.ready,
    ]).catch(() => {});
  }

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);

  ctx.fillStyle = '#f7f5ef';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#16142b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // The canvas maps 1:1 onto the label plane (LABEL_LAYOUT's own box),
  // so sizes are relative to CANVAS_W/H, not the whole cover — matching
  // the 2D cover's ~34px Soria name (--fs-title) in a ~344px-wide label
  // (ratio ~0.099). Soria's thin, regular-only strokes read smaller and
  // lighter than the bold Arabic line at the same font-size, so the
  // Latin start size is bumped well past the old ~22px/0.064 ratio to
  // land at about the same visual weight.
  const maxTextWidth = canvas.width * 0.86;

  function fittedSize(text: string, font: (px: number) => string, startPx: number): number {
    let px = startPx;
    ctx!.font = font(px);
    while (ctx!.measureText(text).width > maxTextWidth && px > 20) {
      px -= 2;
      ctx!.font = font(px);
    }
    return px;
  }

  const latinFont = (px: number) => `400 ${px}px Soria, Fraunces, Georgia, serif`;
  const arabicFont = (px: number) => `700 ${px}px Amiri, "Noto Naskh Arabic", serif`;

  const latinSize = fittedSize(NAME_LATIN, latinFont, Math.round(CANVAS_W * 0.099));
  const arabicSize = fittedSize(NAME_ARABIC, arabicFont, Math.round(latinSize * 1.1));

  ctx.font = latinFont(latinSize);
  ctx.fillText(NAME_LATIN, canvas.width / 2, canvas.height * 0.38);

  ctx.font = arabicFont(arabicSize);
  ctx.fillText(NAME_ARABIC, canvas.width / 2, canvas.height * 0.74);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** A soft shadow, drawn with a wide fully-transparent margin so the
 * plane it's mapped onto (only slightly larger than the book) never
 * shows a visible edge. */
export function drawShadowBlobTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 180);
  gradient.addColorStop(0, 'rgba(22,20,43,0.4)');
  gradient.addColorStop(0.55, 'rgba(22,20,43,0.16)');
  gradient.addColorStop(1, 'rgba(22,20,43,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
