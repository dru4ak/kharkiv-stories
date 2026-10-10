import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3.json'), 'utf8'));

/** @type {Record<string, {uk?: {title?: string, summary?: string}, en?: {title?: string, summary?: string}}>} */
const fixes = JSON.parse(fs.readFileSync(path.join(__dirname, 'uk-fixes.json'), 'utf8'));

for (const [slug, fix] of Object.entries(fixes)) {
  if (!data[slug]) throw new Error('Unknown slug: ' + slug);
  if (fix.uk) data[slug].uk = { ...data[slug].uk, ...fix.uk };
  if (fix.en) data[slug].en = { ...data[slug].en, ...fix.en };
}

fs.writeFileSync(path.join(__dirname, 'batch-3.json'), JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Applied', Object.keys(fixes).length, 'fixes');
