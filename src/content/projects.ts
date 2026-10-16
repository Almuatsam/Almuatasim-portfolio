import type { AccentKey } from './accents';

export interface ProjectImage {
  key: string;
  src: string;
}

export interface ProjectDef {
  id: 'estudioa' | 'apos' | 'padelaura' | 'papitoooo';
  accent: AccentKey;
  descriptor: string;
  stack: string[];
  liveUrl: string;
  liveDomain: string;
  images: ProjectImage[];
}

export const PROJECTS: ProjectDef[] = [
  {
    id: 'estudioa',
    accent: 'clay',
    descriptor: 'Graduation project',
    stack: ['React 19', 'Vite', 'Framer Motion', 'Axios', 'Flask', 'JWT', 'SQLAlchemy', 'MySQL', 'spaCy', 'RapidFuzz', 'scikit-learn'],
    liveUrl: 'https://estudioa.vercel.app',
    liveDomain: 'estudioa.vercel.app',
    images: [
      { key: 'home', src: '/projects/estudioa/home-page.png' },
      { key: 'admin', src: '/projects/estudioa/admin.png' },
      { key: 'cardflip', src: '/projects/estudioa/cardflip.png' },
    ],
  },
  {
    id: 'apos',
    accent: 'ochre',
    descriptor: 'Adaptive POS',
    stack: [],
    liveUrl: 'https://apos-three.vercel.app/login',
    liveDomain: 'apos-three.vercel.app',
    images: [
      { key: 'cafe', src: '/projects/apos/cafe-pos.png' },
      { key: 'admin', src: '/projects/apos/admin.png' },
      { key: 'employees', src: '/projects/apos/employees.png' },
      { key: 'payment', src: '/projects/apos/payment.png' },
    ],
  },
  {
    id: 'padelaura',
    accent: 'sage',
    descriptor: 'Nahj programme, 4-day build',
    stack: ['.NET 8', 'Clean Architecture', 'React 19', 'TypeScript', 'MySQL'],
    liveUrl: 'https://padelaura.vercel.app',
    liveDomain: 'padelaura.vercel.app',
    images: [
      { key: 'landing', src: '/projects/padelaura/landing-page.png' },
      { key: 'booking', src: '/projects/padelaura/booking-page.png' },
      { key: 'thawani', src: '/projects/padelaura/thawani-page.png' },
      { key: 'confirmation', src: '/projects/padelaura/confirmation-page.png' },
      { key: 'admin', src: '/projects/padelaura/admin-page.png' },
    ],
  },
  {
    id: 'papitoooo',
    accent: 'coral',
    descriptor: 'Just for fun',
    stack: ['Canvas 2D', 'Fabric.js'],
    liveUrl: 'https://photo-booth-xi-fawn.vercel.app',
    liveDomain: 'photo-booth-xi-fawn.vercel.app',
    images: [
      { key: 'booth', src: '/projects/papitoooo/the-photo-booth.png' },
      { key: 'shot', src: '/projects/papitoooo/shot.png' },
      { key: 'edit', src: '/projects/papitoooo/edit-page.png' },
      { key: 'final', src: '/projects/papitoooo/final-photo.jpg' },
    ],
  },
];

export function getProject(id: ProjectDef['id']): ProjectDef {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) throw new Error(`Unknown project id: ${id}`);
  return project;
}
