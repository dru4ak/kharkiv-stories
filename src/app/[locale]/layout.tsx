import { notFound } from "next/navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isLocale, localeHtmlLang, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const instant = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <div lang={localeHtmlLang[locale]} className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} />
      <ScrollToTop
        label={locale === "en" ? "Back to top" : locale === "uk" ? "Нагору" : "Наверх"}
      />
    </div>
  );
}
