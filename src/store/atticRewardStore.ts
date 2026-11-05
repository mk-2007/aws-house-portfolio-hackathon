import { create } from "zustand";

interface AtticRewardState {
  isOpen: boolean;
  reveal: () => void;
  close: () => void;
}

export const useAtticRewardStore = create<AtticRewardState>((set) => ({
  isOpen: false,
  reveal: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
