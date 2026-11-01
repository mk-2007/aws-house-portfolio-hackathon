"use client";

import { useMemo } from "react";
import {
  CORRIDOR_START_Z,
  CORRIDOR_END_Z,
  WALL_HEIGHT,
  WALL_X,
  CORRIDOR_WIDTH,
  CORRIDOR_START_Z as START_Z,
} from "./corridorLayout";

/**
 * The corridor's architecture, themed to match the world outside.
 *
 * Key idea: the walls are built from boxes AROUND window openings, so the
 * windows are genuine holes. The sky, planet and sun show through them, and
 * the sunlight (a shadow-casting directional light) passes through the same
 * holes and lays bars of light across the floor. Real geometry gives the
 * lighting for free; faking this with textures never looks right.
 */
export const WALL_COLOR = "#363c50"; // deep charcoal-blue plaster
const WAINSCOT = "#2a1d15"; // dark wood
const BRASS = "#c9a34a";
const WALL_THICKNESS = 0.4;

export const WINDOW_WIDTH = 2.4;
const WINDOW_BOTTOM = 1.0;
const WINDOW_TOP = 3.0;

/** Window centres along z, alternating sides so each window faces a door. */
export const LEFT_WINDOWS = [-2, 10];
export const RIGHT_WINDOWS = [-8, 4];

interface Span {
  from: number;
  to: number;
}

function solidSpans(windows: number[]): Span[] {
  const sorted = [...windows].sort((a, b) => a - b);
  const spans: Span[] = [];
  let cursor = CORRIDOR_START_Z;
  for (const w of sorted) {
    spans.push({ from: cursor, to: w - WINDOW_WIDTH / 2 });
    cursor = w + WINDOW_WIDTH / 2;
  }
  spans.push({ from: cursor, to: CORRIDOR_END_Z });
  return spans;
}

