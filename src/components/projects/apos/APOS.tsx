import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { CaseNotes } from '../CaseNotes';
import { LiveTag } from '../LiveTag';
import { MergeTheScreens } from '../MergeTheScreens';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('apos');

export function APOSContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.apos.title')}</h1>
      <p className="project-spread__descriptor font-mono reveal-fade">{project.descriptor}</p>
      <CaseNotes
        t={t}
        isRtl={isRtl}
        notes={{
          problem: t('projects.apos.problem'),
          insight: t('projects.apos.insight'),
          build: t('projects.apos.build'),
          result: t('projects.apos.result'),
        }}
      />
      <LiveTag t={t} url={project.liveUrl} domain={project.liveDomain} note={t('projects.apos.liveNote')} />
    </div>
  );
}

export function APOSWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="project-spread__work">
      <MergeTheScreens
        t={t}
        unifiedScreenshotSrc={project.images[0].src}
        unifiedScreenshotAlt={t('projects.apos.images.cafe')}
      />
    </div>
  );
}
