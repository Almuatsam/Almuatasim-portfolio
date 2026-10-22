import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { chapterPath, type ChapterId } from '../../content/chapters';
import { PAINTINGS, CHAPTER_FOR_PAINTING, type PaintingDef, type PaintingId } from '../../content/artworks';
import type { ProjectImage } from '../../content/projects';
import { TurnTheCanvas } from './TurnTheCanvas';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './artworks.css';

function paintingForChapter(id: ChapterId): PaintingDef {
  const painting = PAINTINGS.find((p) => CHAPTER_FOR_PAINTING[p.id] === id);
  if (!painting) throw new Error(`No painting for chapter ${id}`);
  return painting;
}

/** Guidance's context photo is the gallery's closing "Omani Archives"
 * image, so it reads the general art.* caption/alt keys instead of a
 * per-painting one (Painful Experience's Hayat photo has its own). */
function contextPhotoCopy(t: ReturnType<typeof useFixedT>, id: PaintingId): { alt: string; caption: string } {
  if (id === 'guidance') return { alt: t('art.closingAlt'), caption: t('art.closingCaption') };
  return {
    alt: t(`art.paintings.${id}.inSituAlt`),
    caption: t(`art.paintings.${id}.inSituCaption`, { defaultValue: '' }),
  };
}

export function PaintingContext({ lang, chapter }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const painting = paintingForChapter(chapter.id);
  const story = t(`art.paintings.${painting.id}.story`, { returnObjects: true }) as string[];
  const viewer = useScreenViewer(1);
  const photoCopy = painting.contextPhotoSrc ? contextPhotoCopy(t, painting.id) : null;
  const viewerImages: ProjectImage[] = painting.contextPhotoSrc
    ? [{ key: `${painting.id}-context`, src: painting.contextPhotoSrc }]
    : [];

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

      {photoCopy && painting.contextPhotoSrc && (
        <div className="artworks__photo">
          <button type="button" className="artworks__photo-button" onClick={() => viewer.open(0)}>
            <img loading="lazy" decoding="async" src={painting.contextPhotoSrc} alt={photoCopy.alt} className="artworks__photo-img" />
          </button>
          {photoCopy.caption && <span className="artworks__photo-caption">{photoCopy.caption}</span>}
        </div>
      )}

      {viewerImages.length > 0 && (
        <FullscreenViewer
          images={viewerImages}
          altFor={() => photoCopy?.alt ?? ''}
          openIndex={viewer.openIndex}
          onClose={viewer.close}
          onIndexChange={viewer.setIndex}
          label={t(`art.paintings.${painting.id}.title`)}
        />
      )}
    </div>
  );
}

export function PaintingWork({ lang, chapter }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const painting = paintingForChapter(chapter.id);

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
        threadCallout={painting.threadPosition ? t('art.threadCallout') : undefined}
        threadPosition={painting.threadPosition}
      />
    </div>
  );
}
