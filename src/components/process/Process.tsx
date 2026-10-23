import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { TFunction } from 'i18next';
import { useFixedT } from '../../hooks/useFixedT';
import { chapterPath } from '../../content/chapters';
import { PROCESS_STEPS, type ProcessExample, type ProcessStepId } from '../../content/process';
import { setProcessStep, useProcessStep } from '../../lib/processStore';
import { Marked } from '../motion/Marked';
import { ImageCredit } from '../onset/ImageCredit';
import type { ChapterPanelProps } from '../../routes/chapterContent';
import '../onset/onset.css';
import './process.css';
import { Picture } from '../ui/Picture';

const STEP_COUNT = PROCESS_STEPS.length;

const pad = (n: number): string => String(n).padStart(2, '0');

/** Phase 3 Kickoff.md section 5, the step list (left page): five steps
 * down the page joined by a stitch line that sews down to the chosen
 * step. The examples for that step show on the facing page. */
export function ProcessContext({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const stage = useProcessStep();
  const style = { '--step': stage, '--steps': STEP_COUNT - 1 } as CSSProperties;

  return (
    <div className="process__context">
      <h1 className="font-display process__heading reveal-fade-slow">{t('chapters.process.title')}</h1>
      <p className="process__intro reveal-fade">{t('process.intro')}</p>
      <p className="process__hint reveal-fade">{t('process.hint')}</p>
      <ol className="process__steps reveal-fade" style={style} aria-label={t('process.stepsLabel')}>
        {PROCESS_STEPS.map((step, index) => (
          <li key={step.id} className={`process__step${index <= stage ? ' process__step--sewn' : ''}`}>
            <button
              type="button"
              className="process__step-button"
              aria-pressed={index === stage}
              onClick={() => setProcessStep(index, STEP_COUNT)}
            >
              <span className="process__dot" aria-hidden="true" />
              <span className="process__step-number font-mono">
                <bdi>{pad(index + 1)}</bdi>
              </span>
              <span className="process__step-name">{t(`process.steps.${step.id}.name`)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface ExampleProps {
  t: TFunction;
  lang: ChapterPanelProps['lang'];
  side: 'screens' | 'byHand';
  stepId: ProcessStepId;
  example: ProcessExample;
  delayMs: number;
}

function Example({ t, lang, side, stepId, example, delayMs }: ExampleProps) {
  const style = { animationDelay: `${delayMs}ms` } as CSSProperties;
  const imageClass = `process__images process__images--${Math.min(example.images.length, 4)}`;

  return (
    <section className="process__example reveal-fade reveal-in" style={style}>
      <h2 className="process__side">{t(`process.sides.${side}`)}</h2>
      <p className="process__text">
        <Marked text={t(`process.steps.${stepId}.${side}`)} />
      </p>
      {example.images.length > 0 && (
        <ul className={imageClass}>
          {example.images.map((image) => (
            <li key={image.src} className="process__figure">
              <Picture src={image.src} alt={t(image.altKey)} loading="lazy" decoding="async" className="process__img" sizes="(max-width: 899px) 45vw, 240px" style={{ objectPosition: image.position }} />
              {image.credit && <ImageCredit t={t} credit={image.credit} />}
            </li>
          ))}
        </ul>
      )}
      <ul className="process__links">
        {example.chapters.map((id) => (
          <li key={id}>
            <Link to={chapterPath(lang, id)} className="process__link">
              {t('process.open', { chapter: t(`chapters.${id}.title`) })}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The two examples for the chosen step (right page). Picking a step
 * remounts the panel, which replays the same ink-in fade the rest of the
 * book uses. */
export function ProcessWork({ lang }: ChapterPanelProps) {
  const t = useFixedT(lang);
  const stage = useProcessStep();
  const step = PROCESS_STEPS[stage];

  return (
    <div className="process__work">
      <p className="process__stage font-mono" aria-live="polite">
        <bdi>{pad(stage + 1)}</bdi> {t(`process.steps.${step.id}.name`)}
      </p>
      <div key={step.id} className="process__panel">
        <Example t={t} lang={lang} side="screens" stepId={step.id} example={step.screens} delayMs={0} />
        <Example t={t} lang={lang} side="byHand" stepId={step.id} example={step.byHand} delayMs={120} />
      </div>
    </div>
  );
}

/** Phones: the steps and the examples they choose are one page, so picking a
 * step shows its examples right under the list without a page turn. */
export function ProcessOnePage(props: ChapterPanelProps) {
  return (
    <div className="process__one-page">
      <ProcessContext {...props} />
      <ProcessWork {...props} />
    </div>
  );
}
