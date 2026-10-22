import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import type { TFunction } from 'i18next';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './pull-the-strip.css';
import { Picture } from '../ui/Picture';

interface PullTheStripProps {
  t: TFunction;
  stripSrc: string;
  stripAlt: string;
}

const FRAME_THEMES = ['scallop', 'receipt', 'boarding-pass'] as const;

/** B5 #4, simplified — click the slot: a 3-2-1 countdown, a flash, then
 * the strip slides out developing from sepia to colour. Clicking again
 * cycles the frame theme. Always click-triggered here (no hover
 * autoplay), which also matches the mobile/reduced-motion rule in B5. */
export function PullTheStrip({ t, stripSrc, stripAlt }: PullTheStripProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'counting' | 'flash' | 'developed'>('idle');
  const [count, setCount] = useState(3);
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    if (phase !== 'counting') return;
    if (count === 0) {
      setPhase('flash');
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 400);
    return () => clearTimeout(id);
  }, [phase, count]);

  useEffect(() => {
    if (phase !== 'flash') return;
    const id = setTimeout(() => setPhase('developed'), 300);
    return () => clearTimeout(id);
  }, [phase]);

  function handleClick() {
    if (phase === 'idle') {
      if (prefersReducedMotion) {
        setPhase('developed');
        return;
      }
      setCount(3);
      setPhase('counting');
    } else if (phase === 'developed') {
      setThemeIndex((i) => (i + 1) % FRAME_THEMES.length);
    }
  }

  return (
    <div className="pull-strip">
      <button type="button" className="pull-strip__slot" onClick={handleClick}>
        {phase === 'idle' && <span className="pull-strip__hint font-hand">{t('projects.papitoooo.booth.label')}</span>}
        {phase === 'counting' && <span className="pull-strip__count">{count}</span>}
        {phase === 'flash' && <span className="pull-strip__flash" />}
      </button>

      {phase === 'developed' && (
        <m.figure
          className={`pull-strip__photo pull-strip__photo--${FRAME_THEMES[themeIndex]}`}
          initial={prefersReducedMotion ? { opacity: 1 } : { y: 40, opacity: 0, filter: 'sepia(1) saturate(0.4)' }}
          animate={{ y: 0, opacity: 1, filter: 'sepia(0) saturate(1)' }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Picture loading="lazy" decoding="async" src={stripSrc} alt={stripAlt} className="pull-strip__img" />
        </m.figure>
      )}

      <p className="pull-strip__note font-hand reveal-fade">{t('projects.papitoooo.booth.note')}</p>
    </div>
  );
}
