"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  cellFromImagePoint,
  cellRectPercent,
  featuresAtGrid,
  type PlanGridRef,
} from "@/lib/plan1887";

type Tip = {
  grid: PlanGridRef;
  streets: string[];
  buildings: string[];
  x: number;
  y: number;
};

export function PlanInteractiveMap({
  title = "План 1887 — наведите на квартал",
  hint = "Названия улиц и зданий из указателей плана появляются при наведении мыши.",
}: {
  title?: string;
  hint?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const grid = cellFromImagePoint(x, y, rect.width, rect.height);
    if (!grid) {
      setTip(null);
      return;
    }
    const { streets, buildings } = featuresAtGrid(grid.key);
    if (!streets.length && !buildings.length) {
      setTip({
        grid,
        streets: [],
        buildings: [],
        x,
        y,
      });
      return;
    }
    setTip({
      grid,
      streets: streets.map((s) => s.name),
      buildings: buildings.map((b) => `${b.num}. ${b.name}`),
      x,
      y,
    });
  }, []);

  const onLeave = useCallback(() => setTip(null), []);

  const highlight = useMemo(() => {
    if (!tip) return null;
    return cellRectPercent(tip.grid.col, tip.grid.row);
  }, [tip]);

  const hasNames = Boolean(tip && (tip.streets.length || tip.buildings.length));

  return (
    <div className="overflow-hidden border border-[var(--line)] bg-[var(--paper-elevated)] shadow-[var(--shadow)]">
      <div className="border-b border-[var(--line)] px-4 py-3 sm:px-5">
        <p className="eyebrow text-[var(--ochre)]">{title}</p>
        <p className="mt-1 text-[0.92rem] text-[var(--muted)]">{hint}</p>
      </div>

      <div
        ref={wrapRef}
        className="relative cursor-crosshair select-none touch-none"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/maps/plan-kharkiv-1887.jpg"
          alt="План города Харькова 1887 года"
          className="block h-auto w-full"
          draggable={false}
        />

        {highlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute border-2 border-[var(--brick)] bg-[color-mix(in_oklab,var(--ochre)_28%,transparent)] transition-[left,top] duration-75"
            style={highlight}
          />
        )}

        {tip && (
          <div
            className="pointer-events-none absolute z-10 max-w-[min(20rem,70%)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--paper-elevated)_94%,transparent)] px-3 py-2 shadow-[var(--shadow)] backdrop-blur-sm"
            style={{
              left: Math.min(tip.x + 14, (wrapRef.current?.clientWidth ?? 400) - 220),
              top: Math.max(8, tip.y - 12),
            }}
          >
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ochre)]">
              Квадрат {tip.grid.key}
            </p>
            {hasNames ? (
              <div className="mt-1.5 space-y-2 text-[0.9rem] leading-snug text-[var(--ink)]">
                {tip.buildings.length > 0 && (
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Здания
                    </p>
                    <ul className="mt-0.5">
                      {tip.buildings.slice(0, 8).map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                      {tip.buildings.length > 8 ? (
                        <li className="text-[var(--muted)]">
                          + ещё {tip.buildings.length - 8}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                )}
                {tip.streets.length > 0 && (
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Улицы
                    </p>
                    <ul className="mt-0.5">
                      {tip.streets.slice(0, 10).map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                      {tip.streets.length > 10 ? (
                        <li className="text-[var(--muted)]">
                          + ещё {tip.streets.length - 10}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1 text-[0.88rem] text-[var(--ink-soft)]">
                В указателе для этой клетки нет записей
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
