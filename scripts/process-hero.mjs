import sharp from "sharp";
import fs from "fs";

const src =
  "C:/Users/vorte/.cursor/projects/c-Users-vorte-OneDrive-kharkiv-stories/assets/gosprom.jpg";
const out = "public/illustrations/hero-gosprom.jpg";

const meta = await sharp(src).metadata();
console.log("src", meta.width, meta.height);

const base = await sharp(src)
  .resize({ width: 2400, withoutEnlargement: true })
  .modulate({ brightness: 0.82, saturation: 0.45 })
  .tint({ r: 205, g: 178, b: 132 })
  .linear(1.12, -16)
  .toBuffer({ resolveWithObject: true });

const bw = base.info.width;
const bh = base.info.height;

const vignetteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="${bh}">
  <defs>
    <radialGradient id="v" cx="48%" cy="38%" r="76%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.1"/>
      <stop offset="78%" stop-color="#1a120c" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0a0705" stop-opacity="0.8"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect width="100%" height="100%" fill="#5c3a1e" opacity="0.12"/>
</svg>`;

await sharp(base.data)
  .composite([{ input: Buffer.from(vignetteSvg), blend: "over" }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(out);

// Keep old path as a copy so any leftover refs still work
await fs.promises.copyFile(out, "public/illustrations/hero-kharkiv-old.jpg");

console.log("wrote", out, fs.statSync(out).size);
