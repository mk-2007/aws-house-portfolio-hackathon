"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  HueSaturation,
  BrightnessContrast,
  SMAA,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { useNebulaTexture } from "@/components/space/useNebulaTexture";
import Planet from "@/components/space/Planet";
import Sun from "@/components/space/Sun";
import Rocks, { type RockPlacement } from "@/components/space/Rocks";
import AnywhereDoor, { type DoorProgress } from "./AnywhereDoor";

/**
 * The intro scene: one pink door in the middle of a cinematic, sun-lit
 * corner of space. Everything is procedural (no image files).
 *
 * Realism checklist, because realistic space is mostly *lighting*:
 *  - ONE strong key light (the sun) from one side, plus a faint cool fill
 *    from the other. Hard directional light is what makes space look like
 *    space; soft even light looks like a studio.
 *  - The real nebula is also the environment map, so metal and paint
 *    reflect it.
 *  - Bloom (bright things bleed light), film grain, and a vignette give
 *    the camera-lens feel of a movie rather than a computer render.
 */
const SUN_POS: [number, number, number] = [46, 20, -80];
const PLANET_POS: [number, number, number] = [-19, -10, -48];

function Sky() {
  const nebula = useNebulaTexture(2048);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    if (!nebula?.env) return;
    scene.environment = nebula.env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
    };
  }, [nebula, scene]);

  if (!nebula) return null;
  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[400, 64, 32]} />
      <meshBasicMaterial map={nebula.texture} side={THREE.BackSide} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * The "drone" shot. The camera flies along a smooth curve (a Catmull-Rom
 * spline through hand-placed points), swinging in from far away, high and to
 * the left, past drifting rocks, and settling in front of the door. While it
 * flies it also:
 *  - looks first toward the planet, then pans to the door (a reveal),
 *  - banks slightly through the turn, like a real drone leaning into a curve,
 *  - narrows its field of view as it arrives.
 * Because the rocks sit at different distances, they slide past at different
 * speeds (parallax), which is the strongest cue that the space is truly 3D.
 *
 * `progress.intro` is tweened 0..1 by GSAP. After arrival the camera idles
 * with a gentle breathing drift and pointer parallax, then `fly` dives it
 * through the open door.
 */
function CameraRig({ progress }: { progress: React.RefObject<DoorProgress> }) {
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const baseZ = Math.max(9.5, 4.8 / aspect);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-17, 8.5, baseZ + 28),
        new THREE.Vector3(-8.5, 5.0, baseZ + 18),
        new THREE.Vector3(-3.2, 2.2, baseZ + 8.5),
        new THREE.Vector3(-0.6, 0.55, baseZ + 2.2),
        new THREE.Vector3(0, 0.1, baseZ),
      ]),
    [baseZ]
  );
  const planetLook = useMemo(() => new THREE.Vector3(-13, -4, -30), []);
  const doorLook = useMemo(() => new THREE.Vector3(0, -0.3, 0), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer, clock }) => {
    const { intro, fly } = progress.current;
    const t = clock.getElapsedTime();
    curve.getPoint(clamp01(intro), tmp);

    // after arrival: breathing drift + pointer parallax
    const idle = smooth(clamp01((intro - 0.85) / 0.15)) * (1 - fly);
    tmp.x += (pointer.x * 0.7 + Math.sin(t * 0.21) * 0.25) * idle;
    tmp.y += (pointer.y * 0.4 + Math.cos(t * 0.17) * 0.15) * idle;

    // the dive: from the resting spot straight through the doorway
    tmp.z = tmp.z + (-1.4 - tmp.z) * fly;
    tmp.x *= 1 - fly * 0.6;
    camera.position.copy(tmp);

    const pan = smooth(clamp01((intro - 0.2) / 0.7));
    look.lerpVectors(planetLook, doorLook, pan);
    look.y -= 0.95 * (1 - fly); // frame the door high, leaving room for the text below
    camera.lookAt(look);

    // lean into the curve, then level out
    camera.rotateZ(Math.sin(Math.PI * clamp01(intro)) * 0.07 * (1 - fly));

    const pc = camera as THREE.PerspectiveCamera;
    pc.fov = 54 - 10 * smooth(clamp01(intro)) + fly * 34;
    pc.updateProjectionMatrix();
  });
  return null;
}

