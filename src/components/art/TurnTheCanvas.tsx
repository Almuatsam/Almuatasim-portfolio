import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './turn-the-canvas.css';

interface TurnTheCanvasProps {
  src: string;
  alt: string;
  title: string;
  medium: string;
  year: string;
  /** Short back-of-canvas recap, in small body text, --color-secondary
   * (Reset section 1 bans the handwriting font the brief originally
   * asked for here). The full story still lives as real text on the
   * facing context page regardless (B5 #5). */
  backLines: string[];
  turnHint: string;
  seeBack: string;
  seeFront: string;
  /** Painful Experience only — a hover/focus callout pointing at the
   * thread between the two faces (B4, B5 #5). */
  threadCallout?: string;
}

/** B5 #5 — the painting turns around (rotateY 180deg) to show wooden
 * stretcher bars and a small label, instead of the skeuomorphic lifted
 * corner + pencil note from the original brief (Reset section 1: no
 * tilt or rotation anywhere except the cover stickers, no handwriting
 * font). The turn is a flat button, not a drag, so it has a built-in
 * keyboard/reduced-motion alternative. */
export function TurnTheCanvas({ src, alt, title, medium, year, backLines, turnHint, seeBack, seeFront, threadCallout }: TurnTheCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [calloutOn, setCalloutOn] = useState(false);

  return (
    <div className="turn-canvas">
      <button
        type="button"
        className="turn-canvas__button"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={flipped ? seeFront : seeBack}
      >
        <div className="turn-canvas__stage">
          <motion.div
            className="turn-canvas__inner"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0.001 : 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="turn-canvas__face turn-canvas__face--front">
              <img src={src} alt={alt} className="turn-canvas__img" />
              {threadCallout && (
                <span
                  className="turn-canvas__thread-dot"
                  onPointerEnter={() => setCalloutOn(true)}
                  onPointerLeave={() => setCalloutOn(false)}
                  onFocus={() => setCalloutOn(true)}
                  onBlur={() => setCalloutOn(false)}
                  tabIndex={0}
                  role="note"
                  aria-label={threadCallout}
                >
                  {calloutOn && <span className="turn-canvas__thread-label">{threadCallout}</span>}
                </span>
              )}
            </div>
            <div className="turn-canvas__face turn-canvas__face--back">
              <div className="turn-canvas__bars" aria-hidden="true" />
              <div className="turn-canvas__back-text">
                {backLines.map((line) => (
                  <p key={line} className="turn-canvas__back-line">
                    {line}
                  </p>
                ))}
              </div>
              <span className="turn-canvas__label">
                <span className="turn-canvas__label-title">{title}</span>
                <span className="turn-canvas__label-meta">
                  {medium}, {year}
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </button>
      <span className="turn-canvas__hint">{turnHint}</span>
    </div>
  );
}
