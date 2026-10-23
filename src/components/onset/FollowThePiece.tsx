import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP, Draggable } from '../../lib/gsap';
import { useFixedT } from '../../hooks/useFixedT';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { chapterPath } from '../../content/chapters';
import { FOLLOW_STAGES } from '../../content/onset';
import { SHOW_PHOTOS } from '../../content/showMade';
import { setShowMade, useShowMade } from '../../lib/showMadeStore';
import { getFollowStage, setFollowStage, useFollowStage } from '../../lib/followStore';
import { Marked } from '../motion/Marked';
import { ImageCredit } from './ImageCredit';
import { OutlineOverlay } from './ShowWhatIMade';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './follow-the-piece.css';
import { Picture } from '../ui/Picture';

const STAGE_COUNT = FOLLOW_STAGES.length;
const LAST_STAGE = STAGE_COUNT - 1;
const TOUCH_QUERY = '(hover: none), (pointer: coarse)';

// The stitch line is drawn in its own 340 x 84 coordinate space and scaled
// to the page with the SVG viewBox. Physical coordinates throughout: the
// flip container's mirror and the page's counter-mirror cancel out in
// Arabic, so what is drawn is what is seen, and the line simply starts
// on the right. The needle is placed in this same space (never from page
// measurements), so it is on its node whatever size the page is, and
// however late the page becomes visible.
const VIEW_W = 340;
const VIEW_H = 84;
const PAD = 30;
const MID = 42;
const WAVE = 7;
const SEGMENTS = 8;

function threadPath(isRtl: boolean, wave: number): string {
  const x0 = isRtl ? VIEW_W - PAD : PAD;
  const x1 = isRtl ? PAD : VIEW_W - PAD;
  const dx = (x1 - x0) / SEGMENTS;
  let d = `M${x0} ${MID}`;
  for (let i = 0; i < SEGMENTS; i += 1) {
    const controlY = MID + (i % 2 === 0 ? -2 : 2) * wave;
    d += ` Q${x0 + dx * (i + 0.5)} ${controlY} ${x0 + dx * (i + 1)} ${MID}`;
  }
  return d;
}

function stopX(isRtl: boolean, index: number): number {
  const x0 = isRtl ? VIEW_W - PAD : PAD;
  const x1 = isRtl ? PAD : VIEW_W - PAD;
  return x0 + (x1 - x0) * (index / LAST_STAGE);
}

interface ThreadApi {
  goTo: (index: number) => void;
  tighten: (isTight: boolean) => void;
}

