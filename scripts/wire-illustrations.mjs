import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assets =
  "C:/Users/vorte/.cursor/projects/c-Users-vorte-OneDrive-kharkiv-stories/assets";
const storiesPath = "src/data/stories.json";
const outDir = "public/illustrations";

const captions = {
  "otkuda-harkov": "Основание Харькова — иллюстрация",
  "na-ulitsu-vyshel-a-ulitsy-net": "Улица, которой нет — иллюстрация",
  "kuda-delas-netech": "Исчезнувшая река Нетечь — иллюстрация",
  "kak-shvedy-pod-harkovom": "Шведы под Харьковом — иллюстрация",
  "gde-obitali-gubernatory": "Губернаторский дом — иллюстрация",
  "let-za-dvesti-na-odnom-meste": "Дом у Лопани — иллюстрация",
  "na-perekladnyh": "Перекладные — иллюстрация",
  "krasnyy-petuh": "Красный петух — иллюстрация",
  "pochem-poklony": "Поклоны на Успенской ярмарке — иллюстрация",
  "propavshiy-talant": "Юный художник Хамло-Сокира — иллюстрация",
  "zapozdalaya-pamyat": "Похороны Квитки-Основьяненко — иллюстрация",
  "pan-ta-sobaka": "Гулак-Артемовский, автор басен — иллюстрация",
  "ryatuyte": "Животовский и крик «Рятуйте!» — иллюстрация",
  "mostovoy-nalog": "Мощение улиц и «мостовой» сбор — иллюстрация",
  "revnitel-blagonraviya": "Ревнитель благонравия — иллюстрация",
  "na-tot-svet": "Кокошкин на стройке в Петербурге — иллюстрация",
  "otkuda-puh": "Тополиный пух весной — иллюстрация",
  "sredi-bolot": "Харьков среди болот — иллюстрация",
  "harchi-na-dorogu": "Млотковский и театр — иллюстрация",
  "golaya-venera": "Цирковой балаган на площади — иллюстрация",
  "gorodskoy-golova-himik": "Купец Костюрин в винной лаборатории — иллюстрация",
  "ah-ty-moy-krasavets": "Целебный родник в ложбине — иллюстрация",
  "vot-takie-sapogi": "Сапожник Пузанков на Сумской — иллюстрация",
  "adyutant-ego-prevoshoditelstva": "Вступление Добровольческой армии в Харьков — иллюстрация",
  "repressirovan-posmertno": "Исчезнувший памятник на площади — иллюстрация",
  "balzam-dlya-lenina": "Харьковская анатомическая школа — иллюстрация",
  "grazhdanin-neba": "Обсерватория в Университетском саду — иллюстрация",
  "pod-chuzhim-imenem": "Жизнь под чужим именем — иллюстрация",
  "harkov-menya-podkoval-i-vospital": "Харьков гражданской войны — иллюстрация",
  "vozvraschenie": "Театральное возвращение из эмиграции — иллюстрация",
  "stihotvorenie-natoschak": "Стихи, рождённые утром в постели — иллюстрация",
  "odin-stanok-eto-prosto-stanok": "Зимний Харьков и заводской станок — иллюстрация",
  "svoim-skidka": "Скидка «своим» в нэповском городе — иллюстрация",
  "bez-tormozov": "Трамвай без тормозов на Пушкинской — иллюстрация",
  "allo-govorit-hark1v": "Раннее радиовещание в Харькове — иллюстрация",
  "uchitel-gershvina": "Музыкальная консерватория — иллюстрация",
  "teper-ya-vam": "Командировка корреспондента в Харьков — иллюстрация",
  "doloy-styd": "Литературный просвет начала 1920-х — иллюстрация",
  "gde-zakalyalas-stal": "Медицинский институт, 1926 год — иллюстрация",
  "ne-pischat": "Срочная телеграмма в Наркомпрос — иллюстрация",
  "parnas-dybom": "Книга издательства «Космос» — иллюстрация",
  "burlila-zhizn": "Уютный особняк с синей гостиной — иллюстрация",
  "potseluy-v-ruku": "Литературный вечер в пединституте — иллюстрация",
  "kto-znaet": "Литературные гости столицы — иллюстрация",
  "chelovek-afisha": "Концертный зал и зрители — иллюстрация",
  "bylo-gde-posmeyatsya": "Вечерние развлечения Харькова — иллюстрация",
  "pesnya-spektakl": "Старый дом на Владимирской — иллюстрация",
  "na-kostyah": "Трамвайная остановка у гастронома — иллюстрация",
  "rasscheplenie-yadra": "Оцеплённый квартал у научного объекта — иллюстрация",
  "vycherknutyy-iz-spiska": "Спортивные мастера 1930-х — иллюстрация",
  "poslednee-slovo-vozhdya": "Новостройки и рабочие посёлки — иллюстрация",
  "get-vsch-moskvi": "Квартира писателей в доме «Слово» — иллюстрация",
  "samoubiystvo-v-gosprome": "Городской административный ансамбль — иллюстрация",
  "ne-nazyvaya-familiy": "Ночной стук в дверь — иллюстрация",
  "sledovat-na-sever-mozhet": "Приём у городского врача — иллюстрация",
  "nochnoy-probeg": "Танки у ворот паровозостроительного — иллюстрация",
  "nevidimaya-tsel": "Испытательный полёт над полем — иллюстрация",
  "operatsiya-zapadnya": "Оккупированный штабной город — иллюстрация",
  "tsennost-dlya-reyha": "Секретные архивные документы — иллюстрация",
  "na-svoem-pole": "Озеро и бинокль у берега — иллюстрация",
  "ya-videl-harkov": "Разрушенный город после освобождения — иллюстрация",
  "arhitekturnaya-kakofoniya": "Разнородная застройка у вокзала — иллюстрация",
  "fontan": "Беседка и фонтан «Зеркальная струя» — иллюстрация",
  "ulitsa-gada": "Рыбный торг у слияния рек — иллюстрация",
  "myaso-bez-kostey": "Продуктовый магазин на углу — иллюстрация",
  "vashu-mat": "Коридоры физико-технического института — иллюстрация",
  "na-meste-hrama": "Площадь «Поэзия» и прежняя застройка — иллюстрация",
  "golubaya-loshad": "Необычное зрелище на Сумской — иллюстрация",
  "kavaler-frantsii": "Квартира лектора осенью 1957 — иллюстрация",
  "mesto-gibeli-baykonur": "Обелиски на старом кладбище — иллюстрация",
  "termos-s-balkona": "Дорога и остановка в Харькове — иллюстрация",
  "kafe-mogila": "Студенты с лопатами на стройке — иллюстрация",
  "krotost-i-mosch": "Митинг у памятника поэту — иллюстрация",
  "zhivoy-trup": "Ипподром и пари на скачках — иллюстрация",
  "blohu-podkoval": "Ювелир за микроскопом — иллюстрация",
  "cherez-dorogu": "Сумская улица глубокой осенью — иллюстрация",
  "pyatero-iz-lombarda": "Центральная площадь и памятник — иллюстрация",
  "rodite-mne-beluyu-obezyanku": "Научная лаборатория и открытие — иллюстрация",
};

const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
const bySlug = Object.fromEntries(stories.map((s) => [s.slug, s]));

const files = fs.readdirSync(assets).filter((f) => /\.(jpe?g|png)$/i.test(f));
let wired = 0;

for (const file of files) {
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const story = bySlug[base];
  if (!story) continue;

  const src = path.join(assets, file);
  if (!fs.existsSync(src)) continue;
  const destName = `${base}.jpg`;
  const dest = path.join(outDir, destName);
  await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(dest);

  story.illustrationUrl = `/illustrations/${destName}`;
  story.illustrationCaption =
    captions[base] || `${story.title.slice(0, 40)} — иллюстрация`;
  wired++;
  console.log("wired", base);
}

fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2) + "\n");
console.log("wired total", wired);
