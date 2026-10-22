import type { TFunction } from 'i18next';

interface ImageCreditProps {
  t: TFunction;
  className?: string;
}

/** Credit rule (B4): every On Set image carries this one line, and no
 * other names. */
export function ImageCredit({ t, className }: ImageCreditProps) {
  return <p className={`onset__credit${className ? ` ${className}` : ''}`}>{t('onset.credit')}</p>;
}
