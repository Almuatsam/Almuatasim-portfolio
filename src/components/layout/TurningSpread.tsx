import type { CSSProperties } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { Page } from './Page';
import { contextComponentFor, workComponentFor } from '../../routes/chapterContent';
import { folioFor } from '../../content/navigation';
import { useFixedT } from '../../hooks/useFixedT';
import type { ChapterFlip } from '../../hooks/useBookFlip';
import type { ChapterDef } from '../../content/chapters';
import type { SupportedLang } from '../../i18n';
import './turning-spread.css';

type Slot = 'context' | 'work';

interface PanelProps {
  lang: SupportedLang;
  chapter: ChapterDef;
  slot: Slot;
}

function Panel({ lang, chapter, slot }: PanelProps) {
  const Component = slot === 'context' ? contextComponentFor(chapter.id) : workComponentFor(chapter.id);
  return <Component lang={lang} chapter={chapter} />;
}

function folioLabel(t: ReturnType<typeof useFixedT>, chapter: ChapterDef): string {
  const { current, total } = folioFor(chapter);
  return t('common.folio', { current: String(current).padStart(2, '0'), total: String(total).padStart(2, '0') });
}

interface TurningSpreadProps {
  lang: SupportedLang;
  dir: 'ltr' | 'rtl';
  displayedChapter: ChapterDef;
  flip: ChapterFlip | null;
  rotateY: MotionValue<number>;
  leafShade: MotionValue<number>;
  leafCurl: MotionValue<number>;
}

/** B6 part 2 — the book itself stays flat and still. Only one leaf turns,
 * hinged at the spine: the slot it is turning TOWARD already has the
 * incoming content rendered underneath, so the turn reveals it; the slot
 * it is turning FROM keeps the outgoing content until the leaf lands on
 * top of it, then swaps — imperceptibly, since the leaf's back face
 * matches exactly. */
export function TurningSpread({ lang, dir, displayedChapter, flip, rotateY, leafShade, leafCurl }: TurningSpreadProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';

  const contextChapter = flip?.direction === 'back' ? flip.to : displayedChapter;
  const workChapter = flip?.direction === 'forward' ? flip.to : displayedChapter;

  // The leaf is the slot being turned AWAY from: forward turns the work
  // (right, LTR) page over to become the new context page; back turns the
  // context page over to become the new work page.
  const leafSlot: Slot | null = flip ? (flip.direction === 'forward' ? 'work' : 'context') : null;
  const leafBackSlot: Slot = leafSlot === 'context' ? 'work' : 'context';
  const leafFrontChapter = displayedChapter;
  const leafBackChapter = flip?.to ?? displayedChapter;

  // The hinge sits at the spine: the work page's spine edge is its
  // inline-start edge in LTR (visually left) and its inline-end edge in
  // RTL (visually right, since the spread mirrors); the context page's
  // hinge is the opposite physical edge.
  const workHingeIsPhysicalLeft = !isRtl;
  const hingeIsPhysicalLeft = leafSlot === 'work' ? workHingeIsPhysicalLeft : !workHingeIsPhysicalLeft;
  const transformOrigin = hingeIsPhysicalLeft ? '0% 50%' : '100% 50%';
  const shadeDirection = hingeIsPhysicalLeft ? 'to right' : 'to left';
  const highlightSide: 'left' | 'right' = hingeIsPhysicalLeft ? 'right' : 'left';

  return (
    <div className="open-spread turning-spread" dir={dir}>
      <Page className="open-spread__page" folio={folioLabel(t, contextChapter)}>
        <Panel key={`context-${lang}-${contextChapter.id}`} lang={lang} chapter={contextChapter} slot="context" />
      </Page>
      <div className="open-spread__gutter" aria-hidden="true" />
      <Page className="open-spread__page" folio={folioLabel(t, workChapter)}>
        <Panel key={`work-${lang}-${workChapter.id}`} lang={lang} chapter={workChapter} slot="work" />
      </Page>

      {flip && leafSlot && (
        <div className={`turning-spread__leaf-wrap turning-spread__leaf-wrap--${leafSlot}`}>
          <motion.div className="turning-spread__leaf" style={{ rotateY, skewY: leafCurl, transformOrigin }}>
            <div className="turning-spread__face">
              <div className="turning-spread__face-content">
                <Panel lang={lang} chapter={leafFrontChapter} slot={leafSlot} />
              </div>
              <motion.div
                className="turning-spread__shade"
                style={{ opacity: leafShade, background: `linear-gradient(${shadeDirection}, rgba(0,0,0,0.38), transparent 60%)` }}
                aria-hidden="true"
              />
              <span
                className="turning-spread__highlight"
                style={{ [highlightSide]: 0 } as CSSProperties}
                aria-hidden="true"
              />
            </div>
            <div className="turning-spread__face turning-spread__face--back" style={{ transform: 'rotateY(180deg)' }}>
              <div className="turning-spread__face-content">
                <Panel lang={lang} chapter={leafBackChapter} slot={leafBackSlot} />
              </div>
              <motion.div
                className="turning-spread__shade"
                style={{ opacity: leafShade, background: `linear-gradient(${shadeDirection}, rgba(0,0,0,0.38), transparent 60%)` }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
