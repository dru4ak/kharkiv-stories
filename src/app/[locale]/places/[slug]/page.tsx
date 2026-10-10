import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCard } from "@/components/StoryCard";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { localizePlace } from "@/data/places.i18n";
import { getPlaceBySlug, getPlaces, getStoriesForPlace } from "@/lib/places";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getPlaces().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const place = getPlaceBySlug(slug);
  if (!place) return { title: "Не найдено", robots: { index: false } };
  const locale = isLocale(raw) ? raw : "kh";
  const t = localizePlace(place.slug, locale, {
    name: place.name,
    district: place.district,
    summary: place.summary,
    body: place.body,
    imageCaption: place.imageCaption,
  });
  return buildPageMetadata({
    locale,
    path: `/places/${place.slug}`,
    title: t.name,
    description: t.summary,
    keywords: [t.name, t.district, ...(place.keywords ?? [])].filter(
      Boolean,
    ) as string[],
    image: place.imageUrl,
  });
}

export default async function PlacePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const place = getPlaceBySlug(slug);
  if (!place) notFound();
  const related = getStoriesForPlace(place);
  const t = localizePlace(place.slug, locale, {
    name: place.name,
    district: place.district,
    summary: place.summary,
    body: place.body,
    imageCaption: place.imageCaption,
  });

  return (
    <article className="page py-14 sm:py-16">
      <Link
        href={localizedPath(locale, "/places")}
        className="text-[0.95rem] font-semibold text-[var(--brick)] hover:underline"
      >
        ← {dict.nav.places}
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <figure className="overflow-hidden border border-[var(--line)] shadow-[var(--shadow)]">
          <div className="relative aspect-[4/3]">
            <Image
              src={place.imageUrl}
              alt={t.imageCaption}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <figcaption className="bg-[var(--paper-elevated)] px-4 py-3 text-[0.85rem] text-[var(--muted)]">
            {t.imageCaption}
          </figcaption>
        </figure>

        <div>
          <p className="eyebrow">{dict.nav.places}</p>
          <h1 className="display mt-2 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
            {t.name}
          </h1>
          {t.district && (
            <p className="mt-2 text-[var(--muted)]">{t.district}</p>
          )}
          <div className="mt-6 space-y-4 text-[1.08rem] leading-8 text-[var(--ink-soft)]">
            {t.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <Link
            href={localizedPath(locale, "/map")}
            className="btn btn-ink mt-8"
          >
            {dict.nav.map}
          </Link>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="display text-3xl text-[var(--ink)]">
          {dict.nav.stories}
        </h2>
        <p className="mt-2 text-[var(--ink-soft)]">{related.length}</p>
        {related.length > 0 ? (
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 18).map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                locale={locale}
                readLabel={dict.catalog.read}
              />
            ))}
          </div>
        ) : null}
      </section>
    </article>
  );
}
