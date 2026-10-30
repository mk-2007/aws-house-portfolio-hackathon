"use client";

import { TbArticle } from "react-icons/tb";
import { useAppStore } from "@/store/appStore";

/**
 * Always-visible escape hatch from the 3D house to the plain text version.
 * It is the first focusable element on the page, so keyboard and
 * screen-reader users reach it immediately.
 */
export default function ViewToggle() {
  const setView = useAppStore((s) => s.setView);
  return (
    <button
      onClick={() => setView("classic")}
      aria-label="Switch to classic text view"
      className="absolute top-4 right-4 z-50 inline-flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur-md border border-[var(--color-paper)]/30 text-[var(--color-paper)] hover:bg-[var(--color-masthead)]/60"
      style={{ background: "rgba(18,15,11,0.72)" }}
    >
      <TbArticle size={18} aria-hidden />
      <span className="font-[family-name:var(--font-bacley)] tracking-widest uppercase text-xs">
        Classic view
      </span>
    </button>
  );
}
