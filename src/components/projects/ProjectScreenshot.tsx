import type { CSSProperties } from 'react';
import './project-screenshot.css';

interface ProjectScreenshotProps {
  src: string;
  alt: string;
  rotateDeg?: number;
  className?: string;
}

/** A screenshot held down with a strip of masking tape (A2), the way
 * every printed screen sits on the page throughout the book. */
export function ProjectScreenshot({ src, alt, rotateDeg = -1.5, className }: ProjectScreenshotProps) {
  return (
    <figure
      className={`project-screenshot reveal-fade${className ? ` ${className}` : ''}`}
      style={{ '--rotate': `${rotateDeg}deg` } as CSSProperties}
    >
      <span className="project-screenshot__tape" aria-hidden="true" />
      <img src={src} alt={alt} className="project-screenshot__img" loading="lazy" />
    </figure>
  );
}
