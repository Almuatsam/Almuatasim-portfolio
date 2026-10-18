import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { useScreenViewer } from '../../../hooks/useScreenViewer';
import { CaseNotes } from '../CaseNotes';
import { LiveTag } from '../LiveTag';
import { MergeTheScreens } from '../MergeTheScreens';
import { ScreenshotThumbnails } from '../ScreenshotThumbnails';
import { FullscreenViewer } from '../FullscreenViewer';
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
      <p className="project-spread__descriptor reveal-fade">{t('projects.apos.descriptor')}</p>
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
  const viewer = useScreenViewer(project.images.length);

  function altFor(key: string): string {
    return t(`projects.apos.images.${key}`);
  }

  return (
    <div className="project-spread__work">
      <MergeTheScreens
        t={t}
        unifiedScreenshotSrc={project.images[0].src}
        unifiedScreenshotAlt={altFor('cafe')}
        onOpenScreenshot={() => viewer.open(0)}
      />
      <ScreenshotThumbnails
        images={project.images.slice(1)}
        altFor={altFor}
        onOpen={(i) => viewer.open(i + 1)}
        label={t('projects.apos.images.cafe')}
      />
      <FullscreenViewer
        images={project.images}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.apos.title')}
      />
    </div>
  );
}
