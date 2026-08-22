"use client";

import { useProjectTankStore } from "@/store/projectTankStore";
import { PROJECTS } from "@/components/scene/rooms/projectsData";
import { TechTag } from "@/components/scene/props/techIcons";

const STICKERS = ["⭐", "🚀", "💻"];

const CURTAIN_STYLE = {
  background:
    "repeating-linear-gradient(90deg, #4a0f0c 0px, #6b1712 22px, #4a0f0c 44px), linear-gradient(#5c130f, #3a0c09)",
  boxShadow: "inset -20px 0 60px rgba(0,0,0,0.6)",
};

/**
 * A plain DOM overlay (not an in-3D Html panel) so the detail view is
 * always fully readable regardless of camera angle or distance from the
 * chest. Opens with a movie-curtain reveal: two velvet panels slide
 * apart from center. The reveal timing is pure CSS keyframe animation
 * (see globals.css) restarted via `key={project.id}` on remount, rather
 * than JS-toggled state — avoids a setState-in-effect for something
 * that's purely a one-shot mount animation. Sized as a real fraction of
 * the viewport (not a small fixed max-width) so it actually reads as a
 * proper full-screen reveal, not a tiny card floating in a lot of curtain.
 */
export default function ProjectDetailOverlay() {
  const openId = useProjectTankStore((s) => s.openId);
  const close = useProjectTankStore((s) => s.close);
  const project = PROJECTS.find((p) => p.id === openId);
  if (!project) return null;

  return (
    <div key={project.id} className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ ...CURTAIN_STYLE, animation: "curtainOpenLeft 0.7s cubic-bezier(0.65,0,0.35,1) forwards" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ ...CURTAIN_STYLE, animation: "curtainOpenRight 0.7s cubic-bezier(0.65,0,0.35,1) forwards" }}
      />

      <div
        className="relative bg-[var(--color-paper)] text-[var(--color-ink)] select-none"
        style={{
          width: "min(90vw, 820px)",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: "clamp(1.8rem, 4vw, 3rem)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          opacity: 0,
          animation: "revealContent 0.35s ease-out 0.5s forwards",
        }}
      >
        {STICKERS.map((s, i) => (
          <span
            key={s}
            className="absolute select-none"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              top: i === 1 ? "auto" : -18,
              bottom: i === 1 ? -16 : "auto",
              left: i === 0 ? -16 : i === 1 ? "50%" : "auto",
              right: i === 2 ? -16 : "auto",
              transform: i === 1 ? "translateX(-50%) rotate(-6deg)" : `rotate(${i === 0 ? -12 : 10}deg)`,
            }}
          >
            {s}
          </span>
        ))}

        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 flex items-center justify-center border border-[var(--color-ink)]/30 text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"
          style={{ width: "clamp(2rem, 3vw, 2.6rem)", height: "clamp(2rem, 3vw, 2.6rem)" }}
        >
          ✕
        </button>

        <p
          className="font-[family-name:var(--font-spirtush)] uppercase tracking-widest text-[var(--color-masthead)] mb-1"
          style={{ fontSize: "clamp(0.8rem, 1.1vw, 1rem)" }}
        >
          {project.tagline}
        </p>
        <h2
          className="font-[family-name:var(--font-bacley)] tracking-wide mb-5 pr-10"
          style={{ fontSize: "clamp(1.8rem, 3.6vw, 3rem)" }}
        >
          {project.name}
        </h2>

        <p className="text-[var(--color-ink)]/85 leading-relaxed mb-6" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
          {project.description}
        </p>

        <p
          className="font-[family-name:var(--font-bacley)] tracking-widest uppercase text-[var(--color-ink)]/55 mb-2"
          style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)" }}
        >
          Built With
        </p>
        <div className="flex flex-wrap gap-2.5 mb-7">
          {project.stack.map((tech) => (
            <TechTag key={tech} label={tech} />
          ))}
        </div>

        <div className="pt-5 border-t border-[var(--color-ink)]/30">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-[family-name:var(--font-bacley)] tracking-wide bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-masthead)]"
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)", padding: "0.7em 1.4em" }}
            >
              View on GitHub →
            </a>
          ) : (
            <p className="text-[var(--color-ink)]/50 italic" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
              Not yet public
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
