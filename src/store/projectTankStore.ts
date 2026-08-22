import { create } from "zustand";

interface ProjectTankState {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
}

export const useProjectTankStore = create<ProjectTankState>((set) => ({
  openId: null,
  open: (id) => set({ openId: id }),
  close: () => set({ openId: null }),
}));
