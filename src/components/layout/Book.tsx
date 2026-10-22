import type { CSSProperties, ReactNode, Ref } from 'react';
import { ACCENTS, type AccentKey } from '../../content/accents';
import './book.css';

interface BookProps {
  accent: AccentKey;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

interface AccentStyle extends CSSProperties {
  '--accent': string;
  '--accent-ink': string;
  '--accent-tint': string;
  '--accent-text': string;
  '--mark-bg': string;
}

export function Book({ accent, children, ref }: BookProps) {
  const { accent: accentColor, ink, tint, text } = ACCENTS[accent];
  const style: AccentStyle = {
    '--accent': accentColor,
    '--accent-ink': ink,
    '--accent-tint': tint,
    '--accent-text': text === 'paper' ? 'var(--color-paper)' : 'var(--color-ink)',
    // Highlighter bars: the full ink for cyan and yellow, the tint otherwise.
    '--mark-bg': text === 'ink' ? accentColor : tint,
  };

  return (
    <div className="book" style={style} ref={ref}>
      {children}
    </div>
  );
}
