import { useEffect } from 'react';
import { canScrollBy, getHoveredViewport, siblingViewport } from '../lib/scrollRegistry';
import { getViewerOpenSnapshot } from '../lib/viewerOpenStore';

const OWN_KEYS =
  'input, textarea, select, video, audio, button, a[href], summary, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="spinbutton"], [role="listbox"], [role="menu"], [role="tablist"], [role="radiogroup"], [role="button"]';
const LINE = 60;
const PAGE_FRACTION = 0.9;

/** Space, Page Down, Page Up, Home, End and the up and down arrows scroll the
 * page under the pointer, without clicking it first. Left and Right keep
 * turning pages (useChapterKeyboardNav). Stands down for anything that uses
 * these keys itself, and for a focused scroll area (the browser scrolls it). */
export function useScrollKeys(isActive: boolean): void {
  useEffect(() => {
    if (!isActive) return;
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      if (getViewerOpenSnapshot()) return;
      const viewport = getHoveredViewport();
      if (!viewport) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target && (target === viewport || target.closest(OWN_KEYS))) return;

      const page = viewport.clientHeight * PAGE_FRACTION;
      let delta: number;
      switch (event.key) {
        case 'ArrowDown': delta = LINE; break;
        case 'ArrowUp': delta = -LINE; break;
        case 'PageDown': delta = page; break;
        case 'PageUp': delta = -page; break;
        case ' ': delta = event.shiftKey ? -page : page; break;
        case 'Home': delta = -viewport.scrollHeight; break;
        case 'End': delta = viewport.scrollHeight; break;
        default: return;
      }
      if (event.shiftKey && event.key !== ' ') return;

      const sibling = siblingViewport(viewport.dataset.scrollKey ?? '');
      const scroller = canScrollBy(viewport, delta) ? viewport : sibling && canScrollBy(sibling, delta) ? sibling : null;
      if (!scroller) return;
      event.preventDefault();
      scroller.scrollBy({ top: delta, behavior: 'auto' });
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
}
