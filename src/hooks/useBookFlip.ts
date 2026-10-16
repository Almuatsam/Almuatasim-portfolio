import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import type { ChapterDef } from '../content/chapters';
import type { SupportedLang } from '../i18n';

interface Settled {
  lang: SupportedLang;
  chapter: ChapterDef;
}

export type Flip = { kind: 'chapter'; direction: 'forward' | 'back' } | { kind: 'language' };

interface BookFlip {
  /** The pre-flip snapshot — the front face during a transition, and the
   * only state that matters once nothing is animating. */
  displayed: Settled;
  flip: Flip | null;
  rotateY: MotionValue<number>;
  shadowOpacity: MotionValue<number>;
  scale: MotionValue<number>;
}

const CHAPTER_DURATION = 1; // seconds — B6: page turns 900-1200ms
const LANGUAGE_DURATION = 0.9;
const EASE_PAGE = [0.65, 0, 0.35, 1] as const;

/** Orchestrates the two signature transitions: the chapter page-turn
 * (B6 part 2, direction-aware) and the language flip (B3, book closes
 * ~30% then flips around its vertical axis). Both animate the same
 * rotateY motion value; the caller renders a front face (`displayed`)
 * and a back face (the live route chapter/lang) as a 3D flip card.
 * Reduced motion settles instantly with no rotation. */
export function useBookFlip(routeLang: SupportedLang, routeChapter: ChapterDef): BookFlip {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState<Settled>({ lang: routeLang, chapter: routeChapter });
  const [flip, setFlip] = useState<Flip | null>(null);
  const rotateY = useMotionValue(0);
  const flipKindRef = useRef<Flip['kind'] | null>(null);
  const shadowOpacity = useTransform(rotateY, (v) => Math.sin((Math.abs(v) / 180) * Math.PI) * 0.45);
  // B3 — the language flip closes the book ~30% before it turns; the
  // chapter page-turn (B6) does not scale, only curls.
  const scale = useTransform(rotateY, (v) => {
    const peak = flipKindRef.current === 'language' ? 0.3 : 0;
    return 1 - Math.sin((Math.abs(v) / 180) * Math.PI) * peak;
  });

  useEffect(() => {
    if (flip) return;

    const chapterChanged = routeChapter.id !== displayed.chapter.id;
    const langChanged = routeLang !== displayed.lang;
    if (!chapterChanged && !langChanged) return;

    const target: Settled = { lang: routeLang, chapter: routeChapter };

    if (prefersReducedMotion) {
      setDisplayed(target);
      return;
    }

    if (chapterChanged) {
      const direction: 'forward' | 'back' = routeChapter.order > displayed.chapter.order ? 'forward' : 'back';
      const isRtl = routeLang === 'ar';
      const forwardDeg = isRtl ? 180 : -180;
      const deg = direction === 'forward' ? forwardDeg : -forwardDeg;

      flipKindRef.current = 'chapter';
      setFlip({ kind: 'chapter', direction });
      rotateY.set(0);
      animate(rotateY, deg, {
        duration: CHAPTER_DURATION,
        ease: EASE_PAGE,
        onComplete: () => {
          setDisplayed(target);
          rotateY.set(0);
          setFlip(null);
        },
      });
    } else {
      flipKindRef.current = 'language';
      setFlip({ kind: 'language' });
      rotateY.set(0);
      animate(rotateY, 180, {
        duration: LANGUAGE_DURATION,
        ease: EASE_PAGE,
        onComplete: () => {
          setDisplayed(target);
          rotateY.set(0);
          setFlip(null);
        },
      });
    }
  }, [routeChapter, routeLang, displayed, flip, prefersReducedMotion, rotateY]);

  return { displayed, flip, rotateY, shadowOpacity, scale };
}
