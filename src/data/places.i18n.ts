import type { Locale } from "@/i18n/config";

export type PlaceLocale = {
  name: string;
  district?: string;
  summary: string;
  body: string;
  imageCaption: string;
};

const uk: Record<string, PlaceLocale> = {
  "universitetskaya-gorka": {
    name: "Університетська гірка",
    district: "Центр / Нагірний",
    summary:
      "Історичне ядро міста: університет, собори, спуск до Лопані — сцена багатьох байок.",
    body: `Університетська гірка — підвищення над Лопанню, де склався старий Харків: університет Каразіна, Успенський собор, сади й спуски. Звідси починаються топонімічні байки, історії губернаторів і студентські анекдоти.`,
    imageCaption: "Університетська гірка (фото Wikimedia Commons)",
  },
  "uspenskiy-sobor": {
    name: "Успенський собор",
    district: "Центр",
    summary:
      "Символ старого Харкова на Університетській гірці; Александрівська дзвіниця — міська візитівка.",
    body: `Успенський собор і висока Александрівська дзвіниця — орієнтир духовного й архітектурного Харкова. У байках Ципіна храм виникає як тло подій і міської пам’яті.`,
    imageCaption: "Успенський собор, Харків (Wikimedia Commons)",
  },
  "blagoveshchenskiy-sobor": {
    name: "Благовіщенський собор",
    district: "Центр",
    summary: "Великий храм біля Лопані; місце в топоніміці й міських оповідях.",
    body: `Благовіщенський кафедральний собор — упізнаваний силует біля річки з характерною смугастою кладкою. В оповідях про Харків він сусідить із мостами, ринками й «низом» міста.`,
    imageCaption: "Благовіщенський собор (Wikimedia Commons)",
  },
  gosprom: {
    name: "Держпром (Госпром)",
    district: "Центр",
    summary:
      "Конструктивістський гігант площі Свободи; символ столичного Харкова 1920–30-х.",
    body: `Держпром — візитна картка радянського Харкова. У книзі — байки про столицю України, владу й архітектуру епохи.`,
    imageCaption: "Держпром (Wikimedia Commons)",
  },
  "ploshchad-svobody": {
    name: "Площа Свободи",
    district: "Центр",
    summary: "Одна з найбільших площ Європи; сцена парадів, мітингів і легенд.",
    body: `Площа Свободи (раніше Дзержинського) — простір влади й видовищ. Поруч Держпром, університетські корпуси, радянська й пострадянська хроніка Харкова.`,
    imageCaption: "Площа Свободи / Держпром (Wikimedia Commons)",
  },
  sumskaya: {
    name: "Вулиця Сумська",
    district: "Центр",
    summary: "Головна артерія міста: театри, вітрини, прогулянки й анекдоти «на Сумській».",
    body: `Сумська — парадна вулиця Харкова. Тут селяться сюжети про театр, гуляння, ліхтарі, купців і радянський побут.`,
    imageCaption: "Вулиця Сумська (Wikimedia Commons)",
  },
  lesopark: {
    name: "Лісопарк",
    district: "Лісопарк / Олексіївка",
    summary: "Зелений масив на півночі міста — прогулянки, дачні й мисливські байки.",
    body: `Харківський лісопарк — простір відпочинку. У гумористичних сюжетах Ципіна «ліс і дичина» звучать поруч із міським низом біля Лопані.`,
    imageCaption: "Зелені куточки Харкова (Wikimedia Commons)",
  },
  "memorial-slavy": {
    name: "Меморіал Слави",
    district: "Лісопарк",
    summary: "Меморіальний комплекс військової пам’яті XX століття.",
    body: `Меморіал Слави в лісопарковій зоні — місце, де Харків пам’ятає війну. У контексті книги Ципіна військові розділи сусідять із топографією пам’яті.`,
    imageCaption: "Меморіал Слави (Wikimedia Commons)",
  },
  "zzerkalnaya-struya": {
    name: "Дзеркальний струмінь",
    district: "Центр",
    summary: "Фонтан і альтанка біля саду Шевченка — символ повоєнного Харкова.",
    body: `«Дзеркальний струмінь» — улюблене місце побачень і листівок. У міському фольклорі фонтан — знак миру після руйнувань.`,
    imageCaption: "Дзеркальний струмінь (Wikimedia Commons)",
  },
  "sad-shevchenko": {
    name: "Сад імені Шевченка",
    district: "Центр",
    summary: "Міський сад — прогулянки, театр, студентське життя.",
    body: `Сад Шевченка — зелене серце центру. Тут перетинаються байки про студентів, акторів і «гуляння».`,
    imageCaption: "Сад Шевченка (Wikimedia Commons)",
  },
  "kholodnaya-gora": {
    name: "Холодна Гора",
    district: "Холодногірський",
    summary: "Район і топонім; у книзі — сюжети з Холодної Гори.",
    body: `Холодна Гора — і місцевість, і характер. У пізньорадянських байках район звучить гостро й упізнавано для харків’ян.`,
    imageCaption: "Холодна Гора (Wikimedia Commons)",
  },
  vokzal: {
    name: "Південний вокзал",
    district: "Центр / Вокзальна",
    summary: "Брама міста: приїзди знаменитостей, біженці, анекдоти «на вокзалі».",
    body: `Харківський вокзал — сцена зустрічей і розлук. У хроніках і байках через нього проходять губернатори, артисти, війна й мирна метушня.`,
    imageCaption: "Південний вокзал (Wikimedia Commons)",
  },
  "konnyy-rynok": {
    name: "Кінний ринок / Благбаз",
    district: "Центр",
    summary: "Старий ринок біля річки — мова «рачки», торг і міський низ.",
    body: `Кінний ринок і Благовіщенський базар (Благбаз) — простір живого Харкова: крики торговців, «рачка», міст через Лопань.`,
    imageCaption: "Річка й собори біля старого ринку (Wikimedia Commons)",
  },
  lopan: {
    name: "Річка Лопань",
    district: "Центр",
    summary: "Одна з річок Харкова; разом із Харковом і зниклою Нетечею — топонімічна трійця.",
    body: `Лопань — вісь старого міста. Приказка «Хоч лопни, Харків не тече» тримає в собі Харків, Лопань і Нетечу.`,
    imageCaption: "Річка Лопань (Wikimedia Commons)",
  },
  rogan: {
    name: "Рогань",
    district: "Околиці",
    summary: "Містечко й пиво — у книзі сюжет «Рогань — не лише пиво».",
    body: `Рогань у харківському фольклорі — і географія, і бренд. Ципін нагадує: назва старша за етикетку.`,
    imageCaption: "Околиці Харкова / Рогань (ілюстрація)",
  },
};

