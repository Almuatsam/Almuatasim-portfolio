import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, getChapter, type ChapterId } from '../../content/chapters';
import { contextFolio } from '../../content/navigation';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './contents.css';

interface TocItem {
  label: string;
  chapter: string;
}

interface TocSection {
  heading: string;
  items: TocItem[];
}

function useTocData(lang: ChapterPanelProps['lang']) {
  const t = useFixedT(lang);

  const frontMatter = t('contents.frontMatter', { returnObjects: true }) as TocItem;
  const partOne = t('contents.partOne', { returnObjects: true }) as TocSection;
  const partTwo = t('contents.partTwo', { returnObjects: true }) as TocSection;
  const closing = t('contents.closing', { returnObjects: true }) as TocSection;

  function renderItem(item: TocItem, index: number) {
    return renderTocItem(lang, item, index);
  }

  return { t, frontMatter, partOne, partTwo, closing, renderItem };
}

function renderTocItem(lang: ChapterPanelProps['lang'], item: TocItem, index: number) {
  const chapter = getChapter(item.chapter as ChapterId);
  // Reset section 3 — entries show just the page number, not "NN / total".
  const folio = String(contextFolio(chapter)).padStart(2, '0');
  const style: CSSProperties = {
    '--word-index': index,
    '--word-stagger': '70ms',
    '--reveal-base': '350ms',
  } as CSSProperties;

  return (
    <li key={item.chapter} className="contents__item reveal-word" style={style}>
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

export function ContentsContext({ lang }: ChapterPanelProps) {
  const { t, frontMatter, partOne, renderItem } = useTocData(lang);
  const items = [frontMatter, ...partOne.items];

  return (
    <div className="contents__context">
      <h1 className="font-display contents__heading reveal-fade-slow">{t('contents.heading')}</h1>
      <ul className="contents__list">{renderItem(items[0], 0)}</ul>
      <h2 className="font-display contents__part-heading reveal-fade">{partOne.heading}</h2>
      <ul className="contents__list">{items.slice(1).map((item, i) => renderItem(item, i + 1))}</ul>
    </div>
  );
}

export function ContentsWork({ lang }: ChapterPanelProps) {
  const { partTwo, closing, renderItem } = useTocData(lang);
  const items = [...partTwo.items, ...closing.items];

  return (
    <div className="contents__work">
      <h2 className="font-display contents__part-heading reveal-fade-slow">{partTwo.heading}</h2>
      <ul className="contents__list">{items.slice(0, partTwo.items.length).map((item, i) => renderItem(item, i))}</ul>
      <h2 className="font-display contents__part-heading reveal-fade">{closing.heading}</h2>
      <ul className="contents__list">
        {items.slice(partTwo.items.length).map((item, i) => renderItem(item, i + partTwo.items.length))}
      </ul>
    </div>
  );
}
