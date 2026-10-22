import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, type ChapterId } from '../../content/chapters';
import { ONSET_THUMBNAILS } from '../../content/onset';
import { ImageCredit } from './ImageCredit';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './onset.css';

type OnSetCardId = 'qalb' | 'amouage' | 'press';

const CARD_IDS: OnSetCardId[] = ['qalb', 'amouage', 'press'];

function thumbnailFor(id: OnSetCardId) {
  return id === 'press' ? null : ONSET_THUMBNAILS[id];
}

/** The On Set index — mirrors Sewing.tsx. The chapter's own intro
 * (B4 blockquote) sits above the list; the three entries open Qalb
 * Mahmood, Amouage and the press spread. */
export function OnSetContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="onset__index-context">
      <h1 className="font-display onset__heading reveal-fade-slow">{t('chapters.onset.title')}</h1>
      <p className="onset__intro reveal-fade">{t('onset.intro')}</p>
      <p className="onset__index-intro reveal-fade">{t('onset.indexIntro')}</p>
      <ul className="onset__index-list">
        {CARD_IDS.map((id, index) => {
          const style: CSSProperties = { '--word-index': index, '--word-stagger': '80ms', '--reveal-base': '350ms' } as CSSProperties;
          return (
            <li key={id} className="onset__index-item reveal-word" style={style}>
              <Link to={chapterPath(lang, id as ChapterId)} className="onset__index-link">
                <span className="onset__index-link-title">{t(`chapters.${id}.title`)}</span>
                <span className="onset__index-link-desc">{t(`onset.cards.${id}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function OnSetWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="onset__index-work">
      <div className="onset__index-cards">
        {CARD_IDS.map((id) => {
          const thumb = thumbnailFor(id);
          return (
            <Link key={id} to={chapterPath(lang, id as ChapterId)} className="onset__index-card reveal-fade">
              {thumb ? (
                <img loading="lazy" decoding="async" src={thumb.src} alt="" className="onset__index-card-img" />
              ) : (
                <span className="onset__index-card-plain" aria-hidden="true">
                  3
                </span>
              )}
              <span className="onset__index-card-text">
                <span className="onset__index-card-title">{t(`chapters.${id}.title`)}</span>
                {thumb && <ImageCredit t={t} credit={thumb.credit} />}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
