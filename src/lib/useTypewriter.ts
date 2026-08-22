"use client";

import { useEffect, useState } from "react";

/**
 * Reveals `text` one character at a time. Runs once per mount (a room
 * component mounts fresh every time you enter it, since SceneRoot
 * conditionally renders it — that mount IS the "just walked in" signal,
 * no extra trigger needed).
 */
export function useTypewriter(text: string, speedMs = 70): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setOutput(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speedMs);
    return () => clearInterval(interval);
    // Intentionally only re-runs if the text itself changes — a fresh
    // mount already resets `i`/`output` above.
  }, [text, speedMs]);

  return output;
}
