import type { CSSProperties, ReactNode } from 'react';
import { ACCENTS, type AccentKey } from '../../content/accents';
import './book.css';

interface BookProps {
  accent: AccentKey;
  children: ReactNode;
}

interface AccentStyle extends CSSProperties {
  '--accent': string;
  '--accent-ink': string;
  '--accent-tint': string;
  '--accent-text': string;
  '--mark-bg': string;
}

export function Book({ accent, children }: BookProps) {
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
    <div className="book" style={style}>
      {children}
    </div>
  );
}
