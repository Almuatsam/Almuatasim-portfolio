// A3 — the accent band. One accent per chapter, always paired with its
// text-safe ink shade (4.6:1+ on cream) for anything that renders as text.
export const ACCENTS = {
  terracotta: { accent: '#c97c5d', ink: '#a55737' },
  clay: { accent: '#c48b7a', ink: '#9e5b46' },
  ochre: { accent: '#c99a4e', ink: '#8c662b' },
  sage: { accent: '#a5a15c', ink: '#716e3e' },
  coral: { accent: '#e0916b', ink: '#af5125' },
  plum: { accent: '#a9727f', ink: '#965c6a' },
  walnut: { accent: '#a87b5d', ink: '#8a644a' },
} as const;

export type AccentKey = keyof typeof ACCENTS;
