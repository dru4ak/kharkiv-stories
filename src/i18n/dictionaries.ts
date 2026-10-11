import type { Locale } from "./config";
import type { StoryType } from "@/data/stories";

export type Dictionary = {
  brand: string;
  brandSub: string;
  nav: {
    stories: string;
    people: string;
    places: string;
    map: string;
    timeline: string;
    rumors: string;
    submit: string;
    about: string;
  };
  rumors: {
    title: string;
    lead: string;
    hint: string;
    epigraph: string;
    search: string;
    all: string;
    place: string;
    theme: string;
    sort: string;
    sortRating: string;
    sortLikes: string;
    sortTitle: string;
    sortPlace: string;
    sortYear: string;
    empty: string;
    like: string;
    dislike: string;
    score: string;
    count: string;
    expand: string;
    collapse: string;
    formTitle: string;
    formLead: string;
    fieldTitle: string;
    fieldTitlePh: string;
    fieldPlace: string;
    fieldPlacePh: string;
    fieldYear: string;
    fieldYearPh: string;
    fieldTheme: string;
    fieldThemeOther: string;
    fieldBody: string;
    fieldBodyPh: string;
    fieldName: string;
    fieldNamePh: string;
    send: string;
    thanksTitle: string;
    thanksText: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    catalog: string;
    people: string;
    places: string;
    randomTitle: string;
    seeAll: string;
    storiesOnSite: string;
    rumorsOnSite: string;
    factEyebrow: string;
    factPrompt: string;
    factMore: string;
    factNext: string;
  };
  storyTypes: Record<StoryType, string>;
  catalog: {
    title: string;
    lead: string;
    search: string;
    all: string;
    type: string;
    district: string;
    era: string;
    person: string;
    empty: string;
    read: string;
  };
  map: {
    title: string;
    lead: string;
    note: string;
    apiTitle: string;
  };
  people: {
    title: string;
    lead: string;
  };
  places: {
    title: string;
    lead: string;
  };
  timeline: {
    title: string;
    lead: string;
  };
  submit: {
    title: string;
    lead: string;
  };
  about: {
    title: string;
    heading: string;
    p1: string;
    p2: string;
    p3prefix: string;
    cta: string;
  };
  story: {
    back: string;
    relatedPeople: string;
    relatedPlaces: string;
    originalNote: string;
  };
  footer: {
    memory: string;
    text: string;
  };
};

