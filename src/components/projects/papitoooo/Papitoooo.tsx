import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { CaseNotes } from '../CaseNotes';
import { StackList } from '../StackList';
import { LiveTag } from '../LiveTag';
import { PullTheStrip } from '../PullTheStrip';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('papitoooo');

export function PapitooooContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.papitoooo.title')}</h1>
      <p className="project-spread__descriptor font-mono reveal-fade">{project.descriptor}</p>
      <CaseNotes
        t={t}
        isRtl={isRtl}
        notes={{
          insight: t('projects.papitoooo.insight'),
          build: t('projects.papitoooo.build'),
        }}
      />
      <StackList t={t} stack={project.stack} />
      <LiveTag t={t} url={project.liveUrl} domain={project.liveDomain} note={t('projects.papitoooo.liveNote')} />
    </div>
  );
}

export function PapitooooWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="project-spread__work">
      <PullTheStrip t={t} stripSrc={project.images[3].src} stripAlt={t('projects.papitoooo.images.final')} />
    </div>
  );
}
