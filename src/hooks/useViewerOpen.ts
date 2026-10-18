import { useSyncExternalStore } from 'react';
import { subscribeViewerOpen, getViewerOpenSnapshot } from '../lib/viewerOpenStore';

function getServerSnapshot(): boolean {
  return false;
}

export function useViewerOpen(): boolean {
  return useSyncExternalStore(subscribeViewerOpen, getViewerOpenSnapshot, getServerSnapshot);
}
