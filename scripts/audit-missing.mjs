import fs from "fs";

const raw = fs.readFileSync("scripts/book-raw.txt", "utf8");
const stories = JSON.parse(fs.readFileSync("src/data/stories.json", "utf8"));

function norm(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/[«»"'„“]/g, "")
    .trim()
    .toLowerCase();
}

const bodyAll = norm(stories.map((s) => `${s.title} ${s.body}`).join(" "));
const rawLines = raw
  .split(/\n/)
  .map((l) => l.trim())
  .filter(Boolean);

const missing = [];
for (const l of rawLines) {
  if (l.length < 80) continue;
  if (/Цыпин|ISBN|УДК|ББК|^\d+$/.test(l)) continue;
  const n = norm(l).slice(0, 70);
  if (n.length < 45) continue;
  if (!bodyAll.includes(n)) missing.push(l.slice(0, 140));
}

console.log("missing long paras:", missing.length);
missing.slice(0, 50).forEach((m, i) => console.log(i, m));

// titles in book vs catalog
const caps = rawLines.filter((l) => {
  const letters = l.replace(/[^А-Яа-яЁёA-Za-z]/g, "");
  if (letters.length < 3 || letters.length > 70) return false;
  const upper = letters.replace(/[^А-ЯЁA-Z]/g, "").length;
  return upper / letters.length >= 0.9;
});

const catalogTitles = new Set(stories.map((s) => norm(s.title)));
const missingTitles = caps.filter((t) => {
  const n = norm(t.replace(/^«+|»+$/g, ""));
  if (/использованные источники|о книге|от автора|^iii$|^\d/.test(n))
    return false;
  return ![...catalogTitles].some(
    (ct) => ct.includes(n.slice(0, 20)) || n.includes(ct.slice(0, 20)),
  );
});
console.log("\npossibly missing titles:", missingTitles.length);
missingTitles.forEach((t) => console.log("-", t));
