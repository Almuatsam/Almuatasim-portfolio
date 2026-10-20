import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { TIE_IMAGES } from '../../content/sewing';
import { PencilArrow } from '../icons/PencilArrow';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #2 — a bought tie, embellished by hand (never described as
 * made from scratch): choosing the crystals, then the finished tie
 * worn, joined by the same pencil arrow used for chapter navigation. */
export function TieContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.tie.title')}</h1>
      <p className="sewing__caption reveal-fade">{t('sewing.tie.caption')}</p>
    </div>
  );
}

export function TieWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="sewing__work">
      <div className="sewing__tie-pair">
        <img src={TIE_IMAGES.process} alt={t('sewing.tie.processAlt')} className="sewing__tie-img reveal-fade" />
        <span className="sewing__tie-arrow" aria-hidden="true">
          <PencilArrow pointing="forward" isRtl={isRtl} color="var(--accent-ink)" />
        </span>
        <img src={TIE_IMAGES.final} alt={t('sewing.tie.finalAlt')} className="sewing__tie-img reveal-fade" />
      </div>
    </div>
  );
}
