import { useEffect, useState } from 'react';

export interface BookBox {
  width: number;
  height: number;
}

const SNAP_PX = 4;
const SETTLE_MS = 200;
const MIN_SIDE_PX = 100;

/** The mobile book's own box, measured: StPageFlip fits one page of a
 * fixed aspect ratio into its parent, so on a phone the page size has to
 * be the box itself or the pages come out short. Snapped and debounced so
 * a toolbar sliding in or out does not rebuild the flipbook. */
export function useBookBox(isActive: boolean, element: HTMLElement | null): BookBox | null {
  const [box, setBox] = useState<BookBox | null>(null);

  useEffect(() => {
    if (!isActive || !element) return;
    let timer: number | undefined;
    const measure = () => {
      const width = Math.round(element.clientWidth / SNAP_PX) * SNAP_PX;
      const height = Math.round(element.clientHeight / SNAP_PX) * SNAP_PX;
      if (width < MIN_SIDE_PX || height < MIN_SIDE_PX) return;
      setBox((previous) => (previous && previous.width === width && previous.height === height ? previous : { width, height }));
    };
    measure();
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, SETTLE_MS);
    });
    observer.observe(element);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [isActive, element]);

  return isActive ? box : null;
}
