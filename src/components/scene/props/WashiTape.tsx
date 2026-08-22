"use client";

/** A diagonal strip of "washi tape" — pure maximalist decoration, pinning
 *  down a panel's corner instead of leaving edges clean/floating. Shared
 *  across every room's Html panels for a consistent house-wide look. */
export default function WashiTape({
  top,
  left,
  rotate,
  color = "rgba(122,38,32,0.55)",
}: {
  top: number | string;
  left: number | string;
  rotate: number;
  color?: string;
}) {
  return (
    <div
      className="absolute w-16 h-6 pointer-events-none"
      style={{
        top,
        left,
        transform: `rotate(${rotate}deg)`,
        background: color,
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    />
  );
}
