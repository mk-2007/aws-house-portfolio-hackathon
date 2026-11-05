"use client";

import { TbEye, TbUser } from "react-icons/tb";
import { useCameraModeStore } from "@/store/cameraModeStore";

export default function CameraModeToggle() {
  const mode = useCameraModeStore((s) => s.mode);
  const toggle = useCameraModeStore((s) => s.toggle);
  const Icon = mode === "first-person" ? TbUser : TbEye;
  const nextMode = mode === "first-person" ? "third-person" : "first-person";

  return (
    <div className="absolute top-16 right-4 z-50 flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        aria-label={`Switch to ${nextMode} camera`}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-paper)]/30 px-3 py-2 text-[var(--color-paper)] backdrop-blur-md hover:bg-[var(--color-masthead)]/60"
        style={{ background: "rgba(18,15,11,0.72)" }}
      >
        <Icon size={17} aria-hidden />
        <span className="font-[family-name:var(--font-bacley)] text-xs tracking-widest uppercase">
          {mode === "first-person" ? "First person" : "Third person"}
        </span>
      </button>
      <span className="rounded-md bg-black/55 px-2 py-1 text-[10px] tracking-wide text-[var(--color-paper)]/80">
        Right-drag to look around
      </span>
    </div>
  );
}
