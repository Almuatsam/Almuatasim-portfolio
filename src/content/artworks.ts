import type { ChapterId } from './chapters';

export type PaintingId = 'painful-experience' | 'choice' | 'guidance';

export interface PaintingDef {
  id: PaintingId;
  src: string;
  inSituSrc: string;
  /** Painful Experience only — B5 #5's always-visible callout on the
   * thread pulled between the two faces. */
  hasThreadCallout?: boolean;
}

/** One spread per painting (Phase 3 Kickoff.md #2) — each painting is
 * its own chapter, mirroring how each Screens project is its own
 * chapter under the "screens" index. */
export const CHAPTER_FOR_PAINTING: Record<PaintingId, ChapterId> = {
  'painful-experience': 'painfulexperience',
  choice: 'choice',
  guidance: 'guidance',
};

export const PAINTINGS: PaintingDef[] = [
  {
    id: 'painful-experience',
    src: '/art/painful-experience.jpg',
    inSituSrc: '/art/painful-experience-in-situ.jpg',
    hasThreadCallout: true,
  },
  { id: 'choice', src: '/art/choice.jpg', inSituSrc: '/art/choice-in-situ.jpg' },
  { id: 'guidance', src: '/art/guidance.jpg', inSituSrc: '/art/guidance-in-situ.jpg' },
];

export const CLOSING_IMAGE_SRC = '/art/local-event.jpg';
