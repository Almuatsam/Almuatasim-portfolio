import { useLocation, useParams } from 'react-router-dom';
import { CHAPTERS, getChapter, getChapterBySlug, type ChapterDef } from '../content/chapters';
import { DEFAULT_LANG, isSupportedLang, type SupportedLang } from '../i18n';

interface CurrentChapter {
  lang: SupportedLang;
  chapter: ChapterDef;
}

/** Resolves the active language and chapter from the current route. Each
 * chapter is registered as its own static path segment (see App.tsx), so
 * the slug is read from the pathname rather than a ":slug" param. Falls
 * back to English / Contents for an unmatched path so the shell never
 * renders with an undefined chapter. */
export function useCurrentChapter(): CurrentChapter {
  const params = useParams<{ lang: string }>();
  const location = useLocation();
  const lang: SupportedLang = isSupportedLang(params.lang) ? params.lang : DEFAULT_LANG;

  const [, , slug] = location.pathname.split('/');
  const chapter = slug ? (getChapterBySlug(slug) ?? getChapter('contents')) : getChapter('cover');

  return { lang, chapter };
}

export function allChapters(): ChapterDef[] {
  return CHAPTERS;
}
