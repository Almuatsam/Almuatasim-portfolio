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
  | 'painfulexperience'
  | 'choice'
  | 'guidance'
  | 'sewing'
  | 'sketches'
  | 'tie'
  | 'ruffle'
  | 'onset'
  | 'qalb'
  | 'follow'
  | 'showmade'
  | 'press'
  | 'amouage'
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
// Palette v2 — one ink per chapter: indigo bookends the book (cover
// through about, and the closing chapters); red links EstudioA and
// Sewing (the thread colour, on purpose); blue/yellow/cyan carry APOS,
// PadelAura and Papitoooo through Part One.
export const CHAPTERS: ChapterDef[] = [
  { id: 'cover', order: 0, slug: '', accent: 'indigo', built: true },
  { id: 'contents', order: 1, slug: 'contents', accent: 'indigo', built: true },
  { id: 'about', order: 2, slug: 'about', accent: 'indigo', built: true },
  { id: 'screens', order: 3, slug: 'screens', accent: 'indigo', built: true },
  { id: 'estudioa', order: 4, slug: 'estudioa', accent: 'red', built: true },
  { id: 'apos', order: 5, slug: 'apos', accent: 'blue', built: true },
  { id: 'padelaura', order: 6, slug: 'padelaura', accent: 'yellow', built: true },
  { id: 'papitoooo', order: 7, slug: 'papitoooo', accent: 'cyan', built: true },
  { id: 'byhand', order: 8, slug: 'by-hand', accent: 'indigo', built: true },
  // "art" is the Artworks index (mirrors "screens"); each painting is its
  // own spread (mirrors estudioa/apos/padelaura/papitoooo), in gallery order.
  { id: 'art', order: 9, slug: 'art', accent: 'yellow', built: true },
  { id: 'painfulexperience', order: 10, slug: 'painful-experience', accent: 'yellow', built: true },
  { id: 'choice', order: 11, slug: 'choice', accent: 'yellow', built: true },
  { id: 'guidance', order: 12, slug: 'guidance', accent: 'yellow', built: true },
  // "sewing" is the Sewing index (mirrors "art"/"screens"); its three
  // spreads follow the brief's own design -> make -> finish order.
  { id: 'sewing', order: 13, slug: 'sewing', accent: 'red', built: true },
  { id: 'sketches', order: 14, slug: 'sketches', accent: 'red', built: true },
  { id: 'tie', order: 15, slug: 'tie', accent: 'red', built: true },
  { id: 'ruffle', order: 16, slug: 'ruffle', accent: 'red', built: true },
  // "onset" is the On Set index (mirrors "sewing"/"art"); Qalb Mahmood
  // runs overview -> follow the piece -> show what I made -> in the
  // press (Phase 3 Kickoff.md #4), then Amouage closes the chapter.
  { id: 'onset', order: 17, slug: 'on-set', accent: 'cyan', built: true },
  { id: 'qalb', order: 18, slug: 'qalb-mahmood', accent: 'cyan', built: true },
  { id: 'follow', order: 19, slug: 'follow-the-piece', accent: 'cyan', built: true },
  { id: 'showmade', order: 20, slug: 'show-what-i-made', accent: 'cyan', built: false },
  { id: 'press', order: 21, slug: 'in-the-press', accent: 'cyan', built: false },
  { id: 'amouage', order: 22, slug: 'amouage', accent: 'cyan', built: false },
  { id: 'process', order: 23, slug: 'process', accent: 'indigo', built: false },
  { id: 'skills', order: 24, slug: 'skills', accent: 'indigo', built: false },
  { id: 'contact', order: 25, slug: 'contact', accent: 'indigo', built: false },
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
export const ART_PAINTING_IDS: ChapterId[] = ['painfulexperience', 'choice', 'guidance'];
export const SEWING_SPREAD_IDS: ChapterId[] = ['sketches', 'tie', 'ruffle'];
export const ONSET_SPREAD_IDS: ChapterId[] = ['qalb', 'follow', 'showmade', 'press', 'amouage'];
