import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

export type SeoPageKey =
  | "home"
  | "stories"
  | "rumors"
  | "people"
  | "places"
  | "map"
  | "timeline"
  | "submit"
  | "about"
  | "admin";

type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
};

const brand: Record<Locale, string> = {
  kh: "Легенды Харькова",
  uk: "Легенди Харкова",
  en: "Kharkiv Legends",
};

const brandShort: Record<Locale, string> = {
  kh: "Легенды Харькова",
  uk: "Легенди Харкова",
  en: "Kharkiv Legends",
};

const pages: Record<Locale, Record<SeoPageKey, SeoCopy>> = {
  kh: {
    home: {
      title: "Легенды Харькова — байки, слухи и городские предания",
      description:
        "Городские байки, слухи и предания о Харькове — из книги Цыпина и из уст харьковчан. То, что шепчут во дворах и помнят поколениями.",
      keywords: [
        "Харьков",
        "легенды Харькова",
        "байки Харькова",
        "городские легенды",
        "слухи Харькова",
        "предания Харькова",
        "Савелий Цыпин",
        "харьковские истории",
        "фольклор Харькова",
      ],
    },
    stories: {
      title: "Каталог баек и легенд Харькова",
      description:
        "Все тексты книги Цыпина: байки, легенды, анекдоты, слухи и топонимы Харькова — с фильтрами по типу, району и эпохе.",
      keywords: [
        "байки Харькова",
        "каталог легенд",
        "Цыпин",
        "харьковские анекдоты",
        "топонимы Харькова",
      ],
    },
    rumors: {
      title: "Слухи от харьковчан — городские легенды",
      description:
        "Живые городские легенды от харьковчан: без картинок и без претензии на истину — то, что шепчут во дворах и передают из уст в уста.",
      keywords: [
        "слухи Харькова",
        "городские легенды Харькова",
        "легенды от местных",
        "харьковчане рассказывают",
        "фольклор Харькова",
      ],
    },
    people: {
      title: "Личности Харькова в байках и историях",
      description:
        "Харьковчане и те, кто учился или работал в городе — от Мечникова и Каразина до Ландау и Цыпина.",
      keywords: [
        "известные харьковчане",
        "Мечников",
        "Ландау",
        "Каразин",
        "Цыпин",
        "личности Харькова",
      ],
    },
    places: {
      title: "Места Харькова в байках и легендах",
      description:
        "Улицы, храмы, площадь, вокзал, рынки и реки — декорации харьковских историй на карте и в каталоге.",
      keywords: [
        "места Харькова",
        "улицы Харькова",
        "Сумская",
        "вокзал Харьков",
        "харьковские районы",
      ],
    },
    map: {
      title: "План 1887 и карта баек Харькова",
      description:
        "Интерактивный план Харькова 1887 года с названиями улиц при наведении — и карта историй с привязкой к местности.",
      keywords: [
        "карта Харькова",
        "карта легенд",
        "историческая карта Харькова",
        "план Харькова 1887",
        "байки на карте",
      ],
    },
    timeline: {
      title: "Хроника Харькова в байках",
      description:
        "Истории по эпохам и годам — от основания города до позднесоветских анекдотов.",
      keywords: [
        "история Харькова",
        "хроника Харькова",
        "основание Харькова",
        "эпохи Харькова",
      ],
    },
    submit: {
      title: "Добавить байку о Харькове",
      description:
        "Пришлите свою харьковскую историю — проверим и, если подойдёт, опубликуем в каталоге.",
      keywords: ["добавить байку", "прислать легенду", "харьковская история"],
    },
    about: {
      title: "О проекте — памяти Савелия Цыпина",
      description:
        "Сайт создан в память об авторе книги «Харьков в байках и анекдотах» (Folio, 2001) и для всех харьковчан.",
      keywords: [
        "Савелий Цыпин",
        "Харьков в байках и анекдотах",
        "Folio",
        "о проекте",
      ],
    },
    admin: {
      title: "Админка",
      description: "Служебный раздел.",
      keywords: [],
    },
  },
  uk: {
    home: {
      title: "Легенди Харкова — байки, чутки й міські перекази",
      description:
        "Міські байки, чутки й перекази про Харків — з книги Ципіна і з вуст харків’ян. Те, що шепочуть у дворах і пам’ятають поколіннями.",
      keywords: [
        "Харків",
        "легенди Харкова",
        "байки Харкова",
        "міські легенди",
        "чутки Харкова",
        "перекази Харкова",
        "Савелій Ципін",
        "харківські історії",
        "фольклор Харкова",
      ],
    },
    stories: {
      title: "Каталог байок і легенд Харкова",
      description:
        "Усі тексти книги Ципіна: байки, легенди, анекдоти, чутки й топоніми Харкова — з фільтрами за типом, районом і добою.",
      keywords: [
        "байки Харкова",
        "каталог легенд",
        "Ципін",
        "харківські анекдоти",
        "топоніми Харкова",
      ],
    },
    rumors: {
      title: "Чутки від харків’ян — міські легенди",
      description:
        "Живі міські легенди від харків’ян: без картинок і без претензії на істину — те, що шепочуть у дворах і передають з вуст в уста.",
      keywords: [
        "чутки Харкова",
        "міські легенди Харкова",
        "легенди від місцевих",
        "харків’яни розповідають",
        "фольклор Харкова",
      ],
    },
    people: {
      title: "Особистості Харкова в байках і історіях",
      description:
        "Харків’яни та ті, хто вчився чи працював у місті — від Мечникова й Каразіна до Ландау й Ципіна.",
      keywords: [
        "відомі харків’яни",
        "Мечников",
        "Ландау",
        "Каразін",
        "Ципін",
        "особистості Харкова",
      ],
    },
    places: {
      title: "Місця Харкова в байках і легендах",
      description:
        "Вулиці, храми, площа, вокзал, ринки й річки — декорації харківських історій на мапі та в каталозі.",
      keywords: [
        "місця Харкова",
        "вулиці Харкова",
        "Сумська",
        "вокзал Харків",
        "харківські райони",
      ],
    },
    map: {
      title: "План 1887 і мапа байок Харкова",
      description:
        "Інтерактивний план Харкова 1887 року з назвами вулиць при наведенні — і мапа історій із прив’язкою до місцевості.",
      keywords: [
        "мапа Харкова",
        "мапа легенд",
        "історична мапа Харкова",
        "план Харкова 1887",
        "байки на мапі",
      ],
    },
    timeline: {
      title: "Хроніка Харкова в байках",
      description:
        "Історії за добами й роками — від заснування міста до пізньорадянських анекдотів.",
      keywords: [
        "історія Харкова",
        "хроніка Харкова",
        "заснування Харкова",
        "доби Харкова",
      ],
    },
    submit: {
      title: "Додати байку про Харків",
      description:
        "Надішліть свою харківську історію — перевіримо і, якщо підійде, опублікуємо в каталозі.",
      keywords: ["додати байку", "надіслати легенду", "харківська історія"],
    },
    about: {
      title: "Про проєкт — пам’яті Савелія Ципіна",
      description:
        "Сайт створено на пам’ять про автора книги «Харків у байках і анекдотах» (Folio, 2001) і для всіх харків’ян.",
      keywords: [
        "Савелій Ципін",
        "Харків у байках і анекдотах",
        "Folio",
        "про проєкт",
      ],
    },
    admin: {
      title: "Адмінка",
      description: "Службовий розділ.",
      keywords: [],
    },
  },
  en: {
    home: {
      title: "Kharkiv Legends — tales, rumors and city lore",
      description:
        "City tales, rumors and lore about Kharkiv — from Tsypin’s book and from local voices. What courtyards whisper and generations remember.",
      keywords: [
        "Kharkiv",
        "Kharkiv legends",
        "Kharkiv tales",
        "urban legends Kharkiv",
        "Kharkiv rumors",
        "Kharkiv lore",
        "Saveliy Tsypin",
        "Kharkiv folklore",
        "city stories Kharkiv",
      ],
    },
    stories: {
      title: "Catalog of Kharkiv tales and legends",
      description:
        "All texts from Tsypin’s book: yarns, legends, anecdotes, rumors and toponyms of Kharkiv — filter by type, district and era.",
      keywords: [
        "Kharkiv tales",
        "legend catalog",
        "Tsypin",
        "Kharkiv anecdotes",
        "Kharkiv place names",
      ],
    },
    rumors: {
      title: "Rumors from Kharkiv locals — city legends",
      description:
        "Living city legends from Kharkiv locals: no pictures, no claim to truth — what people whisper in courtyards and pass along.",
      keywords: [
        "Kharkiv rumors",
        "Kharkiv urban legends",
        "local legends",
        "Kharkiv folklore",
      ],
    },
    people: {
      title: "People of Kharkiv in tales and stories",
      description:
        "Kharkiv locals and those who studied or worked in the city — from Mechnikov and Karazin to Landau and Tsypin.",
      keywords: [
        "famous Kharkivites",
        "Mechnikov",
        "Landau",
        "Karazin",
        "Tsypin",
        "Kharkiv people",
      ],
    },
    places: {
      title: "Places of Kharkiv in tales and legends",
      description:
        "Streets, churches, the square, the station, markets and rivers — settings of Kharkiv stories on the map and in the catalog.",
      keywords: [
        "Kharkiv places",
        "Kharkiv streets",
        "Sumska",
        "Kharkiv station",
        "Kharkiv districts",
      ],
    },
    map: {
      title: "1887 plan and map of Kharkiv tales",
      description:
        "Interactive 1887 plan of Kharkiv with street names on hover — and a story map pinned to real places.",
      keywords: [
        "Kharkiv map",
        "legend map",
        "historical map Kharkiv",
        "Kharkiv 1887 plan",
        "tales on the map",
      ],
    },
    timeline: {
      title: "Kharkiv chronicle in tales",
      description:
        "Stories by era and year — from the city’s founding to late-Soviet anecdotes.",
      keywords: [
        "Kharkiv history",
        "Kharkiv timeline",
        "founding of Kharkiv",
        "Kharkiv eras",
      ],
    },
    submit: {
      title: "Submit a Kharkiv tale",
      description:
        "Send your Kharkiv story — we’ll review it and, if it fits, publish it in the catalog.",
      keywords: ["submit tale", "send legend", "Kharkiv story"],
    },
    about: {
      title: "About — in memory of Saveliy Tsypin",
      description:
        "This site remembers the author of “Kharkiv in Tales and Anecdotes” (Folio, 2001) and is meant for everyone who loves the city.",
      keywords: [
        "Saveliy Tsypin",
        "Kharkiv in Tales and Anecdotes",
        "Folio",
        "about the project",
      ],
    },
    admin: {
      title: "Admin",
      description: "Internal section.",
      keywords: [],
    },
  },
};

