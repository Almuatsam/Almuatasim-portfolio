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

const viewports = new Map<string, HTMLElement>();
let hoveredViewport: HTMLElement | null = null;

/** Each page's scrolling element, by page id, so the wheel and the keys can
 * be handed to the other page of the spread (see ScrollArea). */
export function registerViewport(key: string, viewport: HTMLElement): void {
  viewports.set(key, viewport);
}

export function unregisterViewport(key: string, viewport: HTMLElement): void {
  if (viewports.get(key) === viewport) viewports.delete(key);
  if (hoveredViewport === viewport) hoveredViewport = null;
}

/** The other page of the same spread: "estudioa-context" and "estudioa-work". */
export function siblingViewport(key: string): HTMLElement | null {
  const other = key.endsWith('-context') ? key.replace(/-context$/, '-work') : key.replace(/-work$/, '-context');
  return other === key ? null : (viewports.get(other) ?? null);
}

export function setHoveredViewport(viewport: HTMLElement | null): void {
  hoveredViewport = viewport;
}

export function getHoveredViewport(): HTMLElement | null {
  return hoveredViewport;
}

/** True when `viewport` can still scroll in the direction of `delta`. */
export function canScrollBy(viewport: HTMLElement, delta: number): boolean {
  const max = viewport.scrollHeight - viewport.clientHeight;
  if (max <= 1) return false;
  return delta > 0 ? viewport.scrollTop < max - 1 : viewport.scrollTop > 1;
}
