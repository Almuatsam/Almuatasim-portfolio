import type { ProjectImage } from '../../content/projects';
import './screenshot-thumbnails.css';
import { Picture } from '../ui/Picture';

interface ScreenshotThumbnailsProps {
  images: ProjectImage[];
  altFor: (key: string) => string;
  onOpen: (index: number) => void;
  label: string;
}

/** Reset section 3 — a small row of a project's other screens; clicking
 * one opens it in the full-screen viewer at native resolution. */
export function ScreenshotThumbnails({ images, altFor, onOpen, label }: ScreenshotThumbnailsProps) {
  if (images.length === 0) return null;

  return (
    <div className="screenshot-thumbs" role="group" aria-label={label}>
      {images.map((image, index) => (
        <button
          type="button"
          key={image.key}
          className="screenshot-thumbs__item"
          onClick={() => onOpen(index)}
        >
          <Picture src={image.src} alt={altFor(image.key)} loading="lazy" />
        </button>
      ))}
    </div>
  );
}
