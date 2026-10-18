import { useEffect } from 'react';
import type { ChapterId } from '../content/chapters';

const PRELOAD_CHAPTERS: ChapterId[] = ['cover', 'contents'];
const LINK_ID = 'soria-font-preload';

/** Display Font - Soria.md step 7 — preload the font file on the Cover
 * and Contents routes only (the first views), not on every page. */
export function usePreloadSoriaFont(chapterId: ChapterId): void {
  useEffect(() => {
    if (!PRELOAD_CHAPTERS.includes(chapterId)) return;
    if (document.getElementById(LINK_ID)) return;

    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/ttf';
    link.href = '/fonts/soria/Soria-Regular.ttf';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }, [chapterId]);
}
