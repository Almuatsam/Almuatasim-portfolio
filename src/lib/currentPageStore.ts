import { useSyncExternalStore } from 'react';

type Listener = () => void;

let currentPage = -1;
const listeners = new Set<Listener>();

/** The StPageFlip page the reader is on. Every page of the book is in the
 * DOM, but only the ones near this one get their content built (see
 * FlipPage), which keeps the first paint and the main thread light. */
export function setCurrentPage(next: number): void {
  if (next === currentPage) return;
  currentPage = next;
  listeners.forEach((listener) => listener());
}

/** Sets the starting page once, before the first page renders. */
export function initCurrentPage(initial: number): void {
  if (currentPage === -1) currentPage = initial;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): number {
  return currentPage;
}

export function useCurrentPage(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

const INITIAL_RADIUS = 1;
const IDLE_RADIUS = 3;

let buildRadius = INITIAL_RADIUS;
const radiusListeners = new Set<Listener>();

/** How many pages either side of the reader's own get built. It starts at
 * the page itself (and its facing page), then widens once the browser is
 * idle, so the first paint only pays for what it shows. */
export function widenBuildRadius(): void {
  if (buildRadius === IDLE_RADIUS) return;
  buildRadius = IDLE_RADIUS;
  radiusListeners.forEach((listener) => listener());
}

function subscribeRadius(listener: Listener): () => void {
  radiusListeners.add(listener);
  return () => radiusListeners.delete(listener);
}

export function useBuildRadius(): number {
  return useSyncExternalStore(subscribeRadius, () => buildRadius, () => buildRadius);
}
