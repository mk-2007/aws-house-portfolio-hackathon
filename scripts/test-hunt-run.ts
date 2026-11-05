import assert from "node:assert/strict";
import { useHuntRunStore } from "../src/store/huntRunStore";

async function main() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    },
  });

  const originalNow = Date.now;
  let now = 1_000_000;
  Date.now = () => now;

  try {
    useHuntRunStore.getState().reset();
    useHuntRunStore.getState().start();
    now += 45_000;
    useHuntRunStore.getState().finish();

    assert.equal(useHuntRunStore.getState().timeMs, 45_000);
    assert.equal(JSON.parse(values.get("house-hunt-run-v1") ?? "{}").timeMs, 45_000);

    useHuntRunStore.getState().start();
    assert.equal(useHuntRunStore.getState().timeMs, 45_000);

    useHuntRunStore.getState().reset();
    useHuntRunStore.getState().start();
    now += 25 * 60 * 60 * 1000;
    useHuntRunStore.getState().start();
    assert.equal(useHuntRunStore.getState().startedAt, now);
    assert.equal(useHuntRunStore.getState().timeMs, null);

    console.log("PASS  hunt time is measured and persisted after completion");
    console.log("PASS  completed times survive a page reload");
    console.log("PASS  stale in-progress runs restart after 24 hours");
  } finally {
    Date.now = originalNow;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
