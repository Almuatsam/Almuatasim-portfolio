import { useEffect, useRef, useState, type ReactNode } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbars } from 'overlayscrollbars';
import Lenis from 'lenis';
import 'overlayscrollbars/overlayscrollbars.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { registerScrollReset, unregisterScrollReset } from '../../lib/scrollRegistry';
import { registerLenis, unregisterLenis } from '../../lib/lenisRafLoop';
import './scroll-area.css';

interface ScrollAreaProps {
  children: ReactNode;
  /** Unique id this page's scroll position is reset by (see
   * scrollRegistry) — e.g. "estudioa-work". */
  scrollKey: string;
  /** Accessible name for the scroll region, e.g. "EstudioA, work". */
  label: string;
  /** Localised "Scroll" hint shown at the bottom fade. */
  hint: string;
}

interface HintState {
  isScrollable: boolean;
  atTop: boolean;
  atBottom: boolean;
}

const EDGE_EPSILON = 1;
const DEFAULT_HINTS: HintState = { isScrollable: false, atTop: true, atBottom: true };

/** Page Scrolling.md — the one scroll area each book page gets. Page
 * margins, the folio and any fixed header live outside this component
 * (see FlipPage); this wraps only the part that scrolls, with a thin
 * custom scrollbar (OverlayScrollbars) and gentle smooth scrolling
 * (Lenis) scoped to this page alone. */
export function ScrollArea({ children, scrollKey, label, hint }: ScrollAreaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [hints, setHints] = useState<HintState>(DEFAULT_HINTS);

  useEffect(
    () => () => {
      unregisterScrollReset(scrollKey);
      if (lenisRef.current) {
        unregisterLenis(lenisRef.current);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    },
    [scrollKey],
  );

  function updateHints(instance: OverlayScrollbars): void {
    const { viewport } = instance.elements();
    const overflow = viewport.scrollHeight - viewport.clientHeight;
    setHints({
      isScrollable: overflow > EDGE_EPSILON,
      atTop: viewport.scrollTop <= EDGE_EPSILON,
      atBottom: viewport.scrollTop >= overflow - EDGE_EPSILON,
    });
  }

  function handleInitialized(instance: OverlayScrollbars): void {
    const { viewport, content } = instance.elements();
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', label);

    registerScrollReset(scrollKey, () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else viewport.scrollTop = 0;
    });

    if (!prefersReducedMotion) {
      const lenis = new Lenis({
        wrapper: viewport,
        content,
        eventsTarget: viewport,
        lerp: 0.1,
        overscroll: false,
      });
      lenisRef.current = lenis;
      registerLenis(lenis);
    }

    updateHints(instance);
  }

  // Page Scrolling.md section 3 — StPageFlip starts a page-flip drag
  // from a `mousedown`/`touchstart` it catches on its own page element.
  // Stopping those two events here, before they bubble that far, means
  // a drag or swipe that starts inside the scroll area only scrolls —
  // native wheel/touch scrolling and element drags (framer-motion, which
  // binds its own listener directly on the dragged node) are untouched.
  function stopForPageFlip(event: { stopPropagation: () => void }): void {
    event.stopPropagation();
  }

  return (
    <div className="scroll-area" onMouseDown={stopForPageFlip} onTouchStart={stopForPageFlip}>
      <OverlayScrollbarsComponent
        element="div"
        className="scroll-area__os"
        defer
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { theme: 'os-theme-book', autoHide: 'move', autoHideDelay: 1200 },
        }}
        events={{
          initialized: (instance) => handleInitialized(instance),
          updated: (instance) => updateHints(instance),
          scroll: (instance) => updateHints(instance),
        }}
      >
        {children}
      </OverlayScrollbarsComponent>

      {hints.isScrollable && !hints.atTop && <div className="scroll-area__hint scroll-area__hint--top" aria-hidden="true" />}
      {hints.isScrollable && !hints.atBottom && (
        <div className="scroll-area__hint scroll-area__hint--bottom" aria-hidden="true">
          <svg className="scroll-area__hint-chevron" viewBox="0 0 10 7" aria-hidden="true">
            <path d="M1 1 L5 6 L9 1" fill="none" stroke="var(--accent-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="scroll-area__hint-label">{hint}</span>
        </div>
      )}
    </div>
  );
}
