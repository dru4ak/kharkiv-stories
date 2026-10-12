/**
 * Fill src/data/locals.i18n.json with uk (and en) translations from locals.json.
 * Resumable — skips slugs that already have a body for the target locale.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const localsPath = join(root, "src/data/locals.json");
const i18nPath = join(root, "src/data/locals.i18n.json");

const TARGETS = process.argv.slice(2);
const locales = TARGETS.length ? TARGETS : ["uk"];

const locals = JSON.parse(readFileSync(localsPath, "utf8"));
/** @type {Record<string, any>} */
let i18n = {};
try {
  i18n = JSON.parse(readFileSync(i18nPath, "utf8"));
} catch {
  i18n = {};
}

function splitBySize(text, max) {
  const parts = [];
  let rest = text;
  while (rest.length > max) {
    let cut = rest.slice(0, max);
    const stop = Math.max(
      cut.lastIndexOf("\n\n"),
      cut.lastIndexOf(". "),
      cut.lastIndexOf("! "),
      cut.lastIndexOf("? "),
      cut.lastIndexOf(" "),
    );
    if (stop > 80) cut = cut.slice(0, stop + 1);
    parts.push(cut);
    rest = rest.slice(cut.length);
  }
  if (rest) parts.push(rest);
  return parts;
}

async function translatePiece(piece, tl) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ru");
  url.searchParams.set("tl", tl);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", piece);

  let lastErr;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url.href);
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = await res.json();
      const translated = (data[0] || []).map((row) => row[0]).join("");
      if (!translated) throw new Error("empty");
      return translated;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function translateText(text, tl) {
  const parts = splitBySize(text, 1400);
  const out = [];
  for (const part of parts) {
    out.push(await translatePiece(part, tl));
    await new Promise((r) => setTimeout(r, 120));
  }
  return out.join("");
}

function save() {
  writeFileSync(i18nPath, JSON.stringify(i18n, null, 2) + "\n", "utf8");
}

let done = 0;
let skipped = 0;

for (const locale of locales) {
  for (let i = 0; i < locals.length; i++) {
    const legend = locals[i];
    const slug = legend.slug;
    const existing = i18n[slug]?.[locale];
    if (existing?.title && existing?.body) {
      skipped++;
      continue;
    }

    process.stdout.write(
      `\r[${locale}] ${i + 1}/${locals.length} ${slug.slice(0, 40).padEnd(40)}`,
    );

    try {
      const title = await translateText(legend.title, locale);
      const body = await translateText(legend.body, locale);
      let placeName;
      if (legend.placeName) {
        placeName = await translateText(legend.placeName, locale);
      }

      if (!i18n[slug]) i18n[slug] = {};
      i18n[slug][locale] = {
        title: title.trim(),
        body: body.trim(),
        ...(placeName ? { placeName: placeName.trim() } : {}),
      };
      done++;
      if (done % 3 === 0) save();
    } catch (err) {
      console.error(`\nFAIL ${slug}:`, err.message || err);
      save();
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

save();
console.log(`\nDone. translated=${done} skipped=${skipped}`);
console.log(`Wrote ${i18nPath}`);
