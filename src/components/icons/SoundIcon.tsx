interface SoundIconProps {
  muted: boolean;
}

/** Hand-drawn pencil-style speaker mark — on/off state drawn as a crossed
 * line rather than a generic icon-pack glyph (B12). */
export function SoundIcon({ muted }: SoundIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 6.6h2.6L8.4 3.4v11.2L4.6 11.4H2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {!muted && (
        <path
          d="M11.6 6.2c1 .9 1 4.1 0 5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      )}
      {muted && <path d="M11.5 6.5 15 11.5M15 6.5l-3.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
    </svg>
  );
}
