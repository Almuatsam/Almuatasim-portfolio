import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import { SRGBColorSpace, type CanvasTexture, type Group, type Mesh, type PerspectiveCamera } from 'three';
import { gsap, useGSAP } from '../../lib/gsap';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { STICKER_LAYOUT, BAND_STICKER, BAND_LAYOUT, LABEL_LAYOUT } from '../../content/coverLayout';
import type { SupportedLang } from '../../i18n';
import { drawNameLabelTexture, drawShadowBlobTexture } from './nameLabelTexture';
import './cover3d.css';

// World units — height = 1, width follows the closed-cover (single page)
// ratio; the open spread is exactly twice as wide, spine at the centre.
const SPREAD_H = 1;
const SPREAD_W = SPREAD_H * (1160 / 760);
const PAGE_W = SPREAD_W / 2;
const PAGE_BLOCK_THICKNESS = 0.045;
const COVER_THICKNESS = 0.012;

const FOV_DEG = 18;
const REST_TILT_DEG = 3.5;
const MAX_POINTER_TILT = (1.5 * Math.PI) / 180;

interface CoverSceneProps {
  lang: SupportedLang;
  isOpening: boolean;
  onOpened: () => void;
  /** Plays the opening in reverse: starts with the cover swung open and
   * the spread slid aside, and ends closed, at rest. */
  isClosing?: boolean;
  onClosed?: () => void;
  /** Called once the scene (and its textures) is on screen. */
  onReady?: () => void;
}

function cameraDistanceFor(fovDeg: number, tiltRad: number): number {
  const fovRad = (fovDeg * Math.PI) / 180;
  return SPREAD_H / 2 / Math.tan(fovRad / 2) / Math.cos(tiltRad) + 0.05;
}

function setCameraTilt(camera: PerspectiveCamera, tiltDeg: number): void {
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const distance = cameraDistanceFor(FOV_DEG, tiltRad);
  camera.position.set(0, distance * Math.sin(tiltRad), distance * Math.cos(tiltRad));
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
}

/** Sets the rest-state camera (slight tilt). The opening timeline takes
 * over and animates tilt down to exactly 0 (top-down) at handover. */
