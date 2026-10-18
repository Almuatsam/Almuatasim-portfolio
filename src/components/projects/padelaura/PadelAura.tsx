import { Link } from 'react-router-dom';
import { useFixedT } from '../../../hooks/useFixedT';
import { chapterPath } from '../../../content/chapters';
import { getProject } from '../../../content/projects';
import { useScreenViewer } from '../../../hooks/useScreenViewer';
import { CaseNotes } from '../CaseNotes';
import { LiveTag } from '../LiveTag';
import { FactsList } from '../FactsList';
import { BilingualCrossfade } from '../BilingualCrossfade';
import { ScreenshotThumbnails } from '../ScreenshotThumbnails';
import { FullscreenViewer } from '../FullscreenViewer';
import type { ChapterPanelProps } from '../../../routes/chapterContent';
import '../project-spread.css';

const project = getProject('padelaura');
// images: [0]=en, [1]=ar, [2]=booking, [3]=thawani, [4]=confirmation
const [enImage, arImage, ...bookingFlow] = project.images;

export function PadelAuraContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';
  const facts = t('projects.padelaura.facts', { returnObjects: true }) as Record<string, string>;

  return (
    <div className="project-spread__context">
      <Link to={chapterPath(lang, 'screens')} className="project-spread__back reveal-fade">
        {t('projectLabels.backToScreens')}
      </Link>
      <h1 className="font-display project-spread__title reveal-fade-slow">{t('chapters.padelaura.title')}</h1>
      <p className="project-spread__descriptor reveal-fade">{project.descriptor}</p>
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
      <FactsList facts={Object.values(facts)} />
      <LiveTag t={t} url={project.liveUrl} domain={project.liveDomain} />
    </div>
  );
}

export function PadelAuraWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(project.images.length);

  function altFor(key: string): string {
    return t(`projects.padelaura.images.${key}`);
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
      <ScreenshotThumbnails
        images={bookingFlow}
        altFor={altFor}
        onOpen={(i) => viewer.open(i + 2)}
        label={t('chapters.padelaura.title')}
      />
      <FullscreenViewer
        images={project.images}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.padelaura.title')}
      />
    </div>
  );
}
