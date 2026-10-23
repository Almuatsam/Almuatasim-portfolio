/** The public address of the site, with no trailing slash. It builds the
 * canonical, hreflang and share-image URLs. It is set at build time from the
 * VITE_SITE_URL environment variable; a production build stops without it
 * (see scripts/site-url.mjs). In development it is the address the page is
 * served from. */
const configured = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL: string = (configured || (import.meta.env.DEV ? window.location.origin : '')).replace(/\/$/, '');

export const OWNER_NAME = 'Almuatasim Alfarsi';
export const SHARE_IMAGE_PATH = '/og-image.jpg';