function CameraFit({ startTilt }: { startTilt: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    setCameraTilt(camera as PerspectiveCamera, startTilt);
    // startTilt is only the pose at mount; the timelines own it after.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, size]);
  return null;
}

function StickerPlane({ n, x, y, w, r }: { n: number; x: number; y: number; w: number; r: number }) {
  const texture = useTexture(`/stickers/sticker-${n}.png`, (t) => {
    t.colorSpace = SRGBColorSpace;
  });
  const image = texture.image as HTMLImageElement | undefined;
  const aspect = (image?.width ?? 1) / (image?.height ?? 1);
  const widthWorld = (w / 100) * PAGE_W;
  const heightWorld = widthWorld / aspect;
  // Sticker layout is defined top-left-origin in percent; convert to a
  // centre-origin world position (page spans -PAGE_W/2..+PAGE_W/2, 0..SPREAD_H top-to-bottom).
  const centerX = -PAGE_W / 2 + (x / 100) * PAGE_W + widthWorld / 2;
  const centerY = SPREAD_H / 2 - (y / 100) * SPREAD_H - heightWorld / 2;

  return (
    <group>
      <mesh position={[centerX, centerY, COVER_THICKNESS / 2 + 0.002]} rotation={[0, 0, (-r * Math.PI) / 180]}>
        <planeGeometry args={[widthWorld, heightWorld]} />
        <meshStandardMaterial map={texture} transparent roughness={0.85} />
      </mesh>
      {n === BAND_STICKER && (
        <mesh
          position={[
            -PAGE_W / 2 + ((BAND_LAYOUT.x + BAND_LAYOUT.w / 2) / 100) * PAGE_W,
            0,
            COVER_THICKNESS / 2 + 0.004,
          ]}
        >
          <planeGeometry args={[(BAND_LAYOUT.w / 100) * PAGE_W, SPREAD_H]} />
          <meshStandardMaterial color="#141210" roughness={0.6} transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}

/** A soft shadow only slightly larger than the closed book, with a wide
 * transparent margin baked into the texture so it never shows an edge.
 * Lives inside bookGroup so it slides with the book as it opens. */
function ShadowBlob() {
  const texture = useMemo(() => drawShadowBlobTexture(), []);
  return (
    <mesh position={[0, -SPREAD_H * 0.02, -PAGE_BLOCK_THICKNESS / 2 - 0.01]}>
      <planeGeometry args={[PAGE_W * 1.5, SPREAD_H * 1.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function NameLabel() {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    void drawNameLabelTexture().then((tex) => {
      if (!cancelled) setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!texture) return null;

  const w = (LABEL_LAYOUT.w / 100) * PAGE_W;
  const h = (LABEL_LAYOUT.h / 100) * SPREAD_H;
  const cx = -PAGE_W / 2 + (LABEL_LAYOUT.x / 100) * PAGE_W + w / 2;
  const cy = SPREAD_H / 2 - (LABEL_LAYOUT.y / 100) * SPREAD_H - h / 2;
  return (
    <mesh position={[cx, cy, COVER_THICKNESS / 2 + 0.003]}>
      <planeGeometry args={[w, h]} />
      {/* Unlit — the paper stays true #F7F5EF regardless of scene lighting. */}
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** At rest the book gently follows the pointer, at most 1.5 degrees,
 * eased. Off once the open timeline starts and under reduced motion. */
function PointerTilt({ active, children }: { active: boolean; children: ReactNode }) {
  const tiltRef = useRef<Group>(null);
  useFrame((state) => {
    if (!tiltRef.current) return;
    const targetX = active ? -state.pointer.y * MAX_POINTER_TILT : 0;
    const targetY = active ? state.pointer.x * MAX_POINTER_TILT : 0;
    tiltRef.current.rotation.x += (targetX - tiltRef.current.rotation.x) * 0.06;
    tiltRef.current.rotation.y += (targetY - tiltRef.current.rotation.y) * 0.06;
  });
  return <group ref={tiltRef}>{children}</group>;
}

function CoverBookGroup({ lang, isOpening, onOpened, isClosing = false, onClosed, onReady }: CoverSceneProps) {
  const isRtl = lang === 'ar';
  const bookGroupRef = useRef<Group>(null);
  const hingeRef = useRef<Group>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const paperGrain = useTexture('/web-assets/paper-grain.png', (t) => {
    t.colorSpace = SRGBColorSpace;
  });
  const { camera } = useThree();
  // Whether this scene mounted as the closing run. Read once: the pose and
  // the timeline below must not react when the parent later flips the prop
  // (a GSAP revert would swing the cover back open).
  const startsClosed = useRef(isClosing).current;

  // The cover's closed footprint matches the page block exactly (centred
  // at bookGroup x=0); the hinge sits at its spine edge, so the cover's
  // mesh (which auto-centres on its own group origin) must be offset
  // from the hinge by the opposite of the hinge's own offset.
  const hingeLocalX = isRtl ? PAGE_W / 2 : -PAGE_W / 2;
  const coverOffsetFromHinge = -hingeLocalX;
  const targetAngle = isRtl ? Math.PI : -Math.PI;
  const slideAmount = isRtl ? -PAGE_W / 2 : PAGE_W / 2;

  useGSAP(
    () => {
      if (!isOpening || !bookGroupRef.current || !hingeRef.current) return;
      const duration = prefersReducedMotion ? 0.001 : 1.4;
      const ease = prefersReducedMotion ? 'none' : 'paper';
      const cameraRig = { tilt: REST_TILT_DEG };
      const tl = gsap.timeline({ onComplete: onOpened });
      tl.to(hingeRef.current.rotation, { y: targetAngle, duration, ease }, 0)
        .to(bookGroupRef.current.position, { x: slideAmount, duration, ease }, 0)
        .to(
          cameraRig,
          {
            tilt: 0,
            duration,
            ease,
            onUpdate: () => setCameraTilt(camera as PerspectiveCamera, cameraRig.tilt),
          },
          0,
        );
    },
    { dependencies: [isOpening] },
  );

  useGSAP(
    () => {
      if (!startsClosed || !bookGroupRef.current || !hingeRef.current) return;
      const duration = prefersReducedMotion ? 0.001 : 1.4;
      const ease = prefersReducedMotion ? 'none' : 'paper';
      const cameraRig = { tilt: 0 };
      const tl = gsap.timeline({ onComplete: onClosed });
      tl.to(hingeRef.current.rotation, { y: 0, duration, ease }, 0)
        .to(bookGroupRef.current.position, { x: 0, duration, ease }, 0)
        .to(
          cameraRig,
          {
            tilt: REST_TILT_DEG,
            duration,
            ease,
            onUpdate: () => setCameraTilt(camera as PerspectiveCamera, cameraRig.tilt),
          },
          0,
        );
    },
    { dependencies: [] },
  );

  useEffect(() => {
    onReady?.();
    // Once, when the scene first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={bookGroupRef} position={[startsClosed ? slideAmount : 0, 0, 0]}>
      <ShadowBlob />
      <RoundedBox args={[PAGE_W, SPREAD_H, PAGE_BLOCK_THICKNESS]} radius={0.01} smoothness={2} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e4e1d8" roughness={0.95} />
      </RoundedBox>

      <group
        ref={hingeRef}
        position={[hingeLocalX, 0, PAGE_BLOCK_THICKNESS / 2 + COVER_THICKNESS / 2]}
        rotation={[0, startsClosed ? targetAngle : 0, 0]}
      >
        <group position={[coverOffsetFromHinge, 0, 0]}>
          <RoundedBox args={[PAGE_W, SPREAD_H, COVER_THICKNESS]} radius={0.003} smoothness={2}>
            <meshStandardMaterial color="#16142b" roughness={0.88} metalness={0} bumpMap={paperGrain} bumpScale={0.003} />
          </RoundedBox>
          {STICKER_LAYOUT.map(({ n, x, y, w, r }) => (
            <StickerPlane key={n} n={n} x={x} y={y} w={w} r={r} />
          ))}
          <NameLabel />
          {/* inside face (endpaper), visible once the cover has swung past 90deg */}
          <mesh position={[0, 0, -COVER_THICKNESS / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[PAGE_W, SPREAD_H]} />
            <meshBasicMaterial color="#f7f5ef" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function CoverScene(props: CoverSceneProps) {
  return (
    <Canvas
      className="cover3d-canvas"
      flat
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: FOV_DEG, near: 0.1, far: 10 }}
      // react-use-measure (which R3F uses for auto-sizing) reads
      // getBoundingClientRect(), which includes .book's decorative
      // rotate(-1.5deg) and inflates the measured aspect ratio.
      // offsetWidth/offsetHeight are layout-box values, unaffected by
      // that transform, so the canvas — and the camera fit inside it —
      // sizes to the book's true (unrotated) 1160:760 box.
      resize={{ offsetSize: true }}
    >
      <CameraFit startTilt={props.isClosing ? 0 : REST_TILT_DEG} />
      <ambientLight intensity={1.0} color="#fff4e6" />
      <directionalLight position={[-1.4, 1.8, 1.6]} intensity={1.85} color="#fff4e6" />
      <directionalLight position={[0.6, -0.4, 1.2]} intensity={0.4} color="#e9dfd0" />
      <PointerTilt active={!props.isOpening && !props.isClosing}>
        <CoverBookGroup {...props} />
      </PointerTilt>
    </Canvas>
  );
}

export { SPREAD_W, SPREAD_H, PAGE_W };
export type { Mesh };
