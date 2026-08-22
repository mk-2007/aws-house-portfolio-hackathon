import { create } from "zustand";

export type AboutObjectId = "laptop" | "notebook" | "envelope";

interface AboutObjectState {
  openId: AboutObjectId | null;
  open: (id: AboutObjectId) => void;
  close: () => void;
}

export const useAboutObjectStore = create<AboutObjectState>((set) => ({
  openId: null,
  open: (id) => set({ openId: id }),
  close: () => set({ openId: null }),
}));
