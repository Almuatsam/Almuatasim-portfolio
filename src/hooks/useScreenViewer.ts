import { useCallback, useState } from 'react';

export interface ScreenViewer {
  openIndex: number | null;
  open: (index: number) => void;
  close: () => void;
  navigate: (delta: 1 | -1) => void;
}

/** Shared open/close/navigate state for FullscreenViewer, scoped to a
 * single project's screen count. */
export function useScreenViewer(count: number): ScreenViewer {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setOpenIndex(index), []);
  const close = useCallback(() => setOpenIndex(null), []);
  const navigate = useCallback(
    (delta: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + count) % count;
      });
    },
    [count],
  );

  return { openIndex, open, close, navigate };
}
