"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { LocalLegend } from "@/data/locals";

type RumorVoteStats = { likes: number; dislikes: number };
type SortKey = "rating" | "likes" | "title" | "place" | "year";
type MyVote = "like" | "dislike" | null;

function scoreOf(stats?: RumorVoteStats): number {
  if (!stats) return 0;
  return (stats.likes || 0) - (stats.dislikes || 0);
}

const STORAGE_KEY = "kharkiv-rumor-my-votes-v1";

function loadMyVotes(): Record<string, MyVote> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<
      string,
      MyVote
    >;
  } catch {
    return {};
  }
}

function saveMyVotes(map: Record<string, MyVote>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function RumorsBoard({
  legends,
  places,
  themes,
  labels,
}: {
  legends: LocalLegend[];
  places: string[];
  themes: string[];
  labels: {
    search: string;
    all: string;
    place: string;
    theme: string;
    sort: string;
    sortRating: string;
    sortLikes: string;
    sortTitle: string;
    sortPlace: string;
    sortYear: string;
    empty: string;
    like: string;
    dislike: string;
    score: string;
    count: string;
    expand: string;
    collapse: string;
  };
}) {
  const [q, setQ] = useState("");
  const [place, setPlace] = useState(labels.all);
  const [theme, setTheme] = useState(labels.all);
  const [sort, setSort] = useState<SortKey>("rating");
  const [votes, setVotes] = useState<Record<string, RumorVoteStats>>({});
  const [myVotes, setMyVotes] = useState<Record<string, MyVote>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setMyVotes(loadMyVotes());
    fetch("/api/rumor-votes")
      .then((r) => r.json())
      .then((data) => setVotes(data || {}))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = legends.filter((l) => {
      if (place !== labels.all && l.placeName !== place) return false;
      if (theme !== labels.all && !l.themes.includes(theme)) return false;
      if (!query) return true;
      const hay = `${l.title} ${l.body} ${l.placeName} ${l.themes.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });

    list = [...list].sort((a, b) => {
      const va = votes[a.id];
      const vb = votes[b.id];
      if (sort === "rating") {
        const d = scoreOf(vb) - scoreOf(va);
        if (d) return d;
        return (vb?.likes ?? 0) - (va?.likes ?? 0);
      }
      if (sort === "likes") return (vb?.likes ?? 0) - (va?.likes ?? 0);
      if (sort === "title") return a.title.localeCompare(b.title, "ru");
      if (sort === "place") return a.placeName.localeCompare(b.placeName, "ru");
      if (sort === "year") {
        return (b.yearStart ?? 0) - (a.yearStart ?? 0);
      }
      return 0;
    });
    return list;
  }, [legends, q, place, theme, sort, votes, labels.all]);

  async function castVote(id: string, next: "like" | "dislike") {
    const prev = myVotes[id] ?? null;
    let vote: "like" | "dislike" | "clear" = next;
    let storeNext: MyVote = next;
    if (prev === next) {
      vote = "clear";
      storeNext = null;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/rumor-votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, vote, prev }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as RumorVoteStats & { id: string };
        setVotes((v) => ({
          ...v,
          [id]: { likes: data.likes, dislikes: data.dislikes },
        }));
        setMyVotes((m) => {
          const nextMap = { ...m, [id]: storeNext };
          saveMyVotes(nextMap);
          return nextMap;
        });
      } catch {
        /* ignore */
      }
    });
  }

  return (
    <div>
      <div className="-mx-1 space-y-3 border border-[var(--line)] bg-[var(--paper-elevated)] p-4 sm:p-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.search}
          className="w-full border border-[var(--line)] bg-[var(--paper-elevated)] px-3 py-2.5 text-[0.95rem] text-[var(--ink)] outline-none focus:border-[var(--brick)]"
        />
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label={labels.theme}
            value={theme}
            onChange={setTheme}
            opts={[labels.all, ...themes]}
          />
          <FilterSelect
            label={labels.place}
            value={place}
            onChange={setPlace}
            opts={[labels.all, ...places]}
          />
          <FilterSelect
            label={labels.sort}
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            opts={[
              "rating",
              "likes",
              "title",
              "place",
              "year",
            ]}
            format={(v) =>
              ({
                rating: labels.sortRating,
                likes: labels.sortLikes,
                title: labels.sortTitle,
                place: labels.sortPlace,
                year: labels.sortYear,
              })[v] ?? v
            }
          />
        </div>
        <p className="text-[0.85rem] text-[var(--muted)]">
          {labels.count.replace("{n}", String(filtered.length))}
          {pending ? "…" : ""}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {filtered.length === 0 ? (
          <p className="text-[var(--ink-soft)]">{labels.empty}</p>
        ) : (
          filtered.map((legend, index) => {
            const stats = votes[legend.id] ?? { likes: 0, dislikes: 0 };
            const mine = myVotes[legend.id] ?? null;
            const open = openId === legend.id;
            const score = scoreOf(stats);
            return (
              <article
                key={legend.id}
                className="border-b border-[var(--line)] pb-6"
              >
                <div className="flex gap-4">
                  <div className="flex w-14 shrink-0 flex-col items-center gap-1 pt-1">
                    <button
                      type="button"
                      aria-label={labels.like}
                      onClick={() => castVote(legend.id, "like")}
                      className={`text-xl leading-none transition ${
                        mine === "like"
                          ? "text-[var(--brick)]"
                          : "text-[var(--muted)] hover:text-[var(--brick)]"
                      }`}
                    >
                      ▲
                    </button>
                    <span
                      className={`text-[0.95rem] font-semibold tabular-nums ${
                        score > 0
                          ? "text-[var(--brick)]"
                          : score < 0
                            ? "text-[var(--muted)]"
                            : "text-[var(--ink)]"
                      }`}
                      title={labels.score}
                    >
                      {score}
                    </span>
                    <button
                      type="button"
                      aria-label={labels.dislike}
                      onClick={() => castVote(legend.id, "dislike")}
                      className={`text-xl leading-none transition ${
                        mine === "dislike"
                          ? "text-[var(--ochre)]"
                          : "text-[var(--muted)] hover:text-[var(--ochre)]"
                      }`}
                    >
                      ▼
                    </button>
                    <span className="mt-1 text-[0.65rem] tabular-nums text-[var(--muted)]">
                      {stats.likes}/{stats.dislikes}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[0.75rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      #{index + 1}
                      {legend.placeName ? ` · ${legend.placeName}` : ""}
                      {legend.yearStart
                        ? ` · ${legend.yearStart}${
                            legend.yearEnd && legend.yearEnd !== legend.yearStart
                              ? `–${legend.yearEnd}`
                              : ""
                          }`
                        : ""}
                    </p>
                    <h2 className="display mt-1 text-[clamp(1.35rem,3vw,1.85rem)] text-[var(--ink)]">
                      {legend.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {legend.themes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className="border border-[var(--line)] px-2 py-0.5 text-[0.72rem] text-[var(--muted)] transition hover:border-[var(--brick)] hover:text-[var(--brick)]"
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div
                      className={`mt-4 space-y-3 text-[1.05rem] leading-7 text-[var(--ink-soft)] ${
                        open ? "" : "line-clamp-4"
                      }`}
                    >
                      {legend.body.split(/\n\n+/).map((p, i) => (
                        <p key={`${legend.id}-${i}`}>{p}</p>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-3 text-[0.9rem] font-semibold text-[var(--brick)] hover:underline"
                      onClick={() =>
                        setOpenId(open ? null : legend.id)
                      }
                    >
                      {open ? labels.collapse : labels.expand}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  opts,
  format,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opts: string[];
  format?: (v: string) => string;
}) {
  return (
    <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--muted)]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[var(--line)] bg-[var(--paper-elevated)] px-2 py-2 text-[0.9rem] normal-case tracking-normal text-[var(--ink)]"
      >
        {opts.map((opt) => (
          <option key={opt} value={opt}>
            {format ? format(opt) : opt}
          </option>
        ))}
      </select>
    </label>
  );
}
