import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { PROCESS_CLIPS } from '../../content/sewing';
import { PlayTheProcess } from './PlayTheProcess';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './sewing.css';

/** B4 Sewing #3 — the two ruffle clips, "Play the process" (B5 #6). The
 * second clip is the ruffle that ends up on the Qalb Mahmood daybed, so
 * it links across to On Set. On Set isn't built yet (Phase 3 Kickoff.md
 * group 3), so for now the link opens its index; once the daybed
 * spread exists, point it there instead. */
export function RuffleContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="sewing__context">
      <Link to={chapterPath(lang, 'sewing')} className="sewing__back reveal-fade">
        {t('sewing.backToSewing')}
      </Link>
      <h1 className="font-display sewing__entry-title reveal-fade-slow">{t('chapters.ruffle.title')}</h1>
      <Link to={chapterPath(lang, 'estudioa')} className="sewing__estudioa-link reveal-fade">
        {t('sewing.ruffle.estudioaLink')}
      </Link>
    </div>
  );
}

export function RuffleWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const [ruffle, ruffleFinished] = PROCESS_CLIPS;

  return (
    <div className="sewing__work">
      <div className="sewing__clips">
        <PlayTheProcess
          clip={ruffle}
          alt={t('sewing.ruffle.clips.ruffle')}
          playHint={t('sewing.ruffle.playHint')}
          collapseLabel={t('sewing.ruffle.closeVideo')}
        />
        <div className="sewing__clip-with-link">
          <PlayTheProcess
            clip={ruffleFinished}
            alt={t('sewing.ruffle.clips.ruffleFinished')}
            playHint={t('sewing.ruffle.playHint')}
            collapseLabel={t('sewing.ruffle.closeVideo')}
          />
          <Link to={chapterPath(lang, 'onset')} className="sewing__see-on-set">
            {t('sewing.ruffle.seeOnSet')}
          </Link>
        </div>
      </div>
    </div>
  );
}
