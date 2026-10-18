import { useEffect, useRef, useState, type ReactNode } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbars } from 'overlayscrollbars';
import Lenis from 'lenis';
import 'overlayscrollbars/overlayscrollbars.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useViewerOpen } from '../../hooks/useViewerOpen';
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
  /** Full-screen viewer fix item 3 — the fade must only ever sit over
   * paper. True when the page's own content under the top/bottom edge
   * is an image, so that edge should show no fade (bottom keeps its
   * chevron + label; top just hides). */
  topOverImage: boolean;
  bottomOverImage: boolean;
}

const EDGE_EPSILON = 1;
const FADE_BAND = 16;
const DEFAULT_HINTS: HintState = {
  isScrollable: false,
  atTop: true,
  atBottom: true,
  topOverImage: false,
  bottomOverImage: false,
};

function isOverImage(x: number, y: number): boolean {
  const el = document.elementFromPoint(x, y);
  return el !== null && el.closest('img, picture, video, canvas') !== null;
}

/** Page Scrolling.md — the one scroll area each book page gets. Page
 * margins, the folio and any fixed header live outside this component
 * (see FlipPage); this wraps only the part that scrolls, with a thin
 * custom scrollbar (OverlayScrollbars) and gentle smooth scrolling
 * (Lenis) scoped to this page alone. */
export function ScrollArea({ children, scrollKey, label, hint }: ScrollAreaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewerOpen = useViewerOpen();
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
    const rect = viewport.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    setHints({
      isScrollable: overflow > EDGE_EPSILON,
      atTop: viewport.scrollTop <= EDGE_EPSILON,
      atBottom: viewport.scrollTop >= overflow - EDGE_EPSILON,
      topOverImage: isOverImage(x, rect.top + FADE_BAND),
      bottomOverImage: isOverImage(x, rect.bottom - FADE_BAND),
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

      {/* Full-screen viewer fix item 3 — no hints at all while the
          viewer is open; the fade never sits over an image. */}
      {!viewerOpen && hints.isScrollable && !hints.atTop && !hints.topOverImage && (
        <div className="scroll-area__hint scroll-area__hint--top" aria-hidden="true" />
      )}
      {!viewerOpen && hints.isScrollable && !hints.atBottom && (
        <div
          className={`scroll-area__hint scroll-area__hint--bottom${hints.bottomOverImage ? ' scroll-area__hint--bottom-no-fade' : ''}`}
          aria-hidden="true"
        >
          <svg className="scroll-area__hint-chevron" viewBox="0 0 10 7" aria-hidden="true">
            <path d="M1 1 L5 6 L9 1" fill="none" stroke="var(--accent-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="scroll-area__hint-label">{hint}</span>
        </div>
      )}
    </div>
  );
}
