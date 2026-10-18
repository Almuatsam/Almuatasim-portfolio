import type { CSSProperties } from 'react';
import { useFixedT } from '../../hooks/useFixedT';
import { RevealText } from '../motion/RevealText';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import './about.css';

export function AboutContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const marginNotes = t('about.marginNotes', { returnObjects: true }) as string[];

  return (
    <div className="about__context">
      <div className="about__portrait-frame reveal-fade">
        <img src="/about/portrait.jpg" alt={t('about.portraitAlt')} className="about__portrait" />
      </div>
      <ul className="about__notes">
        {marginNotes.map((note, index) => {
          const style: CSSProperties = {
            '--word-index': index,
            '--word-stagger': '110ms',
            '--reveal-base': '420ms',
          } as CSSProperties;
          return (
            <li key={note} className="about__note font-hand reveal-word" style={style}>
              {note}
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
  const stepSize = isRtl ? 90 : 20;

  const paragraphDelays: number[] = [];
  paragraphs.reduce((offset, paragraph) => {
    paragraphDelays.push(480 + offset * stepSize);
    const stepCount = isRtl ? Math.ceil(paragraph.split(/\s+/).length / 3) : paragraph.split(/\s+/).length;
    return offset + stepCount;
  }, 0);

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
