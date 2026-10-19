import { useFixedT } from '../../hooks/useFixedT';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { PAINTINGS, CLOSING_IMAGE_SRC, type PaintingId } from '../../content/artworks';
import type { ProjectImage } from '../../content/projects';
import { TurnTheCanvas } from './TurnTheCanvas';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './artworks.css';

const VIEWER_IMAGES: ProjectImage[] = [
  ...PAINTINGS.map((p) => ({ key: `${p.id}-in-situ`, src: p.inSituSrc })),
  { key: 'closing', src: CLOSING_IMAGE_SRC },
];

function altFor(t: ReturnType<typeof useFixedT>, key: string): string {
  if (key === 'closing') return t('art.closingAlt');
  const id = key.replace('-in-situ', '') as PaintingId;
  return t(`art.paintings.${id}.inSituAlt`);
}

export function ArtContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="artworks__context">
      <h1 className="font-display artworks__heading reveal-fade-slow">{t('chapters.art.title')}</h1>
      <p className="artworks__opening-note font-hand reveal-fade">{t('art.openingNote')}</p>

      {PAINTINGS.map((painting) => {
        const story = t(`art.paintings.${painting.id}.story`, { returnObjects: true }) as string[];
        return (
          <section key={painting.id} className="artworks__entry reveal-fade">
            <h2 className="font-display artworks__entry-title">{t(`art.paintings.${painting.id}.title`)}</h2>
            <p className="artworks__entry-meta font-mono">
              {t(`art.paintings.${painting.id}.medium`)}, {t(`art.paintings.${painting.id}.year`)}
            </p>
            <div className="artworks__story">
              {story.map((line) => (
                <p key={line} className="artworks__story-line">
                  {line}
                </p>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ArtWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const viewer = useScreenViewer(VIEWER_IMAGES.length);

  return (
    <div className="artworks__work">
      {PAINTINGS.map((painting, index) => {
        const inSituCaptionKey = `art.paintings.${painting.id}.inSituCaption`;
        const inSituCaption = t(inSituCaptionKey, { defaultValue: '' });
        return (
          <div key={painting.id} className="artworks__block">
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
            <button type="button" className="artworks__in-situ" onClick={() => viewer.open(index)}>
              <img src={painting.inSituSrc} alt={altFor(t, `${painting.id}-in-situ`)} className="artworks__in-situ-img" />
              {inSituCaption && <span className="artworks__in-situ-caption">{inSituCaption}</span>}
            </button>
          </div>
        );
      })}

      <div className="artworks__closing">
        <button type="button" className="artworks__closing-button" onClick={() => viewer.open(PAINTINGS.length)}>
          <img src={CLOSING_IMAGE_SRC} alt={t('art.closingAlt')} className="artworks__closing-img" />
        </button>
        <span className="artworks__closing-caption">{t('art.closingCaption')}</span>
      </div>

      <FullscreenViewer
        images={VIEWER_IMAGES}
        altFor={(key) => altFor(t, key)}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        label={t('chapters.art.title')}
      />
    </div>
  );
}
