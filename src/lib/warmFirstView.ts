import { getChapterBySlug } from '../content/chapters';
import { preloadChapter } from '../routes/chapterContent';

/** Starts the downloads the first view will need in parallel with the main
 * script, instead of one after another as React reaches each lazy part:
 * the page-turn engine, the scroll area and the opened chapter's code. */
export function warmFirstView(): void {
  const [, , slug = ''] = window.location.pathname.split('/');
  const chapter = getChapterBySlug(slug);
  // The cover needs none of this until the book is opened.
  if (!chapter) return;
  void import('react-pageflip');
  void import('../components/flipbook/ScrollArea');
  preloadChapter(chapter.id);
}
