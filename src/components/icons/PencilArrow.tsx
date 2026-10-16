interface PencilArrowProps {
  pointing: 'forward' | 'back';
  isRtl: boolean;
  color: string;
}

/** Hand-drawn pencil arrow, never a Unicode glyph (B12). Base path points
 * toward the physical right; `flip` mirrors it so it always points the
 * correct logical direction once language direction is known. */
export function PencilArrow({ pointing, isRtl, color }: PencilArrowProps) {
  const flip = pointing === 'forward' ? isRtl : !isRtl;

  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M1 8.2c5.2.3 11.4.1 19.3-.4"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.6 1.8c2.1 2 4 4 5.9 6-2.3 1.6-4.4 3.5-6.3 5.7"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
