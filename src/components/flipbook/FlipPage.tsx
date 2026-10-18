import type { CSSProperties, ReactNode, Ref } from 'react';
import { ScrollArea } from './ScrollArea';
import './flip-page.css';

interface FlipPageProps {
  children: ReactNode;
  folio?: string;
  mirrorContent?: boolean;
  /** Unique id for this page's scroll-reset registration (see
   * scrollRegistry) and its accessible name / "Scroll" hint text,
   * per Page Scrolling.md. */
  scrollKey: string;
  scrollLabel: string;
  scrollHint: string;
  ref?: Ref<HTMLDivElement>;
}

/** One StPageFlip page. StPageFlip has no RTL mode, so the whole flip
 * container is mirrored with scaleX(-1) for Arabic (see BookFlipApp);
 * `mirrorContent` undoes that mirror on this page so its own text and
 * images still read normally, while the book still opens and turns
 * from the right.
 *
 * The page margins and folio are a fixed frame; only the content inside
 * them scrolls (Page Scrolling.md section 1), via ScrollArea. */
export function FlipPage({ children, folio, mirrorContent, scrollKey, scrollLabel, scrollHint, ref }: FlipPageProps) {
  const style: CSSProperties | undefined = mirrorContent ? { transform: 'scaleX(-1)' } : undefined;
  return (
    <div className="flip-page" ref={ref}>
      <div className="flip-page__inner" style={style}>
        <div className="flip-page__content">
          <ScrollArea scrollKey={scrollKey} label={scrollLabel} hint={scrollHint}>
            {children}
          </ScrollArea>
        </div>
        {folio && (
          <p className="flip-page__folio font-mono tabular-nums" aria-hidden="true">
            <bdi>{folio}</bdi>
          </p>
        )}
      </div>
    </div>
  );
}
