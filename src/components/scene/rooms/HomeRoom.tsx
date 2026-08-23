"use client";

import { useEffect, useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  HOME_SIZE,
  HOME_HALF,
  HOME_WALL_HEIGHT,
  HOME_ENTRANCE_Z,
  HOME_EXIT_WIDTH,
  HOME_EXIT_HEIGHT,
} from "./homeLayout";
import { getCorridorDoorStand } from "@/components/scene/corridorLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { useNewspaperTexture } from "@/components/scene/textures/useNewspaperTexture";
import FramedWallPortrait from "@/components/scene/props/FramedWallPortrait";
import FloorLamp from "@/components/scene/props/FloorLamp";
import { WallSconce } from "@/components/scene/props/CorridorDecor";
import { useTypewriter } from "@/lib/useTypewriter";
import { playTypingSound } from "@/lib/typingSound";

const FLOOR_COLOR = "#221c16";
const CEILING_COLOR = "#1c1813";
const WALL_TINT = "#ffffff";
const WOOD_DARK = "#2e1e12";
const WOOD_MID = "#4a3525";
const BRASS = "#c9a34a";
const NAME = "MAHANDAR KUMAR";
const TYPE_SPEED_MS = 65;

function ExitDoor() {
  function handleExitClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const spawn = getCorridorDoorStand("home");
    useSpaceStore.getState().requestTransition("corridor", spawn);
  }

  return (
    <group position={[0, 0, HOME_ENTRANCE_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      {/* Wooden Frame */}
      <mesh position={[0, HOME_EXIT_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[HOME_EXIT_WIDTH + 0.2, HOME_EXIT_HEIGHT + 0.12, 0.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>

      <mesh
        position={[0, HOME_EXIT_HEIGHT / 2, 0.02]}
        onClick={handleExitClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[HOME_EXIT_WIDTH, HOME_EXIT_HEIGHT, 0.08]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>

      {/* Brass Knob */}
      <mesh position={[0.55, 1.1, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Exit Sign */}
      <group position={[0, HOME_EXIT_HEIGHT + 0.4, 0.06]}>
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

/** Back Wall: Main Welcome & Identity Framed Portrait */
function MainIdentityPortrait() {
  const typedName = useTypewriter(NAME, TYPE_SPEED_MS);
  const soundStarted = useRef(false);

  useEffect(() => {
    if (!soundStarted.current) {
      soundStarted.current = true;
      playTypingSound(NAME.length * TYPE_SPEED_MS);
    }
  }, []);

  return (
    <FramedWallPortrait
      position={[0, 2.15, -HOME_HALF + 0.08]}
      frameWidth={4.8}
      frameHeight={3.4}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-8 border border-[var(--color-ink)]/30"
        style={{
          width: "560px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-[0.25em] uppercase text-[var(--color-ink)]/60 pb-2 border-b border-[var(--color-ink)]/25">
          <span className="font-[family-name:var(--font-bacley)] font-bold text-[var(--color-masthead)]">
            Room 01 &bull; Executive Suite
          </span>
          <span className="font-mono text-[10px]">Personal Dispatch No. 01</span>
        </div>

        <p className="font-[family-name:var(--font-spirtush)] text-center text-[var(--color-masthead)] pt-4 text-lg italic">
          &ldquo;Every great product starts with a bold question.&rdquo;
        </p>

        <h1 className="font-[family-name:var(--font-bacley)] text-center text-4xl tracking-wider pt-2 font-bold whitespace-nowrap">
          {typedName}
          <span className="animate-pulse text-[var(--color-masthead)]">|</span>
        </h1>

        <p className="text-center text-sm tracking-widest uppercase text-[var(--color-ink)]/75 pt-1 pb-3 border-b-2 border-[var(--color-ink)] font-semibold">
          AI Engineer &bull; Full-Stack Developer &bull; Systems Thinker
        </p>

        <div className="pt-4 text-sm leading-relaxed space-y-2 text-[var(--color-ink)]/90">
          <p className="font-[family-name:var(--font-bacley)] font-bold text-base text-[var(--color-ink)]">
            Welcome to my creative workspace.
          </p>
          <p>
            I am a Computer Science student dedicated to architecting scalable backend systems,
            autonomous AI agents, and intuitive multimodal applications that deliver real impact.
          </p>
          <p>
            Every room in this residence reflects a pillar of my journey. Explore the workshop tools,
            exhibition projects, and engineering mindset behind my work.
          </p>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Left Wall: Engineering Philosophy Framed Portrait */
function PhilosophyPortrait() {
  return (
    <FramedWallPortrait
      position={[-HOME_HALF + 0.08, 2.15, 0]}
      rotation={[0, Math.PI / 2, 0]}
      frameWidth={3.8}
      frameHeight={3.2}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-7 border border-[var(--color-ink)]/30"
        style={{
          width: "480px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Foundations &bull; Mindset</span>
          <span>Core Values</span>
        </div>

        <h2 className="font-[family-name:var(--font-bacley)] text-3xl tracking-wide mb-2">
          Engineering Philosophy
        </h2>

        <div className="space-y-3 text-sm leading-relaxed text-[var(--color-ink)]/85">
          <div className="p-2.5 bg-[var(--color-ink)]/5 border-l-2 border-[var(--color-masthead)]">
            <p className="font-bold text-[var(--color-ink)] text-[11px] mb-0.5">1. Precision &amp; Robust Architecture</p>
            <p className="text-[10.5px]">Build software that remains resilient, testable, and maintainable under scale.</p>
          </div>

          <div className="p-2.5 bg-[var(--color-ink)]/5 border-l-2 border-[#a8791f]">
            <p className="font-bold text-[var(--color-ink)] text-[11px] mb-0.5">2. Practical AI Integration</p>
            <p className="text-[10.5px]">Harness RAG pipelines and vector intelligence to solve genuine, domain-specific challenges.</p>
          </div>

          <div className="p-2.5 bg-[var(--color-ink)]/5 border-l-2 border-[#2c4a5e]">
            <p className="font-bold text-[var(--color-ink)] text-[11px] mb-0.5">3. Continuous Curiosity</p>
            <p className="text-[10.5px]">Master modern frameworks, optimize algorithms, and turn complex theory into clean code.</p>
          </div>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Right Wall: Current Focus & Objectives Framed Portrait */
function FocusPortrait() {
  return (
    <FramedWallPortrait
      position={[HOME_HALF - 0.08, 2.15, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      frameWidth={3.8}
      frameHeight={3.2}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-7 border border-[var(--color-ink)]/30"
        style={{
          width: "480px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Roadmap &bull; 2025</span>
          <span>Active R&amp;D</span>
        </div>

        <h2 className="font-[family-name:var(--font-bacley)] text-3xl tracking-wide mb-2">
          Current Focus Areas
        </h2>

        <div className="grid grid-cols-2 gap-2 text-sm pt-1">
          <div className="p-2.5 bg-[#f5f0e6] border border-[var(--color-ink)]/20 rounded">
            <p className="font-bold text-[var(--color-masthead)] text-[11px]">RAG &amp; Vector Search</p>
            <p className="text-[10px] text-[var(--color-ink)]/75 mt-0.5">ChromaDB, hybrid retrieval, embeddings &amp; agentic memory.</p>
          </div>

          <div className="p-2.5 bg-[#f5f0e6] border border-[var(--color-ink)]/20 rounded">
            <p className="font-bold text-[#a8791f] text-[11px]">Backend Microservices</p>
            <p className="text-[10px] text-[var(--color-ink)]/75 mt-0.5">FastAPI, asynchronous pipelines, SQL optimization &amp; auth.</p>
          </div>

          <div className="p-2.5 bg-[#f5f0e6] border border-[var(--color-ink)]/20 rounded">
            <p className="font-bold text-[#2c4a5e] text-[11px]">Autonomous Agents</p>
            <p className="text-[10px] text-[var(--color-ink)]/75 mt-0.5">LangGraph workflows, tool invocation &amp; browser automation.</p>
          </div>

          <div className="p-2.5 bg-[#f5f0e6] border border-[var(--color-ink)]/20 rounded">
            <p className="font-bold text-[#3f6b45] text-[11px]">Full-Stack 3D Web</p>
            <p className="text-[10px] text-[var(--color-ink)]/75 mt-0.5">Three.js, React Three Fiber &amp; immersive web experiences.</p>
          </div>
        </div>

        <p className="font-[family-name:var(--font-spirtush)] text-center text-xs text-[var(--color-ink)]/70 italic mt-4 pt-2 border-t border-[var(--color-ink)]/20">
          &ldquo;Building software that bridges intelligent reasoning with robust execution.&rdquo;
        </p>
      </div>
    </FramedWallPortrait>
  );
}

/** Executive Study Desk */
function StudyDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.08, 0.95]} />
        <meshStandardMaterial color="#3c2a1c" roughness={0.6} />
      </mesh>

      {[
        [-0.95, 0.38, -0.38],
        [0.95, 0.38, -0.38],
        [-0.95, 0.38, 0.38],
        [0.95, 0.38, 0.38],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.025, 0.02, 0.76, 12]} />
          <meshStandardMaterial color={BRASS} metalness={0.75} roughness={0.3} />
        </mesh>
      ))}

      {/* Laptop */}
      <group position={[0, 0.81, 0.05]}>
        <mesh position={[0, 0.008, 0]} castShadow>
          <boxGeometry args={[0.42, 0.015, 0.28]} />
          <meshStandardMaterial color="#2d3136" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.16, -0.13]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.28, 0.015]} />
          <meshStandardMaterial color="#1e2226" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.16, -0.12]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[0.39, 0.25]} />
          <meshStandardMaterial color="#1e3a4c" emissive="#2d5c7c" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Desk Lamp */}
      <group position={[-0.7, 0.81, -0.2]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.02, 16]} />
          <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.38, 10]} />
          <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.38, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.09, 0.16, 16]} />
          <meshStandardMaterial color="#2e1e12" roughness={0.6} />
        </mesh>
        <pointLight position={[0.1, 0.34, 0]} color="#ffe0b2" intensity={1.4} distance={4} decay={2} />
      </group>
    </group>
  );
}

/** Luxury Area Rug */
function RoomRug({ size = [4.8, 4.8] }: { size?: [number, number] }) {
  return (
    <group position={[0, 0.006, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#38251e" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[size[0] - 0.3, size[1] - 0.3]} />
        <meshStandardMaterial color="#4e3328" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[size[0] - 0.6, size[1] - 0.6]} />
        <meshStandardMaterial color="#2d1c16" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function HomeRoom() {
  const wallTexture = useNewspaperTexture();

  const walls: { x: number; z: number; rotY: number; width: number }[] = [
    { x: 0, z: -HOME_HALF, rotY: 0, width: HOME_SIZE },
    { x: -HOME_HALF, z: 0, rotY: Math.PI / 2, width: HOME_SIZE },
    { x: HOME_HALF, z: 0, rotY: -Math.PI / 2, width: HOME_SIZE },
    { x: 0, z: HOME_HALF, rotY: Math.PI, width: HOME_SIZE },
  ];

  return (
    <group>
      {/* Floor & Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HOME_SIZE, HOME_SIZE]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HOME_WALL_HEIGHT, 0]}>
        <planeGeometry args={[HOME_SIZE, HOME_SIZE]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Surrounding Walls */}
      {walls.map((w, i) => (
        <mesh key={i} position={[w.x, HOME_WALL_HEIGHT / 2, w.z]} rotation={[0, w.rotY, 0]} receiveShadow>
          <planeGeometry args={[w.width, HOME_WALL_HEIGHT]} />
          <meshStandardMaterial
            map={wallTexture ?? undefined}
            color={wallTexture ? WALL_TINT : "#ede8de"}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Lighting */}
      <ambientLight intensity={1.05} color="#fff6ea" />
      <hemisphereLight args={["#fff8ed", "#4a3525", 0.7]} />
      <pointLight position={[0, 3.6, 0]} color="#ffe4c4" intensity={1.8} distance={10} decay={1.8} />

      {/* Area Rug */}
      <RoomRug size={[5.2, 5.2]} />

      {/* Framed Wall Portraits on surrounding walls */}
      <MainIdentityPortrait />
      <PhilosophyPortrait />
      <FocusPortrait />

      {/* Wall Sconces */}
      <WallSconce position={[-HOME_HALF + 0.05, 2.4, -2.4]} rotationY={Math.PI / 2} />
      <WallSconce position={[-HOME_HALF + 0.05, 2.4, 2.4]} rotationY={Math.PI / 2} />
      <WallSconce position={[HOME_HALF - 0.05, 2.4, -2.4]} rotationY={-Math.PI / 2} />
      <WallSconce position={[HOME_HALF - 0.05, 2.4, 2.4]} rotationY={-Math.PI / 2} />

      {/* Executive Desk */}
      <StudyDesk position={[0, 0, -2.4]} />

      {/* Standing Floor Lamps in corners */}
      <FloorLamp x={-HOME_HALF + 0.75} z={-HOME_HALF + 0.75} />
      <FloorLamp x={HOME_HALF - 0.75} z={-HOME_HALF + 0.75} />

      {/* Exit Door */}
      <ExitDoor />
    </group>
  );
}
