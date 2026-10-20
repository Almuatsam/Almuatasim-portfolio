import type { ChapterId } from './chapters';

export type PaintingId = 'painful-experience' | 'choice' | 'guidance';

export interface PaintingDef {
  id: PaintingId;
  src: string;
  /** Only Painful Experience (Hayat) and Guidance (which reuses
   * CLOSING_IMAGE_SRC) show a context-page photo; Choice has none. */
  contextPhotoSrc?: string;
  /** Painful Experience only — B5 #5's always-visible callout on the
   * thread pulled between the two faces. Physical (not logical) percent
   * coordinates, relative to the painting image itself, so the page's
   * RTL mirror never moves it off the thread. */
  threadPosition?: { left: string; top: string };
}

/** One spread per painting (Phase 3 Kickoff.md #2) — each painting is
 * its own chapter, mirroring how each Screens project is its own
 * chapter under the "screens" index. */
export const CHAPTER_FOR_PAINTING: Record<PaintingId, ChapterId> = {
  'painful-experience': 'painfulexperience',
  choice: 'choice',
  guidance: 'guidance',
};

export const CLOSING_IMAGE_SRC = '/art/local-event.jpg';

export const PAINTINGS: PaintingDef[] = [
  {
    id: 'painful-experience',
    src: '/art/painful-experience.jpg',
    contextPhotoSrc: '/art/painful-experience-in-situ.jpg',
    threadPosition: { left: '46%', top: '31%' },
  },
  { id: 'choice', src: '/art/choice.jpg' },
  { id: 'guidance', src: '/art/guidance.jpg', contextPhotoSrc: CLOSING_IMAGE_SRC },
];
