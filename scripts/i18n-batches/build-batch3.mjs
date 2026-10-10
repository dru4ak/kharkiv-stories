import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const slice = JSON.parse(fs.readFileSync(path.join(dir, '_ru-slice.json'), 'utf8'));
const outPath = path.join(dir, 'batch-3.json');
const out = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};

const EMAIL = 'kharkiv-stories-i18n@proton.me';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateOnce(text, langpair) {
  const q = text.slice(0, 450);
  if (!q.trim()) return '';
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}` +
    `&langpair=${langpair}&de=${encodeURIComponent(EMAIL)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText ?? '';
  if (!translated || /MYMEMORY WARNING/i.test(translated)) {
    throw new Error(translated || 'empty');
  }
  return translated;
}

async function translate(text, langpair) {
  for (let i = 0; i < 12; i++) {
    try {
      return await translateOnce(text, langpair);
    } catch {
      await sleep(2000 * (i + 1) + Math.random() * 1000);
    }
  }
  throw new Error(`failed ${langpair}`);
}

function fixUk(s) {
  return s
    .replace(/Харьков/g, 'Харків')
    .replace(/харьков/g, 'харків')
    .replace(/Харькова/g, 'Харкова')
    .replace(/харькова/g, 'харкова')
    .replace(/Харькове/g, 'Харкові')
    .replace(/харькове/g, 'харкові')
    .replace(/Харькову/g, 'Харкову')
    .replace(/Харьковом/g, 'Харковом')
    .replace(/Харьковщин/g, 'Харківщин')
    .replace(/харьковщин/g, 'харківщин')
    .replace(/харьковян/g, "харків'ян")
    .replace(/Харьковян/g, "Харків'ян")
    .replace(/Цыпин/g, 'Ципін')
    .replace(/Савелия/g, 'Савелія')
    .replace(/Савелий/g, 'Савелій');
}

function fixEn(s) {
  return s
    .replace(/\bKharkov\b/g, 'Kharkiv')
    .replace(/\bkharkov\b/g, 'kharkiv')
    .replace(/\bKharkovians\b/gi, 'Kharkiv residents')
    .replace(/\bkharkovians\b/gi, 'Kharkiv residents')
    .replace(/Tsypin'?s Peru/gi, 'Saveliy Tsypin')
    .replace(/Цыпин/g, 'Tsypin');
}

function upperTitle(s) {
  return s.toLocaleUpperCase('uk-UA');
}

function save() {
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
}

let n = 0;
for (const { slug, title, summary } of slice) {
  if (out[slug]?.uk?.title && out[slug]?.en?.title && !out[slug]?._needsRetranslate) {
    continue;
  }
  n++;
  process.stdout.write(`[${n}] ${slug}\n`);
  const ukTitle = upperTitle(fixUk(await translate(title, 'ru|uk')));
  await sleep(600);
  let ukSummary = fixUk(await translate(summary, 'ru|uk'));
  if (summary.endsWith('…') && !ukSummary.endsWith('…')) ukSummary += '…';
  await sleep(600);
  const enTitle = upperTitle(fixEn(await translate(title, 'ru|en')));
  await sleep(600);
  let enSummary = fixEn(await translate(summary, 'ru|en'));
  if (summary.endsWith('…') && !enSummary.endsWith('…')) enSummary += '…';
  await sleep(600);

  out[slug] = {
    uk: { title: ukTitle, summary: ukSummary },
    en: { title: enTitle, summary: enSummary },
  };
  delete out[slug]._needsRetranslate;
  save();
}

console.log(`Wrote ${Object.keys(out).length} slugs to ${outPath}`);
