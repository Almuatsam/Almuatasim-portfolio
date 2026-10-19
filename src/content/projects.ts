import type { AccentKey } from './accents';

export interface ProjectImage {
  key: string;
  /** 1x fallback (also the `src` for browsers that ignore srcSet). */
  src: string;
  /** `"<1x-url> 1x, <2x-url> 2x"`, when a sharper capture exists. */
  srcSet?: string;
}

export interface ProjectDef {
  id: 'estudioa' | 'apos' | 'padelaura' | 'papitoooo';
  accent: AccentKey;
  stack: string[];
  liveUrl: string;
  liveDomain: string;
  images: ProjectImage[];
}

export const PROJECTS: ProjectDef[] = [
  {
    id: 'estudioa',
    accent: 'red',
    stack: ['React 19', 'Vite', 'Framer Motion', 'Axios', 'Flask', 'JWT', 'SQLAlchemy', 'MySQL', 'spaCy', 'RapidFuzz', 'scikit-learn'],
    liveUrl: 'https://estudioa.vercel.app',
    liveDomain: 'estudioa.vercel.app',
    images: [
      {
        key: 'browse',
        src: '/projects/estudioa/estudioa-browse.jpg',
        srcSet: '/projects/estudioa/estudioa-browse.jpg 1x, /projects/estudioa/estudioa-browse@2x.jpg 2x',
      },
      {
        key: 'home',
        src: '/projects/estudioa/estudioa-en.jpg',
        srcSet: '/projects/estudioa/estudioa-en.jpg 1x, /projects/estudioa/estudioa-en@2x.jpg 2x',
      },
      { key: 'admin', src: '/projects/estudioa/admin.png' },
      { key: 'cardflip', src: '/projects/estudioa/cardflip.png' },
    ],
  },
  {
    id: 'apos',
    accent: 'blue',
    stack: [],
    liveUrl: 'https://apos-three.vercel.app/login',
    liveDomain: 'apos-three.vercel.app',
    images: [
      { key: 'cafe', src: '/projects/apos/cafe-pos-hd.jpg' },
      { key: 'admin', src: '/projects/apos/admin-hd.jpg' },
      { key: 'employees', src: '/projects/apos/employees-hd.jpg' },
      { key: 'payment', src: '/projects/apos/payment-hd.jpg' },
      { key: 'posCafe', src: '/projects/apos/pos-cafe-hd.jpg' },
      { key: 'giftShop', src: '/projects/apos/pos-gift-shop-hd.jpg' },
      { key: 'tickets', src: '/projects/apos/pos-tickets-hd.jpg' },
    ],
  },
  {
    id: 'padelaura',
    accent: 'yellow',
    stack: ['.NET 8', 'Clean Architecture', 'React 19', 'TypeScript', 'MySQL'],
    liveUrl: 'https://padelaura.vercel.app',
    liveDomain: 'padelaura.vercel.app',
    images: [
      {
        key: 'en',
        src: '/projects/padelaura/padelaura-en.jpg',
        srcSet: '/projects/padelaura/padelaura-en.jpg 1x, /projects/padelaura/padelaura-en@2x.jpg 2x',
      },
      {
        key: 'ar',
        src: '/projects/padelaura/padelaura-ar.jpg',
        srcSet: '/projects/padelaura/padelaura-ar.jpg 1x, /projects/padelaura/padelaura-ar@2x.jpg 2x',
      },
      { key: 'booking', src: '/projects/padelaura/booking-page-hd.jpg' },
      { key: 'thawani', src: '/projects/padelaura/thawani-page-hd.jpg' },
      { key: 'confirmation', src: '/projects/padelaura/confirmation-page-hd.jpg' },
    ],
  },
  {
    id: 'papitoooo',
    accent: 'cyan',
    stack: ['Canvas 2D', 'Fabric.js'],
    liveUrl: 'https://photo-booth-xi-fawn.vercel.app',
    liveDomain: 'photo-booth-xi-fawn.vercel.app',
    images: [
      {
        key: 'en',
        src: '/projects/papitoooo/papitoooo-en.jpg',
        srcSet: '/projects/papitoooo/papitoooo-en.jpg 1x, /projects/papitoooo/papitoooo-en@2x.jpg 2x',
      },
      {
        key: 'ar',
        src: '/projects/papitoooo/papitoooo-ar.jpg',
        srcSet: '/projects/papitoooo/papitoooo-ar.jpg 1x, /projects/papitoooo/papitoooo-ar@2x.jpg 2x',
      },
      { key: 'final', src: '/projects/papitoooo/final-photo.jpg' },
    ],
  },
];

export function getProject(id: ProjectDef['id']): ProjectDef {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) throw new Error(`Unknown project id: ${id}`);
  return project;
}
