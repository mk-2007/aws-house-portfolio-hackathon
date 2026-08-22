"use client";

import * as THREE from "three";
import {
  CORRIDOR_START_Z,
  CORRIDOR_END_Z,
  WALL_HEIGHT,
} from "../corridorLayout";

const CORRIDOR_LENGTH = CORRIDOR_END_Z - CORRIDOR_START_Z;

/**
 * Creates a modern, high-end architectural gallery wall texture.
 * Features warm refined linen plaster upper wall, brass picture molding,
 * and rich architectural wood wainscoting on the lower third.
 */
export function createNewspaperTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Upper Gallery Wall: Warm refined plaster/linen background
  ctx.fillStyle = "#ede8de";
  ctx.fillRect(0, 0, width, height);

  // Subtle linen / plaster texture grain
  const imgData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
    imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
    imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Picture Hanging Rail near ceiling (y = 120)
  ctx.fillStyle = "#2c1d12";
  ctx.fillRect(0, 120, width, 14);
  ctx.fillStyle = "#c9a34a"; // Brass inlay
  ctx.fillRect(0, 134, width, 4);

  // Subtle vertical gallery panel dividers in upper section
  ctx.strokeStyle = "rgba(180, 170, 155, 0.45)";
  ctx.lineWidth = 2;
  for (let x = 128; x < width; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 140);
    ctx.lineTo(x, 620);
    ctx.stroke();
  }

  // Wainscoting Chair Rail Molding (y = 620 to 650)
  const chairRailY = 620;
  ctx.fillStyle = "#c9a34a"; // Gold top accent
  ctx.fillRect(0, chairRailY, width, 5);

  ctx.fillStyle = "#342216"; // Dark walnut cap
  ctx.fillRect(0, chairRailY + 5, width, 22);

  ctx.fillStyle = "#4a3322"; // Mid-tone bevel
  ctx.fillRect(0, chairRailY + 27, width, 8);

  // Wainscot Lower Wall (y = 655 to 1024): Rich Warm Oak / Walnut Wood Paneling
  ctx.fillStyle = "#3c281a";
  ctx.fillRect(0, chairRailY + 35, width, height - (chairRailY + 35));

  // Wainscot Recessed Panels
  const panelCount = 4;
  const panelGap = 24;
  const panelWidth = (width - panelGap * (panelCount + 1)) / panelCount;
  const panelTop = chairRailY + 55;
  const panelBottom = height - 55;
  const panelHeight = panelBottom - panelTop;

  for (let p = 0; p < panelCount; p++) {
    const px = panelGap + p * (panelWidth + panelGap);

    // Outer shadow / bevel
    ctx.fillStyle = "#24160e";
    ctx.fillRect(px, panelTop, panelWidth, panelHeight);

    // Inner panel face
    ctx.fillStyle = "#452e1f";
    ctx.fillRect(px + 8, panelTop + 8, panelWidth - 16, panelHeight - 16);

    // Inner highlight border
    ctx.strokeStyle = "rgba(201, 163, 74, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px + 12, panelTop + 12, panelWidth - 24, panelHeight - 24);
  }

  // Baseboard Molding at bottom (y = height - 40)
  ctx.fillStyle = "#26170e";
  ctx.fillRect(0, height - 40, width, 40);
  ctx.fillStyle = "#c9a34a";
  ctx.fillRect(0, height - 40, width, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  // Repeat neatly along corridor length
  texture.repeat.set(CORRIDOR_LENGTH / 6, 1);
  return texture;
}
