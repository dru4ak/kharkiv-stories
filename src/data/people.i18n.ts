import type { Locale } from "@/i18n/config";

export type PersonLocale = {
  name: string;
  role: string;
  summary: string;
  body: string;
  imageCaption: string;
};

const uk: Record<string, PersonLocale> = {
  "ilya-mechnikov": {
    name: "Ілля Мечников",
    role: "Біолог, Нобелівський лауреат",
    summary:
      "Навчався в харківській гімназії та Харківському університеті; один із трьох нобелівських лауреатів, пов’язаних із містом.",
    body: `Ілля Ілліч Мечников — фізіолог і ембріолог, лауреат Нобелівської премії з фізіології та медицини (1908). Народився в Харківській губернії, навчався у 2-й харківській гімназії та на фізико-математичному факультеті Харківського університету.

Ще гімназистом організував «Союз науки», працював в університетській лабораторії. Його ім’я міцно ввійшло в історію Харкова як міста науки.`,
    imageCaption: "Ілюстративний портрет Іллі Мечникова",
  },
  "simon-kuznets": {
    name: "Саймон (Семен) Кузнець",
    role: "Економіст, Нобелівський лауреат",
    summary:
      "Уродженець Харкова, випускник юридичного факультету Харківського університету; Нобелівська премія з економіки (1971).",
    body: `Саймон Кузнець народився в Харкові, закінчив юридичний факультет Харківського університету. 1922 року емігрував до США.

У байках Ципіна про нього розповідають як про харків’янина світового масштабу — поряд із Мечниковим і Ландау.`,
    imageCaption: "Ілюстративний портрет Саймона Кузнеця",
  },
  "lev-landau": {
    name: "Лев Ландау",
    role: "Фізик-теоретик, Нобелівський лауреат",
    summary:
      "Працював у Харкові в УФТІ; Нобелівська премія з фізики (1962). Герой міських анекдотів.",
    body: `Лев Давидович Ландау — один із найбільших фізиків XX століття. У Харкові працював в Українському фізико-технічному інституті; тут склалася його школа.

У книзі Ципіна Ландау з’являється і як учений, і як персонаж харківських історій.`,
    imageCaption: "Ілюстративний портрет Лева Ландау",
  },
  "grigoriy-skovoroda": {
    name: "Григорій Сковорода",
    role: "Філософ, педагог Харківського колегіуму",
    summary:
      "Викладав у Харківському колегіумі; філософ Слобожанщини, чиє ім’я зрослося з містом.",
    body: `Григорій Савич Сковорода викладав у Харківському колегіумі. Для міста він — фігура пам’яті: учні, біографи, афоризми звучать у міських байках як рідні.`,
    imageCaption: "Ілюстративний портрет Григорія Сковороди",
  },
  "vasiliy-karazin": {
    name: "Василь Каразін",
    role: "Просвітитель, засновник університету",
    summary:
      "Ініціатор відкриття Харківського університету; ім’я Каразіна носить головний виш міста.",
    body: `Василь Назарович Каразін — учений і просвітитель, ключова фігура харківського культурного руху на зламі XVIII–XIX століть. Завдяки його зусиллям у місті з’явився університет.`,
    imageCaption: "Ілюстративний портрет Василя Каразіна",
  },
  "kvitka-osnovyanenko": {
    name: "Григорій Квітка-Основ’яненко",
    role: "Письменник, драматург",
    summary:
      "Харківський класик української літератури; автор «Сватання на Гончарівці».",
    body: `Григорій Федорович Квітка-Основ’яненко — прозаїк і драматург, пов’язаний із Харковом і Основою. Міський і слобожанський побут — природна декорація його п’єс.`,
    imageCaption: "Ілюстративний портрет Квітки-Основ’яненка",
  },
  "hulak-artemovsky": {
    name: "Петро Гулак-Артемовський",
    role: "Поет, ректор Харківського університету",
    summary:
      "Автор «Пан та собака», професор і ректор Харківського університету.",
    body: `Петро Петрович Гулак-Артемовський викладав у Харківському університеті, був його ректором (1841–1849).`,
    imageCaption: "Ілюстративний портрет Гулака-Артемовського",
  },
  "khrystyna-alchevska": {
    name: "Христина Алчевська",
    role: "Педагог, просвітителька",
    summary:
      "Засновниця Харківської жіночої недільної школи; працювала в місті.",
    body: `Христина Данилівна Алчевська організувала в Харкові жіночу недільну школу — зразок для імперії.`,
    imageCaption: "Ілюстративний портрет Христини Алчевської",
  },
  "vitaliy-korotich": {
    name: "Віталій Коротич",
    role: "Письменник, журналіст",
    summary:
      "Харків’янин; у книзі — байки й репліки, зокрема «Коротич, дай їм дрозда!»",
    body: `Віталій Олексійович Коротич — поет і публіцист, пов’язаний із Харковом.`,
    imageCaption: "Ілюстративний портрет Віталія Коротича",
  },
  "evsey-liberman": {
    name: "Євсей Ліберман",
    role: "Економіст, професор",
    summary:
      "Харківський професор; афоризм про політиків і лист до ЦК про реформу планування.",
    body: `Євсей Григорович Ліберман — харківський економіст. У книзі Ципіна йому присвячена байка «Всі брешуть».`,
    imageCaption: "Ілюстративний портрет Євсея Лібермана",
  },
  "saveliy-tsypin": {
    name: "Савелій Ципін",
    role: "Письменник-сатирик, автор збірника",
    summary:
      "Харківський сатирик; автор «Харькова в байках и анекдотах» — пам’ять про нього сенс цього сайту.",
    body: `Савелій Якович Ципін — харківський сатирик, член Спілки письменників України. Зібрав міські байки в книгу, за якою зроблено цей сайт.`,
    imageCaption: "Ілюстративний портрет Савелія Ципіна",
  },
};

