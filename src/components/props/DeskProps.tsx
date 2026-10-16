import './desk-props.css';

const STROKE = '#2E2A26';
const SW = 1.25;

function Pencil() {
  return (
    <svg viewBox="0 0 160 48" className="desk-prop__svg" aria-hidden="true">
      <path d="M6 30 L120 10" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <path d="M6 38 L120 18" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <path d="M6 30 L6 38 L2 34 Z" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M120 10 L120 18 L150 24 L120 10" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M63 20 L65 28" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
    </svg>
  );
}

function Ruler() {
  return (
    <svg viewBox="0 0 220 40" className="desk-prop__svg" aria-hidden="true">
      <rect x="4" y="8" width="212" height="24" rx="2" stroke={STROKE} strokeWidth={SW} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M${18 + i * 15} 8 L${18 + i * 15} ${i % 2 === 0 ? 20 : 15}`}
          stroke={STROKE}
          strokeWidth={SW}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function StickyNotes() {
  return (
    <svg viewBox="0 0 90 90" className="desk-prop__svg" aria-hidden="true">
      <rect x="18" y="22" width="56" height="56" rx="2" transform="rotate(-6 46 50)" stroke={STROKE} strokeWidth={SW} fill="none" />
      <rect x="14" y="16" width="56" height="56" rx="2" transform="rotate(3 42 44)" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M28 34 L54 34 M28 44 L54 44 M28 54 L44 54" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" transform="rotate(3 42 44)" />
    </svg>
  );
}

function PhoneWireframe() {
  return (
    <svg viewBox="0 0 90 150" className="desk-prop__svg" aria-hidden="true">
      <rect x="10" y="8" width="70" height="134" rx="10" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M26 30 L64 30" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <rect x="22" y="44" width="46" height="34" rx="2" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M22 90 L68 90 M22 100 L68 100 M22 110 L50 110" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <rect x="22" y="122" width="46" height="12" rx="6" stroke={STROKE} strokeWidth={SW} fill="none" />
    </svg>
  );
}

function ThreadSpool() {
  return (
    <svg viewBox="0 0 110 110" className="desk-prop__svg" aria-hidden="true">
      <ellipse cx="45" cy="26" rx="30" ry="10" stroke={STROKE} strokeWidth={SW} fill="none" />
      <ellipse cx="45" cy="78" rx="30" ry="10" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M15 26 L15 78 M75 26 L75 78" stroke={STROKE} strokeWidth={SW} />
      <path d="M22 36 L68 46 M22 48 L68 58 M22 60 L68 70" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" opacity="0.7" />
      <path d="M70 50 C 90 55, 95 70, 86 88 C 80 100, 88 104, 100 100" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill="none" />
    </svg>
  );
}

function DressmakerPins() {
  return (
    <svg viewBox="0 0 120 70" className="desk-prop__svg" aria-hidden="true">
      <path d="M10 60 L46 18" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="49" cy="14" r="5" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M45 58 L80 30" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="83" cy="26" r="5" stroke={STROKE} strokeWidth={SW} fill="none" />
      <path d="M75 62 L104 44" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="107" cy="41" r="4.5" stroke={STROKE} strokeWidth={SW} fill="none" />
    </svg>
  );
}

function Paintbrush() {
  return (
    <svg viewBox="0 0 160 50" className="desk-prop__svg" aria-hidden="true">
      <path d="M150 10 L40 32" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />
      <path d="M44 24 L10 34 C 6 38, 8 44, 16 42 L46 34 Z" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" fill="none" />
      <path d="M38 27 L22 32 M40 30 L26 35" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" opacity="0.7" />
      <circle cx="130" cy="16" r="2" stroke={STROKE} strokeWidth={SW} fill="none" />
    </svg>
  );
}

function CoffeeRing() {
  return (
    <svg viewBox="0 0 90 90" className="desk-prop__svg" aria-hidden="true">
      <path
        d="M45 10 C 65 10, 80 24, 79 44 C 78 64, 62 79, 43 78 C 24 77, 10 61, 11 42 C 12 23, 27 9, 45 10 Z"
        stroke={STROKE}
        strokeWidth={SW}
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

/** A1 — desk props cropped at the screen edges, screen-related tools on
 * one side and craft tools on the other. Hidden under 480px (B8). */
export function DeskProps() {
  return (
    <div className="desk-props" aria-hidden="true">
      <div className="desk-prop desk-prop--craft desk-prop--thread">
        <ThreadSpool />
      </div>
      <div className="desk-prop desk-prop--craft desk-prop--pins">
        <DressmakerPins />
      </div>
      <div className="desk-prop desk-prop--craft desk-prop--brush">
        <Paintbrush />
      </div>
      <div className="desk-prop desk-prop--craft desk-prop--coffee">
        <CoffeeRing />
      </div>

      <div className="desk-prop desk-prop--screens desk-prop--pencil">
        <Pencil />
      </div>
      <div className="desk-prop desk-prop--screens desk-prop--ruler">
        <Ruler />
      </div>
      <div className="desk-prop desk-prop--screens desk-prop--notes">
        <StickyNotes />
      </div>
      <div className="desk-prop desk-prop--screens desk-prop--phone">
        <PhoneWireframe />
      </div>
    </div>
  );
}
