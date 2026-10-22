/** The public address of the site, with no trailing slash. It builds the
 * canonical, hreflang and share-image URLs. Set VITE_SITE_URL when the real
 * domain is known (the default is a placeholder). */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://almuatasim.vercel.app';

export const OWNER_NAME = 'Almuatasim Alfarsi';
export const SHARE_IMAGE_PATH = '/og-image.jpg';