export function FollowHeading({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  return (
    <>
      <Link to={chapterPath(lang, 'qalb')} className="onset__back reveal-fade">
        {t('chapters.qalb.title')}
      </Link>
      <h1 className="font-display onset__entry-title reveal-fade-slow">{t('chapters.follow.title')}</h1>
      <p className="follow__subtitle reveal-fade">{t('onset.follow.subtitle')}</p>
    </>
  );
}

/** B5 #7, the stitch: a running-stitch line with five stages and a needle
 * at the start. Dragging the needle (GSAP Draggable), the arrow keys with the
 * needle focused, the stage labels, or the previous/next buttons all move
 * the same stage in followStore; the photo follows it (on the facing page
 * on desktop, above the line on phones). At the last stage the stitch pulls
 * tight and "Show my work" lights up. */
export function FollowStitch({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';
  const stage = useFollowStage();
  const isTouch = useMediaQuery(TOUCH_QUERY);
  const prefersReducedMotion = usePrefersReducedMotion();
  const reducedRef = useRef(prefersReducedMotion);
  const stageRef = useRef(stage);
  // Read by the GSAP callbacks below, which outlive any one render.
  useLayoutEffect(() => {
    reducedRef.current = prefersReducedMotion;
    stageRef.current = stage;
  });

  const clipId = `follow-clip-${useId().replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const underlayRef = useRef<SVGPathElement>(null);
  const sewnRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ThreadApi | null>(null);
  const isDraggingRef = useRef(false);

  useGSAP(
    () => {
      const svg = svgRef.current;
      const thread = threadRef.current;
      const underlay = underlayRef.current;
      const sewn = sewnRef.current;
      const clipRect = clipRectRef.current;
      const needle = needleRef.current;
      const proxy = proxyRef.current;
      if (!svg || !thread || !underlay || !sewn || !clipRect || !needle || !proxy) return;

      const startX = stopX(isRtl, 0);
      const endX = stopX(isRtl, LAST_STAGE);

      const state = { p: stageRef.current / LAST_STAGE, wave: WAVE };
      let slide: gsap.core.Tween | null = null;
      let tightening: gsap.core.Tween | null = null;

      // Everything here is geometry in the viewBox. Nothing reads the page's
      // on-screen size, so it is right even while the page is hidden; the
      // path length itself is only measured when the browser can (a hidden
      // page may report 0), and the observer below redraws once it can.
      function render(progress: number): void {
        state.p = progress;
        let point: DOMPoint;
        let ahead: DOMPoint;
        let behind: DOMPoint;
        try {
          const length = thread!.getTotalLength();
          const at = Math.min(Math.max(progress * length, 0), length);
          point = thread!.getPointAtLength(at);
          ahead = thread!.getPointAtLength(Math.min(length, at + 1));
          behind = thread!.getPointAtLength(Math.max(0, at - 1));
        } catch {
          // The page is not rendered yet; the observer below draws it once it is.
          return;
        }
        const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
        needle!.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
        gsap.set(clipRect, { attr: isRtl ? { x: point.x, width: VIEW_W - point.x } : { x: 0, width: point.x } });
        // pathLength="100" on the underlay, so this needs no measuring.
        underlay!.style.strokeDasharray = `${progress * 100} 100`;
      }

      function goTo(index: number): void {
        slide?.kill();
        const target = index / LAST_STAGE;
        if (reducedRef.current) {
          render(target);
          return;
        }
        slide = gsap.to(state, { p: target, duration: 0.5, ease: 'paper', onUpdate: () => render(state.p) });
      }

      function tighten(isTight: boolean): void {
        const target = isTight ? 0 : WAVE;
        const apply = (): void => {
          const d = threadPath(isRtl, state.wave);
          thread!.setAttribute('d', d);
          underlay!.setAttribute('d', d);
          sewn!.setAttribute('d', d);
          render(state.p);
        };
        if (reducedRef.current) {
          state.wave = target;
          apply();
          return;
        }
        tightening?.kill();
        tightening = gsap.to(state, { wave: target, duration: isTight ? 0.8 : 0.25, ease: isTight ? 'paper' : 'settle', onUpdate: apply });
      }

      apiRef.current = { goTo, tighten };
      render(state.p);
      if (stageRef.current === LAST_STAGE) tighten(true);

      // StPageFlip mounts pages before they are shown, and the page also
      // changes size on resize and rotation: redraw whenever the line gets a
      // real size, so the needle is on its node as soon as the page is seen.
      const observer = new ResizeObserver(() => render(state.p));
      observer.observe(svg);

      const [drag] = Draggable.create(proxy, {
        trigger: needle,
        type: 'x',
        onPress: () => {
          isDraggingRef.current = true;
          slide?.kill();
          tighten(false);
        },
        onDrag: () => {
          // pointerX works for mouse, pen and touch alike; a touch drag's
          // event has no clientX of its own.
          const box = svg.getBoundingClientRect();
          const x = ((drag.pointerX - window.scrollX - box.left) / box.width) * VIEW_W;
          const progress = Math.min(Math.max((x - startX) / (endX - startX), 0), 1);
          render(progress);
          setFollowStage(progress * LAST_STAGE, STAGE_COUNT);
        },
        onRelease: () => {
          isDraggingRef.current = false;
          const index = Math.round(state.p * LAST_STAGE);
          setFollowStage(index, STAGE_COUNT);
          goTo(index);
          tighten(index === LAST_STAGE);
        },
      });

      return () => {
        observer.disconnect();
        drag.kill();
        apiRef.current = null;
        slide?.kill();
        tightening?.kill();
      };
    },
    { scope: containerRef, dependencies: [isRtl] },
  );

  // Stage changes from anywhere but the drag itself (keys, labels,
  // buttons) move the needle here; during a drag the needle already
  // follows the pointer.
  useEffect(() => {
    if (isDraggingRef.current) return;
    apiRef.current?.goTo(stage);
    apiRef.current?.tighten(stage === LAST_STAGE);
  }, [stage]);

  function step(delta: number): void {
    setFollowStage(getFollowStage() + delta, STAGE_COUNT);
  }

  function handleNeedleKey(event: KeyboardEvent<SVGGElement>): void {
    const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    const before = getFollowStage();
    if (event.key === forwardKey || event.key === 'ArrowUp') step(1);
    else if (event.key === backKey || event.key === 'ArrowDown') step(-1);
    else if (event.key === 'Home') setFollowStage(0, STAGE_COUNT);
    else if (event.key === 'End') setFollowStage(LAST_STAGE, STAGE_COUNT);
    // At either end the key falls through to the book's page turn.
    if (getFollowStage() === before) return;
    // With the needle focused its arrow keys belong to the needle, not
    // to any window-level page-turn handler.
    event.preventDefault();
    event.stopPropagation();
  }

  const stageId = FOLLOW_STAGES[stage].id;
  const stageName = t(`onset.follow.stages.${stageId}.label`);
  const isLit = stage === LAST_STAGE;
  const initialD = threadPath(isRtl, WAVE);

  return (
    <div className="follow__stitch reveal-fade" ref={containerRef}>
      <p className="follow__hint">{t(isTouch ? 'onset.follow.hintTouch' : 'onset.follow.hint')}</p>
      <div className="follow__line">
        <svg
          ref={svgRef}
          className="follow__svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="group"
          aria-label={t('onset.follow.stagesLabel')}
        >
          <defs>
            <clipPath id={clipId}>
              <rect ref={clipRectRef} x="0" y="0" width="0" height={VIEW_H} />
            </clipPath>
          </defs>
          <path ref={underlayRef} className="follow__underlay" d={initialD} pathLength={100} />
          <path ref={threadRef} className="follow__thread" d={initialD} />
          <path ref={sewnRef} className="follow__thread follow__thread--sewn" d={initialD} clipPath={`url(#${clipId})`} />
          {FOLLOW_STAGES.map((item, index) => (
            <circle
              key={item.id}
              className={`follow__stop${index <= stage ? ' follow__stop--sewn' : ''}`}
              cx={stopX(isRtl, index)}
              cy={MID}
              r="5.5"
            />
          ))}
          {/* The needle's eye is its origin: the eye sits on the node. */}
          <g
            ref={needleRef}
            className="follow__needle"
            tabIndex={0}
            role="slider"
            aria-label={t('onset.follow.needleLabel')}
            aria-orientation="horizontal"
            aria-valuemin={1}
            aria-valuemax={STAGE_COUNT}
            aria-valuenow={stage + 1}
            aria-valuetext={`${t('onset.follow.stageOf', { current: stage + 1, total: STAGE_COUNT })}, ${stageName}`}
            onKeyDown={handleNeedleKey}
          >
            <circle className="follow__needle-hit" cx="8" r="26" />
            <circle className="follow__needle-ring" cx="14" r="22" />
            <path className="follow__needle-shaft" d="M-3 0 L29 0" />
            <path className="follow__needle-tip" d="M29 0 L34 0" />
            <ellipse className="follow__needle-eye" cx="0" cy="0" rx="3.4" ry="1.5" />
          </g>
        </svg>
        {FOLLOW_STAGES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`follow__stage-label${index === stage ? ' follow__stage-label--current' : ''}`}
            style={{ left: `${(stopX(isRtl, index) / VIEW_W) * 100}%` }}
            aria-current={index === stage ? 'step' : undefined}
            onClick={() => setFollowStage(index, STAGE_COUNT)}
          >
            {t(`onset.follow.stages.${item.id}.label`)}
          </button>
        ))}
      </div>
      <div ref={proxyRef} className="follow__proxy" aria-hidden="true" />

      <div className="follow__controls">
        <button type="button" className="follow__step" onClick={() => step(-1)} disabled={stage === 0} aria-label={t('onset.follow.previous')}>
          <StepArrow />
        </button>
        <span className="follow__count" aria-hidden="true">
          {stage + 1} / {STAGE_COUNT}
        </span>
        <button type="button" className="follow__step follow__step--next" onClick={() => step(1)} disabled={isLit} aria-label={t('onset.follow.next')}>
          <StepArrow />
        </button>
      </div>
    </div>
  );
}

