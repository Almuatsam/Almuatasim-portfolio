import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PencilArrow } from '../icons/PencilArrow';
import { ACCENTS } from '../../content/accents';
import { chapterPath, type ChapterDef } from '../../content/chapters';
import { nextChapter, previousChapter } from '../../content/navigation';
import type { SupportedLang } from '../../i18n';
import './chapter-arrows.css';

interface ChapterArrowsProps {
  lang: SupportedLang;
  chapter: ChapterDef;
}

export function ChapterArrows({ lang, chapter }: ChapterArrowsProps) {
  const { t } = useTranslation();
  const isRtl = lang === 'ar';
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
          aria-label={t('common.arrowBack', { chapter: t(`chapters.${prev.id}.title`) })}
        >
          <PencilArrow pointing="back" isRtl={isRtl} color={ACCENTS[prev.accent].ink} />
          <span className="chapter-arrows__label font-hand">{destinationLabel(prev.id)}</span>
        </Link>
      )}
      {next && (
        <Link
          to={chapterPath(lang, next.id)}
          className="chapter-arrows__button chapter-arrows__button--forward"
          aria-label={t('common.arrowForward', { chapter: t(`chapters.${next.id}.title`) })}
        >
          <PencilArrow pointing="forward" isRtl={isRtl} color={ACCENTS[next.accent].ink} />
          <span className="chapter-arrows__label font-hand">{destinationLabel(next.id)}</span>
        </Link>
      )}
    </nav>
  );
}
