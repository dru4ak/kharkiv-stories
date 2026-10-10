import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubmitForm } from "@/components/SubmitForm";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildPageMetadata } from "@/i18n/seo";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return buildPageMetadata({ locale: raw, path: "/submit", page: "submit" });
}

export default async function SubmitPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="page max-w-2xl py-14 sm:py-16">
      <p className="eyebrow">{dict.nav.submit}</p>
      <h1 className="display mt-3 text-[clamp(2rem,5vw,3.2rem)] text-[var(--ink)]">
        {dict.submit.title}
      </h1>
      <p className="mt-4 text-[1.05rem] text-[var(--ink-soft)]">
        {dict.submit.lead}
      </p>
      <div className="mt-10">
        <SubmitForm />
      </div>
    </div>
  );
}