/** Desktop: the tag dulls until the last stage, then lights up as the link to
 * Show what I made. */
function FollowTag({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const stage = useFollowStage();
  if (stage === LAST_STAGE) {
    return (
      <Link
        to={chapterPath(lang, 'showmade')}
        className="follow__tag follow__tag--lit reveal-fade"
        onClick={() => setShowMade({ photoIndex: 0, isOn: true })}
      >
        {t('onset.follow.showMyWork')}
      </Link>
    );
  }
  return <span className="follow__tag reveal-fade">{t('onset.follow.showMyWork')}</span>;
}

/** Phones: a real toggle. On, the needle goes to the finished piece and the
 * outlines are drawn over its photo, on this same page. */
function FollowShowButton({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const { isOn } = useShowMade();
  const stage = useFollowStage();
  const isShown = isOn && stage === LAST_STAGE;

  // Moving the needle off the finished piece puts the outlines away.
  useEffect(() => {
    if (isOn && stage !== LAST_STAGE) setShowMade({ isOn: false });
  }, [isOn, stage]);

  function toggle(): void {
    if (isShown) {
      setShowMade({ isOn: false });
      return;
    }
    setFollowStage(LAST_STAGE, STAGE_COUNT);
    setShowMade({ photoIndex: 0, isOn: true });
  }

  return (
    <button type="button" className="follow__show" role="switch" aria-checked={isShown} onClick={toggle}>
      <span className="follow__show-box" aria-hidden="true" />
      {t(isShown ? 'onset.follow.hideMyWork' : 'onset.follow.showMyWork')}
    </button>
  );
}

export function FollowContext({ lang, chapter }: ChapterPanelProps) {
  return (
    <div className="follow__context">
      <FollowHeading lang={lang} chapter={chapter} />
      <FollowStitch lang={lang} chapter={chapter} />
      <FollowTag lang={lang} chapter={chapter} />
    </div>
  );
}

/** Phones: the title, the photo for the current stage, its caption, the
 * stitch with the needle, the two arrows and "Show my work" are one page. The
 * photo changes under the needle without a page turn. */
export function FollowOnePage({ lang, chapter }: ChapterPanelProps) {
  return (
    <div className="follow__context follow__one-page">
      <FollowHeading lang={lang} chapter={chapter} />
      <FollowWork lang={lang} chapter={chapter} />
      <FollowStitch lang={lang} chapter={chapter} />
      <FollowShowButton lang={lang} chapter={chapter} />
    </div>
  );
}

function StepArrow() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" className="follow__step-icon">
      <path d="M1 6h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 1.5 14 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The photo: the five stage photos stacked and cross-faded as the stage
 * changes, with the credit line and the stage's one-line note beneath. */
export function FollowWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const stage = useFollowStage();
  const { isOn } = useShowMade();
  const isPhone = useMediaQuery('(max-width: 899px)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useGSAP(
    () => {
      const images = gsap.utils.toArray<HTMLImageElement>('.follow__img', frameRef.current);
      const animate = hasMountedRef.current && !prefersReducedMotion;
      hasMountedRef.current = true;
      images.forEach((image, index) => {
        const opacity = index === stage ? 1 : 0;
        if (animate) gsap.to(image, { opacity, duration: 0.6, ease: 'power1.inOut', overwrite: true });
        else gsap.set(image, { opacity });
      });
    },
    { scope: frameRef, dependencies: [stage, prefersReducedMotion] },
  );

  const current = FOLLOW_STAGES[stage];
  // The finished-piece photo is also the first Show what I made photo; its
  // outlines are drawn over this frame's cover crop (see OutlineOverlay).
  const outlinePhoto = SHOW_PHOTOS.find((photo) => photo.src === current.src);

  return (
    <div className="follow__work">
      <figure className="follow__figure reveal-fade">
        <div className="follow__frame" ref={frameRef}>
          {FOLLOW_STAGES.map((item, index) => (
            <Picture loading="lazy" decoding="async"
              key={item.id}
              src={item.src}
              alt={t(`onset.follow.stages.${item.id}.alt`)}
              aria-hidden={index !== stage}
              className="follow__img"
              style={{ objectFit: item.fit, objectPosition: item.position }}
            />
          ))}
          {isPhone && outlinePhoto && (
            <OutlineOverlay
              photo={outlinePhoto}
              isOn={isOn}
              squareCropAt={Number.parseFloat(current.position.split(' ')[0]) / 100}
            />
          )}
        </div>
        <ImageCredit t={t} credit={current.credit} />
      </figure>
      <div className="follow__caption" aria-live="polite">
        <p className="follow__stage-name">{t(`onset.follow.stages.${current.id}.label`)}</p>
        <p key={current.id} className="follow__note">
          <Marked text={t(`onset.follow.stages.${current.id}.note`)} />
        </p>
      </div>
    </div>
  );
}
