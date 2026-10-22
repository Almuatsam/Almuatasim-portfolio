import type { AccentKey } from './accents';

export interface ProjectImage {
  key: string;
  /** The original's path; the image pipeline serves it in several sizes. */
  src: string;
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
      },
      {
        key: 'home',
        src: '/projects/estudioa/estudioa-en.jpg',
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
      { key: 'admin', src: '/projects/apos/admin-dashboard-hd.jpg' },
      { key: 'cafe', src: '/projects/apos/cafe-pos-hd.jpg' },
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
      },
      {
        key: 'ar',
        src: '/projects/padelaura/padelaura-ar.jpg',
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
      },
      {
        key: 'ar',
        src: '/projects/papitoooo/papitoooo-ar.jpg',
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
