import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entries as batch1Partial } from "./batch-1-entries.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const meta = JSON.parse(
  fs.readFileSync(path.join(dir, "missing-meta.json"), "utf8"),
);
const half = Math.ceil(meta.length / 2);
const slice = meta.slice(0, half);

const batch0 = JSON.parse(
  fs.readFileSync(path.join(dir, "batch-0.json"), "utf8"),
);

/** @type {Record<string, { uk: { title: string; summary: string }; en: { title: string; summary: string } }>} */
const T = {
  ...batch0,
  "ulovka-artista": {
    uk: {
      title: "УЛОВКА АРТИСТА",
      summary:
        "Полтавчанин Іван Котляревський, не припиняючи праці над поемою «Енеїда», написав п'єси «Наталка Полтавка» та «Москаль-чарівник». Але де їх поставити? У рідному місті театру не було. І тут у справу вступ…",
    },
    en: {
      title: "AN ACTOR'S RUSE",
      summary:
        "Ivan Kotlyarevsky of Poltava, without pausing work on his poem Eneida, wrote the plays Natalka Poltavka and Moskal-charivnyk. But where to stage them? His hometown had no theater. Then…",
    },
  },
  "lechenie-rozgami": batch1Partial["lechenie-rozgami"],
  darom: batch1Partial.darom,
};

for (const name of ["batch-missing-a-fill.json", "batch-missing-a-fill-rest.json"]) {
  const fillPath = path.join(dir, name);
  if (fs.existsSync(fillPath)) {
    Object.assign(T, JSON.parse(fs.readFileSync(fillPath, "utf8")));
  }
}

const missing = slice.filter((m) => !T[m.slug]);
if (missing.length) {
  console.error(
    "Missing translations:",
    missing.length,
    missing.map((m) => m.slug).join(", "),
  );
  process.exit(1);
}

const out = {};
for (const { slug } of slice) out[slug] = T[slug];

const outPath = path.join(dir, "batch-missing-a.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("Wrote", Object.keys(out).length, "slugs to", outPath);
