import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { Credit } from "../../content/credits";

export interface StackPrint {
  id: string;
  src: string;
  alt: string;
  credit: Credit;
}

interface PrintStackProps {
  prints: StackPrint[];
  /** Accessible name of the button, with `{{current}}` and `{{total}}` already filled in. */
  buttonLabel: (current: number, total: number) => string;
  /** Rendered under the stack for whichever print is on top. */
  renderCredit: (credit: Credit) => ReactNode;
}

interface Slot {
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

// Position 0 is the top print. Rotations stay within 2 degrees.
const SLOTS: Slot[] = [
  { x: 0, y: 0, rotation: 0, zIndex: 3 },
  { x: 9, y: 9, rotation: -1.6, zIndex: 2 },
  { x: -7, y: 16, rotation: 1.4, zIndex: 1 },
];
const SLIDE_OUT = { x: 74, rotation: 2 };

/** B5 #8, Amouage variant: a loose stack of prints. Clicking the top
 * print slides it to the bottom of the stack and brings the next one
 * forward (500ms, with a small rotation settle). Flat: no blur shadows,
 * no tilt beyond 2 degrees. Reduced motion swaps them instantly. */
export function PrintStack({
  prints,
  buttonLabel,
  renderCredit,
}: PrintStackProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<number[]>(prints.map((_, index) => index));
  const isBusyRef = useRef(false);
  const reducedRef = useRef(prefersReducedMotion);
  const [topIndex, setTopIndex] = useState(0);

  useGSAP(
    () => {
      reducedRef.current = prefersReducedMotion;
      const cards = gsap.utils.toArray<HTMLElement>(
        ".print-stack__print",
        stackRef.current,
      );
      orderRef.current.forEach((printIndex, position) =>
        gsap.set(cards[printIndex], SLOTS[position]),
      );
    },
    { scope: stackRef, dependencies: [prefersReducedMotion] },
  );

  function advance(): void {
    if (isBusyRef.current) return;
    const cards = gsap.utils.toArray<HTMLElement>(
      ".print-stack__print",
      stackRef.current,
    );
    const [top, second, third] = orderRef.current;
    orderRef.current = [second, third, top];
    setTopIndex(orderRef.current[0]);

    if (reducedRef.current) {
      orderRef.current.forEach((printIndex, position) =>
        gsap.set(cards[printIndex], SLOTS[position]),
      );
      return;
    }

    isBusyRef.current = true;
    const timeline = gsap.timeline({
      onComplete: () => (isBusyRef.current = false),
      defaults: { ease: "settle" },
    });
    // The top print slides out, drops behind the others, and settles at the bottom.
    timeline
      .to(
        cards[top],
        {
          x: SLIDE_OUT.x,
          rotation: SLIDE_OUT.rotation,
          duration: 0.2,
          ease: "power1.in",
        },
        0,
      )
      .set(cards[top], { zIndex: SLOTS[2].zIndex }, 0.2)
      .to(cards[top], { ...SLOTS[2], duration: 0.3 }, 0.2);
    // The next two come forward, with a small rotation settle.
    timeline
      .set(cards[second], { zIndex: SLOTS[0].zIndex }, 0.1)
      .to(cards[second], { ...SLOTS[0], duration: 0.4 }, 0.1)
      .set(cards[third], { zIndex: SLOTS[1].zIndex }, 0.1)
      .to(cards[third], { ...SLOTS[1], duration: 0.4 }, 0.1);
  }

  return (
    <>
      <div className="print-stack" ref={stackRef}>
        {prints.map((print, index) => (
          <div
            key={print.id}
            className="print-stack__print"
            aria-hidden={index !== topIndex}
          >
            <img src={print.src} alt={print.alt} className="print-stack__img" />
          </div>
        ))}
        <button
          type="button"
          className="print-stack__button"
          onClick={advance}
          aria-label={buttonLabel(topIndex + 1, prints.length)}
        />
      </div>
      {renderCredit(prints[topIndex].credit)}
    </>
  );
}
