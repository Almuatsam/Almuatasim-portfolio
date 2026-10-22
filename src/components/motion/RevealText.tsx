import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Fragment } from 'react';
import { parseMarks } from '../../lib/marks';
import '../../styles/highlighter.css';

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

interface Piece {
  text: string;
  isMarked: boolean;
}

/** A word is one or more pieces: punctuation glued to a marked phrase
 * ("[[71/100]].") stays part of the same word, so no stray space opens
 * between the bar and the full stop. */
type Word = Piece[];

function toWords(text: string): Word[] {
  const words: Word[] = [];
  let isGlued = false;
  for (const segment of parseMarks(text)) {
    for (const token of segment.text.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        isGlued = false;
        continue;
      }
      if (isGlued && words.length) words[words.length - 1].push({ text: token, isMarked: segment.isMarked });
      else words.push([{ text: token, isMarked: segment.isMarked }]);
      isGlued = true;
    }
  }
  return words;
}

/** Splits text into reveal steps: one word per step in English, and
 * groups of words in Arabic so letter joining is never broken mid-word
 * (B6 part 2: "reveal by word groups in Arabic so letters stay joined"). */
function toSteps(text: string, isRtl: boolean): Word[][] {
  const words = toWords(text);
  if (!isRtl) return words.map((word) => [word]);

  const steps: Word[][] = [];
  for (let i = 0; i < words.length; i += ARABIC_GROUP_SIZE) {
    steps.push(words.slice(i, i + ARABIC_GROUP_SIZE));
  }
  return steps;
}

const startsMarked = (word: Word | undefined): boolean => word?.[0]?.isMarked ?? false;
const endsMarked = (word: Word | undefined): boolean => word?.[word.length - 1]?.isMarked ?? false;

/** Joins a step's words. Spaces between two marked words sit inside the
 * mark so the bar runs on; a bar that ends the step but continues into
 * the next one (each step is its own inline-block) is widened with
 * `hl--join` to cover the space between them. */
function renderStep(step: Word[], nextStepFirst: Word | undefined): ReactNode[] {
  const nodes: ReactNode[] = [];
  step.forEach((word, wordIndex) => {
    const next = step[wordIndex + 1];
    const isLastWord = wordIndex === step.length - 1;
    word.forEach((piece, pieceIndex) => {
      const isLastPiece = pieceIndex === word.length - 1;
      const key = `${wordIndex}-${pieceIndex}`;
      if (!piece.isMarked) {
        nodes.push(piece.text);
        return;
      }
      const joinsNextWord = isLastPiece && (isLastWord ? startsMarked(nextStepFirst) : startsMarked(next));
      const inStepSpace = isLastPiece && !isLastWord && startsMarked(next);
      nodes.push(
        <mark key={key} className={joinsNextWord && isLastWord ? 'hl hl--join' : 'hl'}>
          {piece.text + (inStepSpace ? ' ' : '')}
        </mark>,
      );
    });
    if (!isLastWord && !(endsMarked(word) && startsMarked(next))) nodes.push(' ');
  });
  return nodes;
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
        const nextFirst = steps[index + 1]?.[0];
        return (
          <Fragment key={index}>
            <span className="reveal-word" style={style}>
              {renderStep(step, nextFirst)}
            </span>{' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}
