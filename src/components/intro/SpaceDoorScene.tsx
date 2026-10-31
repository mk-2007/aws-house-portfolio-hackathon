"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { useNebulaTexture } from "@/components/space/useNebulaTexture";
import Planet from "@/components/space/Planet";
import Sun from "@/components/space/Sun";
import Rocks from "@/components/space/Rocks";
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

/** Slow handheld-camera drift, pointer parallax, and the final dive through the door. */
function CameraRig({ progress }: { progress: React.RefObject<DoorProgress> }) {
  useFrame(({ camera, pointer, size, clock }) => {
    const f = progress.current.fly;
    const t = clock.getElapsedTime();
    // pull back on tall (phone) screens so the whole door still fits
    const aspect = size.width / size.height;
    const baseZ = Math.max(9.5, 4.8 / aspect);

    const drift = 1 - f;
    const tx = (pointer.x * 0.7 + Math.sin(t * 0.21) * 0.25) * drift;
    const ty = (pointer.y * 0.4 + Math.cos(t * 0.17) * 0.15) * drift;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.position.z = baseZ - f * (baseZ + 1.4);
    // aim slightly below the door so it sits above the text block
    camera.lookAt(0, -0.55 * drift, 0);
    const pc = camera as THREE.PerspectiveCamera;
    pc.fov = 44 + f * 34;
    pc.updateProjectionMatrix();
  });
  return null;
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

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9.5], fov: 44, near: 0.1, far: 1200 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#02030a"]} />
      <Sky />
      <Stars radius={300} depth={80} count={5000} factor={6} saturation={0.5} fade speed={0.4} />

      {/* the key light (sun) and a faint cool fill from the opposite side */}
      <directionalLight position={[keyDir.x * 30, keyDir.y * 30, keyDir.z * 30 + 20]} intensity={3.4} color="#ffe6c2" />
      <directionalLight position={[-12, -3, 8]} intensity={0.55} color="#6f8bff" />
      <ambientLight intensity={0.1} color="#5566aa" />
      {/* soft warm light from the camera side, so the door face is not a silhouette */}
      <pointLight position={[-2.5, 2.2, 5.5]} color="#ffe9d6" intensity={34} distance={11} decay={2} />

      <Sun position={SUN_POS} />
      <Planet position={PLANET_POS} radius={14} sunDir={sunDir} />
      <mesh position={[17, 6.5, -34]}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial color="#8d8b92" roughness={1} metalness={0} />
      </mesh>

      <Rocks />
      <Sparkles count={70} scale={[11, 7, 6]} size={2.4} speed={0.25} opacity={0.55} color="#ffd9ec" />

      <AnywhereDoor progress={progress} onOpen={onOpen} />
      <CameraRig progress={progress} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
        <Noise opacity={0.045} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
