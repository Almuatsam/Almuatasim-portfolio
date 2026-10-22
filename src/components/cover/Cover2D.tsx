import { useTranslation } from 'react-i18next';
import { Sticker } from './Sticker';
import { STICKER_LAYOUT } from '../../content/coverLayout';
import './cover-page.css';

interface Cover2DProps {
  onOpen: () => void;
}

/** The closed cover, as a single StPageFlip hard page. Also the instant
 * 2D paint shown before the 3D scene's textures are ready, and the
 * permanent fallback under reduced motion / narrow widths / no WebGL. */
export function Cover2D({ onOpen }: Cover2DProps) {
  const { t } = useTranslation();
  const stickerAlts = t('cover.stickers', { returnObjects: true }) as string[];

  return (
    <div className="cover-page">
      <button type="button" className="cover-page__hit" onClick={onOpen} aria-label={t('common.openBook')} />

      <h1 className="cover-page__label">
        <span className="cover-page__name cover-page__name--latin ltr-fragment">{t('cover.nameLatin')}</span>
        <span className="cover-page__name cover-page__name--arabic">{t('cover.nameArabic')}</span>
      </h1>

      {STICKER_LAYOUT.map(({ n, x, y, w, r }) => (
        <Sticker
          key={n}
          src={`/stickers/sticker-${n}-480.webp`}
          alt={stickerAlts[n - 1] ?? ''}
          position={{ leftPct: x, topPct: y, widthPct: w, rotateDeg: r }}
          parallaxX={0}
          parallaxY={0}
          depth={1}
        />
      ))}

      <span className="cover-page__band" aria-hidden="true" />
    </div>
  );
}
