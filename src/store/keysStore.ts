import { create } from "zustand";

/**
 * The Three Keys hunt. State lives in zustand so the 3D key props, the HUD
 * badge and the locked attic door all read the same source of truth.
 *
 * Progress is saved to localStorage so a refresh doesn't lose it. Storage
 * can be blocked (private mode, strict browsers), so every access is wrapped
 * in try/catch and the game still works in memory without it. We load saved
 * progress in `hydrate()` (called from an effect) rather than at creation:
 * the page is pre-rendered at build time, and reading localStorage during
 * that render would make server and browser HTML differ.
 */
export type KeyId = "home" | "skills" | "projects";
export const KEY_IDS: KeyId[] = ["home", "skills", "projects"];

export const KEY_NAMES: Record<KeyId, string> = {
  home: "the Study key",
  skills: "the Workshop key",
  projects: "the Gallery key",
};

const STORAGE_KEY = "house-keys-v1";

interface KeysState {
  collected: Record<KeyId, boolean>;
  hydrated: boolean;
  /** Short message shown by the HUD (cleared automatically). */
  toast: string | null;
  collect: (id: KeyId) => void;
  say: (msg: string) => void;
  hydrate: () => void;
  reset: () => void;
}

const EMPTY: Record<KeyId, boolean> = { home: false, skills: false, projects: false };

function save(collected: Record<KeyId, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
  } catch {
    /* storage blocked - keep going in memory */
  }
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useKeysStore = create<KeysState>((set, get) => ({
  collected: { ...EMPTY },
  hydrated: false,
  toast: null,

  say: (msg) => {
    set({ toast: msg });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 4200);
  },

  collect: (id) => {
    if (get().collected[id]) return;
    const collected = { ...get().collected, [id]: true };
    set({ collected });
    save(collected);
    const count = KEY_IDS.filter((k) => collected[k]).length;
    get().say(
      count === 3
        ? "All three keys found! The ATTIC door at the end of the corridor is unlocked."
        : `You found ${KEY_NAMES[id]} (${count} of 3). Keep looking.`
    );
  },

  hydrate: () => {
    if (get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Record<KeyId, boolean>>;
        set({
          collected: {
            home: !!parsed.home,
            skills: !!parsed.skills,
            projects: !!parsed.projects,
          },
        });
      }
    } catch {
      /* ignore corrupt or blocked storage */
    }
    set({ hydrated: true });
  },

  reset: () => {
    set({ collected: { ...EMPTY } });
    save({ ...EMPTY });
  },
}));

export function countKeys(collected: Record<KeyId, boolean>) {
  return KEY_IDS.filter((k) => collected[k]).length;
}
