/**
 * Behavioral test for the menu-driven navigation rewrite: does clicking
 * a room button actually walk there and enter, does the arc-look
 * control actually rotate the camera while fixed in a room, does exit
 * actually return to the right corridor spot, and does "jump to another
 * room" actually chain through the corridor into the next one.
 *
 * Run: npx tsx scripts/test-navigation.ts
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { pretendToBeVisual: true });
const { window } = dom;
function blackHole(): unknown {
  const fn = (..._a: unknown[]) => blackHole();
  return new Proxy(fn, {
    get: (_t, p) => {
      if (p === "then" || p === "canvas") return undefined;
      if (p === Symbol.toPrimitive) return (h: string) => (h === "number" ? 0 : "");
      if (p === "valueOf") return () => 0;
      if (p === "toString") return () => "";
      if (p === "width" || p === "height") return 0;
      return blackHole();
    },
    set: () => true,
  });
}
type MockableCanvas = { getContext: () => unknown };
(window.HTMLCanvasElement.prototype as unknown as MockableCanvas).getContext = () => blackHole();
Object.defineProperty(globalThis, "navigator", { value: window.navigator, configurable: true });
Object.assign(globalThis, {
  window,
  self: window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  HTMLCanvasElement: window.HTMLCanvasElement,
  requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
});

async function main() {
  const React = await import("react");
  const ReactThreeTestRenderer = (await import("@react-three/test-renderer")).default;
  const THREE = await import("three");
  const { default: Player } = await import("../src/components/scene/Player");
  const { useSpaceStore } = await import("../src/store/spaceStore");
  const { useLookStore } = await import("../src/store/lookStore");
  const { enterRoom, exitToCorridor, jumpToRoom } = await import("../src/lib/roomNavigation");
  const { HOME_SPAWN } = await import("../src/components/scene/rooms/homeLayout");
  const { SKILLS_SPAWN } = await import("../src/components/scene/rooms/skillsLayout");
  const { getCorridorDoorStand } = await import("../src/components/scene/corridorLayout");

  let failures = 0;
  function check(label: string, cond: boolean, detail: string) {
    if (cond) console.log(`PASS  ${label}`);
    else {
      failures++;
      console.error(`FAIL  ${label} — ${detail}`);
    }
  }

  let capturedCamera: import("three").Camera | null = null;
  const { useThree } = await import("@react-three/fiber");
  function CameraCapture() {
    const { camera } = useThree();
    capturedCamera = camera;
    return null;
  }
  const scene = React.createElement(React.Fragment, null, React.createElement(Player), React.createElement(CameraCapture));
  const renderer = await ReactThreeTestRenderer.create(scene);
  await renderer.advanceFrames(1, 16);
  const camera = capturedCamera as import("three").Camera;

  async function settle(frames = 240) {
    for (let i = 0; i < frames; i++) {
      // Simulate TransitionOverlay's job (it's a plain DOM component, so
      // it isn't mounted in this R3F-only test tree): commit any pending
      // transition immediately instead of waiting out its fade timing.
      if (useSpaceStore.getState().requestedSpace) {
        useSpaceStore.getState().commitSpace();
        useSpaceStore.getState().finishTransition();
      }
      await renderer.advanceFrames(1, 16);
    }
  }

  // --- Enter Home from the corridor ---
  enterRoom("home");
  await settle();
  check(
    "enterRoom('home') walks there and transitions in",
    useSpaceStore.getState().space === "home" &&
      Math.abs(camera.position.x - HOME_SPAWN.x) < 0.05 &&
      Math.abs(camera.position.z - HOME_SPAWN.z) < 0.05,
    `space=${useSpaceStore.getState().space}, pos=(${camera.position.x.toFixed(2)}, ${camera.position.z.toFixed(2)})`
  );

  // --- Arc-look rotates the camera while fixed in the room ---
  const posBeforeLook = camera.position.clone();
  useLookStore.getState().setAngle(Math.PI / 2);
  await settle(60);
  const facing = camera.getWorldDirection(new THREE.Vector3());
  check(
    "arc-look angle rotates the camera without moving it",
    camera.position.distanceTo(posBeforeLook) < 1e-6 && Math.abs(facing.x) > 0.9,
    `moved ${camera.position.distanceTo(posBeforeLook)}, facing=(${facing.x.toFixed(2)}, ${facing.z.toFixed(2)})`
  );
  useLookStore.getState().reset();

  // --- Exit back to the corridor, at the correct door ---
  exitToCorridor("home");
  await settle();
  const homeStand = getCorridorDoorStand("home");
  check(
    "exitToCorridor('home') lands at home's door stand",
    useSpaceStore.getState().space === "corridor" &&
      Math.abs(camera.position.x - homeStand.x) < 0.05 &&
      Math.abs(camera.position.z - homeStand.z) < 0.05,
    `space=${useSpaceStore.getState().space}, pos=(${camera.position.x.toFixed(2)}, ${camera.position.z.toFixed(2)})`
  );

  // --- Enter Skills, then jump straight to Projects (chained through the corridor) ---
  enterRoom("skills");
  await settle();
  check("enterRoom('skills') works", useSpaceStore.getState().space === "skills", `space=${useSpaceStore.getState().space}`);

  jumpToRoom("skills", "projects");
  await settle(400); // exit to corridor, then auto-walk the length of it into projects
  check(
    "jumpToRoom('skills','projects') ends up in projects, not stuck in the corridor",
    useSpaceStore.getState().space === "projects",
    `space=${useSpaceStore.getState().space}`
  );
  check("chainTo is cleared after the chained walk completes", useSpaceStore.getState().chainTo === null, `chainTo=${useSpaceStore.getState().chainTo}`);

  // --- Sanity: Skills spawn constant still wired correctly (regression
  // guard for the center-spawn layout change) ---
  check(
    "SKILLS_SPAWN is the room center, not the old near-entrance point",
    SKILLS_SPAWN.x === 0 && SKILLS_SPAWN.z === 0,
    `SKILLS_SPAWN=${JSON.stringify(SKILLS_SPAWN)}`
  );

  // --- Keyboard A/D in a room nudges the same lookStore angle the arc
  // control drives (currently in "projects" from the chain test above) ---
  const { useKeyboardMoveStore } = await import("../src/store/keyboardMoveStore");
  useLookStore.getState().reset();
  useKeyboardMoveStore.getState().setTurn(1); // D / right
  await settle(30);
  const angleAfterKeyTurn = useLookStore.getState().angle;
  check(
    "keyboard A/D nudges the room look angle",
    angleAfterKeyTurn > 0.1,
    `angle=${angleAfterKeyTurn.toFixed(3)} (expected > 0.1 after holding D)`
  );
  useKeyboardMoveStore.getState().setTurn(0);

  // --- Keyboard W actually moves the camera in the corridor ---
  exitToCorridor("projects");
  await settle();
  const posBeforeWalk = camera.position.clone();
  useKeyboardMoveStore.getState().setMove(1); // W / forward
  await settle(30);
  const keyboardMoveDist = camera.position.distanceTo(posBeforeWalk);
  check(
    "keyboard W moves the camera in the corridor",
    keyboardMoveDist > 0.5,
    `moved ${keyboardMoveDist.toFixed(3)} units (expected > 0.5 after holding W for 0.5s)`
  );
  useKeyboardMoveStore.getState().setMove(0);

  // --- Keyboard input cancels an in-flight click-to-walk target, so the
  // two input methods can't fight over the same frame ---
  const { usePlayerStore } = await import("../src/store/playerStore");
  usePlayerStore.getState().setTarget([5, 5]);
  useKeyboardMoveStore.getState().setMove(1);
  await settle(5);
  check(
    "keyboard input cancels an active click-to-walk target",
    usePlayerStore.getState().target === null,
    `target=${JSON.stringify(usePlayerStore.getState().target)}`
  );
  useKeyboardMoveStore.getState().setMove(0);

  await renderer.unmount();

  if (failures > 0) {
    console.error(`\n${failures} navigation check(s) failed.`);
    process.exit(1);
  } else {
    console.log("\nAll navigation checks passed.");
  }
}

main();
