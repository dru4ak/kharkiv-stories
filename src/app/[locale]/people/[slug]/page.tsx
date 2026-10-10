import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCard } from "@/components/StoryCard";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { localizePerson } from "@/data/people.i18n";
import { getPeople, getPersonBySlug, getStoriesForPerson } from "@/lib/people";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getPeople().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const person = getPersonBySlug(slug);
  if (!person) return { title: "Не найдено", robots: { index: false } };
  const locale = isLocale(raw) ? raw : "kh";
  const t = localizePerson(person.slug, locale, {
    name: person.name,
    role: person.role,
    summary: person.summary,
    body: person.body,
    imageCaption: person.imageCaption,
  });
  return buildPageMetadata({
    locale,
    path: `/people/${person.slug}`,
    title: t.name,
    description: t.summary,
    keywords: [t.name, t.role, ...(person.keywords ?? [])],
    image: person.imageUrl,
  });
}

export default async function PersonPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const person = getPersonBySlug(slug);
  if (!person) notFound();
  const related = getStoriesForPerson(person);
  const t = localizePerson(person.slug, locale, {
    name: person.name,
    role: person.role,
    summary: person.summary,
    body: person.body,
    imageCaption: person.imageCaption,
  });

  return (
    <article className="page py-14 sm:py-16">
      <Link
        href={localizedPath(locale, "/people")}
        className="text-[0.95rem] font-semibold text-[var(--brick)] hover:underline"
      >
        ← {dict.nav.people}
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <figure className="overflow-hidden border border-[var(--line)] shadow-[var(--shadow)]">
          <div className="relative aspect-[4/5]">
            <Image
              src={person.imageUrl}
              alt={t.imageCaption}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
          <figcaption className="bg-[var(--paper-elevated)] px-4 py-3 text-[0.85rem] text-[var(--muted)]">
            {t.imageCaption}
          </figcaption>
        </figure>

        <div>
          <p className="eyebrow">{dict.nav.people}</p>
          <h1 className="display mt-2 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
            {t.name}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {[person.years, t.role].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-6 space-y-4 text-[1.08rem] leading-8 text-[var(--ink-soft)]">
            {t.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="display text-3xl text-[var(--ink)]">
          {dict.nav.stories}
        </h2>
        <p className="mt-2 text-[var(--ink-soft)]">{related.length}</p>
        {related.length > 0 ? (
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 12).map((story) => (
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
