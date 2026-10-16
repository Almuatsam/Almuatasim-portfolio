import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Book } from '../components/layout/Book';
import { OpenSpread } from '../components/layout/OpenSpread';
import { IndexTabs } from '../components/book/IndexTabs';
import { ChapterArrows } from '../components/book/ChapterArrows';
import { useCurrentChapter } from './useCurrentChapter';
import { contextComponentFor, workComponentFor } from './chapterContent';
import { folioFor } from '../content/navigation';
import { useChapterKeyboardNav } from '../hooks/useChapterKeyboardNav';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const PANEL_VARIANTS = {
  initial: { opacity: 0, filter: 'blur(2px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(2px)' },
};

/** B2/B6 — the persistent open-book frame. It stays mounted across chapter
 * navigation so the accent colour can cross-fade and the page content can
 * animate in and out, instead of the whole book remounting per route. */
export function OpenBookLayout() {
  const { t } = useTranslation();
  const { lang, chapter } = useCurrentChapter();
  useChapterKeyboardNav(lang, chapter);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { current, total } = folioFor(chapter);
  const folio = t('common.folio', {
    current: String(current).padStart(2, '0'),
    total: String(total).padStart(2, '0'),
  });

  const ContextComponent = contextComponentFor(chapter.id);
  const WorkComponent = workComponentFor(chapter.id);
  const transition = prefersReducedMotion
    ? { duration: 0.2 }
    : { duration: 0.5, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <Book accent={chapter.accent}>
      <OpenSpread
        contextFolio={folio}
        workFolio={folio}
        context={
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`context-${chapter.id}`}
              className="chapter-panel"
              variants={PANEL_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <ContextComponent />
            </motion.div>
          </AnimatePresence>
        }
        work={
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`work-${chapter.id}`}
              className="chapter-panel"
              variants={PANEL_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <WorkComponent />
            </motion.div>
          </AnimatePresence>
        }
      />
      <IndexTabs lang={lang} chapter={chapter} />
      <ChapterArrows lang={lang} chapter={chapter} />
    </Book>
  );
}
