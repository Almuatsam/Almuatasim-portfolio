import { useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sticker } from './Sticker';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { chapterPath } from '../../content/chapters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './cover.css';

// A1 — cover-relative x, y, width as percentages of the cover's own box,
// rotation in degrees, transform-origin: top left (checked layout).
const STICKER_LAYOUT = [
  { n: 1, x: 3.7, y: 2.8, w: 32.6, r: -7 },
  { n: 3, x: 42.2, y: 1.7, w: 27.8, r: 5 },
  { n: 6, x: 72.2, y: 4.7, w: 24.4, r: -4 },
  { n: 4, x: 2.2, y: 31.4, w: 14.4, r: -5 },
  { n: 5, x: 5.6, y: 56.9, w: 35.2, r: 4 },
  { n: 7, x: 44.4, y: 55.6, w: 37.0, r: -6 },
  { n: 2, x: 20.4, y: 79.2, w: 32.4, r: -9 },
] as const;

export function Cover() {
  const { t } = useTranslation();
  const { lang } = useCurrentChapter();
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const stickerAlts = t('cover.stickers', { returnObjects: true }) as string[];

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
    const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
    setParallax({ x: nx * 8, y: ny * 8 });
  }

  function openBook() {
    if (isOpening) return;
    if (prefersReducedMotion) {
      navigate(chapterPath(lang, 'contents'));
      return;
    }
    setIsOpening(true);
  }

  const flipTarget = lang === 'ar' ? 180 : -180;

  return (
    <div className="cover-stage">
      <motion.div
        className="cover"
        style={{ perspective: 2000 }}
        onPointerMove={handlePointerMove}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotateY: isOpening ? flipTarget : 0 }}
        transition={{
          scale: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
          rotateY: { duration: 1, ease: [0.65, 0, 0.35, 1] },
        }}
        onAnimationComplete={() => {
          if (isOpening) navigate(chapterPath(lang, 'contents'));
        }}
      >
        <div className="cover__panel" style={{ transformStyle: 'preserve-3d' }}>
          <button type="button" className="cover__hit" onClick={openBook} aria-label={t('common.openBook')} />

          <h1 className="cover__label">
            <span className="cover__name cover__name--latin ltr-fragment">{t('cover.nameLatin')}</span>
            <span className="cover__name cover__name--arabic">{t('cover.nameArabic')}</span>
          </h1>

          {STICKER_LAYOUT.map(({ n, x, y, w, r }) => (
            <Sticker
              key={n}
              src={`/stickers/sticker-${n}.png`}
              alt={stickerAlts[n - 1] ?? ''}
              position={{
                leftPct: x,
                topPct: y,
                widthPct: w,
                rotateDeg: r,
              }}
              parallaxX={parallax.x}
              parallaxY={parallax.y}
              depth={1 + (n % 3) * 0.2}
            />
          ))}

          <span className="cover__band" aria-hidden="true" />
        </div>
      </motion.div>
      <p className="cover__hint font-hand">{t('cover.openHint')}</p>
    </div>
  );
}
