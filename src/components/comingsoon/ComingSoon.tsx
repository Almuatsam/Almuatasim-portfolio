import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { chapterPath } from '../../content/chapters';
import './coming-soon.css';

export function ComingSoonContext() {
  const { t } = useTranslation();
  const { lang, chapter } = useCurrentChapter();

  return (
    <div className="coming-soon__context">
      <h1 className="font-display coming-soon__title">{t(`chapters.${chapter.id}.title`)}</h1>
      <p className="coming-soon__body">{t('common.comingSoon.body')}</p>
      <Link className="coming-soon__back" to={chapterPath(lang, 'contents')}>
        {t('common.comingSoon.back')}
      </Link>
    </div>
  );
}

export function ComingSoonWork() {
  const { t } = useTranslation();

  return (
    <div className="coming-soon__work" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="coming-soon__sketch">
        <circle cx="80" cy="80" r="46" fill="none" stroke="var(--accent-ink)" strokeWidth="1.5" strokeDasharray="4 7" />
        <path d="M60 86c6 10 34 10 40 0" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <p className="coming-soon__note font-hand">{t('common.comingSoon.title')}</p>
    </div>
  );
}
