import { people, type Person } from "@/data/people";
import { stories as allStories, type Story } from "@/data/stories";
import { getPublishedStories } from "@/lib/stories";

export function getPeople(): Person[] {
  return people;
}

export function getPersonBySlug(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}

export function getStoriesForPerson(person: Person): Story[] {
  const list = getPublishedStories();
  return list.filter((s) => {
    if (person.storySlugs?.includes(s.slug)) return true;
    const hay = `${s.title}\n${s.body}`;
    return person.keywords.some((k) => hay.includes(k));
  });
}

export function getPeopleForStory(storySlug: string): Person[] {
  const story = allStories.find((s) => s.slug === storySlug);
  if (!story) return [];
  const hay = `${story.title}\n${story.body}`;
  return people.filter((p) => p.keywords.some((k) => hay.includes(k)));
}
