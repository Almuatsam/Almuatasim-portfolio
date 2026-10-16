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
}

export function Book({ accent, children }: BookProps) {
  const { accent: accentColor, ink } = ACCENTS[accent];
  const style: AccentStyle = {
    '--accent': accentColor,
    '--accent-ink': ink,
  };

  return (
    <div className="book" style={style}>
      {children}
    </div>
  );
}
