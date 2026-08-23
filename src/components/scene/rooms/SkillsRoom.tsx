"use client";

import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  SKILLS_SIZE,
  SKILLS_HALF,
  SKILLS_WALL_HEIGHT,
  SKILLS_ENTRANCE_Z,
  SKILLS_EXIT_WIDTH,
  SKILLS_EXIT_HEIGHT,
} from "./skillsLayout";
import { getCorridorDoorStand } from "@/components/scene/corridorLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { useNewspaperTexture } from "@/components/scene/textures/useNewspaperTexture";
import FramedWallPortrait from "@/components/scene/props/FramedWallPortrait";
import { TechTag } from "@/components/scene/props/techIcons";
import FloorLamp from "@/components/scene/props/FloorLamp";
import { WallSconce } from "@/components/scene/props/CorridorDecor";

const FLOOR_COLOR = "#1c1c24"; // Modern tech slate dark floor
const CEILING_COLOR = "#181820";
const WALL_TINT = "#ffffff";
const WOOD_DARK = "#242028";
const WOOD_MID = "#3a3644";
const BRASS = "#c9a34a";

function ExitDoor() {
  function handleExitClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const spawn = getCorridorDoorStand("skills");
    useSpaceStore.getState().requestTransition("corridor", spawn);
  }

  return (
    <group position={[0, 0, SKILLS_ENTRANCE_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, SKILLS_EXIT_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[SKILLS_EXIT_WIDTH + 0.2, SKILLS_EXIT_HEIGHT + 0.12, 0.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>

      <mesh
        position={[0, SKILLS_EXIT_HEIGHT / 2, 0.02]}
        onClick={handleExitClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[SKILLS_EXIT_WIDTH, SKILLS_EXIT_HEIGHT, 0.08]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>

      <mesh position={[0.55, 1.1, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      <group position={[0, SKILLS_EXIT_HEIGHT + 0.4, 0.06]}>
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

/** Front Wall (left of door): Workshop Manifesto Overview */
function WorkshopManifestoPortrait() {
  return (
    <FramedWallPortrait
      position={[-2.2, 2.15, SKILLS_HALF - 0.08]}
      rotation={[0, Math.PI, 0]}
      frameWidth={3.6}
      frameHeight={3.2}
      woodColor="#242028"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-7 border border-[var(--color-ink)]/30"
        style={{
          width: "440px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Room 02 &bull; Skills &amp; Stack</span>
          <span>Technical Arsenal</span>
        </div>

        <h1 className="font-[family-name:var(--font-bacley)] text-center text-4xl tracking-wide font-bold mb-1">
          THE WORKSHOP
        </h1>

        <p className="font-[family-name:var(--font-spirtush)] text-center text-base text-[var(--color-masthead)] italic mb-3">
          &ldquo;The right tools don&apos;t create great software. The right mindset does.&rdquo;
        </p>

        <div className="text-sm leading-relaxed text-[var(--color-ink)]/90 space-y-2.5 pt-2 border-t border-[var(--color-ink)]/20">
          <p className="font-[family-name:var(--font-bacley)] font-bold text-base text-[var(--color-ink)]">
            Engineering Precision &bull; Modern Stack
          </p>
          <p>
            From low-level data structures and algorithmic complexity to distributed backend
            services and autonomous generative AI agents — here are the core technologies I wield
            daily to engineer performant, reliable systems.
          </p>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Left Wall: Languages & Databases with Icons */
function LanguagesAndDatabasesPortrait() {
  return (
    <FramedWallPortrait
      position={[-SKILLS_HALF + 0.08, 2.15, 0]}
      rotation={[0, Math.PI / 2, 0]}
      frameWidth={4.0}
      frameHeight={3.2}
      woodColor="#242028"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-6 border border-[var(--color-ink)]/30"
        style={{
          width: "480px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[#a8791f] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Languages &amp; Persistence</span>
          <span>Core Stack</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-[family-name:var(--font-bacley)] text-lg tracking-wide mb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a8791f]" />
              Programming Languages
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {["Python", "C++", "JavaScript", "TypeScript", "SQL"].map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-ink)]/20">
            <h3 className="font-[family-name:var(--font-bacley)] text-lg tracking-wide mb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2c4a5e]" />
              Databases &amp; Vector Stores
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {["PostgreSQL", "SQLite", "ChromaDB", "Vector Databases", "Redis Cache"].map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Right Wall: Artificial Intelligence & Backend Systems with Icons */
function AiAndBackendPortrait() {
  return (
    <FramedWallPortrait
      position={[SKILLS_HALF - 0.08, 2.15, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      frameWidth={4.0}
      frameHeight={3.2}
      woodColor="#242028"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-6 border border-[var(--color-ink)]/30"
        style={{
          width: "480px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>AI &amp; Backend Engineering</span>
          <span>Core Domain</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-[family-name:var(--font-bacley)] text-lg tracking-wide mb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-masthead)]" />
              Artificial Intelligence &amp; RAG
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Retrieval-Augmented Generation",
                "LangChain",
                "Hugging Face",
                "Embedding Models",
                "Vector Search",
                "Prompt Engineering",
              ].map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-ink)]/20">
            <h3 className="font-[family-name:var(--font-bacley)] text-lg tracking-wide mb-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f6b45]" />
              Backend Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {["FastAPI", "RESTful APIs", "JWT Auth", "Async Pipelines", "Node.js"].map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Back Wall (centered): DevOps & CS Foundations with Icons — moved from front wall */
function FoundationsPortrait() {
  return (
    <FramedWallPortrait
      position={[0, 2.15, -SKILLS_HALF + 0.08]}
      frameWidth={4.4}
      frameHeight={3.2}
      woodColor="#242028"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-6 border border-[var(--color-ink)]/30"
        style={{
          width: "520px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>DevOps &amp; Foundations</span>
          <span>Engineering Toolkit</span>
        </div>

        <h3 className="font-[family-name:var(--font-bacley)] text-2xl tracking-wide font-bold mb-3">
          Tools &amp; Computer Science
        </h3>

        <div className="flex flex-wrap gap-2.5 mb-3">
          {["Git & GitHub", "Docker", "Linux", "VS Code", "Postman", "OOP", "Data Structures", "Algorithms"].map((t) => (
            <TechTag key={t} label={t} />
          ))}
        </div>

        <p className="font-[family-name:var(--font-spirtush)] text-sm text-[var(--color-ink)]/70 italic pt-2 border-t border-[var(--color-ink)]/20">
          &ldquo;Mastering fundamentals is the foundation of engineering excellence.&rdquo;
        </p>
      </div>
    </FramedWallPortrait>
  );
}

/** Developer Lab Workstation */
function LabWorkstation({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.06, 0.85]} />
        <meshStandardMaterial color="#22252c" roughness={0.4} metalness={0.4} />
      </mesh>

      {[-0.45, 0.45].map((mx, i) => (
        <group key={i} position={[mx, 1.1, -0.15]} rotation={[0, i === 0 ? 0.15 : -0.15, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.42, 0.02]} />
            <meshStandardMaterial color="#1a1c20" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.62, 0.38]} />
            <meshStandardMaterial
              color="#0d1b2a"
              emissive={i === 0 ? "#1b4965" : "#415a77"}
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0, -0.26, -0.05]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 10]} />
            <meshStandardMaterial color="#2d3138" metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Server Rack / Equipment Cabinet */
function ServerRack({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Cabinet body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.7, 2.2, 0.5]} />
        <meshStandardMaterial color="#1a1c22" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Front panel lines (rack slots) */}
      {[0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((y) => (
        <mesh key={y} position={[0, y, 0.26]}>
          <boxGeometry args={[0.6, 0.04, 0.01]} />
          <meshStandardMaterial color="#2d3138" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Status LEDs */}
      {[0.35, 0.65, 0.95, 1.25].map((y, i) => (
        <mesh key={y} position={[0.25, y, 0.27]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
            emissive={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Whiteboard Stand */
function WhiteboardStand({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Board */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.04]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.5} />
      </mesh>
      {/* Board frame */}
      <mesh position={[0, 1.6, -0.025]}>
        <boxGeometry args={[1.5, 1.1, 0.02]} />
        <meshStandardMaterial color="#2d3138" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Legs */}
      {[-0.55, 0.55].map((lx) => (
        <mesh key={lx} position={[lx, 0.8, -0.15]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 10]} />
          <meshStandardMaterial color="#2d3138" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Tray */}
      <mesh position={[0, 1.08, 0.03]}>
        <boxGeometry args={[1.0, 0.04, 0.08]} />
        <meshStandardMaterial color="#2d3138" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Modern Area Rug */
function SkillsRug() {
  return (
    <group position={[0, 0.006, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#1e1e2a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[4.6, 4.6]} />
        <meshStandardMaterial color="#28283a" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial color="#1a1a28" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function SkillsRoom() {
  const wallTexture = useNewspaperTexture();

  const walls: { x: number; z: number; rotY: number; width: number }[] = [
    { x: 0, z: -SKILLS_HALF, rotY: 0, width: SKILLS_SIZE },
    { x: -SKILLS_HALF, z: 0, rotY: Math.PI / 2, width: SKILLS_SIZE },
    { x: SKILLS_HALF, z: 0, rotY: -Math.PI / 2, width: SKILLS_SIZE },
    { x: 0, z: SKILLS_HALF, rotY: Math.PI, width: SKILLS_SIZE },
  ];

  return (
    <group>
      {/* Floor & Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[SKILLS_SIZE, SKILLS_SIZE]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, SKILLS_WALL_HEIGHT, 0]}>
        <planeGeometry args={[SKILLS_SIZE, SKILLS_SIZE]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Surrounding Walls */}
      {walls.map((w, i) => (
        <mesh key={i} position={[w.x, SKILLS_WALL_HEIGHT / 2, w.z]} rotation={[0, w.rotY, 0]} receiveShadow>
          <planeGeometry args={[w.width, SKILLS_WALL_HEIGHT]} />
          <meshStandardMaterial
            map={wallTexture ?? undefined}
            color={wallTexture ? WALL_TINT : "#ede8de"}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Lighting */}
      <ambientLight intensity={1.1} color="#f0f4fc" />
      <hemisphereLight args={["#f0f4fc", "#30303c", 0.7]} />
      <pointLight position={[0, 3.5, 0]} color="#d8e8f8" intensity={1.8} distance={10} decay={1.8} />

      {/* Area Rug */}
      <SkillsRug />

      {/* Framed Wall Portraits:
          Front Wall (left of door): Workshop Manifesto overview
          Left Wall: Languages & Databases
          Right Wall: AI & Backend
          Back Wall (centered): DevOps & Foundations */}
      <WorkshopManifestoPortrait />
      <LanguagesAndDatabasesPortrait />
      <AiAndBackendPortrait />
      <FoundationsPortrait />

      {/* Wall Sconces */}
      <WallSconce position={[-SKILLS_HALF + 0.05, 2.3, -2.2]} rotationY={Math.PI / 2} />
      <WallSconce position={[-SKILLS_HALF + 0.05, 2.3, 2.2]} rotationY={Math.PI / 2} />
      <WallSconce position={[SKILLS_HALF - 0.05, 2.3, -2.2]} rotationY={-Math.PI / 2} />
      <WallSconce position={[SKILLS_HALF - 0.05, 2.3, 2.2]} rotationY={-Math.PI / 2} />
      {/* Back wall sconces */}
      <WallSconce position={[-2.2, 2.3, -SKILLS_HALF + 0.05]} rotationY={0} />
      <WallSconce position={[2.2, 2.3, -SKILLS_HALF + 0.05]} rotationY={0} />

      {/* Developer Workstation */}
      <LabWorkstation position={[0, 0, -2.2]} />

      {/* Server Racks against back wall sides */}
      <ServerRack position={[-3.2, 0, -SKILLS_HALF + 0.35]} />
      <ServerRack position={[3.2, 0, -SKILLS_HALF + 0.35]} />

      {/* Whiteboard on left wall area */}
      <WhiteboardStand position={[-2.8, 0, 1.5]} rotationY={Math.PI / 4} />

      {/* Floor Lamps — all four corners */}
      <FloorLamp x={-SKILLS_HALF + 0.75} z={-SKILLS_HALF + 0.75} />
      <FloorLamp x={SKILLS_HALF - 0.75} z={-SKILLS_HALF + 0.75} />
      <FloorLamp x={-SKILLS_HALF + 0.75} z={SKILLS_HALF - 0.75} />
      <FloorLamp x={SKILLS_HALF - 0.75} z={SKILLS_HALF - 0.75} />

      {/* Exit Door */}
      <ExitDoor />
    </group>
  );
}
