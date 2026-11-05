import { create } from "zustand";

const STORAGE_KEY = "house-hunt-run-v1";
const MAX_RUN_MS = 24 * 60 * 60 * 1000;

interface SavedRun {
  startedAt: number;
  timeMs: number | null;
  rank: number | null;
}

interface HuntRunState extends SavedRun {
  start: () => void;
  finish: () => void;
  setRank: (rank: number) => void;
  reset: () => void;
}

const EMPTY_RUN: SavedRun = { startedAt: 0, timeMs: null, rank: null };

function readRun(): SavedRun | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const run = parsed as Partial<SavedRun>;
    if (!Number.isFinite(run.startedAt) || (run.startedAt ?? 0) <= 0) return null;
    return {
      startedAt: run.startedAt!,
      timeMs: Number.isInteger(run.timeMs) && (run.timeMs ?? 0) > 0 ? run.timeMs! : null,
      rank: Number.isInteger(run.rank) && (run.rank ?? 0) > 0 ? run.rank! : null,
    };
  } catch {
    return null;
  }
}

function saveRun(run: SavedRun) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
  } catch {
    // The run remains available in memory when browser storage is blocked.
  }
}

export const useHuntRunStore = create<HuntRunState>((set, get) => ({
  ...EMPTY_RUN,
  start: () => {
    const saved = readRun();
    if (saved?.timeMs !== null && saved?.timeMs !== undefined) {
      set(saved);
      return;
    }

    const run = saved ?? { ...EMPTY_RUN, startedAt: Date.now() };
    if (run.startedAt === 0 || Date.now() - run.startedAt > MAX_RUN_MS) {
      run.startedAt = Date.now();
      run.timeMs = null;
      run.rank = null;
    }
    saveRun(run);
    set(run);
  },
  finish: () => {
    const { startedAt, timeMs } = get();
    if (startedAt <= 0 || timeMs !== null) return;
    const run = { ...get(), timeMs: Math.max(0, Date.now() - startedAt) };
    saveRun(run);
    set(run);
  },
  setRank: (rank) => {
    const run = { ...get(), rank };
    saveRun(run);
    set(run);
  },
  reset: () => {
    saveRun(EMPTY_RUN);
    set(EMPTY_RUN);
  },
}));
