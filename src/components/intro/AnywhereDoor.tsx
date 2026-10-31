"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * A lone pink door floating in space: step through and you arrive somewhere
 * else (a homage to the classic "door to anywhere" idea; the design is a
 * plain painted door with a gold knob, nothing more).
 *
 * Structure matters for the animation. The door panel sits inside a "hinge"
 * group whose origin is the hinge edge. Rotating that one group swings the
 * panel around its hinge, exactly like a real door: no maths about where the
 * panel's centre goes.
 */
export interface DoorProgress {
  /** knob turn 0..1 */
  knob: number;
  /** door swing 0..1 */
  open: number;
  /** camera dive 0..1 */
  fly: number;
}

const W = 1.5; // door width
const H = 2.8; // door height
const T = 0.1; // door thickness
const PINK = "#ee5f9b";
const PINK_DEEP = "#cf4682";
const FRAME = "#e9d3dd";
const GOLD = "#e7b64b";

const glowFragment = /* glsl */ `
  uniform float uOpen;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // what you see beyond the open door: a warm, bright, beckoning light
    vec2 p = vUv - 0.5;
    float r = length(p * vec2(1.0, 0.55));
    float rays = 0.5 + 0.5 * sin(atan(p.y, p.x) * 14.0 + uTime * 0.6);
    vec3 warm = vec3(1.0, 0.86, 0.62);
    vec3 hot = vec3(1.0, 0.97, 0.9);
    vec3 col = mix(warm, hot, smoothstep(0.6, 0.0, r));
    col *= 0.85 + rays * 0.25 * smoothstep(0.0, 0.5, r);
    gl_FragColor = vec4(col * (0.4 + uOpen * 2.4), 1.0);
  }
`;
const flatVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export default function AnywhereDoor({
  progress,
  onOpen,
}: {
  progress: React.RefObject<DoorProgress>;
  onOpen: () => void;
}) {
  const hinge = useRef<THREE.Group>(null);
  const knob = useRef<THREE.Group>(null);
  const panelMat = useRef<THREE.MeshStandardMaterial>(null);
  const halo = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  const uniforms = useMemo(() => ({ uOpen: { value: 0 }, uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    const p = progress.current;
    if (hinge.current) hinge.current.rotation.y = -p.open * 1.95;
    if (knob.current) knob.current.rotation.z = -p.knob * 1.1;
    uniforms.uOpen.value = p.open;
    uniforms.uTime.value = clock.getElapsedTime();
    if (panelMat.current) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2.2);
      panelMat.current.emissiveIntensity = hover ? 0.55 : 0.12 + pulse * 0.08;
    }
    if (halo.current) halo.current.intensity = p.open * 60;
  });

  const over = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHover(false);
    document.body.style.cursor = "auto";
  };
  const click = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    onOpen();
  };

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.3} floatingRange={[-0.08, 0.08]}>
      <group>
        {/* the world beyond the door */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[W, H]} />
          <shaderMaterial uniforms={uniforms} vertexShader={flatVertex} fragmentShader={glowFragment} toneMapped={false} />
        </mesh>
        <pointLight ref={halo} position={[0, 0, 0.8]} color="#ffe2b0" distance={14} decay={1.4} intensity={0} />

        {/* frame: two posts and a lintel */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (W / 2 + 0.07), 0, 0]} castShadow>
            <boxGeometry args={[0.14, H + 0.14, 0.26]} />
            <meshStandardMaterial color={FRAME} roughness={0.55} metalness={0.05} />
          </mesh>
        ))}
        <mesh position={[0, H / 2 + 0.07, 0]}>
          <boxGeometry args={[W + 0.28, 0.14, 0.26]} />
          <meshStandardMaterial color={FRAME} roughness={0.55} metalness={0.05} />
        </mesh>

        {/* hinge on the left edge: rotating this group swings the door */}
        <group ref={hinge} position={[-W / 2, 0, 0]}>
          <group position={[W / 2, 0, 0]}>
            <mesh onPointerOver={over} onPointerOut={out} onClick={click}>
              <boxGeometry args={[W, H, T]} />
              <meshStandardMaterial
                ref={panelMat}
                color={PINK}
                roughness={0.42}
                metalness={0.12}
                emissive={PINK}
                emissiveIntensity={0.12}
              />
            </mesh>
            {/* two recessed panels, as on a classic painted door */}
            {[0.2, -0.2].map((k) => (
              <mesh key={k} position={[0, H * k, T / 2 + 0.004]}>
                <boxGeometry args={[W * 0.7, H * 0.34, 0.012]} />
                <meshStandardMaterial color={PINK_DEEP} roughness={0.5} metalness={0.1} />
              </mesh>
            ))}
            {/* gold knob on a backplate; turning is animated */}
            <group position={[W / 2 - 0.2, -0.06, T / 2]}>
              <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.024, 32]} />
                <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
              </mesh>
              <group ref={knob}>
                <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.022, 0.022, 0.08, 16]} />
                  <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
                </mesh>
                <mesh position={[0, 0, 0.115]} onPointerOver={over} onPointerOut={out} onClick={click}>
                  <sphereGeometry args={[0.07, 32, 32]} />
                  <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </Float>
  );
}
