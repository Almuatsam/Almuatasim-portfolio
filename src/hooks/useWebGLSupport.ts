import { useState } from 'react';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Whether the browser can render the 3D cover. Resolved once, lazily
 * (WebGL support doesn't change during a session). */
export function useWebGLSupport(): boolean {
  const [supported] = useState(detectWebGL);
  return supported;
}
