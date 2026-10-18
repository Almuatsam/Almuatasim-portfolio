import type { CSSProperties } from 'react';
import type { TFunction } from 'i18next';
import { RevealText } from '../motion/RevealText';
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
  const stepSize = isRtl ? 90 : 20;

  const baseDelays: number[] = [];
  entries.reduce((offset, key) => {
    baseDelays.push(480 + offset * stepSize);
    const text = notes[key] as string;
    const stepCount = isRtl ? Math.ceil(text.split(/\s+/).length / 3) : text.split(/\s+/).length;
    return offset + stepCount;
  }, 0);

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
