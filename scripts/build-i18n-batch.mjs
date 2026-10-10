/**
 * Build scripts/i18n-batches/batch-N.json from stories-meta.json slice.
 * Usage: node scripts/build-i18n-batch.mjs 0 95
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const metaPath = path.join(root, "scripts/stories-meta.json");
const outDir = path.join(root, "scripts/i18n-batches");

const batchIndex = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 95);
const start = batchIndex * count;
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")).slice(start, start + count);

const EMAIL = "kharkiv-stories-i18n@proton.me";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateOnce(text, langpair) {
  const q = text.slice(0, 450);
  if (!q.trim()) return "";
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}` +
    `&langpair=${langpair}&de=${encodeURIComponent(EMAIL)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText ?? "";
  if (!translated || /MYMEMORY WARNING/i.test(translated)) {
    throw new Error(translated || "empty translation");
  }
  return translated;
}

async function translate(text, langpair, retries = 10) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await translateOnce(text, langpair);
    } catch (err) {
      lastErr = err;
      await sleep(1200 * Math.pow(1.5, i) + Math.random() * 400);
    }
  }
  throw lastErr;
}

function endsEllipsis(s) {
  return /…$|\.\.\.$/.test(s.trim());
}

function preserveEllipsis(source, translated) {
  let t = translated.trim();
  if (endsEllipsis(source)) {
    t = t.replace(/\.{3}$|…$/u, "").trim();
    t = t + "…";
  }
  return t;
}

function fixUk(text, slug) {
  let t = text;
  t = t.replace(/\s*'\s*/g, "'");
  t = t.replace(/харків'ян/gi, "харків'ян");
  t = t.replace(/Харков(?!а)/g, "Харків");
  t = t.replace(/харков(?!а)/g, "харків");
  t = t.replace(/Харьков/g, "Харків");
  t = t.replace(/харьков/g, "харків");
  t = t.replace(/Харьковск/g, "Харківськ");
  t = t.replace(/харьковск/g, "харківськ");
  t = t.replace(/Цыпин/g, "Ципін");
  t = t.replace(/Савелий/g, "Савелій");
  t = t.replace(/Савелия/g, "Савелія");
  t = t.replace(/Лопань/g, "Лопань");
  t = t.replace(/Нетечь/g, "Нетеч");
  t = t.replace(/Гончаровк/g, "Гончарівк");
  t = t.replace(/Рогань/g, "Рогань");
  t = t.replace(/Северский Донец/g, "Сіверський Донець");
  t = t.replace(/Перу Савелія/g, "Перу Савелія Ципіна");
  if (slug === "ilya-mechnikov") t = t.replace(/МЕЧНІ|Мечні/g, "МЕЧНИКОВ");
  if (slug === "saymon-kuznets") {
    t = t.replace(/СИМОН КОВАЛЬ|Симон ковал/gi, "САЙМОН КУЗНЕЦ");
    t = t.replace(/Блексміт/g, "Кузнец");
  }
  if (slug === "annotatsiya") {
    t = t.replace(/казках та жартах/gi, "байках і анекдотах");
  }
  return t;
}