const en: Record<string, PersonLocale> = {
  "ilya-mechnikov": {
    name: "Ilya Mechnikov",
    role: "Biologist, Nobel laureate",
    summary:
      "Studied at a Kharkiv gymnasium and Kharkiv University; one of three Nobel laureates tied to the city.",
    body: `Ilya Ilyich Mechnikov — physiologist and embryologist, Nobel Prize in Physiology or Medicine (1908). Born in Kharkiv Governorate, he studied at the 2nd Kharkiv gymnasium and Kharkiv University.

As a schoolboy he organized a “Union of Science” and worked in a university lab. His name is part of Kharkiv’s identity as a city of science.`,
    imageCaption: "Illustrative portrait of Ilya Mechnikov",
  },
  "simon-kuznets": {
    name: "Simon (Semen) Kuznets",
    role: "Economist, Nobel laureate",
    summary:
      "Born in Kharkiv, law graduate of Kharkiv University; Nobel Prize in Economics (1971).",
    body: `Simon Kuznets was born in Kharkiv and graduated from Kharkiv University’s law faculty. In 1922 he emigrated to the United States.

In Tsypin’s tales he stands as a Kharkiv native of world stature — beside Mechnikov and Landau.`,
    imageCaption: "Illustrative portrait of Simon Kuznets",
  },
  "lev-landau": {
    name: "Lev Landau",
    role: "Theoretical physicist, Nobel laureate",
    summary:
      "Worked in Kharkiv at UPTI; Nobel Prize in Physics (1962). Hero of city anecdotes.",
    body: `Lev Davidovich Landau — one of the great physicists of the 20th century. In Kharkiv he worked at the Ukrainian Physical-Technical Institute; his school took shape here.

In Tsypin’s book Landau appears as both scientist and character of Kharkiv stories.`,
    imageCaption: "Illustrative portrait of Lev Landau",
  },
  "grigoriy-skovoroda": {
    name: "Hryhorii Skovoroda",
    role: "Philosopher, teacher at Kharkiv Collegium",
    summary:
      "Taught at the Kharkiv Collegium; Sloboda Ukraine philosopher bound to the city.",
    body: `Hryhorii Skovoroda taught at the Kharkiv Collegium. For the city he is a figure of memory — pupils, biographers, and sayings that feel local.`,
    imageCaption: "Illustrative portrait of Hryhorii Skovoroda",
  },
  "vasiliy-karazin": {
    name: "Vasyl Karazin",
    role: "Enlightener, university founder",
    summary:
      "Initiator of Kharkiv University; the main university bears his name.",
    body: `Vasyl Nazarovych Karazin — scholar and enlightener, key figure of Kharkiv’s cultural movement around 1800. His efforts brought the university into being.`,
    imageCaption: "Illustrative portrait of Vasyl Karazin",
  },
  "kvitka-osnovyanenko": {
    name: "Hryhorii Kvitka-Osnovianenko",
    role: "Writer, playwright",
    summary:
      "Kharkiv classic of Ukrainian literature; author of “Matchmaking at Honcharivka”.",
    body: `Hryhorii Kvitka-Osnovianenko — prose writer and playwright tied to Kharkiv and Osnova. City and Sloboda life are the natural setting of his plays.`,
    imageCaption: "Illustrative portrait of Kvitka-Osnovianenko",
  },
  "hulak-artemovsky": {
    name: "Petro Hulak-Artemovsky",
    role: "Poet, rector of Kharkiv University",
    summary:
      "Author of “Pan and the Dog”, professor and rector of Kharkiv University.",
    body: `Petro Hulak-Artemovsky taught at Kharkiv University and was its rector (1841–1849).`,
    imageCaption: "Illustrative portrait of Hulak-Artemovsky",
  },
  "khrystyna-alchevska": {
    name: "Khrystyna Alchevska",
    role: "Educator",
    summary:
      "Founder of the Kharkiv women’s Sunday school; worked in the city.",
    body: `Khrystyna Alchevska organized a women’s Sunday school in Kharkiv that became a model across the empire.`,
    imageCaption: "Illustrative portrait of Khrystyna Alchevska",
  },
  "vitaliy-korotich": {
    name: "Vitalii Korotych",
    role: "Writer, journalist",
    summary:
      "Kharkiv native; the book includes jokes and the line “Korotych, give them a thrush!”",
    body: `Vitalii Korotych — poet and publicist tied to Kharkiv.`,
    imageCaption: "Illustrative portrait of Vitalii Korotych",
  },
  "evsey-liberman": {
    name: "Yevsei Liberman",
    role: "Economist, professor",
    summary:
      "Kharkiv professor; aphorism about politicians and a letter to the Central Committee on planning reform.",
    body: `Yevsei Liberman — Kharkiv economist. Tsypin’s book includes the tale “Everyone lies”.`,
    imageCaption: "Illustrative portrait of Yevsei Liberman",
  },
  "saveliy-tsypin": {
    name: "Saveliy Tsypin",
    role: "Satirist, author of the collection",
    summary:
      "Kharkiv satirist; author of “Kharkiv in Tales and Anecdotes” — this site remembers him.",
    body: `Saveliy Tsypin — Kharkiv satirist, member of the Writers’ Union of Ukraine. He gathered city tales into the book behind this site.`,
    imageCaption: "Illustrative portrait of Saveliy Tsypin",
  },
};

export function localizePerson(
  slug: string,
  locale: Locale,
  fallback: PersonLocale,
): PersonLocale {
  if (locale === "uk") return uk[slug] ?? fallback;
  if (locale === "en") return en[slug] ?? fallback;
  return fallback;
}
