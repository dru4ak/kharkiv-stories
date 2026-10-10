import fs from "fs";
import { createRequire } from "module";

// Read TS data files as text and eval keywords via JSON export we maintain inline from build
const stories = JSON.parse(fs.readFileSync("src/data/stories.json", "utf8"));
const peopleSrc = fs.readFileSync("src/data/people.ts", "utf8");
const placesSrc = fs.readFileSync("src/data/places.ts", "utf8");

function extractBlocks(src, exportName) {
  // crude: find keywords: [ ... ] arrays with name nearby
  const items = [];
  const re =
    /name:\s*"([^"]+)"[\s\S]*?keywords:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1];
    const keywords = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    items.push({ name, keywords });
  }
  return items;
}

const people = extractBlocks(peopleSrc);
const places = extractBlocks(placesSrc);

function count(keywords) {
  return stories.filter((s) => {
    const hay = `${s.title}\n${s.body}`;
    return keywords.some((k) => hay.includes(k));
  }).length;
}

console.log("=== PEOPLE ===");
for (const p of people) console.log(`${count(p.keywords)}\t${p.name}`);
console.log("=== PLACES ===");
for (const p of places) console.log(`${count(p.keywords)}\t${p.name}`);
