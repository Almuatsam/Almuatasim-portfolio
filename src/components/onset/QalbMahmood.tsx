import { Link } from 'react-router-dom';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { QALB_HERO, QALB_ROLE_KEYS, WEPRESENT_DOMAIN, WEPRESENT_URL } from '../../content/onset';
import { LiveTag } from '../projects/LiveTag';
import { ImageCredit } from './ImageCredit';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './onset.css';
import { Picture } from '../ui/Picture';

/** Qalb Mahmood overview (B4 On Set #1): the series description, the
 * October 2024 Melkweg Expo line and the WePresent link on the context
 * (left) page; the opening location photo and the owner's role list on
 * the work (right) page. */
export function QalbContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="onset__context">
      <Link to={chapterPath(lang, 'onset')} className="onset__back reveal-fade">
        {t('onset.backToOnSet')}
      </Link>
      <h1 className="font-display onset__entry-title reveal-fade-slow">{t('chapters.qalb.title')}</h1>
      <p className="onset__meta reveal-fade">{t('onset.qalb.meta')}</p>
      <p className="onset__description reveal-fade">{t('onset.qalb.description')}</p>
      <LiveTag t={t} url={WEPRESENT_URL} domain={WEPRESENT_DOMAIN} label={t('onset.qalb.wepresentLabel')} />
      <Link to={chapterPath(lang, 'follow')} className="onset__follow-link reveal-fade">
        {t('onset.qalb.followLink')}
      </Link>
    </div>
  );
}

export function QalbWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="onset__work">
      <figure className="onset__hero reveal-fade">
        <Picture loading="lazy" decoding="async"
          src={QALB_HERO.src}
          alt={t('onset.qalb.heroAlt')}
          className="onset__hero-img"
          style={{ objectPosition: QALB_HERO.position }}
        />
        <ImageCredit t={t} credit={QALB_HERO.credit} />
      </figure>
      <h2 className="onset__role-heading reveal-fade">{t('onset.qalb.roleHeading')}</h2>
      <ul className="onset__roles">
        {QALB_ROLE_KEYS.map((key) => (
          <li key={key} className="onset__role reveal-fade">
            {t(`onset.qalb.roles.${key}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
