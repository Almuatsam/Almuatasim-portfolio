import type { ChapterId } from './chapters';

export type SkillGroupId = 'uiux' | 'frontend' | 'fullstack' | 'craft';

export interface Skill {
  id: string;
  /** The chapters that prove the skill, shown on hover or focus. */
  chapters: ChapterId[];
}

export interface SkillGroup {
  id: SkillGroupId;
  skills: Skill[];
}

/** Phase 3 Kickoff.md section 6: four groups, confirmed by the owner as
 * listed. Do not add or remove skills. Each skill lists the chapters
 * that show it, matched to what those chapters' own content says
 * (stack lists, features and the On Set role lists). */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'uiux',
    skills: [
      { id: 'research', chapters: ['estudioa'] },
      { id: 'flows', chapters: ['estudioa', 'apos'] },
      { id: 'wireframing', chapters: ['estudioa'] },
      { id: 'bilingual', chapters: ['padelaura', 'papitoooo'] },
    ],
  },
  {
    id: 'frontend',
    skills: [
      { id: 'react', chapters: ['estudioa', 'padelaura'] },
      { id: 'typescript', chapters: ['padelaura'] },
      { id: 'vite', chapters: ['estudioa'] },
      { id: 'motion', chapters: ['estudioa'] },
      { id: 'canvas', chapters: ['papitoooo'] },
      { id: 'i18n', chapters: ['padelaura', 'papitoooo'] },
    ],
  },
  {
    id: 'fullstack',
    skills: [
      { id: 'dotnet', chapters: ['padelaura'] },
      { id: 'flask', chapters: ['estudioa'] },
      { id: 'mysql', chapters: ['estudioa', 'padelaura'] },
      { id: 'sqlalchemy', chapters: ['estudioa'] },
      { id: 'jwt', chapters: ['estudioa', 'apos'] },
      { id: 'payment', chapters: ['padelaura'] },
      { id: 'nlp', chapters: ['estudioa'] },
    ],
  },
  {
    id: 'craft',
    skills: [
      { id: 'sewing', chapters: ['sewing', 'onset'] },
      { id: 'embellishment', chapters: ['onset', 'tie'] },
      { id: 'props', chapters: ['onset'] },
      { id: 'setDressing', chapters: ['onset'] },
      { id: 'painting', chapters: ['art'] },
      { id: 'illustration', chapters: ['sketches'] },
    ],
  },
];
