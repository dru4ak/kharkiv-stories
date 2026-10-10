/**
 * Переводит title + summary (+ body кусками) через MyMemory API.
 * Запуск: node scripts/translate-stories.mjs [meta|body] [limit]
 * Продолжает с места остановки (дописывает stories.i18n.json).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storiesPath = path.join(root, "src/data/stories.json");
const outPath = path.join(root, "src/data/stories.i18n.json");

const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
const out = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, "utf8"))
  : {};

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

async function translate(text, langpair, retries = 8) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await translateOnce(text, langpair);
    } catch (err) {
      lastErr = err;
      const wait = 1200 * Math.pow(1.6, i) + Math.random() * 500;
      console.warn(
        `  retry ${i + 1}/${retries}: ${String(err.message).slice(0, 120)} (wait ${Math.round(wait)}ms)`,
      );
      await sleep(wait);
    }
  }
  throw lastErr;
}

async function translateLong(text, langpair) {
  const chunks = [];
  const parts = text.split(/\n\n+/);
  let buf = "";
  for (const part of parts) {
    if ((buf + "\n\n" + part).length > 420) {
      if (buf) chunks.push(buf);
      if (part.length > 420) {
        for (let i = 0; i < part.length; i += 400) {
          chunks.push(part.slice(i, i + 400));
        }
        buf = "";
      } else {
        buf = part;
      }
    } else {
      buf = buf ? `${buf}\n\n${part}` : part;
    }
  }
  if (buf) chunks.push(buf);

  const outChunks = [];
  for (const chunk of chunks) {
    outChunks.push(await translate(chunk, langpair));
    await sleep(450);
  }
  return outChunks.join("\n\n");
}

function metaComplete(slot) {
  return Boolean(
    slot?.uk?.title?.trim() &&
      slot?.uk?.summary?.trim() &&
      slot?.en?.title?.trim() &&
      slot?.en?.summary?.trim(),
  );
}

function bodyComplete(slot) {
  return Boolean(slot?.uk?.body?.trim() && slot?.en?.body?.trim());
}

const MODE = process.argv[2] || "meta"; // meta | body
const LIMIT = Number(process.argv[3] || 0) || stories.length;

let done = 0;
let skipped = 0;

for (const story of stories) {
  if (done >= LIMIT) break;
  const slot = out[story.slug] ?? (out[story.slug] = {});

  try {
    if (MODE === "meta") {
      if (metaComplete(slot)) {
        skipped++;
        continue;
      }
      slot.uk = slot.uk ?? {};
      slot.en = slot.en ?? {};
      if (!slot.uk.title?.trim()) {
        slot.uk.title = await translate(story.title, "ru|uk");
        await sleep(400);
      }
      if (!slot.uk.summary?.trim()) {
        slot.uk.summary = await translate(story.summary, "ru|uk");
        await sleep(400);
      }
      if (!slot.en.title?.trim()) {
        slot.en.title = await translate(story.title, "ru|en");
        await sleep(400);
      }
      if (!slot.en.summary?.trim()) {
        slot.en.summary = await translate(story.summary, "ru|en");
        await sleep(400);
      }
    } else if (MODE === "body") {
      if (bodyComplete(slot)) {
        skipped++;
        continue;
      }
      slot.uk = slot.uk ?? {};
      slot.en = slot.en ?? {};
      if (!slot.uk.body?.trim()) {
        slot.uk.body = await translateLong(story.body, "ru|uk");
        await sleep(500);
      }
      if (!slot.en.body?.trim()) {
        slot.en.body = await translateLong(story.body, "ru|en");
        await sleep(500);
      }
    }
    done++;
    if (done % 3 === 0 || MODE === "body") {
      fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
      console.log(`saved ${done}/${LIMIT} (${story.slug})`);
    }
  } catch (err) {
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
    console.error(`stop at ${story.slug}:`, err.message);
    process.exit(1);
  }
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(
  `done mode=${MODE} translated=${done} skipped=${skipped} entries=${Object.keys(out).length}`,
);
