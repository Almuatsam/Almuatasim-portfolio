export interface MarkedSegment {
  text: string;
  isMarked: boolean;
}

const MARK_PATTERN = /\[\[(.+?)\]\]/g;

/** Highlighter markup (Phase 3 Kickoff.md #8): words wrapped in [[ ]]
 * inside a content string are rendered on a highlighter bar. Each
 * language marks its own words, so Arabic can mark its equivalent. */
export function parseMarks(text: string): MarkedSegment[] {
  const segments: MarkedSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(MARK_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) segments.push({ text: text.slice(cursor, start), isMarked: false });
    segments.push({ text: match[1], isMarked: true });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), isMarked: false });
  return segments;
}

/** The same string without the markup, for plain-text uses. */
export function stripMarks(text: string): string {
  return text.replace(MARK_PATTERN, '$1');
}
