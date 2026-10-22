import { lazy, Suspense } from 'react';
import type { SupportedLang } from '../../i18n';

const CoverScene = lazy(() => import('./CoverScene').then((m) => ({ default: m.CoverScene })));

interface CoverCanvasLoaderProps {
  lang: SupportedLang;
  isOpening: boolean;
  onOpened: () => void;
  isClosing?: boolean;
  onClosed?: () => void;
  onReady?: () => void;
}

/** Lazy-loads the 3D cover scene as its own chunk. Suspense keeps the 2D
 * cover (rendered underneath by the caller) as the only visible thing
 * until every texture is ready, so there's never a blank canvas. */
export function CoverCanvasLoader(props: CoverCanvasLoaderProps) {
  return (
    <Suspense fallback={null}>
      <CoverScene {...props} />
    </Suspense>
  );
}
