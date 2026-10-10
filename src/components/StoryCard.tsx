import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/data/stories";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";
import { localizeStory } from "@/lib/localizeStory";

export function StoryCard({
  story,
  locale = "kh",
  readLabel = "Читать →",
  typeLabel,
}: {
  story: Story;
  locale?: Locale;
  readLabel?: string;
  typeLabel?: string;
}) {
  const t = localizeStory(story, locale);

  return (
    <Link
      href={localizedPath(locale, `/stories/${story.slug}`)}
      className="group flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--paper-elevated)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--brick)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={story.illustrationUrl}
          alt={story.illustrationCaption}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(24,20,16,0.45)] via-transparent to-transparent opacity-80" />
        <span className="absolute left-3 top-3 bg-[var(--ink)]/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--paper-elevated)]">
          {typeLabel ?? story.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="text-[0.78rem] text-[var(--muted)]">
          {story.section ? `${story.section} · ` : ""}
          {story.era}
          {story.district ? ` · ${story.district}` : ""}
        </p>
        <h3 className="display text-[1.35rem] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--brick)]">
          {t.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          {t.summary}
        </p>
        <span className="mt-2 text-[0.85rem] font-semibold text-[var(--brick)] opacity-0 transition group-hover:opacity-100">
          {readLabel}
        </span>
      </div>
    </Link>
  );
}
