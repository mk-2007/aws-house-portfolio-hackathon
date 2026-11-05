import { create } from "zustand";

export type CameraMode = "first-person" | "third-person";

interface CameraModeState {
  mode: CameraMode;
  toggle: () => void;
}

export const useCameraModeStore = create<CameraModeState>((set) => ({
  mode: "first-person",
  toggle: () =>
    set((state) => ({
      mode: state.mode === "first-person" ? "third-person" : "first-person",
    })),
}));
