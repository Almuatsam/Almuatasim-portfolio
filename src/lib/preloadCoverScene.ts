import { STICKER_LAYOUT } from '../content/coverLayout';
import { variantUrl, viewerSrc } from './images';

/** Warms the 3D cover scene's chunk and textures, so the cover closing
 * (which starts from the last chapter) does not wait on the network. */
export function preloadCoverScene(): void {
  void import('../components/book3d/CoverScene');
  const sources = [viewerSrc('/web-assets/paper-grain.png'), ...STICKER_LAYOUT.map(({ n }) => variantUrl(`/stickers/sticker-${n}.png`, 800, 'webp'))];
  sources.forEach((src) => {
    new Image().src = src;
  });
}
