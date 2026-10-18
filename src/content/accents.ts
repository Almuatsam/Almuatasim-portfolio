// Palette v2 — the five flat risograph inks. `ink` is the text-safe
// shade for this colour used as small text on paper (cyan/yellow have
// none, so their `ink` is the global ink colour instead — "don't use
// cyan/yellow for text; use ink text"). `tint` is the ink at 22% on
// paper, for soft fills (inactive tabs, etc). `text` is which colour
// reads correctly on TOP of a full fill of this ink: paper for the
// three darker inks, the global ink for the two light/bright ones.
export const ACCENTS = {
  indigo: { accent: '#1C12E3', ink: '#1C12E3', tint: '#C7C3EC', text: 'paper' },
  blue: { accent: '#1271E3', ink: '#116CDA', tint: '#C5D8EC', text: 'paper' },
  red: { accent: '#E31C12', ink: '#DA1B11', tint: '#F3C5BE', text: 'paper' },
  cyan: { accent: '#12D9E3', ink: '#16142B', tint: '#C5EFEC', text: 'ink' },
  yellow: { accent: '#D9E312', ink: '#16142B', tint: '#F0F1BE', text: 'ink' },
} as const;

export type AccentKey = keyof typeof ACCENTS;
export type AccentTextOn = 'paper' | 'ink';
