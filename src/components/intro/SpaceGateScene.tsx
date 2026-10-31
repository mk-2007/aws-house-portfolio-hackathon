"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * The intro's 3D scene: a monumental gate floating in deep space.
 *
 * `progress` is a plain mutable object that GSAP tweens from the DOM side
 * (see SpaceGate.tsx). We read it inside useFrame instead of using React
 * state, because animating through state would re-render React sixty times
 * a second. Mutable refs + useFrame is the standard pattern for animation
 * in react-three-fiber.
 */
export interface GateProgress {
  /** 0 = doors shut, 1 = doors fully apart */
  open: number;
  /** 0 = camera far away, 1 = camera has flown through the portal */
  fly: number;
}

const CYAN = "#22d3ee";
const VIOLET = "#7c3aed";
const METAL = "#10121c";
/** The gate sits a little above screen centre so the text below never overlaps it. */
const GATE_Y = 0.9;

/* ---------- portal shader ----------
 * A fragment shader runs once per pixel on the GPU. Here we turn each pixel's
 * position into polar coordinates (radius r, angle a) and mix two sine waves
 * of them to get a swirling pattern, then brighten the middle. `uTime` makes
 * it spin; `uOpen` makes the heart of the portal flare as the doors open. */
const portalVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const portalFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpen;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float s1 = sin(a * 6.0 + r * 10.0 - uTime * 2.0) * 0.5 + 0.5;
    float s2 = sin(a * 3.0 - r * 14.0 + uTime * 1.3) * 0.5 + 0.5;
    float core = smoothstep(1.0, 0.0, r);
    vec3 c1 = vec3(0.49, 0.23, 0.93);
    vec3 c2 = vec3(0.13, 0.83, 0.93);
    vec3 col = mix(c1, c2, s1 * s2) * (0.3 + core * 1.5);
    col += vec3(1.0) * pow(core, 5.0) * (0.35 + uOpen * 2.4);
    float alpha = smoothstep(1.0, 0.93, r);
    gl_FragColor = vec4(col, alpha);
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2) * uStrength;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Portal({ progress }: { progress: React.RefObject<GateProgress> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpen: { value: 0 } }), []);
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uOpen.value = progress.current.open;
  });
  return (
    <mesh position={[0, 0, -0.05]}>
      <circleGeometry args={[2.85, 80]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={portalVertex}
        fragmentShader={portalFragment}
        transparent
      />
    </mesh>
  );
}

