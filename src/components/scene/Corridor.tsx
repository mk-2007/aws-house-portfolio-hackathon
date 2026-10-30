"use client";

import { useEffect, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  CORRIDOR_WIDTH,
  CORRIDOR_START_Z,
  CORRIDOR_END_Z,
  WALL_HEIGHT,
  WALL_X,
  DOORS,
  DOOR_WIDTH,
  DOOR_HEIGHT,
  DOOR_STAND_DISTANCE,
  PLAYER_BOUNDS,
  type RoomId,
} from "./corridorLayout";
import { usePlayerStore } from "@/store/playerStore";
import { useSpaceStore } from "@/store/spaceStore";
import { useKeysStore, countKeys } from "@/store/keysStore";
import { ATTIC_DOOR_X, ATTIC_DOOR_STAND } from "./rooms/atticLayout";
import { useNewspaperTexture } from "./textures/useNewspaperTexture";
import { createLabelTexture } from "./textures/createLabelTexture";
import Portrait from "./props/Portrait";
import WallClock from "./props/WallClock";
import FloorLamp from "./props/FloorLamp";
import {
  ConsoleTable,
  HouseItineraryPlaque,
  CorridorRunnerRug,
  WallSconce,
  EntrywayBench,
  CeilingBeams,
} from "./props/CorridorDecor";

const CORRIDOR_LENGTH = CORRIDOR_END_Z - CORRIDOR_START_Z;
const CORRIDOR_CENTER_Z = (CORRIDOR_START_Z + CORRIDOR_END_Z) / 2;

// Warm luxury residential tones
const FLOOR_COLOR = "#181410"; // Rich dark hardwood floor
const CEILING_COLOR = "#1f1b16";
const WOOD_DARK = "#2e1e12";
const BRASS = "#c9a34a";

function Floor() {
  const setTarget = usePlayerStore((s) => s.setTarget);
  const setPendingEntry = useSpaceStore((s) => s.setPendingEntry);

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const x = Math.min(PLAYER_BOUNDS.maxX, Math.max(PLAYER_BOUNDS.minX, e.point.x));
    const z = Math.min(PLAYER_BOUNDS.maxZ, Math.max(PLAYER_BOUNDS.minZ, e.point.z));
    setPendingEntry(null);
    setTarget([x, z]);
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, CORRIDOR_CENTER_Z]}
      onClick={handleClick}
      receiveShadow
    >
      <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_LENGTH]} />
      <meshStandardMaterial color={FLOOR_COLOR} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, WALL_HEIGHT, CORRIDOR_CENTER_Z]}
    >
      <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_LENGTH]} />
      <meshStandardMaterial color={CEILING_COLOR} roughness={0.9} />
    </mesh>
  );
}

function EndWall({
  z,
  rotY,
  texture,
}: {
  z: number;
  rotY: number;
  texture: THREE.CanvasTexture | null;
}) {
  return (
    <mesh position={[0, WALL_HEIGHT / 2, z]} rotation={[0, rotY, 0]} receiveShadow>
      <planeGeometry args={[CORRIDOR_WIDTH, WALL_HEIGHT]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? "#ffffff" : "#ede8de"}
        side={THREE.DoubleSide}
        roughness={0.85}
      />
    </mesh>
  );
}

function Wall({
  side,
  texture,
}: {
  side: "left" | "right";
  texture: THREE.CanvasTexture | null;
}) {
  const x = side === "left" ? -WALL_X : WALL_X;
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;

  return (
    <mesh
      position={[x, WALL_HEIGHT / 2, CORRIDOR_CENTER_Z]}
      rotation={[0, rotY, 0]}
      receiveShadow
    >
      <planeGeometry args={[CORRIDOR_LENGTH, WALL_HEIGHT]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? "#ffffff" : "#ede8de"}
        side={THREE.DoubleSide}
        roughness={0.85}
      />
    </mesh>
  );
}