const kh: Dictionary = {
  brand: "Легенды Харькова",
  brandSub: "байки · слухи · предания",
  nav: {
    stories: "Байки",
    people: "Личности",
    places: "Места",
    map: "Карта",
    timeline: "Хроника",
    rumors: "Слухи",
    submit: "Добавить",
    about: "О проекте",
  },
  rumors: {
    title: "Слухи от харьковчан",
    lead: "Живые городские легенды — без картинок и без претензии на истину. То, что шепчут во дворах и передают из уст в уста: ходят слухи, местные говорили, кто-то когда-то слышал…",
    hint: "Лайками поднимайте рассказ выше, дизлайками — опускайте. Сортировка по умолчанию — по рейтингу. Фильтры: тема и место.",
    epigraph:
      "Так это помнят в городе — кто как слышал, кто как пересказал. Проверить уже трудно, а слух живёт своей жизнью.",
    search: "Поиск по слухам…",
    all: "Все",
    place: "Место",
    theme: "Тема",
    sort: "Сортировка",
    sortRating: "По рейтингу",
    sortLikes: "По лайкам",
    sortTitle: "По алфавиту",
    sortPlace: "По месту",
    sortYear: "По году",
    empty: "Ничего не нашлось.",
    like: "Нравится",
    dislike: "Не нравится",
    score: "Рейтинг",
    count: "Показано {n}",
    expand: "Читать полностью →",
    collapse: "Свернуть",
    formTitle: "Прислать свой слух",
    formLead:
      "Услышали байку во дворе, на работе или от бабушки? Напишите своими словами — после модерации появится в ленте слухов.",
    fieldTitle: "Заголовок",
    fieldTitlePh: "Как коротко назвать этот слух?",
    fieldPlace: "Место / район",
    fieldPlacePh: "Например, Журавлевка, Сумская…",
    fieldYear: "Год (примерно)",
    fieldYearPh: "1975",
    fieldTheme: "Тема",
    fieldThemeOther: "Другое / не уверен",
    fieldBody: "Текст слуха",
    fieldBodyPh: "Как слышали: «ходят слухи…», «местные говорили…»",
    fieldName: "Как вас подписать (необязательно)",
    fieldNamePh: "Имя или ник",
    send: "Отправить на модерацию",
    thanksTitle: "Спасибо",
    thanksText:
      "Слух принят в очередь на модерацию. Если подойдёт — появится в разделе «Слухи».",
  },
  home: {
    eyebrow: "Памяти Савелия Цыпина · для всех харьковчан",
    title: "Легенды Харькова",
    lead: "Городские байки, слухи и предания — из книги Цыпина и из уст харьковчан. То, что шепчут во дворах и помнят поколениями.",
    catalog: "Весь каталог",
    people: "Личности",
    places: "Места",
    randomTitle: "Случайные байки",
    seeAll: "Смотреть все {n} историй →",
    storiesOnSite: "историй, былин\nи топонимов",
    rumorsOnSite: "слухов, баек\nи легенд",
    factEyebrow: "Интересный факт",
    factPrompt: "А вы знали, что…",
    factMore: "Читать связанную историю →",
    factNext: "Ещё факт",
  },
  storyTypes: {
    байка: "Байки",
    легенда: "Легенды",
    анекдот: "Анекдоты",
    слух: "Слухи",
    топоним: "Топонимы",
    "от местных": "От местных",
  },
  catalog: {
    title: "Каталог историй",
    lead: "Все тексты книги Цыпина — с фильтрами по типу, району, эпохе и людям.",
    search: "Поиск…",
    all: "Все",
    type: "Тип",
    district: "Район",
    era: "Эпоха",
    person: "Человек",
    empty: "Ничего не нашлось.",
    read: "Читать →",
  },
  map: {
    title: "План и карта",
    lead: "Интерактивный план Харькова 1887 года — и ниже карта историй с привязкой к местности.",
    note: "Маркеры стоят у мест, названных в тексте. Без случайной «сыпанки» по карте.",
    apiTitle: "О слоях карты",
  },
  people: {
    title: "Личности",
    lead: "Харьковчане и те, кто учился или работал в городе — от Мечникова и Каразина до Ландау и Цыпина.",
  },
  places: {
    title: "Места",
    lead: "Улицы, храмы, площадь, вокзал, рынки и реки — декорации харьковских историй.",
  },
  timeline: {
    title: "Хроника",
    lead: "Истории по эпохам и годам — от основания города до позднесоветских анекдотов.",
  },
  submit: {
    title: "Добавить байку",
    lead: "Пришлите свою харьковскую историю — проверим и, если подойдёт, опубликуем.",
  },
  about: {
    title: "О проекте",
    heading: "Памяти Савелия Цыпина",
    p1: "Этот сайт создан в память об авторе книги «Харьков в байках и анекдотах» (Харьков: Folio, 2001) — Савелии Цыпине — и для всех харьковчан, кому дороги улицы, слухи и легенды города.",
    p2: "Материалы публикуются с разрешения, связанного с автором и издательством. Орфография и слог источника сохранены. Байки и легенды — фольклор и городской рассказ, а не академическая справка.",
    p3prefix: "Сейчас в каталоге",
    cta: "Прислать свою байку",
  },
  story: {
    back: "← К каталогу",
    relatedPeople: "Личности в этом рассказе",
    relatedPlaces: "Места в этом рассказе",
    originalNote: "Полный текст пока на языке оригинала.",
  },
  footer: {
    memory: "Память",
    text: "Этот сайт — для всех харьковчан. По мотивам книги «Харьков в байках и анекдотах» (Folio, 2001).",
  },
};

