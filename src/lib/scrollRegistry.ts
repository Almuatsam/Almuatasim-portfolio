type ResetFn = () => void;

const registry = new Map<string, ResetFn>();

/** Page Scrolling.md section 1 — each page's own scroll area registers a
 * reset-to-top function here, keyed by its page id, so BookFlipApp can
 * reset it the moment the reader arrives at that chapter. */
export function registerScrollReset(key: string, reset: ResetFn): void {
  registry.set(key, reset);
}

export function unregisterScrollReset(key: string): void {
  registry.delete(key);
}

export function resetScrollArea(key: string): void {
  registry.get(key)?.();
}
