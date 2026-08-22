"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * An analog clock whose hands track REAL current time, not a prop or
 * animation loop — reads `new Date()` every frame and sets each hand's
 * rotation directly from it. Mounted as a group; position/rotationY
 * follow the same convention every other wall-mounted prop in this app
 * uses (rotationY matches the wall's own facing rotation).
 */
export default function WallClock({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const hourRef = useRef<THREE.Group>(null);
  const minuteRef = useRef<THREE.Group>(null);
  const secondRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    // Clock hands sweep around Z (the axis perpendicular to this
    // vertical, wall-mounted face) — NOT Y. A hand mesh is offset along
    // the group's local Y axis; rotating the group around Y leaves a
    // point already on that axis unmoved, so the hands would never
    // visibly move at all if this used rotation.y. Negative angle for
    // clockwise sweep from 12, matching the tick marks' convention below.
    if (hourRef.current) hourRef.current.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
    if (minuteRef.current) minuteRef.current.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
    if (secondRef.current) secondRef.current.rotation.z = -(s / 60) * Math.PI * 2;
  });

  const ticks = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Face */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.55, 32]} />
        <meshStandardMaterial color="#ece6d8" roughness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0, 0.015]}>
        <ringGeometry args={[0.55, 0.62, 32]} />
        <meshStandardMaterial color="#c9a34a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Hour ticks */}
      {ticks.map((a) => (
        <mesh
          key={a}
          position={[Math.sin(a) * 0.48, Math.cos(a) * 0.48, 0.03]}
          rotation={[0, 0, -a]}
        >
          <boxGeometry args={[0.03, 0.07, 0.01]} />
          <meshStandardMaterial color="#1a1714" />
        </mesh>
      ))}
      {/* Hour hand */}
      <group ref={hourRef} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.035, 0.28, 0.015]} />
          <meshStandardMaterial color="#1a1714" />
        </mesh>
      </group>
      {/* Minute hand */}
      <group ref={minuteRef} position={[0, 0, 0.05]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.025, 0.4, 0.015]} />
          <meshStandardMaterial color="#1a1714" />
        </mesh>
      </group>
      {/* Second hand */}
      <group ref={secondRef} position={[0, 0, 0.06]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.012, 0.44, 0.01]} />
          <meshStandardMaterial color="#7a2620" />
        </mesh>
      </group>
      {/* Center pin */}
      <mesh position={[0, 0, 0.07]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
        <meshStandardMaterial color="#c9a34a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
