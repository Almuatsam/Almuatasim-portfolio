import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Book } from '../layout/Book';
import { IndexTabs } from '../book/IndexTabs';
import { ChapterArrows } from '../book/ChapterArrows';
import { FlipPage } from './FlipPage';
import { Cover2D } from '../cover/Cover2D';
import { CoverCanvasLoader } from '../book3d/CoverCanvasLoader';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { contextComponentFor, workComponentFor } from '../../routes/chapterContent';
import { CHAPTERS, chapterPath } from '../../content/chapters';
import { pageIndexForChapter, chapterForPageIndex, contextFolio, workFolio } from '../../content/navigation';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePreloadSoriaFont } from '../../hooks/usePreloadSoriaFont';
import { resetScrollArea } from '../../lib/scrollRegistry';
import './stpageflip-base.css';
import './flipbook.css';

const CONTENT_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'cover');

interface PageFlipLike {
  flip: (page: number) => void;
  turnToPage: (page: number) => void;
  getCurrentPageIndex: () => number;
}

interface FlipBookRef {
  pageFlip: () => PageFlipLike;
}

/** B2/B6/B3 — the persistent open-book frame. Replaces the old
 * hand-rolled leaf flip with StPageFlip for every turn after the cover
 * opens, and a real 3D scene (React Three Fiber + GSAP) for the cover
 * opening itself. See Animation Libraries Prompt.md and
 * Phase 2 Review - Reset.md section 0.1. */
