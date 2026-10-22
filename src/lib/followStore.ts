import { useSyncExternalStore } from 'react';

type Listener = () => void;

let stage = 0;
const listeners = new Set<Listener>();

/** Follow the piece spans two StPageFlip pages (the stitch on the left,
 * the photo on the right), which are separate React trees, so the
 * current stage lives here rather than in either component. */
export function setFollowStage(next: number, stageCount: number): void {
  const clamped = Math.min(Math.max(Math.round(next), 0), stageCount - 1);
  if (clamped === stage) return;
  stage = clamped;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFollowStage(): number {
  return stage;
}

function getSnapshot(): number {
  return stage;
}

export function useFollowStage(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
