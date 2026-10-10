import { places, type Place } from "@/data/places";
import { stories as allStories, type Story } from "@/data/stories";
import { getPublishedStories } from "@/lib/stories";

export function getPlaces(): Place[] {
  return places;
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return places.find((p) => p.slug === slug);
}

export function getStoriesForPlace(place: Place): Story[] {
  const list = getPublishedStories();
  return list.filter((s) => {
    const hay = `${s.title}\n${s.body}`;
    return place.keywords.some((k) => hay.includes(k));
  });
}

export function getPlacesForStory(storySlug: string): Place[] {
  const story = allStories.find((s) => s.slug === storySlug);
  if (!story) return [];
  const hay = `${story.title}\n${story.body}`;
  return places.filter((p) => p.keywords.some((k) => hay.includes(k)));
}

export function getPlacesForMap(): Place[] {
  return places;
}
