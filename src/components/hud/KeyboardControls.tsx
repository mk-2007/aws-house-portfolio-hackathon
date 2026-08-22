"use client";

import { useEffect } from "react";
import { useKeyboardMoveStore, type Axis } from "@/store/keyboardMoveStore";

/**
 * Mounted once, always active — purely a keydown/keyup listener that
 * updates keyboardMoveStore. Doesn't render anything, and doesn't know
 * or care whether the player is in the corridor or a room; Player.tsx
 * decides what turn/move actually mean for the current space.
 */
export default function KeyboardControls() {
  useEffect(() => {
    const held = new Set<string>();

    function recompute() {
      const left = held.has("ArrowLeft") || held.has("a") || held.has("A");
      const right = held.has("ArrowRight") || held.has("d") || held.has("D");
      const fwd = held.has("ArrowUp") || held.has("w") || held.has("W");
      const back = held.has("ArrowDown") || held.has("s") || held.has("S");

      const turn: Axis = left && !right ? -1 : right && !left ? 1 : 0;
      const move: Axis = fwd && !back ? 1 : back && !fwd ? -1 : 0;
      useKeyboardMoveStore.getState().setTurn(turn);
      useKeyboardMoveStore.getState().setMove(move);
    }

    function onKeyDown(e: KeyboardEvent) {
      held.add(e.key);
      recompute();
    }
    function onKeyUp(e: KeyboardEvent) {
      held.delete(e.key);
      recompute();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      useKeyboardMoveStore.getState().setTurn(0);
      useKeyboardMoveStore.getState().setMove(0);
    };
  }, []);

  return null;
}
