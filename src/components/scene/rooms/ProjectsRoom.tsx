"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import {
  PROJECTS_SIZE,
  PROJECTS_HALF,
  PROJECTS_WALL_HEIGHT,
  PROJECTS_ENTRANCE_Z,
  PROJECTS_EXIT_WIDTH,
  PROJECTS_EXIT_HEIGHT,
} from "./projectsLayout";
import { PROJECTS, type ProjectEntry } from "./projectsData";
import { getCorridorDoorStand } from "@/components/scene/corridorLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { useProjectTankStore } from "@/store/projectTankStore";
import { useNewspaperTexture } from "@/components/scene/textures/useNewspaperTexture";
import FloorLamp from "@/components/scene/props/FloorLamp";
import { WallSconce } from "@/components/scene/props/CorridorDecor";

const FLOOR_COLOR = "#1a1612";
const CEILING_COLOR = "#181410";
const WALL_TINT = "#ffffff";
const WOOD_DARK = "#2e1e12";
const WOOD_MID = "#4a3525";
const GOLD = "#c9a34a";
const BRASS = "#c9a34a";

// Gem colors for each project chest
const GEM_COLORS = ["#7a2620", "#3f6b45", "#2c4a5e", "#a8791f", "#5c2c4a", "#1f6b6b"];

// Row of 6 project chests along the back wall
const ROW_X = [-4.4, -2.64, -0.88, 0.88, 2.64, 4.4];

