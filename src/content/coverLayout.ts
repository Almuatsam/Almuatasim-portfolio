// A1 — cover-relative x, y, width as percentages of the cover's own box,
// rotation in degrees, transform-origin: top left (checked layout).
// Shared between the 2D cover page and the 3D cover scene so both stay
// in sync with the same checked positions.
export const STICKER_LAYOUT = [
  { n: 1, x: 3.7, y: 2.8, w: 32.6, r: -7 },
  { n: 3, x: 42.2, y: 1.7, w: 27.8, r: 5 },
  { n: 6, x: 72.2, y: 4.7, w: 24.4, r: -4 },
  { n: 4, x: 2.2, y: 31.4, w: 14.4, r: -5 },
  { n: 5, x: 5.6, y: 56.9, w: 35.2, r: 4 },
  { n: 7, x: 44.4, y: 55.6, w: 37.0, r: -6 },
  { n: 2, x: 20.4, y: 79.2, w: 32.4, r: -9 },
] as const;

/** The sticker crossed by the elastic band — drawn above the stickers. */
export const BAND_STICKER = 6;

export const LABEL_LAYOUT = { x: 18.5, y: 25, w: 59.3, h: 25.6 } as const;
export const BAND_LAYOUT = { x: 85.2, w: 2.2 } as const;

/** Reference aspect ratio of the closed cover (a single StPageFlip hard
 * page, not a two-page spread). */
export const COVER_RATIO = 580 / 760;