const defaultOgImage = "/illustrations/hero-kharkiv-real.jpg";

/** hreflang codes used in alternates (kh locale = Russian content). */
export function hreflangForLocale(locale: Locale): string {
  if (locale === "kh") return "ru";
  return locale;
}

export function languageAlternates(path: string): Record<string, string> {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const map: Record<string, string> = {
    "x-default": absoluteUrl(localizedPath("kh", clean)),
  };
  for (const locale of locales) {
    map[hreflangForLocale(locale)] = absoluteUrl(localizedPath(locale, clean));
  }
  return map;
}

export function getSeoCopy(locale: Locale, page: SeoPageKey): SeoCopy {
  return pages[locale][page];
}

export function getBrand(locale: Locale): string {
  return brand[locale];
}

export function getBrandShort(locale: Locale): string {
  return brandShort[locale];
}

export function buildPageMetadata(opts: {
  locale: Locale;
  path: string;
  page?: SeoPageKey;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const copy = opts.page ? getSeoCopy(opts.locale, opts.page) : null;
  const title = opts.title?.trim() || copy?.title || brand[opts.locale];
  const description =
    opts.description?.trim() ||
    copy?.description ||
    pages[opts.locale].home.description;
  const keywords = opts.keywords?.length
    ? opts.keywords
    : (copy?.keywords ?? []);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const canonical = absoluteUrl(localizedPath(opts.locale, path));
  const imagePath = opts.image || defaultOgImage;
  const imageUrl = absoluteUrl(imagePath);
  const short = brandShort[opts.locale];

  return {
    // Absolute title: page copy already includes brand / keywords for SERP.
    title: { absolute: title },
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: [{ name: "Saveliy Tsypin / Легенды Харькова" }],
    creator: short,
    publisher: short,
    category: "Culture",
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: opts.locale === "kh" ? "ru_RU" : opts.locale === "uk" ? "uk_UA" : "en_US",
      url: canonical,
      siteName: brand[opts.locale],
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: opts.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function siteJsonLd(locale: Locale) {
  const home = getSeoCopy(locale, "home");
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: brand[locale],
        description: home.description,
        inLanguage: hreflangForLocale(locale),
        publisher: { "@id": `${url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/${locale}/stories?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: brand[locale],
        url,
        description: home.description,
        logo: absoluteUrl(defaultOgImage),
      },
    ],
  };
}

export function storyJsonLd(opts: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: hreflangForLocale(opts.locale),
    mainEntityOfPage: absoluteUrl(localizedPath(opts.locale, opts.path)),
    image: absoluteUrl(opts.image || defaultOgImage),
    author: {
      "@type": "Person",
      name: "Савелий Цыпин",
    },
    isPartOf: {
      "@type": "WebSite",
      name: brand[opts.locale],
      url: getSiteUrl(),
    },
    about: {
      "@type": "Place",
      name: opts.locale === "en" ? "Kharkiv" : opts.locale === "uk" ? "Харків" : "Харьков",
    },
  };
}
