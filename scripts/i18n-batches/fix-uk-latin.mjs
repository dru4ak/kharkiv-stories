import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(dir, 'batch-3.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const LATIN_TO_CYR = {
  A: 'А',
  B: 'Б',
  C: 'С',
  D: 'Д',
  E: 'Е',
  F: 'Ф',
  G: 'Г',
  H: 'Н',
  I: 'І',
  K: 'К',
  L: 'Л',
  M: 'М',
  N: 'Н',
  O: 'О',
  P: 'П',
  R: 'Р',
  S: 'С',
  T: 'Т',
  U: 'У',
  V: 'В',
  W: 'В',
  Y: 'Й',
  Z: 'З',
  a: 'а',
  b: 'б',
  c: 'с',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'н',
  i: 'і',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  w: 'в',
  y: 'й',
  z: 'з',
};

const PRESERVE = [/КОМУН1СТ/g, /ПОВ1Я/g, /pov!st1/gi, /Romani 1 pov!st1/gi, /Р1ДНИЙ/g];

function latinToCyrillic(text) {
  const slots = [];
  let masked = text;
  for (const re of PRESERVE) {
    masked = masked.replace(re, (m) => {
      const id = `\uE000${slots.length}\uE001`;
      slots.push(m);
      return id;
    });
  }
  masked = masked.replace(/[a-zA-Z]/g, (ch) => LATIN_TO_CYR[ch] ?? ch);
  slots.forEach((m, i) => {
    masked = masked.replace(`\uE000${i}\uE001`, m);
  });
  return masked;
}

function cleanUk(s) {
  let out = latinToCyrillic(s);
  out = out.replace(/\bХарков\b(?!а|у|і|о|е|щ)/g, 'Харків');
  return out;
}

for (const v of Object.values(data)) {
  v.uk.title = cleanUk(v.uk.title);
  v.uk.summary = cleanUk(v.uk.summary);
}

data['vse-vrut'].uk.summary =
  '\u00AB\u0423\u0441\u0456 \u043F\u043E\u043B\u0456\u0442\u0438\u043A\u0438 \u0431\u0440\u0435\u0448\u0443\u0442\u044C, \u0442\u0430 \u0446\u0435 \u043D\u0435 \u043C\u0430\u0454 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F, \u0431\u043E \u0457\u043C \u0443\u0441\u0435 \u043E\u0434\u043D\u043E \u043D\u0456\u0445\u0442\u043E \u043D\u0435 \u0432\u0456\u0440\u0438\u0442\u044C\u00BB \u2014 \u0446\u0435\u0439 \u0437\u043D\u0430\u043C\u0435\u043D\u0438\u0442\u0438\u0439 \u0430\u0444\u043E\u0440\u0438\u0437\u043C \u043D\u0430\u043B\u0435\u0436\u0438\u0442\u044C \u0445\u0430\u0440\u043A\u0456\u0432\u0027\u044F\u043D\u0438\u043D\u0443, \u043F\u0440\u043E\u0444\u0435\u0441\u043E\u0440\u0443-\u0435\u043A\u043E\u043D\u043E\u043C\u0456\u0441\u0442\u0443 \u0404. \u041B\u0456\u0431\u0435\u0440\u043C\u0430\u043D\u0443. \u041F\u0440\u043E\u0442\u0435 \u043F\u0440\u043E\u0441\u043B\u0430\u0432\u0438\u0432\u0441\u044F \u043D\u0430\u0448 \u0437\u2026';

data['ispolzovannye-istochniki'].uk = {
  title: 'ВИКОРИСТАНІ ДЖЕРЕЛА',
  summary:
    '1. \u0411\u0430\u0433\u0430\u043B\u0435\u0439 \u0414. \u0406. \u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0421\u043B\u043E\u0431\u043E\u0436\u0430\u043D\u0449\u0438\u043D\u0438 \u0423\u043A\u0440\u0430\u0457\u043D\u0438. \u2014 \u0425\u0430\u0440\u043A\u0456\u0432: \u00AB\u041E\u0441\u043D\u043E\u0432\u0430\u00BB, 1990. 2. \u0411\u0430\u0433\u0430\u043B\u0435\u0439 \u0414. \u0406., \u041C\u0456\u043B\u043B\u0435\u0440 \u0414. \u041F. \u0406\u0441\u0442\u043E\u0440\u0456\u044F \u043C\u0456\u0441\u0442\u0430 \u0425\u0430\u0440\u043A\u043E\u0432\u0430 \u0437\u0430 250 \u0440\u043E\u043A\u0456\u0432 \u0439\u043E\u0433\u043E \u0456\u0441\u043D\u0443\u0432\u0430\u043D\u043D\u044F. \u2014 \u0425\u0430\u0440\u043A\u0456\u0432, 1912. 3. \u0414\u044F\u0447\u0435\u043D\u043A\u043E \u0412. \u0422. \u0412\u0443\u043B\u0438\u0446\u0456 \u0442\u0430 \u043F\u043B\u043E\u0449\u0456\u2026',
};

data['iz-pod-nozha'].uk.summary = data['iz-pod-nozha'].uk.summary.replace(
  /pov!st1/g,
  'pov!сті1',
);

data['slobozhanskiy-r1dniy-kray'].uk.summary =
  '\u0410\u0432\u0442\u043E\u0440-\u0443\u043A\u043B\u0430\u0434\u0430\u0447 \u0446\u0456\u0454\u0457 \u043A\u043D\u0438\u0436\u043A\u0438 \u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C 35 \u0440\u043E\u043A\u0456\u0432 \u0441\u0432\u043E\u0454\u0457 \u0442\u0432\u043E\u0440\u0447\u043E\u0457 \u0434\u0456\u044F\u043B\u044C\u043D\u043E\u0441\u0442\u0456 \u0431\u0440\u0430\u0432 \u0443\u0447\u0430\u0441\u0442\u044C \u0443 \u0431\u0430\u0433\u0430\u0442\u044C\u043E\u0445 \u0432\u0435\u0441\u0435\u043B\u0438\u0445 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F\u0445, \u0437\u043E\u043A\u0440\u0435\u043C\u0430 \u0432 \u041E\u0434\u0435\u0441\u0456, \u0420\u0438\u0437\u0456, \u0421\u043E\u0447\u0456, \u041A\u043B\u0435\u0432\u0435, \u041C\u043E\u0441\u043A\u0432\u0456, \u0417\u0430\u043F\u043E\u0440\u0456\u0436\u0436\u0456, \u0421\u043E\u0440\u043E\u0447\u0438\u043D\u0446\u044F\u0445, \u0411\u043E\u043B\u0433\u0430\u0440\u0456\u0457\u2026';

if (data['u-kompozitora-ukrali-ne-motiv']?.en) {
  data['u-kompozitora-ukrali-ne-motiv'].en.summary = data[
    'u-kompozitora-ukrali-ne-motiv'
  ].en.summary.replace('Editá Pieha', 'Edita Pieha');
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');

const bad = Object.entries(data).filter(([, v]) =>
  /[a-zA-Z]/.test((v.uk.title || '') + (v.uk.summary || '')),
);
console.log('UK latin remaining:', bad.length ? bad.map(([s]) => s).join(', ') : 'none');
