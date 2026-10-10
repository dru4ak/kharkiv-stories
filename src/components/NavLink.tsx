"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { stripLocale } from "@/i18n/path";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname() || "/";
  const bare = stripLocale(pathname);
  const targetBare = stripLocale(href);
  const active =
    targetBare === "/"
      ? bare === "/"
      : bare === targetBare || bare.startsWith(`${targetBare}/`);

  return (
    <Link
      href={href}
      className={`relative py-1 transition-colors ${
        active
          ? "text-[var(--brick)]"
          : "text-[var(--ink-soft)] hover:text-[var(--brick)]"
      }`}
    >
      {children}
      <span
        className={`absolute inset-x-0 -bottom-1 h-[2px] origin-left bg-[var(--brick)] transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}
