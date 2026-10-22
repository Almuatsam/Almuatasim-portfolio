import type { Credit } from './credits';

export type PrintId = 'stage' | 'armchair' | 'blackWhite';

/** The three final images (B5 #8, Amouage variant). The red heart rug
 * in the armchair photo was NOT made by the owner: nothing on this
 * spread says or implies that it was, and the heart-prop photo below is
 * never paired with it. */
export const PRINTS: { id: PrintId; src: string; credit: Credit }[] = [
  { id: 'stage', src: '/on-set/amouage-4-art.jpg', credit: 'aziz' },
  { id: 'armchair', src: '/on-set/amouage-5-art.jpg', credit: 'aziz' },
  { id: 'blackWhite', src: '/on-set/amouage-6-art.jpg', credit: 'aziz' },
];

export interface PinnedNote {
  id: 'heartProp' | 'camera';
  src: string;
  credit: Credit;
  /** Physical object-position for the fixed crop. */
  position: string;
  aspect: string;
}

/** Making-of notes pinned beside the stack. */
export const PINNED_NOTES: PinnedNote[] = [
  { id: 'heartProp', src: '/on-set/amouage-3.jpg', credit: 'both', position: '50% 48%', aspect: '3 / 4' },
  { id: 'camera', src: '/on-set/amouage-1.jpg', credit: 'owner', position: '50% 40%', aspect: '3 / 2' },
];

export const ROLE_KEYS = ['sewn', 'positioned', 'embellished'] as const;

/** All three posts are the Amouage projects. Linked out, never embedded. */
export const INSTAGRAM_POSTS = [
  { id: 'reel', url: 'https://www.instagram.com/reel/CoozWS-A8PP/', label: 'instagram.com/reel/CoozWS-A8PP' },
  { id: 'postOne', url: 'https://www.instagram.com/p/C3aDHu7tnRS/', label: 'instagram.com/p/C3aDHu7tnRS' },
  { id: 'postTwo', url: 'https://www.instagram.com/p/C3htbbfNsJr/', label: 'instagram.com/p/C3htbbfNsJr' },
] as const;
