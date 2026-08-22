"use client";

import { useAboutObjectStore, type AboutObjectId } from "@/store/aboutObjectStore";
import { TbDownload } from "react-icons/tb";

const CONTENT: Record<AboutObjectId, { icon: string; title: string; body: React.ReactNode }> = {
  laptop: {
    icon: "💻",
    title: "Resume",
    body: (
      <>
        <p className="text-[var(--color-ink)]/85 leading-relaxed mb-5" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}>
          Every project you&apos;ve seen represents a step in my journey as a
          developer. I&apos;m continuously learning, building, and challenging
          myself to create software that is not only functional but
          meaningful.
        </p>
        <a
          href="/mahandar-kumar-resume.pdf"
          download
          className="inline-flex items-center gap-2 font-[family-name:var(--font-bacley)] tracking-wide bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-masthead)]"
          style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)", padding: "0.7em 1.4em" }}
        >
          <TbDownload size={18} />
          Download Resume
        </a>
      </>
    ),
  },
  notebook: {
    icon: "📄",
    title: "About Me",
    body: (
      <p className="text-[var(--color-ink)]/85 leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}>
        Whether it&apos;s developing AI-powered applications, designing
        backend systems, or solving complex programming challenges, I&apos;m
        always excited to take on the next opportunity. This whole house —
        every room, every clipping, every corridor light — is basically
        that same instinct pointed at a portfolio instead of a codebase.
      </p>
    ),
  },
  envelope: {
    icon: "📬",
    title: "Contact",
    body: (
      <div className="flex flex-col gap-2">
        <a
          href="mailto:mk6447959@gmail.com"
          className="flex items-center justify-between border border-[var(--color-ink)]/40 px-3 py-2.5 hover:bg-[var(--color-masthead)]/10"
        >
          <span className="font-[family-name:var(--font-bacley)] text-sm tracking-wide">Email</span>
          <span className="text-[13px] text-[var(--color-ink)]/70">mk6447959@gmail.com</span>
        </a>
        <a
          href="https://github.com/mk-2007"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border border-[var(--color-ink)]/40 px-3 py-2.5 hover:bg-[var(--color-masthead)]/10"
        >
          <span className="font-[family-name:var(--font-bacley)] text-sm tracking-wide">GitHub</span>
          <span className="text-[13px] text-[var(--color-ink)]/70">mk-2007</span>
        </a>
        <a
          href="https://www.linkedin.com/in/mahandarkhatri"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border border-[var(--color-ink)]/40 px-3 py-2.5 hover:bg-[var(--color-masthead)]/10"
        >
          <span className="font-[family-name:var(--font-bacley)] text-sm tracking-wide">LinkedIn</span>
          <span className="text-[13px] text-[var(--color-ink)]/70">mahandarkhatri</span>
        </a>
        <a
          href="https://codeforces.com/profile/_gazzy284"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border border-[var(--color-ink)]/40 px-3 py-2.5 hover:bg-[var(--color-masthead)]/10"
        >
          <span className="font-[family-name:var(--font-bacley)] text-sm tracking-wide">Codeforces</span>
          <span className="text-[13px] text-[var(--color-ink)]/70">_gazzy284</span>
        </a>
        <a
          href="https://leetcode.com/u/struck_high/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border border-[var(--color-ink)]/40 px-3 py-2.5 hover:bg-[var(--color-masthead)]/10"
        >
          <span className="font-[family-name:var(--font-bacley)] text-sm tracking-wide">LeetCode</span>
          <span className="text-[13px] text-[var(--color-ink)]/70">struck_high</span>
        </a>
      </div>
    ),
  },
};

/**
 * Plain DOM overlay (not an in-3D Html panel), same reasoning as the
 * project detail overlay: always fully readable regardless of camera
 * angle. A fade/scale reveal rather than the Projects room's cinema
 * curtain — this room's mood is a quiet desk, not a gallery premiere.
 */
export default function AboutObjectOverlay() {
  const openId = useAboutObjectStore((s) => s.openId);
  const close = useAboutObjectStore((s) => s.close);
  if (!openId) return null;
  const content = CONTENT[openId];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/55" onClick={close}>
      <div
        key={openId}
        className="relative bg-[var(--color-paper)] text-[var(--color-ink)] select-none"
        style={{
          width: "min(85vw, 640px)",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "clamp(1.6rem, 3.4vw, 2.4rem)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          animation: "revealContent 0.3s ease-out forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center border border-[var(--color-ink)]/30 text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"
          style={{ width: "2.2rem", height: "2.2rem" }}
        >
          ✕
        </button>
        <p style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }} className="mb-2">
          {content.icon}
        </p>
        <h2
          className="font-[family-name:var(--font-bacley)] tracking-wide mb-4"
          style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
        >
          {content.title}
        </h2>
        {content.body}
      </div>
    </div>
  );
}
