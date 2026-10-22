import type { ReactNode } from 'react';
import './stage.css';

interface StageProps {
  children: ReactNode;
}

export function Stage({ children }: StageProps) {
  return (
    <main className="stage" id="main">
      {children}
    </main>
  );
}
