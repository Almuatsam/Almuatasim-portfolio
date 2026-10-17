import { CanvasTexture, SRGBColorSpace } from 'three';

const NAME_LATIN = 'Almuatasim Alfarsi';
const NAME_ARABIC = 'المعتصم الفارسي';

/** Renders the bilingual name label once into a canvas texture (2x
 * resolution) so the type stays crisp on the 3D cover's paper plane. */
export function drawNameLabelTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);

  ctx.fillStyle = '#fcf8f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2e2a26';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '600 72px Fraunces, Georgia, serif';
  ctx.fillText(NAME_LATIN, canvas.width / 2, canvas.height * 0.38);

  ctx.font = '48px "Noto Naskh Arabic", serif';
  ctx.fillText(NAME_ARABIC, canvas.width / 2, canvas.height * 0.72);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** A soft radial shadow blob, used under the 3D cover in place of a real
 * contact-shadow pass (kept simple and orientation-safe). */
export function drawShadowBlobTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new CanvasTexture(canvas);

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(46,42,38,0.38)');
  gradient.addColorStop(0.6, 'rgba(46,42,38,0.18)');
  gradient.addColorStop(1, 'rgba(46,42,38,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
