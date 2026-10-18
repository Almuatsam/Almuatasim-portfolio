import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ACCENTS } from '../../content/accents';
import { chapterPath, type ChapterDef } from '../../content/chapters';
import { allTabs, isTabActive, tabAccent } from '../../content/navigation';
import type { SupportedLang } from '../../i18n';
import './index-tabs.css';

interface IndexTabsProps {
  lang: SupportedLang;
  chapter: ChapterDef;
}

interface TabStyle extends CSSProperties {
  '--tab-accent': string;
  '--tab-ink': string;
}

export function IndexTabs({ lang, chapter }: IndexTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="index-tabs">
      {allTabs().map((tab) => {
        const active = isTabActive(tab, chapter.id);
        const accentKey = tabAccent(tab, chapter);
        const { accent, ink } = ACCENTS[accentKey];
        const style: TabStyle = { '--tab-accent': accent, '--tab-ink': ink };

        return (
          <Link
            key={tab.chapterId}
            to={chapterPath(lang, tab.chapterId)}
            className={`index-tabs__tab${active ? ' index-tabs__tab--active' : ''}`}
            style={style}
            aria-current={active ? 'page' : undefined}
          >
            <span className="index-tabs__label">{t(`chapters.${tab.chapterId}.tabLabel`)}</span>
          </Link>
        );
      })}
    </div>
  );
}
