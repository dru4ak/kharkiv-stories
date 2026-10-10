import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assets =
  "C:/Users/vorte/.cursor/projects/c-Users-vorte-OneDrive-kharkiv-stories/assets";
const storiesPath = "src/data/stories.json";
const outDir = "public/illustrations";

const slugs = JSON.parse(
  fs.readFileSync("scripts/illust-queue-remaining-other.json", "utf8"),
)
  .slice(0, 40)
  .map((x) => x.slug);

const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
const bySlug = Object.fromEntries(stories.map((s) => [s.slug, s]));

let wired = 0;
for (const slug of slugs) {
  const story = bySlug[slug];
  if (!story) {
    console.warn("missing story", slug);
    continue;
  }
  const dest = path.join(outDir, `${slug}.jpg`);
  const candidates = [
    path.join(assets, `${slug}.jpg`),
    path.join(assets, `${slug}.jpeg`),
    path.join(assets, `${slug}.png`),
    dest,
  ];
  const src = candidates.find((p) => fs.existsSync(p));
  if (!src) {
    console.warn("missing asset", slug);
    continue;
  }
  if (src !== dest) {
    await sharp(src)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
  }
  story.illustrationUrl = `/illustrations/${slug}.jpg`;
  if (!story.illustrationCaption) {
    story.illustrationCaption = `${story.title.slice(0, 40)} — иллюстрация`;
  }
  wired++;
  console.log("wired", slug);
}

fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2) + "\n");
console.log("wired total", wired, "of", slugs.length);
