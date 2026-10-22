export const SKETCH_IMAGES = {
  wrapTop: '/sewing/sketch-1.jpg',
  coat: '/sewing/sketch-2.jpg',
};

export const OUTFIT_IMAGES = {
  full: { src: '/sewing/outfit-full.jpg', width: 496, height: 1280 },
  atShow: { src: '/sewing/outfit-at-show.jpg', width: 590, height: 1280 },
};

export const TIE_IMAGES = {
  process: '/sewing/tie-process.jpg',
  final: '/sewing/tie-final.jpg',
};

export interface ProcessClip {
  id: 'ruffle' | 'ruffleFinished';
  mp4: string;
  webm: string;
  poster: string;
  width: number;
  height: number;
}

/** B4 Sewing, item 3 — two short clips, "Play the process" (B5 #6). The
 * second one is the ruffle that ends up on the Qalb Mahmood daybed, so
 * it carries the "See it on set" link across to On Set. */
export const PROCESS_CLIPS: ProcessClip[] = [
  { id: 'ruffle', mp4: '/sewing/sewing-ruffle.mp4', webm: '/sewing/sewing-ruffle.webm', poster: '/sewing/sewing-ruffle-poster.jpg', width: 464, height: 832 },
  { id: 'ruffleFinished', mp4: '/sewing/ruffle-finished.mp4', webm: '/sewing/ruffle-finished.webm', poster: '/sewing/ruffle-finished-poster.jpg', width: 1024, height: 576 },
];
