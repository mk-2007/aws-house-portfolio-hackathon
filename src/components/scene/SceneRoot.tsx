"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping, HueSaturation, BrightnessContrast, SMAA } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import SpaceWorld from "@/components/space/SpaceWorld";
import Corridor from "./Corridor";
import HomeRoom from "./rooms/HomeRoom";
import SkillsRoom from "./rooms/SkillsRoom";
import ProjectsRoom from "./rooms/ProjectsRoom";
import AboutRoom from "./rooms/AboutRoom";
import AtticRoom from "./rooms/AtticRoom";
import Player from "./Player";
import TransitionOverlay from "./TransitionOverlay";
import SceneErrorBoundary from "./SceneErrorBoundary";
import { useState } from "react";
import { useSpaceStore } from "@/store/spaceStore";
import { SPAWN_POSITION, EYE_HEIGHT } from "./corridorLayout";

/**
 * The persistent 3D root — one Canvas for the whole visit, corridor and
 * every room included. Swapping `space` swaps which group renders inside
 * it instead of mounting a new Canvas, so there's never a WebGL context
 * re-init or asset reload between spaces, just the fade in
 * TransitionOverlay masking the swap.
 *
 * Each space is wrapped in its own SceneErrorBoundary — a bug in one
 * room can't take down the whole Canvas (Player/lighting keep running),
 * and it surfaces to a visible banner instead of an unexplained blank
 * screen (see renderErrorStore.ts / RenderErrorBanner.tsx).
 */
export default function SceneRoot() {
  const space = useSpaceStore((s) => s.space);
  // Adaptive quality: drop pixel density if the frame rate sags (see PerformanceMonitor).
  const [highQuality, setHighQuality] = useState(true);

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        dpr={highQuality ? [1, 1.5] : 1}
        camera={{
          position: [SPAWN_POSITION[0], EYE_HEIGHT, SPAWN_POSITION[2]],
          fov: 60,
        }}
      >
        {/* Explicit scene background - the canvas is transparent by default,
            so without this any part of the frustum not covered by geometry
            shows through to the page background instead of staying "in world." */}
        <PerformanceMonitor flipflops={2} onDecline={() => setHighQuality(false)} />
        <color attach="background" args={["#02030a"]} />
        {/* the sky, planet and sun outside the windows (shared with the intro) */}
        <SpaceWorld />
        {space === "corridor" && (
          <SceneErrorBoundary label="corridor">
            <Corridor />
          </SceneErrorBoundary>
        )}
        {space === "home" && (
          <SceneErrorBoundary label="home">
            <HomeRoom />
          </SceneErrorBoundary>
        )}
        {space === "skills" && (
          <SceneErrorBoundary label="skills">
            <SkillsRoom />
          </SceneErrorBoundary>
        )}
        {space === "projects" && (
          <SceneErrorBoundary label="projects">
            <ProjectsRoom />
          </SceneErrorBoundary>
        )}
        {space === "about" && (
          <SceneErrorBoundary label="about">
            <AboutRoom />
          </SceneErrorBoundary>
        )}
        {space === "attic" && (
          <SceneErrorBoundary label="attic">
            <AtticRoom />
          </SceneErrorBoundary>
        )}
        <Player />

        {/* the same film grade as the intro: tone curve, bloom, slight desaturation */}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <HueSaturation saturation={-0.06} />
          <BrightnessContrast brightness={-0.01} contrast={0.1} />
          <SMAA />
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
        </EffectComposer>
      </Canvas>
      <TransitionOverlay />
    </div>
  );
}