const uk: Dictionary = {
  brand: "Легенди Харкова",
  brandSub: "байки · чутки · перекази",
  nav: {
    stories: "Байки",
    people: "Особистості",
    places: "Місця",
    map: "Мапа",
    timeline: "Хроніка",
    rumors: "Чутки",
    submit: "Додати",
    about: "Про проєкт",
  },
  rumors: {
    title: "Чутки від харків’ян",
    lead: "Живі міські легенди — без картинок і без претензії на істину. Те, що шепочуть у дворах і передають з вуст в уста: ходять чутки, місцеві казали, хтось колись чув…",
    hint: "Лайками піднімайте оповідь вище, дизлайками — опускайте. За замовчуванням — сортування за рейтингом. Фільтри: тема і місце.",
    epigraph:
      "Так це пам'ятають у місті — хто як чув, хто як переказав. Перевірити вже важко, а чутка живе своїм життям.",
    search: "Пошук чуток…",
    all: "Усі",
    place: "Місце",
    theme: "Тема",
    sort: "Сортування",
    sortRating: "За рейтингом",
    sortLikes: "За лайками",
    sortTitle: "За абеткою",
    sortPlace: "За місцем",
    sortYear: "За роком",
    empty: "Нічого не знайшлося.",
    like: "Подобається",
    dislike: "Не подобається",
    score: "Рейтинг",
    count: "Показано {n}",
    expand: "Читати повністю →",
    collapse: "Згорнути",
    formTitle: "Надіслати свою чутку",
    formLead:
      "Чули байку в дворі, на роботі чи від бабусі? Напишіть своїми словами — після модерації з’явиться в стрічці чуток.",
    fieldTitle: "Заголовок",
    fieldTitlePh: "Як коротко назвати цю чутку?",
    fieldPlace: "Місце / район",
    fieldPlacePh: "Наприклад, Журавлівка, Сумська…",
    fieldYear: "Рік (приблизно)",
    fieldYearPh: "1975",
    fieldTheme: "Тема",
    fieldThemeOther: "Інше / не певен",
    fieldBody: "Текст чутки",
    fieldBodyPh: "Як чули: «ходять чутки…», «місцеві казали…»",
    fieldName: "Як вас підписати (необов’язково)",
    fieldNamePh: "Ім’я або нік",
    send: "Надіслати на модерацію",
    thanksTitle: "Дякуємо",
    thanksText:
      "Чутку прийнято в чергу на модерацію. Якщо підійде — з’явиться в розділі «Чутки».",
  },
  home: {
    eyebrow: "Пам’яті Савелія Ципіна · для всіх харків’ян",
    title: "Легенди Харкова",
    lead: "Міські байки, чутки й перекази — з книги Ципіна і з вуст харків’ян. Те, що шепочуть у дворах і пам’ятають поколіннями.",
    catalog: "Увесь каталог",
    people: "Особистості",
    places: "Місця",
    randomTitle: "Випадкові байки",
    seeAll: "Дивитися всі {n} історій →",
    storiesOnSite: "історій, билин\nі топонімів",
    rumorsOnSite: "чуток, байок\nі легенд",
    factEyebrow: "Цікавий факт",
    factPrompt: "А ви знали, що…",
    factMore: "Читати пов’язану історію →",
    factNext: "Ще факт",
  },
  storyTypes: {
    байка: "Байки",
    легенда: "Легенди",
    анекдот: "Анекдоти",
    слух: "Чутки",
    топоним: "Топоніми",
    "от местных": "Від місцевих",
  },
  catalog: {
    title: "Каталог історій",
    lead: "Усі тексти книги Ципіна — з фільтрами за типом, районом, добою та людьми.",
    search: "Пошук…",
    all: "Усі",
    type: "Тип",
    district: "Район",
    era: "Доба",
    person: "Людина",
    empty: "Нічого не знайшлося.",
    read: "Читати →",
  },
  map: {
    title: "План і мапа",
    lead: "Інтерактивний план Харкова 1887 року — і нижче мапа історій із прив’язкою до місцевості.",
    note: "Маркери біля місць, названих у тексті. Без випадкового розкидання.",
    apiTitle: "Про шари мапи",
  },
  people: {
    title: "Особистості",
    lead: "Харків’яни та ті, хто вчився чи працював у місті — від Мечникова й Каразіна до Ландау й Ципіна.",
  },
  places: {
    title: "Місця",
    lead: "Вулиці, храми, площа, вокзал, ринки й річки — декорації харківських історій.",
  },
  timeline: {
    title: "Хроніка",
    lead: "Історії за добами й роками — від заснування міста до пізньорадянських анекдотів.",
  },
  submit: {
    title: "Додати байку",
    lead: "Надішліть свою харківську історію — перевіримо й, якщо підійде, опублікуємо.",
  },
  about: {
    title: "Про проєкт",
    heading: "Пам’яті Савелія Ципіна",
    p1: "Цей сайт створено на пам’ять про автора книги «Харьков в байках и анекдотах» (Харків: Folio, 2001) — Савелія Ципіна — і для всіх харків’ян, кому дорогі вулиці, чутки й легенди міста.",
    p2: "Матеріали публікуються з дозволу, пов’язаного з автором і видавництвом. Орфографію й склад джерела збережено. Байкі й легенди — фольклор і міська оповідь, а не академічна довідка.",
    p3prefix: "Зараз у каталозі",
    cta: "Надіслати свою байку",
  },
  story: {
    back: "← До каталогу",
    relatedPeople: "Особистості в цій оповіді",
    relatedPlaces: "Місця в цій оповіді",
    originalNote: "Повний текст поки мовою оригіналу.",
  },
  footer: {
    memory: "Пам’ять",
    text: "Цей сайт — для всіх харків’ян. За мотивами книги «Харьков в байках и анекдотах» (Folio, 2001).",
  },
};

