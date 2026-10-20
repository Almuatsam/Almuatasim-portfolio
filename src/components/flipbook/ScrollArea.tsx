import { useEffect, useRef, useState, type ReactNode } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbars } from 'overlayscrollbars';
import Lenis from 'lenis';
import 'overlayscrollbars/overlayscrollbars.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useViewerOpen } from '../../hooks/useViewerOpen';
import { registerScrollReset, unregisterScrollReset } from '../../lib/scrollRegistry';
import { registerLenis, unregisterLenis } from '../../lib/lenisRafLoop';
import { createRevealController, type RevealController } from '../../lib/revealController';
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

/** Geometric check, not `elementFromPoint` — most images on these pages
 * are `pointer-events: none` (the page-flip.js click-exemption fix in
 * this file's own comment below), which makes `elementFromPoint` skip
 * straight past them to whatever's behind. A plain rect test still
 * catches them.
 *
 * Tests the whole fade band against each image's rect, not a single
 * sample point: the hint must only ever sit over bare paper, and a
 * point sample can miss an image that only partially spans the band's
 * width (an image narrower than the page, say) while the fade itself
 * — which spans the full width — still visibly overlaps it. */
function bandOverlapsImage(container: Element, bandTop: number, bandBottom: number, left: number, right: number): boolean {
  const media = container.querySelectorAll('img, picture, video, canvas');
  for (const el of media) {
    const rect = el.getBoundingClientRect();
    const overlapsVertically = rect.bottom > bandTop && rect.top < bandBottom;
    const overlapsHorizontally = rect.right > left && rect.left < right;
    if (overlapsVertically && overlapsHorizontally) return true;
  }
  return false;
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
  const revealRef = useRef<RevealController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [hints, setHints] = useState<HintState>(DEFAULT_HINTS);

  useEffect(
    () => () => {
      unregisterScrollReset(scrollKey);
      if (lenisRef.current) {
        unregisterLenis(lenisRef.current);
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (revealRef.current) {
        revealRef.current.dispose();
        revealRef.current = null;
      }
    },
    [scrollKey],
  );

  // Page Scrolling.md section 3 — StPageFlip (page-flip.js) attaches its
  // own native mousedown/touchstart listener to an ancestor of this node
  // (outside React), which fires during the native bubble phase before
  // the event ever reaches React's root-delegated listeners. A React
  // onMouseDown/onTouchStart prop here — even one calling
  // stopPropagation() — can't pre-empt that: React only runs its handler
  // once bubbling reaches the root, by which point page-flip.js's own
  // listener, sitting lower in the real DOM, has already fired. A plain
  // addEventListener on the actual node fires at the right point in that
  // native bubble, before it reaches page-flip.js's ancestor listener.
  //
  // This also covers a case page-flip.js's own click exemption
  // (`checkTarget`, matching only `<a>`/`<button>` tag names) misses:
  // any button or link here whose clickable area is filled by a plain
  // child element (an <img>, say) reports that child as `event.target`,
  // not the link/button itself, so the exemption doesn't apply and a
  // stray page-turn fires alongside the intended click.
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const stop = (event: Event) => event.stopPropagation();
    el.addEventListener('mousedown', stop);
    el.addEventListener('touchstart', stop);
    return () => {
      el.removeEventListener('mousedown', stop);
      el.removeEventListener('touchstart', stop);
    };
  }, []);

  function updateHints(instance: OverlayScrollbars): void {
    const { viewport, content } = instance.elements();
    const overflow = viewport.scrollHeight - viewport.clientHeight;
    const rect = viewport.getBoundingClientRect();
    setHints({
      isScrollable: overflow > EDGE_EPSILON,
      atTop: viewport.scrollTop <= EDGE_EPSILON,
      atBottom: viewport.scrollTop >= overflow - EDGE_EPSILON,
      topOverImage: bandOverlapsImage(content, rect.top, rect.top + FADE_BAND, rect.left, rect.right),
      bottomOverImage: bandOverlapsImage(content, rect.bottom - FADE_BAND, rect.bottom, rect.left, rect.right),
    });
  }

  function handleInitialized(instance: OverlayScrollbars): void {
    const { viewport, content } = instance.elements();
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', label);

    const reveal = createRevealController(viewport, content, prefersReducedMotion);
    revealRef.current = reveal;

    // The same moment the reader arrives at this page (chapter switch or
    // initial load) is exactly when BookFlipApp resets scroll position
    // via this registry — re-running the reveal pass here too means
    // content already in view on arrival shows immediately, and content
    // left mid-reveal from a previous visit settles instead of staying
    // stuck (see revealController.ts).
    registerScrollReset(scrollKey, () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else viewport.scrollTop = 0;
      reveal.run();
    });

    reveal.run();

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

  return (
    <div className="scroll-area" ref={scrollAreaRef}>
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

      {/* The hint must only ever sit over bare paper (owner review) — no
          hints at all while the viewer is open, and neither edge renders
          when its own band overlaps an image, full stop (no drop-shadow
          fallback shown over the image). */}
      {!viewerOpen && hints.isScrollable && !hints.atTop && !hints.topOverImage && (
        <div className="scroll-area__hint scroll-area__hint--top" aria-hidden="true" />
      )}
      {!viewerOpen && hints.isScrollable && !hints.atBottom && !hints.bottomOverImage && (
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
