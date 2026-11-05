export const LEADERBOARD_API_URL = (
  process.env.NEXT_PUBLIC_LEADERBOARD_API_URL ??
  "https://e7aide0hfh.execute-api.us-east-1.amazonaws.com"
).replace(/\/+$/, "");

export interface LeaderboardScore {
  name: string;
  timeMs: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  scores: LeaderboardScore[];
}

export interface ScoreSubmissionResponse {
  ok: true;
  rank: number;
}

async function readJson(response: Response): Promise<unknown> {
  let value: unknown;
  try {
    value = await response.json();
  } catch {
    throw new Error(`Leaderboard returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const message =
      value && typeof value === "object" && "error" in value && typeof value.error === "string"
        ? value.error
        : `Leaderboard request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }
  return value;
}

export async function fetchLeaderboard(signal?: AbortSignal): Promise<LeaderboardResponse> {
  const response = await fetch(`${LEADERBOARD_API_URL}/scores`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });
  const value = await readJson(response);
  if (
    !value ||
    typeof value !== "object" ||
    !("scores" in value) ||
    !Array.isArray(value.scores)
  ) {
    throw new Error("Leaderboard returned an unexpected scores list.");
  }

  const scores = value.scores.map((score: unknown) => {
    if (
      !score ||
      typeof score !== "object" ||
      !("name" in score) ||
      typeof score.name !== "string" ||
      !("timeMs" in score) ||
      typeof score.timeMs !== "number" ||
      !Number.isFinite(score.timeMs) ||
      !("createdAt" in score) ||
      typeof score.createdAt !== "string"
    ) {
      throw new Error("Leaderboard returned a malformed score.");
    }
    return { name: score.name, timeMs: score.timeMs, createdAt: score.createdAt };
  });

  return { scores };
}

export async function submitLeaderboardScore(
  name: string,
  timeMs: number
): Promise<ScoreSubmissionResponse> {
  const response = await fetch(`${LEADERBOARD_API_URL}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, timeMs }),
  });
  const value = await readJson(response);
  if (
    !value ||
    typeof value !== "object" ||
    !("ok" in value) ||
    value.ok !== true ||
    !("rank" in value) ||
    typeof value.rank !== "number" ||
    !Number.isInteger(value.rank) ||
    value.rank < 1
  ) {
    throw new Error("Leaderboard returned an unexpected score confirmation.");
  }
  return { ok: true, rank: value.rank };
}

export function formatRunTime(timeMs: number): string {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
