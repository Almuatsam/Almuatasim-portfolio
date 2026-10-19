export type PaintingId = 'painful-experience' | 'choice' | 'guidance';

export interface PaintingDef {
  id: PaintingId;
  src: string;
  inSituSrc: string;
  /** Painful Experience only — B5 #5's hover callout pointing at the
   * thread pulled between the two faces. */
  hasThreadCallout?: boolean;
}

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
