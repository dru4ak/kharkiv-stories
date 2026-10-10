"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getFactText,
  shuffleFacts,
  type FunFact,
} from "@/data/fun-facts";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";

export function InterestingFact({
  locale,
  eyebrow,
  prompt,
  moreLabel,
  nextLabel,
}: {
  locale: Locale;
  eyebrow: string;
  prompt: string;
  moreLabel: string;
  nextLabel: string;
}) {
  const [fact, setFact] = useState<FunFact | null>(null);
  const [visible, setVisible] = useState(false);
  const deckRef = useRef<FunFact[]>([]);
  const factRef = useRef<FunFact | null>(null);

  useEffect(() => {
    const shuffled = shuffleFacts();
    const first = shuffled[0] ?? null;
    deckRef.current = shuffled.slice(1);
    factRef.current = first;
    setFact(first);
    setVisible(true);
  }, []);

  function next() {
    setVisible(false);
    window.setTimeout(() => {
      let remaining = deckRef.current;
      let nextFact = remaining[0];

      if (!nextFact) {
        remaining = shuffleFacts(factRef.current?.id);
        nextFact = remaining[0];
        remaining = remaining.slice(1);
      } else {
        remaining = remaining.slice(1);
      }

      deckRef.current = remaining;
      if (nextFact) {
        factRef.current = nextFact;
        setFact(nextFact);
      }
      setVisible(true);
    }, 180);
  }

  const text = fact ? getFactText(fact, locale) : "\u00a0";

  return (
    <aside className="relative overflow-hidden border border-[var(--line)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--ochre)_12%,var(--paper-elevated))_0%,var(--paper-elevated)_55%,color-mix(in_oklab,var(--brick)_8%,var(--paper-elevated))_100%)] px-5 py-6 sm:px-8 sm:py-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[color-mix(in_oklab,var(--ochre)_18%,transparent)] blur-2xl"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[var(--ochre)]">{eyebrow}</p>
          <p className="display mt-2 text-[clamp(1.45rem,3.2vw,2rem)] text-[var(--ink)]">
            {prompt}
          </p>
          <p
            className={`mt-4 min-h-[4.5rem] max-w-3xl text-[1.05rem] leading-7 text-[var(--ink-soft)] transition-opacity duration-200 ${
              visible && fact ? "opacity-100" : "opacity-0"
            }`}
            suppressHydrationWarning
          >
            {text}
          </p>
          {fact?.storySlug ? (
            <Link
              href={localizedPath(locale, `/stories/${fact.storySlug}`)}
              className="mt-4 inline-block text-[0.92rem] font-semibold text-[var(--brick)] transition hover:text-[var(--brick-hot)] hover:underline"
            >
              {moreLabel}
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={!fact}
          className="btn btn-ink shrink-0 self-start"
          aria-label={nextLabel}
        >
          {nextLabel}
        </button>
      </div>
    </aside>
  );
}
