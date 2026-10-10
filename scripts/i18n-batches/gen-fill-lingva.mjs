import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const need = JSON.parse(
  fs.readFileSync(path.join(dir, "_missing-a-need.json"), "utf8"),
);
const outPath = path.join(dir, "batch-missing-a-fill.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function lingva(text, source, target) {
  const q = text.slice(0, 450);
  if (!q.trim()) return "";
  const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(q)}`;
  for (let i = 0; i < 8; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (data?.translation) return data.translation;
    } catch {
      await sleep(1500 * (i + 1));
    }
  }
  throw new Error(`lingva failed ${source}->${target}`);
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
    .replace(/Харьковское/g, "Харківське")
    .replace(/Харьковским/g, "Харківським")
    .replace(/Цыпин/g, "Ципін")
    .replace(/Савелия/g, "Савелія")
    .replace(/Савелий/g, "Савелій");
}

function fixEn(s) {
  return s
    .replace(/\bKharkov\b/g, "Kharkiv")
    .replace(/\bkharkov\b/g, "kharkiv")
    .replace(/\bKharkovians\b/gi, "Kharkiv residents")
    .replace(/\bkharkovians\b/gi, "Kharkiv residents")
    .replace(/Tsypin'?s Peru/gi, "Saveliy Tsypin")
    .replace(/Цыпин/g, "Tsypin");
}

function preserveEllipsis(original, translated) {
  const endsEllipsis =
    original.trimEnd().endsWith("…") || original.trimEnd().endsWith("...");
  if (!endsEllipsis) return translated;
  let t = translated.trimEnd().replace(/\.\.\.$/, "").replace(/…$/, "");
  return `${t}…`;
}

const out = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, "utf8"))
  : {};

let n = 0;
for (const { slug, title, summary } of need) {
  if (out[slug]?.uk?.title && out[slug]?.en?.title) continue;
  n++;
  process.stdout.write(`[${n}] ${slug}\n`);
  let ukTitle = fixUk(await lingva(title, "ru", "uk"));
  await sleep(400);
  let ukSummary = fixUk(await lingva(summary, "ru", "uk"));
  await sleep(400);
  let enTitle = fixEn(await lingva(title, "ru", "en"));
  await sleep(400);
  let enSummary = fixEn(await lingva(summary, "ru", "en"));
  await sleep(400);

  ukTitle = preserveEllipsis(title, ukTitle);
  ukSummary = preserveEllipsis(summary, ukSummary);
  enTitle = preserveEllipsis(title, enTitle);
  enSummary = preserveEllipsis(summary, enSummary);

  out[slug] = {
    uk: { title: ukTitle, summary: ukSummary },
    en: { title: enTitle, summary: enSummary },
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
}

console.log(`Fill: ${Object.keys(out).length} slugs in ${outPath}`);
