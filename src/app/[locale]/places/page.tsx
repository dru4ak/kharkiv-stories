import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/EntityCard";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { localizePlace } from "@/data/places.i18n";
import { getPlaces, getStoriesForPlace } from "@/lib/places";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/places", page: "places" });
}

export default async function PlacesPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const list = getPlaces();

  return (
    <div className="page py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.places}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.places.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] text-[var(--ink-soft)]">
        {dict.places.lead}
      </p>
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((place) => {
          const related = getStoriesForPlace(place).length;
          const t = localizePlace(place.slug, locale, {
            name: place.name,
            district: place.district,
            summary: place.summary,
            body: place.body,
            imageCaption: place.imageCaption,
          });
          return (
            <EntityCard
              key={place.id}
              href={localizedPath(locale, `/places/${place.slug}`)}
              title={t.name}
              subtitle={t.district}
              summary={`${t.summary} · ${related}`}
              imageUrl={place.imageUrl}
              imageAlt={t.imageCaption}
              badge={dict.nav.places}
            />
          );
        })}
      </div>
    </div>
  );
}
