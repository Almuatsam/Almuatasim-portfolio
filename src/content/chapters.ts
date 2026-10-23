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
  | 'fashionweek'
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
}

// B3 — chapter order follows the colour story: introduction, Part One,
// Part Two, then the closing chapters.
// Palette v2 — one ink per chapter: indigo bookends the book (cover
// through about, and the closing chapters); red links EstudioA and
// Sewing (the thread colour, on purpose); blue/yellow/cyan carry APOS,
// PadelAura and Papitoooo through Part One.
export const CHAPTERS: ChapterDef[] = [
  { id: 'cover', order: 0, slug: '', accent: 'indigo' },
  { id: 'contents', order: 1, slug: 'contents', accent: 'indigo' },
  { id: 'about', order: 2, slug: 'about', accent: 'indigo' },
  { id: 'screens', order: 3, slug: 'screens', accent: 'indigo' },
  { id: 'estudioa', order: 4, slug: 'estudioa', accent: 'red' },
  { id: 'apos', order: 5, slug: 'apos', accent: 'blue' },
  { id: 'padelaura', order: 6, slug: 'padelaura', accent: 'yellow' },
  { id: 'papitoooo', order: 7, slug: 'papitoooo', accent: 'cyan' },
  { id: 'byhand', order: 8, slug: 'by-hand', accent: 'indigo' },
  // "art" is the Artworks index (mirrors "screens"); each painting is its
  // own spread (mirrors estudioa/apos/padelaura/papitoooo), in gallery order.
  { id: 'art', order: 9, slug: 'art', accent: 'yellow' },
  { id: 'painfulexperience', order: 10, slug: 'painful-experience', accent: 'yellow' },
  { id: 'choice', order: 11, slug: 'choice', accent: 'yellow' },
  { id: 'guidance', order: 12, slug: 'guidance', accent: 'yellow' },
  // "sewing" is the Sewing index (mirrors "art"/"screens"); its three
  // spreads follow the brief's own design -> make -> finish order.
  { id: 'sewing', order: 13, slug: 'sewing', accent: 'red' },
  { id: 'sketches', order: 14, slug: 'sketches', accent: 'red' },
  { id: 'fashionweek', order: 15, slug: 'muscat-fashion-week', accent: 'red' },
  { id: 'tie', order: 16, slug: 'tie', accent: 'red' },
  { id: 'ruffle', order: 17, slug: 'ruffle', accent: 'red' },
  // "onset" is the On Set index (mirrors "sewing"/"art"); Qalb Mahmood
  // runs overview -> follow the piece -> show what I made -> in the
  // press (Phase 3 Kickoff.md #4), then Amouage closes the chapter.
  { id: 'onset', order: 18, slug: 'on-set', accent: 'cyan' },
  { id: 'qalb', order: 19, slug: 'qalb-mahmood', accent: 'cyan' },
  { id: 'follow', order: 20, slug: 'follow-the-piece', accent: 'cyan' },
  { id: 'showmade', order: 21, slug: 'show-what-i-made', accent: 'cyan' },
  { id: 'press', order: 22, slug: 'in-the-press', accent: 'cyan' },
  { id: 'amouage', order: 23, slug: 'amouage', accent: 'cyan' },
  { id: 'process', order: 24, slug: 'process', accent: 'indigo' },
  { id: 'skills', order: 25, slug: 'skills', accent: 'indigo' },
  { id: 'contact', order: 26, slug: 'contact', accent: 'indigo' },
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
export const SEWING_SPREAD_IDS: ChapterId[] = ['sketches', 'fashionweek', 'tie', 'ruffle'];
export const ONSET_SPREAD_IDS: ChapterId[] = ['qalb', 'follow', 'showmade', 'press', 'amouage'];
