import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { CaseNotes } from '../CaseNotes';
import { StackList } from '../StackList';
import { LiveTag } from '../LiveTag';
import { FlipTheLanguage } from '../FlipTheLanguage';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('padelaura');

export function PadelAuraContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.padelaura.title')}</h1>
      <p className="project-spread__descriptor font-mono reveal-fade">{project.descriptor}</p>
      <CaseNotes
        t={t}
        isRtl={isRtl}
        notes={{
          problem: t('projects.padelaura.problem'),
          insight: t('projects.padelaura.insight'),
          build: t('projects.padelaura.build'),
          result: t('projects.padelaura.result'),
        }}
      />
      <StackList t={t} stack={project.stack} />
      <LiveTag t={t} url={project.liveUrl} domain={project.liveDomain} />
    </div>
  );
}

export function PadelAuraWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="project-spread__work">
      <FlipTheLanguage t={t} screenshotSrc={project.images[1].src} screenshotAlt={t('projects.padelaura.images.booking')} />
    </div>
  );
}
