import {
  stories,
  type Story,
  type StoryType,
} from "@/data/stories";

export type StoryFilters = {
  q?: string;
  type?: StoryType | "все";
  district?: string | "все";
  era?: string | "все";
  person?: string | "все";
};

export function getPublishedStories(): Story[] {
  return stories.filter((s) => s.status === "published");
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getPublishedStories().find((s) => s.slug === slug);
}

export function getFilterOptions() {
  const list = getPublishedStories();
  return {
    types: Array.from(new Set(list.map((s) => s.type))),
    districts: Array.from(
      new Set(list.map((s) => s.district).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b, "ru")),
    eras: Array.from(new Set(list.map((s) => s.era))),
    people: Array.from(new Set(list.flatMap((s) => s.people))).sort((a, b) =>
      a.localeCompare(b, "ru"),
    ),
  };
}

export function filterStories(filters: StoryFilters): Story[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return getPublishedStories().filter((s) => {
    if (filters.type && filters.type !== "все" && s.type !== filters.type) {
      return false;
    }
    if (
      filters.district &&
      filters.district !== "все" &&
      s.district !== filters.district
    ) {
      return false;
    }
    if (filters.era && filters.era !== "все" && s.era !== filters.era) {
      return false;
    }
    if (
      filters.person &&
      filters.person !== "все" &&
      !s.people.includes(filters.person)
    ) {
      return false;
    }
    if (!q) return true;
    const hay = [
      s.title,
      s.summary,
      s.body,
      s.placeName,
      s.district,
      ...s.tags,
      ...s.people,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getStoriesForMap(): Story[] {
  return getPublishedStories().filter(
    (s) =>
      typeof s.lat === "number" &&
      typeof s.lng === "number" &&
      Boolean(s.placeName) &&
      s.geoBound === true,
  );
}

export function getTimelineStories(): Story[] {
  return getPublishedStories()
    .filter((s) => typeof s.yearStart === "number")
    .sort((a, b) => (a.yearStart ?? 0) - (b.yearStart ?? 0));
}

export function getStoryCountsByType(): Record<StoryType, number> {
  const counts: Record<StoryType, number> = {
    байка: 0,
    легенда: 0,
    анекдот: 0,
    слух: 0,
    топоним: 0,
    "от местных": 0,
  };
  for (const s of getPublishedStories()) {
    counts[s.type] += 1;
  }
  return counts;
}

export function getTotalStoryCount(): number {
  return getPublishedStories().length;
}

/** Deterministic shuffle for SSR-safe “random” picks (client reshuffles after hydrate). */
export function getRandomStories(count: number, seed = 42): Story[] {
  const list = [...getPublishedStories()];
  const s = seed || 1;
  let x = s;
  const rand = () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(count, list.length));
}
