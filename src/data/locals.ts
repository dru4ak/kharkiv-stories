import raw from "./locals.json";

export type LocalLegend = {
  id: string;
  slug: string;
  title: string;
  body: string;
  placeName: string;
  yearStart: number | null;
  yearEnd: number | null;
  era: string;
  themes: string[];
  sourceLabel: string;
};

export const localLegends = raw as LocalLegend[];

export const LOCAL_THEME_ORDER = [
  "подземелье",
  "храмы",
  "клады",
  "война",
  "спецслужбы",
  "советское",
  "мистика",
  "учёба",
  "городское",
] as const;

export function getLocalFilterOptions() {
  return {
    places: Array.from(new Set(localLegends.map((l) => l.placeName))).sort(
      (a, b) => a.localeCompare(b, "ru"),
    ),
    themes: LOCAL_THEME_ORDER.filter((t) =>
      localLegends.some((l) => l.themes.includes(t)),
    ),
    eras: Array.from(new Set(localLegends.map((l) => l.era))).sort((a, b) =>
      a.localeCompare(b, "ru"),
    ),
  };
}
