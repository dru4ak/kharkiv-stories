import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const part1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-translations-part1.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-translations-part2.json'), 'utf8'));
const manual = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-manual.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(__dirname, '_ru-slice.json'), 'utf8'));

const merged = { ...part1, ...part2, ...manual };
const out = {};
for (const item of ru) {
  const tr = merged[item.slug];
  if (!tr?.uk?.title || !tr?.en?.title) throw new Error(`Missing ${item.slug}`);
  out[item.slug] = tr;
}

fs.writeFileSync(path.join(__dirname, 'batch-3.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('Written', Object.keys(out).length, 'slugs');
