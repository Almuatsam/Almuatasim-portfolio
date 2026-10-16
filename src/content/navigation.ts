import {
  CHAPTERS,
  INDEX_TABS,
  SCREENS_PROJECT_IDS,
  getChapterByOrder,
  type ChapterDef,
  type ChapterId,
  type TabDef,
} from './chapters';
import type { AccentKey } from './accents';

export const TOTAL_SPREADS = CHAPTERS.length;

export function folioFor(chapter: ChapterDef): { current: number; total: number } {
  return { current: chapter.order + 1, total: TOTAL_SPREADS };
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
  return tabChapter?.accent ?? 'terracotta';
}

export function isTabActive(tab: TabDef, currentId: ChapterId): boolean {
  if (tab.chapterId === currentId) return true;
  if (tab.chapterId === 'screens') return SCREENS_PROJECT_IDS.includes(currentId);
  return false;
}

export function allTabs(): TabDef[] {
  return INDEX_TABS;
}
