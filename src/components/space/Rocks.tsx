"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Deterministic pseudo-random so the rocks look the same on every load. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** A lumpy rock: start from a sphere and push every vertex in or out a little. */
function makeRockGeometry(seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 3);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 2.3 + seed) * Math.cos(v.y * 2.7 + seed * 1.3) * 0.22 +
      Math.sin(v.z * 5.1 + seed * 2.1) * 0.08 +
      rand(Math.round((v.x + v.y * 3 + v.z * 7) * 40) + seed) * 0.05;
    v.multiplyScalar(1 + n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Drifting rocks around the door. They are lit by the sun, which sells the depth. */
export interface RockPlacement {
  pos: [number, number, number];
  s: number;
}

export default function Rocks({ count = 14, placements }: { count?: number; placements?: RockPlacement[] }) {
  const group = useRef<THREE.Group>(null);
  const rocks = useMemo(
    () =>
      Array.from({ length: placements ? placements.length : count }, (_, i) => {
        const a = rand(i + 1) * Math.PI * 2;
        const r = 4.5 + rand(i + 20) * 9;
        return {
          geo: makeRockGeometry(i + 3),
          pos: placements
            ? placements[i].pos
            : ([Math.cos(a) * r, (rand(i + 40) - 0.5) * 7, -3 - rand(i + 60) * 14] as [number, number, number]),
          s: placements ? placements[i].s : 0.14 + rand(i + 80) * 0.7,
          spin: [rand(i + 100) * 0.3, rand(i + 120) * 0.3, rand(i + 140) * 0.2] as [number, number, number],
        };
      }),
    [count, placements]
  );
  useFrame((_, dt) => {
    group.current?.children.forEach((m, i) => {
      m.rotation.x += rocks[i].spin[0] * dt;
      m.rotation.y += rocks[i].spin[1] * dt;
      m.rotation.z += rocks[i].spin[2] * dt;
    });
  });
  return (
    <group ref={group}>
      {rocks.map((r, i) => (
        <mesh key={i} geometry={r.geo} position={r.pos} scale={r.s}>
          <meshStandardMaterial color="#4a4541" roughness={0.95} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}
