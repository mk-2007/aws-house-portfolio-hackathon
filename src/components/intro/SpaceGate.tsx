"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAppStore } from "@/store/appStore";
import SpaceGateScene, { type GateProgress } from "./SpaceGateScene";

/**
 * First screen: a dark gate floating in space.
 *
 * Two layers:
 *  1. SpaceGateScene - the 3D gate (WebGL canvas, transparent so the CSS
 *     nebula behind it shows through).
 *  2. This component's DOM text and button on top. DOM text stays crisp,
 *     selectable and screen-reader friendly, which a 3D-drawn label is not.
 *
 * Clicking the button runs one GSAP timeline that tweens the shared
 * `progress` object (doors open, then the camera flies through) and finally
 * hands off to the next stage. "Skip intro" jumps straight past it, so no
 * visitor (or judge) is ever stuck watching an animation.
 */
export default function SpaceGate() {
  const enterCorridor = useAppStore((s) => s.enterCorridor);
  const progress = useRef<GateProgress>({ open: 0, fly: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fade the whole scene in once the browser has painted, so the first
  // paint is never a flash of an empty black canvas.
  useEffect(() => setMounted(true), []);

  function handleEnter() {
    if (entering) return;
    setEntering(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: enterCorridor });

    tl.to(textRef.current, { opacity: 0, y: 18, duration: 0.5, ease: "power2.in" });
    if (reduce) {
      // Respect the OS "reduce motion" setting: a quick fade, no flight.
      tl.to(flashRef.current, { opacity: 1, duration: 0.4 });
      return;
    }
    tl.to(progress.current, { open: 1, duration: 1.5, ease: "power2.inOut" }, 0.15)
      .to(progress.current, { fly: 1, duration: 2.1, ease: "power3.in" }, 1.05)
      .to(flashRef.current, { opacity: 1, duration: 0.45, ease: "power2.in" }, 2.7);
  }

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-30 overflow-hidden select-none transition-opacity duration-700"
      style={{
        opacity: mounted ? 1 : 0,
        background:
          "radial-gradient(ellipse at 50% 42%, #1a1040 0%, #0a0820 45%, #04030c 100%)",
      }}
    >
      <SpaceGateScene progress={progress} />

      {/* soft vignette so the edges fall into darkness */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,2,8,0.75) 100%)" }}
      />

      <div
        ref={textRef}
        className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-between pt-16 pb-8 md:pt-8 px-4 pointer-events-none"
      >
        <div className="text-center">
          <div
            className="mb-2 font-[family-name:var(--font-bacley)] uppercase text-[#22d3ee]/80"
            style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.85rem)", letterSpacing: "0.5em" }}
          >
            Signal received
          </div>
          <div
            className="font-[family-name:var(--font-bacley)] uppercase text-[#e8f7ff]"
            style={{ fontSize: "clamp(1.5rem, 5vw, 3.4rem)", letterSpacing: "0.28em", textShadow: "0 0 24px rgba(34,211,238,0.55)" }}
          >
            Mahandar Kumar
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 pointer-events-auto">
          <p
            className="font-[family-name:var(--font-bacley)] uppercase text-center text-[#f4ecff]"
            style={{ fontSize: "clamp(1rem, 2.6vw, 1.7rem)", letterSpacing: "0.22em", textShadow: "0 0 20px rgba(124,58,237,0.8)" }}
          >
            Come and get your surprise
          </p>
          <button
            onClick={handleEnter}
            disabled={entering}
            className="gate-button font-[family-name:var(--font-bacley)] uppercase tracking-[0.3em] text-[#04030c] bg-[#22d3ee] px-8 py-3 rounded-sm hover:bg-white transition-colors disabled:opacity-60"
            style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.05rem)" }}
          >
            Open the gate
          </button>
          <p className="text-[#9fb4d9]/80 text-xs tracking-widest uppercase">
            Three keys &bull; one vault &bull; an anonymous message
          </p>
          <button
            onClick={enterCorridor}
            disabled={entering}
            className="text-[#9fb4d9]/70 text-xs tracking-widest uppercase underline underline-offset-4 hover:text-white"
          >
            Skip intro
          </button>
        </div>
      </div>

      {/* white-cyan flash that covers the hand-off to the next scene */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0, background: "radial-gradient(circle, #ffffff 0%, #bff4ff 55%, #22d3ee 100%)" }}
      />
    </div>
  );
}
