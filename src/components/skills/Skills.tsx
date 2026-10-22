import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { TFunction } from 'i18next';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath, getChapter } from '../../content/chapters';
import { ACCENTS } from '../../content/accents';
import { SKILL_GROUPS, type SkillGroup } from '../../content/skills';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './skills.css';

const CONTEXT_GROUP_COUNT = 2;

interface GroupProps {
  t: TFunction;
  lang: ChapterPanelProps['lang'];
  group: SkillGroup;
}

/** One group of the confirmed list. Each skill names the chapters that
 * prove it; they show on hover or focus (always on touch screens), each
 * in its own chapter ink. */
function Group({ t, lang, group }: GroupProps) {
  return (
    <section className="skills__group reveal-fade">
      <h2 className="skills__group-name">{t(`skills.groups.${group.id}`)}</h2>
      <ul className="skills__list">
        {group.skills.map((skill) => (
          <li key={skill.id} className="skills__item">
            <span className="skills__name" tabIndex={0}>
              {t(`skills.items.${skill.id}`)}
            </span>
            <ul className="skills__proof" aria-label={t('skills.provedIn')}>
              {skill.chapters.map((id) => {
                const accent = ACCENTS[getChapter(id).accent];
                const style = { '--chip-accent': accent.accent, '--chip-ink': accent.ink } as CSSProperties;
                return (
                  <li key={id}>
                    <Link to={chapterPath(lang, id)} className="skills__chip" style={style}>
                      <span className="skills__chip-swatch" aria-hidden="true" />
                      {t(`chapters.${id}.title`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Phase 3 Kickoff.md section 6: the four confirmed groups as a plain,
 * well-typeset list, two groups to a page. */
export function SkillsContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="skills__page">
      <h1 className="font-display skills__heading reveal-fade-slow">{t('chapters.skills.title')}</h1>
      <p className="skills__hint reveal-fade">{t('skills.hint')}</p>
      {SKILL_GROUPS.slice(0, CONTEXT_GROUP_COUNT).map((group) => (
        <Group key={group.id} t={t} lang={lang} group={group} />
      ))}
    </div>
  );
}

export function SkillsWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);

  return (
    <div className="skills__page skills__page--work">
      {SKILL_GROUPS.slice(CONTEXT_GROUP_COUNT).map((group) => (
        <Group key={group.id} t={t} lang={lang} group={group} />
      ))}
    </div>
  );
}
