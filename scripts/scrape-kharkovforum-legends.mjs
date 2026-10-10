/**
 * Собирает посты из темы «Легенды Харькова» на kharkovforum.com
 * и складывает черновики в формате сайта для ручного отбора.
 *
 * Запуск:
 *   node scripts/scrape-kharkovforum-legends.mjs [fromPage] [toPage]
 * Пример: node scripts/scrape-kharkovforum-legends.mjs 1 30
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "content", "locals-from-forum");
const THREAD =
  "https://www.kharkovforum.com/threads/lehendy-khar-kova.73438";

const fromPage = Number(process.argv[2] || 1);
const toPage = Number(process.argv[3] || 20);
const MIN_CHARS = 220;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(html) {
  return html
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/Посилання видалено/gi, "")
    .replace(/🔴[^\n]*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function slugify(title, postId) {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    ё: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  const base = title
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "legend"}-f${postId}`;
}

function guessTitle(body) {
  const first = body.split(/\n+/)[0].replace(/^["«]+|["»]+$/g, "").trim();
  if (first.length >= 12 && first.length <= 80 && !/[.!?]$/.test(first)) {
    return first.toUpperCase();
  }
  const clip = body.replace(/\s+/g, " ").slice(0, 70);
  const cut = clip.replace(/\s+\S*$/, "");
  return (cut || "ЛЕГЕНДА С ФОРУМА").toUpperCase();
}

function guessPlace(body) {
  const places = [
    [/журавл/i, "Журавлевка"],
    [/хатз|хтз/i, "ХТЗ"],
    [/пятихат/i, "Пятихатки / лесопарк"],
    [/благбаз|благовещенск/i, "Благовещенский базар / Лопань"],
    [/лопан/i, "Лопань"],
    [/пушкинск|дарвин/i, "Пушкинская / Дарвина"],
    [/сумск/i, "Сумская"],
    [/вокзал/i, "Вокзал"],
    [/госпром|держпром/i, "Госпром"],
    [/успенск/i, "Успенский собор"],
    [/шеченко|шевченко/i, "Памятник Шевченко / сад"],
    [/университет/i, "Университет"],
    [/павлово\s*поле/i, "Павлово Поле"],
    [/цветмет/i, "Цветмет"],
    [/коммунар/i, "завод Коммунар / Журавлевка"],
    [/салтов/i, "Салтовка"],
    [/холодн/i, "Холодная Гора"],
    [/основян/i, "Основа"],
  ];
  for (const [re, name] of places) {
    if (re.test(body)) return name;
  }
  return "Харьков";
}

function guessYears(body) {
  const years = [...body.matchAll(/\b(1[6-9]\d{2}|20[0-2]\d)\b/g)].map((m) =>
    Number(m[1]),
  );
  const decades = [...body.matchAll(/\b([1-9]0)-[хxх]\b/gi)].map((m) =>
    Number(`19${m[1]}`),
  );
  const all = [...years, ...decades].filter((y) => y >= 1600 && y <= 2026);
  if (!all.length) {
    if (/войн|немц|оккупац/i.test(body)) return { yearStart: 1941, yearEnd: 1943 };
    if (/нквд|кгб|огпу/i.test(body)) return { yearStart: 1930, yearEnd: 1950 };
    return {};
  }
  const yearStart = Math.min(...all);
  const yearEnd = Math.max(...all);
  return yearStart === yearEnd ? { yearStart } : { yearStart, yearEnd };
}

function guessEra(yearStart) {
  if (!yearStart) return "городские предания";
  if (yearStart < 1700) return "XVII век и ранее";
  if (yearStart < 1800) return "XVIII век";
  if (yearStart < 1900) return "XIX век";
  if (yearStart < 1918) return "начало XX века";
  if (yearStart < 1941) return "межвоенный период";
  if (yearStart < 1946) return "война";
  if (yearStart < 1992) return "советское время";
  return "независимость";
}

function isLikelyStory(text) {
  if (text.length < MIN_CHARS) return false;
  if (/^(да|нет|ага|лол|кек|хм+)\b/i.test(text) && text.length < 400) return false;
  if ((text.match(/\n/g) || []).length === 0 && text.length < 280) return false;
  // односложный трёп
  if (/^\+1|тс\+|интересно\.?$/i.test(text.trim())) return false;
  return true;
}

async function fetchPage(page) {
  const url = page <= 1 ? `${THREAD}/` : `${THREAD}/page-${page}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; KharkivStoriesCollector/1.0; +local)",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function extractPosts(html, page) {
  const posts = [];
  // XenForo article messages
  const re =
    /data-content="post-(\d+)"[\s\S]*?<h4[^>]*class="[^"]*message-name[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>[\s\S]*?<time[^>]*datetime="([^"]+)"[\s\S]*?<div[^>]*class="[^"]*bbWrapper[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;

  let m;
  while ((m = re.exec(html))) {
    const [, id, author, datetime, bodyHtml] = m;
    const body = stripHtml(bodyHtml);
    posts.push({
      forumPostId: id,
      author: author.trim(),
      postedAt: datetime,
      page,
      body,
    });
  }

  // Fallback: simpler split by bbWrapper if regex missed
  if (!posts.length) {
    const parts = html.split(/class="[^"]*bbWrapper[^"]*"/i).slice(1);
    let i = 0;
    for (const part of parts) {
      const bodyHtml = part.slice(0, part.indexOf("</div>"));
      const body = stripHtml(bodyHtml);
      if (!body) continue;
      i++;
      posts.push({
        forumPostId: `p${page}-${i}`,
        author: "unknown",
        postedAt: "",
        page,
        body,
      });
    }
  }
  return posts;
}

function toCandidate(post) {
  const title = guessTitle(post.body);
  const placeName = guessPlace(post.body);
  const years = guessYears(post.body);
  const summary =
    post.body.replace(/\s+/g, " ").slice(0, 180).replace(/\s+\S*$/, "") + "…";
  return {
    keep: null, // true/false — отметьте вручную
    id: `local-f${post.forumPostId}`,
    slug: slugify(title, post.forumPostId),
    title,
    summary,
    body: post.body,
    type: "от местных",
    ...years,
    era: guessEra(years.yearStart),
    district: placeName,
    placeName,
    section: "От местных · kharkovforum",
    people: [],
    tags: ["от-местных", "форум", "легенда"],
    source: "пользователь",
    status: "pending",
    forum: {
      thread: THREAD,
      page: post.page,
      postId: post.forumPostId,
      author: post.author,
      postedAt: post.postedAt,
      url: `${THREAD}/post-${post.forumPostId}`,
    },
  };
}

fs.mkdirSync(outDir, { recursive: true });

const rawPath = path.join(outDir, "raw-posts.jsonl");
const candidatesPath = path.join(outDir, "candidates.json");
const previewPath = path.join(outDir, "CANDIDATES.md");

const existing = fs.existsSync(candidatesPath)
  ? JSON.parse(fs.readFileSync(candidatesPath, "utf8"))
  : [];
const byId = new Map(existing.map((c) => [c.id, c]));

const rawFd = fs.openSync(rawPath, "a");

for (let page = fromPage; page <= toPage; page++) {
  try {
    const html = await fetchPage(page);
    const posts = extractPosts(html, page);
    console.log(`page ${page}: posts=${posts.length}`);
    for (const post of posts) {
      fs.writeSync(rawFd, JSON.stringify(post) + "\n");
      if (!isLikelyStory(post.body)) continue;
      const cand = toCandidate(post);
      if (!byId.has(cand.id)) byId.set(cand.id, cand);
    }
    await sleep(450 + Math.random() * 350);
  } catch (err) {
    console.error(`stop at page ${page}:`, err.message);
    break;
  }
}

fs.closeSync(rawFd);

const candidates = [...byId.values()].sort((a, b) =>
  String(a.forum?.postId).localeCompare(String(b.forum?.postId), undefined, {
    numeric: true,
  }),
);

fs.writeFileSync(candidatesPath, JSON.stringify(candidates, null, 2), "utf8");

const md = [
  "# Черновики легенд «от местных» (kharkovforum)",
  "",
  `Источник: ${THREAD}`,
  `Собрано кандидатов: **${candidates.length}**`,
  "",
  "Отметьте в `candidates.json` поле `keep: true` у нужных — потом добавим на сайт.",
  "",
  "---",
  "",
];

for (const c of candidates) {
  md.push(`## ${c.title}`);
  md.push("");
  md.push(`- **id:** \`${c.id}\``);
  md.push(`- **тип:** ${c.type}`);
  md.push(`- **место:** ${c.placeName || "—"}`);
  md.push(
    `- **дата (примерно):** ${
      c.yearStart
        ? c.yearEnd && c.yearEnd !== c.yearStart
          ? `${c.yearStart}–${c.yearEnd}`
          : String(c.yearStart)
        : "не указана"
    } · ${c.era}`,
  );
  md.push(
    `- **автор форума:** ${c.forum?.author || "?"} · [пост](${c.forum?.url})`,
  );
  md.push(`- **keep:** ${c.keep === null ? "null (решить)" : c.keep}`);
  md.push("");
  md.push(c.body);
  md.push("");
  md.push("---");
  md.push("");
}

fs.writeFileSync(previewPath, md.join("\n"), "utf8");
console.log(`saved ${candidates.length} candidates → ${candidatesPath}`);
console.log(`preview → ${previewPath}`);
