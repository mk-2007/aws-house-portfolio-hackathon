"use client";

/**
 * Synthesizes soft, randomized "keyboard click" bursts entirely client-
 * side via Web Audio — no external sound file to source, license, or
 * host. A short decaying noise burst through a high-pass filter reads
 * as a soft key click; several scattered over a duration reads as
 * ambient typing.
 */
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    sharedCtx = new AudioCtor();
  }
  return sharedCtx;
}

function scheduleClick(ctx: AudioContext, time: number) {
  const durationSec = 0.02;
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2200 + Math.random() * 800;

  const gain = ctx.createGain();
  gain.gain.value = 0.045;

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(time);
}

/** Plays `clickCount` soft clicks scattered randomly across `durationMs`. */
export function playTypingSound(durationMs: number, clickCount = 16) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  for (let i = 0; i < clickCount; i++) {
    scheduleClick(ctx, now + (Math.random() * durationMs) / 1000);
  }
}
