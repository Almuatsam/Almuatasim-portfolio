import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './coming-soon.css';

export function ComingSoonContext({ lang, chapter }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="coming-soon__context">
      <h1 className="font-display coming-soon__title reveal-fade-slow">{t(`chapters.${chapter.id}.title`)}</h1>
      <p className="coming-soon__body reveal-fade">{t('common.comingSoon.body')}</p>
      <Link className="coming-soon__back reveal-fade" to={chapterPath(lang, 'contents')}>
        {t('common.comingSoon.back')}
      </Link>
    </div>
  );
}

export function ComingSoonWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="coming-soon__work" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="coming-soon__sketch">
        <circle
          className="reveal-fade"
          cx="80"
          cy="80"
          r="46"
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth="1.5"
          strokeDasharray="4 7"
        />
        <path
          className="reveal-sketch"
          d="M60 86c6 10 34 10 40 0"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          style={{ '--draw-length': 60 } as CSSProperties}
        />
      </svg>
      <p className="coming-soon__note font-hand reveal-fade">{t('common.comingSoon.title')}</p>
    </div>
  );
}
