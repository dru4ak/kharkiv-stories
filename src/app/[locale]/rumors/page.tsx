import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RumorSubmitForm } from "@/components/RumorSubmitForm";
import { RumorsBoard } from "@/components/RumorsBoard";
import { getLocalFilterOptions, localLegends } from "@/data/locals";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildPageMetadata } from "@/i18n/seo";
import {
  localizeLocals,
  localizePlace,
  localizeTheme,
} from "@/lib/localizeLocal";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/rumors", page: "rumors" });
}

export default async function RumorsPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const options = getLocalFilterOptions();
  const legends = localizeLocals(localLegends, locale);
  const places = options.places.map((p) => localizePlace(p, locale));
  const themes = options.themes.map((t) => localizeTheme(t, locale));

  return (
    <div className="page max-w-3xl py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.rumors}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.rumors.title}
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--ink-soft)]">
        {dict.rumors.lead}
      </p>
      <p className="mt-3 text-[0.92rem] text-[var(--muted)]">
        {dict.rumors.hint}
      </p>

      <div className="mt-10">
        <RumorsBoard
          legends={legends}
          places={places}
          themes={themes}
          locale={locale}
          labels={{
            search: dict.rumors.search,
            all: dict.rumors.all,
            place: dict.rumors.place,
            theme: dict.rumors.theme,
            sort: dict.rumors.sort,
            sortRating: dict.rumors.sortRating,
            sortLikes: dict.rumors.sortLikes,
            sortTitle: dict.rumors.sortTitle,
            sortPlace: dict.rumors.sortPlace,
            sortYear: dict.rumors.sortYear,
            empty: dict.rumors.empty,
            like: dict.rumors.like,
            dislike: dict.rumors.dislike,
            score: dict.rumors.score,
            count: dict.rumors.count,
            epigraph: dict.rumors.epigraph,
            listen: dict.story.listen,
            stop: dict.story.stop,
            listenLoading: dict.story.listenLoading,
            listenFallback: dict.story.listenFallback,
            voice: dict.story.voice,
            voiceFemale: dict.story.voiceFemale,
            voiceMale: dict.story.voiceMale,
            rate: dict.story.rate,
            rateSlow: dict.story.rateSlow,
            rateNormal: dict.story.rateNormal,
            rateFast: dict.story.rateFast,
            autoNext: dict.story.autoNext,
          }}
        />
      </div>

      <div className="ornament my-14">
        <span className="ornament-mark">✦</span>
      </div>

      <RumorSubmitForm
        themes={options.themes}
        labels={{
          title: dict.rumors.formTitle,
          lead: dict.rumors.formLead,
          fieldTitle: dict.rumors.fieldTitle,
          fieldTitlePh: dict.rumors.fieldTitlePh,
          fieldPlace: dict.rumors.fieldPlace,
          fieldPlacePh: dict.rumors.fieldPlacePh,
          fieldYear: dict.rumors.fieldYear,
          fieldYearPh: dict.rumors.fieldYearPh,
          fieldTheme: dict.rumors.fieldTheme,
          fieldThemeOther: dict.rumors.fieldThemeOther,
          fieldBody: dict.rumors.fieldBody,
          fieldBodyPh: dict.rumors.fieldBodyPh,
          fieldName: dict.rumors.fieldName,
          fieldNamePh: dict.rumors.fieldNamePh,
          send: dict.rumors.send,
          thanksTitle: dict.rumors.thanksTitle,
          thanksText: dict.rumors.thanksText,
        }}
      />
    </div>
  );
}
