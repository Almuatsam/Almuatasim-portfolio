import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { PROCESS_CLIPS } from '../../content/sewing';
import { setShowMade } from '../../lib/showMadeStore';
import { PlayTheProcess } from './PlayTheProcess';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #3 — the two ruffle clips, "Play the process" (B5 #6), one
 * per page: gathering the ruffle on the context (left) page, the
 * finished ruffle on the work (right) page. The second clip is the
 * ruffle that ends up on the Qalb Mahmood daybed, so "See it on set"
 * turns to the daybed photo in Show what I made, switched on. */
export function RuffleContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const [ruffle] = PROCESS_CLIPS;

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.ruffle.title')}</h1>
      <Link to={chapterPath(lang, 'estudioa')} className="sewing__estudioa-link reveal-fade">
        {t('sewing.ruffle.estudioaLink')}
      </Link>
      <p className="sewing__clip-title reveal-fade">{t('sewing.ruffle.ruffleTitle')}</p>
      <p className="sewing__clip-caption reveal-fade">{t('sewing.ruffle.ruffleCaption')}</p>
      <div className="sewing__clip-vertical reveal-fade">
        <PlayTheProcess
          clip={ruffle}
          alt={t('sewing.ruffle.clips.ruffle')}
          playHint={t('sewing.ruffle.playHint')}
          collapseLabel={t('sewing.ruffle.closeVideo')}
        />
      </div>
    </div>
  );
}

export function RuffleWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const [, ruffleFinished] = PROCESS_CLIPS;

  return (
    <div className="sewing__work-stacked">
      <p className="sewing__clip-title reveal-fade">{t('sewing.ruffle.finishedTitle')}</p>
      <p className="sewing__clip-caption reveal-fade">{t('sewing.ruffle.finishedCaption')}</p>
      <div className="sewing__clip-full reveal-fade">
        <PlayTheProcess
          clip={ruffleFinished}
          alt={t('sewing.ruffle.clips.ruffleFinished')}
          playHint={t('sewing.ruffle.playHint')}
          collapseLabel={t('sewing.ruffle.closeVideo')}
        />
      </div>
      <Link
        to={chapterPath(lang, 'showmade')}
        className="sewing__see-on-set reveal-fade"
        onClick={() => setShowMade({ photoIndex: 1, isOn: true })}
      >
        {t('sewing.ruffle.seeOnSet')}
      </Link>
    </div>
  );
}
