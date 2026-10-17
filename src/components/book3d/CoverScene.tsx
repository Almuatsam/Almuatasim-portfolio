import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import type { Group, Mesh, PerspectiveCamera } from 'three';
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

interface CoverSceneProps {
  lang: SupportedLang;
  isOpening: boolean;
  onOpened: () => void;
}

function CameraFit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const persp = camera as PerspectiveCamera;
    const fovRad = (persp.fov * Math.PI) / 180;
    const tilt = (11 * Math.PI) / 180;
    const distance = SPREAD_H / 2 / Math.tan(fovRad / 2) / Math.cos(tilt) + 0.05;
    camera.position.set(0, distance * Math.sin(tilt), distance * Math.cos(tilt));
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
  }, [camera, size]);
  return null;
}

function StickerPlane({ n, x, y, w, r }: { n: number; x: number; y: number; w: number; r: number }) {
  const texture = useTexture(`/stickers/sticker-${n}.png`);
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

function ShadowBlob() {
  const texture = useMemo(() => drawShadowBlobTexture(), []);
  return (
    <mesh position={[0, -SPREAD_H * 0.08, -0.035]}>
      <planeGeometry args={[SPREAD_W * 1.3, SPREAD_H * 1.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function NameLabel() {
  const texture = useMemo(() => drawNameLabelTexture(), []);
  const w = (LABEL_LAYOUT.w / 100) * PAGE_W;
  const h = (LABEL_LAYOUT.h / 100) * SPREAD_H;
  const cx = -PAGE_W / 2 + (LABEL_LAYOUT.x / 100) * PAGE_W + w / 2;
  const cy = SPREAD_H / 2 - (LABEL_LAYOUT.y / 100) * SPREAD_H - h / 2;
  return (
    <mesh position={[cx, cy, COVER_THICKNESS / 2 + 0.003]} rotation={[0, 0, (-1 * Math.PI) / 180]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} roughness={0.95} />
    </mesh>
  );
}

const MAX_TILT = (2 * Math.PI) / 180;

/** B1b — at rest the book gently follows the pointer, at most 2 degrees,
 * eased. Off once the open timeline starts and under reduced motion. */
function PointerTilt({ active, children }: { active: boolean; children: ReactNode }) {
  const tiltRef = useRef<Group>(null);
  useFrame((state) => {
    if (!tiltRef.current) return;
    const targetX = active ? -state.pointer.y * MAX_TILT : 0;
    const targetY = active ? state.pointer.x * MAX_TILT : 0;
    tiltRef.current.rotation.x += (targetX - tiltRef.current.rotation.x) * 0.06;
    tiltRef.current.rotation.y += (targetY - tiltRef.current.rotation.y) * 0.06;
  });
  return <group ref={tiltRef}>{children}</group>;
}

function CoverBookGroup({ lang, isOpening, onOpened }: CoverSceneProps) {
  const isRtl = lang === 'ar';
  const bookGroupRef = useRef<Group>(null);
  const hingeRef = useRef<Group>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const paperGrain = useTexture('/web-assets/paper-grain.png');

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
      const tl = gsap.timeline({ onComplete: onOpened });
      tl.to(
        hingeRef.current.rotation,
        { y: targetAngle, duration, ease: prefersReducedMotion ? 'none' : 'paper' },
        0,
      ).to(
        bookGroupRef.current.position,
        { x: slideAmount, duration, ease: prefersReducedMotion ? 'none' : 'paper' },
        0,
      );
    },
    { dependencies: [isOpening] },
  );

  return (
    <group ref={bookGroupRef}>
      <RoundedBox args={[PAGE_W, SPREAD_H, PAGE_BLOCK_THICKNESS]} radius={0.01} smoothness={2} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f4ede1" roughness={0.95} />
      </RoundedBox>

      <group ref={hingeRef} position={[hingeLocalX, 0, PAGE_BLOCK_THICKNESS / 2 + COVER_THICKNESS / 2]}>
        <group position={[coverOffsetFromHinge, 0, 0]}>
          <RoundedBox args={[PAGE_W, SPREAD_H, COVER_THICKNESS]} radius={0.003} smoothness={2}>
            <meshStandardMaterial color="#2e2a26" roughness={0.9} bumpMap={paperGrain} bumpScale={0.003} />
          </RoundedBox>
          {STICKER_LAYOUT.map(({ n, x, y, w, r }) => (
            <StickerPlane key={n} n={n} x={x} y={y} w={w} r={r} />
          ))}
          <NameLabel />
          {/* inside face (endpaper), visible once the cover has swung past 90deg */}
          <mesh position={[0, 0, -COVER_THICKNESS / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[PAGE_W, SPREAD_H]} />
            <meshStandardMaterial color="#fbf6ee" roughness={0.95} />
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
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 28, near: 0.1, far: 10 }}
    >
      <CameraFit />
      <ambientLight intensity={0.55} color="#fff4e6" />
      <directionalLight position={[-1.4, 1.8, 1.6]} intensity={1.35} color="#fff4e6" />
      <directionalLight position={[0.6, -0.4, 1.2]} intensity={0.25} color="#e9dfd0" />
      <ShadowBlob />
      <PointerTilt active={!props.isOpening}>
        <CoverBookGroup {...props} />
      </PointerTilt>
    </Canvas>
  );
}

export { SPREAD_W, SPREAD_H, PAGE_W };
export type { Mesh };
