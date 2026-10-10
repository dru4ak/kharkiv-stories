import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata } from "@/i18n/seo";
import { getTotalStoryCount, getStoryCountsByType } from "@/lib/stories";
import type { StoryType } from "@/data/stories";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/about", page: "about" });
}

const ORDER: StoryType[] = [
  "байка",
  "легенда",
  "анекдот",
  "слух",
  "топоним",
];

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const total = getTotalStoryCount();
  const counts = getStoryCountsByType();

  return (
    <div className="page max-w-3xl py-14 sm:py-16">
      <p className="eyebrow">{dict.about.title}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.about.heading}
      </h1>
      <div className="mt-8 space-y-5 text-[1.08rem] leading-8 text-[var(--ink-soft)]">
        <p>{dict.about.p1}</p>
        <p>{dict.about.p2}</p>
        <p>
          {dict.about.p3prefix} {total}:
          {ORDER.map(
            (t) => ` ${dict.storyTypes[t].toLowerCase()} — ${counts[t]}`,
          ).join(";")}
          .
        </p>
      </div>
      <Link
        href={localizedPath(locale, "/submit")}
        className="btn btn-primary mt-10"
      >
        {dict.about.cta}
      </Link>
    </div>
  );
}
