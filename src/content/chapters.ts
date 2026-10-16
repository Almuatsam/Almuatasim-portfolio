import type { AccentKey } from './accents';

export type ChapterId =
  | 'cover'
  | 'contents'
  | 'about'
  | 'screens'
  | 'estudioa'
  | 'apos'
  | 'padelaura'
  | 'papitoooo'
  | 'byhand'
  | 'art'
  | 'sewing'
  | 'onset'
  | 'process'
  | 'skills'
  | 'contact';

export type TabMaterial = 'paper' | 'fabric';

export interface ChapterDef {
  id: ChapterId;
  order: number;
  slug: string;
  accent: AccentKey;
  /** Chapters that already have a built page in this phase. */
  built: boolean;
}

// B3 — chapter order follows the colour story: introduction, Part One,
// Part Two, then the closing chapters.
export const CHAPTERS: ChapterDef[] = [
  { id: 'cover', order: 0, slug: '', accent: 'terracotta', built: true },
  { id: 'contents', order: 1, slug: 'contents', accent: 'terracotta', built: true },
  { id: 'about', order: 2, slug: 'about', accent: 'terracotta', built: true },
  { id: 'screens', order: 3, slug: 'screens', accent: 'terracotta', built: false },
  { id: 'estudioa', order: 4, slug: 'estudioa', accent: 'clay', built: false },
  { id: 'apos', order: 5, slug: 'apos', accent: 'ochre', built: false },
  { id: 'padelaura', order: 6, slug: 'padelaura', accent: 'sage', built: false },
  { id: 'papitoooo', order: 7, slug: 'papitoooo', accent: 'coral', built: false },
  { id: 'byhand', order: 8, slug: 'by-hand', accent: 'terracotta', built: false },
  { id: 'art', order: 9, slug: 'art', accent: 'plum', built: false },
  { id: 'sewing', order: 10, slug: 'sewing', accent: 'clay', built: false },
  { id: 'onset', order: 11, slug: 'on-set', accent: 'walnut', built: false },
  { id: 'process', order: 12, slug: 'process', accent: 'terracotta', built: false },
  { id: 'skills', order: 13, slug: 'skills', accent: 'terracotta', built: false },
  { id: 'contact', order: 14, slug: 'contact', accent: 'terracotta', built: false },
];

export const TOTAL_CHAPTERS = CHAPTERS.length;

export function getChapter(id: ChapterId): ChapterDef {
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) throw new Error(`Unknown chapter id: ${id}`);
  return chapter;
}

export function getChapterByOrder(order: number): ChapterDef | undefined {
  return CHAPTERS.find((c) => c.order === order);
}

export function getChapterBySlug(slug: string): ChapterDef | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chapterPath(lang: string, id: ChapterId): string {
  const chapter = getChapter(id);
  return chapter.slug ? `/${lang}/${chapter.slug}` : `/${lang}`;
}

// B2 — the 8 tabs that stick out of the book's outer edge. "screens" takes
// the accent of whichever project is currently open (resolved at render
// time), so it carries no fixed accent here.
export interface TabDef {
  chapterId: ChapterId;
  material: TabMaterial;
}

export const INDEX_TABS: TabDef[] = [
  { chapterId: 'about', material: 'paper' },
  { chapterId: 'screens', material: 'paper' },
  { chapterId: 'art', material: 'fabric' },
  { chapterId: 'sewing', material: 'fabric' },
  { chapterId: 'onset', material: 'fabric' },
  { chapterId: 'process', material: 'paper' },
  { chapterId: 'skills', material: 'paper' },
  { chapterId: 'contact', material: 'paper' },
];

export const SCREENS_PROJECT_IDS: ChapterId[] = ['estudioa', 'apos', 'padelaura', 'papitoooo'];
export const BYHAND_CHAPTER_IDS: ChapterId[] = ['art', 'sewing', 'onset'];
