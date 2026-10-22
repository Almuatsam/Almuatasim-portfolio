import { useState } from 'react';
import { m } from 'framer-motion';
import type { TFunction } from 'i18next';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { PencilArrow } from '../icons/PencilArrow';
import './tracing-paper-lift.css';
import { Picture } from '../ui/Picture';

interface TracingPaperLiftProps {
  t: TFunction;
  screenshotSrc: string;
  screenshotAlt: string;
  isRtl: boolean;
}

/** B5 #1 / Reset section 4 — a tracing-paper sheet with a pencil
 * wireframe lies over the real screenshot. The wireframe is traced from
 * `estudioa-browse.png` in the same 1440x900 (16:10) coordinate space as
 * the screenshot underneath, so every line sits on the real UI at any
 * size. Dragging peels it back to reveal the shipped screen; keyboard/
 * reduced-motion users get a button that does the same thing. */
export function TracingPaperLift({ t, screenshotSrc, screenshotAlt, isRtl }: TracingPaperLiftProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const dragSign = isRtl ? 1 : -1;

  return (
    <div className="tracing-lift">
      <div className="tracing-lift__stage">
        <Picture loading="lazy" decoding="async" src={screenshotSrc} alt={screenshotAlt} className="tracing-lift__screenshot" />

        {!prefersReducedMotion && (
          <m.div
            className="tracing-lift__paper"
            data-no-swipe=""
            drag="x"
            dragConstraints={{ left: dragSign === -1 ? -320 : 0, right: dragSign === -1 ? 0 : 320 }}
            dragElastic={0.05}
            animate={{ x: revealed ? dragSign * 340 : 0, opacity: revealed ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onDragEnd={(_event, info) => {
              if (Math.abs(info.offset.x) > 110) setRevealed(true);
            }}
            aria-hidden="true"
          >
            <Picture loading="lazy" decoding="async"
              src="/projects/estudioa/estudioa-browse-wireframe.svg"
              alt=""
              className="tracing-lift__wireframe reveal-fade"
              aria-hidden="true"
            />
            <span className="tracing-lift__curl" />
            <svg className="tracing-lift__guide" viewBox="0 0 80 24" aria-hidden="true">
              <path
                d={isRtl ? 'M70 12 L10 12' : 'M10 12 L70 12'}
                stroke="var(--accent-ink)"
                strokeWidth="1.4"
                strokeDasharray="3 5"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0 0 L8 4 L0 8 Z" fill="var(--accent-ink)" />
                </marker>
              </defs>
            </svg>
          </m.div>
        )}
      </div>

      <div className="tracing-lift__controls">
        <button type="button" className="tracing-lift__button" onClick={() => setRevealed((value) => !value)}>
          {revealed ? t('projects.estudioa.hideWireframe') : t('projects.estudioa.revealScreen')}
        </button>
        {revealed && (
          <p className="tracing-lift__reward reveal-fade">
            {t('projects.estudioa.wireframeLabel')}
            <PencilArrow pointing="forward" isRtl={isRtl} color="var(--accent-ink)" />
            {t('projects.estudioa.shippedLabel')}
          </p>
        )}
      </div>
    </div>
  );
}
