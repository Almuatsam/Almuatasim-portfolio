import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { useScreenViewer } from '../../../hooks/useScreenViewer';
import { CaseNotes } from '../CaseNotes';
import { StackList } from '../StackList';
import { LiveTag } from '../LiveTag';
import { PullTheStrip } from '../PullTheStrip';
import { BilingualCrossfade } from '../BilingualCrossfade';
import { FullscreenViewer } from '../FullscreenViewer';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('papitoooo');
// images: [0]=en, [1]=ar, [2]=final
const [enImage, arImage, finalImage] = project.images;

export function PapitooooContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.papitoooo.title')}</h1>
      <p className="project-spread__descriptor reveal-fade">{project.descriptor}</p>
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
  const viewer = useScreenViewer(project.images.length);

  function altFor(key: string): string {
    return t(`projects.papitoooo.images.${key}`);
  }

  return (
    <div className="project-spread__work">
      <BilingualCrossfade
        enImage={enImage}
        arImage={arImage}
        altEn={altFor('en')}
        altAr={altFor('ar')}
        onOpen={(key) => viewer.open(key === 'en' ? 0 : 1)}
      />
      <PullTheStrip t={t} stripSrc={finalImage.src} stripAlt={altFor('final')} />
      <FullscreenViewer
        images={project.images}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onNavigate={viewer.navigate}
        label={t('chapters.papitoooo.title')}
      />
    </div>
  );
}
