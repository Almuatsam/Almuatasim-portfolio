import type { ChapterId } from './chapters';

export type ShowPhotoId = 'bedroom' | 'daybed' | 'final';
export type MakingOfId = 'bedspread' | 'blanket' | 'fan' | 'flat';

/** Making-of photos opened from a label (photo map: 10 sewing the
 * bedspread, 8 the bedspread tested on a bed, 11 the fan painted blue,
 * 7 the blanket laid flat). */
export const MAKING_OF: { id: MakingOfId; src: string }[] = [
  { id: 'bedspread', src: '/on-set/qalb-mahmood-10-work.jpg' },
  { id: 'blanket', src: '/on-set/qalb-mahmood-8-work.jpg' },
  { id: 'fan', src: '/on-set/qalb-mahmood-11-work.jpg' },
  { id: 'flat', src: '/on-set/qalb-mahmood-7-work.jpg' },
];

type Point = [number, number];

export type OutlineAction =
  | { kind: 'photo'; makingOf: MakingOfId }
  | { kind: 'chapter'; chapter: ChapterId }
  /** No making-of photo exists (the walls): the label just lights up
   * its outline. */
  | { kind: 'highlight' };

export interface Outline {
  id: string;
  /** Closed polygons, as percentages of the photo's width (x) and
   * height (y). Physical coordinates: they never mirror in Arabic. */
  shapes: Point[][];
  /** Where the label chip is anchored, as physical percentages of the
   * photo. `align` says which edge of the chip sits on that point. */
  label: { left: number; top: number; align: 'start' | 'center' | 'end'; maxWidth?: number };
  action: OutlineAction;
}

export interface ShowPhoto {
  id: ShowPhotoId;
  src: string;
  width: number;
  height: number;
  outlines: Outline[];
}

/** B5 #8. NEVER add an outline or label for the chained pink heart in
 * the bedroom set: a fellow designer made it, not the owner. The
 * outlines below are drawn clear of it (the yellow blanket is the part
 * to its left, the bedspread starts at its right edge). */
export const SHOW_PHOTOS: ShowPhoto[] = [
  {
    id: 'bedroom',
    src: '/on-set/qalb-mahmood-3-set.jpg',
    width: 1800,
    height: 1350,
    outlines: [
      {
        id: 'bedspread',
        shapes: [
          [[49.8, 63.4], [57, 62.3], [63, 66], [65.8, 69.5], [65.9, 77.4], [57.5, 79.2], [50.5, 80.2], [49.4, 70.5]],
        ],
        label: { left: 61, top: 92, align: 'end' },
        action: { kind: 'photo', makingOf: 'bedspread' },
      },
      {
        id: 'yellowBlanket',
        shapes: [[[33.4, 63.2], [40.6, 62.6], [40.2, 68.6], [37.5, 70], [34.2, 67.8]]],
        label: { left: 2, top: 64, align: 'start', maxWidth: 30 },
        action: { kind: 'photo', makingOf: 'blanket' },
      },
      {
        id: 'fan',
        shapes: [
          [[62.6, 56], [63.6, 52], [66.6, 50.3], [70.2, 52.4], [71.2, 57.4], [70, 63.4], [67.5, 66.4], [67.3, 80], [70.9, 81.6], [70.6, 85.2], [66, 85.8], [62.4, 84], [62.3, 81.6], [65.8, 79.8], [66, 66.4], [63.5, 63.4]],
        ],
        label: { left: 98, top: 73, align: 'end', maxWidth: 29 },
        action: { kind: 'photo', makingOf: 'fan' },
      },
      {
        id: 'walls',
        shapes: [
          [[2.5, 9], [57.4, 19.4], [57.4, 53], [2.5, 53]],
          [[58.6, 19.8], [89.5, 2.2], [89.5, 47.5], [58.6, 47.5]],
        ],
        label: { left: 4, top: 27, align: 'start' },
        action: { kind: 'highlight' },
      },
    ],
  },
  {
    id: 'daybed',
    src: '/on-set/qalb-mahmood-15-set.jpg',
    width: 1800,
    height: 1350,
    outlines: [
      {
        id: 'daybedCover',
        shapes: [
          [[19.8, 65], [23, 59.2], [45, 57.6], [66, 59], [82, 60.6], [86, 64], [86.2, 68.6], [89, 82], [85, 85.2], [70, 84.6], [56, 85.2], [44, 83.4], [30, 85.2], [19, 86.2], [18, 83], [21, 73]],
        ],
        label: { left: 50, top: 93, align: 'center' },
        action: { kind: 'chapter', chapter: 'ruffle' },
      },
    ],
  },
  {
    id: 'final',
    src: '/on-set/qalb-mahmood-14-art.jpg',
    width: 1206,
    height: 885,
    outlines: [
      {
        id: 'blanket',
        shapes: [
          [[45, 30.5], [54, 30], [58.5, 38], [60, 56], [62, 72], [63, 88], [55, 93], [33, 95.5], [20, 93.5], [26, 88], [35, 70], [41, 50], [44, 36]],
        ],
        label: { left: 3, top: 50, align: 'start' },
        action: { kind: 'photo', makingOf: 'flat' },
      },
    ],
  },
];
