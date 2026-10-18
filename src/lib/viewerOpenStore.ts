type Listener = () => void;

let isOpen = false;
const listeners = new Set<Listener>();

/** Whether the full-screen screenshot viewer is currently open, for
 * anything that must react to it (ScrollArea hides its scroll hints
 * while it's open — see the full-screen viewer fix request). */
export function setViewerOpen(open: boolean): void {
  if (isOpen === open) return;
  isOpen = open;
  listeners.forEach((listener) => listener());
}

export function subscribeViewerOpen(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getViewerOpenSnapshot(): boolean {
  return isOpen;
}
