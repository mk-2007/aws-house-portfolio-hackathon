import { create } from "zustand";

export type Axis = -1 | 0 | 1;

/**
 * Discrete WASD/arrow-key state — classic-FPS style (W/S = forward/
 * back, A/D = turn), not a continuous analog vector. Player.tsx reads
 * this via getState() inside useFrame (never as a subscribed hook
 * value — see Player.tsx's file-level comment on why that matters) and
 * applies it differently per space:
 *   - Corridor: W/S actually move the camera, A/D turn it. Pressing any
 *     of these cancels an in-flight click-to-walk target, same as the
 *     old joystick's cancel-on-manual-input rule.
 *   - Room: only A/D do anything — they nudge lookStore.angle, a
 *     keyboard-equivalent of dragging ArcLookControl. W/S are no-ops,
 *     since rooms intentionally have zero translation.
 */
interface KeyboardMoveState {
  turn: Axis; // -1 = left/A, 1 = right/D
  move: Axis; // -1 = back/S, 1 = forward/W
  setTurn: (turn: Axis) => void;
  setMove: (move: Axis) => void;
}

export const useKeyboardMoveStore = create<KeyboardMoveState>((set) => ({
  turn: 0,
  move: 0,
  setTurn: (turn) => set({ turn }),
  setMove: (move) => set({ move }),
}));
