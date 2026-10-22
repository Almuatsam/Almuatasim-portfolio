import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { INSTAGRAM_POSTS, PINNED_NOTES, PRINTS, ROLE_KEYS } from '../../content/amouage';
import { PencilArrowTiny } from '../projects/LiveTag';
import { ImageCredit } from './ImageCredit';
import { PrintStack } from './PrintStack';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import '../projects/live-tag.css';
import './onset.css';
import './amouage.css';

/** Amouage (B4 On Set #2, B5 #8 Amouage variant). Left page: the two
 * projects, the owner's role as stated in the brief, and the three
 * "View on Instagram" links. There are no "made by me" outlines here:
 * the owner's contribution is the set as a whole, not one object. */
export function AmouageContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="amouage__context">
      <Link to={chapterPath(lang, 'onset')} className="onset__back reveal-fade">
        {t('onset.backToOnSet')}
      </Link>
      <h1 className="font-display onset__entry-title reveal-fade-slow">{t('chapters.amouage.title')}</h1>
      <p className="onset__meta reveal-fade">{t('onset.cards.amouage')}</p>
      <p className="onset__description reveal-fade">{t('onset.amouage.intro')}</p>
      <h2 className="onset__role-heading reveal-fade">{t('onset.qalb.roleHeading')}</h2>
      <ul className="onset__roles">
        {ROLE_KEYS.map((key) => (
          <li key={key} className="onset__role reveal-fade">
            {t(`onset.amouage.roles.${key}`)}
          </li>
        ))}
      </ul>
      <ul className="amouage__links">
        {INSTAGRAM_POSTS.map((post) => (
          <li key={post.id} className="amouage__link-item reveal-fade">
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="live-tag__link amouage__link">
              <span className="live-tag__label">{t('onset.amouage.viewOnInstagram')}</span>
              <PencilArrowTiny />
            </a>
            <bdi className="live-tag__domain font-mono ltr-fragment">{post.label}</bdi>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Right page: the print stack, with the heart-prop photo and the
 * owner's appearance in the video pinned beside it as making-of notes. */
export function AmouageWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const prints = PRINTS.map((print) => ({
    id: print.id,
    src: print.src,
    alt: t(`onset.amouage.prints.${print.id}`),
    credit: print.credit,
  }));

  return (
    <div className="amouage__work">
      <div className="amouage__stack-column reveal-fade">
        <PrintStack
          prints={prints}
          buttonLabel={(current, total) => t('onset.amouage.nextPrint', { current, total })}
          renderCredit={(credit) => <ImageCredit t={t} credit={credit} />}
        />
        <p className="amouage__hint">{t('onset.amouage.stackHint')}</p>
      </div>
      <div className="amouage__notes">
        {PINNED_NOTES.map((note) => (
          <figure key={note.id} className="amouage__note reveal-fade">
            <img
              src={note.src}
              alt={t(`onset.amouage.notes.${note.id}.alt`)}
              className="amouage__note-img"
              style={{ aspectRatio: note.aspect, objectPosition: note.position }}
            />
            <figcaption className="amouage__note-caption">{t(`onset.amouage.notes.${note.id}.caption`)}</figcaption>
            <ImageCredit t={t} credit={note.credit} />
          </figure>
        ))}
      </div>
    </div>
  );
}
