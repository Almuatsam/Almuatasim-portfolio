import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../content/en.json';
import ar from '../content/ar.json';

export type SupportedLang = 'en' | 'ar';
export const SUPPORTED_LANGS: SupportedLang[] = ['en', 'ar'];
export const DEFAULT_LANG: SupportedLang = 'en';

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function isSupportedLang(value: string | null | undefined): value is SupportedLang {
  return value === 'en' || value === 'ar';
}

export default i18next;
