import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { previousChapter, nextChapter } from '../content/navigation';
import type { ChapterDef } from '../content/chapters';
import type { SupportedLang } from '../i18n';

interface Settled {
  lang: SupportedLang;
  chapter: ChapterDef;
}

export type ChapterFlip = { kind: 'chapter'; direction: 'forward' | 'back'; to: ChapterDef };
export type LanguageFlip = { kind: 'language' };
export type Flip = ChapterFlip | LanguageFlip;

interface QueuedStep {
  chapter: ChapterDef;
  direction: 'forward' | 'back';
}

interface BookFlip {
  /** The pre-flip snapshot — the front face/static pages during a
   * transition, and the only state that matters once nothing is animating. */
  displayed: Settled;
  flip: Flip | null;
  rotateY: MotionValue<number>;
  shadowOpacity: MotionValue<number>;
  scale: MotionValue<number>;
  /** 0 -> 1 -> 0 across the turn, peaking at rotateY=90deg. Drives the
   * leaf's spine-shading and its subtle paper curl. */
  leafShade: MotionValue<number>;
  leafCurl: MotionValue<number>;
}

const CHAPTER_DURATION = 1; // seconds — B6: single-leaf turn, 1000ms
const QUICK_LEAF_DURATION = 0.38; // seconds — B6: quick leaves for multi-chapter jumps
const LANGUAGE_DURATION = 0.9;
const EASE_PAGE = [0.65, 0, 0.35, 1] as const;
const MAX_QUICK_LEAVES = 3;

function chapterPathBetween(from: ChapterDef, to: ChapterDef, direction: 'forward' | 'back'): ChapterDef[] {
  const step = direction === 'forward' ? nextChapter : previousChapter;
  const path: ChapterDef[] = [];
  let cursor = from;
  while (cursor.id !== to.id) {
    const next = step(cursor);
    if (!next) break;
    path.push(next);
    cursor = next;
  }
  return path;
}

/** B6 — a jump of several chapters at once turns 2-3 quick leaves instead
 * of one long flip; intermediate stops are sampled evenly along the real
 * chapter order so the pages flicked through are real, not placeholders. */
function sampleStops(path: ChapterDef[]): ChapterDef[] {
  if (path.length <= MAX_QUICK_LEAVES) return path;
  const stops: ChapterDef[] = [];
  for (let i = 1; i <= MAX_QUICK_LEAVES; i += 1) {
    const index = Math.min(Math.round((path.length * i) / MAX_QUICK_LEAVES) - 1, path.length - 1);
    stops.push(path[index]);
  }
  return stops;
}

/** Orchestrates the two signature transitions: the chapter page-turn
 * (B6 part 2 — a single leaf hinged at the spine, the book itself stays
 * flat) and the language flip (B3 — the whole book closes ~30% then flips
 * around its vertical axis). Both animate the same rotateY motion value;
 * reduced motion settles instantly with no rotation. */
export function useBookFlip(routeLang: SupportedLang, routeChapter: ChapterDef): BookFlip {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState<Settled>({ lang: routeLang, chapter: routeChapter });
  const [flip, setFlip] = useState<Flip | null>(null);
  const rotateY = useMotionValue(0);
  const flipKindRef = useRef<Flip['kind'] | null>(null);
  const queueRef = useRef<QueuedStep[]>([]);
  const batchIsMultiRef = useRef(false);
  const langRef = useRef(routeLang);
  langRef.current = routeLang;

  const shadowOpacity = useTransform(rotateY, (v) => Math.sin((Math.abs(v) / 180) * Math.PI) * 0.45);
  // B3 — the language flip closes the book ~30% before it turns; the
  // chapter page-turn (B6) does not scale the book at all, only the leaf.
  const scale = useTransform(rotateY, (v) => {
    const peak = flipKindRef.current === 'language' ? 0.3 : 0;
    return 1 - Math.sin((Math.abs(v) / 180) * Math.PI) * peak;
  });
  const leafShade = useTransform(rotateY, (v) => Math.sin((Math.abs(v) / 180) * Math.PI));
  const leafCurl = useTransform(rotateY, (v) => Math.sin((Math.abs(v) / 180) * Math.PI) * 2);

  function runNextLeaf() {
    const step = queueRef.current.shift();
    if (!step) {
      setFlip(null);
      rotateY.set(0);
      return;
    }

    const duration = batchIsMultiRef.current ? QUICK_LEAF_DURATION : CHAPTER_DURATION;
    const isRtl = langRef.current === 'ar';
    const forwardDeg = isRtl ? 180 : -180;
    const deg = step.direction === 'forward' ? forwardDeg : -forwardDeg;

    flipKindRef.current = 'chapter';
    setFlip({ kind: 'chapter', direction: step.direction, to: step.chapter });
    rotateY.set(0);
    animate(rotateY, deg, {
      duration,
      ease: EASE_PAGE,
      onComplete: () => {
        setDisplayed({ lang: langRef.current, chapter: step.chapter });
        rotateY.set(0);
        runNextLeaf();
      },
    });
  }

  useEffect(() => {
    if (flip || queueRef.current.length > 0) return; // a turn is already in flight

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
      const path = chapterPathBetween(displayed.chapter, routeChapter, direction);
      const stops = sampleStops(path.length > 0 ? path : [routeChapter]);
      queueRef.current = stops.map((chapter) => ({ chapter, direction }));
      batchIsMultiRef.current = stops.length > 1;
      runNextLeaf();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeChapter, routeLang, displayed, flip, prefersReducedMotion, rotateY]);

  return { displayed, flip, rotateY, shadowOpacity, scale, leafShade, leafCurl };
}
