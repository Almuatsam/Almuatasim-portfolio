import { lazy, Suspense, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { useCurrentPage } from '../../lib/currentPageStore';
import './flip-page.css';

// Scrolling (OverlayScrollbars, Lenis) loads with the first built page.
const ScrollArea = lazy(() => import('./ScrollArea').then((m) => ({ default: m.ScrollArea })));

/** How many pages either side of the reader's own get built ahead of time. */
const BUILD_AHEAD = 3;

interface FlipPageProps {
  children: ReactNode;
  folio?: string;
  /** This page's StPageFlip index; content is built once it is near. */
  pageIndex: number;
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
 * them scrolls (Page Scrolling.md section 1), via ScrollArea. The content
 * is built the first time the reader comes within a few pages of it, and
 * kept after that. */
export function FlipPage({ children, folio, pageIndex, mirrorContent, scrollKey, scrollLabel, scrollHint, ref }: FlipPageProps) {
  const style: CSSProperties | undefined = mirrorContent ? { transform: 'scaleX(-1)' } : undefined;
  const currentPage = useCurrentPage();
  const [isBuilt, setIsBuilt] = useState(false);
  const isNear = Math.abs(currentPage - pageIndex) <= BUILD_AHEAD;
  if (isNear && !isBuilt) setIsBuilt(true);

  return (
    <div className="flip-page" ref={ref}>
      <div className="flip-page__inner" style={style}>
        <div className="flip-page__content">
          {(isBuilt || isNear) && (
            <Suspense fallback={null}>
              <ScrollArea scrollKey={scrollKey} label={scrollLabel} hint={scrollHint}>
                <Suspense fallback={null}>{children}</Suspense>
              </ScrollArea>
            </Suspense>
          )}
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
