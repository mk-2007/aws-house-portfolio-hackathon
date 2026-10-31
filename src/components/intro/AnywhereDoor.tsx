"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import DoorIsland from "./DoorIsland";

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
  /** drone flight 0..1 (camera arriving at the door) */
  intro: number;
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
const PINK = "#b9567f"; // a muted painted rose: the one warm accent in a cool scene
const PINK_DEEP = "#98406a";
const PINK_LIGHT = "#cf7396";
const FRAME = "#2b2420"; // dark wood, so it reads as a doorway and not a wall slab
const GOLD = "#e7b64b";

/** Painted-wood surface: faint vertical grain plus speckle, used as a bump map. */
function makePaintTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * 256;
    const light = Math.random() > 0.5;
    g.strokeStyle = light
      ? `rgba(255,255,255,${0.03 + Math.random() * 0.06})`
      : `rgba(0,0,0,${0.04 + Math.random() * 0.07})`;
    g.lineWidth = 0.6 + Math.random() * 1.6;
    g.beginPath();
    g.moveTo(x, 0);
    g.bezierCurveTo(x + 6, 150, x - 6, 350, x + 2, 512);
    g.stroke();
  }
  for (let i = 0; i < 2200; i++) {
    g.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
    g.fillRect(Math.random() * 256, Math.random() * 512, 1.4, 1.4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** A small brass nameplate engraved with initials. */
function makePlateTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 110;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 256, 110);
  grad.addColorStop(0, "#b88a2e");
  grad.addColorStop(0.5, "#f1cf78");
  grad.addColorStop(1, "#a9791f");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 110);
  g.strokeStyle = "rgba(60,38,6,0.7)";
  g.lineWidth = 5;
  g.strokeRect(6, 6, 244, 98);
  g.fillStyle = "#3a2504";
  g.font = "bold 54px Georgia, serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("M . K", 128, 58);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

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
  const panelMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const halo = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  const uniforms = useMemo(() => ({ uOpen: { value: 0 }, uTime: { value: 0 } }), []);
  const paint = useMemo(() => makePaintTexture(), []);
  const plate = useMemo(() => makePlateTexture(), []);

  useFrame(({ clock }) => {
    const p = progress.current;
    if (hinge.current) hinge.current.rotation.y = -p.open * 1.95;
    if (knob.current) knob.current.rotation.z = -p.knob * 1.1;
    uniforms.uOpen.value = p.open;
    uniforms.uTime.value = clock.getElapsedTime();
    if (panelMat.current) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 2.2);
      panelMat.current.emissiveIntensity = hover ? 0.3 : 0.0 + pulse * 0.0;
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

        {/* the island the door stands on, with a stone step and a lantern */}
        <DoorIsland top={-H / 2 - 0.05} />

        {/* frame: dark wood posts, a lintel with a small cornice, a stone threshold */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (W / 2 + 0.06), 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.12, H + 0.1, 0.24]} />
            <meshStandardMaterial color={FRAME} roughness={0.78} metalness={0.05} />
          </mesh>
        ))}
        <mesh position={[0, H / 2 + 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[W + 0.24, 0.12, 0.24]} />
          <meshStandardMaterial color={FRAME} roughness={0.78} metalness={0.05} />
        </mesh>
        <mesh position={[0, H / 2 + 0.16, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[W + 0.5, 0.08, 0.34]} />
          <meshStandardMaterial color="#1f1a17" roughness={0.8} />
        </mesh>
        <mesh position={[0, -H / 2 - 0.03, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[W + 0.3, 0.06, 0.36]} />
          <meshStandardMaterial color="#77716a" roughness={0.9} />
        </mesh>

        {/* hinge on the left edge: rotating this group swings the door */}
        <group ref={hinge} position={[-W / 2, 0, 0]}>
          <group position={[W / 2, 0, 0]}>
            <mesh onPointerOver={over} onPointerOut={out} onClick={click} castShadow receiveShadow>
              <boxGeometry args={[W, H, T]} />
              <meshPhysicalMaterial
                ref={panelMat}
                color={PINK}
                roughness={0.42}
                metalness={0}
                clearcoat={0.55}
                clearcoatRoughness={0.3}
                bumpMap={paint}
                bumpScale={0.6}
                emissive={PINK}
                emissiveIntensity={0}
              />
            </mesh>
            {/* two panels with raised mouldings: the thin raised borders catch
                light on one edge and cast shadow on the other, which is what
                makes a flat slab read as a crafted door */}
            {[H * 0.19, -H * 0.19].map((y) => (
              <group key={y} position={[0, y, T / 2]}>
                <mesh position={[0, 0, 0.003]} receiveShadow>
                  <boxGeometry args={[W * 0.66, H * 0.29, 0.008]} />
                  <meshPhysicalMaterial color={PINK_DEEP} roughness={0.5} clearcoat={0.3} clearcoatRoughness={0.4} />
                </mesh>
                {[
                  [0, H * 0.145, W * 0.66 + 0.05, 0.04],
                  [0, -H * 0.145, W * 0.66 + 0.05, 0.04],
                  [W * 0.33, 0, 0.04, H * 0.29],
                  [-W * 0.33, 0, 0.04, H * 0.29],
                ].map(([mx, my, mw, mh], i) => (
                  <mesh key={i} position={[mx, my, 0.014]} castShadow receiveShadow>
                    <boxGeometry args={[mw, mh, 0.03]} />
                    <meshPhysicalMaterial color={PINK_LIGHT} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.3} />
                  </mesh>
                ))}
              </group>
            ))}
            {/* brass nameplate */}
            <mesh position={[0, H * 0.44, T / 2 + 0.012]}>
              <planeGeometry args={[0.46, 0.2]} />
              <meshStandardMaterial map={plate} metalness={0.85} roughness={0.35} />
            </mesh>
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
