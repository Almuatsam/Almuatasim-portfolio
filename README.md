# Almuatasim Alfarsi — The Maker's Sketchbook

A bilingual (English / Arabic) portfolio presented as one open sketchbook.
Front-end only: no backend, no database, no server code.

## Stack

React 19 + Vite + TypeScript, React Router, react-i18next, Framer Motion,
self-hosted fonts via Fontsource, plain CSS with design tokens.

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The root
path redirects to `/en` or `/ar` based on the browser's language.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, servable from any static host.

## Project status

Phase 1: project setup, the bilingual system, the book shell (stage, open
spread, index tabs, chapter arrows, utility bar), chapter navigation with
page-turn transition and accent cross-fade, the Cover, Contents and About
chapters, reduced-motion support and the mobile single-page layout.

Every other chapter (Part One: Screens, the four project spreads, Part
Two: By Hand, Process, Skills, Contact) currently renders a "coming soon"
page in the book's own style and is reachable from Contents, the tabs and
the chapter arrows.
