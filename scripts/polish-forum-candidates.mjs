/**
 * Чистит candidates.json: убирает цитаты/мусор, ставит внятные заголовки.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content", "locals-from-forum");
const candidatesPath = path.join(dir, "candidates.json");
const previewPath = path.join(dir, "CANDIDATES.md");

const knownTitles = [
  {
    test: /платинов|бухту проволоки|журавлевск/i,
    title: "ПЛАТИНОВАЯ ПРОВОЛОКА НА ЖУРАВЛЕВКЕ",
    placeName: "Журавлевка",
    yearStart: 1975,
    yearEnd: 1979,
  },
  {
    test: /ІДАЛЬНЯ|ПЕРУКАРНЯ|idalnya|перукарн/i,
    title: "УЛИЦА СТОЛОВЫХ И ПАРИКМАХЕРСКИХ",
    placeName: "возле вокзала",
    yearStart: 1970,
    yearEnd: 1979,
  },
  {
    test: /колесо от трактора|памятник.*шевченко/i,
    title: "КОЛЕСО ОТ ТРАКТОРА НА ПАМЯТНИКЕ ШЕВЧЕНКО",
    placeName: "Сад Шевченко",
  },
  {
    test: /подземный гараж|огпу|налогов/i,
    title: "ПОДЗЕМНЫЙ ГАРАЖ НКВД НА ПУШКИНСКОЙ",
    placeName: "Пушкинская / Дарвина",
    yearStart: 1930,
    yearEnd: 1950,
  },
  {
    test: /афанасия африканского|мощи.*благовещен/i,
    title: "МОЩИ АФАНАСИЯ И БЛАГОВЕЩЕНСКИЙ СОБОР",
    placeName: "Благовещенский собор",
  },
  {
    test: /5 немецких грузовых|коллектор.*пятихат|золотом выезжали/i,
    title: "НЕМЕЦКОЕ ЗОЛОТО В КОЛЛЕКТОРАХ У ПЯТИХАТОК",
    placeName: "Пятихатки / лесопарк",
    yearStart: 1943,
  },
  {
    test: /судмедэксперт|дмитриевск/i,
    title: "УБЕЖИЩЕ В СУДМЕДЭКСПЕРТИЗЕ",
    placeName: "Дмитриевская",
    yearStart: 1941,
    yearEnd: 1943,
  },
  {
    test: /почистить дно|дно реки|свердлова до благбаз/i,
    title: "НЕМЦЫ И ДНО ЛОПАНИ",
    placeName: "Лопань / Благбаз",
    yearStart: 1941,
    yearEnd: 1943,
  },
  {
    test: /успенск.*выше|исаакиевск|колокольн.*выше/i,
    title: "УСПЕНСКИЙ СОБОР ВЫШЕ ИСААКИЯ",
    placeName: "Успенский собор",
    yearStart: 1821,
    yearEnd: 1844,
  },
  {
    test: /9 этажей|секретной лаборатории|под главным зданием универа/i,
    title: "ДЕВЯТЬ ЭТАЖЕЙ ПОД УНИВЕРСИТЕТОМ",
    placeName: "Университет",
  },
  {
    test: /каркх коп|большой снег/i,
    title: "КАРКХ КОП — БОЛЬШОЙ СНЕГ",
    placeName: "Харьков",
  },
  {
    test: /сталкер|свалку возле хтз/i,
    title: "СТАЛКЕР НА СВАЛКЕ ХТЗ",
    placeName: "ХТЗ",
    yearStart: 1979,
    yearEnd: 1985,
  },
  {
    test: /павлово поле.*купца павла/i,
    title: "ОТКУДА ПАВЛОВО ПОЛЕ",
    placeName: "Павлово Поле",
    yearStart: 1700,
    yearEnd: 1800,
  },
];

function cleanBody(body) {
  return body
    .replace(/^[А-ЯA-Zа-яa-z0-9_ .-]{2,40}\s+сказа[вл]\(ла\):\s*/gim, "")
    .replace(/^[А-ЯA-Zа-яa-z0-9_ .-]{2,40}\s+сказал\(а\):\s*/gim, "")
    .replace(/^Click to expand\.\.\.\s*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function guessTitle(body) {
  for (const k of knownTitles) {
    if (k.test.test(body)) return k;
  }
  const first = body.split(/\n+/)[0].replace(/^["«]+|["»]+$/g, "").trim();
  if (first.length >= 16 && first.length <= 90 && !/сказа[вл]/i.test(first)) {
    return { title: first.toUpperCase() };
  }
  const clip = body.replace(/\s+/g, " ").slice(0, 68).replace(/\s+\S*$/, "");
  return { title: (clip || "ЛЕГЕНДА С ФОРУМА").toUpperCase() };
}

function eraFor(yearStart) {
  if (!yearStart) return "городские предания";
  if (yearStart < 1700) return "XVII век и ранее";
  if (yearStart < 1800) return "XVIII век";
  if (yearStart < 1900) return "XIX век";
  if (yearStart < 1918) return "начало XX века";
  if (yearStart < 1941) return "межвоенный период";
  if (yearStart < 1946) return "война";
  if (yearStart < 1992) return "советское время";
  return "независимость";
}

const list = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));
const polished = [];
const seen = new Set();

