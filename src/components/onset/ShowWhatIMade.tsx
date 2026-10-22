import { useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../../lib/gsap';
import { useFixedT } from '../../hooks/useFixedT';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useScreenViewer } from '../../hooks/useScreenViewer';
import { chapterPath } from '../../content/chapters';
import { MAKING_OF, SHOW_PHOTOS, type Outline, type ShowPhoto } from '../../content/showMade';
import { setShowMade, useShowMade } from '../../lib/showMadeStore';
import { FullscreenViewer } from '../projects/FullscreenViewer';
import type { ProjectImage } from '../../content/projects';
import { ImageCredit } from './ImageCredit';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './onset.css';
import './show-what-i-made.css';

const MAKING_OF_IMAGES: ProjectImage[] = MAKING_OF.map((item) => ({ key: item.id, src: item.src }));

function outlinePath(shape: [number, number][], photo: ShowPhoto): string {
  const heightUnits = (100 * photo.height) / photo.width;
  return (
    shape.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${(y * heightUnits) / 100}`).join(' ') + ' Z'
  );
}

const ALIGN_TRANSFORM: Record<Outline['label']['align'], string> = {
  start: 'translate(0, -50%)',
  center: 'translate(-50%, -50%)',
  end: 'translate(-100%, -50%)',
};

/** B5 #8, the switch and the photo picker (left page). The switch is a
 * tailor's tag; turning it on draws the outlines on the photo to the
 * right. Both pages read the same state from showMadeStore. */
export function ShowMadeContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const { photoIndex, isOn } = useShowMade();

  return (
    <div className="show__context">
      <Link to={chapterPath(lang, 'follow')} className="onset__back reveal-fade">
        {t('chapters.follow.title')}
      </Link>
      <h1 className="font-display onset__entry-title reveal-fade-slow">{t('chapters.showmade.title')}</h1>
      <p className="show__hint reveal-fade">{t('onset.showMade.hint')}</p>

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        className={`show__tag reveal-fade${isOn ? ' show__tag--on' : ''}`}
        onClick={() => setShowMade({ isOn: !isOn })}
      >
        {t('onset.follow.showMyWork')}
      </button>

      <div className="show__picker reveal-fade" role="group" aria-label={t('onset.showMade.photosLabel')}>
        {SHOW_PHOTOS.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={`show__pick${index === photoIndex ? ' show__pick--current' : ''}`}
            aria-pressed={index === photoIndex}
            onClick={() => setShowMade({ photoIndex: index })}
          >
            <img loading="lazy" decoding="async" src={photo.src} alt="" className="show__pick-img" />
            <span className="show__pick-name">{t(`onset.showMade.photos.${photo.id}.name`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShowMadeWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const { photoIndex, isOn } = useShowMade();
  const photo = SHOW_PHOTOS[photoIndex];
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewer = useScreenViewer(MAKING_OF_IMAGES.length);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Outlines are drawn with DrawSVG, one outline after another; with the
  // switch off (or on a new photo) they retract to nothing.
  const frameRef = useOutlineFrame(photo.id, isOn, prefersReducedMotion);

  const heightUnits = (100 * photo.height) / photo.width;
  const frameStyle: CSSProperties = { aspectRatio: `${photo.width} / ${photo.height}` };

  return (
    <div className="show__work">
      <figure className="show__figure reveal-fade">
        <div ref={frameRef} className={`show__frame${isOn ? ' show__frame--on' : ''}`} style={frameStyle}>
          <img loading="lazy" decoding="async" src={photo.src} alt={t(`onset.showMade.photos.${photo.id}.alt`)} className="show__photo" />
          <div className="show__dim" aria-hidden="true" />
          <svg className="show__svg" viewBox={`0 0 100 ${heightUnits}`} aria-hidden="true">
            {photo.outlines.map((outline) => (
              <g key={outline.id} className={`show__shape${activeId === outline.id ? ' show__shape--active' : ''}`}>
                {outline.shapes.map((shape, index) => (
                  <g key={index}>
                    <path className="show__halo" d={outlinePath(shape, photo)} />
                    <path className="show__line" d={outlinePath(shape, photo)} />
                  </g>
                ))}
              </g>
            ))}
          </svg>
          {photo.outlines.map((outline) => {
            const style: CSSProperties = {
              left: `${outline.label.left}%`,
              top: `${outline.label.top}%`,
              transform: ALIGN_TRANSFORM[outline.label.align],
              maxWidth: outline.label.maxWidth ? `${outline.label.maxWidth}%` : undefined,
            };
            const text = t(`onset.showMade.outlines.${outline.id}`);
            const events = {
              onPointerEnter: () => setActiveId(outline.id),
              onPointerLeave: () => setActiveId(null),
              onFocus: () => setActiveId(outline.id),
              onBlur: () => setActiveId(null),
            };
            const action = outline.action;
            if (action.kind === 'chapter') {
              return (
                <Link
                  key={outline.id}
                  to={chapterPath(lang, action.chapter)}
                  className="show__chip"
                  style={style}
                  tabIndex={isOn ? 0 : -1}
                  title={t('onset.showMade.openSewing')}
                  {...events}
                >
                  {text}
                </Link>
              );
            }
            return (
              <button
                key={outline.id}
                type="button"
                className="show__chip"
                style={style}
                tabIndex={isOn ? 0 : -1}
                title={action.kind === 'photo' ? t('onset.showMade.openPhoto') : undefined}
                onClick={() => {
                  if (action.kind === 'photo') {
                    viewer.open(MAKING_OF.findIndex((item) => item.id === action.makingOf));
                  }
                }}
                {...events}
              >
                {text}
              </button>
            );
          })}
        </div>
        <ImageCredit t={t} credit={photo.credit} />
      </figure>
      <FullscreenViewer
        images={MAKING_OF_IMAGES}
        altFor={(key) => t(`onset.showMade.makingOf.${key}`)}
        openIndex={viewer.openIndex}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
        captionFor={(key) => {
          const item = MAKING_OF.find((entry) => entry.id === key);
          return item ? t(`onset.credits.${item.credit}`) : '';
        }}
      />
    </div>
  );
}

function useOutlineFrame(photoId: string, isOn: boolean, reduced: boolean) {
  const frameRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame) return;
      const shapes = gsap.utils.toArray<SVGGElement>('.show__shape', frame);
      shapes.forEach((shape, index) => {
        const paths = shape.querySelectorAll('path');
        if (!isOn) {
          gsap.to(paths, { drawSVG: '0%', duration: reduced ? 0 : 0.35, ease: 'power1.in', overwrite: true });
        } else if (reduced) {
          gsap.set(paths, { drawSVG: '100%' });
        } else {
          gsap.fromTo(
            paths,
            { drawSVG: '0%' },
            { drawSVG: '100%', duration: 0.9, delay: 0.1 + index * 0.25, ease: 'paper', overwrite: true },
          );
        }
      });
    },
    { scope: frameRef, dependencies: [photoId, isOn, reduced] },
  );
  return frameRef;
}
