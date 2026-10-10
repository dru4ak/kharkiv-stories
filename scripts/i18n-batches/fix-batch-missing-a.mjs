import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const p = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "batch-missing-a.json",
);
const b = JSON.parse(fs.readFileSync(p, "utf8"));

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

for (const k of Object.keys(b)) {
  for (const lang of ["uk", "en"]) {
    const fix = lang === "uk" ? fixUk : fixEn;
    b[k][lang].title = fix(b[k][lang].title);
    b[k][lang].summary = fix(b[k][lang].summary);
  }
}

fs.writeFileSync(p, JSON.stringify(b, null, 2) + "\n", "utf8");

let bad = 0;
for (const k of Object.keys(b)) {
  if (/Харьков|Kharkov/i.test(JSON.stringify(b[k]))) bad++;
}
console.log("remaining kharkov issues:", bad);