const en: Dictionary = {
  brand: "Kharkiv Legends",
  brandSub: "tales · rumors · lore",
  nav: {
    stories: "Tales",
    people: "People",
    places: "Places",
    map: "Map",
    timeline: "Timeline",
    rumors: "Rumors",
    submit: "Submit",
    about: "About",
  },
  rumors: {
    title: "Rumors from Kharkiv locals",
    lead: "Living city legends — no pictures, no claim to truth. What people whisper in courtyards and pass along: rumor has it, locals used to say, someone once heard…",
    hint: "Likes push a tale up, dislikes push it down. Default sort is by rating. Filters: theme and place.",
    epigraph:
      "That's how the city remembers it — each as they heard it, each as they retold it. Hard to verify now, but the rumor lives on.",
    search: "Search rumors…",
    all: "All",
    place: "Place",
    theme: "Theme",
    sort: "Sort",
    sortRating: "By rating",
    sortLikes: "By likes",
    sortTitle: "A–Z",
    sortPlace: "By place",
    sortYear: "By year",
    empty: "Nothing found.",
    like: "Like",
    dislike: "Dislike",
    score: "Score",
    count: "Showing {n}",
    expand: "Read full →",
    collapse: "Collapse",
    formTitle: "Submit your rumor",
    formLead:
      "Heard a tale in a courtyard, at work, or from a grandmother? Write it in your own words — after moderation it can appear in the rumors feed.",
    fieldTitle: "Title",
    fieldTitlePh: "A short name for this rumor?",
    fieldPlace: "Place / district",
    fieldPlacePh: "e.g. Zhuravlivka, Sumska…",
    fieldYear: "Year (approx.)",
    fieldYearPh: "1975",
    fieldTheme: "Theme",
    fieldThemeOther: "Other / not sure",
    fieldBody: "Rumor text",
    fieldBodyPh: "As you heard it: “rumor has it…”, “locals used to say…”",
    fieldName: "Name to credit (optional)",
    fieldNamePh: "Name or nickname",
    send: "Submit for moderation",
    thanksTitle: "Thank you",
    thanksText:
      "Your rumor is queued for moderation. If it fits, it will appear under Rumors.",
  },
  home: {
    eyebrow: "In memory of Saveliy Tsypin · for all Kharkiv locals",
    title: "Kharkiv Legends",
    lead: "City tales, rumors and lore — from Tsypin’s book and from Kharkiv voices. What courtyards whisper and generations remember.",
    catalog: "Full catalog",
    people: "People",
    places: "Places",
    randomTitle: "Random tales",
    seeAll: "See all {n} stories →",
    storiesOnSite: "stories, tales\nand place names",
    rumorsOnSite: "rumors, yarns\nand legends",
    factEyebrow: "Interesting fact",
    factPrompt: "Did you know that…",
    factMore: "Read the related story →",
    factNext: "Another fact",
  },
  storyTypes: {
    байка: "Tales",
    легенда: "Legends",
    анекдот: "Anecdotes",
    слух: "Rumors",
    топоним: "Place-names",
    "от местных": "From locals",
  },
  catalog: {
    title: "Story catalog",
    lead: "All of Tsypin’s texts — filter by type, district, era, and people.",
    search: "Search…",
    all: "All",
    type: "Type",
    district: "District",
    era: "Era",
    person: "Person",
    empty: "Nothing found.",
    read: "Read →",
  },
  map: {
    title: "Plan and map",
    lead: "An interactive 1887 plan of Kharkiv — and below, a map of stories tied to places.",
    note: "Markers sit near places named in the text. No random scatter.",
    apiTitle: "About map layers",
  },
  people: {
    title: "People",
    lead: "Kharkiv locals and those who studied or worked here — from Mechnikov and Karazin to Landau and Tsypin.",
  },
  places: {
    title: "Places",
    lead: "Streets, churches, the square, station, markets and rivers — the stage of Kharkiv stories.",
  },
  timeline: {
    title: "Timeline",
    lead: "Stories by era and year — from the city’s founding to late-Soviet jokes.",
  },
  submit: {
    title: "Submit a tale",
    lead: "Send your Kharkiv story — we’ll review it and publish if it fits.",
  },
  about: {
    title: "About",
    heading: "In memory of Saveliy Tsypin",
    p1: "This site remembers the author of “Kharkiv in Tales and Anecdotes” (Kharkiv: Folio, 2001) — Saveliy Tsypin — and is meant for everyone who loves the city’s streets, rumors and legends.",
    p2: "Materials are published with permission linked to the author and publisher. Spelling and tone of the source are preserved. Tales and legends are folklore and city storytelling, not academic reference.",
    p3prefix: "The catalog now holds",
    cta: "Send your tale",
  },
  story: {
    back: "← Back to catalog",
    relatedPeople: "People in this story",
    relatedPlaces: "Places in this story",
    originalNote: "Full text is still in the original language for now.",
  },
  footer: {
    memory: "Memory",
    text: "This site is for all Kharkiv locals. Based on “Kharkiv in Tales and Anecdotes” (Folio, 2001).",
  },
};

const dictionaries: Record<Locale, Dictionary> = { kh, uk, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.kh;
}
