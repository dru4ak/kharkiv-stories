"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { localeFromPath, localizedPath, stripLocale } from "@/i18n/path";

export function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const current = localeFromPath(pathname);
  const bare = stripLocale(pathname);

  return (
    <div
      className="flex items-center gap-1 rounded-sm border border-[var(--line)] bg-[var(--paper-elevated)] p-0.5 text-[0.8rem] font-semibold tracking-[0.02em]"
      role="navigation"
      aria-label="Language"
    >
      {locales.map((locale: Locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={localizedPath(locale, bare)}
            hrefLang={locale === "kh" ? "ru" : locale}
            className={`whitespace-nowrap px-2.5 py-1.5 transition ${
              active
                ? "bg-[var(--ink)] text-[var(--paper-elevated)]"
                : "text-[var(--muted)] hover:text-[var(--brick)]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