function ExitDoor() {
  function handleExitClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const spawn = getCorridorDoorStand("projects");
    useSpaceStore.getState().requestTransition("corridor", spawn);
  }

  return (
    <group position={[0, 0, PROJECTS_ENTRANCE_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, PROJECTS_EXIT_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[PROJECTS_EXIT_WIDTH + 0.2, PROJECTS_EXIT_HEIGHT + 0.12, 0.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>

      <mesh
        position={[0, PROJECTS_EXIT_HEIGHT / 2, 0.02]}
        onClick={handleExitClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[PROJECTS_EXIT_WIDTH, PROJECTS_EXIT_HEIGHT, 0.08]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>

      <mesh position={[0.55, 1.1, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      <group position={[0, PROJECTS_EXIT_HEIGHT + 0.4, 0.06]}>
        <mesh>
          <boxGeometry args={[1.1, 0.32, 0.04]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.0, 0.24]} />
          <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.94, 0.2]} />
          <meshStandardMaterial color="#1a1714" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function TitleFrame() {
  return (
    <group position={[0, 3.35, -PROJECTS_HALF + 0.08]}>
      <mesh>
        <boxGeometry args={[3.8, 1.3, 0.08]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[3.6, 1.1, 0.04]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function GalleryTitle() {
  return (
    <Html
      position={[0, 3.35, -PROJECTS_HALF + 0.15]}
      transform
      distanceFactor={3.2}
      prepend
      center
      occlude
      zIndexRange={[10, 0]}
      style={{ WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" }}
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] select-none px-8 py-3.5 border border-[var(--color-ink)]/30 text-center"
        style={{ boxShadow: "0 12px 36px rgba(0,0,0,0.5)", transform: "scale(1.15)", transformOrigin: "center center" }}
      >
        <p className="font-[family-name:var(--font-spirtush)] text-sm uppercase tracking-widest text-[var(--color-masthead)] font-bold mb-1">
          Exhibition Gallery &bull; Click to Explore
        </p>
        <h2
          className="font-[family-name:var(--font-bacley)] tracking-wider whitespace-nowrap font-bold text-3xl"
        >
          THE PROJECTS VAULT
        </h2>
      </div>
    </Html>
  );
}

/** Area Rug for the Projects Room */
function ProjectsRug() {
  return (
    <group position={[0, 0.006, 1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#2e1e14" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[7.6, 4.6]} />
        <meshStandardMaterial color="#3e2c1e" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[7.2, 4.2]} />
        <meshStandardMaterial color="#2a1a12" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Decorative Display Pedestal */
function DisplayPedestal({ position, color = WOOD_DARK }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 1.0, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Top platform */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Decorative sphere on top */}
      <mesh position={[0, 1.26, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Original Treasure Chest "Tank" with Domed Lid, Gold Banding & Spinning Glowing Gem */
function ProjectChest({
  project,
  x,
  gem,
}: {
  project: ProjectEntry;
  x: number;
  gem: string;
}) {
  const gemRef = useRef<THREE.Mesh>(null);
  const isOpen = useProjectTankStore((s) => s.openId === project.id);

  useFrame((_, delta) => {
    if (gemRef.current) gemRef.current.rotation.y += delta * 0.8;
  });

  function handleOpen(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    useProjectTankStore.getState().open(project.id);
  }

  const z = -PROJECTS_HALF + 0.9;

  return (
    <group position={[x, 0, z]}>
      {/* Chest Body */}
      <mesh
        position={[0, 0.45, 0]}
        onClick={handleOpen}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[1.15, 0.9, 0.85]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
      </mesh>

      {/* Domed Lid */}
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.425, 0.425, 1.15, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>

      {/* Gold Banding */}
      {[-0.5, 0, 0.5].map((bx) => (
        <mesh key={bx} position={[bx, 0.45, 0]}>
          <boxGeometry args={[0.05, 0.92, 0.87]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Corner Brackets */}
      {[-0.52, 0.52].map((bx) =>
        [0.05, 0.85].map((by) => (
          <mesh key={`${bx}-${by}`} position={[bx, by, 0.44]}>
            <boxGeometry args={[0.14, 0.14, 0.03]} />
            <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Glowing Spinning Gem */}
      <mesh ref={gemRef} position={[0, 0.45, 0.46]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={gem} emissive={gem} emissiveIntensity={isOpen ? 1.5 : 0.85} />
      </mesh>

      {/* Billboard Nameplate above chest */}
      <Billboard position={[0, 1.55, 0]}>
        <Html
          center
          distanceFactor={3.5}
          prepend
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none", WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" }}
        >
          <div className="font-[family-name:var(--font-bacley)] font-bold text-sm tracking-wider px-3 py-1.5 bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-ink)]/30 rounded shadow-md whitespace-nowrap select-none">
            {project.name}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

export default function ProjectsRoom() {
  const wallTexture = useNewspaperTexture();

  const walls: { x: number; z: number; rotY: number; width: number }[] = [
    { x: 0, z: -PROJECTS_HALF, rotY: 0, width: PROJECTS_SIZE },
    { x: -PROJECTS_HALF, z: 0, rotY: Math.PI / 2, width: PROJECTS_SIZE },
    { x: PROJECTS_HALF, z: 0, rotY: -Math.PI / 2, width: PROJECTS_SIZE },
    { x: 0, z: PROJECTS_HALF, rotY: Math.PI, width: PROJECTS_SIZE },
  ];

  return (
    <group>
      {/* Floor & Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[PROJECTS_SIZE, PROJECTS_SIZE]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, PROJECTS_WALL_HEIGHT, 0]}>
        <planeGeometry args={[PROJECTS_SIZE, PROJECTS_SIZE]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Surrounding Walls */}
      {walls.map((w, i) => (
        <mesh key={i} position={[w.x, PROJECTS_WALL_HEIGHT / 2, w.z]} rotation={[0, w.rotY, 0]} receiveShadow>
          <planeGeometry args={[w.width, PROJECTS_WALL_HEIGHT]} />
          <meshStandardMaterial
            map={wallTexture ?? undefined}
            color={wallTexture ? WALL_TINT : "#ede8de"}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Bright Gallery Lighting */}
      <ambientLight intensity={1.15} color="#fff6ea" />
      <hemisphereLight args={["#fff8ed", "#4a3525", 0.75]} />
      <pointLight position={[-3, 3.8, 0]} color="#ffe4c4" intensity={1.5} distance={11} decay={1.7} />
      <pointLight position={[3, 3.8, 0]} color="#ffe4c4" intensity={1.5} distance={11} decay={1.7} />
      <pointLight position={[0, 3.8, 2]} color="#ffe4c4" intensity={1.2} distance={11} decay={1.7} />

      {/* Vault Title */}
      <TitleFrame />
      <GalleryTitle />

      {/* Area Rug */}
      <ProjectsRug />

      {/* Row of 6 Project Chests */}
      {ROW_X.map((x, i) => (
        <ProjectChest
          key={PROJECTS[i].id}
          project={PROJECTS[i]}
          x={x}
          gem={GEM_COLORS[i % GEM_COLORS.length]}
        />
      ))}

      {/* Display Pedestals along side walls */}
      <DisplayPedestal position={[-PROJECTS_HALF + 0.6, 0, -2]} />
      <DisplayPedestal position={[-PROJECTS_HALF + 0.6, 0, 2]} />
      <DisplayPedestal position={[PROJECTS_HALF - 0.6, 0, -2]} />
      <DisplayPedestal position={[PROJECTS_HALF - 0.6, 0, 2]} />

      {/* Standing Floor Lamps in corners */}
      <FloorLamp x={-PROJECTS_HALF + 0.65} z={-3.8} />
      <FloorLamp x={PROJECTS_HALF - 0.65} z={-3.8} />
      <FloorLamp x={-PROJECTS_HALF + 0.65} z={3.8} />
      <FloorLamp x={PROJECTS_HALF - 0.65} z={3.8} />

      {/* Wall Sconces */}
      <WallSconce position={[-PROJECTS_HALF + 0.05, 2.3, -2.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[-PROJECTS_HALF + 0.05, 2.3, 2.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[PROJECTS_HALF - 0.05, 2.3, -2.5]} rotationY={-Math.PI / 2} />
      <WallSconce position={[PROJECTS_HALF - 0.05, 2.3, 2.5]} rotationY={-Math.PI / 2} />

      {/* Exit Door */}
      <ExitDoor />
    </group>
  );
}

