import type { Locale } from "@/i18n/config";

export type FunFact = {
  id: string;
  /** Связанная история в каталоге (если есть) */
  storySlug?: string;
  text: Record<Locale, string>;
};

/** Короткие факты по мотивам баек и городских хроник. */
export const funFacts: FunFact[] = [
  {
    id: "igor-1185",
    storySlug: "zatmenie",
    text: {
      kh: "Весной 1185 года новгород-северский князь Игорь Святославович ходил на половцев — об этом повествует «Слово о полку Игореве». Битва произошла на территории нынешней Харьковщины, южнее посёлка Верхний Салтов.",
      uk: "Навесні 1185 року новгород-сіверський князь Ігор Святославич ходив на половців — про це розповідає «Слово о полку Ігоревім». Битва сталася на території нинішньої Харківщини, південніше селища Верхній Салтів.",
      en: "In spring 1185, Prince Igor Svyatoslavich of Novgorod-Seversky marched against the Cumans — the tale told in The Tale of Igor’s Campaign. The battle took place in today’s Kharkiv region, south of Verkhnii Saltiv.",
    },
  },
  {
    id: "eclipse-donets",
    storySlug: "zatmenie",
    text: {
      kh: "Перед переправой через Северский Донец войско Игоря застало солнечное затмение: небо потемнело около 16:55, воинов охватила паника — а князь всё равно велел идти вперёд.",
      uk: "Перед переправою через Сіверський Донець військо Ігоря застало сонячне затемнення: небо потемніло близько 16:55, воїнів охопила паніка — а князь усе одно наказав іти вперед.",
      en: "Before crossing the Siverskyi Donets, Igor’s army saw a solar eclipse: the sky darkened around 16:55 and panic spread — yet the prince still ordered them onward.",
    },
  },
  {
    id: "otkuda-harko",
    storySlug: "otkuda-harkov",
    text: {
      kh: "По преданию, город назван по казаку Харко — основателю острога. Старинные изображения показывают его на коне со щитом и пикой на фоне башен крепости.",
      uk: "За переказом, місто назване на честь козака Харка — засновника острогу. Старовинні зображення показують його на коні зі щитом і списом на тлі веж фортеці.",
      en: "Legend says the city takes its name from the Cossack Kharko, founder of the fort. Old pictures show him on horseback with shield and lance against the fortress towers.",
    },
  },
  {
    id: "tri-gerba",
    storySlug: "tri-gerba",
    text: {
      kh: "В 1781 году Екатерина II утвердила герб Харьковской губернии: рог изобилия и кадуцей Меркурия на зелёном поле — знак торговли и плодородия.",
      uk: "1781 року Катерина II затвердила герб Харківської губернії: ріг достатку й кадуцей Меркурія на зеленому полі — знак торгівлі та родючості.",
      en: "In 1781 Catherine II approved the Kharkiv gubernia coat of arms: a cornucopia and Mercury’s caduceus on a green field — symbols of trade and fertility.",
    },
  },
  {
    id: "netech",
    storySlug: "kuda-delas-netech",
    text: {
      kh: "Старая поговорка «Хоть лопни, Харьков не течет» прячет в себе три реки: Харьков, Лопань и исчезнувшую Нетечь — третью «сестру» городского центра.",
      uk: "Стара приказка «Хоч трісни, Харків не тече» ховає в собі три річки: Харків, Лопань і зниклу Нетечу — третю «сестру» міського центру.",
      en: "The old saying “Burst if you like — Kharkiv doesn’t flow” hides three rivers: Kharkiv, Lopan, and the vanished Netech — the third sister of the city center.",
    },
  },
  {
    id: "skovoroda",
    storySlug: "mir-lovil-ego",
    text: {
      kh: "Екатерина II по дороге из Крыма заметила у Харькова старца в простой одежде — это был философ Григорий Сковорода. «Мир ловил его, но не поймал».",
      uk: "Катерина II дорогою з Криму помітила біля Харкова старця в простому одязі — це був філософ Григорій Сковорода. «Світ ловив його, та не спіймав».",
      en: "On the way from Crimea, Catherine II noticed an old man in plain clothes near Kharkiv — the philosopher Hryhorii Skovoroda. “The world tried to catch him, but never did.”",
    },
  },
  {
    id: "sirko-osada",
    storySlug: "gorod-v-osade",
    text: {
      kh: "В 1668 году харьковскую крепость осадил не чужой хан и не московское войско, а казаки атамана Ивана Сирко — своего же края.",
      uk: "1668 року харківську фортецю обложили не чужий хан і не московське військо, а козаки отамана Івана Сірка — свого ж краю.",
      en: "In 1668 the Kharkiv fortress was besieged not by a foreign khan or Muscovite troops, but by Cossacks of ataman Ivan Sirko — from the same land.",
    },
  },
  {
    id: "shvedy",
    storySlug: "kak-shvedy-pod-harkovom",
    text: {
      kh: "Выражение «разбит, как швед под Полтавой» могло бы звучать и «под Харьковом»: по одной легенде Пётр I думал дать Карлу XII решающий бой именно здесь.",
      uk: "Вираз «розбитий, як швед під Полтавою» міг би звучати й «під Харковом»: за однією легендою Петро I думав дати Карлу XII вирішальний бій саме тут.",
      en: "The saying “beaten like the Swede at Poltava” might have been “at Kharkiv”: one legend says Peter I planned to face Charles XII in a decisive battle here.",
    },
  },
  {
    id: "rogan-cantemir",
    storySlug: "rogan-ne-tolko-pivo",
    text: {
      kh: "«Рогань» — не только пиво и жилмассив: с XVIII века эти земли связаны с родом Кантемиров, а не с заводской этикеткой.",
      uk: "«Рогань» — не лише пиво й житломасив: з XVIII століття ці землі пов’язані з родом Кантемірів, а не із заводською етикеткою.",
      en: "“Rohan” is not only beer and a housing estate: since the 18th century the land has been tied to the Cantemir family, not a brewery label.",
    },
  },
  {
    id: "dvorets-noch",
    storySlug: "dvorets-na-odnu-noch",
    text: {
      kh: "Для проезда Екатерины после Крыма Потёмкин велел возводить «потемкинские» дворцы на одну ночь — в том числе на харьковском пути.",
      uk: "Для проїзду Катерини після Криму Потьомкін наказав зводити «потьомкінські» палаци на одну ніч — зокрема на харківському шляху.",
      en: "For Catherine’s journey after Crimea, Potemkin ordered “Potemkin” palaces built for a single night — including along the Kharkiv road.",
    },
  },
  {
    id: "mechnikov",
    storySlug: "ilya-mechnikov",
    text: {
      kh: "Илья Мечников ещё гимназистом переступил порог Харьковского университета — и позже стал одним из трёх нобелевских лауреатов, связанных с городом.",
      uk: "Ілля Мечников ще гімназистом переступив поріг Харківського університету — і згодом став одним із трьох нобелівських лауреатів, пов’язаних із містом.",
      en: "As a schoolboy Ilya Mechnikov already stepped into Kharkiv University — and later became one of three Nobel laureates tied to the city.",
    },
  },
  {
    id: "kuznets",
    storySlug: "saymon-kuznets",
    text: {
      kh: "Саймон Кузнец родился в Харькове в 1901 году; путь к Нобелевской премии по экономике начался здесь, в семье торговца мехом.",
      uk: "Саймон Кузнець народився в Харкові 1901 року; шлях до Нобелівської премії з економіки почався тут, у родині торговця хутром.",
      en: "Simon Kuznets was born in Kharkiv in 1901; the road to the Nobel Prize in Economics began here, in a fur-trader’s family.",
    },
  },
  {
    id: "landau",
    storySlug: "lev-landau",
    text: {
      kh: "Лев Ландау работал в харьковском УФТИ — здесь же складывалась его школа, а позже пришла Нобелевская премия по физике.",
      uk: "Лев Ландау працював у харківському УФТІ — тут складалася його школа, а згодом прийшла Нобелівська премія з фізики.",
      en: "Lev Landau worked at Kharkiv’s UFTI — his school took shape there, and later came the Nobel Prize in Physics.",
    },
  },
  {
    id: "kreschenie-katanya",
    storySlug: "kreschenskie-katanya",
    text: {
      kh: "На крещенской ярмарке по Екатеринославской катались на лихачах и тройках с бубенцами — от моста до Дмитровской церкви сани шли гуськом.",
      uk: "На водохресній ярмарці по Катеринославській каталися на лихачах і трійках із бубонцями — від мосту до Дмитрівської церкви сани йшли гусаком.",
      en: "At the Epiphany fair on Ekaterinoslavskaya Street people rode flashy cabs and troikas hung with bells — sleighs filed from the bridge to the Dmytrivska church.",
    },
  },
  {
    id: "falshivka",
    storySlug: "falshivaya-moneta",
    text: {
      kh: "В XVII веке в Харькове поймали фальшивомонетчиков с кличками Иконник и Золотарь — ремесло отразилось прямо в прозвищах.",
      uk: "У XVII столітті в Харкові спіймали фальшивомонетників із прізвиськами Іконник і Золотар — ремесло відбилося просто в прізвиськах.",
      en: "In the 17th century Kharkiv caught counterfeiters nicknamed Ikonnik and Zolotar — their trade was written into the monikers.",
    },
  },
  {
    id: "sultanu",
    storySlug: "kto-sochinil-pismo-turetskomu-sultanu",
    text: {
      kh: "Знаменитое казацкое «письмо турецкому султану» связывают и с харьковскими сюжетами — спор о том, кто его сочинил, живёт веками.",
      uk: "Знаменитий козацький «лист турецькому султанові» пов’язують і з харківськими сюжетами — суперечка, хто його склав, живе століттями.",
      en: "The famous Cossack “letter to the Turkish sultan” is tied to Kharkiv lore too — the quarrel over who wrote it has lasted for centuries.",
    },
  },
  {
    id: "raklo",
    storySlug: "raklo-vanko-zhuzhka-i-dr",
    text: {
      kh: "В харьковской речи жили свои слова — «ракло», «ванько», «жужка» — которые в других городах почти не слышали.",
      uk: "У харківській мові жили свої слова — «ракло», «ванько», «жужка» — яких в інших містах майже не чули.",
      en: "Kharkiv speech had its own words — “raklo,” “vanko,” “zhuzhka” — barely heard in other cities.",
    },
  },
  {
    id: "toponim",
    storySlug: "na-ulitsu-vyshel-a-ulitsy-net",
    text: {
      kh: "Чеботарская, Кузнечная, Рымарская, Кацарская — улицы хранят имена старых ремёсел: сапожников, кузнецов, шорников, мясников.",
      uk: "Чоботарська, Ковальська, Римарська, Кацарська — вулиці зберігають імена старих ремесел: чоботарів, ковалів, римарів, м’ясників.",
      en: "Chebotarska, Kuznechna, Rymarska, Katsarska — streets keep the names of old crafts: cobblers, smiths, harness-makers, butchers.",
    },
  },
  {
    id: "goncharovka",
    storySlug: "svatane-na-goncharovke",
    text: {
      kh: "На Гончаровке свадьбы справляли шумно: свахи несли хлеб и посохи, а согласие невесты закрепляли по старинному обряду.",
      uk: "На Гончарівці весілля справляли гучно: свахи несли хліб і посохи, а згоду нареченої закріплювали за давнім обрядом.",
      en: "In Goncharivka weddings were loud affairs: matchmakers carried bread and staffs, and the bride’s consent followed the old rite.",
    },
  },
  {
    id: "ukrali-most",
    storySlug: "ukrali-most",
    text: {
      kh: "В харьковских байках мост могут и «украсть» — городской фольклор не стесняется абсурда наравне с хроникой.",
      uk: "У харківських байках міст можуть і «вкрасти» — міський фольклор не соромиться абсурду нарівні з хронікою.",
      en: "In Kharkiv tales a bridge can even be “stolen” — city folklore mixes absurdity with chronicle freely.",
    },
  },
  {
    id: "gosprom",
    storySlug: "samoubiystvo-v-gosprome",
    text: {
      kh: "Госпром на площади — не только символ конструктивизма: вокруг него крутятся десятки городских слухов и баек XX века.",
      uk: "Держпром на площі — не лише символ конструктивізму: навколо нього крутяться десятки міських чуток і байок XX століття.",
      en: "Derzhprom on the square is more than a constructivist icon: dozens of 20th-century rumors and tales orbit around it.",
    },
  },
  {
    id: "potemkin-caduceus",
    storySlug: "tri-gerba",
    text: {
      kh: "Кадуцей на харьковском гербе — жезл Меркурия: город издавна кормился ярмарками и торговым путём, а не только крепостью.",
      uk: "Кадуцей на харківському гербі — жезл Меркурія: місто здавна жило ярмарками й торговим шляхом, а не лише фортецею.",
      en: "The caduceus on Kharkiv’s arms is Mercury’s staff: the city long lived by fairs and the trade road, not only by the fort.",
    },
  },
  {
    id: "kreschenie-fair",
    storySlug: "kreschenskie-katanya",
    text: {
      kh: "Харьков когда-то «конкурировал с Москвою лихой ездой» по зимнему пути — особенно в крещенскую ярмарку после двух часов дня.",
      uk: "Харків колись «конкурував із Москвою лихою їздою» зимовим шляхом — особливо на водохресній ярмарці після другої дня.",
      en: "Kharkiv once “competed with Moscow in dashing rides” on winter roads — especially at the Epiphany fair after two in the afternoon.",
    },
  },
  {
    id: "university-hill",
    storySlug: "pervyy-v-ukraine",
    text: {
      kh: "Университетская горка — историческое ядро: отсюда город рос к Лопани, а предания цеплялись к соборам и спускам.",
      uk: "Університетська гірка — історичне ядро: звідси місто росло до Лопані, а перекази чіплялися до соборів і спусків.",
      en: "University Hill is the historic core: from here the city grew toward the Lopan, and legends clung to churches and slopes.",
    },
  },
];

export function getFactText(fact: FunFact, locale: Locale): string {
  return fact.text[locale] || fact.text.kh;
}

/** Fisher–Yates shuffle — новый порядок при каждом вызове. */
export function shuffleFacts(excludeId?: string): FunFact[] {
  const pool =
    excludeId && funFacts.length > 1
      ? funFacts.filter((f) => f.id !== excludeId)
      : [...funFacts];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return pool;
}

export function pickRandomFact(excludeId?: string): FunFact {
  const pool = shuffleFacts(excludeId);
  return pool[0] ?? funFacts[0]!;
}
