import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Book } from '../layout/Book';
import { IndexTabs } from '../book/IndexTabs';
import { ChapterArrows } from '../book/ChapterArrows';
import { FlipPage } from './FlipPage';
import { Cover2D } from '../cover/Cover2D';
import { Link } from 'react-router-dom';
import { useBookBox } from '../../hooks/useBookBox';
import { useSwipeTurn } from '../../hooks/useSwipeTurn';
import { CoverCanvasLoader } from '../book3d/CoverCanvasLoader';
import { preloadCoverScene } from '../../lib/preloadCoverScene';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { contextComponentFor, onePageComponentFor, workComponentFor } from '../../routes/chapterContent';
import { CHAPTERS, chapterPath, type ChapterId } from '../../content/chapters';
import { ONE_PAGE_ON_PHONES, chapterForPageIndex, contextFolio, pageIndexForChapter, setPhoneLayout, totalPages, workFolio } from '../../content/navigation';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePreloadSoriaFont } from '../../hooks/usePreloadSoriaFont';
import { useChapterKeyboardNav } from '../../hooks/useChapterKeyboardNav';
import { useScrollKeys } from '../../hooks/useScrollKeys';
import { resetScrollArea } from '../../lib/scrollRegistry';
import { initCurrentPage, setCurrentPage, widenBuildRadius } from '../../lib/currentPageStore';
import './stpageflip-base.css';
import './flipbook.css';

// The page-turn engine is its own chunk, so the cover can paint without it.
const HTMLFlipBook = lazy(() => import('react-pageflip'));

const SETTLE_BEFORE_PREBUILD_MS = 7000;

const CONTENT_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'cover');

interface PageFlipLike {
  flip: (page: number) => void;
  flipNext: () => void;
  flipPrev: () => void;
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
  // Below 900px the book is a single page: the context page, then the
  // work page, each its own StPageFlip page (Mobile Pass.md).
  const isMobile = !isWideEnough;
  // Page numbers depend on the layout (see ONE_PAGE_ON_PHONES), and the page
  // numbers are read while rendering, so set it first.
  setPhoneLayout(isMobile);
  const [bookElement, setBookElement] = useState<HTMLDivElement | null>(null);
  const box = useBookBox(isMobile, bookElement);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef<number | null>(null);
  const [pageIndex, setPageIndexState] = useState(() => {
    const start = pageIndexForChapter(chapter.id);
    initCurrentPage(start);
    return start;
  });
  const setPageIndex = useCallback((page: number) => {
    setPageIndexState(page);
    setCurrentPage(page);
  }, []);

  const flipBookRef = useRef<FlipBookRef | null>(null);
  const lastSyncedChapterId = useRef<string>(chapter.id);
  // The chapter a link or the chapter arrows asked for. StPageFlip turns
  // one spread at a time, so a jump over several chapters reports each
  // intermediate spread through onFlip; those must keep turning toward
  // this target instead of rewriting the URL to wherever they stopped.
  const routeTargetId = useRef<ChapterId | null>(null);
  const routeTargetPage = useRef<number | null>(null);
  const [opening3D, setOpening3D] = useState(false);
  const [fading3D, setFading3D] = useState(false);
  // Back to cover: the closing run mounts its own canvas (closeRun is its
  // key), starts in the open pose over the spread, then hides the spread.
  const [isClosing3D, setIsClosing3D] = useState(false);
  const [isSpreadHidden, setIsSpreadHidden] = useState(false);
  const [closeRun, setCloseRun] = useState(0);

  const isRtl = lang === 'ar';
  const isCover = chapter.id === 'cover';

  usePreloadSoriaFont(chapter.id);

