import { useSyncExternalStore } from 'react';

type Listener = () => void;

interface ShowMadeState {
  photoIndex: number;
  isOn: boolean;
}

let state: ShowMadeState = { photoIndex: 0, isOn: false };
const listeners = new Set<Listener>();

/** Show what I made spans two StPageFlip pages (the switch and photo
 * picker on the left, the photo on the right), which are separate React
 * trees, so the shared state lives here. Links from Follow the piece
 * and from Sewing set it before navigating. */
export function setShowMade(patch: Partial<ShowMadeState>): void {
  const next = { ...state, ...patch };
  if (next.photoIndex === state.photoIndex && next.isOn === state.isOn) return;
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ShowMadeState {
  return state;
}

export function useShowMade(): ShowMadeState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
