import type { TFunction } from 'i18next';
import type { Credit } from '../../content/credits';

interface ImageCreditProps {
  t: TFunction;
  credit: Credit;
  className?: string;
}

/** Credit rule (Photo Credits.md): every On Set image carries exactly one
 * credit line, chosen per image. */
export function ImageCredit({ t, credit, className }: ImageCreditProps) {
  return <p className={`onset__credit${className ? ` ${className}` : ''}`}>{t(`onset.credits.${credit}`)}</p>;
}
