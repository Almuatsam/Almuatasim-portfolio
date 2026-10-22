import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, type ChapterId } from '../../content/chapters';
import { SKETCH_IMAGES, OUTFIT_IMAGES, TIE_IMAGES, PROCESS_CLIPS } from '../../content/sewing';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';
import { Picture } from '../ui/Picture';

const SPREADS: { id: ChapterId; thumb: string }[] = [
  { id: 'sketches', thumb: SKETCH_IMAGES.wrapTop },
  { id: 'fashionweek', thumb: OUTFIT_IMAGES.full.src },
  { id: 'tie', thumb: TIE_IMAGES.final },
  { id: 'ruffle', thumb: PROCESS_CLIPS[0].poster },
];

/** The Sewing index — mirrors Artworks.tsx. Three short spreads that
 * follow the brief's own design -> make -> finish order (Phase 3
 * Kickoff.md #3), reached from here. */
export function SewingContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__index-context">
      <h1 className="font-display sewing__heading reveal-fade-slow">{t('chapters.sewing.title')}</h1>
      <p className="sewing__index-intro reveal-fade">{t('sewing.indexIntro')}</p>
      <ul className="sewing__index-list">
        {SPREADS.map((spread, index) => {
          const style: CSSProperties = { '--word-index': index, '--word-stagger': '80ms', '--reveal-base': '350ms' } as CSSProperties;
          return (
            <li key={spread.id} className="sewing__index-item reveal-word" style={style}>
              <Link to={chapterPath(lang, spread.id)} className="sewing__index-link">
                <span className="sewing__index-link-title">{t(`chapters.${spread.id}.title`)}</span>
                <span className="sewing__index-link-desc">{t(`sewing.cards.${spread.id}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SewingWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__index-work">
      <div className="sewing__index-cards">
        {SPREADS.map((spread) => (
          <Link key={spread.id} to={chapterPath(lang, spread.id)} className="sewing__index-card reveal-fade">
            <Picture loading="lazy" decoding="async" src={spread.thumb} alt="" className="sewing__index-card-img" sizes="72px" />
            <span className="sewing__index-card-title">{t(`chapters.${spread.id}.title`)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
