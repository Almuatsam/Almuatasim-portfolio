import { useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { TFunction } from 'i18next';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ProjectScreenshot } from './ProjectScreenshot';
import './merge-the-screens.css';

interface MergeTheScreensProps {
  t: TFunction;
  unifiedScreenshotSrc: string;
  unifiedScreenshotAlt: string;
  onOpenScreenshot?: () => void;
}

type CardId = 'cafe' | 'gift' | 'tickets';
const CARD_IDS: CardId[] = ['cafe', 'gift', 'tickets'];

/** B5 #2 — three mismatched terminal cards sit apart; dragging each into
 * the dashed frame snaps it in, and once all three land, they cross-fade
 * into the single APOS screen with a printed receipt reward. */
export function MergeTheScreens({ t, unifiedScreenshotSrc, unifiedScreenshotAlt, onOpenScreenshot }: MergeTheScreensProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [merged, setMerged] = useState<Set<CardId>>(new Set());
  const allMerged = merged.size === CARD_IDS.length;

  function tryMerge(cardId: CardId, cardEl: HTMLDivElement) {
    const target = targetRef.current;
    if (!target) return;
    const t1 = target.getBoundingClientRect();
    const c1 = cardEl.getBoundingClientRect();
    const overlap =
      c1.left < t1.right && c1.right > t1.left && c1.top < t1.bottom && c1.bottom > t1.top;
    if (overlap) setMerged((prev) => new Set(prev).add(cardId));
  }

  function mergeAll() {
    setMerged(new Set(CARD_IDS));
  }

  return (
    <div className="merge-screens">
      <div className="merge-screens__stage" ref={containerRef}>
        {!allMerged && (
          <div className="merge-screens__target" ref={targetRef} aria-hidden="true">
            <span className="merge-screens__target-label font-mono">APOS</span>
          </div>
        )}

        {allMerged ? (
          <ProjectScreenshot src={unifiedScreenshotSrc} alt={unifiedScreenshotAlt} onOpen={onOpenScreenshot} />
        ) : (
          CARD_IDS.map((id, index) => {
            if (merged.has(id)) return null;
            return (
              <motion.div
                key={id}
                className={`merge-screens__card merge-screens__card--${id}`}
                drag={!prefersReducedMotion}
                dragConstraints={containerRef}
                dragElastic={0.15}
                onDragEnd={(_e, _info) => {
                  const el = document.getElementById(`merge-card-${id}`);
                  if (el) tryMerge(id, el as HTMLDivElement);
                }}
                id={`merge-card-${id}`}
                style={{ '--offset': index } as CSSProperties}
              >
                <span className="merge-screens__card-label font-mono">{t(`projects.apos.merge.${id}`)}</span>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="merge-screens__controls">
        {!allMerged && (
          <button type="button" className="merge-screens__button" onClick={mergeAll}>
            {t('projects.apos.merge.label')}
          </button>
        )}
        {allMerged && (
          <div className="merge-screens__receipt reveal-fade">
            <p className="merge-screens__receipt-text font-mono">{t('projects.apos.merge.receipt')}</p>
            <svg viewBox="0 0 40 30" className="merge-screens__tick" aria-hidden="true">
              <path
                d="M6 16 L16 24 L34 6"
                fill="none"
                stroke="var(--accent-ink)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="reveal-sketch"
                style={{ '--draw-length': 48 } as CSSProperties}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