function Glow({ position, size, color, strength }: { position: [number, number, number]; size: number; color: string; strength: number }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } }),
    [color, strength]
  );
  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={portalVertex}
        fragmentShader={glowFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** One half of the gate's double door: a thick half-disc that slides sideways. */
function DoorHalf({ side, progress }: { side: 1 | -1; progress: React.RefObject<GateProgress> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.x = side * progress.current.open * 3.1;
  });
  // CylinderGeometry measures its angle from +z; after we stand it up
  // (rotate x by 90deg) +z points to screen-right on one half, left on the other.
  return (
    <group ref={ref} position={[0, 0, 0.05]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.85, 2.85, 0.28, 64, 1, false, side === 1 ? 0 : Math.PI, Math.PI]} />
        <meshStandardMaterial color={METAL} metalness={0.92} roughness={0.38} />
      </mesh>
      {/* glowing engraved lines on each door */}
      {[0.9, 1.6, 2.3].map((r) => (
        <mesh key={r} position={[0, 0, 0.145]} rotation={[0, 0, side === 1 ? -Math.PI / 2 : Math.PI / 2]}>
          <ringGeometry args={[r - 0.012, r + 0.012, 64, 1, 0, Math.PI]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>
      ))}
      {/* the seam light down the middle */}
      <mesh position={[side * -0.01, 0, 0.15]}>
        <boxGeometry args={[0.04, 5.5, 0.02]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GateFrame() {
  const runes = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (runes.current) runes.current.rotation.z += dt * 0.12;
  });
  const marks = useMemo(() => Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2), []);
  return (
    <group>
      <mesh>
        <torusGeometry args={[3.1, 0.3, 24, 120]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.22]}>
        <torusGeometry args={[3.1, 0.025, 8, 160]} />
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <torusGeometry args={[2.88, 0.07, 16, 120]} />
        <meshBasicMaterial color={VIOLET} toneMapped={false} />
      </mesh>
      <group ref={runes}>
        {marks.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 3.62, Math.sin(a) * 3.62, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[i % 2 === 0 ? 0.34 : 0.16, 0.05, 0.05]} />
            <meshBasicMaterial color={i % 4 === 0 ? CYAN : VIOLET} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Slowly drifting dark rocks give the scene depth and something to parallax against. */
function Asteroids() {
  const group = useRef<THREE.Group>(null);
  const rocks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.4;
        const r = 6 + (i % 5) * 1.4;
        return {
          pos: [Math.cos(a) * r, Math.sin(a) * r * 0.55, -2 - (i % 4) * 2.4] as [number, number, number],
          s: 0.22 + (i % 4) * 0.2,
          rot: [i * 0.7, i * 1.3, i * 0.4] as [number, number, number],
          sp: 0.1 + (i % 5) * 0.05,
        };
      }),
    []
  );
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current?.children.forEach((m, i) => {
      m.rotation.x += 0.003 + rocks[i].sp * 0.01;
      m.rotation.y += 0.004;
      m.position.y = rocks[i].pos[1] + Math.sin(t * rocks[i].sp + i) * 0.25;
    });
  });
  return (
    <group ref={group}>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={r.rot} scale={r.s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#1a1d2b" metalness={0.5} roughness={0.8} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Camera: drifts with the pointer, then dives through the portal when `fly` rises. */
function CameraRig({ progress }: { progress: React.RefObject<GateProgress> }) {
  useFrame(({ camera, pointer, size }) => {
    const f = progress.current.fly;
    // Responsive framing: the gate (about 4 units wide each side) must fit the
    // SHORTER screen dimension. On a wide desktop a fixed distance works; on a
    // tall phone the visible width is small, so we pull the camera back.
    // Visible half-width at distance z is  z * tan(fov/2) * aspect, so
    // solving for z gives  z = halfWidthNeeded / (tan(26deg) * aspect).
    const aspect = size.width / size.height;
    const baseZ = Math.max(13.5, 9.02 / aspect);
    const tx = pointer.x * 0.9 * (1 - f);
    const ty = pointer.y * 0.55 * (1 - f);
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.position.z = baseZ - f * (baseZ + 0.7);
    camera.lookAt(0, GATE_Y, 0);
    const pc = camera as THREE.PerspectiveCamera;
    pc.fov = 52 + f * 38; // widening the field of view as we speed up sells the warp
    pc.updateProjectionMatrix();
  });
  return null;
}

export default function SpaceGateScene({ progress }: { progress: React.RefObject<GateProgress> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 15], fov: 52, near: 0.1, far: 200 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} color="#8aa0ff" />
      <pointLight position={[0, GATE_Y, 4]} intensity={30} color={CYAN} distance={14} />
      <pointLight position={[-6, 4, 2]} intensity={18} color={VIOLET} distance={18} />
      <Stars radius={90} depth={50} count={3800} factor={4.5} saturation={0.4} fade speed={0.8} />
      <Asteroids />
      <group position={[0, GATE_Y, 0]}>
        <Glow position={[0, 0, -3]} size={22} color="#6d28d9" strength={0.55} />
        <Glow position={[0, 0, -2.5]} size={11} color="#22d3ee" strength={0.35} />
        <GateFrame />
        <Portal progress={progress} />
        <DoorHalf side={1} progress={progress} />
        <DoorHalf side={-1} progress={progress} />
      </group>
      <CameraRig progress={progress} />
    </Canvas>
  );
}
