import type { CSSProperties, ElementType } from 'react';
import { Fragment } from 'react';

interface RevealTextProps {
  text: string;
  isRtl: boolean;
  as?: ElementType;
  className?: string;
  /** Delay before the first word starts, so text arrives after the
   * draw-on and colour layers (B6 part 2: lines, then colour, then text). */
  baseDelayMs?: number;
}

interface WordStyle extends CSSProperties {
  '--word-index': number;
  '--word-stagger': string;
  '--reveal-base': string;
}

const ARABIC_GROUP_SIZE = 3;

/** Splits text into reveal steps: one word per step in English, and
 * groups of words in Arabic so letter joining is never broken mid-word
 * (B6 part 2: "reveal by word groups in Arabic so letters stay joined"). */
function toSteps(text: string, isRtl: boolean): string[][] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!isRtl) return words.map((word) => [word]);

  const steps: string[][] = [];
  for (let i = 0; i < words.length; i += ARABIC_GROUP_SIZE) {
    steps.push(words.slice(i, i + ARABIC_GROUP_SIZE));
  }
  return steps;
}

export function RevealText({ text, isRtl, as: Tag = 'p', className, baseDelayMs = 480 }: RevealTextProps) {
  const steps = toSteps(text, isRtl);
  const stagger = isRtl ? '90ms' : '20ms';

  return (
    <Tag className={className}>
      {steps.map((step, index) => {
        const style: WordStyle = {
          '--word-index': index,
          '--word-stagger': stagger,
          '--reveal-base': `${baseDelayMs}ms`,
        };
        return (
          <Fragment key={index}>
            <span className="reveal-word" style={style}>
              {step.join(' ')}
            </span>{' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}
