import { create } from "zustand";

// Just under a full half-turn each way — avoids the exact-edge angle
// ambiguity of a true +-180 while still covering every wall from a
// fixed center spawn. Shared by ArcLookControl (drag) and Player.tsx's
// keyboard A/D handling, so both clamp to the exact same range.
export const ARC_RANGE = Math.PI * 0.92;

/**
 * Rooms no longer have any player translation — you arrive at a fixed
 * center spawn point (menu-driven navigation, see spaceStore.ts) and can
 * only look around. This store holds that look angle: an offset in
 * radians from the room's spawn-facing direction, clamped by
 * ArcLookControl.tsx to the arc's range. Player.tsx applies it directly
 * to the camera's yaw each frame while in a room; it's meaningless (and
 * unused) in the corridor, where movement is still target-based walking.
 */
interface LookState {
  angle: number;
  setAngle: (angle: number) => void;
  reset: () => void;
}

export const useLookStore = create<LookState>((set) => ({
  angle: 0,
  setAngle: (angle) => set({ angle }),
  reset: () => set({ angle: 0 }),
}));
