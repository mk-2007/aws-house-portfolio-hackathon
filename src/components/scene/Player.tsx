"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "@/store/playerStore";
import { useLookStore, ARC_RANGE } from "@/store/lookStore";
import { useKeyboardMoveStore } from "@/store/keyboardMoveStore";
import { useSpaceStore, type Space, type EntryId } from "@/store/spaceStore";
import { SPAWN_POSITION, PLAYER_BOUNDS, EYE_HEIGHT, getCorridorDoorStand } from "./corridorLayout";
import { HOME_SPAWN } from "./rooms/homeLayout";
import { SKILLS_SPAWN } from "./rooms/skillsLayout";
import { PROJECTS_SPAWN } from "./rooms/projectsLayout";
import { ABOUT_SPAWN } from "./rooms/aboutLayout";
import { ATTIC_SPAWN } from "./rooms/atticLayout";
import Hand from "./character/Hand";

const WALK_SPEED = 3.5; // units/sec, corridor walking (menu- or click-driven)
const ARRIVE_THRESHOLD = 0.05;
const TURN_SPEED = 6; // camera turn rate, shared by walking-auto-face and room look
const KEY_MOVE_SPEED = 3.5; // units/sec, WASD/arrow-key corridor walking
const KEY_TURN_SPEED = 2.2; // rad/sec, WASD/arrow-key turning (corridor and room look alike)

const DEFAULT_SPAWN_FOR: Record<Space, { x: number; z: number; yaw: number }> = {
  corridor: { x: SPAWN_POSITION[0], z: SPAWN_POSITION[2], yaw: Math.PI },
  home: HOME_SPAWN,
  skills: SKILLS_SPAWN,
  projects: PROJECTS_SPAWN,
  about: ABOUT_SPAWN,
  attic: ATTIC_SPAWN,
};

// Where walking into a given door's arrival point should take you. Rooms
// not listed here just stop the player at the door — that's "not built
// yet," not a bug.
const ENTRY_SPAWN_FOR: Partial<Record<EntryId, { x: number; z: number; yaw: number }>> = {
  home: HOME_SPAWN,
  skills: SKILLS_SPAWN,
  projects: PROJECTS_SPAWN,
  about: ABOUT_SPAWN,
  attic: ATTIC_SPAWN,
};

/**
 * Navigation is menu-driven by default, with WASD/arrow keys as an
 * added direct-control option — the menu, click-to-walk, and the arc
 * drag control all keep working exactly as before:
 *
 *   - Corridor: normally the only way to move is walking to a door's
 *     arrival point (playerStore.target), set by clicking a door or by
 *     NavigationMenu. Holding W/S/A/D moves/turns the camera directly
 *     instead (classic-FPS style: W/S translate, A/D turn), and cancels
 *     any in-flight click target so the two never fight. Arrival at a
 *     door (whichever way you got there) is still the gate that
 *     triggers a room transition (spaceStore.pendingEntry).
 *   - Room: position is fixed at that room's spawn point for the entire
 *     visit — no translation, keyboard or otherwise. A/D nudge the same
 *     lookStore.angle ArcLookControl's drag does; W/S are no-ops.
 *   - Room-to-room chaining: spaceStore.chainTo, set by NavigationMenu's
 *     "jump straight to another room," is consumed the instant the
 *     corridor is (re)entered — immediately sets a new walk target so
 *     it reads as one continuous "out of this room, into that one" trip.
 *
 * IMPORTANT pattern note: everything read inside useFrame below comes
 * from store.getState() calls, including detecting a space change (via
 * lastSpaceRef, compared every frame) — NOT from a subscribed hook value
 * closed over from the component's last render. useFrame's callback runs
 * on R3F's own render loop, independent of React's reconciliation timing;
 * a value that only updates when React re-renders this component (a
 * subscribed hook, or a useEffect keyed on one) can go stale for an
 * arbitrary number of frames. Two earlier bugs during this file's
 * development were exactly this: a click doing nothing until some
 * unrelated re-render happened to refresh a stale closure.
 */
