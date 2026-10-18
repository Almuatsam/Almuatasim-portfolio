const SELECTOR = '.reveal-word, .reveal-fade, .reveal-fade-slow, .reveal-sketch';
const PENDING = 'reveal-pending';
const IN = 'reveal-in';

/** How long below-fold content may stay pending before it's forced
 * visible regardless of the IntersectionObserver or scroll state — the
 * guarantee that text is never permanently dependent on an animation
 * actually firing. */
const SAFETY_NET_MS = 1500;

export interface RevealController {
  /** Re-run the reveal pass over the current content, e.g. when the
   * reader arrives back at this page (see ScrollArea, which calls this
   * from the same registry entry that resets scroll position). Safe to
   * call repeatedly: elements already revealed are left alone. */
  run: () => void;
  dispose: () => void;
}

/** Owns the reveal-on-arrive / reveal-on-scroll behaviour for one page's
 * scroll area. `viewport` is the actual scrolling element (so the
 * IntersectionObserver root matches the real clipping box — an
 * OverlayScrollbars viewport, not `window`); `content` is searched for
 * `.reveal-*` elements. CSS default is always visible (see reveal.css),
 * so a page with reducedMotion on, or one this controller never runs
 * for, is simply readable with no animation. */
export function createRevealController(viewport: HTMLElement, content: HTMLElement, reducedMotion: boolean): RevealController {
  let observer: IntersectionObserver | null = null;
  let safetyTimer: ReturnType<typeof window.setTimeout> | null = null;

  function clearTimers(): void {
    if (safetyTimer !== null) {
      window.clearTimeout(safetyTimer);
      safetyTimer = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function reveal(el: Element): void {
    el.classList.remove(PENDING);
    el.classList.add(IN);
  }

  function run(): void {
    clearTimers();

    const elements = Array.from(content.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => !el.classList.contains(IN));
    if (elements.length === 0) return;

    if (reducedMotion) {
      // No reveal at all: never pending, stays at reveal.css's default
      // opacity: 1 (also enforced again by its own reduced-motion rule).
      elements.forEach((el) => el.classList.remove(PENDING));
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const pending: HTMLElement[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > viewportRect.top && rect.top < viewportRect.bottom;
      if (inView) {
        // Already visible the moment the page arrives: leave it at the
        // CSS default rather than animating, so there's no flash from
        // the animation's own "from" keyframe before its bake-in delay.
        el.classList.remove(PENDING);
      } else {
        el.classList.add(PENDING);
        pending.push(el);
      }
    });

    if (pending.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer?.unobserve(entry.target);
            }
          });
        },
        { root: viewport, rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
      );
      pending.forEach((el) => observer!.observe(el));

      safetyTimer = window.setTimeout(() => {
        // Snap straight to visible (no classList.add(IN)): this is a
        // last-resort guarantee, not a cue to start an animation this
        // late.
        pending.forEach((el) => el.classList.remove(PENDING));
        clearTimers();
      }, SAFETY_NET_MS);
    }
  }

  return { run, dispose: clearTimers };
}
