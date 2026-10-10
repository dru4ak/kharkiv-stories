import fs from "node:fs";

const stories = JSON.parse(fs.readFileSync("src/data/stories.json", "utf8"));
const i18n = JSON.parse(fs.readFileSync("src/data/stories.i18n.json", "utf8"));

/** Точечные правки, где украинский должен отличаться от русского. */
const map = {
  "za-golosami": "ЗА ГОЛОСАМИ",
  "pan-ta-sobaka": "ПАН ТА СОБАКА",
  ryatuyte: "РЯТУЙТЕ",
  "shef-stroganov": "ШЕФ СТРОГАНОВ",
  darom: "ДАРМА",
  "ne-na-togo-napali": "НЕ НА ТОГО НАПАЛИ",
  "saymon-kuznets": "САЙМОН КУЗНЕЦЬ",
  "lev-landau": "ЛЕВ ЛАНДАУ",
};

let n = 0;
for (const [slug, title] of Object.entries(map)) {
  if (!i18n[slug]) continue;
  i18n[slug].uk = i18n[slug].uk || {};
  i18n[slug].uk.title = title;
  n++;
}

// Лёгкая нормализация типичных русизмов в UK-заголовках
const replacers = [
  [/ХАРЬКОВ/g, "ХАРКІВ"],
  [/ХАРЬКОВЕ/g, "ХАРКОВІ"],
  [/ХАРЬКОВА/g, "ХАРКОВА"],
  [/ХАРЬКОВУ/g, "ХАРКОВУ"],
  [/ХАРЬКОВСКИЙ/g, "ХАРКІВСЬКИЙ"],
  [/ХАРЬКОВСКАЯ/g, "ХАРКІВСЬКА"],
  [/ХАРЬКОВСКОЕ/g, "ХАРКІВСЬКЕ"],
  [/ХАРЬКОВСКИЕ/g, "ХАРКІВСЬКІ"],
  [/ЧТО /g, "ЩО "],
  [/ЭТО /g, "ЦЕ "],
  [/ЕЩЕ/g, "ЩЕ"],
  [/ЖИЗНЬ/g, "ЖИТТЯ"],
];

let norm = 0;
for (const s of stories) {
  const slot = i18n[s.slug];
  if (!slot?.uk?.title) continue;
  let t = slot.uk.title;
  const before = t;
  for (const [re, to] of replacers) t = t.replace(re, to);
  if (t !== before) {
    slot.uk.title = t;
    norm++;
  }
}

fs.writeFileSync(
  "src/data/stories.i18n.json",
  JSON.stringify(i18n, null, 2),
  "utf8",
);
console.log({ mapped: n, normalized: norm });
