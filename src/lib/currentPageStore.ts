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