export function BookFlipApp() {
  const { lang, chapter } = useCurrentChapter();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasWebGL = useWebGLSupport();
  const isWideEnough = useMediaQuery('(min-width: 900px)');
  const use3D = hasWebGL && isWideEnough && !prefersReducedMotion;

  const flipBookRef = useRef<FlipBookRef | null>(null);
  const lastSyncedChapterId = useRef<string>(chapter.id);
  const [opening3D, setOpening3D] = useState(false);
  const [fading3D, setFading3D] = useState(false);

  const isRtl = lang === 'ar';
  const isCover = chapter.id === 'cover';

  usePreloadSoriaFont(chapter.id);

  const handleOpen = useCallback(() => {
    if (!use3D) {
      navigate(chapterPath(lang, 'contents'));
      return;
    }
    setOpening3D(true);
  }, [use3D, navigate, lang]);

  const handle3DOpened = useCallback(() => {
    flipBookRef.current?.pageFlip().turnToPage(pageIndexForChapter('contents'));
    lastSyncedChapterId.current = 'contents';
    setFading3D(true);
    window.setTimeout(() => {
      navigate(chapterPath(lang, 'contents'), { replace: true });
      setOpening3D(false);
      setFading3D(false);
    }, 220);
  }, [navigate, lang]);

  const handleFlip = useCallback(
    (e: { data: number }) => {
      const target = chapterForPageIndex(e.data);
      // Page Scrolling.md section 1 — the reader always arrives at a
      // chapter scrolled to the top, however they got there.
      resetScrollArea(`${target.id}-context`);
      resetScrollArea(`${target.id}-work`);
      if (target.id === lastSyncedChapterId.current) return;
      lastSyncedChapterId.current = target.id;
      navigate(chapterPath(lang, target.id), { replace: true });
    },
    [navigate, lang],
  );

  useEffect(() => {
    if (chapter.id === lastSyncedChapterId.current) return;
    if (chapter.id === 'cover') {
      lastSyncedChapterId.current = 'cover';
      return;
    }
    lastSyncedChapterId.current = chapter.id;
    flipBookRef.current?.pageFlip().flip(pageIndexForChapter(chapter.id));
    resetScrollArea(`${chapter.id}-context`);
    resetScrollArea(`${chapter.id}-work`);
  }, [chapter.id]);

  const pages = useMemo(() => {
    const items = [];
    items.push(
      <div className="flip-page flip-page--cover" key="cover">
        {/* When the 3D canvas is eligible, it fully overlays this page
            (see .flipbook-cover3d below) — rendering the 2D cover here
            too would just show through the canvas's transparent areas
            at StPageFlip's own (misaligned) single-page position. */}
        {!use3D && <Cover2D onOpen={handleOpen} />}
      </div>,
    );
    const scrollHint = t('common.scrollHint');
    for (const ch of CONTENT_CHAPTERS) {
      // Each page shows its own folio — the left (context) and right
      // (work) pages of a spread are never the same number.
      const leftFolio = String(contextFolio(ch)).padStart(2, '0');
      const rightFolio = String(workFolio(ch)).padStart(2, '0');
      const ContextComponent = contextComponentFor(ch.id);
      const WorkComponent = workComponentFor(ch.id);
      const chapterTitle = t(`chapters.${ch.id}.title`);
      const contextLabel = t('common.pageRegion', { chapter: chapterTitle, side: t('common.pageSideContext') });
      const workLabel = t('common.pageRegion', { chapter: chapterTitle, side: t('common.pageSideWork') });
      items.push(
        <FlipPage
          key={`${ch.id}-context`}
          folio={leftFolio}
          mirrorContent={isRtl}
          scrollKey={`${ch.id}-context`}
          scrollLabel={contextLabel}
          scrollHint={scrollHint}
        >
          <ContextComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
      items.push(
        <FlipPage
          key={`${ch.id}-work`}
          folio={rightFolio}
          mirrorContent={isRtl}
          scrollKey={`${ch.id}-work`}
          scrollLabel={workLabel}
          scrollHint={scrollHint}
        >
          <WorkComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
    }
    items.push(<div className="flip-page flip-page--back-cover" key="back-cover" />);
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isRtl, t, use3D, handleOpen]);

  const hide3DBookBehindCover = isCover && use3D && !fading3D;

  return (
    <Book accent={chapter.accent}>
      <div className={`flipbook-stage${isRtl ? ' flipbook-stage--rtl' : ''}`}>
        <div className={`flipbook-stage__mirror${hide3DBookBehindCover ? ' flipbook-stage__mirror--hidden' : ''}`}>
          <HTMLFlipBook
            key={lang}
            ref={flipBookRef}
            className=""
            style={{}}
            // StPageFlip's width/height are the size of ONE PAGE, not the
            // spread (see its README) — 1160x760 here made every page
            // 1160 wide, so two side by side rendered as a 2320x760
            // strip. The spread is two pages, so the page itself is
            // half-width: 580x760.
            width={580}
            height={760}
            size="stretch"
            minWidth={290}
            maxWidth={580}
            minHeight={380}
            maxHeight={760}
            startPage={pageIndexForChapter(chapter.id)}
            drawShadow
            flippingTime={1000}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.35}
            showCover
            // Page Scrolling.md section 3 — let touchmove distinguish a
            // vertical scroll from a horizontal page-turn swipe instead
            // of always calling preventDefault on touch.
            mobileScrollSupport
            swipeDistance={30}
            clickEventForward
            useMouseEvents={!isCover}
            showPageCorners={!isCover}
            disableFlipByClick={isCover}
            onFlip={handleFlip}
          >
            {pages}
          </HTMLFlipBook>
        </div>

        {isCover && use3D && (
          <button
            type="button"
            className={`flipbook-cover3d${fading3D ? ' flipbook-cover3d--fading' : ''}`}
            onClick={() => {
              if (!opening3D) handleOpen();
            }}
            aria-label={t('common.openBook')}
          >
            <CoverCanvasLoader lang={lang} isOpening={opening3D} onOpened={handle3DOpened} />
          </button>
        )}

        {isCover && <p className="flipbook-stage__hint">{t('cover.openHint')}</p>}
      </div>

      {!isCover && (
        <>
          <IndexTabs lang={lang} chapter={chapter} />
          <ChapterArrows lang={lang} chapter={chapter} />
        </>
      )}
    </Book>
  );
}
