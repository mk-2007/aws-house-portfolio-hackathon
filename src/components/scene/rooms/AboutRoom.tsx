"use client";

import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  ABOUT_SIZE,
  ABOUT_HALF,
  ABOUT_WALL_HEIGHT,
  ABOUT_ENTRANCE_Z,
  ABOUT_EXIT_WIDTH,
  ABOUT_EXIT_HEIGHT,
} from "./aboutLayout";
import { getCorridorDoorStand } from "@/components/scene/corridorLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { useNewspaperTexture } from "@/components/scene/textures/useNewspaperTexture";
import FramedWallPortrait from "@/components/scene/props/FramedWallPortrait";
import FloorLamp from "@/components/scene/props/FloorLamp";
import { WallSconce } from "@/components/scene/props/CorridorDecor";
import { TbDownload, TbMail, TbBrandGithub, TbBrandLinkedin, TbCode, TbFileText, TbExternalLink } from "react-icons/tb";

const FLOOR_COLOR = "#221a14"; // Warm mahogany library dark floor
const CEILING_COLOR = "#1c1510";
const WALL_TINT = "#ffffff";
const WOOD_DARK = "#2e1e12";
const WOOD_MID = "#4a3525";
const BRASS = "#c9a34a";
const DESK_COLOR = "#422f20";

