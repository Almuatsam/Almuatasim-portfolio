import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import type { ProjectImage } from '../../content/projects';
import './fullscreen-viewer.css';

interface FullscreenViewerProps {
  images: ProjectImage[];
  altFor: (key: string) => string;
  openIndex: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  label: string;
}

/** The sharper of an image's two sources, for the one place "native
 * resolution" actually matters — the viewer the reader opted into. */
function highResSrc(image: ProjectImage): string {
  if (!image.srcSet) return image.src;
  const twoX = image.srcSet
    .split(',')
    .map((entry) => entry.trim())
    .find((entry) => entry.endsWith('2x'));
  return twoX ? twoX.split(' ')[0] : image.src;
}

/** Reset section 3 — every screenshot opens in a full-screen viewer:
 * fitted to the viewport by default (zoom on demand via click/pinch,
 * drag to pan), Esc closes, arrow keys move between a project's
 * screens (mirrored in Arabic — the library detects `dir` from the
 * page automatically), native resolution, dark #2E2A26 backdrop at
 * 92%, a caption and a "n / total" counter.
 *
 * Built on yet-another-react-lightbox rather than a hand-rolled
 * overlay: it portals itself to document.body on its own, so
 * `position: fixed` is never confined by the book's transformed
 * ancestors (StPageFlip's page transform, the Arabic mirror) the way
 * our previous custom viewer was. */
export function FullscreenViewer({ images, altFor, openIndex, onClose, onIndexChange, label }: FullscreenViewerProps) {
  const slides = images.map((image) => ({
    src: highResSrc(image),
    alt: altFor(image.key),
    title: `${label}: ${altFor(image.key)}`,
  }));

  return (
    <Lightbox
      className="fv-lightbox"
      open={openIndex !== null}
      close={onClose}
      index={openIndex ?? 0}
      slides={slides}
      plugins={[Zoom, Captions, Counter]}
      carousel={{ finite: true }}
      zoom={{ maxZoomPixelRatio: 3, doubleClickMaxStops: 2, scrollToZoom: true }}
      controller={{ closeOnBackdropClick: true }}
      // The book's own page never has a native scrollbar to compensate
      // for (Page Scrolling.md — only the per-page ScrollArea scrolls),
      // so this module's body padding/width recompute is pure overhead
      // here — and it was the resize that triggered StPageFlip's own
      // page-visibility recompute to wrongly hide the page the viewer
      // had just opened from, breaking focus-return on close.
      noScroll={{ disabled: true }}
      on={{ view: ({ index }) => onIndexChange(index) }}
      labels={{ Previous: 'Previous screen', Next: 'Next screen', Close: 'Close' }}
    />
  );
}
