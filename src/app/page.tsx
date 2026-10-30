"use client";

import SceneRoot from "@/components/scene/SceneRoot";
import WelcomeScreen from "@/components/welcome/WelcomeScreen";
import NavigationMenu from "@/components/hud/NavigationMenu";
import ArcLookControl from "@/components/hud/ArcLookControl";
import KeyboardControls from "@/components/hud/KeyboardControls";
import RenderErrorBanner from "@/components/hud/RenderErrorBanner";
import ProjectDetailOverlay from "@/components/hud/ProjectDetailOverlay";
import AboutObjectOverlay from "@/components/hud/AboutObjectOverlay";
import ClassicView from "@/components/classic/ClassicView";
import SeoContent from "@/components/classic/SeoContent";
import ViewToggle from "@/components/hud/ViewToggle";
import KeysHud from "@/components/hud/KeysHud";
import { useAppStore } from "@/store/appStore";
import { useSpaceStore } from "@/store/spaceStore";

export default function Home() {
  const stage = useAppStore((s) => s.stage);
  const view = useAppStore((s) => s.view);
  const space = useSpaceStore((s) => s.space);
  const inHouse = stage === "corridor"; // past the welcome door

  return (
    <main className="relative flex-1 min-h-0 flex flex-col">
      {/* Text copy for crawlers / AI scorers (hidden, in the static HTML). */}
      <SeoContent />
      {view === "classic" && <ClassicView />}
      {view === "house" && <ViewToggle />}
      {view === "house" && inHouse && <KeysHud />}
      {stage === "welcome" && <WelcomeScreen />}
      {/* Corridor stays mounted the whole time — no reload when the
          welcome screen fades away, it's just been covered until now. */}
      <div className="flex-1">
        <SceneRoot />
      </div>
      {/* Navigation is menu-driven everywhere: the room-select "directory
          board" in the corridor, exit/jump-to-room actions inside any
          room — same component, consistent styling either way. The arc
          look control only applies inside a room (rooms have zero
          translation, corridor has zero free-look). */}
      {inHouse && <NavigationMenu />}
      {inHouse && space !== "corridor" && <ArcLookControl />}
      {inHouse && <KeyboardControls />}
      <ProjectDetailOverlay />
      <AboutObjectOverlay />
      <RenderErrorBanner />
    </main>
  );
}
