import { useTranslation } from 'react-i18next';
import './about.css';

export function AboutContext() {
  const { t } = useTranslation();
  const marginNotes = t('about.marginNotes', { returnObjects: true }) as string[];

  return (
    <div className="about__context">
      <div className="about__portrait-frame">
        <span className="about__tape" aria-hidden="true" />
        <span className="sr-only">{t('about.portraitAlt')}</span>
      </div>
      <ul className="about__notes">
        {marginNotes.map((note) => (
          <li key={note} className="about__note font-hand">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutWork() {
  const { t } = useTranslation();
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];

  return (
    <div className="about__work">
      <h1 className="font-display about__headline">{t('about.headline')}</h1>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="about__paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
