import type Lenis from 'lenis';

/** One shared requestAnimationFrame loop driving every page's Lenis
 * instance, instead of each of the book's ~12 scroll areas running its
 * own rAF callback. */
const instances = new Set<Lenis>();
let rafId: number | null = null;

function loop(time: number): void {
  instances.forEach((instance) => instance.raf(time));
  rafId = requestAnimationFrame(loop);
}

export function registerLenis(instance: Lenis): void {
  instances.add(instance);
  if (rafId === null) rafId = requestAnimationFrame(loop);
}

export function unregisterLenis(instance: Lenis): void {
  instances.delete(instance);
  if (instances.size === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}