  // Once the first page has had time to settle, build the pages around it in
  // idle time (turning a page earlier builds that page on the spot).
  useEffect(() => {
    let idleHandle: number | undefined;
    const timer = window.setTimeout(() => {
      if (window.requestIdleCallback) idleHandle = window.requestIdleCallback(() => widenBuildRadius(), { timeout: 4000 });
      else widenBuildRadius();
    }, SETTLE_BEFORE_PREBUILD_MS);
    return () => {
      window.clearTimeout(timer);
      if (idleHandle !== undefined && window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
    };
  }, []);

  useEffect(() => {
    if (chapter.id === 'contact' && use3D) preloadCoverScene();
  }, [chapter.id, use3D]);
  useChapterKeyboardNav(lang, chapter);
  useScrollKeys(chapter.id !== 'cover');

  const flipTo = useCallback((page: number, isInstant = false) => {
    const pageFlip = flipBookRef.current?.pageFlip();
    if (!pageFlip) return;
    if (isInstant) pageFlip.turnToPage(page);
    else pageFlip.flip(page);
  }, []);

  const handleOpen = useCallback(() => {
    if (isMobile) {
      // A simple fade, no 3D: the cover fades out over the first spread.
      flipBookRef.current?.pageFlip().turnToPage(pageIndexForChapter('contents'));
      currentPageRef.current = pageIndexForChapter('contents');
      setPageIndex(pageIndexForChapter('contents'));
      lastSyncedChapterId.current = 'contents';
      setFading3D(true);
      window.setTimeout(() => {
        navigate(chapterPath(lang, 'contents'), { replace: true });
        setFading3D(false);
      }, 260);
      return;
    }
    if (!use3D) {
      navigate(chapterPath(lang, 'contents'));
      return;
    }
    setOpening3D(true);
  }, [isMobile, use3D, navigate, lang, setPageIndex]);

  const handleBackToCover = useCallback(() => {
    if (!use3D) {
      navigate(chapterPath(lang, 'cover'));
      return;
    }
    setCloseRun((run) => run + 1);
    setIsClosing3D(true);
  }, [use3D, navigate, lang]);

  const handleCloseReady = useCallback(() => {
    // Let the canvas fade in over the spread, then take the spread away.
    window.setTimeout(() => setIsSpreadHidden(true), 220);
  }, []);

  const handle3DClosed = useCallback(() => {
    navigate(chapterPath(lang, 'cover'));
    setIsClosing3D(false);
    setIsSpreadHidden(false);
  }, [navigate, lang]);

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
      currentPageRef.current = e.data;
      setPageIndex(e.data);
      const target = chapterForPageIndex(e.data);
      // Page Scrolling.md section 1 — the reader always arrives at a
      // chapter scrolled to the top, however they got there.
      resetScrollArea(`${target.id}-context`);
      resetScrollArea(`${target.id}-work`);
      const routeTarget = routeTargetId.current;
      if (routeTarget) {
        const targetPage = routeTargetPage.current ?? pageIndexForChapter(routeTarget);
        const hasArrived = isMobile ? e.data === targetPage : target.id === routeTarget;
        if (!hasArrived) {
          flipBookRef.current?.pageFlip().flip(targetPage);
          return;
        }
        routeTargetId.current = null;
        routeTargetPage.current = null;
      }
      if (target.id === lastSyncedChapterId.current) return;
      lastSyncedChapterId.current = target.id;
      navigate(chapterPath(lang, target.id), { replace: true });
    },
    [navigate, lang, isMobile, setPageIndex],
  );

  useEffect(() => {
    if (chapter.id === lastSyncedChapterId.current) return;
    if (chapter.id === 'cover') {
      lastSyncedChapterId.current = 'cover';
      return;
    }
    lastSyncedChapterId.current = chapter.id;
    const pageFlip = flipBookRef.current?.pageFlip();
    const targetPage = pageIndexForChapter(chapter.id);
    // Only wait for onFlip if a turn will actually happen.
    const currentIndex = pageFlip ? pageFlip.getCurrentPageIndex() : targetPage;
    const isAlreadyThere = isMobile ? currentIndex === targetPage : chapterForPageIndex(currentIndex).id === chapter.id;
    routeTargetId.current = isAlreadyThere ? null : chapter.id;
    routeTargetPage.current = isAlreadyThere ? null : targetPage;
    if (isMobile && Math.abs(currentIndex - targetPage) > 2) {
      // A tab jump across the book: turn straight there, not page by page.
      routeTargetId.current = null;
      routeTargetPage.current = null;
      flipTo(targetPage, true);
      currentPageRef.current = targetPage;
      setPageIndex(targetPage);
    } else {
      pageFlip?.flip(targetPage);
    }
    resetScrollArea(`${chapter.id}-context`);
    resetScrollArea(`${chapter.id}-work`);
  }, [chapter.id, isMobile, flipTo, setPageIndex]);

  // Mobile: one step is one page. The chapter changes (and the address
  // with it) when the step crosses into another chapter's pages.
  const stepMobile = useCallback(
    (direction: 1 | -1) => {
      const pageFlip = flipBookRef.current?.pageFlip();
      if (!pageFlip) return;
      const current = pageFlip.getCurrentPageIndex();
      const next = current + direction;
      if (next < 1) {
        navigate(chapterPath(lang, 'cover'));
        return;
      }
      if (next > totalPages()) return;
      if (direction === 1) pageFlip.flipNext();
      else pageFlip.flipPrev();
    },
    [navigate, lang],
  );

  useSwipeTurn(stageRef, isMobile && !isCover, isRtl, stepMobile);

  const pages = useMemo(() => {
    const items = [];
    items.push(
      <div className="flip-page flip-page--cover" key="cover">
        {/* When the 3D canvas is eligible, it fully overlays this page
            (see .flipbook-cover3d below) — rendering the 2D cover here
            too would just show through the canvas's transparent areas
            at StPageFlip's own (misaligned) single-page position. */}
        {!use3D && !isMobile && <Cover2D onOpen={handleOpen} />}
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
      if (isMobile && ONE_PAGE_ON_PHONES.includes(ch.id)) {
        // Control and result on one page: this chapter is a single page here.
        const OnePageComponent = onePageComponentFor(ch.id);
        items.push(
          <FlipPage
            key={`${ch.id}-context`}
            folio={leftFolio}
            pageIndex={pageIndexForChapter(ch.id)}
            mirrorContent={isRtl}
            scrollKey={`${ch.id}-context`}
            scrollLabel={contextLabel}
            scrollHint={scrollHint}
            srHeading={undefined}
          >
            <OnePageComponent lang={lang} chapter={ch} />
          </FlipPage>,
        );
        continue;
      }
      items.push(
        <FlipPage
          key={`${ch.id}-context`}
          folio={leftFolio}
          pageIndex={pageIndexForChapter(ch.id)}
          mirrorContent={isRtl}
          scrollKey={`${ch.id}-context`}
          scrollLabel={contextLabel}
          scrollHint={scrollHint}
          // About's notes page has no heading of its own (its headline is on the facing page).
          srHeading={isMobile && ch.id === 'about' ? chapterTitle : undefined}
        >
          <ContextComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
      items.push(
        <FlipPage
          key={`${ch.id}-work`}
          folio={rightFolio}
          pageIndex={pageIndexForChapter(ch.id) + 1}
          mirrorContent={isRtl}
          scrollKey={`${ch.id}-work`}
          scrollLabel={workLabel}
          scrollHint={scrollHint}
          srHeading={isMobile ? chapterTitle : undefined}
        >
          <WorkComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
    }
    items.push(<div className="flip-page flip-page--back-cover" key="back-cover" />);
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isRtl, t, use3D, isMobile, handleOpen]);

  const hide3DBookBehindCover = (isCover && (use3D || isMobile) && !fading3D) || (isClosing3D && isSpreadHidden);
  // Mobile has no 3D scene and a book box of its own shape, so it waits
  // for the first measurement before building the flipbook.
  const isBoxReady = !isMobile || box !== null;
  const pageWidth = isMobile && box ? box.width : 580;
  const pageHeight = isMobile && box ? box.height : 760;

  return (
    <Book accent={chapter.accent} ref={setBookElement}>
      <div ref={stageRef} className={`flipbook-stage${isRtl ? ' flipbook-stage--rtl' : ''}`}>
        <div className={`flipbook-stage__mirror${hide3DBookBehindCover ? ' flipbook-stage__mirror--hidden' : ''}`}>
          {isBoxReady && (
            <Suspense fallback={null}>
            <HTMLFlipBook
              key={`${lang}-${isMobile ? `${pageWidth}x${pageHeight}` : 'spread'}`}
              ref={flipBookRef}
              className=""
              style={{}}
              // StPageFlip's width/height are the size of ONE PAGE, not the
              // spread (see its README). On desktop the spread is two pages,
              // so the page is half-width: 580x760. On mobile the page is the
              // measured book box itself, so "stretch" fills it exactly.
              width={pageWidth}
              height={pageHeight}
              size="stretch"
              // The minimum page width is the box itself on mobile: the engine
              // shows a two-page spread whenever twice the minimum fits.
              minWidth={isMobile ? pageWidth : 290}
              maxWidth={isMobile ? 2000 : 580}
              minHeight={isMobile ? 200 : 380}
              maxHeight={isMobile ? 3000 : 760}
              startPage={currentPageRef.current ?? pageIndexForChapter(chapter.id)}
              drawShadow
              flippingTime={isMobile ? 600 : 1000}
              usePortrait
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.35}
              showCover
              // Page Scrolling.md section 3 - let touchmove distinguish a
              // vertical scroll from a horizontal page-turn swipe instead
              // of always calling preventDefault on touch.
              mobileScrollSupport
              swipeDistance={30}
              clickEventForward
              // On mobile the turns come from our own swipe handler (it
              // mirrors the direction in Arabic and never fights a
              // vertical scroll or a drag), so the engine's own pointer
              // handling is off.
              useMouseEvents={!isCover && !isMobile}
              showPageCorners={!isCover && !isMobile}
              disableFlipByClick={isCover}
              onFlip={handleFlip}
            >
              {pages}
            </HTMLFlipBook>
            </Suspense>
          )}
        </div>

        {isCover && use3D && <h1 className="sr-only">{t('cover.nameLatin')}</h1>}

        {(isCover || isClosing3D) && use3D && (
          <button
            type="button"
            className={`flipbook-cover3d${fading3D ? ' flipbook-cover3d--fading' : ''}${isClosing3D ? ' flipbook-cover3d--closing' : ''}`}
            disabled={isClosing3D}
            onClick={() => {
              if (!opening3D) handleOpen();
            }}
            aria-label={t('common.openBook')}
          >
            <CoverCanvasLoader
              key={closeRun}
              lang={lang}
              isOpening={opening3D}
              onOpened={handle3DOpened}
              isClosing={isClosing3D}
              onClosed={handle3DClosed}
              onReady={isClosing3D ? handleCloseReady : undefined}
            />
          </button>
        )}

        {isCover && isMobile && (
          <div className={`flipbook-cover2d${fading3D ? ' flipbook-cover2d--fading' : ''}`}>
            <div className="flipbook-cover2d__book">
              <Cover2D onOpen={handleOpen} />
            </div>
            <p className="flipbook-cover2d__hint">{t('cover.openHint')}</p>
            <Link to={`/${lang}/plain`} className="flipbook-cover2d__plain">
              {t('common.plainVersion.label')}
            </Link>
          </div>
        )}

        {isCover && !isMobile && <p className="flipbook-stage__hint">{t('cover.openHint')}</p>}
      </div>

      {!isCover && !isClosing3D && (
        <>
          <IndexTabs lang={lang} chapter={chapter} isMobile={isMobile} />
          <ChapterArrows
            lang={lang}
            chapter={chapter}
            onBackToCover={handleBackToCover}
            mobile={isMobile ? { pageIndex, lastIndex: totalPages(), onStep: stepMobile } : undefined}
          />
        </>
      )}
    </Book>
  );
}
