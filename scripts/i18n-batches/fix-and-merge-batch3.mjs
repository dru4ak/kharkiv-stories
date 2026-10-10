import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const part1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-translations-part1.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-translations-part2.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(__dirname, '_ru-slice.json'), 'utf8'));

const merged = { ...part1, ...part2 };

const ukFixes = [
  [/хarkів/gi, 'харків'],
  [/Хarkiv/g, 'Харків'],
  [/Хarkov/g, 'Харків'],
  [/Хarkova/g, 'Харкова'],
  [/Хarkovі/g, 'Харкові'],
  [/Хarkів/g, 'Харків'],
  [/Едіta/g, 'Едіта'],
  [/Капітane Титarenko/g, 'Капітане Титаренко'],
  [/feuilleton/g, 'фельетон'],
  [/сatiричній/g, 'сатиричній'],
  [/Гorkого/g, 'Горького'],
  [/автокorteж/g, 'автокorteж'],
  [/зйomках/g, 'зйomках'],
  [/кіnofilmу/g, 'кіnofilmу'],
  [/Basov/g, 'Basov'],
  [/Мikolaieвої/g, 'Мikolaieвої'],
  [/удostoeny/g, 'удostoeny'],
  [/experimentу/g, 'experimentу'],
  [/SPROBA/g, 'СПРОБА'],
  [/Kafeshantan/g, 'Kafeshantan'],
  [/ideologічних/g, 'ideologічних'],
  [/intelligentsії/g, 'intelligentsії'],
  [/profesora/g, 'profesora'],
  [/Krokodil/g, 'Krokodil'],
  [/Monakhov/g, 'Monakhov'],
  [/illusionistка/g, 'illusionistка'],
  [/Denisova/g, 'Denisova'],
  [/efektna/g, 'efektna'],
  [/nepomітно/g, 'nepomітно'],
  [/burый/g, 'burый'],
  [/vedmidь/g, 'vedmidь'],
  [/nespodivano/g, 'nespodivano'],
  [/bilетerку/g, 'bilетerку'],
  [/chimalo/g, 'chimalo'],
  [/ZAOHOCHENNYA/g, 'ЗAOHOCHENNYA'],
  [/poхov/g, 'похov'],
  [/Leskova/g, 'Leskova'],
  [/vo…/g, 'vo…'],
  [/Rylsky/g, 'Rylsky'],
  [/Shapoval/g, 'Shapoval'],
  [/Dobrovolsky/g, 'Dobrovolsky'],
  [/Dzerzhinsky/g, 'Dzerzhinsky'],
  [/Kholodkov/g, 'Kholodkov'],
  [/Yalta/g, 'Yalta'],
  [/жebрака/g, 'жebрака'],
  [/VKh/g, 'VKh'],
  [/Chernohuz/g, 'Chernohuz'],
  [/Vysotsky/g, 'Vysotsky'],
  [/Maestro/g, 'Maestro'],
  [/vagою/g, 'vagою'],
  [/Mikita/g, 'Mikita'],
  [/gestapo/g, 'gestapo'],
  [/Gestapo/g, 'Gestapo'],
  [/satiричні/g, 'satiричні'],
  [/bagatotirazhky/g, 'bagatotirazhky'],
  [/memorialного/g, 'memorialного'],
  [/secretar/g, 'secretar'],
  [/miskoma/g, 'miskoma'],
  [/spektakль/g, 'spektakль'],
  [/kazку/g, 'kazку'],
  [/obkomi/g, 'obkomi'],
  [/komсomolu/g, 'komсomolu'],
  [/зустрichей/g, 'зустрichей'],
  [/samobranku/g, 'samobranku'],
  [/Blumen/g, 'Blumen'],
  [/ustremив/g, 'ustremив'],
  [/Saltівському/g, 'Saltівському'],
  [/прибulих/g, 'прибulих'],
  [/зgadok/g, 'зgadok'],
  [/KHOLodNA/g, 'KHOLodNA'],
  [/first-graderу/g, 'first-graderу'],
  [/Pivdennomu/g, 'Pivdennomu'],
  [/vokzali/g, 'vokzali'],
  [/Ogoniok/g, 'Ogoniok'],
  [/grandiозна/g, 'grandiозна'],
  [/etude/g, 'etude'],
  [/smycok/g, 'smycok'],
  [/zaspokоєння/g, 'zaspokоєnня'],
  [/litaka/g, 'litaka'],
  [/gastrolerom/g, 'gastrolerom'],
  [/Pankratov/g, 'Pankratov'],
  [/estrady/g, 'estrady'],
  [/Klara/g, 'Klara'],
  [/opovіді/g, 'opovіді'],
  [/Kleve/g, 'Kleve'],
  [/Bolgar/g, 'Bolgar'],
  [/BagalShD/g, 'BagalShD'],
  [/profesorу-ekonomісту Є\. Ліbermanу/g, 'професору-екonomісту Є. Ліbermanу'],
];

function fixUk(s) {
  let out = s;
  for (const [re, rep] of ukFixes) out = out.replace(re, rep);
  // remaining mixed latin in cyrillic words: simple heuristic
  out = out.replace(/([А-Яа-яІіЇїЄєҐґ']) ([a-z])/g, (_, a, b) => a + b);
  return out;
}

// Manual complete overrides for entries with broken uk text
const manual = JSON.parse(fs.readFileSync(path.join(__dirname, 'batch-3-manual.json'), 'utf8'));

for (const slug of Object.keys(merged)) {
  if (manual[slug]) merged[slug] = manual[slug];
  else {
    merged[slug].uk.summary = fixUk(merged[slug].uk.summary);
    if (merged[slug].uk.title) merged[slug].uk.title = fixUk(merged[slug].uk.title);
  }
}

// Fix known JSON typo in part1
merged['ego-prigovoril-gitler'].en.summary =
  'That imposing voice was familiar to several generations of Soviet people. They listened to it especially closely during the Great Patriotic War, when Information Bureau reports on Kharkiv… were read over All-Union Radio.';

merged['vse-vrut'].uk.summary =
  '«Усі політики брешуть, та це не має значення, бо їм усе одно ніхто не вірить» — цей знаменитий афоризм належить харків'янину, професору-екonomісту Є. Ліbermanу. Проте прославився наш з…';
merged['vse-vrut'].en.summary =
  '“All politicians lie, but it does not matter, because nobody believes them anyway” — this famous aphorism belongs to Kharkiv professor-economist E. Liberman. Yet our fellow countryman became famous for…';

const out = {};
for (const item of ru) {
  const tr = merged[item.slug];
  if (!tr) throw new Error('Missing ' + item.slug);
  out[item.slug] = tr;
}

fs.writeFileSync(path.join(__dirname, 'batch-3.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('batch-3.json:', Object.keys(out).length, 'slugs');
