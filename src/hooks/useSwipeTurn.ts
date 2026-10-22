import { useEffect, type RefObject } from 'react';
import { getViewerOpenSnapshot } from '../lib/viewerOpenStore';

/** Things that use a horizontal drag themselves: sliders, text fields,
 * video, and anything marked `data-no-swipe` (the draggable demos). */
const OWN_DRAG = 'input, textarea, select, video, [role="slider"], [data-no-swipe]';

const MIN_DISTANCE_PX = 48;
const HORIZONTAL_BIAS = 1.6;

/** Mobile page turns (Mobile Pass.md): a swipe turns the page, in the
 * reading direction (left in English, right in Arabic); a mostly
 * vertical gesture is always a scroll and never turns anything. */
export function useSwipeTurn(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  isRtl: boolean,
  onStep: (direction: 1 | -1) => void,
): void {
  useEffect(() => {
    const element = ref.current;
    if (!isActive || !element) return;

    let start: { x: number; y: number } | null = null;

    function handleStart(event: TouchEvent): void {
      const target = event.target instanceof Element ? event.target : null;
      if (event.touches.length !== 1 || target?.closest(OWN_DRAG) || getViewerOpenSnapshot()) {
        start = null;
        return;
      }
      start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    function handleEnd(event: TouchEvent): void {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      start = null;
      if (Math.abs(dx) < MIN_DISTANCE_PX || Math.abs(dx) < Math.abs(dy) * HORIZONTAL_BIAS) return;
      const isForward = isRtl ? dx > 0 : dx < 0;
      onStep(isForward ? 1 : -1);
    }

    // Capture phase: a page's scroll area stops touchstart from bubbling
    // (see ScrollArea), so the swipe has to see it on the way down.
    element.addEventListener('touchstart', handleStart, { passive: true, capture: true });
    element.addEventListener('touchend', handleEnd, { passive: true, capture: true });
    return () => {
      element.removeEventListener('touchstart', handleStart, { capture: true });
      element.removeEventListener('touchend', handleEnd, { capture: true });
    };
  }, [ref, isActive, isRtl, onStep]);
}
