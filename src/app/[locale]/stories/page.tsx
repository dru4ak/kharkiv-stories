import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogClient } from "@/components/CatalogClient";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildPageMetadata } from "@/i18n/seo";
import { getFilterOptions, getPublishedStories } from "@/lib/stories";
import type { StoryType } from "@/data/stories";

export const instant = false;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/stories", page: "stories" });
}

export default async function StoriesPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const stories = getPublishedStories();
  const options = getFilterOptions();
  const initialType = options.types.includes(sp.type as StoryType)
    ? (sp.type as StoryType)
    : "все";

  return (
    <div className="page py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.stories}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.catalog.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[1.05rem] text-[var(--ink-soft)]">
        {dict.catalog.lead}
      </p>
      <div className="mt-10">
        <CatalogClient
          stories={stories}
          options={options}
          initialType={initialType}
          initialQuery={sp.q ?? ""}
          locale={locale}
          labels={{
            search: dict.catalog.search,
            all: dict.catalog.all,
            type: dict.catalog.type,
            district: dict.catalog.district,
            era: dict.catalog.era,
            person: dict.catalog.person,
            empty: dict.catalog.empty,
            read: dict.catalog.read,
            storyTypes: dict.storyTypes,
          }}
        />
      </div>
    </div>
  );
}
