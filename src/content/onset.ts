import type { Credit } from './credits';

export const WEPRESENT_URL = 'https://wepresent.wetransfer.com/stories/abdulaziz-al-hosni-qalb-mahmood';
export const WEPRESENT_DOMAIN = 'wepresent.wetransfer.com';

/** The index cards' thumbnails. The press card carries no image: the
 * brief bans article images ("Never copy article text beyond the
 * headline... No article images"). */
export const ONSET_THUMBNAILS = {
  qalb: { src: '/on-set/qalb-mahmood-3-set.jpg', credit: 'both' },
  amouage: { src: '/on-set/amouage-4-art.jpg', credit: 'aziz' },
} as const satisfies Record<string, { src: string; credit: Credit }>;

/** Qalb Mahmood overview: the desert location shoot opens the chapter
 * (photo map: "Atmosphere, opening image of the chapter"). `position`
 * is the physical object-position that keeps the figure in red and the
 * crew's heads inside the landscape crop. */
export const QALB_HERO = { src: '/on-set/qalb-mahmood-13-set.jpg', position: '50% 58%', credit: 'aziz' as Credit };

export const QALB_ROLE_KEYS = ['covers', 'props', 'walls', 'positioned', 'tanks', 'fittings'] as const;

export type FollowStageId = 'sketch' | 'measure' | 'sew' | 'test' | 'onSet';

export interface FollowStage {
  id: FollowStageId;
  src: string;
  /** "contain" for the drawing so nothing is cropped off; "cover" for
   * the photographs. `position` is a physical object-position, so it
   * stays aligned in both languages. */
  fit: 'cover' | 'contain';
  position: string;
  credit: Credit;
}

/** B5 #7 — one object, the ruffled bedspread, from idea to set. Photo
 * map: 12 sketch, 17 measure (the cropped notebook photo, never the
 * original), 10 sew, 8 test, 3 on set. */
export const FOLLOW_STAGES: FollowStage[] = [
  { id: 'sketch', src: '/on-set/qalb-mahmood-12-work.jpg', fit: 'contain', position: '50% 50%', credit: 'owner' },
  { id: 'measure', src: '/on-set/qalb-mahmood-17-work.jpg', fit: 'cover', position: '56% 60%', credit: 'owner' },
  { id: 'sew', src: '/on-set/qalb-mahmood-10-work.jpg', fit: 'cover', position: '50% 62%', credit: 'owner' },
  { id: 'test', src: '/on-set/qalb-mahmood-8-work.jpg', fit: 'cover', position: '50% 55%', credit: 'owner' },
  { id: 'onSet', src: '/on-set/qalb-mahmood-3-set.jpg', fit: 'cover', position: '62% 50%', credit: 'both' },
];
