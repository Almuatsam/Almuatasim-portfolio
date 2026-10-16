import type { ReactNode } from 'react';
import { Page } from './Page';
import './open-spread.css';

interface OpenSpreadProps {
  context: ReactNode;
  work: ReactNode;
  contextFolio?: string;
  workFolio?: string;
}

/** B2 — left page = context (choose), right page = the work (see).
 * In Arabic this mirrors automatically: DOM order stays the same,
 * only the visual side changes because the book inherits dir="rtl". */
export function OpenSpread({ context, work, contextFolio, workFolio }: OpenSpreadProps) {
  return (
    <div className="open-spread">
      <Page className="open-spread__page" folio={contextFolio}>
        {context}
      </Page>
      <div className="open-spread__gutter" aria-hidden="true" />
      <Page className="open-spread__page" folio={workFolio}>
        {work}
      </Page>
    </div>
  );
}
