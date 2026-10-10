import fs from "node:fs";
import path from "node:path";

export type RumorVoteStats = {
  likes: number;
  dislikes: number;
};

export type RumorVotesFile = Record<string, RumorVoteStats>;

const votesPath = path.join(process.cwd(), "data", "rumor-votes.json");

function ensureFile(): RumorVotesFile {
  const dir = path.dirname(votesPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(votesPath)) {
    fs.writeFileSync(votesPath, "{}", "utf8");
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(votesPath, "utf8")) as RumorVotesFile;
  } catch {
    return {};
  }
}

export function readRumorVotes(): RumorVotesFile {
  return ensureFile();
}

export function scoreOf(stats?: RumorVoteStats): number {
  if (!stats) return 0;
  return (stats.likes || 0) - (stats.dislikes || 0);
}

export function applyRumorVote(
  id: string,
  next: "like" | "dislike" | "clear",
  prev: "like" | "dislike" | null,
): RumorVoteStats {
  const all = ensureFile();
  const cur: RumorVoteStats = {
    likes: all[id]?.likes ?? 0,
    dislikes: all[id]?.dislikes ?? 0,
  };

  if (prev === "like") cur.likes = Math.max(0, cur.likes - 1);
  if (prev === "dislike") cur.dislikes = Math.max(0, cur.dislikes - 1);

  if (next === "like") cur.likes += 1;
  if (next === "dislike") cur.dislikes += 1;

  all[id] = cur;
  fs.writeFileSync(votesPath, JSON.stringify(all, null, 2), "utf8");
  return cur;
}
