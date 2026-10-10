/** Слои карты историй: современная основа и сравнения (план 1887 — отдельно выше). */

export type MapLayerId = "modern" | "sepia" | "atlas" | "ohm";

export type MapLayerDef = {
  id: MapLayerId;
  label: string;
  hint: string;
  group: "base";
  url?: string;
  maxZoom?: number;
  attribution?: string;
  ohm?: "historical" | "woodblock";
  sepiaFilter?: boolean;
  yearSlider?: boolean;
  overlays?: {
    url: string;
    bounds: [[number, number], [number, number]];
    opacity?: number;
  }[];
  underlayOsm?: boolean;
};

/** Привязка плана 1887 к координатам (приблизительно по окраинам карты). */
export const PLAN_1887_BOUNDS: [[number, number], [number, number]] = [
  [49.973, 36.186],
  [50.027, 36.276],
];

export const MAP_LAYERS: MapLayerDef[] = [
  {
    id: "modern",
    label: "Современная",
    hint: "OpenStreetMap",
    group: "base",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  },
  {
    id: "sepia",
    label: "Сепия",
    hint: "OSM + винтажный фильтр",
    group: "base",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
    sepiaFilter: true,
  },
  {
    id: "atlas",
    label: "Атлас",
    hint: "Humanitarian OSM",
    group: "base",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap, HOT",
  },
  {
    id: "ohm",
    label: "OHM",
    hint: "OpenHistoricalMap + год",
    group: "base",
    ohm: "historical",
    yearSlider: true,
    attribution: "&copy; OpenHistoricalMap",
  },
];

export const LAYER_GROUPS: { id: MapLayerDef["group"]; title: string }[] = [
  { id: "base", title: "Основа" },
];