function Box({
  pos,
  size,
  color,
  rough = 0.9,
  metal = 0,
  shadow = true,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  rough?: number;
  metal?: number;
  shadow?: boolean;
}) {
  return (
    <mesh position={pos} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function WindowFrame({ x, z, facing }: { x: number; z: number; facing: 1 | -1 }) {
  // facing = +1 when the room is to the +x side of the wall (left wall)
  const h = WINDOW_TOP - WINDOW_BOTTOM;
  const cy = (WINDOW_TOP + WINDOW_BOTTOM) / 2;
  const depth = 0.34;
  const t = 0.08;
  return (
    <group position={[x, 0, z]}>
      {/* frame */}
      <Box pos={[0, WINDOW_TOP - t / 2, 0]} size={[depth, t, WINDOW_WIDTH]} color={WAINSCOT} rough={0.6} />
      <Box pos={[0, WINDOW_BOTTOM + t / 2, 0]} size={[depth, t, WINDOW_WIDTH]} color={WAINSCOT} rough={0.6} />
      {[-1, 1].map((s) => (
        <Box key={s} pos={[0, cy, s * (WINDOW_WIDTH / 2 - t / 2)]} size={[depth, h, t]} color={WAINSCOT} rough={0.6} />
      ))}
      {/* mullions: one upright, one crossbar */}
      <Box pos={[0, cy, 0]} size={[0.06, h, 0.05]} color={WAINSCOT} rough={0.6} />
      <Box pos={[0, cy, 0]} size={[0.06, 0.05, WINDOW_WIDTH]} color={WAINSCOT} rough={0.6} />
      {/* brass sill that juts into the room */}
      <Box pos={[facing * 0.22, WINDOW_BOTTOM - 0.03, 0]} size={[0.26, 0.06, WINDOW_WIDTH + 0.2]} color={BRASS} rough={0.3} metal={0.8} />
    </group>
  );
}

function WindowedWall({ side, windows }: { side: "left" | "right"; windows: number[] }) {
  const sign = side === "left" ? -1 : 1;
  const cx = sign * (WALL_X + WALL_THICKNESS / 2);
  const inner = sign * WALL_X;
  const spans = useMemo(() => solidSpans(windows), [windows]);

  return (
    <group>
      {spans.map((sp, i) => {
        const len = sp.to - sp.from;
        if (len <= 0.001) return null;
        const cz = (sp.from + sp.to) / 2;
        return (
          <group key={i}>
            <Box pos={[cx, WALL_HEIGHT / 2, cz]} size={[WALL_THICKNESS, WALL_HEIGHT, len]} color={WALL_COLOR} />
            {/* dark wood wainscot on the room side + a brass rail on top */}
            <Box pos={[inner - sign * 0.02, 0.5, cz]} size={[0.04, 1.0, len]} color={WAINSCOT} rough={0.55} shadow={false} />
            <Box pos={[inner - sign * 0.03, 1.03, cz]} size={[0.06, 0.04, len]} color={BRASS} rough={0.3} metal={0.8} shadow={false} />
          </group>
        );
      })}
      {windows.map((w) => (
        <group key={w}>
          {/* wall below the sill and above the lintel */}
          <Box pos={[cx, WINDOW_BOTTOM / 2, w]} size={[WALL_THICKNESS, WINDOW_BOTTOM, WINDOW_WIDTH]} color={WALL_COLOR} />
          <Box
            pos={[cx, (WINDOW_TOP + WALL_HEIGHT) / 2, w]}
            size={[WALL_THICKNESS, WALL_HEIGHT - WINDOW_TOP, WINDOW_WIDTH]}
            color={WALL_COLOR}
          />
          <Box pos={[inner - sign * 0.02, 0.5, w]} size={[0.04, 1.0, WINDOW_WIDTH]} color={WAINSCOT} rough={0.55} shadow={false} />
          <WindowFrame x={cx} z={w} facing={(side === "left" ? 1 : -1) as 1 | -1} />
        </group>
      ))}
    </group>
  );
}

export function CorridorWalls() {
  return (
    <group>
      <WindowedWall side="left" windows={LEFT_WINDOWS} />
      <WindowedWall side="right" windows={RIGHT_WINDOWS} />
      {/* end walls */}
      {[CORRIDOR_START_Z - WALL_THICKNESS / 2, CORRIDOR_END_Z + WALL_THICKNESS / 2].map((z) => (
        <Box key={z} pos={[0, WALL_HEIGHT / 2, z]} size={[CORRIDOR_WIDTH + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]} color={WALL_COLOR} />
      ))}
      {[CORRIDOR_START_Z + 0.02, CORRIDOR_END_Z - 0.02].map((z, i) => (
        <group key={z}>
          <Box pos={[0, 0.5, z]} size={[CORRIDOR_WIDTH, 1.0, 0.04]} color={WAINSCOT} rough={0.55} shadow={false} />
          <Box pos={[0, 1.03, z + (i === 0 ? 0.01 : -0.01)]} size={[CORRIDOR_WIDTH, 0.04, 0.06]} color={BRASS} rough={0.3} metal={0.8} shadow={false} />
        </group>
      ))}
    </group>
  );
}

/** Brass inlay lines running down the polished floor. */
export function FloorInlay() {
  const len = CORRIDOR_END_Z - CORRIDOR_START_Z;
  const cz = (CORRIDOR_END_Z + CORRIDOR_START_Z) / 2;
  return (
    <group>
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.004, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.05, len - 0.4]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The door you arrived through: the same rose-painted door from the intro,
 * standing on the entrance wall, with warm light leaking around its edges.
 */
export function ArrivalDoor({ x = -1.5 }: { x?: number }) {
  const W = 1.5;
  const H = 2.6;
  return (
    <group position={[x, 0, START_Z + 0.03]}>
      <Box pos={[0, H / 2 + 0.05, -0.01]} size={[W + 0.28, H + 0.12, 0.1]} color={WAINSCOT} rough={0.7} />
      <mesh position={[0, H / 2, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[W, H, 0.08]} />
        <meshPhysicalMaterial color="#9a4f6d" roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>
      {[H * 0.7, H * 0.28].map((y) => (
        <mesh key={y} position={[0, y, 0.066]}>
          <boxGeometry args={[W * 0.62, H * 0.3, 0.012]} />
          <meshStandardMaterial color="#7e3e58" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[W / 2 - 0.2, 1.05, 0.12]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial color="#e7b64b" metalness={1} roughness={0.2} />
      </mesh>
      {/* warm light leaking around the door */}
      <mesh position={[0, 0.02, 0.07]}>
        <boxGeometry args={[W + 0.02, 0.025, 0.01]} />
        <meshBasicMaterial color="#ffd49a" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.3, 0.6]} color="#ffc47a" intensity={1.2} distance={3} decay={2} />
    </group>
  );
}

