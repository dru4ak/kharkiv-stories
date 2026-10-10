import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const storiesPath = "src/data/stories.json";
const captions = JSON.parse(
  fs.readFileSync(
    new URL("./illust-captions-tl.json", import.meta.url),
    "utf8",
  ),
);

export async function wireOneIllustration(slug, srcPath) {
  const dest = path.join("public/illustrations", `${slug}.jpg`);
  const skipCopy =
    path.basename(srcPath).toLowerCase() === `${slug}.jpg`.toLowerCase() &&
    srcPath.replace(/\\/g, "/").includes("public/illustrations");
  if (!skipCopy) {
    await sharp(srcPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
  }

  const stories = JSON.parse(fs.readFileSync(storiesPath, "utf8"));
  const story = stories.find((s) => s.slug === slug);
  if (!story) throw new Error(`story not found: ${slug}`);

  story.illustrationUrl = `/illustrations/${slug}.jpg`;
  story.illustrationCaption =
    captions[slug] || `${story.title.slice(0, 40)} — иллюстрация`;

  fs.writeFileSync(storiesPath, JSON.stringify(stories, null, 2) + "\n");
  return dest;
}

const slug = process.argv[2];
const src = process.argv[3];
if (slug && src) {
  await wireOneIllustration(slug, src);
  console.log("wired", slug);
}
