import './project-screenshot.css';
import { Picture } from '../ui/Picture';

interface ProjectScreenshotProps {
  src: string;
  alt: string;
  className?: string;
  onOpen?: () => void;
}

/** Reset section 3 — the main screenshot, flat and sharp: full width
 * inside the page margins, 0deg, a 1px edge border and a soft shadow.
 * No frame, no tape. Opens the full-screen viewer on click. */
export function ProjectScreenshot({ src, alt, className, onOpen }: ProjectScreenshotProps) {
  const image = (
    <Picture src={src} alt={alt} className="project-screenshot__img" loading="lazy" />
  );

  return (
    <figure className={`project-screenshot reveal-fade${className ? ` ${className}` : ''}`}>
      {onOpen ? (
        <button type="button" className="project-screenshot__button" onClick={onOpen}>
          {image}
        </button>
      ) : (
        image
      )}
    </figure>
  );
}
