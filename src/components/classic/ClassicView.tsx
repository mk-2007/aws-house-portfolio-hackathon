"use client";

import { TbCube } from "react-icons/tb";
import ContentSections from "./ContentSections";
import { useAppStore } from "@/store/appStore";

/**
 * Visible text-only version of the portfolio: fast, mobile friendly,
 * keyboard and screen-reader friendly. Same newspaper look as the house.
 */
export default function ClassicView() {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[var(--color-paper)] text-[var(--color-ink)]">
      <nav
        aria-label="Sections"
        className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 border-b-2 border-[var(--color-ink)] bg-[var(--color-paper)]"
      >
        <span className="font-[family-name:var(--font-bacley)] tracking-widest uppercase text-[var(--color-masthead)]">
          The Mahandar Times
        </span>
        <a href="#about" className="underline-offset-4 hover:underline">About</a>
        <a href="#skills" className="underline-offset-4 hover:underline">Skills</a>
        <a href="#projects" className="underline-offset-4 hover:underline">Projects</a>
        <a href="#contact" className="underline-offset-4 hover:underline">Contact</a>
        <button
          onClick={() => setView("house")}
          className="ml-auto inline-flex items-center gap-2 border border-[var(--color-ink)] px-3 py-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-masthead)]"
        >
          <TbCube size={18} aria-hidden /> Enter the 3D house
        </button>
      </nav>

      <main className="classic-prose mx-auto max-w-3xl px-5 py-8 leading-relaxed">
        <ContentSections />
      </main>
    </div>
  );
}
