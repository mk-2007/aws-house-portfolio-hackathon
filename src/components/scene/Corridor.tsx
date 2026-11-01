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
import { CorridorWalls, FloorInlay, ArrivalDoor } from "./CorridorShell";
import { SUN_POSITION } from "@/components/space/SpaceWorld";
import { createLabelTexture } from "./textures/createLabelTexture";
import Portrait from "./props/Portrait";
import WallClock from "./props/WallClock";
import FloorLamp from "./props/FloorLamp";
import {
  ConsoleTable,
  HouseItineraryPlaque,
  WallSconce,
  EntrywayBench,
  CeilingBeams,
} from "./props/CorridorDecor";

const CORRIDOR_LENGTH = CORRIDOR_END_Z - CORRIDOR_START_Z;
const CORRIDOR_CENTER_Z = (CORRIDOR_START_Z + CORRIDOR_END_Z) / 2;

// Warm luxury residential tones
const FLOOR_COLOR = "#2a1f17"; // dark polished hardwood
const CEILING_COLOR = "#0e121c";
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
      <meshStandardMaterial color={FLOOR_COLOR} roughness={0.4} metalness={0.12} />
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

/** Door sign attached rigidly to the door group */
function DoorSign({ label }: { label: string }) {
  const [texture] = useState<THREE.CanvasTexture | null>(() =>
    typeof document !== "undefined"
      ? createLabelTexture(label, { width: 512, height: 168, fontPx: 58, bg: "#141a2b", fg: "#f1e2bd", border: "#c9a34a" })
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
        <meshPhysicalMaterial color="#9a4f6d" roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>

      {/* Recessed Door Inset Panels */}
      {[-0.35, 0.35].map((px) => (
        <group key={px} position={[px, 0, 0.065]}>
          <mesh position={[0, 0.7, 0]}>
            <planeGeometry args={[0.5, 0.8]} />
            <meshStandardMaterial color="#7e3e58" roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <planeGeometry args={[0.5, 0.9]} />
            <meshStandardMaterial color="#7e3e58" roughness={0.55} />
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
  return (
    <group>
      {/* Lighting: a cool, dim starlight fill, one hard shadow-casting "sun" that
          streams through the windows from the same direction as the sun the
          visitor sees outside, and warm lamplight inside. Contrast between
          cool outside light and warm inside light is what makes it feel real. */}
      <ambientLight intensity={0.75} color="#b3bddc" />
      <hemisphereLight args={["#a3b3e3", "#3a2a1c", 1.0]} />
      <directionalLight
        castShadow
        position={[SUN_POSITION[0] * 0.25, SUN_POSITION[1] * 0.25, SUN_POSITION[2] * 0.25]}
        intensity={5.0}
        color="#ffd9a8"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[-30, 8, -6]} intensity={0.9} color="#7f9bff" />

      {/* Ceiling Downlights along the hallway */}
      {[-10, -5, 0, 5, 9].map((z) => (
        <pointLight
          key={`downlight-${z}`}
          position={[0, 3.6, z]}
          color="#ffcf94"
          intensity={2.8}
          distance={9}
          decay={1.8}
        />
      ))}

      {/* Architecture Base */}
      <Floor />
      <FloorInlay />
      <Ceiling />
      <CorridorWalls />
      <ArrivalDoor />
      <WallClock position={[0, 2.7, CORRIDOR_END_Z - 0.05]} rotationY={Math.PI} />

      {/* Ceiling Cross Beams */}
      <CeilingBeams positions={BEAM_POSITIONS} width={CORRIDOR_WIDTH} />

      {/* Entryway Console Table */}
      <ConsoleTable position={[-WALL_X + 0.65, 0, -11]} />

      {/* House directory on the entrance end wall, opposite the clock wall. */}
      <HouseItineraryPlaque
        position={[1.5, 2.3, CORRIDOR_START_Z + 0.04]}
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
      <FloorLamp x={-WALL_X + 0.45} z={11.55} />

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
