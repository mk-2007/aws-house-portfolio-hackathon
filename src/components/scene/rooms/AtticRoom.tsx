"use client";

import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import {
  ATTIC_SIZE,
  ATTIC_HALF,
  ATTIC_WALL_HEIGHT,
  ATTIC_ENTRANCE_Z,
  ATTIC_EXIT_WIDTH,
  ATTIC_EXIT_HEIGHT,
  ATTIC_EXIT_SPAWN,
} from "./atticLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { useNewspaperTexture } from "@/components/scene/textures/useNewspaperTexture";
import FramedWallPortrait from "@/components/scene/props/FramedWallPortrait";
import { WallSconce } from "@/components/scene/props/CorridorDecor";
import { ATTIC } from "@/content/atticContent";
import { LINKS } from "@/content/siteContent";

const FLOOR = "#2a1d12";
const WOOD_DARK = "#2e1e12";
const WOOD_MID = "#4a3525";
const BRASS = "#c9a34a";

function ExitDoor() {
  function handleExitClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    useSpaceStore.getState().requestTransition("corridor", ATTIC_EXIT_SPAWN);
  }
  return (
    <group position={[0, 0, ATTIC_ENTRANCE_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, ATTIC_EXIT_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[ATTIC_EXIT_WIDTH + 0.2, ATTIC_EXIT_HEIGHT + 0.12, 0.1]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>
      <mesh
        position={[0, ATTIC_EXIT_HEIGHT / 2, 0.02]}
        onClick={handleExitClick}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        castShadow
      >
        <boxGeometry args={[ATTIC_EXIT_WIDTH, ATTIC_EXIT_HEIGHT, 0.08]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.7} />
      </mesh>
      <mesh position={[0.55, 1.1, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** Exposed roof rafters to make the room feel like an attic. */
function Rafters() {
  const xs = [-3.2, -1.6, 0, 1.6, 3.2];
  return (
    <group>
      {xs.map((x) => (
        <mesh key={x} position={[x, ATTIC_WALL_HEIGHT - 0.12, 0]}>
          <boxGeometry args={[0.16, 0.24, ATTIC_SIZE]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, ATTIC_WALL_HEIGHT - 0.6, 0]}>
        <boxGeometry args={[ATTIC_SIZE, 0.14, 0.14]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
      </mesh>
    </group>
  );
}

/** A round gable window pouring warm light across the floor. */
function GableWindow() {
  return (
    <group position={[0, 2.5, -ATTIC_HALF + 0.05]}>
      <mesh>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#ffe9b8" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.7, 0.8, 32]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.4, 0.04, 0.02]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.04, 1.4, 0.02]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <pointLight position={[0, -0.3, 1.4]} color="#ffdca0" intensity={2.2} distance={9} decay={1.6} />
    </group>
  );
}

function Trunk({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.55]} />
        <meshStandardMaterial color="#3a2616" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[1.04, 0.08, 0.59]} />
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  margin: "0 8px 6px 0",
  padding: "5px 10px",
  border: "1px solid rgba(26,23,20,.55)",
  color: "#1a1714",
  textDecoration: "none",
  fontSize: "12px",
};

/** The reward: a one-off front page printed on the back wall. */
function ExtraEditionPortrait() {
  return (
    <FramedWallPortrait
      position={[0, 2.1, -ATTIC_HALF + 0.08]}
      frameWidth={4.6}
      frameHeight={3.4}
      woodColor="#2e1e12"
    >
      <div
        style={{
          width: "560px",
          background: "#ece6d8",
          color: "#1a1714",
          padding: "14px 20px 16px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="font-[family-name:var(--font-bacley)]"
          style={{ textAlign: "center", fontSize: "11px", letterSpacing: ".25em", color: "#7a2620" }}
        >
          {ATTIC.headline}
        </div>
        <div
          className="font-[family-name:var(--font-bacley)]"
          style={{ textAlign: "center", fontSize: "34px", lineHeight: 1.1, borderBottom: "3px double #1a1714", paddingBottom: "6px" }}
        >
          {ATTIC.masthead}
        </div>
        <div className="font-[family-name:var(--font-spirtush)]" style={{ textAlign: "center", fontSize: "13px", margin: "4px 0 8px", fontStyle: "italic" }}>
          {ATTIC.tagline}
        </div>
        <div
          className="font-[family-name:var(--font-bacley)]"
          style={{ textAlign: "center", fontSize: "22px", color: "#7a2620", margin: "4px 0 8px" }}
        >
          &ldquo;{ATTIC.motto}&rdquo;
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          <div style={{ flex: 1 }}>
            <div className="font-[family-name:var(--font-bacley)]" style={{ fontSize: "15px", marginBottom: "4px" }}>
              {ATTIC.storyTitle}
            </div>
            {ATTIC.story.map((p) => (
              <p key={p} style={{ fontSize: "11.5px", lineHeight: 1.45, marginBottom: "6px" }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid rgba(26,23,20,.4)", paddingLeft: "16px" }}>
            <div className="font-[family-name:var(--font-bacley)]" style={{ fontSize: "15px", marginBottom: "4px" }}>
              {ATTIC.factsTitle}
            </div>
            <ol style={{ paddingLeft: "16px", listStyle: "decimal" }}>
              {ATTIC.facts.map((f) => (
                <li key={f} style={{ fontSize: "11.5px", lineHeight: 1.45, marginBottom: "6px" }}>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(26,23,20,.4)", marginTop: "6px", paddingTop: "8px" }}>
          <div className="font-[family-name:var(--font-spirtush)]" style={{ fontSize: "13px", marginBottom: "6px" }}>
            {ATTIC.cta}
          </div>
          {LINKS.filter((l) => l.label !== "Codeforces" && l.label !== "LeetCode").map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={linkStyle}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </FramedWallPortrait>
  );
}

export default function AtticRoom() {
  const wallTexture = useNewspaperTexture();
  const walls: { x: number; z: number; rotY: number }[] = [
    { x: 0, z: -ATTIC_HALF, rotY: 0 },
    { x: -ATTIC_HALF, z: 0, rotY: Math.PI / 2 },
    { x: ATTIC_HALF, z: 0, rotY: -Math.PI / 2 },
    { x: 0, z: ATTIC_HALF, rotY: Math.PI },
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ATTIC_SIZE, ATTIC_SIZE]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ATTIC_WALL_HEIGHT, 0]}>
        <planeGeometry args={[ATTIC_SIZE, ATTIC_SIZE]} />
        <meshStandardMaterial color="#1a130c" roughness={0.95} />
      </mesh>
      {walls.map((w, i) => (
        <mesh key={i} position={[w.x, ATTIC_WALL_HEIGHT / 2, w.z]} rotation={[0, w.rotY, 0]} receiveShadow>
          <planeGeometry args={[ATTIC_SIZE, ATTIC_WALL_HEIGHT]} />
          <meshStandardMaterial
            map={wallTexture ?? undefined}
            color={wallTexture ? "#c9b79a" : "#8a7a62"}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* warm, slightly dusty light */}
      <ambientLight intensity={0.85} color="#ffe9cf" />
      <hemisphereLight args={["#ffe9cf", "#3a2a1a", 0.6]} />
      <pointLight position={[0, 3.4, 0]} color="#ffd9a0" intensity={1.6} distance={10} decay={1.8} />

      <Rafters />
      <GableWindow />
      <ExtraEditionPortrait />

      <WallSconce position={[-ATTIC_HALF + 0.05, 2.3, -1.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[ATTIC_HALF - 0.05, 2.3, -1.5]} rotationY={-Math.PI / 2} />

      <Trunk position={[-2.8, 0, -2.6]} rotationY={0.35} />
      <Trunk position={[2.7, 0, -2.9]} rotationY={-0.25} />

      <ExitDoor />
    </group>
  );
}
