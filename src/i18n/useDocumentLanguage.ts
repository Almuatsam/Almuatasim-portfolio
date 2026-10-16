import { useEffect } from 'react';
import i18next, { type SupportedLang } from './index';
import { storeLanguage } from './detectLanguage';

const DIR_BY_LANG: Record<SupportedLang, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

const loadedFontBundles = new Set<SupportedLang>();

function loadFontsFor(lang: SupportedLang): void {
  if (loadedFontBundles.has(lang)) return;
  loadedFontBundles.add(lang);
  // A4 — load Arabic font files only on /ar pages, and vice versa.
  if (lang === 'ar') {
    void import('../styles/fonts/ar');
  } else {
    void import('../styles/fonts/en');
  }
}

/** B3 — sets <html lang dir>, loads the matching font subset, and
 * persists the choice so the next visit remembers it. */
export function useDocumentLanguage(lang: SupportedLang): void {
  useEffect(() => {
    void i18next.changeLanguage(lang);
    storeLanguage(lang);
    loadFontsFor(lang);

    const html = document.documentElement;
    html.lang = lang;
    html.dir = DIR_BY_LANG[lang];
  }, [lang]);
}
