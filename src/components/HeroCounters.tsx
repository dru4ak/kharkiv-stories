"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";

export function HeroCounters({
  total,
  rumorsTotal = 0,
  locale = "kh",
  storiesLabel = "историй, былин\nи топонимов",
  rumorsLabel = "слухов, баек\nи легенд",
}: {
  total: number;
  rumorsTotal?: number;
  locale?: Locale;
  storiesLabel?: string;
  rumorsLabel?: string;
}) {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayRumors, setDisplayRumors] = useState(0);
  const [active, setActive] = useState<"stories" | "rumors">("stories");

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayTotal(Math.round(total * ease));
      setDisplayRumors(Math.round(rumorsTotal * ease));
      if (p < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total, rumorsTotal]);

  const [storiesLine1, storiesLine2] = storiesLabel.split("\n");
  const [rumorsLine1, rumorsLine2] = rumorsLabel.split("\n");

  const cardClass = (on: boolean) =>
    `group inline-flex items-end gap-3 border px-4 py-3 transition ${
      on
        ? "border-[var(--ochre)] bg-[rgba(24,20,16,0.55)]"
        : "border-[color-mix(in_oklab,var(--paper-elevated)_35%,transparent)] bg-[rgba(24,20,16,0.35)] hover:border-[var(--ochre)]"
    }`;

  return (
    <div className="animate-rise-3 mt-10 flex max-w-3xl flex-wrap gap-2 sm:gap-3">
      <Link
        href={localizedPath(locale, "/stories")}
        onMouseEnter={() => setActive("stories")}
        onFocus={() => setActive("stories")}
        className={cardClass(active === "stories")}
      >
        <span className="display text-4xl leading-none text-[var(--paper-elevated)] sm:text-5xl">
          {displayTotal}
        </span>
        <span className="pb-1 text-left text-[0.85rem] uppercase tracking-[0.14em] text-[var(--ochre)]">
          {storiesLine1}
          {storiesLine2 ? (
            <>
              <br />
              {storiesLine2}
            </>
          ) : null}
        </span>
      </Link>

      <Link
        href={localizedPath(locale, "/rumors")}
        onMouseEnter={() => setActive("rumors")}
        onFocus={() => setActive("rumors")}
        className={cardClass(active === "rumors")}
      >
        <span className="display text-4xl leading-none text-[var(--paper-elevated)] sm:text-5xl">
          {displayRumors}
        </span>
        <span className="pb-1 text-left text-[0.85rem] uppercase tracking-[0.14em] text-[var(--ochre)]">
          {rumorsLine1}
          {rumorsLine2 ? (
            <>
              <br />
              {rumorsLine2}
            </>
          ) : null}
        </span>
      </Link>
    </div>
  );
}
