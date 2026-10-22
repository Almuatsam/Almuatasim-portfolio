import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { useScreenViewer } from '../../../hooks/useScreenViewer';
import { CaseNotes } from '../CaseNotes';
import { StackList } from '../StackList';
import { LiveTag } from '../LiveTag';
import { TracingPaperLift } from '../TracingPaperLift';
import { FuzzySearchDemo } from '../FuzzySearchDemo';
import { ScreenshotThumbnails } from '../ScreenshotThumbnails';
import { FullscreenViewer } from '../FullscreenViewer';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('estudioa');

export function EstudioAContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.estudioa.title')}</h1>
      <p className="project-spread__descriptor reveal-fade">{t('projects.estudioa.descriptor')}</p>
      <CaseNotes
        t={t}
        isRtl={isRtl}
        notes={{
          problem: t('projects.estudioa.problem'),
          insight: t('projects.estudioa.insight'),
          build: t('projects.estudioa.build'),
          result: t('projects.estudioa.result'),
        }}
      />
      <StackList t={t} stack={project.stack} />
      <LiveTag t={t} url={project.liveUrl} domain={project.liveDomain} />
    </div>
  );
}

export function EstudioAWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(project.images.length);

  function altFor(key: string): string {
    return t(`projects.estudioa.images.${key}`);
  }

  return (
    <div className="project-spread__work">
      <TracingPaperLift
        t={t}
        isRtl={lang === 'ar'}
        screenshotSrc={project.images[0].src}
        screenshotAlt={altFor('browse')}
      />
      <FuzzySearchDemo t={t} defaultQuery={t('projects.estudioa.demo.query')} />
      <ScreenshotThumbnails
        images={project.images.slice(1)}
        altFor={altFor}
        onOpen={(i) => viewer.open(i + 1)}
        label={t('chapters.estudioa.title')}
      />
      <FullscreenViewer
        images={project.images}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.estudioa.title')}
      />
    </div>
  );
}
