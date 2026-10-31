"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * The little floating island the door stands on, plus a lantern.
 *
 * Why this matters: a door floating on nothing reads as a sticker pasted on
 * a backdrop. Give it ground, scale, a prop with its own light source and a
 * visible underside, and the brain accepts it as a place.
 */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeIslandGeometry() {
  const g = new THREE.IcosahedronGeometry(1, 5);
  const pos = g.attributes.position;
  const colors: number[] = [];
  const v = new THREE.Vector3();
  const stone = new THREE.Color("#4b4540");
  const moss = new THREE.Color("#4d5a3a");
  const dark = new THREE.Color("#2a2623");
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const lump =
      Math.sin(v.x * 3.1 + 1.3) * Math.cos(v.z * 2.7) * 0.12 +
      Math.sin(v.y * 6.3 + v.x * 4.1) * 0.05 +
      hash(Math.round((v.x * 7 + v.y * 13 + v.z * 5) * 50)) * 0.035;
    let y = v.y;
    let r = 1 + lump;
    if (y > 0.18) {
      y = 0.18 + (y - 0.18) * 0.06; // a nearly flat top to stand on
    } else if (y < 0) {
      y = y * 1.45; // the underside tapers down to a point
      r *= 1 + y * 0.22;
    }
    const out = new THREE.Vector3(v.x * r, y, v.z * r);
    pos.setXYZ(i, out.x, out.y, out.z);
    // moss on top, stone in the middle, dark rock below
    const c = y > 0.1 ? moss.clone().lerp(stone, hash(i) * 0.5) : y > -0.3 ? stone.clone() : dark.clone();
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

export default function DoorIsland({ top }: { top: number }) {
  const geo = useMemo(() => makeIslandGeometry(), []);
  // island top surface sits at `top`; the geometry's flat top is at y=0.18*scaleY
  const sy = 1.05;
  const y = top - 0.18 * sy;
  return (
    <group>
      <mesh geometry={geo} position={[0.2, y, 0.1]} scale={[2.9, sy, 2.2]}>
        <meshStandardMaterial vertexColors roughness={0.96} metalness={0.04} />
      </mesh>

      {/* the stone step in front of the door */}
      <mesh position={[0, top + 0.05, 0.55]}>
        <boxGeometry args={[2.1, 0.1, 0.62]} />
        <meshStandardMaterial color="#6b655d" roughness={0.9} />
      </mesh>

      {/* a few stones and tufts that break up the silhouette */}
      {[
        [-1.7, 0.1, 0.8, 0.22],
        [1.9, 0.08, 1.0, 0.16],
        [-2.2, 0.05, -0.4, 0.28],
        [2.4, 0.09, -0.5, 0.2],
      ].map(([x, h, z, s], i) => (
        <mesh key={i} position={[x, top + h, z]} scale={s} rotation={[i, i * 1.7, 0]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? "#5e5852" : "#4d5a3a"} roughness={1} />
        </mesh>
      ))}

      {/* lantern post: its own warm light source gives the scene a human scale */}
      <group position={[1.85, top, 0.55]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.025, 0.04, 1.8, 10]} />
          <meshStandardMaterial color="#1c1917" metalness={0.7} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.12, 12]} />
          <meshStandardMaterial color="#1c1917" metalness={0.7} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.88, 0]}>
          <boxGeometry args={[0.2, 0.26, 0.2]} />
          <meshStandardMaterial color="#ffd9a0" emissive="#ffb55c" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
        <mesh position={[0, 2.06, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.2, 0.14, 4]} />
          <meshStandardMaterial color="#1c1917" metalness={0.7} roughness={0.5} />
        </mesh>
        <pointLight position={[0, 1.85, 0.15]} color="#ffb764" intensity={9} distance={7} decay={1.7} />
      </group>
    </group>
  );
}
