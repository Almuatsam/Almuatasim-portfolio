import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { chapterPath, getChapter, type ChapterId } from '../../content/chapters';
import { folioFor } from '../../content/navigation';
import './contents.css';

interface TocItem {
  label: string;
  chapter: string;
}

interface TocSection {
  heading: string;
  items: TocItem[];
}

function useTocData() {
  const { t } = useTranslation();
  const { lang } = useCurrentChapter();

  const frontMatter = t('contents.frontMatter', { returnObjects: true }) as TocItem;
  const partOne = t('contents.partOne', { returnObjects: true }) as TocSection;
  const partTwo = t('contents.partTwo', { returnObjects: true }) as TocSection;
  const closing = t('contents.closing', { returnObjects: true }) as TocSection;

  function renderItem(item: TocItem) {
    const chapter = getChapter(item.chapter as ChapterId);
    const { current, total } = folioFor(chapter);
    const folio = t('common.folio', { current: String(current).padStart(2, '0'), total: String(total).padStart(2, '0') });

    return (
      <li key={item.chapter} className="contents__item">
        <Link to={chapterPath(lang, chapter.id)} className="contents__link">
          <span className="contents__label">{item.label}</span>
          <span className="contents__leader" aria-hidden="true" />
          <span className="contents__folio font-mono tabular-nums">
            <bdi>{folio}</bdi>
          </span>
        </Link>
      </li>
    );
  }

  return { t, frontMatter, partOne, partTwo, closing, renderItem };
}

export function ContentsContext() {
  const { t, frontMatter, partOne, renderItem } = useTocData();

  return (
    <div className="contents__context">
      <h1 className="font-display contents__heading">{t('contents.heading')}</h1>
      <ul className="contents__list">{renderItem(frontMatter)}</ul>
      <h2 className="font-display contents__part-heading">{partOne.heading}</h2>
      <ul className="contents__list">{partOne.items.map(renderItem)}</ul>

      <svg className="contents__sketch contents__sketch--phone" viewBox="0 0 90 90" aria-hidden="true">
        <rect x="28" y="8" width="34" height="60" rx="6" fill="none" stroke="var(--color-secondary)" strokeWidth="1.4" />
        <path d="M34 20h22M34 28h22M34 36h14" stroke="var(--color-secondary)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ContentsWork() {
  const { partTwo, closing, renderItem } = useTocData();

  return (
    <div className="contents__work">
      <h2 className="font-display contents__part-heading">{partTwo.heading}</h2>
      <ul className="contents__list">{partTwo.items.map(renderItem)}</ul>
      <h2 className="font-display contents__part-heading">{closing.heading}</h2>
      <ul className="contents__list">{closing.items.map(renderItem)}</ul>

      <svg className="contents__sketch contents__sketch--thread" viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="45" r="22" fill="none" stroke="var(--color-secondary)" strokeWidth="1.4" />
        <path
          d="M45 23c-9 6-9 34 0 44M45 23c9 6 9 34 0 44"
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="1.1"
        />
        <path d="M60 60c6 4 10 10 10 18" fill="none" stroke="var(--accent-ink)" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
