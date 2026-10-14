"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { TbHome, TbTool, TbBox, TbUser, TbCompass } from "react-icons/tb";

const WOOD_DARK = "#2e1e12";
const WOOD_OAK = "#4a3525";
const BRASS = "#c9a34a";
const MARBLE_WHITE = "#e8e4dc";

/**
 * Modern entryway console table with brass legs, marble top, and decor accessories.
 */
export function ConsoleTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Marble Tabletop */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 0.55]} />
        <meshStandardMaterial color={MARBLE_WHITE} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Wooden Sub-frame */}
      <mesh position={[0, 0.79, 0]}>
        <boxGeometry args={[1.7, 0.06, 0.48]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>

      {/* Brass Hairpin Legs */}
      {[
        [-0.8, 0.39, -0.2],
        [0.8, 0.39, -0.2],
        [-0.8, 0.39, 0.2],
        [0.8, 0.39, 0.2],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.78, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* Decorative Ceramic Bowl */}
      <mesh position={[-0.45, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#3a4a42" roughness={0.5} />
      </mesh>

      {/* Stacked Architecture Books */}
      <mesh position={[0.4, 0.9, 0.02]} rotation={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.32, 0.04, 0.24]} />
        <meshStandardMaterial color="#7a2620" roughness={0.8} />
      </mesh>
      <mesh position={[0.4, 0.93, 0.02]} rotation={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.28, 0.03, 0.22]} />
        <meshStandardMaterial color="#2c4a5e" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Modern House Directory & Tour Itinerary Plaque mounted in the corridor.
 */
export function HouseItineraryPlaque({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[2.4, 1.8, 0.06]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[2.3, 1.7, 0.02]} />
        <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* High-DPI HTML Plaque Surface */}
      <Html
        position={[0, 0, 0.03]}
        transform
        scale={0.5}
        distanceFactor={4}
        center
        occlude
        zIndexRange={[10, 0]}
        style={{
          WebkitFontSmoothing: "antialiased",
          pointerEvents: "none",
        }}
      >
        <div
          className="bg-[var(--color-paper)] text-[var(--color-ink)] select-none p-5 border border-[var(--color-ink)]/30"
          style={{
            width: "440px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            // Counter the Html scale so the panel stays the same physical
            // size while its text is rasterized more sharply.
            transform: "scale(2)",
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between border-b-2 border-[var(--color-masthead)] pb-2 mb-3">
            <div className="flex items-center gap-2">
              <TbCompass className="text-[var(--color-masthead)] text-xl" />
              <span className="font-[family-name:var(--font-bacley)] tracking-widest text-xs uppercase text-[var(--color-masthead)] font-bold">
                House Tour &bull; Directory
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-[var(--color-ink)]/60 font-mono">
              EST. 2025
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-bacley)] text-lg tracking-wide text-center mb-1">
            MAHANDAR KUMAR&apos;S RESIDENCE
          </h3>
          <p className="font-[family-name:var(--font-spirtush)] text-xs text-center text-[var(--color-ink)]/75 italic mb-3">
            &ldquo;Step into each room to explore my journey, skills, &amp; craft.&rdquo;
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/15 rounded">
              <TbHome className="text-[#a8791f] text-base shrink-0" />
              <div>
                <p className="font-[family-name:var(--font-bacley)] font-bold text-[11px] leading-tight">ROOM 01 &bull; HOME</p>
                <p className="text-[9px] text-[var(--color-ink)]/70">Welcome &amp; Identity</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/15 rounded">
              <TbTool className="text-[#2c4a5e] text-base shrink-0" />
              <div>
                <p className="font-[family-name:var(--font-bacley)] font-bold text-[11px] leading-tight">ROOM 02 &bull; SKILLS</p>
                <p className="text-[9px] text-[var(--color-ink)]/70">The Tech Workshop</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/15 rounded">
              <TbBox className="text-[#7a2620] text-base shrink-0" />
              <div>
                <p className="font-[family-name:var(--font-bacley)] font-bold text-[11px] leading-tight">ROOM 03 &bull; PROJECTS</p>
                <p className="text-[9px] text-[var(--color-ink)]/70">Featured Works Gallery</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/15 rounded">
              <TbUser className="text-[#3f6b45] text-base shrink-0" />
              <div>
                <p className="font-[family-name:var(--font-bacley)] font-bold text-[11px] leading-tight">ROOM 04 &bull; ABOUT</p>
                <p className="text-[9px] text-[var(--color-ink)]/70">Bio, Contact &amp; Resume</p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[var(--color-ink)]/20 text-[10px] text-center text-[var(--color-ink)]/60 font-mono">
            Navigation: Click Doors / WASD to Walk / Menu Bar Below
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Luxury modern corridor runner rug with woven borders.
 */
export function CorridorRunnerRug({ length = 24 }: { length?: number }) {
  return (
    <group position={[0, 0.005, -1]}>
      {/* Main Runner Body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, length]} />
        <meshStandardMaterial color="#4a1512" roughness={0.9} />
      </mesh>
      {/* Outer Border Trim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[1.65, length - 0.3]} />
        <meshStandardMaterial color="#6a221d" roughness={0.85} />
      </mesh>
      {/* Center Gold Floral/Geometric Inner Band */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[1.3, length - 0.8]} />
        <meshStandardMaterial color="#8a2e26" roughness={0.8} />
      </mesh>
      {/* Accent Gold Stripe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <planeGeometry args={[0.08, length - 1.2]} />
        <meshStandardMaterial color="#c9a34a" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Modern architectural up/down wall sconce fixture.
 */
export function WallSconce({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wall Mounting Plate */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.1, 0.35, 0.03]} />
        <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Sconce Tube Housing */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.04, 0.04, 0.42, 16]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Top and Bottom Glowing Emitters */}
      <mesh position={[0, 0.22, 0.08]}>
        <cylinderGeometry args={[0.038, 0.038, 0.04, 16]} />
        <meshStandardMaterial color="#ffe8b8" emissive="#ffb866" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, -0.22, 0.08]}>
        <cylinderGeometry args={[0.038, 0.038, 0.04, 16]} />
        <meshStandardMaterial color="#ffe8b8" emissive="#ffb866" emissiveIntensity={3} />
      </mesh>
      {/* Warm Point Light for realistic up/down illumination */}
      <pointLight position={[0, 0, 0.2]} color="#ffad5a" intensity={1.6} distance={5} decay={2} />
    </group>
  );
}

