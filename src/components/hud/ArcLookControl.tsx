"use client";

import { useRef, useState } from "react";
import { useLookStore, ARC_RANGE } from "@/store/lookStore";
import { TbChevronLeft, TbChevronRight, TbEye } from "react-icons/tb";

/**
 * Modernized, compact room look rotator / compass dial.
 * Perfectly proportioned (~260px wide, ~48px high), non-intrusive,
 * and positioned comfortably above the navigation bar so it never
 * obstructs wall portraits or room aesthetics.
 */
export default function ArcLookControl() {
  const angle = useLookStore((s) => s.angle);
  const setAngle = useLookStore((s) => s.setAngle);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const TRACK_WIDTH = 260;
  const TRACK_HEIGHT = 44;
  const PUCK_WIDTH = 34;

  function updateFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setAngle((t * 2 - 1) * ARC_RANGE);
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  }

  function handlePointerUp() {
    setDragging(false);
  }

  function stepAngle(direction: number) {
    const step = 0.25;
    const next = Math.min(ARC_RANGE, Math.max(-ARC_RANGE, angle + direction * step));
    setAngle(next);
  }

  const t = angle / ARC_RANGE / 2 + 0.5; // 0..1
  const puckX = t * (TRACK_WIDTH - PUCK_WIDTH);

  return (
    <div
      className="absolute bottom-22 left-1/2 -translate-x-1/2 z-20 select-none touch-none flex flex-col items-center gap-1"
      style={{ width: TRACK_WIDTH + 40 }}
    >
      {/* Subtle label with look icon */}
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[var(--color-paper)]/75 font-[family-name:var(--font-bacley)]">
        <TbEye size={12} className="text-[#a8791f]" />
        <span>Rotate View &bull; A / D or Drag</span>
      </div>

      {/* Control Dial Bar */}
      <div className="flex items-center gap-1.5 w-full justify-center">
        {/* Left quick nudge */}
        <button
          onClick={() => stepAngle(-1)}
          aria-label="Look Left"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] hover:bg-[var(--color-paper)]/15 transition-colors border border-[var(--color-paper)]/20 backdrop-blur-md bg-[rgba(18,15,11,0.7)]"
        >
          <TbChevronLeft size={16} />
        </button>

        {/* The Track */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative cursor-pointer rounded-xl border border-[var(--color-paper)]/25 backdrop-blur-md overflow-hidden"
          style={{
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            background: "linear-gradient(180deg, rgba(28,23,18,0.85) 0%, rgba(16,13,10,0.92) 100%)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Degree Ticks */}
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none opacity-30">
            {[-2, -1, 0, 1, 2].map((tick) => (
              <div
                key={tick}
                className="w-0.5 rounded-full"
                style={{
                  height: tick === 0 ? "14px" : "8px",
                  background: tick === 0 ? "#c9a34a" : "var(--color-paper)",
                }}
              />
            ))}
          </div>

          {/* Sliding Puck Indicator */}
          <div
            className="absolute top-1 bottom-1 rounded-lg pointer-events-none flex items-center justify-center transition-transform"
            style={{
              width: PUCK_WIDTH,
              left: 4 + puckX,
              background: dragging
                ? "linear-gradient(135deg, #c9a34a 0%, #7a2620 100%)"
                : "linear-gradient(135deg, #dfbc6d 0%, #a8791f 100%)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.7), 0 0 12px rgba(201,163,74,0.35)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <div className="w-1 h-3.5 bg-black/40 rounded-full" />
          </div>
        </div>

        {/* Right quick nudge */}
        <button
          onClick={() => stepAngle(1)}
          aria-label="Look Right"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] hover:bg-[var(--color-paper)]/15 transition-colors border border-[var(--color-paper)]/20 backdrop-blur-md bg-[rgba(18,15,11,0.7)]"
        >
          <TbChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