function fixEn(text, slug) {
  let t = text;
  t = t.replace(/Kharkov/g, "Kharkiv");
  t = t.replace(/Kharkovian/gi, "Kharkiv");
  t = t.replace(/Tsypin 's Peru|Saveliy Tsypin 's Peru|Peru owns/gi, (m) =>
    m.includes("Peru owns") ? "Saveliy Tsypin is the author of" : "Saveliy Tsypin",
  );
  t = t.replace(/Saveliy Tsypin's Peru owns/g, "Saveliy Tsypin is the author of");
  t = t.replace(/Ellipse\b/g, "ECLIPSE");
  t = t.replace(/From:$/g, "WHERE DID KHARKIV COME FROM?");
  t = t.replace(/Spotter\b/g, "GOVERNOR BY CORRESPONDENCE");
  t = t.replace(/CHECK-IN\b/g, "A ROYAL VISIT");
  t = t.replace(/ON THE STAND\b/g, "QUARTERING TROOPS");
  t = t.replace(/ON PEREKLADNY\b/g, "BY STAGEcoach");
  t = t.replace(/Simon the Blacksmith/gi, "SIMON KUZNETS");
  t = t.replace(/ILYA MECHNI\b/g, "ILYA MECHNIKOV");
  t = t.replace(/Seversky Donets/g, "Siversky Donets");
  t = t.replace(/Netech Company/gi, "Netech");
  t = t.replace(/Pipe - Classic/gi, "PIPE FOR A CLASSIC");
  t = t.replace(/One Night 's Palace/g, "A PALACE FOR ONE NIGHT");
  t = t.replace(/CITY WOULDN 'T BE/g, "AND THERE'D BE NO CITY");
  t = t.replace(/WE BEAT WITH A BROW/g, "WE BOW LOW");
  t = t.replace(/BEAT FOR SOMEONE ELSE 'S ENTOURAGE/g, "FLOGGED OVER A BORROWED COAT");
  t = t.replace(/WITH A LANTERN - HOME/g, "HOME BY LANTERN LIGHT");
  t = t.replace(/BALLS, LUNCHES/g, "BALLS, DINNERS");
  t = t.replace(/in Tales and Jokes/g, "in Yarns and Anecdotes");
  if (slug === "ot-avtora") t = t.replace(/AUTHOR'S NOTE/g, "FROM THE AUTHOR");
  return t;
}

function fixUkTitle(title, slug, ruTitle) {
  let t = fixUk(title, slug);
  if (/^[А-ЯІЇЄҐ«]/.test(ruTitle) && ruTitle === ruTitle.toUpperCase().replace(/[^А-ЯA-Z«»]/g, (c) => c)) {
    // keep shouty titles uppercased when RU was mostly upper
    const upperRatio = (ruTitle.match(/[А-ЯЁ]/g) || []).length / (ruTitle.match(/[а-яё]/g) || []).length;
    if (ruTitle === ruTitle.toUpperCase() || !ruTitle.match(/[a-zа-яё]/)) {
      t = t.toUpperCase();
    }
  }
  const overrides = {
    annotatsiya: "АНОТАЦІЯ",
    "o-knige-i-ee-avtore": "ПРО КНИГУ ТА ЇЇ АВТОРА",
    "ot-avtora": "ВІД АВТОРА",
    zatmenie: "ЗАТЕМНЕННЯ",
    "otkuda-harkov": "ЗВІДКИ ХАРКІВ?",
    "tri-gerba": "ТРИ ГЕРБИ",
    "raklo-vanko-zhuzhka-i-dr": "«РАКЛО», «ВАНЬКО», «ЖУЖКА» ТА ІН.",
    "na-ulitsu-vyshel-a-ulitsy-net": "НА ВУЛИЦЮ ВИЙШОВ, А ВУЛИЦІ НЕМАЄ",
    "kuda-delas-netech": "КУДИ ПОДІЛАСЬ НЕТЕЧ?",
    "ilya-mechnikov": "ІЛЛЯ МЕЧНИКОВ",
    "saymon-kuznets": "САЙМОН КУЗНЕЦ",
    "lev-landau": "ЛЕВ ЛАНДАУ",
    "po-odezhke-vstrechali": "ПО ОДЯГУ ЗУСТРІЧАЛИ...",
    "svatane-na-goncharovke": "СВАТАННЯ НА ГОНЧАРІВЦІ",
    "chelom-bem": "ЧОЛОМ Б'ЄМ",
    "falshivaya-moneta": "ФАЛЬШИВА МОНЕТА",
    "kto-sochinil-pismo-turetskomu-sultanu": "ХТО СКЛАДАВ ЛИС ДО ТУРЕЦЬКОГО СУЛТАНА?",
    "gorod-v-osade": "МІСТО В ОБЛОЗІ",
    "kak-shvedy-pod-harkovom": "ЯК ШВЕДИ ПІД... ХАРКОВОМ",
    "rogan-ne-tolko-pivo": "«РОГАНЬ» — НЕ ЛИШЕ ПИВО",
    "dvorets-na-odnu-noch": "ПАЛАЦ НА ОДНУ НІЧ",
    "mir-lovil-ego": "СВІТ ЛОВИВ ЙОГО",
    "truba-klassiku": "ТРУБА — КЛАСИКУ",
    "i-goroda-b-ne-stalo": "І МІСТА Б НЕ СТАЛО",
    "polkovnik-smutyan": "ПОЛКОВНИК-ЛЮТУВАТЕЛЬ",
    "namestnik-zaochnik": "НАМІСНИК-ЗАОЧНИК",
    zaezdom: "ЗАЇЗДОМ",
    "gde-obitali-gubernatory": "ДЕ МЕШКАЛИ ГУБЕРНАТОРИ",
    "let-za-dvesti-na-odnom-meste": "ЛЕТ ЗА ДВІСТІ НА ОДНОМУ МІСЦІ",
    "na-perekladnyh": "НА ПЕРЕКЛАДНИХ",
    "na-postoy": "НА ПОСТІЙ",
    "uchenyy-v-kutuzku": "УЧЕНИЙ? У КУТУЗКУ!",
    "bito-za-chuzhuyu-svitu": "БИТО ЗА ЧУЖУ СВИТУ",
    "kryuchok-ot-lyustry": "ГАК ВІД ЛЮСТРИ",
    "ukrali-most": "УКРАЛИ МІСТ",
    "odin-kupets-dvuh-gubernatorov-odolel": "ОДИН КУПЕЦЬ ДВОХ ГУБЕРНАТОРІВ ПЕРЕМІГ",
    "krasnyy-petuh": "ЧЕРВОНИЙ ПІВЕНЬ",
    "s-fonarem-domoy": "З ЛІХТАРЕМ — ДОДОМУ",
    "za-chto": "ЗА ЩО?",
    "baly-obedy-maskarady": "БАЛИ, ОБІДИ, МАСКАРАДИ...",
  };
  if (overrides[slug]) t = overrides[slug];
  return t;
}

function fixEnTitle(title, slug, ruTitle) {
  let t = fixEn(title, slug);
  const overrides = {
    annotatsiya: "ANNOTATION",
    "o-knige-i-ee-avtore": "ABOUT THE BOOK AND ITS AUTHOR",
    "ot-avtora": "FROM THE AUTHOR",
    zatmenie: "ECLIPSE",
    "otkuda-harkov": "WHERE DID KHARKIV COME FROM?",
    "tri-gerba": "THREE COATS OF ARMS",
    "raklo-vanko-zhuzhka-i-dr": "\"RAKLO,\" \"VANKO,\" \"ZHUZHKA,\" AND MORE",
    "na-ulitsu-vyshel-a-ulitsy-net": "OUT INTO THE STREET—AND NO STREET",
    "kuda-delas-netech": "WHERE DID NETECH GO?",
    "ilya-mechnikov": "ILYA MECHNIKOV",
    "saymon-kuznets": "SIMON KUZNETS",
    "lev-landau": "LEV LANDAU",
    "po-odezhke-vstrechali": "JUDGED BY THE CLOTHES...",
    "svatane-na-goncharovke": "MATCHMAKING IN HONCHARIVKA",
    "chelom-bem": "WE BOW LOW",
    "falshivaya-moneta": "COUNTERFEIT COIN",
    "kto-sochinil-pismo-turetskomu-sultanu": "WHO WROTE THE LETTER TO THE TURKISH SULTAN?",
    "gorod-v-osade": "CITY UNDER SIEGE",
    "kak-shvedy-pod-harkovom": "THE SWEDES NEAR... KHARKIV",
    "rogan-ne-tolko-pivo": "\"ROHAN\"—NOT JUST BEER",
    "dvorets-na-odnu-noch": "A PALACE FOR ONE NIGHT",
    "mir-lovil-ego": "THE WORLD SOUGHT HIM",
    "truba-klassiku": "PIPE FOR A CLASSIC",
    "i-goroda-b-ne-stalo": "AND THERE'D BE NO CITY",
    "polkovnik-smutyan": "THE MUTINOUS COLONEL",
    "namestnik-zaochnik": "GOVERNOR BY CORRESPONDENCE",
    zaezdom: "A ROYAL VISIT",
    "gde-obitali-gubernatory": "WHERE THE GOVERNORS LIVED",
    "let-za-dvesti-na-odnom-meste": "TWO CENTURIES IN ONE SPOT",
    "na-perekladnyh": "BY STAGECOACH",
    "na-postoy": "QUARTERING TROOPS",
    "uchenyy-v-kutuzku": "A SCHOLAR? TO THE CORNER!",
    "bito-za-chuzhuyu-svitu": "FLOGGED OVER A BORROWED COAT",
    "kryuchok-ot-lyustry": "THE CHANDELIER HOOK",
    "ukrali-most": "THEY STOLE THE BRIDGE",
    "odin-kupets-dvuh-gubernatorov-odolel": "ONE MERCHANT BEAT TWO GOVERNORS",
    "krasnyy-petuh": "THE RED ROOSTER",
    "s-fonarem-domoy": "HOME BY LANTERN LIGHT",
    "za-chto": "WHAT FOR?",
    "baly-obedy-maskarady": "BALLS, DINNERS, MASQUERADES...",
  };
  if (overrides[slug]) t = overrides[slug];
  else if (ruTitle === ruTitle.toUpperCase()) t = t.toUpperCase();
  return t;
}

const out = {};
let n = 0;

for (const story of meta) {
  n++;
  console.log(`[${n}/${meta.length}] ${story.slug}`);
  const ukTitle = fixUkTitle(
    preserveEllipsis(story.title, await translate(story.title, "ru|uk")),
    story.slug,
    story.title,
  );
  await sleep(350);
  const ukSummary = fixUk(
    preserveEllipsis(story.summary, await translate(story.summary, "ru|uk")),
    story.slug,
  );
  await sleep(350);
  const enTitle = fixEnTitle(
    preserveEllipsis(story.title, await translate(story.title, "ru|en")),
    story.slug,
    story.title,
  );
  await sleep(350);
  const enSummary = fixEn(
    preserveEllipsis(story.summary, await translate(story.summary, "ru|en")),
    story.slug,
  );
  await sleep(350);

  out[story.slug] = {
    uk: { title: ukTitle, summary: ukSummary },
    en: { title: enTitle, summary: enSummary },
  };

  if (n % 5 === 0) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, `batch-${batchIndex}.json`),
      JSON.stringify(out, null, 2),
      "utf8",
    );
  }
}

fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `batch-${batchIndex}.json`);
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${Object.keys(out).length} slugs to ${outPath}`);
