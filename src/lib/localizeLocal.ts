import type { LocalLegend } from "@/data/locals";
import type { Locale } from "@/i18n/config";
import i18n from "@/data/locals.i18n.json";

type LocalI18nEntry = {
  title?: string;
  body?: string;
  placeName?: string;
};

type LocalI18nFile = Record<
  string,
  { uk?: LocalI18nEntry; en?: LocalI18nEntry }
>;

const table = i18n as LocalI18nFile;

export const THEME_LABELS: Record<
  Locale,
  Record<string, string>
> = {
  kh: {
    подземелье: "подземелье",
    храмы: "храмы",
    клады: "клады",
    война: "война",
    спецслужбы: "спецслужбы",
    советское: "советское",
    мистика: "мистика",
    учёба: "учёба",
    городское: "городское",
  },
  uk: {
    подземелье: "підземелля",
    храмы: "храми",
    клады: "скарби",
    война: "війна",
    спецслужбы: "спецслужби",
    советское: "радянське",
    мистика: "містика",
    учёба: "навчання",
    городское: "міське",
  },
  en: {
    подземелье: "underground",
    храмы: "churches",
    клады: "treasures",
    война: "war",
    спецслужбы: "secret police",
    советское: "Soviet era",
    мистика: "mystery",
    учёба: "campus",
    городское: "city lore",
  },
};

export const PLACE_LABELS: Record<Locale, Record<string, string>> = {
  kh: {},
  uk: {
    "Благовещенский собор / Лопань": "Благовіщенський собор / Лопань",
    Журавлевка: "Журавлівка",
    "Пушкинская / Дарвина": "Пушкінська / Дарвіна",
    "Пятихатки / лесопарк": "П'ятихатки / лісопарк",
    Университет: "Університет",
    Госпром: "Держпром",
    "пл. Конституции / Сумская": "пл. Конституції / Сумська",
    Холодная: "Холодна Гора",
    "Холодная гора": "Холодна Гора",
    Салтовка: "Салтівка",
    Алексеевка: "Олексіївка",
    "парк Шевченко": "парк Шевченка",
    "Сад Шевченко": "Сад Шевченка",
    Харьков: "Харків",
    "весь Харьков": "увесь Харків",
    "Новые дома": "Нові будинки",
    Павлово: "Павлове Поле",
    "Павлово Поле": "Павлове Поле",
    Рогань: "Рогань",
    Бавария: "Баварія",
    "ст. метро": "ст. метро",
  },
  en: {
    "Благовещенский собор / Лопань": "Annunciation Cathedral / Lopan",
    Журавлевка: "Zhuravlivka",
    "Пушкинская / Дарвина": "Pushkinska / Darvina",
    "Пятихатки / лесопарк": "Piatykhatky / Forest Park",
    Университет: "University",
    Госпром: "Derzhprom",
    "пл. Конституции / Сумская": "Constitution Square / Sumska",
    Холодная: "Kholodna Hora",
    "Холодная гора": "Kholodna Hora",
    Салтовка: "Saltivka",
    Алексеевка: "Oleksiivka",
    "парк Шевченко": "Shevchenko Park",
    "Сад Шевченко": "Shevchenko Garden",
    Харьков: "Kharkiv",
    "весь Харьков": "all of Kharkiv",
    "Новые дома": "Novi Budynky",
    Павлово: "Pavlove Pole",
    "Павлово Поле": "Pavlove Pole",
    Рогань: "Rohan",
    Бавария: "Bavaria",
    "ст. метро": "metro station",
  },
};

export function localizeTheme(theme: string, locale: Locale): string {
  return THEME_LABELS[locale][theme] || theme;
}

export function localizePlace(place: string, locale: Locale): string {
  if (locale === "kh") return place;
  return PLACE_LABELS[locale][place] || place;
}

const RUMOR_CLOSING_RE =
  /(?:\n\n)?\s*Так это помнят в городе — кто как слышал, кто как пересказал\. Проверить уже трудно, а слух живёт своей жизнью\.?\s*$/u;

function stripRumorClosing(body: string): string {
  return body.replace(RUMOR_CLOSING_RE, "").replace(/\s+$/u, "");
}

export function localizeLocal(
  legend: LocalLegend,
  locale: Locale,
): LocalLegend {
  if (locale === "kh") {
    return { ...legend, body: stripRumorClosing(legend.body) };
  }

  const entry = table[legend.slug]?.[locale];
  return {
    ...legend,
    title: entry?.title?.trim() || legend.title,
    body: stripRumorClosing(entry?.body?.trim() || legend.body),
    placeName:
      entry?.placeName?.trim() ||
      localizePlace(legend.placeName, locale) ||
      legend.placeName,
    themes: legend.themes.map((t) => localizeTheme(t, locale)),
  };
}

export function localizeLocals(
  legends: LocalLegend[],
  locale: Locale,
): LocalLegend[] {
  return legends.map((l) => localizeLocal(l, locale));
}
