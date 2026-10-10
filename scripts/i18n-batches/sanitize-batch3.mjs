import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'batch-3.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const ukReplacements = [
  [/хarkів/gi, 'харків'],
  [/Хarkiv/g, 'Харків'],
  [/Хarkov/g, 'Харків'],
  [/Хarkova/g, 'Харкова'],
  [/Хarkovі/g, 'Харкові'],
  [/Хarkів/g, 'Харків'],
  [/Едіta/g, 'Едіта'],
  [/сatiричній/g, 'сatiричній'],
  [/сatiричні/g, 'сatiричні'],
  [/feuilleton/g, 'фельетон'],
  [/Гorkого/g, 'Горького'],
  [/автокorteж/g, 'автокортеж'],
  [/зйomках/g, 'зйomках'],
  [/зйomок/g, 'зйomок'],
  [/кіnofilmу/g, 'кіnofilmу'],
  [/Basov/g, 'Basov'],
  [/Мikolaieвої/g, 'М. Nikolaieвої'],
  [/удostoeny/g, 'удостоєної'],
  [/експерimentу/g, 'експерimentу'],
  [/Випrobovuvach/g, 'Випrobovuvach'],
  [/вatкою/g, 'вatкою'],
  [/зmoченою/g, 'зmoченою'],
  [/Вatку/g, 'Вatку'],
  [/ТРЕТЯ СPROBA/g, 'ТРЕТЯ СПРОБА'],
  [/Кafeshantan/g, 'Кafeshantan'],
  [/ideologічних/g, 'ideologічних'],
  [/intelligentsії/g, 'intelligentsії'],
  [/Крокodil/g, 'Крокodil'],
  [/Monakhov/g, 'Monakhov'],
  [/кabinet/g, 'кabinet'],
  [/очolював/g, 'очolював'],
  [/Нарocно/g, 'Нарocно'],
  [/profesora/g, 'profesora'],
  [/Запashny/g, 'Запashny'],
  [/illusionistка/g, 'illusionistка'],
  [/Denisova/g, 'Denisova'],
  [/efektna/g, 'efektna'],
  [/nepomітно/g, 'nepomітно'],
  [/burый/g, 'burый'],
  [/vedmidь/g, 'vedmidь'],
  [/nespodivano/g, 'nespodivano'],
  [/bilетerку/g, 'bilетerку'],
  [/чimalo/g, 'чimalo'],
  [/ЗAOHOCHENNYA/g, 'ЗAOHOCHENNYA'],
  [/похov/g, 'похov'],
  [/Leskova/g, 'Leskova'],
  [/profesorу-ekonomісту/g, 'професору-екonomісту'],
  [/Ліbermanу/g, 'Ліbermanу'],
  [/spektakль/g, 'spektakль'],
  [/Кvitky/g, 'Кvitky'],
  [/дрibницями/g, 'дрibницями'],
  [/струmenem/g, 'струmenem'],
  [/бagatometровий/g, 'бagatometровий'],
  [/profesorу-екonomісту Є\. Ліbermanу/g, 'професору-екonomісту Є. Ліbermanу'],
];

function cleanUk(s) {
  let out = s;
  for (const [re, rep] of ukReplacements) out = out.replace(re, rep);
  return out;
}

for (const v of Object.values(data)) {
  v.uk.title = cleanUk(v.uk.title);
  v.uk.summary = cleanUk(v.uk.summary);
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Sanitized', Object.keys(data).length, 'entries');
