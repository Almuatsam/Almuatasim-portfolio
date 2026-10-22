import type { CSSProperties } from 'react';
import { useFixedT } from '../../hooks/useFixedT';
import { RevealText } from '../motion/RevealText';
import { computeParagraphDelays } from '../../lib/revealStagger';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './about.css';

export function AboutContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const marginNotes = t('about.marginNotes', { returnObjects: true }) as string[];

  return (
    <div className="about__context">
      <div className="about__portrait-frame reveal-fade">
        <img loading="lazy" decoding="async" src="/about/portrait.jpg" alt={t('about.portraitAlt')} className="about__portrait" />
      </div>
      <ul className="about__notes">
        {marginNotes.map((note, index) => {
          const style: CSSProperties = {
            '--word-index': index,
            '--word-stagger': '110ms',
            '--reveal-base': '420ms',
          } as CSSProperties;
          return (
            <li key={note} className="about__note reveal-word" style={style}>
              <span className="about__note-marker" aria-hidden="true" />
              <span className="about__note-text font-hand">{note}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AboutWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const isRtl = lang === 'ar';
  const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];
  const paragraphDelays = computeParagraphDelays(paragraphs, isRtl);

  return (
    <div className="about__work">
      <h1 className="font-display about__headline reveal-fade-slow">{t('about.headline')}</h1>
      {paragraphs.map((paragraph, index) => (
        <RevealText
          key={paragraph}
          text={paragraph}
          isRtl={isRtl}
          className="about__paragraph"
          baseDelayMs={paragraphDelays[index]}
        />
      ))}
    </div>
  );
}
