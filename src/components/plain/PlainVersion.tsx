import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentChapter } from '../../routes/useCurrentChapter';
import { PROJECTS } from '../../content/projects';
import { PROCESS_STEPS } from '../../content/process';
import { SKILL_GROUPS } from '../../content/skills';
import { PRESS_CARDS } from '../../content/press';
import { INSTAGRAM_POSTS, ROLE_KEYS as AMOUAGE_ROLE_KEYS } from '../../content/amouage';
import { QALB_ROLE_KEYS, WEPRESENT_URL } from '../../content/onset';
import { ART_PAINTING_IDS } from '../../content/chapters';
import { stripMarks } from '../../lib/marks';
import './plain-version.css';

const CASE_FIELDS = ['problem', 'insight', 'build', 'result'] as const;
const PAINTING_SLUGS: Record<string, string> = {
  painfulexperience: 'painful-experience',
  choice: 'choice',
  guidance: 'guidance',
};
const PHOTO_CREDITS = ['aziz', 'owner', 'both'] as const;

/** The whole portfolio as one plain page: every chapter's words, links
 * and photo credits, with no animation, for a quick read in either
 * language. */
export function PlainVersion() {
  const { t, i18n } = useTranslation();
  const { lang } = useCurrentChapter();
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];
  const marginNotes = t('about.marginNotes', { returnObjects: true }) as string[];
  const plain = (key: string): string => stripMarks(t(key));
  const lines = (key: string): string => (t(key, { returnObjects: true }) as string[]).map(stripMarks).join(' ');

  return (
    <article className="plain" tabIndex={-1}>
      <h1 className="plain__title">{t('plain.title')}</h1>
      <p className="plain__intro">{t('plain.intro')}</p>

      <section>
        <img className="plain__portrait" src="/img/about/portrait-mirror-480.webp" alt={t('about.portraitAlt')} width="240" height="293" />
        <h2 className="plain__headline">{t('about.headline')}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="plain__paragraph">
            {paragraph}
          </p>
        ))}
        <ul className="plain__list">
          {marginNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('screens.heading')}</h2>
        <p>{t('screens.intro')}</p>
        {PROJECTS.map((project) => (
          <div key={project.id} className="plain__block">
            <h3 className="plain__group">
              {t(`chapters.${project.id}.title`)}: {t(`projects.${project.id}.descriptor`)}
            </h3>
            {CASE_FIELDS.filter((field) => i18n.exists(`projects.${project.id}.${field}`)).map((field) => (
              <p key={field}>
                <strong>{t(`projectLabels.${field}`)}.</strong> {plain(`projects.${project.id}.${field}`)}
              </p>
            ))}
            {project.stack.length > 0 && (
              <p>
                <strong>{t('projectLabels.stack')}.</strong> {project.stack.join(', ')}
              </p>
            )}
            <p>
              <a className="ltr-fragment" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                {project.liveDomain}
              </a>
              {i18n.exists(`projects.${project.id}.liveNote`) && <> {t(`projects.${project.id}.liveNote`)}</>}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2>{t('chapters.art.title')}</h2>
        <p>{t('art.indexIntro')}</p>
        {ART_PAINTING_IDS.map((id) => (
          <div key={id} className="plain__block">
            <h3 className="plain__group">
              {t(`art.paintings.${PAINTING_SLUGS[id]}.title`)}, {t(`art.paintings.${PAINTING_SLUGS[id]}.medium`)},{' '}
              {t(`art.paintings.${PAINTING_SLUGS[id]}.year`)}
            </h3>
            <p>{lines(`art.paintings.${PAINTING_SLUGS[id]}.story`)}</p>
          </div>
        ))}
        <p>{t('art.closingCaption')}</p>
      </section>

      <section>
        <h2>{t('chapters.sewing.title')}</h2>
        <p>{t('sewing.indexIntro')}</p>
        <p>{t('sewing.sketches.caption')}</p>
        <h3 className="plain__group">
          {t('chapters.fashionweek.title')}, {t('sewing.fashionWeek.label')}
        </h3>
        <p>{lines('sewing.fashionWeek.story')}</p>
        <ul className="plain__list">
          {(t('sewing.fashionWeek.made', { returnObjects: true }) as string[]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="plain__group">{t('chapters.tie.title')}</h3>
        <p>{t('sewing.tie.caption')}</p>
        <h3 className="plain__group">{t('chapters.ruffle.title')}</h3>
        <p>
          {t('sewing.ruffle.ruffleCaption')} {t('sewing.ruffle.finishedCaption')}
        </p>
      </section>

      <section>
        <h2>{t('chapters.onset.title')}</h2>
        <p>{t('onset.intro')}</p>
        <h3 className="plain__group">
          {t('chapters.qalb.title')}: {t('onset.qalb.meta')}
        </h3>
        <p>{t('onset.qalb.description')}</p>
        <ul className="plain__list">
          {QALB_ROLE_KEYS.map((key) => (
            <li key={key}>{t(`onset.qalb.roles.${key}`)}</li>
          ))}
        </ul>
        <p>
          <a href={WEPRESENT_URL} target="_blank" rel="noopener noreferrer">
            {t('onset.qalb.wepresentLabel')}
          </a>
        </p>
        <h3 className="plain__group">{t('chapters.press.title')}</h3>
        <ul className="plain__list">
          {PRESS_CARDS.map((card) => (
            <li key={card.id}>
              <a href={card.url} target="_blank" rel="noopener noreferrer">
                {card.publication}: {card.headline}
              </a>{' '}
              ({card.writer}, {t(`onset.press.dates.${card.id}`)})
            </li>
          ))}
        </ul>
        <h3 className="plain__group">
          {t('chapters.amouage.title')}: {t('onset.cards.amouage')}
        </h3>
        <p>{t('onset.amouage.intro')}</p>
        <ul className="plain__list">
          {AMOUAGE_ROLE_KEYS.map((key) => (
            <li key={key}>{t(`onset.amouage.roles.${key}`)}</li>
          ))}
        </ul>
        <ul className="plain__list">
          {INSTAGRAM_POSTS.map((post) => (
            <li key={post.id}>
              <a className="ltr-fragment" href={post.url} target="_blank" rel="noopener noreferrer">
                {post.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('chapters.process.title')}</h2>
        <p className="plain__paragraph">{t('process.intro')}</p>
        <ol className="plain__list">
          {PROCESS_STEPS.map((step) => (
            <li key={step.id}>
              <strong>{t(`process.steps.${step.id}.name`)}</strong>: {t('process.sides.screens')}, {plain(`process.steps.${step.id}.screens`)}.{' '}
              {t('process.sides.byHand')}, {plain(`process.steps.${step.id}.byHand`)}.
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>{t('chapters.skills.title')}</h2>
        {SKILL_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="plain__group">{t(`skills.groups.${group.id}`)}</h3>
            <ul className="plain__list">
              {group.skills.map((skill) => (
                <li key={skill.id}>{t(`skills.items.${skill.id}`)}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>{t('plain.contactHeading')}</h2>
        <p className="plain__closing">{t('contact.closingLine')}</p>
        <ul className="plain__contact-list">
          <li>
            <a className="ltr-fragment" href={`mailto:${t('contact.email')}`}>
              {t('contact.email')}
            </a>
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
      </section>

      <p className="plain__colophon">
        {t('contact.colophon.photos', { names: PHOTO_CREDITS.map((key) => t(`onset.credits.${key}`)).join(', ') })}
      </p>
      <p className="plain__colophon">{t('contact.colophon.stack')}</p>
      <p className="plain__colophon">
        {/* Soria's CC BY-ND 4.0 licence (public/fonts/soria/LICENSE.txt)
            asks for attribution to the designer and the licence itself,
            so both render as real links, not just visible URL text. */}
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
