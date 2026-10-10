import type { MetadataRoute } from "next";
import { people } from "@/data/people";
import { places } from "@/data/places";
import { locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/path";
import { hreflangForLocale } from "@/i18n/seo";
import { absoluteUrl } from "@/lib/site";
import { getPublishedStories } from "@/lib/stories";

const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.95 },
  { path: "/rumors", changeFrequency: "daily", priority: 0.9 },
  { path: "/people", changeFrequency: "monthly", priority: 0.8 },
  { path: "/places", changeFrequency: "monthly", priority: 0.8 },
  { path: "/map", changeFrequency: "monthly", priority: 0.75 },
  { path: "/timeline", changeFrequency: "monthly", priority: 0.75 },
  { path: "/about", changeFrequency: "yearly", priority: 0.5 },
  { path: "/submit", changeFrequency: "yearly", priority: 0.4 },
];

function languageMap(path: string): Record<string, string> {
  const map: Record<string, string> = {
    "x-default": absoluteUrl(localizedPath("kh", path)),
  };
  for (const locale of locales) {
    map[hreflangForLocale(locale)] = absoluteUrl(localizedPath(locale, path));
  }
  return map;
}

function entry(
  locale: Locale,
  path: string,
  opts: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
    images?: string[];
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages: languageMap(path) },
    images: opts.images,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getPublishedStories();
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPaths) {
      out.push(
        entry(locale, page.path, {
          changeFrequency: page.changeFrequency,
          priority: page.priority,
          lastModified: now,
        }),
      );
    }

    for (const story of stories) {
      out.push(
        entry(locale, `/stories/${story.slug}`, {
          changeFrequency: "monthly",
          priority: 0.7,
          lastModified: now,
          images: story.illustrationUrl
            ? [absoluteUrl(story.illustrationUrl)]
            : undefined,
        }),
      );
    }

    for (const person of people) {
      out.push(
        entry(locale, `/people/${person.slug}`, {
          changeFrequency: "monthly",
          priority: 0.65,
          lastModified: now,
          images: person.imageUrl ? [absoluteUrl(person.imageUrl)] : undefined,
        }),
      );
    }

    for (const place of places) {
      out.push(
        entry(locale, `/places/${place.slug}`, {
          changeFrequency: "monthly",
          priority: 0.65,
          lastModified: now,
          images: place.imageUrl ? [absoluteUrl(place.imageUrl)] : undefined,
        }),
      );
    }
  }

  return out;
}
