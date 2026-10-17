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
import { CHAPTERS, chapterPath, type ChapterDef } from '../../content/chapters';
import { folioFor } from '../../content/navigation';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './stpageflip-base.css';
import './flipbook.css';

const CONTENT_CHAPTERS = CHAPTERS.filter((c) => c.id !== 'cover');
const TOTAL_PAGES = 1 + CONTENT_CHAPTERS.length * 2 + 1; // cover + chapters*2 + blank back cover

function pageIndexForChapter(chapterId: string): number {
  if (chapterId === 'cover') return 0;
  const i = CONTENT_CHAPTERS.findIndex((c) => c.id === chapterId);
  return i < 0 ? 0 : 1 + i * 2;
}

function chapterForPageIndex(pageIndex: number): ChapterDef {
  if (pageIndex <= 0) return CHAPTERS[0];
  const i = Math.min(Math.floor((pageIndex - 1) / 2), CONTENT_CHAPTERS.length - 1);
  return CONTENT_CHAPTERS[i];
}

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
    for (const ch of CONTENT_CHAPTERS) {
      const folio = t('common.folio', {
        current: String(folioFor(ch).current).padStart(2, '0'),
        total: String(folioFor(ch).total).padStart(2, '0'),
      });
      const ContextComponent = contextComponentFor(ch.id);
      const WorkComponent = workComponentFor(ch.id);
      items.push(
        <FlipPage key={`${ch.id}-context`} folio={folio} mirrorContent={isRtl}>
          <ContextComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
      items.push(
        <FlipPage key={`${ch.id}-work`} folio={folio} mirrorContent={isRtl}>
          <WorkComponent lang={lang} chapter={ch} />
        </FlipPage>,
      );
    }
    items.push(<div className="flip-page flip-page--back-cover" key="back-cover" />);
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isRtl, t, use3D, handleOpen]);

  return (
    <Book accent={chapter.accent}>
      <div className={`flipbook-stage${isRtl ? ' flipbook-stage--rtl' : ''}`}>
        <div className="flipbook-stage__mirror">
          <HTMLFlipBook
            key={lang}
            ref={flipBookRef}
            className=""
            style={{}}
            width={1160}
            height={760}
            size="stretch"
            minWidth={320}
            maxWidth={1160}
            minHeight={210}
            maxHeight={760}
            startPage={pageIndexForChapter(chapter.id)}
            drawShadow
            flippingTime={1000}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.35}
            showCover
            mobileScrollSupport={false}
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

export { TOTAL_PAGES };
