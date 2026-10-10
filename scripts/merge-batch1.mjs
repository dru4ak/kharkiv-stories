import fs from "node:fs";

const out = JSON.parse(fs.readFileSync("src/data/stories.i18n.json", "utf8"));
const batch = JSON.parse(
  fs.readFileSync("scripts/i18n-batches/batch-1.json", "utf8"),
);

let n = 0;
let changed = 0;

for (const [slug, entry] of Object.entries(batch)) {
  if (!entry?.uk?.title || !entry?.en?.title) continue;
  const prev = JSON.stringify(out[slug]?.uk) + JSON.stringify(out[slug]?.en);
  out[slug] = out[slug] || {};
  out[slug].uk = { ...(out[slug].uk || {}) };
  out[slug].en = { ...(out[slug].en || {}) };
  for (const lang of ["uk", "en"]) {
    if (entry[lang]?.title) out[slug][lang].title = entry[lang].title;
    if (entry[lang]?.summary) out[slug][lang].summary = entry[lang].summary;
  }
  n++;
  const next = JSON.stringify(out[slug]?.uk) + JSON.stringify(out[slug]?.en);
  if (prev !== next) changed++;
}

function polishUk(s) {
  if (!s) return s;
  return s
    .replace(/([А-Яа-яІіЇїЄєҐґ])IN\b/g, "$1ІН")
    .replace(/([А-Яа-яІіЇїЄєҐґ])in\b/g, "$1ін")
    .replace(/Харьков/g, "Харків")
    .replace(/ХАРЬКОВ/g, "ХАРКІВ")
    .replace(/ГРОМАДЯНIN/g, "ГРОМАДЯНИН")
    .replace(/громадянin/gi, "громадянин");
}

let polished = 0;
for (const slug of Object.keys(batch)) {
  if (!out[slug]?.uk) continue;
  for (const field of ["title", "summary"]) {
    const before = out[slug].uk[field];
    const after = polishUk(before);
    if (after !== before) {
      out[slug].uk[field] = after;
      polished++;
    }
  }
}

fs.writeFileSync(
  "src/data/stories.i18n.json",
  JSON.stringify(out, null, 2),
  "utf8",
);

let meta = 0;
for (const x of Object.values(out)) {
  if (x.uk?.title && x.uk?.summary && x.en?.title && x.en?.summary) meta++;
}

console.log({
  merged: n,
  changed,
  polished,
  metaComplete: meta,
  pochetnyy: out["pochetnyy-grazhdanin"]?.uk?.title,
});
