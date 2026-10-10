import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ru = JSON.parse(fs.readFileSync(path.join(dir, '_ru-slice.json'), 'utf8'));
const part1 = JSON.parse(
  fs.readFileSync(path.join(dir, 'batch-3-translations-part1.json'), 'utf8'),
);
const part2 = JSON.parse(
  fs.readFileSync(path.join(dir, 'batch-3-translations-part2.json'), 'utf8'),
);
const manual = JSON.parse(
  fs.readFileSync(path.join(dir, 'batch-3-manual.json'), 'utf8'),
);
const ukOverrides = JSON.parse(
  fs.readFileSync(path.join(dir, 'batch-3-uk-overrides.json'), 'utf8'),
);

const merged = { ...part1, ...part2, ...manual };
for (const [slug, patch] of Object.entries(ukOverrides)) {
  merged[slug] = { ...merged[slug], ...patch };
  if (patch.uk) merged[slug].uk = patch.uk;
}
const out = {};
for (const item of ru) {
  const tr = merged[item.slug];
  if (!tr?.uk?.title || !tr?.en?.title) {
    throw new Error(`Missing ${item.slug}`);
  }
  out[item.slug] = {
    uk: { title: tr.uk.title, summary: tr.uk.summary },
    en: { title: tr.en.title, summary: tr.en.summary },
  };
}

const outPath = path.join(dir, 'batch-3.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');

const bad = [];
for (const [slug, v] of Object.entries(out)) {
  const t = (v.uk.title || '') + (v.uk.summary || '');
  if (/[a-zA-Z]/.test(t) && slug !== 'slobozhanskiy-r1dniy-kray') {
    bad.push(slug);
  }
}
console.log('Written', Object.keys(out).length, 'slugs');
if (bad.length) console.warn('UK still has Latin:', bad.join(', '));
