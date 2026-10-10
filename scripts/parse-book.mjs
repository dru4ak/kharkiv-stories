import fs from "fs";

const text = fs.readFileSync("scripts/book-raw.txt", "utf8");
const lines = text
  .split(/\n/)
  .map((l) => l.replace(/\s+/g, " ").trim())
  .filter(Boolean);

/** Titles that are NOT story headings */
const SKIP_TITLES = new Set([
  "III",
  "9*III",
  "СП1ВИ».",
  "СП1ВИ»",
  "ИСПОЛЬЗОВАННЫЕ ИСТОЧНИКИ",
]);

function isPageNoise(l) {
  if (/^\d+$/.test(l)) return true;
  if (/^В\.?\s*Я\.?\s*Цыпин/i.test(l)) return true;
  if (/^\d+\s*В\.?\s*Я\.?\s*Цыпин/i.test(l)) return true;
  if (/Цыпин\d/i.test(l) && l.length < 45) return true;
  if (/^ISBN/i.test(l) || /^УДК/i.test(l) || /^ББК/i.test(l) || /^15ББК/i.test(l))
    return true;
  if (/^\*+\s*[A-Za-zА-Яа-я]/.test(l) && l.length < 25) return true;
  if (/^[IVX\d*]+$/i.test(l)) return true;
  return false;
}

function isAllCapsTitle(l) {
  if (isPageNoise(l)) return false;
  if (l.length < 3 || l.length > 90) return false;
  if (/^[—\-–]/.test(l)) return false;
  // quoted telegrams / in-story shouts are body, not headings
  if (/ТЧК/.test(l)) return false;
  if (l.startsWith("«") && l.length > 45) return false;
  const letters = l.replace(/[^А-Яа-яЁёA-Za-z]/g, "");
  if (letters.length < 3) return false;
  const upper = letters.replace(/[^А-ЯЁA-Z]/g, "").length;
  return upper / letters.length >= 0.88;
}

function cleanTitle(l) {
  let t = l.trim().replace(/^[:;,.]+/, "").trim();
  // unwrap only a single pair wrapping the whole title
  if (/^«[^»]+»$/.test(t)) t = t.slice(1, -1);
  return t.trim();
}

// Start from first substantial prose (annotation before «О книге»)
let start = lines.findIndex(
  (l) =>
    l.includes("собраны забавные и драматические") ||
    l === "О КНИГЕ И ЕЕ АВТОРЕ",
);
if (start < 0) start = lines.findIndex((l) => l === "ЗАТМЕНИЕ");
const bodyLines = lines.slice(Math.max(0, start));

const rawStories = [];
let cur = null;
let pendingSection = null;

// Prefatory blurb before first caps title
if (bodyLines.length && !isAllCapsTitle(bodyLines[0])) {
  cur = { title: "АННОТАЦИЯ", paras: [], section: null };
}

for (let i = 0; i < bodyLines.length; i++) {
  const l = bodyLines[i];
  if (isPageNoise(l)) continue;

  if (isAllCapsTitle(l)) {
    const title = cleanTitle(l);
    if (SKIP_TITLES.has(title) || SKIP_TITLES.has(l)) {
      if (/ИСПОЛЬЗОВАННЫЕ ИСТОЧНИКИ/i.test(l)) {
        if (cur && cur.paras.length) rawStories.push(cur);
        cur = { title: "ИСПОЛЬЗОВАННЫЕ ИСТОЧНИКИ", paras: [], section: null };
        pendingSection = null;
      }
      continue;
    }

    if (cur) {
      if (cur.paras.length === 0) {
        // section heading without own text (e.g. НОБЕЛЕВСКИЕ ЛАУРЕАТЫ)
        pendingSection = cur.title;
      } else {
        rawStories.push(cur);
      }
    }
    cur = {
      title,
      paras: [],
      section: pendingSection,
    };
    pendingSection = null;
  } else if (cur) {
    cur.paras.push(l);
  } else {
    cur = { title: "АННОТАЦИЯ", paras: [l], section: null };
  }
}
if (cur && cur.paras.length) rawStories.push(cur);

// Merge continuation titles into previous story
const MERGE_INTO_PREV = new Set(["ПРОДОЛЖЕНИЕ"]);
const merged = [];
for (const s of rawStories) {
  if (MERGE_INTO_PREV.has(s.title) && merged.length) {
    const prev = merged[merged.length - 1];
    prev.paras.push("", `«${s.title}»`, ...s.paras);
  } else {
    merged.push(s);
  }
}

function slugify(s) {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
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
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return s
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? (/[a-z0-9]/.test(c) ? c : "-"))
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function detectType(title, body) {
  const t = `${title} ${body}`.toLowerCase();
  if (/о книге|от автора|использованные источники/.test(t)) return "байка";
  if (/легенд|предан|сказан|былин/.test(t)) return "легенда";
  if (/слух|молва|якобы|поговарива/.test(t)) return "слух";
  if (/анекдот|розыгр|первого апреля|шутк/.test(t)) return "анекдот";
  if (/улиц|переул|площад|топоним|назван.*улиц|вывеск/.test(t))
    return "топоним";
  if (body.length < 850) return "анекдот";
  return "байка";
}

