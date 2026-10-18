/** Each paragraph's own word count used to push every later paragraph's
 * start delay further out (CaseNotes' "build" note, often the longest,
 * could push "result" past 2s, and with revealController's below-fold
 * replay this could repeat on every arrival). Capping how much any one
 * paragraph can contribute keeps the stagger feeling intentional instead
 * of accumulating without bound as copy grows. */
const MAX_STEP_CONTRIBUTION = 8;

/** Per-paragraph base delays (ms) for a sequence of RevealText blocks,
 * so later paragraphs start slightly after earlier ones without the
 * total drifting arbitrarily far from `baseDelayMs` as word counts grow. */
export function computeParagraphDelays(texts: string[], isRtl: boolean, baseDelayMs = 480): number[] {
  const stepSize = isRtl ? 90 : 20;
  const delays: number[] = [];

  texts.reduce((offset, text) => {
    delays.push(baseDelayMs + offset * stepSize);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const stepCount = isRtl ? Math.ceil(wordCount / 3) : wordCount;
    return offset + Math.min(stepCount, MAX_STEP_CONTRIBUTION);
  }, 0);

  return delays;
}
