import { useSyncExternalStore } from 'react';

type Listener = () => void;

let step = 0;
const listeners = new Set<Listener>();

/** Process spans two StPageFlip pages (the step list on the left, the
 * examples on the right), which are separate React trees, so the
 * selected step lives here rather than in either component. */
export function setProcessStep(next: number, stepCount: number): void {
  const clamped = Math.min(Math.max(Math.round(next), 0), stepCount - 1);
  if (clamped === step) return;
  step = clamped;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): number {
  return step;
}

export function useProcessStep(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
