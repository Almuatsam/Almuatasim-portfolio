import {
  ART_PAINTING_IDS,
  CHAPTERS,
  INDEX_TABS,
  ONSET_SPREAD_IDS,
  SCREENS_PROJECT_IDS,
  SEWING_SPREAD_IDS,
  getChapterByOrder,
  type ChapterDef,
  type ChapterId,
  type TabDef,
} from './chapters';
import type { AccentKey } from './accents';

/** Every chapter except the cover becomes two StPageFlip pages (context
 * = left, work = right). The cover is page index 0 (a hard page, no
 * folio); content pages are numbered 1..N in reading order.
 *
 * On phones the book shows one page at a time, and a chapter whose control
 * sits on one page and whose result sits on the other (see
 * ONE_PAGE_ON_PHONES) is a single page, so the reader never has to turn a
 * page to see what a control did. Page numbers follow the layout in use. */
const CONTENT_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'cover');

export const ONE_PAGE_ON_PHONES: readonly ChapterId[] = ['follow', 'showmade', 'process'];

let isPhoneLayout = false;

/** Called by the book before it renders, from the viewport width. */
export function setPhoneLayout(isPhone: boolean): void {
  isPhoneLayout = isPhone;
}

export function pagesInChapter(chapter: ChapterDef): 1 | 2 {
  return isPhoneLayout && ONE_PAGE_ON_PHONES.includes(chapter.id) ? 1 : 2;
}

export function totalPages(): number {
  return CONTENT_CHAPTERS.reduce((sum, c) => sum + pagesInChapter(c), 0);
}

/** The StPageFlip array index for a chapter's context (left) page. The
 * work (right) page, when there is one, is the next index. The cover is
 * index 0. */
export function pageIndexForChapter(id: ChapterId): number {
  if (id === 'cover') return 0;
  let index = 1;
  for (const chapter of CONTENT_CHAPTERS) {
    if (chapter.id === id) return index;
    index += pagesInChapter(chapter);
  }
  return 0;
}

export function chapterForPageIndex(pageIndex: number): ChapterDef {
  if (pageIndex <= 0) return CHAPTERS[0];
  let index = 1;
  for (const chapter of CONTENT_CHAPTERS) {
    index += pagesInChapter(chapter);
    if (pageIndex < index) return chapter;
  }
  return CONTENT_CHAPTERS[CONTENT_CHAPTERS.length - 1];
}

/** The printed folio number for a chapter's context (left) page. */
export function contextFolio(chapter: ChapterDef): number {
  return pageIndexForChapter(chapter.id);
}

/** The printed folio number for a chapter's work (right) page — always
 * one more than its context page, never the same number on both. */
export function workFolio(chapter: ChapterDef): number {
  return pageIndexForChapter(chapter.id) + pagesInChapter(chapter) - 1;
}

export function previousChapter(chapter: ChapterDef): ChapterDef | undefined {
  return getChapterByOrder(chapter.order - 1);
}

export function nextChapter(chapter: ChapterDef): ChapterDef | undefined {
  return getChapterByOrder(chapter.order + 1);
}

/** The SCREENS tab takes the accent of whichever project is currently
 * open; every other tab keeps its own fixed accent. */
export function tabAccent(tab: TabDef, current: ChapterDef): AccentKey {
  if (tab.chapterId === 'screens' && SCREENS_PROJECT_IDS.includes(current.id)) {
    const openProject = CHAPTERS.find((c) => c.id === current.id);
    if (openProject) return openProject.accent;
  }
  const tabChapter = CHAPTERS.find((c) => c.id === tab.chapterId);
  return tabChapter?.accent ?? 'indigo';
}

export function isTabActive(tab: TabDef, currentId: ChapterId): boolean {
  if (tab.chapterId === currentId) return true;
  if (tab.chapterId === 'screens') return SCREENS_PROJECT_IDS.includes(currentId);
  if (tab.chapterId === 'art') return ART_PAINTING_IDS.includes(currentId);
  if (tab.chapterId === 'sewing') return SEWING_SPREAD_IDS.includes(currentId);
  if (tab.chapterId === 'onset') return ONSET_SPREAD_IDS.includes(currentId);
  return false;
}

export function allTabs(): TabDef[] {
  return INDEX_TABS;
}
