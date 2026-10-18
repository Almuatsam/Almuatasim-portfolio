let lastPointerDownTarget: HTMLElement | null = null;

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    (event) => {
      lastPointerDownTarget = event.target instanceof HTMLElement ? event.target : null;
    },
    true,
  );
}

/** The real element a pointerdown targeted, tracked independently of
 * `document.activeElement` — pages with a framer-motion drag gesture
 * (TracingPaperLift, MergeTheScreens) suppress the browser's default
 * click-to-focus action while a drag is armed, so activeElement is not
 * reliable for "what did the reader just click" on those pages. */
export function getLastPointerDownTarget(): HTMLElement | null {
  return lastPointerDownTarget;
}
