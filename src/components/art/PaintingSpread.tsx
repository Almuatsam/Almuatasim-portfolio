import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { chapterPath, type ChapterId } from '../../content/chapters';
import { PAINTINGS, CLOSING_IMAGE_SRC, CHAPTER_FOR_PAINTING, type PaintingDef } from '../../content/artworks';
import type { ProjectImage } from '../../content/projects';
import { TurnTheCanvas } from './TurnTheCanvas';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './artworks.css';

/** The closing "Omani Archives" photo caps the whole gallery, so it
 * only ever appears on the last painting's work page (Guidance, the
 * final chapter in CHAPTER_FOR_PAINTING order). */
const CLOSING_CHAPTER_ID: ChapterId = 'guidance';

function paintingForChapter(id: ChapterId): PaintingDef {
  const painting = PAINTINGS.find((p) => CHAPTER_FOR_PAINTING[p.id] === id);
  if (!painting) throw new Error(`No painting for chapter ${id}`);
  return painting;
}

export function PaintingContext({ lang, chapter }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const painting = paintingForChapter(chapter.id);
  const story = t(`art.paintings.${painting.id}.story`, { returnObjects: true }) as string[];

  return (
    <div className="artworks__context">
      <Link to={chapterPath(lang, 'art')} className="artworks__back reveal-fade">
        {t('art.backToArt')}
      </Link>
      <h1 className="font-display artworks__entry-title reveal-fade-slow">{t(`art.paintings.${painting.id}.title`)}</h1>
      <p className="artworks__entry-meta reveal-fade">
        {t(`art.paintings.${painting.id}.medium`)}, {t(`art.paintings.${painting.id}.year`)}
      </p>
      <div className="artworks__story">
        {story.map((line) => (
          <p key={line} className="artworks__story-line reveal-fade">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function PaintingWork({ lang, chapter }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const painting = paintingForChapter(chapter.id);
  const isClosing = chapter.id === CLOSING_CHAPTER_ID;

  const viewerImages: ProjectImage[] = isClosing
    ? [{ key: `${painting.id}-in-situ`, src: painting.inSituSrc }, { key: 'closing', src: CLOSING_IMAGE_SRC }]
    : [{ key: `${painting.id}-in-situ`, src: painting.inSituSrc }];
  const viewer = useScreenViewer(viewerImages.length);

  function altFor(key: string): string {
    if (key === 'closing') return t('art.closingAlt');
    return t(`art.paintings.${painting.id}.inSituAlt`);
  }

  const inSituCaption = t(`art.paintings.${painting.id}.inSituCaption`, { defaultValue: '' });

  return (
    <div className="artworks__work">
      <TurnTheCanvas
        src={painting.src}
        alt={t(`art.paintings.${painting.id}.alt`)}
        title={t(`art.paintings.${painting.id}.title`)}
        medium={t(`art.paintings.${painting.id}.medium`)}
        year={t(`art.paintings.${painting.id}.year`)}
        backLines={t(`art.paintings.${painting.id}.story`, { returnObjects: true }) as string[]}
        turnHint={t('art.turnHint')}
        seeBack={t('art.seeBack')}
        seeFront={t('art.seeFront')}
        threadCallout={painting.hasThreadCallout ? t('art.threadCallout') : undefined}
      />

      <button type="button" className="artworks__in-situ" onClick={() => viewer.open(0)}>
        <img src={painting.inSituSrc} alt={altFor(`${painting.id}-in-situ`)} className="artworks__in-situ-img" />
        {inSituCaption && <span className="artworks__in-situ-caption">{inSituCaption}</span>}
      </button>

      {isClosing && (
        <div className="artworks__closing">
          <button type="button" className="artworks__closing-button" onClick={() => viewer.open(1)}>
            <img src={CLOSING_IMAGE_SRC} alt={t('art.closingAlt')} className="artworks__closing-img" />
          </button>
          <span className="artworks__closing-caption">{t('art.closingCaption')}</span>
        </div>
      )}

      <FullscreenViewer
        images={viewerImages}
        altFor={altFor}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t(`art.paintings.${painting.id}.title`)}
      />
    </div>
  );
}
