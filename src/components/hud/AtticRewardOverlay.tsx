"use client";

import { FormEvent, useEffect, useState } from "react";
import { TbRefresh, TbTrophy, TbX } from "react-icons/tb";
import { ATTIC } from "@/content/atticContent";
import { LINKS } from "@/content/siteContent";
import {
  fetchLeaderboard,
  formatRunTime,
  LeaderboardScore,
  submitLeaderboardScore,
} from "@/lib/leaderboard";
import { useAtticRewardStore } from "@/store/atticRewardStore";
import { useHuntRunStore } from "@/store/huntRunStore";
import { useKeysStore, countKeys } from "@/store/keysStore";
import { exitAttic } from "@/lib/roomNavigation";

const REWARD_LINKS = LINKS.filter((link) =>
  ["GitHub", "LinkedIn", "Email"].includes(link.label)
);

export default function AtticRewardOverlay() {
  const isOpen = useAtticRewardStore((s) => s.isOpen);
  const close = useAtticRewardStore((s) => s.close);
  const timeMs = useHuntRunStore((s) => s.timeMs);
  const rank = useHuntRunStore((s) => s.rank);
  const setRank = useHuntRunStore((s) => s.setRank);
  const collected = useKeysStore((s) => s.collected);
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [name, setName] = useState("");
  const [loadingScores, setLoadingScores] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchLeaderboard(controller.signal)
      .then(({ scores: latestScores }) => setScores(latestScores))
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Could not load the leaderboard.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingScores(false);
      });
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || timeMs === null || timeMs < 20_000 || timeMs > 24 * 60 * 60 * 1000) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitLeaderboardScore(name.trim(), timeMs);
      setRank(result.rank);
      const latest = await fetchLeaderboard();
      setScores(latest.scores);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit your score.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  }

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  return (
    <>
      <div className="absolute top-24 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-[#ffd978]/45 bg-[rgba(18,15,11,0.82)] px-4 py-2 text-center text-xs tracking-wide text-[var(--color-paper)] shadow-lg">
        Open a brass trunk for your keepsake. Your three-key time and global leaderboard are below.
      </div>
      {isOpen && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 p-5"
          onClick={close}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="attic-reward-title"
            className="relative w-full max-w-xl border border-[#c9a34a]/70 bg-[var(--color-paper)] p-7 text-[var(--color-ink)] shadow-2xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close attic keepsake"
              className="absolute right-4 top-4 rounded-lg border border-[var(--color-ink)]/25 p-2 hover:bg-black/5"
            >
              <TbX size={18} />
            </button>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--color-masthead)]">
              Attic keepsake
            </p>
            <h2
              id="attic-reward-title"
              className="mb-4 font-[family-name:var(--font-bacley)] text-3xl sm:text-4xl"
            >
              {ATTIC.rewardTitle}
            </h2>
            <p className="mb-7 leading-relaxed text-[var(--color-ink)]/85">
              {ATTIC.rewardStory}
            </p>
            <section
              aria-labelledby="leaderboard-title"
              className="mb-7 border-y border-[var(--color-ink)]/20 py-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3
                  id="leaderboard-title"
                  className="flex items-center gap-2 font-[family-name:var(--font-bacley)] text-xl"
                >
                  <TbTrophy className="text-[#9b711e]" aria-hidden />
                  Fastest explorers
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setLoadingScores(true);
                    setError(null);
                    fetchLeaderboard()
                      .then(({ scores: latestScores }) => setScores(latestScores))
                      .catch((cause: unknown) =>
                        setError(cause instanceof Error ? cause.message : "Could not load the leaderboard.")
                      )
                      .finally(() => setLoadingScores(false));
                  }}
                  aria-label="Refresh leaderboard"
                  className="rounded-lg border border-[var(--color-ink)]/25 p-2 hover:bg-black/5"
                >
                  <TbRefresh size={17} />
                </button>
              </div>

              {loadingScores ? (
                <p className="text-sm text-[var(--color-ink)]/65">Loading leaderboard…</p>
              ) : scores.length === 0 ? (
                <p className="text-sm text-[var(--color-ink)]/65">No explorers have posted a time yet. Be the first!</p>
              ) : (
                <ol className="max-h-40 space-y-2 overflow-y-auto text-sm">
                  {scores.map((score, index) => (
                    <li
                      key={`${score.createdAt}-${index}`}
                      className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 pb-2"
                    >
                      <span className="truncate">
                        <span className="mr-2 font-semibold text-[var(--color-masthead)]">#{index + 1}</span>
                        {score.name}
                      </span>
                      <span className="shrink-0 font-mono">{formatRunTime(score.timeMs)}</span>
                      <span className="hidden shrink-0 text-xs text-[var(--color-ink)]/55 sm:inline">
                        {formatDate(score.createdAt)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {timeMs !== null && rank !== null ? (
                <p className="mt-4 rounded-lg bg-[#c9a34a]/15 px-3 py-2 text-sm" role="status">
                  Your time: <strong>{formatRunTime(timeMs)}</strong> · Global rank: <strong>#{rank}</strong>
                </p>
              ) : timeMs !== null ? (
                <form onSubmit={handleSubmit} className="mt-5">
                  <p className="mb-3 text-sm text-[var(--color-ink)]/75">
                    Your hunt time: <strong>{formatRunTime(timeMs)}</strong>. Submit it to the public leaderboard?
                  </p>
                  <label htmlFor="leaderboard-name" className="mb-1 block text-sm font-medium">
                    Display name (1–20 characters)
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="leaderboard-name"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      minLength={1}
                      maxLength={20}
                      autoComplete="nickname"
                      className="min-w-0 flex-1 border border-[var(--color-ink)]/30 bg-white/70 px-3 py-2"
                    />
                    <button
                      type="submit"
                      disabled={submitting || timeMs < 20_000 || timeMs > 24 * 60 * 60 * 1000}
                      className="border border-[var(--color-ink)]/50 bg-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-paper)] hover:bg-[var(--color-masthead)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Submitting…" : "Submit time"}
                    </button>
                  </div>
                  {timeMs < 20_000 && (
                    <p className="mt-2 text-xs text-[var(--color-ink)]/65">
                      The board accepts completed runs of at least 20 seconds.
                    </p>
                  )}
                  {timeMs > 24 * 60 * 60 * 1000 && (
                    <p className="mt-2 text-xs text-[var(--color-ink)]/65">
                      The board only accepts runs completed within 24 hours.
                    </p>
                  )}
                </form>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-[var(--color-ink)]/65">
                    Complete all three keys in one timed visit to submit a score.
                  </p>
                  {countKeys(collected) === 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        useKeysStore.getState().reset();
                        useHuntRunStore.getState().start();
                        close();
                        exitAttic();
                      }}
                      className="mt-3 border border-[var(--color-ink)]/35 px-3 py-2 text-sm hover:bg-[var(--color-masthead)]/10"
                    >
                      Reset keys and start a timed run
                    </button>
                  )}
                </div>
              )}

              {error && (
                <p role="alert" className="mt-3 rounded-lg border border-red-800/25 bg-red-100/70 px-3 py-2 text-sm text-red-900">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink)]/55">
                Your display name and completion time will be visible to other visitors.
              </p>
            </section>
            <div className="flex flex-wrap gap-3">
              {REWARD_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="border border-[var(--color-ink)]/35 px-4 py-2 text-sm hover:bg-[var(--color-masthead)]/10"
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="mt-7 text-xs text-[var(--color-ink)]/60">
              Close this note to keep exploring. Press Escape at any time.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
