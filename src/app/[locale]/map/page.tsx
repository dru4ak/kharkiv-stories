import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlanInteractiveMap } from "@/components/PlanInteractiveMap";
import { StoriesMap } from "@/components/StoriesMap";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildPageMetadata } from "@/i18n/seo";
import { getStoriesForMap } from "@/lib/stories";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/map", page: "map" });
}

export default async function MapPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const stories = getStoriesForMap();

  const planTitle =
    locale === "en"
      ? "1887 plan — hover a square"
      : locale === "uk"
        ? "План 1887 — наведіть на квадрат"
        : "План 1887 — наведите на квартал";

  const planHint =
    locale === "en"
      ? "Street and building names from the plan’s indexes appear on hover."
      : locale === "uk"
        ? "Назви вулиць і будівель з покажчиків плану з’являються при наведенні."
        : "Названия улиц и зданий из указателей плана появляются при наведении мыши.";

  return (
    <div className="page py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.map}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.map.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] text-[var(--ink-soft)]">
        {dict.map.lead}
      </p>

      <div className="mt-10">
        <PlanInteractiveMap title={planTitle} hint={planHint} />
      </div>

      <div className="mt-14">
        <h2 className="display text-[clamp(1.4rem,3vw,2rem)] text-[var(--ink)]">
          {locale === "en"
            ? "Stories on the map"
            : locale === "uk"
              ? "Байки на мапі"
              : "Байки на карте"}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.95rem] text-[var(--muted)]">
          {dict.map.note} · {stories.length}
        </p>
        <div className="mt-6 overflow-hidden border border-[var(--line)] shadow-[var(--shadow)]">
          <StoriesMap stories={stories} locale={locale} />
        </div>
      </div>

      <aside className="mt-8 max-w-3xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
        <p className="eyebrow text-[var(--ochre)]">{dict.map.apiTitle}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>
              {locale === "en"
                ? "Interactive 1887 plan"
                : locale === "uk"
                  ? "Інтерактивний план 1887"
                  : "Интерактивный план 1887"}
            </strong>{" "}
            —{" "}
            {locale === "en"
              ? "hover a grid cell to see streets and buildings from the alphabetical index and the 1887 structures list."
              : locale === "uk"
                ? "наведення на клітинку сітки показує вулиці й будівлі з алфавітного покажчика та списку споруд 1887 року."
                : "наведение на клетку сетки показывает улицы и здания из алфавитного указателя и списка сооружений 1887 года."}
          </li>
          <li>
            <strong>
              {locale === "en"
                ? "Modern / sepia / atlas / OHM"
                : "Современная / сепия / атлас / OHM"}
            </strong>{" "}
            —{" "}
            {locale === "en"
              ? "layers for comparing today’s city and OpenHistoricalMap, with story markers."
              : locale === "uk"
                ? "шари для порівняння з сучасним містом і OpenHistoricalMap, з маркерами історій."
                : "слои для сравнения с сегодняшним городом и OpenHistoricalMap, с маркерами историй."}
          </li>
        </ul>
      </aside>
    </div>
  );
}
