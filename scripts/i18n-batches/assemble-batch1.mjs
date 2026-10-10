import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entries as e1 } from "./batch-1-entries.mjs";
import { entries as e2 } from "./batch-1-entries-part2.mjs";
import { entries as e3 } from "./batch-1-entries-part3.mjs";
import { entries as e4 } from "./batch-1-entries-part4.mjs";
import { entries as e5 } from "./batch-1-entries-part5.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const metaPath = path.join(root, "scripts/stories-meta.json");
const outPath = path.join(root, "scripts/i18n-batches/batch-1.json");

const { PLACEHOLDER_REMOVE, ...e1clean } = e1;
const out = { ...e1clean, ...e2, ...e3, ...e4, ...e5 };

const slice = JSON.parse(fs.readFileSync(metaPath, "utf8")).slice(95, 190);
const missing = slice.filter(({ slug }) => !out[slug]).map(({ slug }) => slug);
const extra = Object.keys(out).filter((slug) => !slice.some((s) => s.slug === slug));

if (missing.length) {
  console.error("Missing slugs:", missing);
  process.exit(1);
}
if (extra.length) {
  console.error("Extra slugs:", extra);
  process.exit(1);
}

/** Align summary endings with Russian source (… or truncated tail). */
for (const { slug, summary: ruSum } of slice) {
  for (const lang of ["uk", "en"]) {
    let s = out[slug][lang].summary;
    if (ruSum.endsWith("…") && !s.endsWith("…")) {
      s = s.replace(/\.{3}$/u, "").replace(/\s+$/u, "") + "…";
    } else if (!ruSum.endsWith("…")) {
      const tail = ruSum.slice(-4);
      if (tail && !s.endsWith(tail.replace(/…/u, ""))) {
        const ruEnd = ruSum.slice(-Math.min(8, ruSum.length));
        if (/[а-яіїєґa-z-]$/i.test(ruEnd) && /-$/.test(ruEnd)) {
          // truncated mid-word: keep en/uk truncated similarly
        }
      }
    }
    out[slug][lang].summary = s;
  }
}

const fixes = [
  [/Харьков/g, "Харків"],
  [/харьков/g, "харків"],
  [/Харькова/g, "Харкова"],
  [/харькова/g, "харкова"],
  [/Харькове/g, "Харкові"],
  [/Харькову/g, "Харкову"],
  [/Харьковом/g, "Харковом"],
  [/Харьковщин/g, "Харківщин"],
  [/харьковщин/g, "харківщин"],
  [/харьковян/g, "харків'ян"],
  [/Харьковян/g, "Харків'ян"],
  [/Цыпин/g, "Ципін"],
  [/Савелия/g, "Савелія"],
  [/Савелий/g, "Савелій"],
  [/\bKharkov\b/g, "Kharkiv"],
  [/ZHandARMSKA/g, "ZHANDARMSKA"],
  [/ПОЧЕСНИЙ ГРОМADЯНIN/g, "ПОЧЕСНИЙ ГРОМАДЯНИН"],
  [/НEBAЧЕNE ЧУДОВИЩЕ/g, "НЕБАЧЕНЕ ЧУДОВИЩЕ"],
  [/КУЛЯ В НEBІ/g, "КУЛЯ В НЕБІ"],
  [/ЗAПOVІТ/g, "ЗАПОВІТ"],
  [/НЩАСЛИВЕ/g, "НЕЩАСЛИВЕ"],
  [/dermo-na-zhandarmskoy.*LAЙНО/g, ""],
];

function applyFixes(obj) {
  for (const slug of Object.keys(obj)) {
    for (const lang of ["uk", "en"]) {
      for (const key of ["title", "summary"]) {
        let t = obj[slug][lang][key];
        for (const [re, rep] of fixes) {
          if (rep === "") continue;
          t = t.replace(re, rep);
        }
        obj[slug][lang][key] = t;
      }
    }
  }
}

applyFixes(out);

// Title-specific fixes
out["rastratchik"].en.title = "EMBEZZLER";
out["neschastnaya-lyubov"].uk.title = "НЕЩАСЛИВЕ КОХАННЯ";
out["dermo-na-zhandarmskoy"].uk.title = "ЛАЙНО НА ЖАНДАРМСЬКІЙ";
out["dermo-na-zhandarmskoy"].en.title = "MANURE ON ZHANDARMSKA";
out["pokushenie-na-pushkina"].uk.title = "ЗАМІХ НА... ПУШКІНА";
out["lyubimets-publiki"].uk.title = "УЛЮБЛЕНЕЦЬ ПУБЛІКИ";
out["zheltaya-kofta"].en.summary = out["zheltaya-kofta"].en.summary.replace(
  "An poetry",
  "A poetry",
);

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${Object.keys(out).length} slugs to ${outPath}`);
