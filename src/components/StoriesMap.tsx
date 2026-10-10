"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Story } from "@/data/stories";
import {
  LAYER_GROUPS,
  MAP_LAYERS,
  PLAN_1887_BOUNDS,
  type MapLayerDef,
  type MapLayerId,
} from "@/data/mapLayers";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";

type LeafletMap = import("leaflet").Map;
type LeafletLayer = import("leaflet").Layer;

export function StoriesMap({
  stories,
  locale = "kh",
}: {
  stories: Story[];
  locale?: Locale;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const baseLayerRef = useRef<LeafletLayer | null>(null);
  const underlayRef = useRef<LeafletLayer | null>(null);
  const overlaysRef = useRef<LeafletLayer[]>([]);
  const filterDateRef = useRef<((d: string) => void) | null>(null);

  const [base, setBase] = useState<MapLayerId>("modern");
  const [year, setYear] = useState(1887);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const activeDef = useMemo(
    () => MAP_LAYERS.find((l) => l.id === base) ?? MAP_LAYERS[0]!,
    [base],
  );

  const yearsOnMap = useMemo(() => {
    const ys = stories
      .map((s) => s.yearStart)
      .filter((y): y is number => typeof y === "number");
    return ys.length ? ys : [1654, 1781, 1887, 1941];
  }, [stories]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!mapRef.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });

      map.fitBounds(PLAN_1887_BOUNDS, { padding: [16, 16] });

      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());

      const markers = L.layerGroup().addTo(map);

      const icon = L.divIcon({
        className: "kh-marker",
        html: `<span class="kh-pin"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      stories.forEach((story) => {
        if (story.lat == null || story.lng == null) return;
        const marker = L.marker([story.lat, story.lng], { icon });
        marker.bindPopup(
          `<div class="kh-popup"><strong>${escapeHtml(story.title)}</strong><br/><span>${escapeHtml(story.placeName ?? "")}</span><br/><a href="${localizedPath(locale, `/stories/${story.slug}`)}">→</a></div>`,
        );
        markers.addLayer(marker);
      });

      mapInstance.current = map;
      setReady(true);
    }

    boot();

    return () => {
      cancelled = true;
      filterDateRef.current = null;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [stories, locale]);

  useEffect(() => {
    if (!ready || !mapInstance.current) return;
    let cancelled = false;

    async function applyBase() {
      const map = mapInstance.current!;
      const L = await import("leaflet");
      setStatus(null);
      filterDateRef.current = null;

      if (baseLayerRef.current) {
        map.removeLayer(baseLayerRef.current);
        baseLayerRef.current = null;
      }
      if (underlayRef.current) {
        map.removeLayer(underlayRef.current);
        underlayRef.current = null;
      }
      for (const o of overlaysRef.current) {
        map.removeLayer(o);
      }
      overlaysRef.current = [];

      const pane = map.getPane("tilePane");
      if (pane) {
        pane.style.filter = activeDef.sepiaFilter
          ? "sepia(0.55) contrast(0.96) saturate(0.9)"
          : "";
      }

      if (activeDef.underlayOsm) {
        const under = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "&copy; OpenStreetMap",
            maxZoom: 19,
            opacity: 0.35,
          },
        );
        under.addTo(map);
        underlayRef.current = under;
      }

      if (activeDef.ohm) {
        try {
          setStatus("Загрузка OpenHistoricalMap…");
          const maplibreglMod = await import("maplibre-gl");
          const maplibregl =
            (maplibreglMod as { default?: unknown }).default ?? maplibreglMod;
          (window as unknown as { maplibregl: typeof maplibregl }).maplibregl =
            maplibregl;

          const leafletGl = await import("@maplibre/maplibre-gl-leaflet");
          const createGlLayer = leafletGl.maplibreGL ?? leafletGl.default;
          if (typeof createGlLayer !== "function") {
            throw new Error("maplibreGL factory missing");
          }

          const datesMod = (await import(
            "@openhistoricalmap/maplibre-gl-dates"
          )) as {
            filterByDate?: (map: unknown, date: string) => void;
            default?: { filterByDate: (map: unknown, date: string) => void };
          };
          const filterByDate =
            datesMod.filterByDate ?? datesMod.default?.filterByDate;

          if (cancelled || !mapInstance.current) return;

          const styleUrl =
            "https://unpkg.com/@openhistoricalmap/map-styles@latest/dist/historical/historical.json";

          const glLayer = createGlLayer({
            style: styleUrl,
            interactive: false,
          });
          glLayer.addTo(map);
          baseLayerRef.current = glLayer as unknown as LeafletLayer;

          const mlMap = glLayer.getMaplibreMap();
          const applyDate = () => {
            if (!filterByDate) return;
            try {
              filterByDate(mlMap, `${year}-06-01`);
            } catch {
              /* loading */
            }
          };
          filterDateRef.current = (d: string) => {
            if (filterByDate) filterByDate(mlMap, d);
          };
          if (mlMap.loaded()) applyDate();
          else mlMap.once("load", applyDate);
          mlMap.once("idle", () => {
            if (!cancelled) setStatus(null);
          });
        } catch (err) {
          console.error(err);
          setStatus("OHM недоступен — показан OSM.");
          const layer = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            { maxZoom: 19 },
          );
          layer.addTo(map);
          baseLayerRef.current = layer;
        }
        return;
      }

      if (activeDef.url) {
        const layer = L.tileLayer(activeDef.url, {
          attribution: activeDef.attribution,
          maxZoom: activeDef.maxZoom ?? 18,
          crossOrigin: true,
          errorTileUrl:
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        });
        layer.addTo(map);
        baseLayerRef.current = layer;
      }

      for (const ov of activeDef.overlays ?? []) {
        const img = L.imageOverlay(ov.url, ov.bounds, {
          opacity: ov.opacity ?? 0.7,
          interactive: false,
        });
        img.addTo(map);
        overlaysRef.current.push(img);
      }

    }

    applyBase();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, ready, activeDef]);

  useEffect(() => {
    if (!filterDateRef.current) return;
    if (!activeDef.yearSlider) return;
    filterDateRef.current(`${year}-06-01`);
  }, [year, activeDef.yearSlider]);

  return (
    <div>
      <div className="space-y-4 border-b border-[var(--line)] bg-[var(--paper-elevated)] p-4 sm:p-5">
        {LAYER_GROUPS.map((group) => {
          const layers = MAP_LAYERS.filter((l) => l.group === group.id);
          if (!layers.length) return null;
          return (
            <div key={group.id}>
              <p className="eyebrow">{group.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {layers.map((layer: MapLayerDef) => (
                  <button
                    key={layer.id}
                    type="button"
                    title={layer.hint}
                    onClick={() => setBase(layer.id)}
                    className={`min-h-10 px-3 py-2 text-[0.86rem] transition ${
                      base === layer.id
                        ? "bg-[var(--brick)] text-[var(--paper-elevated)]"
                        : "border border-[var(--line)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--brick)]"
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {activeDef.yearSlider && (
          <label className="block max-w-sm">
            <span className="eyebrow mb-2 block">Год на карте: {year}</span>
            <input
              type="range"
              min={1600}
              max={2000}
              step={1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full accent-[var(--brick)]"
            />
            <div className="mt-1 flex flex-wrap gap-2">
              {yearsOnMap.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className="text-[0.78rem] text-[var(--brick)] hover:underline"
                >
                  {y}
                </button>
              ))}
            </div>
          </label>
        )}
      </div>

      {status && (
        <div className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--ochre)_18%,var(--paper-elevated))] px-5 py-3 text-[0.9rem] text-[var(--ink-soft)]">
          {status}
        </div>
      )}

      <div ref={mapRef} className="kh-map h-[min(64vh,580px)] w-full" />

      <p className="border-t border-[var(--line)] bg-[var(--paper)] px-5 py-3 text-[0.82rem] text-[var(--muted)]">
        Маркеры — истории с привязкой к месту. Слои: современная карта, сепия,
        атлас и OpenHistoricalMap.
      </p>

      <ul className="grid max-h-64 gap-3 overflow-y-auto border-t border-[var(--line)] bg-[var(--paper-elevated)] p-5 sm:grid-cols-3">
        {stories.slice(0, 60).map((s) => (
          <li key={s.id}>
            <Link
              href={localizedPath(locale, `/stories/${s.slug}`)}
              className="font-semibold text-[var(--brick)] hover:underline"
            >
              {s.title}
            </Link>
            {s.placeName && (
              <p className="mt-0.5 text-[0.85rem] text-[var(--muted)]">
                {s.placeName}
                {s.yearStart ? ` · ${s.yearStart}` : ""}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
