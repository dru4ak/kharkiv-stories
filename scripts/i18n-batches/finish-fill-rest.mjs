import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const need = JSON.parse(
  fs.readFileSync(path.join(dir, "_missing-a-need.json"), "utf8"),
);
const outPath = path.join(dir, "batch-missing-a-fill.json");
const out = JSON.parse(fs.readFileSync(outPath, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function lingva(text, source, target) {
  const q = text.slice(0, 450);
  const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(q)}`;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.translation) return data.translation;
    }
    await sleep(800 * (i + 1));
  }
  throw new Error("lingva");
}

function fixUk(s) {
  return s
    .replace(/Харьков/g, "Харків")
    .replace(/харьков/g, "харків")
    .replace(/Харькова/g, "Харкова")
    .replace(/харькова/g, "харкова")
    .replace(/Харькове/g, "Харкові")
    .replace(/харькове/g, "харкові")
    .replace(/Харькову/g, "Харкову")
    .replace(/Харьковом/g, "Харковом")
    .replace(/Харьковщин/g, "Харківщин")
    .replace(/харьковщин/g, "харківщин")
    .replace(/харьковян/g, "харків'ян")
    .replace(/Харьковян/g, "Харків'ян")
    .replace(/Харьковский/g, "Харківський")
    .replace(/харьковский/g, "харківський")
    .replace(/Харьковская/g, "Харківська")
    .replace(/харьковская/g, "харківська")
    .replace(/Цыпин/g, "Ципін");
}

function fixEn(s) {
  return s
    .replace(/\bKharkov\b/g, "Kharkiv")
    .replace(/\bkharkov\b/g, "kharkiv")
    .replace(/Цыпин/g, "Tsypin");
}

function preserveEllipsis(original, translated) {
  if (!original.trimEnd().endsWith("…") && !original.trimEnd().endsWith("..."))
    return translated;
  return `${translated.trimEnd().replace(/\.\.\.$|…$/u, "")}…`;
}

const todo = need.filter((x) => !out[x.slug]);
console.log("todo", todo.length);
for (const { slug, title, summary } of todo) {
  process.stdout.write(`${slug} `);
  let ukTitle = fixUk(await lingva(title, "ru", "uk"));
  let ukSummary = fixUk(await lingva(summary, "ru", "uk"));
  let enTitle = fixEn(await lingva(title, "ru", "en"));
  let enSummary = fixEn(await lingva(summary, "ru", "en"));
  ukTitle = preserveEllipsis(title, ukTitle);
  ukSummary = preserveEllipsis(summary, ukSummary);
  enTitle = preserveEllipsis(title, enTitle);
  enSummary = preserveEllipsis(summary, enSummary);
  out[slug] = {
    uk: { title: ukTitle, summary: ukSummary },
    en: { title: enTitle, summary: enSummary },
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  await sleep(300);
}
console.log("\nDone", Object.keys(out).length);
