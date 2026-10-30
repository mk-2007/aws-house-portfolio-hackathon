"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useKeysStore, type KeyId } from "@/store/keysStore";

const BRASS = "#d9ae4a";

/**
 * A collectible brass key. Built from simple primitives (ring, shaft, two
 * teeth) so it needs no model file. It bobs, slowly turns and pulses a soft
 * glow so a visitor scanning the room can spot it. Clicking collects it.
 *
 * `invisible hit sphere`: the visible key is small, so a larger transparent
 * sphere around it is the click target. That makes it easy to hit with a
 * finger on a phone.
 */
export default function KeyPickup({
  id,
  position,
  rotation = [0, 0, 0],
  scale = 1.6,
}: {
  id: KeyId;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const collected = useKeysStore((s) => s.collected[id]);
  const collect = useKeysStore((s) => s.collect);
  const body = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (body.current) {
      body.current.position.y = Math.sin(t * 1.6) * 0.035;
      body.current.rotation.y = t * 0.9;
    }
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    if (glow.current) {
      glow.current.scale.setScalar(0.85 + pulse * 0.3);
      (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + pulse * 0.09;
    }
    if (light.current) light.current.intensity = 0.3 + pulse * 0.6;
  });

  if (collected) return null;

  function onClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    collect(id);
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={body}>
        {/* ring (bow) */}
        <mesh position={[-0.13, 0, 0]}>
          <torusGeometry args={[0.055, 0.016, 12, 24]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.25} emissive="#7a5410" emissiveIntensity={0.6} />
        </mesh>
        {/* shaft */}
        <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 10]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.25} emissive="#7a5410" emissiveIntensity={0.6} />
        </mesh>
        {/* teeth */}
        {[0.1, 0.145].map((x, i) => (
          <mesh key={x} position={[x, -0.032 - i * 0.004, 0]}>
            <boxGeometry args={[0.022, 0.06, 0.016]} />
            <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.25} emissive="#7a5410" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* soft glow shell */}
      <mesh ref={glow}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshBasicMaterial color="#ffd978" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight ref={light} color="#ffd27a" distance={1.4} decay={2} intensity={0.6} />

      {/* generous invisible click target */}
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
