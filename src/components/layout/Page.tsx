import type { ReactNode } from 'react';
import './page.css';

interface PageProps {
  children: ReactNode;
  folio?: string;
  className?: string;
}

export function Page({ children, folio, className }: PageProps) {
  return (
    <section className={`page paper-texture${className ? ` ${className}` : ''}`}>
      <div className="page__content">{children}</div>
      {folio && (
        <p className="page__folio font-mono tabular-nums" aria-hidden="true">
          <bdi>{folio}</bdi>
        </p>
      )}
    </section>
  );
}
