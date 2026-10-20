import {
  ART_PAINTING_IDS,
  CHAPTERS,
  INDEX_TABS,
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
 * folio); content pages are numbered 1..N in reading order. */
const CONTENT_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'cover');

export const TOTAL_PAGES = CONTENT_CHAPTERS.length * 2;

/** The StPageFlip array index for a chapter's context (left) page. The
 * work (right) page is always the next index. The cover is index 0. */
export function pageIndexForChapter(id: ChapterId): number {
  if (id === 'cover') return 0;
  const i = CONTENT_CHAPTERS.findIndex((c) => c.id === id);
  return i < 0 ? 0 : 1 + i * 2;
}

export function chapterForPageIndex(pageIndex: number): ChapterDef {
  if (pageIndex <= 0) return CHAPTERS[0];
  const i = Math.min(Math.floor((pageIndex - 1) / 2), CONTENT_CHAPTERS.length - 1);
  return CONTENT_CHAPTERS[i];
}

/** The printed folio number for a chapter's context (left) page. */
export function contextFolio(chapter: ChapterDef): number {
  return pageIndexForChapter(chapter.id);
}

/** The printed folio number for a chapter's work (right) page — always
 * one more than its context page, never the same number on both. */
export function workFolio(chapter: ChapterDef): number {
  return pageIndexForChapter(chapter.id) + 1;
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
  return false;
}

export function allTabs(): TabDef[] {
  return INDEX_TABS;
}