function ExitDoor() {
  function handleExitClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const spawn = getCorridorDoorStand("about");
    useSpaceStore.getState().requestTransition("corridor", spawn);
  }

  return (
    <group position={[0, 0, ABOUT_ENTRANCE_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      {/* Wooden Frame */}
      <mesh position={[0, ABOUT_EXIT_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[ABOUT_EXIT_WIDTH + 0.2, ABOUT_EXIT_HEIGHT + 0.12, 0.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>

      <mesh
        position={[0, ABOUT_EXIT_HEIGHT / 2, 0.02]}
        onClick={handleExitClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[ABOUT_EXIT_WIDTH, ABOUT_EXIT_HEIGHT, 0.08]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>

      {/* Brass Knob */}
      <mesh position={[0.55, 1.1, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Exit Sign */}
      <group position={[0, ABOUT_EXIT_HEIGHT + 0.4, 0.06]}>
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

/** Main About panel on the room's presentation wall, opposite the exit. */
function AboutMePortrait() {
  return (
    <FramedWallPortrait
      position={[0, 2.15, -ABOUT_HALF + 0.08]}
      frameWidth={3.6}
      frameHeight={3.2}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-7 border border-[var(--color-ink)]/30"
        style={{
          width: "440px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Room 04 &bull; Biography</span>
          <span>The Developer</span>
        </div>

        <h1 className="font-[family-name:var(--font-bacley)] text-3xl font-bold tracking-wide mb-1">
          ABOUT MAHANDAR
        </h1>

        <p className="font-[family-name:var(--font-spirtush)] text-sm text-[var(--color-masthead)] italic mb-3">
          &ldquo;Passionate about turning curiosity into resilient, impactful software.&rdquo;
        </p>

        <div className="text-sm leading-relaxed text-[var(--color-ink)]/90 space-y-2.5 pt-2 border-t border-[var(--color-ink)]/20">
          <p>
            Whether it&apos;s architecting intelligent RAG agents, designing high-throughput backend services,
            or solving competitive programming challenges, I am constantly exploring the bleeding edge
            of artificial intelligence and scalable software engineering.
          </p>
          <p>
            This 3D house portfolio represents that same core ethos: crafting immersive, thoughtful digital
            spaces that communicate both technical depth and attention to visual excellence.
          </p>
          <p>
            I am always eager to collaborate on ambitious AI systems, high-scale web platforms, and innovative
            engineering endeavors.
          </p>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Framed Portrait (Left Wall): Contact & Social Inquiries */
function ContactPortrait() {
  return (
    <FramedWallPortrait
      position={[-ABOUT_HALF + 0.08, 2.15, 0]}
      rotation={[0, Math.PI / 2, 0]}
      frameWidth={4.0}
      frameHeight={3.2}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-6 border border-[var(--color-ink)]/30"
        style={{
          width: "480px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
          <span>Get in Touch &bull; Open for Opportunities</span>
          <span>Channels</span>
        </div>

        <h2 className="font-[family-name:var(--font-bacley)] text-3xl font-bold tracking-wide mb-1">
          CONNECT &amp; SOCIALS
        </h2>
        <p className="font-[family-name:var(--font-spirtush)] text-sm text-[var(--color-ink)]/75 italic mb-3">
          Click any channel to open in a new tab or send an email.
        </p>

        <div className="space-y-2.5 text-sm">
          <a
            href="mailto:mk6447959@gmail.com"
            className="flex items-center justify-between p-3 bg-[#f5f0e6] hover:bg-[var(--color-masthead)]/15 border border-[var(--color-ink)]/20 transition-colors rounded text-[var(--color-ink)]"
          >
            <div className="flex items-center gap-2">
              <TbMail className="text-[var(--color-masthead)] text-lg" />
              <span className="font-[family-name:var(--font-bacley)] font-bold">Email</span>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink)]/80">mk6447959@gmail.com</span>
          </a>

          <a
            href="https://github.com/mk-2007"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#f5f0e6] hover:bg-[var(--color-masthead)]/15 border border-[var(--color-ink)]/20 transition-colors rounded text-[var(--color-ink)]"
          >
            <div className="flex items-center gap-2">
              <TbBrandGithub className="text-[var(--color-ink)] text-lg" />
              <span className="font-[family-name:var(--font-bacley)] font-bold">GitHub</span>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink)]/80 flex items-center gap-1">
              mk-2007 <TbExternalLink size={14} />
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/mahandarkhatri"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#f5f0e6] hover:bg-[var(--color-masthead)]/15 border border-[var(--color-ink)]/20 transition-colors rounded text-[var(--color-ink)]"
          >
            <div className="flex items-center gap-2">
              <TbBrandLinkedin className="text-[#0077b5] text-lg" />
              <span className="font-[family-name:var(--font-bacley)] font-bold">LinkedIn</span>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink)]/80 flex items-center gap-1">
              mahandarkhatri <TbExternalLink size={14} />
            </span>
          </a>

          <a
            href="https://codeforces.com/profile/_gazzy284"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#f5f0e6] hover:bg-[var(--color-masthead)]/15 border border-[var(--color-ink)]/20 transition-colors rounded text-[var(--color-ink)]"
          >
            <div className="flex items-center gap-2">
              <TbCode className="text-[#a8791f] text-lg" />
              <span className="font-[family-name:var(--font-bacley)] font-bold">Codeforces</span>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink)]/80 flex items-center gap-1">
              _gazzy284 <TbExternalLink size={14} />
            </span>
          </a>

          <a
            href="https://leetcode.com/u/struck_high/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#f5f0e6] hover:bg-[var(--color-masthead)]/15 border border-[var(--color-ink)]/20 transition-colors rounded text-[var(--color-ink)]"
          >
            <div className="flex items-center gap-2">
              <TbFileText className="text-[#ffa116] text-lg" />
              <span className="font-[family-name:var(--font-bacley)] font-bold">LeetCode</span>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink)]/80 flex items-center gap-1">
              struck_high <TbExternalLink size={14} />
            </span>
          </a>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Framed Portrait (Right Wall): Resume & Credentials Download */
function ResumePortrait() {
  return (
    <FramedWallPortrait
      position={[ABOUT_HALF - 0.08, 2.15, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      frameWidth={4.0}
      frameHeight={3.2}
      woodColor="#2e1e12"
    >
      <div
        className="bg-[var(--color-paper)] text-[var(--color-ink)] p-6 border border-[var(--color-ink)]/30 flex flex-col justify-between"
        style={{
          width: "480px",
          height: "360px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div>
          <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[var(--color-masthead)] font-bold border-b border-[var(--color-ink)]/25 pb-2 mb-3">
            <span>Curriculum Vitae &bull; 2025</span>
            <span>Official Document</span>
          </div>

          <h2 className="font-[family-name:var(--font-bacley)] text-3xl font-bold tracking-wide mb-1">
            RESUME &amp; CREDENTIALS
          </h2>
          <p className="font-[family-name:var(--font-spirtush)] text-sm text-[var(--color-ink)]/75 italic mb-3">
            Overview of experience, achievements, and technical capabilities.
          </p>

          <div className="space-y-2.5 text-sm text-[var(--color-ink)]/85 mb-3">
            <div className="p-2.5 bg-[var(--color-ink)]/5 border-l-2 border-[var(--color-masthead)] rounded-r">
              <p className="font-bold text-xs">Key Competencies</p>
              <p className="text-xs">AI Agent Workflows, RAG Architectures, FastAPI, Python, C++, SQL.</p>
            </div>
            <div className="p-2.5 bg-[var(--color-ink)]/5 border-l-2 border-[#a8791f] rounded-r">
              <p className="font-bold text-xs">Academic &amp; Project Track Record</p>
              <p className="text-xs">Demonstrated full-stack 3D applications, hackathons, &amp; algorithms.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-ink)]/20">
          <a
            href="/Resume.pdf"
            download="Mahandar_Kumar_Resume.pdf"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-masthead)] text-white hover:bg-[#5a1b16] transition-colors text-sm font-[family-name:var(--font-bacley)] tracking-wider uppercase font-bold rounded shadow-md"
          >
            <TbDownload size={18} />
            Download Official Resume (PDF)
          </a>
          <a
            href="/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-1 text-xs text-[var(--color-ink)]/75 hover:text-[var(--color-ink)] font-mono"
          >
            <TbExternalLink size={14} />
            View in Browser Tab
          </a>
        </div>
      </div>
    </FramedWallPortrait>
  );
}

/** Luxury Bookshelf */
function Bookshelf({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const bookColors = ["#7a2f2a", "#3f6b45", "#5a4632", "#7a5c1e", "#2c4a5e", "#5c2c4a"];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[0.75, 1.55, 2.35].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[1.5, 0.05, 0.32]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
          </mesh>
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={i} position={[-0.64 + i * 0.16, y + 0.17, 0]} rotation={[0, 0, (i % 2) * 0.03]}>
              <boxGeometry args={[0.13, 0.32, 0.26]} />
              <meshStandardMaterial color={bookColors[i % bookColors.length]} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {[-0.78, 0.78].map((sx) => (
        <mesh key={sx} position={[sx, 1.55, 0]}>
          <boxGeometry args={[0.05, 3.2, 0.34]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Executive Study Desk */
function ExecutiveDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.06, 0.85]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.7} />
      </mesh>
      {[-0.9, 0.9].map((lx) =>
        [-0.35, 0.35].map((lz) => (
          <mesh key={`${lx}-${lz}`} position={[lx, 0.36, lz]} castShadow>
            <boxGeometry args={[0.06, 0.72, 0.06]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
          </mesh>
        ))
      )}
      {/* Decorative Book Stack & Mug */}
      <mesh position={[-0.4, 0.76, 0.1]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.26, 0.03, 0.32]} />
        <meshStandardMaterial color="#ece6d8" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 0.78, 0.2]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#ece6d8" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Decorative Wall Clock on the Back Wall */
function WallClock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Clock body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.06, 32]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 0, 0.035]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.6} />
      </mesh>
      {/* Brass rim */}
      <mesh>
        <torusGeometry args={[0.45, 0.025, 12, 48]} />
        <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Hour hand */}
      <mesh position={[0, 0.08, 0.04]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.015, 0.2, 0.01]} />
        <meshStandardMaterial color="#1a1510" />
      </mesh>
      {/* Minute hand */}
      <mesh position={[0.05, 0.12, 0.04]} rotation={[0, 0, -1.2]}>
        <boxGeometry args={[0.01, 0.28, 0.01]} />
        <meshStandardMaterial color="#1a1510" />
      </mesh>
      {/* Center pin */}
      <mesh position={[0, 0, 0.045]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Luxury Area Rug */
function RoomRug() {
  return (
    <group position={[0, 0.006, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#38251e" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[4.6, 4.6]} />
        <meshStandardMaterial color="#4e3328" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial color="#2d1c16" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Small Side Table */
function SideTable({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Top */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 16]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.7} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.52, 10]} />
        <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      {/* Small vase on top */}
      <mesh position={[0, 0.64, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.14, 12]} />
        <meshStandardMaterial color="#5c2c4a" roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function AboutRoom() {
  const wallTexture = useNewspaperTexture();

  const walls: { x: number; z: number; rotY: number; width: number }[] = [
    { x: 0, z: -ABOUT_HALF, rotY: 0, width: ABOUT_SIZE },
    { x: -ABOUT_HALF, z: 0, rotY: Math.PI / 2, width: ABOUT_SIZE },
    { x: ABOUT_HALF, z: 0, rotY: -Math.PI / 2, width: ABOUT_SIZE },
    { x: 0, z: ABOUT_HALF, rotY: Math.PI, width: ABOUT_SIZE },
  ];

  return (
    <group>
      {/* Floor & Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ABOUT_SIZE, ABOUT_SIZE]} />
        <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ABOUT_WALL_HEIGHT, 0]}>
        <planeGeometry args={[ABOUT_SIZE, ABOUT_SIZE]} />
        <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
      </mesh>

      {/* Surrounding Walls */}
      {walls.map((w, i) => (
        <mesh key={i} position={[w.x, ABOUT_WALL_HEIGHT / 2, w.z]} rotation={[0, w.rotY, 0]} receiveShadow>
          <planeGeometry args={[w.width, ABOUT_WALL_HEIGHT]} />
          <meshStandardMaterial
            map={wallTexture ?? undefined}
            color={wallTexture ? WALL_TINT : "#ede8de"}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Lighting */}
      <ambientLight intensity={1.1} color="#fff6ea" />
      <hemisphereLight args={["#fff8ed", "#4a3525", 0.7]} />
      <pointLight position={[0, 3.6, 0]} color="#ffe4c4" intensity={1.8} distance={10} decay={1.8} />

      {/* Area Rug */}
      <RoomRug />

      {/* Framed Wall Portraits:
          Presentation wall (opposite the door): About Me
          Left Wall: Contact
          Right Wall: Resume
          Exit wall: decorative clock only */}
      <AboutMePortrait />
      <ContactPortrait />
      <ResumePortrait />

      {/* Decorative Wall Clock, clear of the central exit door. */}
      <group position={[2.7, 0, ABOUT_HALF]} rotation={[0, Math.PI, 0]}>
        <WallClock position={[0, 2.5, 0.06]} />
      </group>

      {/* Wall Sconces */}
      <WallSconce position={[-ABOUT_HALF + 0.05, 2.3, -2.2]} rotationY={Math.PI / 2} />
      <WallSconce position={[-ABOUT_HALF + 0.05, 2.3, 2.2]} rotationY={Math.PI / 2} />
      <WallSconce position={[ABOUT_HALF - 0.05, 2.3, -2.2]} rotationY={-Math.PI / 2} />
      <WallSconce position={[ABOUT_HALF - 0.05, 2.3, 2.2]} rotationY={-Math.PI / 2} />
      {/* Additional sconces on back wall */}
      <WallSconce position={[-2.2, 2.3, -ABOUT_HALF + 0.05]} rotationY={0} />
      <WallSconce position={[2.2, 2.3, -ABOUT_HALF + 0.05]} rotationY={0} />

      {/* Furniture: Executive Desk, Bookshelves, Side Tables */}
      <ExecutiveDesk position={[0, 0, -2.2]} />
      <Bookshelf position={[ABOUT_HALF - 0.2, 0, -1.2]} rotationY={-Math.PI / 2} />
      <Bookshelf position={[-ABOUT_HALF + 0.2, 0, -1.2]} rotationY={Math.PI / 2} />
      <SideTable position={[-2.8, 0, 1.5]} />
      <SideTable position={[2.8, 0, 1.5]} />

      {/* Floor Lamps — all four corners */}
      <FloorLamp x={-ABOUT_HALF + 0.75} z={-ABOUT_HALF + 0.75} />
      <FloorLamp x={ABOUT_HALF - 0.75} z={-ABOUT_HALF + 0.75} />
      <FloorLamp x={-ABOUT_HALF + 0.75} z={ABOUT_HALF - 0.75} />
      <FloorLamp x={ABOUT_HALF - 0.75} z={ABOUT_HALF - 0.75} />

      {/* Clean Exit Door on Front Wall */}
      <ExitDoor />
    </group>
  );
}