function extractYears(body) {
  const years = [...body.matchAll(/\b(1[0-9]{3}|20[0-2][0-9])\b/g)].map((m) =>
    Number(m[1]),
  );
  if (!years.length) return {};
  const min = Math.min(...years);
  const max = Math.max(...years);
  return { yearStart: min, yearEnd: max === min ? undefined : max };
}

function eraFromYear(y) {
  if (!y) return "без даты";
  if (y < 1700) return "до XVIII века";
  if (y < 1800) return "XVIII век";
  if (y < 1900) return "XIX век";
  if (y < 1918) return "начало XX века";
  if (y < 1992) return "советский Харьков";
  return "новейшее время";
}

const DISTRICT_HINTS = [
  [/холодн/i, "Холодная Гора"],
  [/салтов/i, "Салтовка"],
  [/алексеев/i, "Алексеевка"],
  [/основян|\bоснова\b/i, "Основа"],
  [/павлов/i, "Павлово Поле"],
  [/нагорн/i, "Нагорный"],
  [/сумск|пушкин|рижск|университет|конституц/i, "Центр"],
  [/лопань/i, "Центр"],
  [/госпром|держпром/i, "Центр"],
  [/завод|промышлен/i, "Промышленный"],
];

function detectDistrict(body) {
  for (const [re, name] of DISTRICT_HINTS) if (re.test(body)) return name;
  return "Харьков";
}

const ILLUSTRATIONS = [
  "/illustrations/gerb-kharkova.jpg",
  "/illustrations/osnovanie-kharkova.jpg",
  "/illustrations/rachka-bazar.jpg",
];

const used = new Set();
const out = merged
  .map((s, idx) => {
    let body = s.paras.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
    // join hyphenated line breaks that survived as "слов-\nо"
    body = body.replace(/(\S)-\s+(\S)/g, "$1$2");
    if (body.length < 20 && !/от автора|о книге/i.test(s.title)) return null;

    const years = extractYears(body);
    let slug = slugify(s.title) || `story-${idx + 1}`;
    const base = slug;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);

    const type = detectType(s.title, body);
    const yearStart = years.yearStart;
    const district = detectDistrict(body);

    const tags = [type];
    if (s.section) tags.push("раздел:" + s.section);

    return {
      id: String(idx + 1),
      slug,
      title: s.title,
      summary:
        body.replace(/\s+/g, " ").slice(0, 200).trim() +
        (body.length > 200 ? "…" : ""),
      body,
      type,
      yearStart,
      yearEnd: years.yearEnd,
      era: eraFromYear(yearStart),
      district,
      placeName: district,
      section: s.section || undefined,
      lat: 49.9935 + Math.sin(idx * 12.9898) * 0.025,
      lng: 36.2304 + Math.cos(idx * 78.233) * 0.035,
      people: [],
      tags,
      illustrationUrl: ILLUSTRATIONS[idx % ILLUSTRATIONS.length],
      illustrationCaption: `Иллюстрация к материалу «${s.title}»`,
      source: "книга",
      status: "published",
    };
  })
  .filter(Boolean);

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/stories.json", JSON.stringify(out, null, 2), "utf8");

// Also write plain full-text dump for verification
const dump = out
  .map(
    (s, i) =>
      `${"=".repeat(60)}\n${i + 1}. ${s.title}\n[${s.type}] ${s.era}\n${"=".repeat(60)}\n\n${s.body}\n`,
  )
  .join("\n");
fs.writeFileSync("src/data/stories-full.txt", dump, "utf8");

// titles index
fs.writeFileSync(
  "src/data/titles.txt",
  out.map((s, i) => `${String(i + 1).padStart(3, " ")}. [${s.type}] ${s.title}`).join("\n"),
  "utf8",
);

const byType = {};
for (const s of out) byType[s.type] = (byType[s.type] || 0) + 1;

const rawChars = text.replace(/\s+/g, "").length;
const storyChars = out.reduce((a, s) => a + s.body.replace(/\s+/g, "").length, 0);

console.log("stories", out.length);
console.log(byType);
console.log(
  "coverage %",
  ((storyChars / rawChars) * 100).toFixed(2),
  `(${storyChars}/${rawChars})`,
);
console.log("first 8:");
out.slice(0, 8).forEach((s) =>
  console.log(`- ${s.title} (${s.body.length})`),
);
console.log("has ОТ АВТОРА", out.some((s) => /от автора/i.test(s.title)));
console.log(
  "has НОБЕЛЕВСКИЕ",
  out.some((s) => /нобелевск/i.test(s.title)),
);
console.log(
  "has ИСТОЧНИКИ",
  out.some((s) => /источник/i.test(s.title)),
);
