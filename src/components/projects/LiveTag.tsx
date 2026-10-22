import type { TFunction } from 'i18next';
import './live-tag.css';

interface LiveTagProps {
  t: TFunction;
  url: string;
  domain: string;
  note?: string;
  /** Overrides the default "Visit live" label (e.g. "Read the story on WePresent"). */
  label?: string;
}

/** B4 — "Visit live" tag, styled as a paper luggage tag tied to the
 * screenshot with a pencil-drawn string. Opens in a new tab; never an
 * iframe (APOS blocks framing and Papitoooo needs real camera access). */
export function LiveTag({ t, url, domain, note, label }: LiveTagProps) {
  return (
    <div className="live-tag">
      <svg className="live-tag__string" viewBox="0 0 40 28" aria-hidden="true">
        <path d="M20 0 C 20 10, 8 10, 8 20" stroke="var(--color-secondary)" strokeWidth="1.2" fill="none" />
      </svg>
      <a href={url} target="_blank" rel="noopener noreferrer" className="live-tag__link">
        <span className="live-tag__label font-hand">{label ?? t('projectLabels.visitLive')}</span>
        <PencilArrowTiny />
      </a>
      <bdi className="live-tag__domain font-mono ltr-fragment">{domain}</bdi>
      {note && <p className="live-tag__note font-hand">{note}</p>}
    </div>
  );
}

function PencilArrowTiny() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" className="live-tag__arrow">
      <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 1.5 14 6l-5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
