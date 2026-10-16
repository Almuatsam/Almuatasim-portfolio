import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chapterPath, type ChapterDef } from '../content/chapters';
import { nextChapter, previousChapter } from '../content/navigation';
import type { SupportedLang } from '../i18n';

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA']);

/** B2/B9 — left/right arrow keys turn pages. "Forward" is toward the end
 * of the book: ArrowRight in English, ArrowLeft in Arabic (mirrored). */
export function useChapterKeyboardNav(lang: SupportedLang, chapter: ChapterDef): void {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const target = event.target as HTMLElement | null;
      if (target && (EDITABLE_TAGS.has(target.tagName) || target.isContentEditable)) return;

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
