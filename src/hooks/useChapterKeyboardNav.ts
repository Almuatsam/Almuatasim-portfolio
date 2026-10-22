import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chapterPath, type ChapterDef } from '../content/chapters';
import { nextChapter, previousChapter } from '../content/navigation';
import { getViewerOpenSnapshot } from '../lib/viewerOpenStore';
import type { SupportedLang } from '../i18n';

/** Elements that use Left/Right themselves: text fields, sliders (the
 * Follow the piece needle), video and audio controls. */
const OWN_ARROW_KEYS =
  'input, textarea, select, video, audio, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="spinbutton"], [role="listbox"], [role="menu"], [role="menubar"], [role="tablist"], [role="radiogroup"]';

/** True when `target` sits inside something that can still scroll
 * sideways in the pressed direction (a horizontally scrolling area). */
function canScrollSideways(target: HTMLElement, toRight: boolean): boolean {
  for (let el: HTMLElement | null = target; el; el = el.parentElement) {
    const style = getComputedStyle(el);
    const scrollsX = style.overflowX === 'auto' || style.overflowX === 'scroll';
    const max = el.scrollWidth - el.clientWidth;
    if (!scrollsX || max <= 1) continue;
    const isRtl = style.direction === 'rtl';
    const atLeftEnd = isRtl ? el.scrollLeft <= -max + 1 : el.scrollLeft <= 0;
    const atRightEnd = isRtl ? el.scrollLeft >= 0 : el.scrollLeft >= max - 1;
    if (toRight ? !atRightEnd : !atLeftEnd) return true;
  }
  return false;
}

/** B2/B9 — left/right arrow keys turn pages. "Forward" is toward the end
 * of the book: ArrowRight in English, ArrowLeft in Arabic (mirrored).
 * Wired once, at the book level. It stands down for anything that uses
 * the arrows itself (see OWN_ARROW_KEYS), for a scroll area that can
 * still scroll that way, while the full-screen viewer is open, and on
 * the cover (which opens with its own button). */
export function useChapterKeyboardNav(lang: SupportedLang, chapter: ChapterDef): void {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.defaultPrevented || event.isComposing) return;
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (chapter.id === 'cover' || getViewerOpenSnapshot()) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target) {
        if (target.closest(OWN_ARROW_KEYS)) return;
        if (canScrollSideways(target, event.key === 'ArrowRight')) return;
      }

      const isRtl = lang === 'ar';
      const wantsForward = event.key === 'ArrowRight' ? !isRtl : isRtl;
      const destination = wantsForward ? nextChapter(chapter) : previousChapter(chapter);
      if (!destination) return;

      event.preventDefault();
      navigate(chapterPath(lang, destination.id));
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lang, chapter, navigate]);
}
