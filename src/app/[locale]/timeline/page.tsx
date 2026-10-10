import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { localizeStory } from "@/lib/localizeStory";
import { getTimelineStories } from "@/lib/stories";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/timeline", page: "timeline" });
}

export default async function TimelinePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const stories = getTimelineStories();

  return (
    <div className="page max-w-3xl py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.timeline}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.timeline.title}
      </h1>
      <p className="mt-4 text-[1.05rem] text-[var(--ink-soft)]">
        {dict.timeline.lead}
      </p>

      <ol className="relative mt-12 space-y-10 border-l-2 border-[var(--line-strong)] pl-8">
        {stories.map((story) => {
          const t = localizeStory(story, locale);
          return (
            <li key={story.id} className="relative">
              <span className="absolute -left-[2.15rem] top-1.5 h-3.5 w-3.5 rounded-full bg-[var(--brick)] ring-[5px] ring-[var(--paper)]" />
              <p className="eyebrow">
                {story.yearStart}
                {story.yearEnd ? `–${story.yearEnd}` : ""} · {story.era}
              </p>
              <Link
                href={localizedPath(locale, `/stories/${story.slug}`)}
                className="display mt-2 block text-[1.7rem] text-[var(--ink)] transition hover:text-[var(--brick)]"
              >
                {t.title}
              </Link>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
                {t.summary}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
