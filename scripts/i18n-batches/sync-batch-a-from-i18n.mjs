import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "../..");
const batchPath = path.join(dir, "batch-missing-a.json");
const i18nPath = path.join(root, "src/data/stories.i18n.json");

const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));
const i18n = JSON.parse(fs.readFileSync(i18nPath, "utf8"));

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

function cyrillic(s) {
  return /[А-Яа-яЁёІіЇїЄєҐґ]/.test(s);
}

let patched = 0;
for (const slug of Object.keys(batch)) {
  const src = i18n[slug];
  if (!src?.uk?.title || !src?.uk?.summary || !src?.en?.title || !src?.en?.summary)
    continue;
  const badEn = cyrillic(batch[slug].en.title);
  const badUk =
    cyrillic(batch[slug].uk.summary) &&
    batch[slug].uk.summary === batch[slug].en.summary;
  if (!badEn && !badUk) continue;

  batch[slug] = {
    uk: {
      title: fixUk(src.uk.title),
      summary: fixUk(src.uk.summary),
    },
    en: {
      title: fixEn(src.en.title),
      summary: fixEn(src.en.summary),
    },
  };
  patched++;
}

fs.writeFileSync(batchPath, JSON.stringify(batch, null, 2) + "\n", "utf8");
console.log("Patched from i18n:", patched, "total slugs:", Object.keys(batch).length);
