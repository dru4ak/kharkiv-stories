import buildingsRaw from "@/data/plan1887-buildings.json";
import streetsRaw from "@/data/plan1887-streets.json";
import { PLAN_1887_BOUNDS } from "@/data/mapLayers";

export type PlanGridRef = {
  col: number; // 1..13
  row: number; // 1..9 (I=1 .. IX=9)
  key: string; // "8-IV"
};

export type PlanStreet = { name: string; grids: string[] };
export type PlanBuilding = { num: number; name: string; grids: string[] };

export const planStreets = streetsRaw as PlanStreet[];
export const planBuildings = buildingsRaw as PlanBuilding[];

const ROMAN: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
};

const ROMAN_BY_NUM = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
] as const;

export function parseGridKey(key: string): PlanGridRef | null {
  const m = key.trim().toUpperCase().match(/^(\d{1,2})\s*[-–—]\s*([IVX]+)$/);
  if (!m) return null;
  const col = Number(m[1]);
  const row = ROMAN[m[2]!];
  if (!col || col < 1 || col > 13 || !row) return null;
  return { col, row, key: `${col}-${ROMAN_BY_NUM[row]}` };
}

export function gridKey(col: number, row: number): string {
  return `${col}-${ROMAN_BY_NUM[row] ?? "?"}`;
}

/** Доля кадра: поле с самой картой внутри рамки (без заголовка/цифр сетки). */
export const PLAN_IMAGE_INSET = {
  left: 0.035,
  right: 0.035,
  top: 0.085,
  bottom: 0.055,
} as const;

export function cellFromImagePoint(
  x: number,
  y: number,
  width: number,
  height: number,
): PlanGridRef | null {
  const { left, right, top, bottom } = PLAN_IMAGE_INSET;
  const mapLeft = width * left;
  const mapRight = width * (1 - right);
  const mapTop = height * top;
  const mapBottom = height * (1 - bottom);
  if (x < mapLeft || x > mapRight || y < mapTop || y > mapBottom) return null;

  const relX = (x - mapLeft) / (mapRight - mapLeft);
  const relY = (y - mapTop) / (mapBottom - mapTop);
  const col = Math.min(13, Math.max(1, Math.floor(relX * 13) + 1));
  // I сверху (север), IX снизу
  const row = Math.min(9, Math.max(1, Math.floor(relY * 9) + 1));
  return { col, row, key: gridKey(col, row) };
}

export function cellRectPercent(col: number, row: number): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  const { left, right, top, bottom } = PLAN_IMAGE_INSET;
  const mapW = 1 - left - right;
  const mapH = 1 - top - bottom;
  const cellW = mapW / 13;
  const cellH = mapH / 9;
  return {
    left: `${(left + (col - 1) * cellW) * 100}%`,
    top: `${(top + (row - 1) * cellH) * 100}%`,
    width: `${cellW * 100}%`,
    height: `${cellH * 100}%`,
  };
}

export function featuresAtGrid(key: string): {
  streets: PlanStreet[];
  buildings: PlanBuilding[];
} {
  const streets = planStreets.filter((s) => s.grids.includes(key));
  const buildings = planBuildings.filter((b) => b.grids.includes(key));
  return { streets, buildings };
}

/** Центр клетки в lat/lng (для Leaflet, если понадобится). */
export function cellCenterLatLng(col: number, row: number): [number, number] {
  const [[south, west], [north, east]] = PLAN_1887_BOUNDS;
  const cellW = (east - west) / 13;
  const cellH = (north - south) / 9;
  const lng = west + (col - 0.5) * cellW;
  const lat = north - (row - 0.5) * cellH;
  return [lat, lng];
}
