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

// project.images order: [cafe, admin, employees, payment, posCafe, giftShop, tickets].
// The last three only feed the merge-cards below; the viewer and thumbnail
// row stick to the original four so flipping through them never surfaces
// the pre-merge mismatched-outlet screens.
const VIEWER_IMAGES = project.images.slice(0, 4);
const THUMBNAIL_INDICES = [0, 2, 3]; // cafe, employees, payment (admin is now the merged hero shot)

export function APOSWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(VIEWER_IMAGES.length);

  function altFor(key: string): string {
    return t(`projects.apos.images.${key}`);
  }

  return (
    <div className="project-spread__work">
      <MergeTheScreens
        t={t}
        cards={{
          cafe: { src: project.images[4].src, alt: altFor('cafe') },
          gift: { src: project.images[5].src, alt: altFor('giftShop') },
          tickets: { src: project.images[6].src, alt: altFor('tickets') },
        }}
        unifiedScreenshotSrc={project.images[1].src}
        unifiedScreenshotAlt={altFor('admin')}
        onOpenScreenshot={() => viewer.open(1)}
      />
      <ScreenshotThumbnails
        images={THUMBNAIL_INDICES.map((i) => project.images[i])}
        altFor={altFor}
        onOpen={(i) => viewer.open(THUMBNAIL_INDICES[i])}
        label={t('projects.apos.images.admin')}
      />
      <FullscreenViewer
        images={VIEWER_IMAGES}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.apos.title')}
      />
    </div>
  );
}
