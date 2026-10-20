import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ProcessClip } from '../../content/sewing';
import './play-the-process.css';

interface PlayTheProcessProps {
  clip: ProcessClip;
  alt: string;
  playHint: string;
  collapseLabel: string;
}

/** B5 #6 — hovering (or focusing) the card plays the clip muted from the
 * start; moving away pauses it. Clicking opens it larger with simple
 * play/pause controls (the browser's own — see the note below on why
 * that rules out a <button> wrapper once expanded). A running stitch
 * draws itself along the card's edge once the clip has played through.
 * Reduced motion and touch (no hover) never autoplay: clips play only
 * on click/tap. */
export function PlayTheProcess({ clip, alt, playHint, collapseLabel }: PlayTheProcessProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [expanded, setExpanded] = useState(false);
  const [playedThrough, setPlayedThrough] = useState(false);

  function startPreview(): void {
    if (!canHover || prefersReducedMotion || expanded) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }

  function stopPreview(): void {
    if (!canHover || expanded) return;
    videoRef.current?.pause();
  }

  // The expanded view renders a different <video> element (a separate
  // JSX branch below, not a <button>-wrapped one — see the comment on
  // that branch), so React mounts a brand new node when `expanded`
  // flips true. Calling .play() synchronously inside the click handler
  // would still be holding the OLD (collapsed) element's ref at that
  // point; this effect runs after the remount, once videoRef is
  // pointing at the real new element.
  useEffect(() => {
    if (!expanded) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }, [expanded]);

  function collapse(): void {
    setExpanded(false);
    videoRef.current?.pause();
  }

  const stitch = (
    <svg className="play-process__stitch" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        className={`play-process__stitch-line${playedThrough ? ' play-process__stitch-line--drawn' : ''}`}
      />
    </svg>
  );

  // Native <video controls> exposes its own interactive buttons (play,
  // seek, fullscreen). Nesting that inside a <button> is invalid HTML
  // and breaks those controls in several browsers (the outer button
  // intercepts the clicks). So the clickable "open it larger" card is a
  // <button> only while collapsed (controls off, nothing interactive
  // inside it); once expanded, the video sits in a plain <div> with its
  // own explicit collapse button beside it instead.
  if (expanded) {
    return (
      <div className="play-process play-process--expanded">
        <div className="play-process__card">
          {stitch}
          <video
            ref={videoRef}
            className="play-process__video"
            poster={clip.poster}
            muted
            playsInline
            loop={false}
            preload="none"
            controls
            onEnded={() => setPlayedThrough(true)}
          >
            <source src={clip.webm} type="video/webm" />
            <source src={clip.mp4} type="video/mp4" />
          </video>
        </div>
        <button type="button" className="play-process__collapse" onClick={collapse}>
          {collapseLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="play-process">
      <button
        type="button"
        className="play-process__card"
        onClick={() => setExpanded(true)}
        onPointerEnter={startPreview}
        onPointerLeave={stopPreview}
        onFocus={startPreview}
        onBlur={stopPreview}
        aria-label={alt}
      >
        {stitch}
        <video ref={videoRef} className="play-process__video" poster={clip.poster} muted playsInline loop preload="none">
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
        <span className="play-process__hint">
          <svg className="play-process__hint-icon" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M1 1 L11 7 L1 13 Z" fill="currentColor" />
          </svg>
          {playHint}
        </span>
      </button>
    </div>
  );
}
