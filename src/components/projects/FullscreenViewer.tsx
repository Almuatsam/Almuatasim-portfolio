import { useEffect } from 'react';
import type { ProjectImage } from '../../content/projects';
import './fullscreen-viewer.css';

interface FullscreenViewerProps {
  images: ProjectImage[];
  altFor: (key: string) => string;
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (delta: 1 | -1) => void;
  label: string;
}

/** Reset section 3 — every screenshot opens in a full-screen viewer:
 * Esc closes, arrow keys move between a project's screens, native
 * resolution, dark #2E2A26 backdrop at 92%. */
export function FullscreenViewer({ images, altFor, openIndex, onClose, onNavigate, label }: FullscreenViewerProps) {
  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate(1);
      if (event.key === 'ArrowLeft') onNavigate(-1);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || openIndex === null) return null;
  const image = images[openIndex];

  return (
    <div className="fullscreen-viewer" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" className="fullscreen-viewer__backdrop" onClick={onClose} aria-label="Close" />
      <button type="button" className="fullscreen-viewer__close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <path d="M3 3 L17 17 M17 3 L3 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="fullscreen-viewer__nav fullscreen-viewer__nav--prev"
          onClick={() => onNavigate(-1)}
          aria-label="Previous screen"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M13 2 L5 10 L13 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={altFor(image.key)}
        className="fullscreen-viewer__img"
      />

      {images.length > 1 && (
        <button
          type="button"
          className="fullscreen-viewer__nav fullscreen-viewer__nav--next"
          onClick={() => onNavigate(1)}
          aria-label="Next screen"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M7 2 L15 10 L7 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
