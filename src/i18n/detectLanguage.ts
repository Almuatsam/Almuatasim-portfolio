import { DEFAULT_LANG, isSupportedLang, type SupportedLang } from './index';

const STORAGE_KEY = 'maker-sketchbook-lang';

export function readStoredLanguage(): SupportedLang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeLanguage(lang: SupportedLang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage unavailable (private mode, disabled cookies) — not fatal.
  }
}

/** B3 — on first visit, pick the language from navigator.language. */
export function detectInitialLanguage(): SupportedLang {
  const stored = readStoredLanguage();
  if (stored) return stored;

  const browserLangs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  const prefersArabic = browserLangs.some((l) => l?.toLowerCase().startsWith('ar'));
  return prefersArabic ? 'ar' : DEFAULT_LANG;
}
