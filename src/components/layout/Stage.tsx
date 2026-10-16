import type { ReactNode } from 'react';
import './stage.css';

interface StageProps {
  children: ReactNode;
}

export function Stage({ children }: StageProps) {
  return <div className="stage">{children}</div>;
}
