"use client";

import { useEffect, useState } from "react";
import type { Story } from "@/data/stories";
import { StoryCard } from "@/components/StoryCard";
import type { Locale } from "@/i18n/config";

function shuffle<T>(arr: T[]): T[] {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function RandomStories({
  stories,
  initial,
  count = 4,
  locale = "kh",
  title = "Случайные байки",
  readLabel = "Читать →",
}: {
  stories: Story[];
  initial?: Story[];
  count?: number;
  locale?: Locale;
  title?: string;
  readLabel?: string;
}) {
  const [picked, setPicked] = useState<Story[]>(
    () => initial ?? stories.slice(0, count),
  );

  useEffect(() => {
    setPicked(shuffle(stories).slice(0, count));
  }, [stories, count]);

  function reshuffle() {
    setPicked(shuffle(stories).slice(0, count));
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{title}</p>
          <h2 className="display mt-2 text-[clamp(1.8rem,4vw,2.6rem)] text-[var(--ink)]">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={reshuffle}
          className="btn btn-ink self-start"
        >
          ↻
        </button>
      </div>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {picked.map((story) => (
          <StoryCard
            key={`${story.id}-${story.slug}`}
            story={story}
            locale={locale}
            readLabel={readLabel}
          />
        ))}
      </div>
    </div>
  );
}
