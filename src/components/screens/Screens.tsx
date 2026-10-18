import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, getChapter, type ChapterId } from '../../content/chapters';
import { ACCENTS } from '../../content/accents';
import { getProject } from '../../content/projects';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './screens.css';

const PROJECT_IDS: ChapterId[] = ['estudioa', 'apos', 'padelaura', 'papitoooo'];

export function ScreensContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="screens__context">
      <h1 className="font-display screens__heading reveal-fade-slow">{t('screens.heading')}</h1>
      <p className="screens__intro reveal-fade">{t('screens.intro')}</p>
      <ul className="screens__list">
        {PROJECT_IDS.map((id, index) => {
          const style: CSSProperties = { '--word-index': index, '--word-stagger': '80ms', '--reveal-base': '350ms' } as CSSProperties;
          return (
            <li key={id} className="screens__item reveal-word" style={style}>
              <Link to={chapterPath(lang, id)} className="screens__link">
                <span className="screens__link-title">{t(`chapters.${id}.title`)}</span>
                <span className="screens__link-desc">{t(`screens.cards.${id}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ScreensWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="screens__work">
      <div className="screens__cards">
        {PROJECT_IDS.map((id) => {
          const chapter = getChapter(id);
          const project = getProject(id as 'estudioa' | 'apos' | 'padelaura' | 'papitoooo');
          const accent = ACCENTS[chapter.accent];
          const style: CSSProperties = { '--card-accent': accent.accent } as CSSProperties;

          return (
            <Link key={id} to={chapterPath(lang, id)} className="screens__card reveal-fade" style={style}>
              <img src={project.images[0].src} alt={t(`chapters.${id}.title`)} className="screens__card-img" />
              <span className="screens__card-title">{t(`chapters.${id}.title`)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
