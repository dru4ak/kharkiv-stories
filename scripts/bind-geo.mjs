/**
 * Привязка координат только к историям, где в тексте есть реальное место.
 * Случайные lat/lng из парсера снимаются.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storiesPath = path.join(root, "src/data/stories.json");

/** Места с координатами и ключевыми словами (дублируем каталог + доп. районы). */
const places = [
  {
    name: "Университетская горка",
    district: "Центр",
    lat: 49.9935,
    lng: 36.2304,
    keywords: [
      "Университетская горк",
      "Университетской горк",
      "Университетском сад",
      "университетском сад",
      "подножия Университет",
      "склон Университет",
      "Харьковск.*универс",
    ],
  },
  {
    name: "Успенский собор",
    district: "Центр",
    lat: 49.9908,
    lng: 36.2309,
    keywords: ["Успенск"],
  },
  {
    name: "Благовещенский собор",
    district: "Центр",
    lat: 49.9889,
    lng: 36.2235,
    keywords: ["Благовещенск"],
  },
  {
    name: "Госпром",
    district: "Центр",
    lat: 50.0047,
    lng: 36.2303,
    keywords: ["Госпром", "госпром", "Держпром", "держпром"],
  },
  {
    name: "Площадь Свободы",
    district: "Центр",
    lat: 50.0044,
    lng: 36.2312,
    keywords: [
      "пл\\.\\s*Свободы",
      "площад[иью]\\s*Свободы",
      "пл\\.\\s*Дзержинск",
      "площад[иь]\\s*Дзержинск",
      "Дзержинского",
    ],
  },
  {
    name: "Улица Сумская",
    district: "Центр",
    lat: 50.0012,
    lng: 36.2335,
    keywords: ["ул\\.\\s*Сумск", "улиц[еыа]\\s*Сумск", "Сумской", "Сумская"],
  },
  {
    name: "Лесопарк",
    district: "Лесопарк",
    lat: 50.05,
    lng: 36.25,
    keywords: ["лесопарк", "Лесопарк", "парк Горького"],
  },
  {
    name: "Мемориал Славы",
    district: "Лесопарк",
    lat: 50.043,
    lng: 36.258,
    keywords: ["Мемориал Слав", "мемориал Слав"],
  },
  {
    name: "Зеркальная струя",
    district: "Центр",
    lat: 50.0049,
    lng: 36.2358,
    keywords: ["Зеркальная струя", "Зеркальной стру"],
  },
  {
    name: "Сад Шевченко",
    district: "Центр",
    lat: 50.0018,
    lng: 36.2345,
    keywords: ["сад Шевченко", "саду Шевченко", "Университетском сад"],
  },
  {
    name: "Холодная Гора",
    district: "Холодная Гора",
    lat: 49.986,
    lng: 36.195,
    keywords: ["Холодн\\w*\\s*Гор", "ХОЛОДНОЙ"],
  },
  {
    name: "Южный вокзал",
    district: "Центр",
    lat: 49.9897,
    lng: 36.2108,
    keywords: ["на вокзал", "с вокзал", "вокзале", "Вокзал", "Южный вокзал"],
  },
  {
    name: "Конный рынок",
    district: "Центр",
    lat: 49.9875,
    lng: 36.221,
    keywords: ["Конный рынок", "Благбаз", "Благобаз", "Благовещенск\\w* базар"],
  },
  {
    name: "Река Лопань",
    district: "Центр",
    lat: 49.989,
    lng: 36.225,
    keywords: ["Лопань", "лопань", "Нетеч", "НЕТЕЧЬ"],
  },
  {
    name: "Рогань",
    district: "Окрестности",
    lat: 49.9,
    lng: 36.4,
    keywords: ["Рогань", "РОГАНЬ"],
  },
  {
    name: "Салтовка",
    district: "Салтовка",
    lat: 50.0,
    lng: 36.3,
    keywords: ["Салтовк", "салтовк"],
  },
  {
    name: "Павлово Поле",
    district: "Павлово Поле",
    lat: 50.02,
    lng: 36.21,
    keywords: ["Павлов\\w*\\s*Пол", "павлов\\w*\\s*пол"],
  },
  {
    name: "Алексеевка",
    district: "Алексеевка",
    lat: 50.04,
    lng: 36.2,
    keywords: ["Алексеевк", "Олексіївк"],
  },
  {
    name: "Основа",
    district: "Основа",
    lat: 49.96,
    lng: 36.26,
    keywords: ["\\bОснов[еуыа]\\b", "на Основе", "в Основе"],
  },
  {
    name: "Река Харьков",
    district: "Центр",
    lat: 49.992,
    lng: 36.245,
    keywords: ["реке Харьков", "реки Харьков", "р\\.\\s*Харьков"],
  },
  {
    name: "Улица Пушкинская",
    district: "Центр",
    lat: 50.0,
    lng: 36.236,
    keywords: ["Пушкинск"],
  },
  {
    name: "Улица Рымарская",
    district: "Центр",
    lat: 49.9955,
    lng: 36.2315,
    keywords: ["Рымарск"],
  },
  {
    name: "Театр Шевченко",
    district: "Центр",
    lat: 49.9965,
    lng: 36.2325,
    keywords: ["театр.*Шевченко", "Шевченковск\\w* театр"],
  },
  {
    name: "УФТИ / Пятёрочка",
    district: "Пятихатки",
    lat: 50.09,
    lng: 36.25,
    keywords: ["УФТИ", "Физтех", "Пятихатк"],
  },
  {
    name: "Барабашово",
    district: "Салтовка",
    lat: 50.01,
    lng: 36.28,
    keywords: ["Барабашов", "барахолк"],
  },
  {
    name: "Горсад / сквер",
    district: "Центр",
    lat: 49.998,
    lng: 36.232,
    keywords: ["Горсад", "городск\\w* сад"],
  },
  {
    name: "Мост через Лопань",
    district: "Центр",
    lat: 49.9885,
    lng: 36.224,
    keywords: ["мост.*Лопань", "через Лопань"],
  },
];

function hashOffset(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const a = ((h % 1000) / 1000 - 0.5) * 0.004;
  const b = ((((h / 1000) | 0) % 1000) / 1000 - 0.5) * 0.004;
  return { dLat: a, dLng: b };
}

function matches(hay, keywords) {
  return keywords.some((kw) => {
    try {
      return new RegExp(kw, "i").test(hay);
    } catch {
      return hay.toLowerCase().includes(kw.toLowerCase());
    }
  });
}

const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
let bound = 0;
let cleared = 0;

for (const story of stories) {
  const hay = [story.title, story.summary, story.body, story.section]
    .filter(Boolean)
    .join("\n");

  // слишком общие слова вроде «рынок» без уточнения — только через точные ключи выше
  let hit = null;
  for (const place of places) {
    if (matches(hay, place.keywords)) {
      hit = place;
      break;
    }
  }

  if (hit) {
    const { dLat, dLng } = hashOffset(story.id || story.slug);
    story.lat = +(hit.lat + dLat).toFixed(6);
    story.lng = +(hit.lng + dLng).toFixed(6);
    story.placeName = hit.name;
    story.district = hit.district;
    story.geoBound = true;
    bound++;
  } else {
    delete story.lat;
    delete story.lng;
    delete story.geoBound;
    delete story.placeName;
    cleared++;
  }
}

fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2), "utf8");
console.log(`bound=${bound} cleared_coords=${cleared} total=${stories.length}`);
