export const locales = ["kh", "uk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "kh";

export const localeLabels: Record<Locale, string> = {
  kh: "Харьковский",
  uk: "Українська",
  en: "English",
};

export const localeHtmlLang: Record<Locale, string> = {
  kh: "ru",
  uk: "uk",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
