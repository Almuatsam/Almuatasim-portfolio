import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { SupportedLang } from '../i18n';

/** A translator bound to a specific language, independent of the globally
 * active one. Needed by the front/back flip faces so a face mid-rotation
 * keeps showing the language it started with, even once the global
 * language has already switched underneath it. */
export function useFixedT(lang: SupportedLang): TFunction {
  const { i18n } = useTranslation();
  return i18n.getFixedT(lang);
}