const en: Record<string, PlaceLocale> = {
  "universitetskaya-gorka": {
    name: "University Hill",
    district: "Centre / Nagorny",
    summary:
      "Historic core of the city: university, cathedrals, the descent to the Lopan — stage of many tales.",
    body: `University Hill rises above the Lopan, where old Kharkiv took shape: Karazin University, the Dormition Cathedral, gardens and slopes. Toponymic tales and student jokes begin here.`,
    imageCaption: "University Hill (Wikimedia Commons)",
  },
  "uspenskiy-sobor": {
    name: "Dormition Cathedral",
    district: "Centre",
    summary:
      "Symbol of old Kharkiv on University Hill; the Alexandrovskaya bell tower is a city landmark.",
    body: `The Dormition Cathedral and its tall Alexandrovskaya bell tower are a spiritual and architectural landmark of Kharkiv. In Tsypin’s tales the church appears as a backdrop of memory.`,
    imageCaption: "Dormition Cathedral, Kharkiv (Wikimedia Commons)",
  },
  "blagoveshchenskiy-sobor": {
    name: "Annunciation Cathedral",
    district: "Centre",
    summary: "Large church by the Lopan; a fixture of place-names and city stories.",
    body: `The Annunciation Cathedral’s striped silhouette by the river sits among bridges, markets and the city’s “lower” streets in Kharkiv lore.`,
    imageCaption: "Annunciation Cathedral (Wikimedia Commons)",
  },
  gosprom: {
    name: "Derzhprom (Gosprom)",
    district: "Centre",
    summary:
      "Constructivist giant on Freedom Square; symbol of 1920s–30s capital Kharkiv.",
    body: `Derzhprom is the calling card of Soviet Kharkiv. The book gathers tales of power, architecture and the capital years.`,
    imageCaption: "Derzhprom (Wikimedia Commons)",
  },
  "ploshchad-svobody": {
    name: "Freedom Square",
    district: "Centre",
    summary: "One of Europe’s largest squares; scene of parades, rallies and legends.",
    body: `Freedom Square (formerly Dzerzhinsky) is a space of power and spectacle, next to Derzhprom and university buildings.`,
    imageCaption: "Freedom Square / Derzhprom (Wikimedia Commons)",
  },
  sumskaya: {
    name: "Sumska Street",
    district: "Centre",
    summary: "Main avenue: theatres, shopfronts, strolls and jokes “on Sumska”.",
    body: `Sumska is Kharkiv’s parade street — theatre, evening walks, merchants and Soviet everyday life.`,
    imageCaption: "Sumska Street (Wikimedia Commons)",
  },
  lesopark: {
    name: "Forest Park",
    district: "Forest Park / Oleksiivka",
    summary: "Green belt in the north — walks, dachas and hunting tales.",
    body: `Kharkiv’s forest park is a place of rest; in Tsypin’s humour, woods and game sit next to the riverside “lower city”.`,
    imageCaption: "Kharkiv greenery (Wikimedia Commons)",
  },
  "memorial-slavy": {
    name: "Memorial of Glory",
    district: "Forest Park",
    summary: "War memorial complex of 20th-century memory.",
    body: `The Memorial of Glory in the forest-park zone is where Kharkiv remembers the war.`,
    imageCaption: "Memorial of Glory (Wikimedia Commons)",
  },
  "zzerkalnaya-struya": {
    name: "Mirror Stream",
    district: "Centre",
    summary: "Pavilion fountain by Shevchenko Garden — postwar Kharkiv emblem.",
    body: `“Mirror Stream” is a favourite meeting place and postcard view — a sign of peace after ruin in city folklore.`,
    imageCaption: "Mirror Stream (Wikimedia Commons)",
  },
  "sad-shevchenko": {
    name: "Shevchenko Garden",
    district: "Centre",
    summary: "City garden — walks, theatre, student life.",
    body: `Shevchenko Garden is the green heart of the centre, where student and theatre tales cross.`,
    imageCaption: "Shevchenko Garden (Wikimedia Commons)",
  },
  "kholodnaya-gora": {
    name: "Kholodna Hora",
    district: "Kholodnohirskyi",
    summary: "District and place-name; stories from Cold Mountain in the book.",
    body: `Kholodna Hora is both a place and a temper — sharp and familiar in late-Soviet Kharkiv jokes.`,
    imageCaption: "Kholodna Hora (Wikimedia Commons)",
  },
  vokzal: {
    name: "Southern Railway Station",
    district: "Centre / Station area",
    summary: "City gateway: arrivals, refugees, jokes “at the station”.",
    body: `Kharkiv station is a stage of meetings and partings — governors, artists, war and peacetime bustle.`,
    imageCaption: "Kharkiv passenger station (Wikimedia Commons)",
  },
  "konnyy-rynok": {
    name: "Horse Market / Blahbaz",
    district: "Centre",
    summary: "Old riverside market — “rachka” speech, trade and the lower city.",
    body: `The Horse Market and Annunciation bazaar are living Kharkiv: traders’ cries, local slang, the Lopan bridge.`,
    imageCaption: "River and cathedrals near the old market (Wikimedia Commons)",
  },
  lopan: {
    name: "Lopan River",
    district: "Centre",
    summary:
      "One of Kharkiv’s rivers; with the Kharkiv and vanished Netecha — a toponymic trio.",
    body: `The Lopan is the axis of the old town. The saying about Kharkiv, Lopan and Netecha holds the city’s river lore.`,
    imageCaption: "Lopan River (Wikimedia Commons)",
  },
  rogan: {
    name: "Rohan",
    district: "Outskirts",
    summary: "Place and beer — the book’s tale “Rohan is not only beer”.",
    body: `In Kharkiv folklore Rohan is both geography and a brand; Tsypin reminds that the name is older than the label.`,
    imageCaption: "Kharkiv outskirts / Rohan",
  },
};

export function localizePlace(
  slug: string,
  locale: Locale,
  fallback: PlaceLocale,
): PlaceLocale {
  if (locale === "uk") return uk[slug] ?? fallback;
  if (locale === "en") return en[slug] ?? fallback;
  return fallback;
}
