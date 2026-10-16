import { motion } from 'framer-motion';
import { Book } from '../components/layout/Book';
import { OpenSpread } from '../components/layout/OpenSpread';
import { IndexTabs } from '../components/book/IndexTabs';
import { ChapterArrows } from '../components/book/ChapterArrows';
import { useCurrentChapter } from './useCurrentChapter';
import { contextComponentFor, workComponentFor } from './chapterContent';
import { folioFor } from '../content/navigation';
import { useChapterKeyboardNav } from '../hooks/useChapterKeyboardNav';
import { useBookFlip } from '../hooks/useBookFlip';
import { useFixedT } from '../hooks/useFixedT';
import type { ChapterDef } from '../content/chapters';
import type { SupportedLang } from '../i18n';
import './book-flip.css';

interface FaceProps {
  lang: SupportedLang;
  chapter: ChapterDef;
}

/** One face of the flip card: a complete two-page spread for a given
 * language/chapter pair, independent of whichever is globally active. */
function Face({ lang, chapter }: FaceProps) {
  const t = useFixedT(lang);
  const { current, total } = folioFor(chapter);
  const folio = t('common.folio', {
    current: String(current).padStart(2, '0'),
    total: String(total).padStart(2, '0'),
  });
  const ContextComponent = contextComponentFor(chapter.id);
  const WorkComponent = workComponentFor(chapter.id);

  return (
    <OpenSpread
      contextFolio={folio}
      workFolio={folio}
      context={<ContextComponent lang={lang} chapter={chapter} />}
      work={<WorkComponent lang={lang} chapter={chapter} />}
    />
  );
}

/** B2/B6/B3 — the persistent open-book frame. It stays mounted across
 * chapter and language navigation so the accent colour can cross-fade
 * and the page content can play its real page-turn / language-flip
 * choreography instead of the whole book remounting per route. */
export function OpenBookLayout() {
  const { lang, chapter } = useCurrentChapter();
  useChapterKeyboardNav(lang, chapter);
  const { displayed, flip, rotateY, shadowOpacity, scale } = useBookFlip(lang, chapter);

  return (
    <Book accent={chapter.accent}>
      <div className="book-flip" style={{ perspective: 2400 }}>
        <motion.div className="book-flip__rotor" style={{ rotateY, scale }}>
          <div className="book-flip__face" dir={displayed.lang === 'ar' ? 'rtl' : 'ltr'}>
            <Face lang={displayed.lang} chapter={displayed.chapter} />
          </div>
          {flip && (
            <div
              className="book-flip__face book-flip__face--back"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <Face lang={lang} chapter={chapter} />
            </div>
          )}
        </motion.div>
        {flip && <motion.div className="book-flip__shadow" style={{ opacity: shadowOpacity }} aria-hidden="true" />}
      </div>
      <IndexTabs lang={lang} chapter={chapter} />
      <ChapterArrows lang={lang} chapter={chapter} />
    </Book>
  );
}
