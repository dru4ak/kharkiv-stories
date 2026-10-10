import Image from "next/image";
import Link from "next/link";

export function EntityCard({
  href,
  title,
  subtitle,
  summary,
  imageUrl,
  imageAlt,
  badge,
}: {
  href: string;
  title: string;
  subtitle?: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden border border-[var(--line)] bg-[var(--paper-elevated)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--brick)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--paper-deep)]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {badge && (
          <span className="absolute left-3 top-3 bg-[var(--ink)]/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--paper-elevated)]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {subtitle && (
          <p className="text-[0.78rem] text-[var(--muted)]">{subtitle}</p>
        )}
        <h3 className="display text-[1.3rem] leading-snug text-[var(--ink)] group-hover:text-[var(--brick)]">
          {title}
        </h3>
        <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          {summary}
        </p>
      </div>
    </Link>
  );
}
