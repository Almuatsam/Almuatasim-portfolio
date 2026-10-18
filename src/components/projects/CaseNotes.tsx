import type { CSSProperties } from 'react';
import type { TFunction } from 'i18next';
import { RevealText } from '../motion/RevealText';
import { computeParagraphDelays } from '../../lib/revealStagger';
import './case-notes.css';

interface CaseNotesProps {
  t: TFunction;
  isRtl: boolean;
  notes: Partial<Record<'problem' | 'insight' | 'build' | 'result', string>>;
}

const ORDER: Array<'problem' | 'insight' | 'build' | 'result'> = ['problem', 'insight', 'build', 'result'];

/** A4 — case-study text as numbered notes (Problem, Insight, Build,
 * Result) rather than long blocks. */
export function CaseNotes({ t, isRtl, notes }: CaseNotesProps) {
  const entries = ORDER.filter((key) => notes[key]);
  const baseDelays = computeParagraphDelays(
    entries.map((key) => notes[key] as string),
    isRtl,
  );

  return (
    <dl className="case-notes">
      {entries.map((key, index) => {
        const text = notes[key] as string;
        const baseDelay = baseDelays[index];
        const style: CSSProperties = { '--word-index': index, '--word-stagger': '60ms', '--reveal-base': '300ms' } as CSSProperties;

        return (
          <div className="case-notes__row" key={key}>
            <dt className="case-notes__label reveal-word" style={style}>
              {t(`projectLabels.${key}`)}
            </dt>
            <RevealText as="dd" text={text} isRtl={isRtl} className="case-notes__text" baseDelayMs={baseDelay} />
          </div>
        );
      })}
    </dl>
  );
}
