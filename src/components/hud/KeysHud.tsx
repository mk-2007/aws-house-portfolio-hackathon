"use client";

import { useEffect } from "react";
import { TbKey, TbKeyOff } from "react-icons/tb";
import { useKeysStore, countKeys, KEY_IDS } from "@/store/keysStore";

/**
 * The visible hint that this house hides something: a newspaper-style
 * badge "EXTRA EDITION - keys 0/3" (top-left) that pulses until the first
 * key is found, plus a toast line for feedback. aria-live lets screen
 * readers announce progress.
 */
export default function KeysHud() {
  const collected = useKeysStore((s) => s.collected);
  const toast = useKeysStore((s) => s.toast);
  const hydrate = useKeysStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const n = countKeys(collected);

  return (
    <>
      <div
        className={`absolute top-4 left-4 z-50 select-none rounded-xl px-3 py-2 backdrop-blur-md border border-[var(--color-paper)]/30 text-[var(--color-paper)] ${n === 0 ? "keys-pulse" : ""}`}
        style={{ background: "rgba(18,15,11,0.72)" }}
        title="Three brass keys are hidden in this house. Find them all to unlock the attic."
      >
        <div className="font-[family-name:var(--font-bacley)] tracking-[0.18em] uppercase text-[10px] text-[var(--color-paper)]/70">
          Extra edition &bull; hidden keys
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {n === 3 ? <TbKey size={20} className="text-[#ffd978]" aria-hidden /> : <TbKeyOff size={20} aria-hidden />}
          <span className="font-[family-name:var(--font-bacley)] text-lg tracking-widest">{n}/3</span>
          <span className="flex gap-1" aria-hidden>
            {KEY_IDS.map((k) => (
              <span
                key={k}
                className="inline-block w-2.5 h-2.5 rounded-full border border-[var(--color-paper)]/60"
                style={{ background: collected[k] ? "#ffd978" : "transparent" }}
              />
            ))}
          </span>
        </div>
      </div>

      <div
        aria-live="polite"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw]"
      >
        {toast && (
          <div
            className="rounded-lg px-4 py-2.5 text-center text-sm font-[family-name:var(--font-bacley)] tracking-wide border border-[#ffd978]/60 text-[var(--color-paper)]"
            style={{ background: "rgba(18,15,11,0.9)", animation: "fadeInUp .35s ease-out" }}
          >
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
