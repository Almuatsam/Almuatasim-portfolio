import { useEffect, useRef, useState, type ReactNode } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useViewerOpen } from '../../hooks/useViewerOpen';
import {
  canScrollBy,
  registerScrollReset,
  registerViewport,
  setHoveredViewport,
  siblingViewport,
  unregisterScrollReset,
  unregisterViewport,
} from '../../lib/scrollRegistry';
import { createRevealController, type RevealController } from '../../lib/revealController';
import './scroll-area.css';

interface ScrollAreaProps {
  children: ReactNode;
  /** Unique id this page's scroll position is reset by (see
   * scrollRegistry), e.g. "estudioa-work". */
  scrollKey: string;
  /** Accessible name for the scroll region, e.g. "EstudioA, work". */
  label: string;
  /** Localised "Scroll" hint shown in the bottom margin. */
  hint: string;
}

interface HintState {
  isScrollable: boolean;
  atTop: boolean;
  atBottom: boolean;
}

const EDGE_EPSILON = 1;
const DEFAULT_HINTS: HintState = { isScrollable: false, atTop: true, atBottom: true };
const LINE_PX = 16;

/** The one scroll area each book page gets. It is the whole page rectangle
 * (the margins are padding inside it), so a two-finger scroll over any part of
 * the page scrolls it, and the browser does the scrolling itself. When this
 * page has nothing left to scroll that way, the wheel goes to the other page
 * of the spread. OverlayScrollbars only draws the thin thumb. */
export function ScrollArea({ children, scrollKey, label, hint }: ScrollAreaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewerOpen = useViewerOpen();
  const revealRef = useRef<RevealController | null>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [hints, setHints] = useState<HintState>(DEFAULT_HINTS);

  useEffect(
    () => () => {
      unregisterScrollReset(scrollKey);
      if (viewportRef.current) unregisterViewport(scrollKey, viewportRef.current);
      if (revealRef.current) {
        revealRef.current.dispose();
        revealRef.current = null;
      }
    },
    [scrollKey],
  );

  // StPageFlip (page-flip.js) attaches its own native mousedown/touchstart
  // listener to an ancestor of this node, which fires in the native bubble
  // phase before React's root-delegated listeners. A plain addEventListener
  // on this node fires first, so a press or drag inside the page never
  // starts a page turn. The wheel is handled here too: it never turns the
  // page, and when this page cannot scroll that way the other page of the
  // spread takes it.
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const stop = (event: Event) => event.stopPropagation();
    function handleWheel(event: WheelEvent): void {
      const viewport = viewportRef.current;
      if (!viewport || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const unit = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? viewport.clientHeight : 1;
      const delta = event.deltaY * unit;
      if (canScrollBy(viewport, delta)) return;
      const sibling = siblingViewport(scrollKey);
      if (sibling && canScrollBy(sibling, delta)) {
        event.preventDefault();
        sibling.scrollTop += delta;
      }
    }
    el.addEventListener('mousedown', stop);
    el.addEventListener('touchstart', stop);
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('mousedown', stop);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [scrollKey]);

  function updateHints(instance: OverlayScrollbars): void {
    const { viewport } = instance.elements();
    const overflow = viewport.scrollHeight - viewport.clientHeight;
    const next = {
      isScrollable: overflow > EDGE_EPSILON,
      atTop: viewport.scrollTop <= EDGE_EPSILON,
      atBottom: viewport.scrollTop >= overflow - EDGE_EPSILON,
    };
    setHints((previous) =>
      next.isScrollable === previous.isScrollable && next.atTop === previous.atTop && next.atBottom === previous.atBottom ? previous : next,
    );
  }

  function handleInitialized(instance: OverlayScrollbars): void {
    const { viewport, content } = instance.elements();
    viewportRef.current = viewport;
    viewport.tabIndex = 0;
    viewport.dataset.scrollKey = scrollKey;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', label);
    registerViewport(scrollKey, viewport);

    const reveal = createRevealController(viewport, content, prefersReducedMotion);
    revealRef.current = reveal;

    // The reader arriving at this page (chapter switch or initial load) is
    // when BookFlipApp resets the scroll position through this registry.
    registerScrollReset(scrollKey, () => {
      viewport.scrollTop = 0;
      reveal.run();
    });

    reveal.run();
    updateHints(instance);
  }

  return (
    <div
      className="scroll-area"
      ref={scrollAreaRef}
      onPointerEnter={() => viewportRef.current && setHoveredViewport(viewportRef.current)}
      onPointerLeave={() => setHoveredViewport(null)}
    >
      <OverlayScrollbarsComponent
        element="div"
        className="scroll-area__os"
        defer
        options={{
          overflow: { x: 'hidden', y: 'scroll' },
          scrollbars: { theme: 'os-theme-book', autoHide: 'leave', autoHideDelay: 1500 },
        }}
        events={{
          initialized: (instance) => handleInitialized(instance),
          updated: (instance) => updateHints(instance),
          scroll: (instance) => updateHints(instance),
        }}
      >
        {children}
      </OverlayScrollbarsComponent>

      {/* Hairlines at the clipping edges when there is more beyond them, and
          a hint row in the bottom margin: both sit outside the text. */}
      {!viewerOpen && hints.isScrollable && !hints.atTop && <div className="scroll-area__edge scroll-area__edge--top" aria-hidden="true" />}
      {!viewerOpen && hints.isScrollable && !hints.atBottom && (
        <>
          <div className="scroll-area__edge scroll-area__edge--bottom" aria-hidden="true" />
          <div className="scroll-area__hint" aria-hidden="true">
            <span className="scroll-area__hint-label">{hint}</span>
            <svg className="scroll-area__hint-chevron" viewBox="0 0 10 7" aria-hidden="true">
              <path d="M1 1 L5 6 L9 1" fill="none" stroke="var(--accent-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
