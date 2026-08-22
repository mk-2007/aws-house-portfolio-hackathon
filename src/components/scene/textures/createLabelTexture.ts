import * as THREE from "three";

/**
 * Bakes text onto a canvas and returns it as a texture. Used where a
 * label needs to be a REAL part of a 3D object (so it's rigidly fixed
 * to that object's position/rotation, never floats free or billboards)
 * rather than a separate Html overlay anchored near it.
 */
export function createLabelTexture(
  text: string,
  opts?: { width?: number; height?: number; bg?: string; fg?: string; fontPx?: number; border?: string }
): THREE.CanvasTexture {
  const width = opts?.width ?? 512;
  const height = opts?.height ?? 160;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = opts?.bg ?? "#ece6d8";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = opts?.border ?? "#1a1714";
  ctx.lineWidth = Math.max(4, width * 0.012);
  ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, width - ctx.lineWidth * 2, height - ctx.lineWidth * 2);

  ctx.fillStyle = opts?.fg ?? "#1a1714";
  ctx.font = `700 ${opts?.fontPx ?? 64}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Manual letter-spacing (Canvas2D's `letterSpacing` isn't reliably
  // supported everywhere yet) — draw each character with a fixed gap.
  const spaced = text.toUpperCase().split("").join("\u200a\u200a");
  ctx.fillText(spaced, width / 2, height / 2 + height * 0.02);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
