import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  function subscribe(callback: () => void): () => void {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  }

  function getSnapshot(): boolean {
    return window.matchMedia(query).matches;
  }

  function getServerSnapshot(): boolean {
    return false;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
