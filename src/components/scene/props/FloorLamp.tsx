"use client";

import { useRef } from "react";
import * as THREE from "three";

const BRASS = "#c9a34a";
const WOOD_DARK = "#2e1e12";

/**
 * Modern architectural standing floor lamp.
 * Sleek brass stem, dark wood stepped base, linen conical shade,
 * and realistic warm point light emission.
 */
export default function FloorLamp({
  x,
  z,
  intensity = 1.3,
  color = "#ffcf9e",
}: {
  x: number;
  z: number;
  intensity?: number;
  color?: string;
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  return (
    <group position={[x, 0, z]}>
      {/* Heavy Stepped Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.02, 16]} />
        <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Slender Brass Vertical Pole */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.7, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Shade Mounting Ring */}
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>

      {/* Elegant Conical Linen Shade */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 0.38, 24, 1, true]} />
        <meshStandardMaterial
          color="#fcf6ec"
          emissive="#ffe2b8"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          roughness={0.8}
        />
      </mesh>

      {/* Warm Point Light Source */}
      <pointLight
        ref={lightRef}
        position={[0, 1.78, 0]}
        color={color}
        intensity={intensity}
        distance={6}
        decay={1.8}
      />
    </group>
  );
}
