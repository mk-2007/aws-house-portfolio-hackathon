"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useNebulaTexture } from "./useNebulaTexture";
import Planet from "./Planet";
import Sun from "./Sun";
import Rocks, { type RockPlacement } from "./Rocks";

/**
 * The world OUTSIDE the house: the same sky, planet and sun as the intro.
 *
 * The house floats in this world, and the corridor's windows are real holes in
 * the walls, so there is nothing to fake: you simply see the sky through them.
 * One shared module for the intro and the interior is what keeps the two
 * halves of the site feeling like the same universe.
 *
 * Exported constants let the corridor aim its shadow-casting "sunlight" at the
 * same sun the visitor sees through the glass.
 */
export const SUN_POSITION: [number, number, number] = [120, 42, 40];
const PLANET_POSITION: [number, number, number] = [-115, 8, 14];
const PLANET_SUN_DIR = new THREE.Vector3(0.5, 0.2, -0.84).normalize();

function outsideRocks(): RockPlacement[] {
  const spots: [number, number, number, number][] = [
    [-16, 3, -9, 1.4],
    [-24, -2, 3, 2.2],
    [-19, 6, 12, 1.0],
    [-34, 2, -14, 3.0],
    [17, 4, -12, 1.2],
    [26, -1, 6, 2.0],
    [20, 7, 14, 0.9],
    [38, 3, -4, 3.2],
  ];
  return spots.map(([x, y, z, s]) => ({ pos: [x, y, z], s }));
}

export default function SpaceWorld() {
  const nebula = useNebulaTexture(2048);
  const scene = useThree((s) => s.scene);
  const sky = useRef<THREE.Mesh>(null);
  const rocks = useMemo(() => outsideRocks(), []);

  // The nebula doubles as the environment map: shiny wood, brass and paint
  // pick up its colours as reflections.
  useEffect(() => {
    if (!nebula?.env) return;
    scene.environment = nebula.env;
    scene.environmentIntensity = 0.8;
    return () => {
      scene.environment = null;
    };
  }, [nebula, scene]);

  // Keep the sky centred on the camera so it behaves as infinitely far away.
  useFrame(({ camera }) => {
    sky.current?.position.copy(camera.position);
  });

  if (!nebula) return null;
  return (
    <group>
      <mesh ref={sky} scale={[-1, 1, 1]} renderOrder={-10}>
        <sphereGeometry args={[500, 64, 32]} />
        <meshBasicMaterial map={nebula.texture} side={THREE.BackSide} toneMapped={false} depthWrite={false} />
      </mesh>
      <Stars radius={420} depth={80} count={4000} factor={6} saturation={0.5} fade speed={0.3} />
      <Sun position={SUN_POSITION} scale={1.6} />
      <Planet position={PLANET_POSITION} radius={40} sunDir={PLANET_SUN_DIR} />
      <Rocks placements={rocks} />
    </group>
  );
}
