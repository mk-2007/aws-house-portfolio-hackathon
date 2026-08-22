"use client";

import * as THREE from "three";

/**
 * A hung "portrait" for the corridor gallery — deliberately abstract (a
 * generic silhouette bust, not a photo or likeness of any real person).
 * Ornate wooden frame + a tinted backdrop + a simple bust silhouette
 * shape built from primitives, varying tint per instance for variety.
 */
export default function Portrait({
  x,
  z,
  rotationY,
  tint = "#7a2620",
}: {
  x: number;
  z: number;
  rotationY: number;
  tint?: string;
}) {
  return (
    <group position={[x, 2.4, z]} rotation={[0, rotationY, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.9, 1.15, 0.06]} />
        <meshStandardMaterial color="#3c2817" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.06, 1.15, 0.02]} />
        <meshStandardMaterial color="#c9a34a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Backdrop */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.76, 1.0]} />
        <meshStandardMaterial color={tint} roughness={0.9} />
      </mesh>
      {/* Abstract bust silhouette */}
      <mesh position={[0, 0.12, 0.03]}>
        <circleGeometry args={[0.16, 20]} />
        <meshStandardMaterial color="#141210" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.24, 0.03]}>
        <coneGeometry args={[0.32, 0.42, 20, 1, true]} />
        <meshStandardMaterial color="#141210" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
