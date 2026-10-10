import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityCard } from "@/components/EntityCard";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { localizePerson } from "@/data/people.i18n";
import { getPeople, getStoriesForPerson } from "@/lib/people";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/people", page: "people" });
}

export default async function PeoplePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const list = getPeople();

  return (
    <div className="page py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.people}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.people.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] text-[var(--ink-soft)]">
        {dict.people.lead}
      </p>
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((person) => {
          const related = getStoriesForPerson(person).length;
          const t = localizePerson(person.slug, locale, {
            name: person.name,
            role: person.role,
            summary: person.summary,
            body: person.body,
            imageCaption: person.imageCaption,
          });
          return (
            <EntityCard
              key={person.id}
              href={localizedPath(locale, `/people/${person.slug}`)}
              title={t.name}
              subtitle={[person.years, t.role].filter(Boolean).join(" · ")}
              summary={`${t.summary} · ${related}`}
              imageUrl={person.imageUrl}
              imageAlt={t.imageCaption}
              badge={dict.nav.people}
            />
          );
        })}
      </div>
    </div>
  );
}
