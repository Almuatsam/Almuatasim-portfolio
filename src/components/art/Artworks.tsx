import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { PAINTINGS, CHAPTER_FOR_PAINTING, CLOSING_IMAGE_SRC } from '../../content/artworks';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './artworks.css';

/** The Artworks index — mirrors Screens.tsx. Each painting below is its
 * own full chapter/spread (Phase 3 Kickoff.md #2: "one spread per
 * painting"), reached from here. The chapter-opening note lives on
 * this entry page, not repeated on every painting. */
export function ArtContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="artworks__index-context">
      <h1 className="font-display artworks__heading reveal-fade-slow">{t('chapters.art.title')}</h1>
      <p className="artworks__opening-note font-hand reveal-fade">{t('art.openingNote')}</p>
      <p className="artworks__index-intro reveal-fade">{t('art.indexIntro')}</p>
      <ul className="artworks__index-list">
        {PAINTINGS.map((painting, index) => {
          const style: CSSProperties = { '--word-index': index, '--word-stagger': '80ms', '--reveal-base': '350ms' } as CSSProperties;
          return (
            <li key={painting.id} className="artworks__index-item reveal-word" style={style}>
              <Link to={chapterPath(lang, CHAPTER_FOR_PAINTING[painting.id])} className="artworks__index-link">
                <span className="artworks__index-link-title">{t(`art.paintings.${painting.id}.title`)}</span>
                <span className="artworks__index-link-desc">
                  {t(`art.paintings.${painting.id}.medium`)}, {t(`art.paintings.${painting.id}.year`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The 2x2 grid: three paintings plus a fourth card for the closing
 * Omani Archives photo (also shown on Guidance's own context page,
 * which is where that photo's caption lives — B4/B5). */
export function ArtWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="artworks__index-work">
      <div className="artworks__index-cards">
        {PAINTINGS.map((painting) => (
          <Link
            key={painting.id}
            to={chapterPath(lang, CHAPTER_FOR_PAINTING[painting.id])}
            className="artworks__index-card reveal-fade"
          >
            <img src={painting.src} alt={t(`art.paintings.${painting.id}.title`)} className="artworks__index-card-img" />
            <span className="artworks__index-card-title">{t(`art.paintings.${painting.id}.title`)}</span>
            <span className="artworks__index-card-meta">
              {t(`art.paintings.${painting.id}.medium`)}, {t(`art.paintings.${painting.id}.year`)}
            </span>
          </Link>
        ))}
        <Link to={chapterPath(lang, 'guidance')} className="artworks__index-card reveal-fade">
          <img src={CLOSING_IMAGE_SRC} alt={t('art.closingAlt')} className="artworks__index-card-img" />
          <span className="artworks__index-card-title">{t('art.closingCaption')}</span>
        </Link>
      </div>
    </div>
  );
}
