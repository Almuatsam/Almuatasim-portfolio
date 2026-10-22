import type { FeatureBundle } from 'framer-motion';

const SETTLE_MS = 6000;
const IDLE_TIMEOUT_MS = 4000;

/** framer-motion's gesture and layout features (drag lives here) load in
 * the browser's idle time, after the first page is on screen: the `m`
 * components render fine without them until then. */
export function loadMotionFeatures(): Promise<FeatureBundle> {
  const whenIdle = new Promise<void>((resolve) => {
    window.setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
      else resolve();
    }, SETTLE_MS);
  });
  return whenIdle.then(() => import('./motionDomMax').then((module) => module.default));
}
