import type { Story } from "@/data/stories";
import type { Locale } from "@/i18n/config";
import i18n from "@/data/stories.i18n.json";

type StoryI18nEntry = {
  title?: string;
  summary?: string;
  body?: string;
};

type StoryI18nFile = Record<
  string,
  { uk?: StoryI18nEntry; en?: StoryI18nEntry }
>;

const table = i18n as StoryI18nFile;

export function localizeStory(story: Story, locale: Locale) {
  if (locale === "kh") {
    return {
      title: story.title,
      summary: story.summary,
      body: story.body,
      bodyLocalized: true,
    };
  }

  const entry = table[story.slug]?.[locale];
  return {
    title: entry?.title?.trim() || story.title,
    summary: entry?.summary?.trim() || story.summary,
    body: entry?.body?.trim() || story.body,
    bodyLocalized: Boolean(entry?.body?.trim()),
  };
}
