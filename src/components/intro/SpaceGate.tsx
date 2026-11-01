"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAppStore } from "@/store/appStore";
import SpaceDoorScene from "./SpaceDoorScene";
import type { DoorProgress } from "./AnywhereDoor";

/**
 * First screen: a drone shot through a corner of space that arrives at a
 * lone door.
 *
 * It plays like a short film:
 *   0.0s  the camera starts far out; the title card fades in over the flight
 *   ~4s   title fades out as the camera swings toward the door
 *   ~7s   the camera settles; the invitation and button appear
 *   click the door (or button) -> knob turns, door swings open, camera dives in
 *
 * Layers: the 3D scene (WebGL canvas) and this DOM text on top. DOM text stays
 * crisp and screen-reader friendly. "Skip intro" is always available, and a
 * click during the flight simply finishes the flight first.
 */
export default function SpaceGate() {
  const enterCorridor = useAppStore((s) => s.enterCorridor);
  const progress = useRef<DoorProgress>({ intro: 0, knob: 0, open: 0, fly: 0 });
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<gsap.core.Tween | null>(null);
  const [entering, setEntering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A timed film should keep real time. By default GSAP slows itself down on
    // laggy frames; switching that off means a slow machine drops frames
    // instead of stretching the story.
    gsap.ticker.lagSmoothing(0);

    if (reduce) {
      progress.current.intro = 1;
      gsap.set(ctaRef.current, { opacity: 1 });
      setCtaVisible(true);
      return () => {
        gsap.ticker.lagSmoothing(500, 33);
      };
    }

    const tl = gsap.timeline({ delay: 0.6 });
    flightRef.current = gsap.to(progress.current, { intro: 1, duration: 9.5, ease: "power1.inOut", delay: 0.6 });
    tl.fromTo(titleRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, 0.4)
      .to(titleRef.current, { opacity: 0, y: -10, duration: 1.2, ease: "power2.in" }, 4.6)
      .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", onStart: () => setCtaVisible(true) }, 7.6);

    return () => {
      tl.kill();
      flightRef.current?.kill();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  function handleEnter() {
    if (entering) return;
    setEntering(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: enterCorridor });

    tl.to([titleRef.current, ctaRef.current], { opacity: 0, y: 16, duration: 0.5, ease: "power2.in" });
    if (reduce) {
      tl.to(flashRef.current, { opacity: 1, duration: 0.4 });
      return;
    }
    // If clicked mid-flight, land the camera first, then open the door.
    flightRef.current?.kill();
    const landing = Math.max(0, (1 - progress.current.intro) * 1.4);
    tl.to(progress.current, { intro: 1, duration: landing || 0.01, ease: "power2.out" }, 0);
    const t0 = landing;
    tl.to(progress.current, { knob: 1, duration: 0.4, ease: "power2.out" }, t0 + 0.1)
      .to(progress.current, { open: 1, duration: 1.4, ease: "power2.inOut" }, t0 + 0.45)
      .to(progress.current, { fly: 1, duration: 1.9, ease: "power3.in" }, t0 + 1.5)
      .to(flashRef.current, { opacity: 1, duration: 0.4, ease: "power2.in" }, t0 + 2.95);
  }

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden select-none transition-opacity duration-700"
      style={{ opacity: mounted ? 1 : 0, background: "#02030a" }}
    >
      <SpaceDoorScene progress={progress} onOpen={handleEnter} />

      {/* title card, shown while the camera flies in */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-x-0 top-[14%] text-center px-4"
        style={{ opacity: 0 }}
      >
        <div
          className="mb-3 font-[family-name:var(--font-bacley)] uppercase text-[#7fe0e4]/90"
          style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.85rem)", letterSpacing: "0.5em" }}
        >
          Signal received
        </div>
        <div
          className="font-[family-name:var(--font-bacley)] uppercase text-[#f2f8ff]"
          style={{ fontSize: "clamp(1.6rem, 6vw, 4.2rem)", letterSpacing: "0.28em", textShadow: "0 0 30px rgba(255,255,255,0.35)" }}
        >
          Mahandar Kumar
        </div>
      </div>

      {/* the invitation, shown once the camera has arrived */}
      <div
        ref={ctaRef}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-10 px-4"
        style={{ opacity: 0, pointerEvents: ctaVisible ? "auto" : "none" }}
      >
        <p
          className="font-[family-name:var(--font-bacley)] uppercase text-center text-[#fff7ea]"
          style={{ fontSize: "clamp(1rem, 2.6vw, 1.7rem)", letterSpacing: "0.22em", textShadow: "0 2px 18px rgba(0,0,0,0.9)" }}
        >
          Come and get your surprise
        </p>
        <button
          onClick={handleEnter}
          disabled={entering}
          className="gate-button font-[family-name:var(--font-bacley)] uppercase tracking-[0.3em] text-[#1c1206] bg-[#ffd9a0] px-8 py-3 rounded-sm hover:bg-white transition-colors disabled:opacity-60"
          style={{ fontSize: "clamp(0.8rem, 1.6vw, 1.05rem)" }}
        >
          Open the door
        </button>
        <p className="text-[#c9d6f0]/80 text-xs tracking-widest uppercase text-center" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
          Three keys &bull; one vault &bull; a message from Anonymous
        </p>
      </div>

      {/* skip is available from the very first frame */}
      <button
        onClick={enterCorridor}
        disabled={entering}
        className="absolute bottom-3 right-4 text-[#9fb4d9]/70 text-xs tracking-widest uppercase underline underline-offset-4 hover:text-white"
      >
        Skip intro
      </button>

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0, background: "radial-gradient(circle, #ffffff 0%, #fff0d8 55%, #ffd49a 100%)" }}
      />
    </div>
  );
}
