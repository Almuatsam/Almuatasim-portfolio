import type { CSSProperties, ReactNode, Ref } from 'react';
import './flip-page.css';

interface FlipPageProps {
  children: ReactNode;
  folio?: string;
  mirrorContent?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** One StPageFlip page. StPageFlip has no RTL mode, so the whole flip
 * container is mirrored with scaleX(-1) for Arabic (see BookFlipApp);
 * `mirrorContent` undoes that mirror on this page so its own text and
 * images still read normally, while the book still opens and turns
 * from the right. */
export function FlipPage({ children, folio, mirrorContent, ref }: FlipPageProps) {
  const style: CSSProperties | undefined = mirrorContent ? { transform: 'scaleX(-1)' } : undefined;
  return (
    <div className="flip-page" ref={ref}>
      <div className="flip-page__inner" style={style}>
        <div className="flip-page__content">{children}</div>
        {folio && (
          <p className="flip-page__folio font-mono tabular-nums" aria-hidden="true">
            <bdi>{folio}</bdi>
          </p>
        )}
      </div>
    </div>
  );
}
