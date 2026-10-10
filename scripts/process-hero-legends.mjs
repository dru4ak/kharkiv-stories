import sharp from "sharp";
import fs from "fs";

const W = 2400;
const H = 1350;

const place = (name) => `public/places/${name}.jpg`;

async function panel(name, w, h, gravity = "centre") {
  return sharp(place(name))
    .rotate()
    .resize(w, h, { fit: "cover", position: gravity })
    .toBuffer();
}

const left = await panel("blagoveshchenskiy", 720, H, "centre");
const center = await panel("gosprom", 1100, H, "attention");
const rightTop = await panel("zerkalnaya-struya", 580, 675, "centre");
const rightBot = await panel("uspenskiy-sobor", 580, 675, "centre");

const base = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 28, g: 24, b: 20 },
  },
})
  .composite([
    { input: left, left: 0, top: 0 },
    { input: center, left: 720, top: 0 },
    { input: rightTop, left: 1820, top: 0 },
    { input: rightBot, left: 1820, top: 675 },
  ])
  .jpeg({ quality: 92 })
  .toBuffer();

const divider = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1c1814" stop-opacity="0.22"/>
      <stop offset="30%" stop-color="#1c1814" stop-opacity="0.05"/>
      <stop offset="55%" stop-color="#1c1814" stop-opacity="0"/>
      <stop offset="100%" stop-color="#1c1814" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0705" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#0a0705" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0705" stop-opacity="0.28"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect x="718" width="3" height="100%" fill="#1c1814" opacity="0.25"/>
  <rect x="1818" width="3" height="100%" fill="#1c1814" opacity="0.25"/>
  <rect y="673" x="1820" width="580" height="3" fill="#1c1814" opacity="0.25"/>
</svg>`);

const out = "public/illustrations/hero-kharkiv-legends.jpg";
await sharp(base)
  .composite([{ input: divider, blend: "over" }])
  .modulate({ brightness: 1.02, saturation: 0.95 })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(out);

fs.copyFileSync(out, "public/illustrations/hero-kharkiv-old.jpg");
const meta = await sharp(out).metadata();
console.log("ok", fs.statSync(out).size, `${meta.width}x${meta.height}`);
