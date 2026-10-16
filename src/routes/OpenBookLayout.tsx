import { motion } from 'framer-motion';
import { Book } from '../components/layout/Book';
import { OpenSpread } from '../components/layout/OpenSpread';
import { TurningSpread } from '../components/layout/TurningSpread';
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

/** One face of the language-flip card: a complete two-page spread for a
 * given language/chapter pair, independent of whichever is globally
 * active. Only used for the B3 language flip — the chapter page-turn
 * (B6 part 2) uses TurningSpread instead, since the book itself must stay
 * flat while only a single leaf turns. */
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
 * chapter and language navigation so the accent colour can cross-fade.
 * Chapter changes turn a single hinged leaf (TurningSpread) while the
 * book itself stays flat; a language change still closes and flips the
 * whole book around its vertical axis. */
export function OpenBookLayout() {
  const { lang, chapter } = useCurrentChapter();
  useChapterKeyboardNav(lang, chapter);
  const { displayed, flip, rotateY, shadowOpacity, scale, leafShade, leafCurl } = useBookFlip(lang, chapter);

  const languageFlip = flip?.kind === 'language' ? flip : null;
  const chapterFlip = flip?.kind === 'chapter' ? flip : null;

  return (
    <Book accent={chapter.accent}>
      {languageFlip ? (
        <div className="book-flip" style={{ perspective: 2400 }}>
          <motion.div className="book-flip__rotor" style={{ rotateY, scale }}>
            <div className="book-flip__face" dir={displayed.lang === 'ar' ? 'rtl' : 'ltr'}>
              <Face lang={displayed.lang} chapter={displayed.chapter} />
            </div>
            <div
              className="book-flip__face book-flip__face--back"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <Face lang={lang} chapter={chapter} />
            </div>
          </motion.div>
          <motion.div className="book-flip__shadow" style={{ opacity: shadowOpacity }} aria-hidden="true" />
        </div>
      ) : (
        <TurningSpread
          lang={displayed.lang}
          dir={displayed.lang === 'ar' ? 'rtl' : 'ltr'}
          displayedChapter={displayed.chapter}
          flip={chapterFlip}
          rotateY={rotateY}
          leafShade={leafShade}
          leafCurl={leafCurl}
        />
      )}
      <IndexTabs lang={lang} chapter={chapter} />
      <ChapterArrows lang={lang} chapter={chapter} />
    </Book>
  );
}
