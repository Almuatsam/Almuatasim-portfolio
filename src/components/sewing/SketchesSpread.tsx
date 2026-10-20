import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { SKETCH_IMAGES } from '../../content/sewing';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #1 — the two fashion sketches, shown side by side "like
 * pages torn from a design notebook, with stitch-line dividers". No
 * titles or years: they're untitled and undated in the brief. */
export function SketchesContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.sketches.title')}</h1>
      <p className="sewing__caption reveal-fade">{t('sewing.sketches.caption')}</p>
    </div>
  );
}

export function SketchesWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__work">
      <div className="sewing__sketch-pair">
        <img src={SKETCH_IMAGES.wrapTop} alt={t('sewing.sketches.wrapTopAlt')} className="sewing__sketch-img reveal-fade" />
        <div className="sewing__stitch-divider" aria-hidden="true" />
        <img src={SKETCH_IMAGES.coat} alt={t('sewing.sketches.coatAlt')} className="sewing__sketch-img reveal-fade" />
      </div>
    </div>
  );
}
