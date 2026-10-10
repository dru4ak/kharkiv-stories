/** Собирает candidates.json заново из raw-posts.jsonl */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content", "locals-from-forum");
const rawPath = path.join(dir, "raw-posts.jsonl");
const outPath = path.join(dir, "candidates.forum-original.json");

function clean(body) {
  return String(body || "")
    .replace(/Натисніть[^\n]*/gi, "")
    .replace(/Click to expand[^\n]*/gi, "")
    .replace(/Посилання видалено/gi, "")
    .replace(/🔴[^\n]*/g, "")
    .replace(/^[А-ЯA-Zа-яa-z0-9_ .\-]{2,40}\s+сказа[вл]\(ла\):\s*/gim, "")
    .trim();
}

function guessTitle(body) {
  const first = body.split(/\n+/)[0].replace(/^["«]+|["»]+$/g, "").trim();
  if (first.length >= 12 && first.length <= 90 && !/[.!?]$/.test(first)) {
    return first.toUpperCase();
  }
  return body.replace(/\s+/g, " ").slice(0, 70).replace(/\s+\S*$/, "").toUpperCase();
}

function guessPlace(body) {
  const places = [
    [/журавл/i, "Журавлевка"],
    [/хтз/i, "ХТЗ"],
    [/пятихат/i, "Пятихатки / лесопарк"],
    [/благбаз|благовещенск/i, "Благовещенский базар / Лопань"],
    [/лопан/i, "Лопань"],
    [/пушкинск|дарвин/i, "Пушкинская / Дарвина"],
    [/вокзал/i, "Вокзал"],
    [/успенск/i, "Успенский собор"],
    [/шевченко/i, "Сад Шевченко"],
    [/университет/i, "Университет"],
    [/дмитриевск/i, "Дмитриевская"],
  ];
  for (const [re, name] of places) if (re.test(body)) return name;
  return "Харьков";
}

const yearsOf = (body) => {
  const years = [...body.matchAll(/\b(1[6-9]\d{2}|20[0-2]\d)\b/g)].map((m) => Number(m[1]));
  if (!years.length) return {};
  const yearStart = Math.min(...years);
  const yearEnd = Math.max(...years);
  return yearStart === yearEnd ? { yearStart } : { yearStart, yearEnd };
};

const lines = fs.readFileSync(rawPath, "utf8").trim().split(/\n/);
const out = [];
const seen = new Set();

for (const line of lines) {
  let post;
  try {
    post = JSON.parse(line);
  } catch {
    continue;
  }
  const body = clean(post.body);
  if (body.length < 220) continue;
  if (/^\+1|тс\+/i.test(body)) continue;
  const key = body.slice(0, 160);
  if (seen.has(key)) continue;
  seen.add(key);

  const title = guessTitle(body);
  const years = yearsOf(body);
  const placeName = guessPlace(body);
  out.push({
    keep: null,
    id: `local-f${post.forumPostId}`,
    slug: `f${post.forumPostId}`,
    title,
    summary: body.replace(/\s+/g, " ").slice(0, 180).replace(/\s+\S*$/, "") + "…",
    body,
    type: "от местных",
    ...years,
    era: "городские предания",
    district: placeName,
    placeName,
    section: "От местных · kharkovforum",
    people: [],
    tags: ["от-местных", "форум", "легенда"],
    source: "пользователь",
    status: "pending",
    forum: {
      page: post.page,
      postId: post.forumPostId,
      author: post.author,
      postedAt: post.postedAt,
    },
  });
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log({ rebuilt: out.length, outPath });