/** Door sign attached rigidly to the door group */
function DoorSign({ label }: { label: string }) {
  const [texture] = useState<THREE.CanvasTexture | null>(() =>
    typeof document !== "undefined"
      ? createLabelTexture(label, { width: 512, height: 168, fontPx: 58, bg: "#f5f0e6", fg: "#1a1714", border: "#7a2620" })
      : null
  );
  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <group position={[0, DOOR_HEIGHT + 0.45, 0.06]}>
      {/* Hanging Brass Brackets */}
      {[-0.52, 0.52].map((bx) => (
        <mesh key={bx} position={[bx, 0.22, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Signboard Backing */}
      <mesh>
        <boxGeometry args={[1.35, 0.42, 0.05]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
      </mesh>
      {/* Gold Trim */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[1.28, 0.36]} />
        <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Label Face */}
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.2, 0.3]} />
        <meshStandardMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#ece6d8"} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Door({
  id,
  label,
  side,
  z,
}: {
  id: RoomId;
  label: string;
  side: "left" | "right";
  z: number;
}) {
  const setTarget = usePlayerStore((s) => s.setTarget);
  const setPendingEntry = useSpaceStore((s) => s.setPendingEntry);
  const x = side === "left" ? -WALL_X + 0.02 : WALL_X - 0.02;
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;

  function handleDoorClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const standX =
      side === "left"
        ? -WALL_X + DOOR_STAND_DISTANCE
        : WALL_X - DOOR_STAND_DISTANCE;
    const clampedX = Math.min(PLAYER_BOUNDS.maxX, Math.max(PLAYER_BOUNDS.minX, standX));
    setPendingEntry(id);
    setTarget([clampedX, z]);
  }

  function handlePointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  }

  function handlePointerOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  }

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Architectural Door Molding Frame */}
      <mesh position={[0, DOOR_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[DOOR_WIDTH + 0.22, DOOR_HEIGHT + 0.14, 0.12]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>

      {/* Door Slab */}
      <mesh
        position={[0, DOOR_HEIGHT / 2, 0.02]}
        onClick={handleDoorClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color="#422f20" roughness={0.6} />
      </mesh>

      {/* Recessed Door Inset Panels */}
      {[-0.35, 0.35].map((px) => (
        <group key={px} position={[px, 0, 0.065]}>
          <mesh position={[0, 0.7, 0]}>
            <planeGeometry args={[0.5, 0.8]} />
            <meshStandardMaterial color="#2d1f14" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <planeGeometry args={[0.5, 0.9]} />
            <meshStandardMaterial color="#2d1f14" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Brass Door Handle */}
      <mesh position={[0.6, 1.1, 0.09]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Signboard */}
      <DoorSign label={label} />
    </group>
  );
}


/**
 * The secret attic door, on the corridor's far end wall. Locked until all
 * three keys are collected: a padlock hangs on it and clicking it nudges the
 * visitor to go find the keys. Once unlocked the padlock drops away, the
 * door glows warmly and clicking walks you in like any other door.
 */
function AtticDoor() {
  const collected = useKeysStore((s) => s.collected);
  const say = useKeysStore((s) => s.say);
  const setTarget = usePlayerStore((s) => s.setTarget);
  const setPendingEntry = useSpaceStore((s) => s.setPendingEntry);
  const n = countKeys(collected);
  const unlocked = n === 3;

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (!unlocked) {
      say(`The attic is locked. Three brass keys are hidden in this house. You have ${n} of 3.`);
      return;
    }
    setPendingEntry("attic");
    setTarget([ATTIC_DOOR_STAND.x, ATTIC_DOOR_STAND.z]);
  }

  return (
    <group position={[ATTIC_DOOR_X, 0, CORRIDOR_END_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, DOOR_HEIGHT / 2 + 0.05, -0.01]}>
        <boxGeometry args={[DOOR_WIDTH + 0.22, DOOR_HEIGHT + 0.14, 0.12]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
      </mesh>
      <mesh
        position={[0, DOOR_HEIGHT / 2, 0.02]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        castShadow
      >
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial
          color={unlocked ? "#5a3d24" : "#2c2118"}
          roughness={0.6}
          emissive={unlocked ? "#ffb347" : "#000000"}
          emissiveIntensity={unlocked ? 0.35 : 0}
        />
      </mesh>

      {/* Brass handle */}
      <mesh position={[0.6, 1.1, 0.09]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
        <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Padlock, only while locked */}
      {!unlocked && (
        <group position={[0.35, 1.05, 0.1]}>
          <mesh position={[0, -0.06, 0]} castShadow>
            <boxGeometry args={[0.17, 0.15, 0.06]} />
            <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.055, 0.012, 10, 20, Math.PI]} />
            <meshStandardMaterial color="#b9bcc2" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      )}

      {/* Light seeping under/around the door once unlocked */}
      {unlocked && (
        <pointLight position={[0, 1.4, 0.8]} color="#ffcf8a" intensity={2.4} distance={5} decay={1.8} />
      )}

      <DoorSign label="ATTIC" />
    </group>
  );
}

const BEAM_POSITIONS = [-12, -7, -2, 3, 8, 11];

export default function Corridor() {
  const wallTexture = useNewspaperTexture();

  return (
    <group>
      {/* Bright, Warm, Inviting Residential Gallery Lighting */}
      <ambientLight intensity={1.15} color="#fff6ea" />
      <hemisphereLight args={["#fff8ed", "#4a3525", 0.75]} />
      <directionalLight
        position={[5, 10, -5]}
        intensity={0.9}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 10, 5]} intensity={0.6} color="#ffe8cc" />

      {/* Ceiling Downlights along the hallway */}
      {[-10, -5, 0, 5, 9].map((z) => (
        <pointLight
          key={`downlight-${z}`}
          position={[0, 3.6, z]}
          color="#ffe2be"
          intensity={1.8}
          distance={8}
          decay={1.8}
        />
      ))}

      {/* Architecture Base */}
      <Floor />
      <Ceiling />
      <Wall side="left" texture={wallTexture} />
      <Wall side="right" texture={wallTexture} />

      {/* End Walls with Clock */}
      <EndWall z={CORRIDOR_START_Z} rotY={0} texture={wallTexture} />
      <EndWall z={CORRIDOR_END_Z} rotY={Math.PI} texture={wallTexture} />
      <WallClock position={[0, 2.7, CORRIDOR_END_Z - 0.05]} rotationY={Math.PI} />

      {/* Central Plush Luxury Runner Rug */}
      <CorridorRunnerRug length={CORRIDOR_LENGTH - 2} />

      {/* Ceiling Cross Beams */}
      <CeilingBeams positions={BEAM_POSITIONS} width={CORRIDOR_WIDTH} />

      {/* Entryway Console Table */}
      <ConsoleTable position={[-WALL_X + 0.65, 0, -11]} />

      {/* House directory on the entrance end wall, opposite the clock wall. */}
      <HouseItineraryPlaque
        position={[0, 2.3, CORRIDOR_START_Z + 0.04]}
      />

      {/* Modern Wall Sconces flanking doorways */}
      <WallSconce position={[-WALL_X + 0.05, 2.2, -9.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[-WALL_X + 0.05, 2.2, -6.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[WALL_X - 0.05, 2.2, -3.5]} rotationY={-Math.PI / 2} />
      <WallSconce position={[WALL_X - 0.05, 2.2, -0.5]} rotationY={-Math.PI / 2} />
      <WallSconce position={[-WALL_X + 0.05, 2.2, 2.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[-WALL_X + 0.05, 2.2, 5.5]} rotationY={Math.PI / 2} />
      <WallSconce position={[WALL_X - 0.05, 2.2, 8.5]} rotationY={-Math.PI / 2} />

      {/* Standing Floor Lamps placed safely in wall alcoves (clear of doors & paths) */}
      <FloorLamp x={WALL_X - 0.45} z={-11} />
      <FloorLamp x={-WALL_X + 0.45} z={1} />
      <FloorLamp x={WALL_X - 0.45} z={10.5} />

      {/* Modern Entryway Seating Bench */}
      <EntrywayBench position={[WALL_X - 0.55, 0, 7]} rotationY={-Math.PI / 2} />

      {/* Fine-Art Framed Gallery Portraits */}
      <Portrait x={WALL_X - 0.05} z={-11} rotationY={-Math.PI / 2} tint="#7a2620" />
      <Portrait x={-WALL_X + 0.05} z={-4.5} rotationY={Math.PI / 2} tint="#2c4a5e" />
      <Portrait x={WALL_X - 0.05} z={1.5} rotationY={-Math.PI / 2} tint="#a8791f" />
      <Portrait x={-WALL_X + 0.05} z={7.5} rotationY={Math.PI / 2} tint="#5c2c4a" />

      {/* Doors to All Rooms */}
      {DOORS.map((d) => (
        <Door key={d.id} id={d.id} label={d.label} side={d.side} z={d.z} />
      ))}

      {/* Secret attic door - locked until all three keys are found */}
      <AtticDoor />
    </group>
  );
}
