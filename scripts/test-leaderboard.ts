import assert from "node:assert/strict";
import {
  fetchLeaderboard,
  formatRunTime,
  LEADERBOARD_API_URL,
  submitLeaderboardScore,
} from "../src/lib/leaderboard";

async function main() {
  const originalFetch = globalThis.fetch;
  const requests: { url: string; init?: RequestInit }[] = [];

  try {
    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      return new Response(
        JSON.stringify({
          scores: [{ name: "Explorer", timeMs: 45_000, createdAt: "2026-11-05T00:00:00.000Z" }],
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    };

    const leaderboard = await fetchLeaderboard();
    assert.equal(leaderboard.scores[0]?.name, "Explorer");
    assert.equal(leaderboard.scores[0]?.timeMs, 45_000);
    assert.equal(requests[0]?.url, `${LEADERBOARD_API_URL}/scores`);
    assert.equal(requests[0]?.init?.method, "GET");

    globalThis.fetch = async (input, init) => {
      requests.push({ url: String(input), init });
      return new Response(JSON.stringify({ ok: true, rank: 2 }), {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    };

    const submitted = await submitLeaderboardScore("Explorer", 45_000);
    assert.deepEqual(submitted, { ok: true, rank: 2 });
    const post = requests.at(-1);
    assert.equal(post?.url, `${LEADERBOARD_API_URL}/scores`);
    assert.equal(post?.init?.method, "POST");
    assert.deepEqual(JSON.parse(String(post?.init?.body)), {
      name: "Explorer",
      timeMs: 45_000,
    });
    assert.equal(formatRunTime(125_000), "2:05");

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Invalid time" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    await assert.rejects(submitLeaderboardScore("Explorer", 5_000), /Invalid time/);

    console.log("PASS  leaderboard reads the top scores from GET /scores");
    console.log("PASS  score submission sends the expected name/timeMs payload");
    console.log("PASS  backend errors are surfaced to the caller");
    console.log("PASS  run times are formatted as minutes and seconds");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
