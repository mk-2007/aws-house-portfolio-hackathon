"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** A soft radial glow drawn once into a canvas and used as a sprite texture. */
function radialTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.25, outer);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A wide, thin horizontal streak: the "anamorphic lens flare" of space films. */
function streakTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 32;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "rgba(120,170,255,0)");
  grad.addColorStop(0.5, "rgba(190,215,255,0.95)");
  grad.addColorStop(1, "rgba(120,170,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 32);
  const fade = g.createLinearGradient(0, 0, 0, 32);
  fade.addColorStop(0, "rgba(0,0,0,1)");
  fade.addColorStop(0.5, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,1)");
  g.globalCompositeOperation = "destination-out";
  g.fillStyle = fade;
  g.fillRect(0, 0, 512, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function Sun({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const { core, halo, streak } = useMemo(
    () => ({
      core: radialTexture("rgba(255,255,245,1)", "rgba(255,226,170,0.55)"),
      halo: radialTexture("rgba(255,190,120,0.22)", "rgba(255,140,70,0.07)"),
      streak: streakTexture(),
    }),
    []
  );
  return (
    <group position={position} scale={scale}>
      <sprite scale={[95, 95, 1]}>
        <spriteMaterial map={halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
      </sprite>
      <sprite scale={[36, 36, 1]}>
        <spriteMaterial map={core} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
      </sprite>
      <sprite scale={[170, 5, 1]}>
        <spriteMaterial map={streak} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} opacity={0.55} fog={false} />
      </sprite>
    </group>
  );
}
