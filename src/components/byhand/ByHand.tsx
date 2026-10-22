import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, getChapter, type ChapterId } from '../../content/chapters';
import { ACCENTS } from '../../content/accents';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './by-hand.css';

const CARD_IDS: ChapterId[] = ['art', 'sewing', 'onset'];

/** A painting crop, a sewing video poster frame and a Qalb Mahmood set
 * photo — one representative thumbnail per Part Two chapter (Phase 3
 * Kickoff.md #1). */
const THUMBNAILS: Partial<Record<ChapterId, string>> = {
  art: '/art/painful-experience.jpg',
  sewing: '/sewing/sewing-ruffle-poster.jpg',
  onset: '/on-set/qalb-mahmood-3-set.jpg',
};

export function ByHandContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="by-hand__context">
      <h1 className="font-display by-hand__heading reveal-fade-slow">{t('chapters.byhand.title')}</h1>
      <p className="by-hand__intro reveal-fade">{t('byhand.intro')}</p>
      <ul className="by-hand__list">
        {CARD_IDS.map((id, index) => {
          const chapter = getChapter(id);
          const swatch = ACCENTS[chapter.accent].accent;
          const style: CSSProperties = { '--word-index': index, '--word-stagger': '80ms', '--reveal-base': '350ms' } as CSSProperties;
          return (
            <li key={id} className="by-hand__item reveal-word" style={style}>
              <Link to={chapterPath(lang, id)} className="by-hand__link">
                <span className="by-hand__swatch" style={{ background: swatch }} aria-hidden="true" />
                <span className="by-hand__link-text">
                  <span className="by-hand__link-title">{t(`chapters.${id}.title`)}</span>
                  <span className="by-hand__link-desc">{t(`byhand.cards.${id}`)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ByHandWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="by-hand__work">
      <div className="by-hand__cards">
        {CARD_IDS.map((id) => {
          const chapter = getChapter(id);
          const swatch = ACCENTS[chapter.accent].accent;
          const style: CSSProperties = { '--card-accent': swatch } as CSSProperties;
          return (
            <Link key={id} to={chapterPath(lang, id)} className="by-hand__card reveal-fade" style={style}>
              <img loading="lazy" decoding="async" src={THUMBNAILS[id] ?? ''} alt={t(`chapters.${id}.title`)} className="by-hand__card-img" />
              <span className="by-hand__card-label">
                <span className="by-hand__card-swatch" aria-hidden="true" />
                <span className="by-hand__card-title">{t(`chapters.${id}.title`)}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
