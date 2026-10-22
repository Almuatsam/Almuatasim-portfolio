import type { ChapterId } from './chapters';
import type { Credit } from './credits';
import { getProject, type ProjectDef } from './projects';

export type ProcessStepId = 'listen' | 'sketch' | 'make' | 'test' | 'refine';

export interface ProcessImage {
  src: string;
  /** i18n key of the alt text. */
  altKey: string;
  /** Set on every On Set photo (Photo Credits.md); absent on the rest. */
  credit?: Credit;
  /** Physical object-position for the fixed crop. */
  position?: string;
}

export interface ProcessExample {
  /** The chapters that hold the example, linked under it. */
  chapters: ChapterId[];
  images: ProcessImage[];
}

export interface ProcessStep {
  id: ProcessStepId;
  screens: ProcessExample;
  byHand: ProcessExample;
}

function screenshot(id: ProjectDef['id']): ProcessImage {
  const image = getProject(id).images[0];
  return { src: image.src, altKey: `projects.${id}.images.${image.key}` };
}

const onSet = (file: string, altKey: string, credit: Credit, position = '50% 50%'): ProcessImage => ({
  src: `/on-set/${file}`,
  altKey,
  credit,
  position,
});

/** Phase 3 Kickoff.md section 5: listen, sketch, make, test, refine, with
 * one example from Screens and one from By Hand for each. The survey, the
 * four platforms, the test counts and the review score are text (no
 * screenshot of them exists); the rest use the photos named in the brief. */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'listen',
    screens: { chapters: ['estudioa'], images: [] },
    byHand: {
      chapters: ['qalb'],
      images: [onSet('qalb-mahmood-storyboards.jpg', 'process.images.storyboards', 'aziz', '50% 40%')],
    },
  },
  {
    id: 'sketch',
    screens: {
      chapters: ['estudioa'],
      images: [{ src: '/projects/estudioa/estudioa-browse-wireframe.svg', altKey: 'process.images.wireframe' }],
    },
    byHand: {
      chapters: ['follow', 'sketches'],
      images: [
        onSet('qalb-mahmood-12-work.jpg', 'onset.follow.stages.sketch.alt', 'owner'),
        { src: '/sewing/sketch-1.jpg', altKey: 'sewing.sketches.wrapTopAlt', position: '50% 30%' },
      ],
    },
  },
  {
    id: 'make',
    screens: {
      chapters: ['screens'],
      images: [screenshot('estudioa'), screenshot('apos'), screenshot('padelaura'), screenshot('papitoooo')],
    },
    byHand: {
      chapters: ['sewing', 'onset'],
      images: [
        onSet('qalb-mahmood-16-work.jpg', 'process.images.sewingMachine', 'owner', '50% 40%'),
        onSet('qalb-mahmood-11-work.jpg', 'onset.showMade.makingOf.fan', 'owner'),
      ],
    },
  },
  {
    id: 'test',
    screens: { chapters: ['estudioa', 'apos'], images: [] },
    byHand: {
      chapters: ['follow', 'qalb'],
      images: [onSet('qalb-mahmood-8-work.jpg', 'onset.follow.stages.test.alt', 'owner', '50% 55%')],
    },
  },
  {
    id: 'refine',
    screens: { chapters: ['apos'], images: [screenshot('apos')] },
    byHand: {
      chapters: ['amouage'],
      images: [onSet('amouage-2.jpg', 'process.images.courtyardSet', 'both', '50% 45%')],
    },
  },
];
