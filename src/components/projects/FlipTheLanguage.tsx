import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TFunction } from 'i18next';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './flip-the-language.css';

interface FlipTheLanguageProps {
  t: TFunction;
  screenshotSrc: string;
  screenshotAlt: string;
}

const COURT_COUNT = 6;

/** B5 #3, simplified (no separate Arabic screenshot exists yet, per B3
 * fallback rule) — toggling EN/ع flips the booking screenshot, fills a
 * random court with the sage accent ("smart allocation"), and the second
 * toggle stamps a QR code onto the page. */
export function FlipTheLanguage({ t, screenshotSrc, screenshotAlt }: FlipTheLanguageProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isAr, setIsAr] = useState(false);
  const [allocatedCourt, setAllocatedCourt] = useState<number | null>(null);
  const [stamped, setStamped] = useState(false);

  function toggle() {
    setIsAr((value) => !value);
    setAllocatedCourt(Math.floor(Math.random() * COURT_COUNT));
    setStamped(true);
  }

  return (
    <div className="flip-lang">
      <button type="button" className="flip-lang__toggle" onClick={toggle} aria-pressed={isAr}>
        <span className={isAr ? '' : 'flip-lang__active'}>{t('projects.padelaura.flip.label')}</span>
        <span className="flip-lang__divider">|</span>
        <span className={isAr ? 'flip-lang__active' : ''}>{t('projects.padelaura.flip.labelAr')}</span>
      </button>

      <div className="flip-lang__stage">
        <AnimatePresence mode="wait">
          <motion.img
            key={isAr ? 'ar' : 'en'}
            src={screenshotSrc}
            alt={screenshotAlt}
            className="flip-lang__screenshot"
            initial={prefersReducedMotion ? { opacity: 0 } : { rotateY: 90, opacity: 0.4 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { rotateY: -90, opacity: 0.4 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>

      <div className="flip-lang__courts" aria-hidden="true">
        {Array.from({ length: COURT_COUNT }).map((_, index) => (
          <div key={index} className={`flip-lang__court${allocatedCourt === index ? ' flip-lang__court--allocated' : ''}`} />
        ))}
      </div>
      {allocatedCourt !== null && (
        <p className="flip-lang__allocation-note font-hand reveal-fade">{t('projects.padelaura.flip.allocationNote')}</p>
      )}

      {stamped && (
        <motion.div
          className="flip-lang__stamp"
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.6, rotate: -18, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <QrGlyph />
        </motion.div>
      )}
    </div>
  );
}

function QrGlyph() {
  const cells = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1];
  return (
    <svg viewBox="0 0 40 40" className="flip-lang__qr">
      <rect x="0" y="0" width="40" height="40" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" />
      {cells.map((filled, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        return filled ? <rect key={index} x={4 + col * 8} y={4 + row * 8} width="7" height="7" fill="var(--color-ink)" /> : null;
      })}
    </svg>
  );
}
