import type { CSSProperties } from 'react';
import './sticker.css';
import { Picture } from '../ui/Picture';

interface StickerPosition {
  leftPct: number;
  topPct: number;
  widthPct: number;
  rotateDeg: number;
}

interface StickerProps {
  src: string;
  alt: string;
  position: StickerPosition;
  parallaxX: number;
  parallaxY: number;
  depth: number;
}

interface StickerStyle extends CSSProperties {
  '--sticker-left': string;
  '--sticker-top': string;
  '--sticker-width': string;
  '--sticker-rotate': string;
  '--parallax-x': string;
  '--parallax-y': string;
}

export function Sticker({ src, alt, position, parallaxX, parallaxY, depth }: StickerProps) {
  const style: StickerStyle = {
    '--sticker-left': `${position.leftPct}%`,
    '--sticker-top': `${position.topPct}%`,
    '--sticker-width': `${position.widthPct}%`,
    '--sticker-rotate': `${position.rotateDeg}deg`,
    '--parallax-x': `${parallaxX * depth}px`,
    '--parallax-y': `${parallaxY * depth}px`,
  };

  return (
    <Picture src={src} alt={alt} className="sticker" sizes="(max-width: 899px) 40vw, 220px" fetchPriority="high" style={style} draggable={false} />
  );
}