for (const c of list) {
  const body = cleanBody(c.body || "");
  if (body.length < 200) continue;
  if (/сказа[вл]\(ла\):/i.test(body.slice(0, 80)) && body.length < 260) continue;

  const known = guessTitle(body);
  const title = known.title;
  const key = `${title}::${body.slice(0, 120)}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const yearStart = known.yearStart ?? c.yearStart;
  const yearEnd = known.yearEnd ?? c.yearEnd;
  const placeName = known.placeName || c.placeName || "Харьков";
  const summary =
    body.replace(/\s+/g, " ").slice(0, 180).replace(/\s+\S*$/, "") + "…";

  polished.push({
    ...c,
    keep: null,
    title,
    summary,
    body,
    type: "от местных",
    yearStart,
    yearEnd,
    era: eraFor(yearStart),
    district: placeName,
    placeName,
    section: "От местных · kharkovforum",
    tags: ["от-местных", "форум", "легенда"],
    source: "пользователь",
    status: "pending",
  });
}

fs.writeFileSync(candidatesPath, JSON.stringify(polished, null, 2), "utf8");

const md = [
  "# Черновики легенд «от местных» (kharkovforum)",
  "",
  "Источник: https://www.kharkovforum.com/threads/lehendy-khar-kova.73438/",
  `Кандидатов после очистки: **${polished.length}**`,
  "",
  "Как отобрать: в `candidates.json` поставьте `\"keep\": true` у нужных историй (остальные можно `false`).",
  "Когда скажете — добавим выбранные на сайт с типом **от местных**.",
  "",
  "---",
  "",
];

for (const c of polished) {
  const date =
    c.yearStart == null
      ? "не указана"
      : c.yearEnd && c.yearEnd !== c.yearStart
        ? `${c.yearStart}–${c.yearEnd}`
        : String(c.yearStart);
  md.push(`## ${c.title}`);
  md.push("");
  md.push(`- **id:** \`${c.id}\``);
  md.push(`- **место:** ${c.placeName}`);
  md.push(`- **дата (примерно):** ${date} · ${c.era}`);
  md.push(
    `- **автор форума:** ${c.forum?.author || "?"} · [пост](${c.forum?.url || "#"})`,
  );
  md.push(`- **keep:** null`);
  md.push("");
  md.push(c.body);
  md.push("");
  md.push("---");
  md.push("");
}

fs.writeFileSync(previewPath, md.join("\n"), "utf8");
console.log(`polished ${polished.length} → ${candidatesPath}`);
