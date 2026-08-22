"use client";

import React from "react";
import { Html } from "@react-three/drei";

interface FramedWallPortraitProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  frameWidth?: number;
  frameHeight?: number;
  woodColor?: string;
  goldAccent?: boolean;
  children: React.ReactNode;
}

/**
 * Reusable 3D Framed Wall Portrait Component.
 * Mounts flush onto room walls with a physical wooden frame, metallic inner bevel,
 * and high-resolution, ultra-crisp HTML content on a genuine 3D plane.
 */
export default function FramedWallPortrait({
  position,
  rotation = [0, 0, 0],
  frameWidth = 4.2,
  frameHeight = 3.2,
  woodColor = "#3c2817",
  goldAccent = true,
  children,
}: FramedWallPortraitProps) {
  const borderThickness = 0.12;
  const depth = 0.08;

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Wooden Picture Frame */}
      <mesh position={[0, 0, -0.01]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, frameHeight, depth]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Inner Metallic Gold/Brass Bevel Liner */}
      {goldAccent && (
        <mesh position={[0, 0, depth / 2 - 0.015]}>
          <boxGeometry args={[frameWidth - borderThickness, frameHeight - borderThickness, 0.03]} />
          <meshStandardMaterial color="#c9a34a" metalness={0.65} roughness={0.35} />
        </mesh>
      )}

      {/* Frame Canvas Backing Matboard */}
      <mesh position={[0, 0, depth / 2]}>
        <planeGeometry args={[frameWidth - borderThickness * 1.8, frameHeight - borderThickness * 1.8]} />
        <meshStandardMaterial color="#1a1510" roughness={0.9} />
      </mesh>

      {/* Ultra-Crisp High-DPI HTML Surface on Wall Plane */}
      <Html
        position={[0, 0, depth / 2 + 0.03]}
        transform
        distanceFactor={4}
        center
        occlude
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: "auto",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <div className="select-none flex flex-col justify-center">{children}</div>
      </Html>
    </group>
  );
}
