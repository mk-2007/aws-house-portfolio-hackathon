import { create } from "zustand";

/**
 * Top-level "which screen" state — separate from playerStore (which only
 * ever tracks walk targets) so swapping stages doesn't touch movement state.
 *
 * Phase 5: "welcome" is the house-exterior entrance screen; clicking its
 * door flips this to "corridor" and the 3D corridor mounts.
 */
export type AppStage = "welcome" | "corridor";

export type AppView = "house" | "classic";

interface AppState {
  stage: AppStage;
  /** "house" = the 3D experience, "classic" = plain accessible text version. */
  view: AppView;
  enterCorridor: () => void;
  setView: (v: AppView) => void;
}

export const useAppStore = create<AppState>((set) => ({
  stage: "welcome",
  view: "house",
  enterCorridor: () => set({ stage: "corridor" }),
  setView: (view) => set({ view }),
}));