/** Rocks along the flight path: close ones whip past, far ones drift slowly. */
function flybyRocks(): RockPlacement[] {
  const pts: [number, number, number, number][] = [
    [-9, 3.5, 24, 0.9],
    [-4.5, -2.2, 21, 0.6],
    [2.8, 3.2, 19, 0.7],
    [6.5, 0.5, 26, 1.1],
    [-12, -1, 31, 1.3],
    [3.8, -3.1, 14, 0.45],
    [-6.2, 2.4, 13, 0.35],
    [9.5, 4.2, 18, 0.55],
    [-2.4, 4.6, 29, 0.8],
    [12.5, -2.5, 23, 1.0],
  ];
  return pts.map(([x, y, z, s]) => ({ pos: [x, y, z], s }));
}

export default function SpaceDoorScene({
  progress,
  onOpen,
}: {
  progress: React.RefObject<DoorProgress>;
  onOpen: () => void;
}) {
  const sunDir = useMemo(
    () => new THREE.Vector3(...SUN_POS).sub(new THREE.Vector3(...PLANET_POS)).normalize(),
    []
  );
  const keyDir = useMemo(() => new THREE.Vector3(...SUN_POS).normalize(), []);
  const flyby = useMemo(() => flybyRocks(), []);
  // Adaptive quality. Start high on big screens, low on phones, and let
  // PerformanceMonitor step down automatically if the frame rate drops. This
  // is how games stay smooth on weak hardware without a settings menu.
  const [fancy, setFancy] = useState(false);
  useEffect(() => setFancy(window.innerWidth >= 900), []);

  return (
    <Canvas
      shadows
      dpr={fancy ? [1, 1.5] : 1}
      camera={{ position: [-17, 8.5, 37], fov: 54, near: 0.1, far: 1200 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor flipflops={2} onDecline={() => setFancy(false)} />
      <color attach="background" args={["#02030a"]} />
      <Sky />
      <Stars radius={300} depth={80} count={5000} factor={6} saturation={0.5} fade speed={0.4} />

      {/* the key light (sun) and a faint cool fill from the opposite side */}
      <directionalLight position={[keyDir.x * 30, keyDir.y * 30, keyDir.z * 30 + 20]} intensity={2.6} color="#ffe6c2" />
      {/* the shadow-casting key light for the door, from front-left and above:
          shadows are what turn flat shapes into solid objects */}
      <directionalLight
        castShadow
        position={[-4.5, 6, 8]}
        intensity={2.0}
        color="#ffe3c2"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[-12, -3, 8]} intensity={0.55} color="#6f8bff" />
      <ambientLight intensity={0.1} color="#5566aa" />
      {/* soft warm light from the camera side, so the door face is not a silhouette */}
      <pointLight position={[-2.5, 2.2, 5.5]} color="#ffe9d6" intensity={10} distance={11} decay={2} />

      <Sun position={SUN_POS} />
      <Planet position={PLANET_POS} radius={14} sunDir={sunDir} />
      <mesh position={[17, 6.5, -34]}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial color="#8d8b92" roughness={1} metalness={0} />
      </mesh>

      <Rocks />
      <Rocks placements={flyby} />
      <Sparkles count={70} scale={[11, 7, 6]} size={2.4} speed={0.25} opacity={0.55} color="#ffd9ec" />

      <AnywhereDoor progress={progress} onOpen={onOpen} />
      <CameraRig progress={progress} />

      <EffectComposer multisampling={fancy ? 4 : 0}>
        <Bloom intensity={0.75} luminanceThreshold={0.8} luminanceSmoothing={0.2} mipmapBlur />
        {/* the film look: a tone curve so highlights roll off instead of clipping,
            a slight desaturation and a contrast lift. No grain or lens blur:
            they cost sharpness, and the door must stay crisp. */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <HueSaturation saturation={-0.08} />
        <BrightnessContrast brightness={-0.02} contrast={0.12} />
        {fancy ? <></> : <SMAA />}
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