/**
 * Modern indoor potted houseplant (fiddle-leaf / monstera) in a ceramic planter.
 */
export function PottedPlant({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(
    () => [
      { y: 0.7, rot: [0.3, 0, -0.4], scale: [0.22, 0.35, 0.01] },
      { y: 0.85, rot: [-0.4, 1.2, 0.3], scale: [0.25, 0.4, 0.01] },
      { y: 1.0, rot: [0.2, 2.4, -0.3], scale: [0.28, 0.45, 0.01] },
      { y: 1.15, rot: [-0.3, 3.8, 0.4], scale: [0.26, 0.42, 0.01] },
      { y: 1.3, rot: [0.1, 5.0, -0.2], scale: [0.24, 0.38, 0.01] },
    ],
    []
  );

  return (
    <group position={position}>
      {/* Wooden Plant Stand */}
      {[
        [-0.15, 0.15, -0.15],
        [0.15, 0.15, -0.15],
        [-0.15, 0.15, 0.15],
        [0.15, 0.15, 0.15],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 10]} />
          <meshStandardMaterial color={WOOD_OAK} roughness={0.7} />
        </mesh>
      ))}

      {/* Ceramic Planter Pot */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.44, 20]} />
        <meshStandardMaterial color="#f0eee8" roughness={0.4} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#2c1d14" roughness={0.95} />
      </mesh>

      {/* Plant Stem */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.8, 10]} />
        <meshStandardMaterial color="#2d4a2d" roughness={0.8} />
      </mesh>

      {/* Lush Green Foliage */}
      {leaves.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0]} rotation={l.rot as [number, number, number]} castShadow>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#245c32" : "#2f723f"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Modern corridor bench for upscale residential aesthetic.
 */
export function EntrywayBench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Padded Seat Cushion */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[1.5, 0.12, 0.5]} />
        <meshStandardMaterial color="#30443d" roughness={0.8} />
      </mesh>
      {/* Wooden Base Frame */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.46, 0.06, 0.46]} />
        <meshStandardMaterial color={WOOD_OAK} roughness={0.7} />
      </mesh>
      {/* Brass Tapered Legs */}
      {[
        [-0.65, 0.18, -0.18],
        [0.65, 0.18, -0.18],
        [-0.65, 0.18, 0.18],
        [0.65, 0.18, 0.18],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.02, 0.015, 0.36, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Architectural ceiling cross-beams with recessed downlights.
 */
export function CeilingBeams({
  positions,
  width = 6,
}: {
  positions: number[];
  width?: number;
}) {
  return (
    <group>
      {positions.map((z) => (
        <group key={z} position={[0, 3.9, z]}>
          {/* Wood Cross Beam */}
          <mesh castShadow>
            <boxGeometry args={[width, 0.18, 0.32]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
          </mesh>
          {/* Recessed Downlight Fixture */}
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
            <meshStandardMaterial color="#fff4e0" emissive="#ffcc88" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
