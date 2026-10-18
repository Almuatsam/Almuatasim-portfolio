import { useCallback, useRef, useState } from 'react';
import { setViewerOpen } from '../lib/viewerOpenStore';
import { getLastPointerDownTarget } from '../lib/lastPointerTarget';

export interface ScreenViewer {
  openIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  setIndex: (index: number) => void;
}

function closestFocusable(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  return (el.closest('button, a[href], [tabindex]') as HTMLElement | null) ?? el;
}

/** Shared open/close/navigate state for FullscreenViewer, scoped to a
 * single project's screen count. Remembers whatever was clicked right
 * before opening (a thumbnail, usually) so close() can return focus to
 * it — tracked via pointerdown target rather than document.activeElement,
 * since pages with a framer-motion drag gesture (TracingPaperLift,
 * MergeTheScreens) suppress the browser's default click-to-focus action
 * while a drag is armed, which otherwise left activeElement on <body>. */
export function useScreenViewer(count: number): ScreenViewer {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((index: number) => {
    const target = closestFocusable(getLastPointerDownTarget());
    triggerRef.current = target ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setViewerOpen(true);
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setViewerOpen(false);
    // Delayed past the lightbox's own ~250ms exit-animation unmount,
    // which blurs to <body> when the focused node is removed from the
    // DOM if we call this synchronously.
    const trigger = triggerRef.current;
    triggerRef.current = null;
    window.setTimeout(() => trigger?.focus(), 350);
  }, []);

  const setIndex = useCallback(
    (index: number) => {
      setOpenIndex(((index % count) + count) % count);
    },
    [count],
  );

  return { openIndex, open, close, setIndex };
}
