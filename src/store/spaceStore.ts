import { create } from "zustand";
import type { RoomId } from "@/components/scene/corridorLayout";

export type Space = "corridor" | RoomId | "attic";
/** Anything you can walk up to a door and enter from the corridor. */
export type EntryId = RoomId | "attic";

interface Spawn {
  x: number;
  z: number;
  yaw: number;
}

interface SpaceState {
  /** The space actually being rendered right now. */
  space: Space;
  /** Set while a fade-to-black transition is in flight; the space swap
   *  happens at its darkest point (see TransitionOverlay.tsx). */
  requestedSpace: Space | null;
  /** Where the camera should land once requestedSpace becomes space. */
  pendingSpawn: Spawn | null;
  /** Door the player is walking toward with intent to enter, set by a
   *  door click in Corridor.tsx (or the room-select menu). Player.tsx
   *  consumes this on arrival — that's what makes "walk into a door"
   *  transition rather than an instant teleport on click. */
  pendingEntry: EntryId | null;
  /** Set by RoomActionMenu's "go straight to another room" button: exits
   *  to the corridor first, and once there, Player.tsx immediately walks
   *  the rest of the way into this room and clears the field. Gives the
   *  "walk out of one room, across the corridor, into the next" sequence
   *  from a single menu click instead of two separate trips. */
  chainTo: RoomId | null;

  setPendingEntry: (id: EntryId | null) => void;
  setChainTo: (id: RoomId | null) => void;
  requestTransition: (space: Space, spawn: Spawn) => void;
  /** Swaps `space` to `requestedSpace` — call at the fade's darkest point. */
  commitSpace: () => void;
  /** Clears the trigger — call ONLY once the fade-out has fully finished,
   *  never in the same tick as commitSpace, or it kills the fade-out
   *  animation mid-flight (TransitionOverlay's effect depends on this). */
  finishTransition: () => void;
  consumeSpawn: () => Spawn | null;
}

export const useSpaceStore = create<SpaceState>((set, get) => ({
  space: "corridor",
  requestedSpace: null,
  pendingSpawn: null,
  pendingEntry: null,
  chainTo: null,

  setPendingEntry: (id) => set({ pendingEntry: id }),
  setChainTo: (id) => set({ chainTo: id }),

  requestTransition: (space, spawn) =>
    set({ requestedSpace: space, pendingSpawn: spawn, pendingEntry: null }),

  commitSpace: () =>
    set((s) => (s.requestedSpace ? { space: s.requestedSpace } : {})),

  finishTransition: () => set({ requestedSpace: null }),

  consumeSpawn: () => {
    const spawn = get().pendingSpawn;
    set({ pendingSpawn: null });
    return spawn;
  },
}));
