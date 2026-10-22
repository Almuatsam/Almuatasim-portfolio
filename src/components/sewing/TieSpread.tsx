import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { TIE_IMAGES } from '../../content/sewing';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #2 — a bought tie, embellished by hand (never described as
 * made from scratch): choosing the crystals on the context (left) page,
 * the finished tie worn on the work (right) page. The page turn itself
 * is the before/after arrow now, so there's no separate icon between
 * the two photos. */
export function TieContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.tie.title')}</h1>
      <p className="sewing__caption reveal-fade">{t('sewing.tie.caption')}</p>
      <p className="sewing__photo-label reveal-fade">{t('sewing.tie.processLabel')}</p>
      <img loading="lazy" decoding="async"
        src={TIE_IMAGES.process}
        alt={t('sewing.tie.processAlt')}
        className="sewing__tie-img sewing__tie-img--process reveal-fade"
      />
    </div>
  );
}

export function TieWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__work">
      <img loading="lazy" decoding="async"
        src={TIE_IMAGES.final}
        alt={t('sewing.tie.finalAlt')}
        className="sewing__tie-img sewing__tie-img--final reveal-fade"
      />
      <p className="sewing__photo-label reveal-fade">{t('sewing.tie.finalLabel')}</p>
    </div>
  );
}
