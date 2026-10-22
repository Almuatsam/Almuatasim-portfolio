import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PencilArrow } from '../icons/PencilArrow';
import { ACCENTS } from '../../content/accents';
import { chapterPath, type ChapterDef } from '../../content/chapters';
import { nextChapter, previousChapter } from '../../content/navigation';
import type { SupportedLang } from '../../i18n';
import './chapter-arrows.css';

interface MobileSteps {
  /** The StPageFlip page the reader is on (1 is the first content page). */
  pageIndex: number;
  /** The last content page: forward from here goes back to the cover. */
  lastIndex: number;
  onStep: (direction: 1 | -1) => void;
}

interface ChapterArrowsProps {
  lang: SupportedLang;
  chapter: ChapterDef;
  /** The arrow after the last chapter: plays the cover closing. */
  onBackToCover: () => void;
  /** On phones each arrow moves one page (context, then work). */
  mobile?: MobileSteps;
}

export function ChapterArrows({ lang, chapter, onBackToCover, mobile }: ChapterArrowsProps) {
  const { t } = useTranslation();
  const isRtl = lang === 'ar';
  const ink = ACCENTS[chapter.accent].ink;

  if (mobile) {
    const isLast = mobile.pageIndex >= mobile.lastIndex;
    return (
      <nav className="chapter-arrows chapter-arrows--mobile" aria-label={t('common.pageArrows')}>
        <button
          type="button"
          className="chapter-arrows__button chapter-arrows__button--back"
          onClick={() => mobile.onStep(-1)}
          aria-label={t('common.previousPage')}
        >
          <span className="chapter-arrows__icon" style={{ borderColor: ink }}>
            <PencilArrow pointing="back" isRtl={isRtl} color={ink} />
          </span>
        </button>
        <button
          type="button"
          className="chapter-arrows__button chapter-arrows__button--forward"
          onClick={isLast ? onBackToCover : () => mobile.onStep(1)}
          aria-label={isLast ? t('common.backToCover') : t('common.nextPage')}
        >
          <span className="chapter-arrows__icon" style={{ borderColor: ink }}>
            <PencilArrow pointing="forward" isRtl={isRtl} color={ink} />
          </span>
          {isLast && <span className="chapter-arrows__label">{t('common.backToCover')}</span>}
        </button>
      </nav>
    );
  }

  const prev = previousChapter(chapter);
  const next = nextChapter(chapter);

  function destinationLabel(id: string): string {
    const short = t(`chapters.${id}.tabLabel`);
    return short ? short : t(`chapters.${id}.title`);
  }

  return (
    <nav className="chapter-arrows" aria-label={t('chapters.contents.title') ?? 'Chapters'}>
      {prev && (
        <Link
          to={chapterPath(lang, prev.id)}
          className="chapter-arrows__button chapter-arrows__button--back"
          aria-label={t('common.arrowBack', { chapter: destinationLabel(prev.id) })}
        >
          <span className="chapter-arrows__icon" style={{ borderColor: ACCENTS[prev.accent].ink }}>
            <PencilArrow pointing="back" isRtl={isRtl} color={ACCENTS[prev.accent].ink} />
          </span>
          <span className="chapter-arrows__label">{destinationLabel(prev.id)}</span>
        </Link>
      )}
      {next && (
        <Link
          to={chapterPath(lang, next.id)}
          className="chapter-arrows__button chapter-arrows__button--forward"
          aria-label={t('common.arrowForward', { chapter: destinationLabel(next.id) })}
        >
          <span className="chapter-arrows__icon" style={{ borderColor: ACCENTS[next.accent].ink }}>
            <PencilArrow pointing="forward" isRtl={isRtl} color={ACCENTS[next.accent].ink} />
          </span>
          <span className="chapter-arrows__label">{destinationLabel(next.id)}</span>
        </Link>
      )}
      {!next && (
        <button
          type="button"
          className="chapter-arrows__button chapter-arrows__button--forward"
          onClick={onBackToCover}
          aria-label={t('common.backToCover')}
        >
          <span className="chapter-arrows__icon" style={{ borderColor: ink }}>
            <PencilArrow pointing="forward" isRtl={isRtl} color={ink} />
          </span>
          <span className="chapter-arrows__label">{t('common.backToCover')}</span>
        </button>
      )}
    </nav>
  );
}
