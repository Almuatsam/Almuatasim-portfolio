import type { ReactNode } from 'react';
import { DeskProps } from '../props/DeskProps';
import './stage.css';

interface StageProps {
  children: ReactNode;
}

export function Stage({ children }: StageProps) {
  return (
    <div className="stage">
      <DeskProps />
      {children}
    </div>
  );
}
