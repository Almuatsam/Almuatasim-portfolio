import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './rotate-hint.css';

const STORAGE_KEY = 'rotate-hint-dismissed';

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Phones held sideways have a short page area: a small hint asks for the
 * phone to be turned upright. Dismissible, and remembered for the visit. */
export function RotateHint() {
  const { t } = useTranslation();
  const isSideways = useMediaQuery('(max-width: 899px) and (max-height: 500px) and (orientation: landscape) and (pointer: coarse)');
  const [isDismissed, setIsDismissed] = useState(readDismissed);

  if (!isSideways || isDismissed) return null;

  function dismiss(): void {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // The hint just comes back next visit.
    }
  }

  return (
    <div className="rotate-hint" role="status">
      <span className="rotate-hint__text">{t('common.rotateHint')}</span>
      <button type="button" className="rotate-hint__close" onClick={dismiss} aria-label={t('common.dismiss')}>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M2 2 10 10M10 2 2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