export default function Player() {
  const { camera } = useThree();

  const posRef = useRef(new THREE.Vector3());
  const yawRef = useRef(0);
  // The room's fixed facing direction — look control offsets FROM this,
  // it never drifts itself. Meaningless in the corridor.
  const roomBaseYawRef = useRef(0);
  const lastSpaceRef = useRef<Space | null>(null);

  function initForSpace(space: Space) {
    const spawn = useSpaceStore.getState().consumeSpawn() ?? DEFAULT_SPAWN_FOR[space];
    posRef.current.set(spawn.x, EYE_HEIGHT, spawn.z);
    yawRef.current = spawn.yaw;
    roomBaseYawRef.current = spawn.yaw;
    useLookStore.getState().reset();
    camera.position.copy(posRef.current);
    camera.rotation.set(0, spawn.yaw, 0);

    if (space === "corridor") {
      const chainTo = useSpaceStore.getState().chainTo;
      if (chainTo) {
        useSpaceStore.getState().setChainTo(null);
        const stand = getCorridorDoorStand(chainTo);
        useSpaceStore.getState().setPendingEntry(chainTo);
        usePlayerStore.getState().setTarget([stand.x, stand.z]);
      }
    }
  }

  // Mount-only: set the very first pose before first paint. All
  // SUBSEQUENT space changes are caught imperatively inside useFrame
  // (lastSpaceRef comparison) — see the file-level note above for why.
  useLayoutEffect(() => {
    const space = useSpaceStore.getState().space;
    lastSpaceRef.current = space;
    initForSpace(space);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  useFrame((_, delta) => {
    const currentSpace = useSpaceStore.getState().space;
    if (currentSpace !== lastSpaceRef.current) {
      lastSpaceRef.current = currentSpace;
      initForSpace(currentSpace);
    }

    const pos = posRef.current;
    const { turn: keyTurn, move: keyMove } = useKeyboardMoveStore.getState();

    if (currentSpace !== "corridor") {
      // A/D (keyTurn) is a keyboard-equivalent of dragging ArcLookControl
      // — same store, same clamp range, so the two controls can't
      // conflict or drift apart. W/S (keyMove) is intentionally ignored:
      // rooms have zero translation, by design (see Player.tsx's
      // file-level comment on why a fixed spawn matters for panel
      // legibility).
      if (keyTurn !== 0) {
        const current = useLookStore.getState().angle;
        const next = THREE.MathUtils.clamp(current + keyTurn * KEY_TURN_SPEED * delta, -ARC_RANGE, ARC_RANGE);
        useLookStore.getState().setAngle(next);
      }

      // Direct/instant application: dragging right / pressing D subtracts from base yaw,
      // turning the camera to the right. Dragging left / pressing A adds to base yaw,
      // turning the camera to the left.
      const targetYaw = roomBaseYawRef.current - useLookStore.getState().angle;
      camera.rotation.set(0, targetYaw, 0);
      camera.position.set(pos.x, EYE_HEIGHT, pos.z);
      return;
    }

    if (keyTurn !== 0 || keyMove !== 0) {
      // WASD/arrow keys take over direct control of the corridor camera,
      // classic-FPS style — cancel any in-flight click-to-walk target so
      // the two input methods never fight over the same frame.
      if (usePlayerStore.getState().target) usePlayerStore.getState().clearTarget();
      useSpaceStore.getState().setPendingEntry(null);

      // Pressing D (keyTurn = +1) turns right (decreases yaw);
      // Pressing A (keyTurn = -1) turns left (increases yaw).
      yawRef.current -= keyTurn * KEY_TURN_SPEED * delta;

      if (keyMove !== 0) {
        // Same forward-vector convention as the click-to-walk yaw-solve
        // below, just applied directly instead of solved for.
        const forwardX = -Math.sin(yawRef.current);
        const forwardZ = -Math.cos(yawRef.current);
        const step = KEY_MOVE_SPEED * keyMove * delta;
        pos.x = THREE.MathUtils.clamp(pos.x + forwardX * step, PLAYER_BOUNDS.minX, PLAYER_BOUNDS.maxX);
        pos.z = THREE.MathUtils.clamp(pos.z + forwardZ * step, PLAYER_BOUNDS.minZ, PLAYER_BOUNDS.maxZ);
      }

      camera.position.set(pos.x, EYE_HEIGHT, pos.z);
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawRef.current, 0));
      camera.quaternion.slerp(targetQuat, Math.min(1, TURN_SPEED * delta));
      return;
    }

    const target = usePlayerStore.getState().target;
    if (target) {
      const [tx, tz] = target;
      const dx = tx - pos.x;
      const dz = tz - pos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < ARRIVE_THRESHOLD) {
        usePlayerStore.getState().clearTarget();

        const pendingEntry = useSpaceStore.getState().pendingEntry;
        if (pendingEntry) {
          const spawn = ENTRY_SPAWN_FOR[pendingEntry];
          if (spawn) {
            useSpaceStore.getState().requestTransition(pendingEntry, spawn);
          } else {
            useSpaceStore.getState().setPendingEntry(null);
          }
        }
      } else {
        const step = Math.min(dist, WALK_SPEED * delta);
        pos.x = THREE.MathUtils.clamp(pos.x + (dx / dist) * step, PLAYER_BOUNDS.minX, PLAYER_BOUNDS.maxX);
        pos.z = THREE.MathUtils.clamp(pos.z + (dz / dist) * step, PLAYER_BOUNDS.minZ, PLAYER_BOUNDS.maxZ);
        // Solves -sin(yaw)=dx/dist, -cos(yaw)=dz/dist for the yaw that
        // makes the camera's forward (-Z) point at (dx, dz).
        yawRef.current = Math.atan2(-dx, -dz);
      }
    }

    camera.position.set(pos.x, EYE_HEIGHT, pos.z);
    const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yawRef.current, 0));
    camera.quaternion.slerp(targetQuat, Math.min(1, TURN_SPEED * delta));
  });

  return <Hand />;
}
