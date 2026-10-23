# Almuatasim Alfarsi: The Maker's Sketchbook

A bilingual (English and Arabic) portfolio, presented as one open sketchbook:
interface projects, paintings, sewing and set work. It is a static site with no
backend, no database, no cookies and no third-party requests.

## Stack

- React 19, TypeScript and Vite 8, with React Router and react-i18next
  (English left to right, Arabic right to left).
- StPageFlip (`page-flip`, `react-pageflip`) for the page turns, GSAP and
  Framer Motion for the interactions, React Three Fiber for the 3D cover on
  desktop, Lenis and OverlayScrollbars for page scrolling.
- Plain CSS with design tokens. Fonts are self-hosted.
- `sharp` makes the AVIF and WebP images at build time.

## Run and build

```bash
npm install
npm run dev        # local server, usually http://localhost:5173
npm run build      # images, sitemap, dash check, type check, build, prerender
npm run preview    # serve the built site on http://localhost:4173
npm run lint       # oxlint
```

`npm run build` runs these steps in order:

1. `scripts/build-images.mjs` turns every original in `assets/images` into AVIF
   and WebP files at 480, 800, 1200 and 1600px wide (never larger than the
   original) in `public/img`, and writes the list the `<Picture>` component
   reads (`src/generated/images.json`). Both outputs are generated and not
   committed.
2. `scripts/build-sitemap.mjs` writes `public/sitemap.xml` and `public/robots.txt`.
3. `scripts/check-dashes.mjs` fails the build if any visible text contains an
   em dash or an en dash.
4. The type check and the client build, then a server build of the Plain
   Version and `scripts/prerender.mjs`, which writes real HTML for `/en/plain`
   and `/ar/plain`.

The public address used in canonical links, hreflang, the sitemap and the share
image comes from the `VITE_SITE_URL` environment variable at build time. A
production build stops with a message if it is missing. For a local build, copy
`.env.example` to `.env.local` (or run `VITE_SITE_URL=https://example.com npm run build`);
on Vercel, set it under Settings, Environment Variables.
`vercel.json` holds the rewrites (so deep links like `/ar/contact` work), the
cache rules and the security headers.

## Folder map

| Folder | What is in it |
|---|---|
| `src/components` | The pages of the book, one folder per chapter, plus the book frame (tabs, arrows, flipbook) |
| `src/content` | All copy (`en.json`, `ar.json`) and the shared data: chapters, projects, credits, skills, process |
| `src/hooks`, `src/lib` | Hooks, small stores and helpers |
| `src/routes` | Routing and the chapter-to-component map (each chapter loads as its own chunk) |
| `src/styles` | Tokens, global styles, reveal and touch rules |
| `assets/images` | The full-size original images (not served as they are) |
| `public` | Fonts, videos, icons, `robots.txt` and the generated `img` and `sitemap.xml` |
| `scripts` | The build steps above, and the icon generator |

## Credits and licences

**Writing, paintings, sewing and drawings:** all rights reserved by Almuatasim
Alfarsi (see `LICENSE`).

**Photographs:** each On Set photo carries one credit line, set per image in
`src/content` (`credit: "aziz" | "owner" | "both"`): Abdulaziz Al-Hosni,
Almuatasim Alfarsi, or both. The Qalb Mahmood and Amouage work is by Abdulaziz
Al-Hosni; the owner's part is the set and fabrication. Used with permission.

**Fonts**

- Soria, by Bydani ([behance.net/danibydani](https://www.behance.net/danibydani)),
  under CC BY-ND 4.0. It is served unmodified and credited on the Contact page
  and in the Plain Version. The licence is in `public/fonts/soria`.
- IBM Plex Sans, IBM Plex Mono and IBM Plex Sans Arabic, Amiri, Noto Naskh
  Arabic and Fraunces, all under the SIL Open Font License 1.1, through Fontsource.

**Libraries** keep their own licences: React, React Router, i18next,
react-i18next, Framer Motion, three.js, React Three Fiber, drei, StPageFlip,
react-pageflip, Lenis, OverlayScrollbars, yet-another-react-lightbox and Vite
are MIT; sharp is Apache-2.0; GSAP is used under its standard no-charge licence.
