/**
 * Назначает иллюстрации: сначала узкие тематические совпадения, иначе ротация пула.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storiesPath = path.join(root, "src/data/stories.json");

const thematic = [
  {
    url: "/illustrations/gosprom-story.jpg",
    caption: "Госпром — иллюстрация",
    test: (h) => /госпром|держпром|пл\.?\s*дзержинск|площад\w*\s*свобод/i.test(h),
  },
  {
    url: "/illustrations/vokzal-story.jpg",
    caption: "Вокзал — иллюстрация",
    test: (h) => /вокзал/i.test(h),
  },
  {
    url: "/illustrations/kholodnaya-gora-story.jpg",
    caption: "Холодная Гора — иллюстрация",
    test: (h) => /холодн\w*\s*гор/i.test(h),
  },
  {
    url: "/illustrations/zerkalnaya-story.jpg",
    caption: "Зеркальная струя — иллюстрация",
    test: (h) => /зеркальн\w*\s*стру/i.test(h),
  },
  {
    url: "/illustrations/rynok-story.jpg",
    caption: "Рынок у Лопани — иллюстрация",
    test: (h) => /конный рынок|благбаз|благобаз|благовещенск\w*\s*базар/i.test(h),
  },
  {
    url: "/illustrations/rachka-bazar.jpg",
    caption: "Базар и рачка — иллюстрация",
    test: (h) => /рачк|ракл|тремпел|кул[её]к|деберц/i.test(h),
  },
  {
    url: "/illustrations/osnovanie-kharkova.jpg",
    caption: "Основание Харькова — иллюстрация",
    test: (h) => /откуда харьков|основан\w*\s*харьков|крепост|казак/i.test(h),
  },
  {
    url: "/illustrations/gerb-kharkova.jpg",
    caption: "Герб и топонимы — иллюстрация",
    test: (h) => /герб|рогань|лопни|нетеч/i.test(h),
  },
  {
    url: "/illustrations/universitet-story.jpg",
    caption: "Университетская горка — иллюстрация",
    test: (h) => /университетск\w*\s*гор|каразин|успенск/i.test(h),
  },
];

const pool = [
  "/illustrations/kharkiv-skyline.jpg",
  "/illustrations/osnovanie-kharkova.jpg",
  "/illustrations/gerb-kharkova.jpg",
  "/illustrations/rachka-bazar.jpg",
  "/illustrations/gosprom-story.jpg",
  "/illustrations/rynok-story.jpg",
  "/illustrations/vokzal-story.jpg",
  "/illustrations/kholodnaya-gora-story.jpg",
  "/illustrations/zerkalnaya-story.jpg",
  "/illustrations/universitet-story.jpg",
];

const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
let thematicHits = 0;
let preserved = 0;

stories.forEach((story, idx) => {
  // Не затирать уже сгенерированные уникальные иллюстрации по slug
  const uniquePath = `/illustrations/${story.slug}.jpg`;
  if (
    story.illustrationUrl === uniquePath ||
    (story.illustrationUrl?.startsWith("/illustrations/") &&
      !pool.includes(story.illustrationUrl) &&
      !thematic.some((t) => t.url === story.illustrationUrl))
  ) {
    preserved++;
    return;
  }

  const hay = [story.title, story.summary, story.body, story.placeName]
    .filter(Boolean)
    .join("\n");

  const hit = thematic.find((t) => t.test(hay));
  if (hit) {
    story.illustrationUrl = hit.url;
    story.illustrationCaption = hit.caption;
    thematicHits++;
  } else {
    const url = pool[idx % pool.length];
    story.illustrationUrl = url;
    story.illustrationCaption = "Харьковский мотив — иллюстрация";
  }
});

fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2), "utf8");
console.log(
  `thematic=${thematicHits} preserved=${preserved} total=${stories.length}`,
);
