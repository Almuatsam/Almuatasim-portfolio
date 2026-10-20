import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { chapterPath } from '../../content/chapters';
import { SKETCH_IMAGES } from '../../content/sewing';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ProjectImage } from '../../content/projects';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #1 — one sketch per page: the mustard wrap top on the
 * context (left) page under the caption, the olive coat alone on the
 * work (right) page. Both are full content width, flat, and open the
 * full-screen viewer on click. */
export function SketchesContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(1);
  const images: ProjectImage[] = [{ key: 'sketch-wrap-top', src: SKETCH_IMAGES.wrapTop }];

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.sketches.title')}</h1>
      <p className="sewing__caption reveal-fade">{t('sewing.sketches.caption')}</p>
      <div className="sewing__sketch-divider" aria-hidden="true" />
      <button type="button" className="sewing__sketch-button reveal-fade" onClick={() => viewer.open(0)}>
        <img src={SKETCH_IMAGES.wrapTop} alt={t('sewing.sketches.wrapTopAlt')} className="sewing__sketch-img" />
      </button>
      <FullscreenViewer
        images={images}
        altFor={() => t('sewing.sketches.wrapTopAlt')}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.sketches.title')}
      />
    </div>
  );
}

export function SketchesWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(1);
  const images: ProjectImage[] = [{ key: 'sketch-coat', src: SKETCH_IMAGES.coat }];

  return (
    <div className="sewing__work">
      <button type="button" className="sewing__sketch-button reveal-fade" onClick={() => viewer.open(0)}>
        <img src={SKETCH_IMAGES.coat} alt={t('sewing.sketches.coatAlt')} className="sewing__sketch-img" />
      </button>
      <FullscreenViewer
        images={images}
        altFor={() => t('sewing.sketches.coatAlt')}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.sketches.title')}
      />
    </div>
  );
}
