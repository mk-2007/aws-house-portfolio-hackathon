"use client";

import { useEffect } from "react";
import { TbX } from "react-icons/tb";
import { ATTIC } from "@/content/atticContent";
import { LINKS } from "@/content/siteContent";
import { useAtticRewardStore } from "@/store/atticRewardStore";

const REWARD_LINKS = LINKS.filter((link) =>
  ["GitHub", "LinkedIn", "Email"].includes(link.label)
);

export default function AtticRewardOverlay() {
  const isOpen = useAtticRewardStore((s) => s.isOpen);
  const close = useAtticRewardStore((s) => s.close);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  return (
    <>
      <div className="absolute top-24 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-[#ffd978]/45 bg-[rgba(18,15,11,0.82)] px-4 py-2 text-center text-xs tracking-wide text-[var(--color-paper)] shadow-lg">
        Optional final challenge: open a brass trunk to reveal the attic keepsake.
      </div>
      {isOpen && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 p-5"
          onClick={close}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="attic-reward-title"
            className="relative w-full max-w-xl border border-[#c9a34a]/70 bg-[var(--color-paper)] p-7 text-[var(--color-ink)] shadow-2xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close attic keepsake"
              className="absolute right-4 top-4 rounded-lg border border-[var(--color-ink)]/25 p-2 hover:bg-black/5"
            >
              <TbX size={18} />
            </button>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--color-masthead)]">
              Attic keepsake
            </p>
            <h2
              id="attic-reward-title"
              className="mb-4 font-[family-name:var(--font-bacley)] text-3xl sm:text-4xl"
            >
              {ATTIC.rewardTitle}
            </h2>
            <p className="mb-7 leading-relaxed text-[var(--color-ink)]/85">
              {ATTIC.rewardStory}
            </p>
            <div className="flex flex-wrap gap-3">
              {REWARD_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="border border-[var(--color-ink)]/35 px-4 py-2 text-sm hover:bg-[var(--color-masthead)]/10"
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="mt-7 text-xs text-[var(--color-ink)]/60">
              Close this note to keep exploring. Press Escape at any time.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
