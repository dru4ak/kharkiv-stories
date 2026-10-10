import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { localizePerson } from "@/data/people.i18n";
import { localizePlace } from "@/data/places.i18n";
import { getPeopleForStory } from "@/lib/people";
import { getPlacesForStory } from "@/lib/places";
import { localizeStory } from "@/lib/localizeStory";
import { getPublishedStories, getStoryBySlug } from "@/lib/stories";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata, storyJsonLd } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const instant = false;

export async function generateStaticParams() {
  const stories = getPublishedStories();
  return locales.flatMap((locale) =>
    stories.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "История не найдена", robots: { index: false } };
  const locale = isLocale(raw) ? raw : "kh";
  const t = localizeStory(story, locale);
  const keywords = [
    t.title,
    story.type,
    story.placeName,
    story.district,
    ...(story.tags ?? []),
    locale === "en" ? "Kharkiv" : locale === "uk" ? "Харків" : "Харьков",
  ].filter(Boolean) as string[];

  return buildPageMetadata({
    locale,
    path: `/stories/${story.slug}`,
    title: t.title,
    description: t.summary,
    keywords,
    image: story.illustrationUrl || null,
  });
}

export default async function StoryPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const story = getStoryBySlug(slug);
  if (!story) notFound();
  const t = localizeStory(story, locale);
  const relatedPeople = getPeopleForStory(story.slug);
  const relatedPlaces = getPlacesForStory(story.slug);

  return (
    <article className="page max-w-3xl py-14 sm:py-16">
      <JsonLd
        data={storyJsonLd({
          locale,
          title: t.title,
          description: t.summary,
          path: `/stories/${story.slug}`,
          image: story.illustrationUrl,
        })}
      />
      <Link
        href={localizedPath(locale, "/stories")}
        className="text-[0.95rem] font-semibold text-[var(--brick)] hover:underline"
      >
        {dict.story.back}
      </Link>

      <p className="eyebrow mt-8">
        {dict.storyTypes[story.type] ?? story.type}
        {story.section ? ` · ${story.section}` : ""}
        {story.yearStart ? ` · ${story.yearStart}` : ""}
        {story.yearEnd ? `–${story.yearEnd}` : ""}
        {story.district ? ` · ${story.district}` : ""}
      </p>
      <h1 className="display mt-3 text-[clamp(2.1rem,5vw,3.4rem)] text-[var(--ink)]">
        {t.title}
      </h1>

      <figure className="mt-8 overflow-hidden border border-[var(--line)] shadow-[var(--shadow)]">
        <div className="relative aspect-[4/3]">
          <Image
            src={story.illustrationUrl}
            alt={story.illustrationCaption}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
        <figcaption className="bg-[var(--paper-elevated)] px-4 py-3 text-[0.85rem] text-[var(--muted)]">
          {story.illustrationCaption}
        </figcaption>
      </figure>

      {(locale === "uk" || locale === "en") && !t.bodyLocalized && (
        <p className="mt-6 border border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-3 text-[0.9rem] text-[var(--ink-soft)]">
          {dict.story.originalNote}
        </p>
      )}

      <div className="mt-8 space-y-5 text-[1.1rem] leading-8 text-[var(--ink-soft)]">
        {t.body.split("\n\n").map((p, i) => (
          <p key={`${i}-${p.slice(0, 24)}`}>{p}</p>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="border border-[var(--line)] px-2.5 py-1 text-[0.8rem] text-[var(--muted)]"
          >
            #{tag}
          </span>
        ))}
      </div>

      {(relatedPeople.length > 0 || relatedPlaces.length > 0) && (
        <div className="mt-10 space-y-6 border-t border-[var(--line)] pt-6">
          {relatedPeople.length > 0 && (
            <div>
              <p className="eyebrow">{dict.story.relatedPeople}</p>
              <ul className="mt-2 flex flex-wrap gap-3">
                {relatedPeople.map((p) => {
                  const name = localizePerson(p.slug, locale, {
                    name: p.name,
                    role: p.role,
                    summary: p.summary,
                    body: p.body,
                    imageCaption: p.imageCaption,
                  }).name;
                  return (
                    <li key={p.id}>
                      <Link
                        href={localizedPath(locale, `/people/${p.slug}`)}
                        className="font-semibold text-[var(--brick)] hover:underline"
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {relatedPlaces.length > 0 && (
            <div>
              <p className="eyebrow">{dict.story.relatedPlaces}</p>
              <ul className="mt-2 flex flex-wrap gap-3">
                {relatedPlaces.map((p) => {
                  const name = localizePlace(p.slug, locale, {
                    name: p.name,
                    district: p.district,
                    summary: p.summary,
                    body: p.body,
                    imageCaption: p.imageCaption,
                  }).name;
                  return (
                    <li key={p.id}>
                      <Link
                        href={localizedPath(locale, `/places/${p.slug}`)}
                        className="font-semibold text-[var(--brick)] hover:underline"
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-10 border-t border-[var(--line)] pt-5 text-[0.92rem] text-[var(--muted)]">
        {dict.footer.text}
      </p>
    </article>
  );
}
