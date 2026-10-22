import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { PRESS_CARDS, PULL_QUOTE } from '../../content/press';
import { PencilArrowTiny } from '../projects/LiveTag';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import '../projects/live-tag.css';
import './onset.css';
import './press.css';

/** "In the press" (B4 On Set, "The series in the press"): the one pull
 * quote and its attribution on the context (left) page, the three
 * press cards on the work (right) page. Honesty rule: the articles
 * credit the artist and do not name the owner, so nothing on this
 * spread says or implies that they do. */
export function PressContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="press__context">
      <Link to={chapterPath(lang, 'qalb')} className="onset__back reveal-fade">
        {t('chapters.qalb.title')}
      </Link>
      <h1 className="font-display onset__entry-title reveal-fade-slow">{t('chapters.press.title')}</h1>
      <figure className="press__quote-block reveal-fade">
        {/* Quoted in English on both pages: a quote is not translated. */}
        <blockquote className="font-display press__quote" lang="en" dir="ltr">
          &ldquo;{PULL_QUOTE}&rdquo;
        </blockquote>
        <figcaption className="press__attribution">{t('onset.press.quoteAttribution')}</figcaption>
      </figure>
    </div>
  );
}

export function PressWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="press__work">
      {PRESS_CARDS.map((card) => (
        <article key={card.id} className="press__card reveal-fade">
          <div className="press__meta">
            <p className="press__publication" lang="en" dir="ltr">
              {card.publication}
            </p>
            <p className="press__date">{t(`onset.press.dates.${card.id}`)}</p>
          </div>
          {/* Other people's headlines: kept in English, in IBM Plex Sans. */}
          <h2 className="press__headline" lang="en" dir="ltr">
            {card.headline}
          </h2>
          <p className="press__line">{t(`onset.press.lines.${card.id}`)}</p>
          <a href={card.url} target="_blank" rel="noopener noreferrer" className="live-tag__link press__link">
            <span className="live-tag__label">{t('onset.press.readOn', { publication: card.publication })}</span>
            <PencilArrowTiny />
          </a>
          {card.id === 'sandyTimes' && (
            <p className="press__note">
              <Link to={chapterPath(lang, 'follow')} className="press__note-link">
                {t('onset.press.sandyNote')}
              </Link>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
