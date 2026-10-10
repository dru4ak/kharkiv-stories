import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-auto border-t border-[var(--soot)] bg-[var(--soot)] text-[var(--paper-elevated)]">
      <div className="page flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-[var(--ochre)]">{dict.footer.memory}</p>
          <p className="display mt-2 text-2xl sm:text-3xl">Савелий Цыпин</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[color-mix(in_oklab,var(--paper-elevated)_78%,transparent)]">
            {dict.footer.text}
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <Link
            href={localizedPath(locale, "/people")}
            className="hover:text-[var(--ochre)]"
          >
            {dict.nav.people}
          </Link>
          <Link
            href={localizedPath(locale, "/places")}
            className="hover:text-[var(--ochre)]"
          >
            {dict.nav.places}
          </Link>
          <Link
            href={localizedPath(locale, "/about")}
            className="hover:text-[var(--ochre)]"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={localizedPath(locale, "/submit")}
            className="hover:text-[var(--ochre)]"
          >
            {dict.nav.submit}
          </Link>
        </div>
      </div>
    </footer>
  );
}
