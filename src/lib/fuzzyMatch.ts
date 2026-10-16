// B5 #1 — EstudioA's mini demo: a tiny client-side fuzzy match over a
// handful of hard-coded sample patterns, tolerant of typos, no backend.

export const SAMPLE_PATTERNS = [
  'Summer wrap dress, beginner',
  'Linen shirt, intermediate',
  'Pleated midi skirt, beginner',
  'Tailored blazer, advanced',
  'Easy tote bag, beginner',
  'Wide-leg trousers, intermediate',
  'Ruffle sleeve blouse, intermediate',
  'Denim jacket, advanced',
  'Beginner shift dress, beginner',
  'Cropped cardigan, beginner',
];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function wordScore(queryWord: string, itemWord: string): number {
  if (itemWord.includes(queryWord) || queryWord.includes(itemWord)) return 1;
  const distance = levenshtein(queryWord, itemWord);
  const maxLen = Math.max(queryWord.length, itemWord.length);
  return 1 - distance / maxLen;
}

export function fuzzySearch(query: string, items: string[] = SAMPLE_PATTERNS, limit = 3): string[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return [];

  const scored = items.map((item) => {
    const itemWords = item.toLowerCase().replace(/,/g, '').split(/\s+/).filter(Boolean);
    const total = queryWords.reduce((sum, qWord) => {
      const best = Math.max(...itemWords.map((iWord) => wordScore(qWord, iWord)));
      return sum + best;
    }, 0);
    return { item, score: total / queryWords.length };
  });

  return scored
    .filter((entry) => entry.score > 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
