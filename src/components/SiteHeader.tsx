import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavLink } from "@/components/NavLink";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = [
    { href: "/stories", label: dict.nav.stories },
    { href: "/rumors", label: dict.nav.rumors },
    { href: "/people", label: dict.nav.people },
    { href: "/places", label: dict.nav.places },
    { href: "/map", label: dict.nav.map },
    { href: "/timeline", label: dict.nav.timeline },
    { href: "/submit", label: dict.nav.submit },
    { href: "/about", label: dict.nav.about },
  ];

  return (
    <header className="relative z-40 border-b border-[var(--line)]/80 bg-[color-mix(in_oklab,var(--paper)_92%,transparent)]">
      <div className="page flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href={localizedPath(locale, "/")} className="group min-w-0 shrink">
          <span className="display block text-[1.15rem] text-[var(--ink)] sm:text-[1.35rem]">
            {dict.brand}
          </span>
          <span className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors group-hover:text-[var(--brick)]">
            {dict.brandSub}
          </span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3">
          <LanguageSwitcher />
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-[0.92rem] font-medium">
            {links.map((link) => (
              <NavLink key={link.href} href={localizedPath(locale, link.href)}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
