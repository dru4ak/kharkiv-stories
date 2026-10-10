import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroCounters } from "@/components/HeroCounters";
import { InterestingFact } from "@/components/InterestingFact";
import { JsonLd } from "@/components/JsonLd";
import { RandomStories } from "@/components/RandomStories";
import { localLegends } from "@/data/locals";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/path";
import { buildPageMetadata, siteJsonLd } from "@/i18n/seo";
import {
  getPublishedStories,
  getRandomStories,
  getTotalStoryCount,
} from "@/lib/stories";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/", page: "home" });
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const stories = getPublishedStories();
  const initialRandom = getRandomStories(4);
  const total = getTotalStoryCount();

  return (
    <div>
      <JsonLd data={siteJsonLd(locale)} />
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <Image
          src="/illustrations/hero-kharkiv-real.jpg"
          alt={dict.home.title}
          fill
          priority
          className="animate-fade object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(24,20,16,0.88)_0%,rgba(24,20,16,0.55)_42%,rgba(24,20,16,0.2)_70%,rgba(24,20,16,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--paper)] to-transparent" />

        <div className="page relative flex min-h-[88vh] flex-col justify-center py-24">
          <p className="animate-rise eyebrow text-[var(--ochre)]">
            {dict.home.eyebrow}
          </p>
          <div className="animate-rise-2 mt-5 flex items-center gap-4 sm:gap-6">
            <Image
              src="/illustrations/gerb-kharkiv-1781.png"
              alt=""
              width={112}
              height={112}
              className="h-[4.5rem] w-[4.5rem] shrink-0 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:h-[5.5rem] sm:w-[5.5rem] md:h-28 md:w-28"
              priority
            />
            <h1 className="display max-w-[12ch] text-[clamp(2.4rem,6.5vw,5rem)] leading-[1.05] text-[var(--paper-elevated)]">
              {dict.home.title}
            </h1>
          </div>
          <p className="animate-rise-3 mt-6 max-w-xl text-[1.1rem] leading-relaxed text-[color-mix(in_oklab,var(--paper-elevated)_88%,transparent)]">
            {dict.home.lead}
          </p>

          <HeroCounters
            total={total}
            rumorsTotal={localLegends.length}
            locale={locale}
            storiesLabel={dict.home.storiesOnSite}
            rumorsLabel={dict.home.rumorsOnSite}
          />

          <div className="animate-rise-3 mt-8 flex flex-wrap gap-3">
            <Link
              href={localizedPath(locale, "/stories")}
              className="btn btn-primary"
            >
              {dict.home.catalog}
            </Link>
            <Link
              href={localizedPath(locale, "/people")}
              className="btn btn-ghost"
            >
              {dict.home.people}
            </Link>
            <Link
              href={localizedPath(locale, "/places")}
              className="btn btn-ghost"
            >
              {dict.home.places}
            </Link>
          </div>
        </div>
      </section>

      <section className="page py-16 sm:py-20">
        <InterestingFact
          locale={locale}
          eyebrow={dict.home.factEyebrow}
          prompt={dict.home.factPrompt}
          moreLabel={dict.home.factMore}
          nextLabel={dict.home.factNext}
        />
        <div className="ornament mb-10 mt-12">
          <span className="ornament-mark">✦</span>
        </div>
        <RandomStories
          stories={stories}
          initial={initialRandom}
          count={4}
          locale={locale}
          title={dict.home.randomTitle}
          readLabel={dict.catalog.read}
        />
        <div className="mt-10 text-center">
          <Link
            href={localizedPath(locale, "/stories")}
            className="text-[0.95rem] font-semibold text-[var(--brick)] transition hover:text-[var(--brick-hot)]"
          >
            {dict.home.seeAll.replace("{n}", String(total))}
          </Link>
        </div>
      </section>
    </div>
  );
}
