import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import './plain-version.css';

export function PlainVersion() {
  const { t } = useTranslation();
  const { lang } = useCurrentChapter();
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];

  return (
    <article className="plain">
      <h1 className="plain__title">{t('plain.title')}</h1>
      <p className="plain__intro">{t('plain.intro')}</p>

      <h2 className="plain__headline">{t('about.headline')}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="plain__paragraph">
          {paragraph}
        </p>
      ))}

      <h2>{t('plain.contactHeading')}</h2>
      <ul className="plain__contact-list">
        <li>
          <bdi className="ltr-fragment">{t('contact.email')}</bdi>
        </li>
        <li>
          <a className="ltr-fragment" href={t('contact.linkedin')} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a className="ltr-fragment" href={t('contact.github')} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      </ul>

      <p className="plain__colophon">
        {/* Soria's CC BY-ND 4.0 licence (public/fonts/soria/LICENSE.txt)
            asks for attribution to the designer and the licence itself,
            so both render as real links, not just visible URL text.
            Named components (not child-order indices) so the <designer>/
            <license> tags in en.json/ar.json can't drift out of sync with
            JSX child position. */}
        <Trans
          i18nKey="plain.colophon"
          components={{
            designer: <a href="https://www.behance.net/danibydani" target="_blank" rel="noopener noreferrer" />,
            license: <a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank" rel="noopener noreferrer" />,
          }}
        />
      </p>

      <Link to={`/${lang}`} className="plain__back">
        {t('plain.backToBook')}
      </Link>
    </article>
  );
}
