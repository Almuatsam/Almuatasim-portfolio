import { Fragment } from 'react';
import { parseMarks } from '../../lib/marks';
import '../../styles/highlighter.css';

interface MarkedProps {
  text: string;
}

/** Renders a content string, turning [[marked]] words into <mark>. */
export function Marked({ text }: MarkedProps) {
  return (
    <>
      {parseMarks(text).map((segment, index) =>
        segment.isMarked ? (
          <mark key={index} className="hl">
            {segment.text}
          </mark>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}
