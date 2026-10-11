import sharp from "sharp";
import fs from "fs";
import path from "path";

const src = "public/illustrations/gerb-kharkiv-1781.png";

/** Cut cream paper background so only the crest remains. */
async function extractCrest(size) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Light parchment / near-white → transparent
    if (r > 210 && g > 195 && b > 165 && Math.abs(r - g) < 45) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/** Soft gold/ochre halo — readable on light and dark tabs. */
async function withGlow(size, { opaque } = {}) {
  const pad = Math.round(size * 0.14);
  const inner = Math.max(8, size - pad * 2);
  const crest = await extractCrest(inner);

  // Blurred gold disc behind the crest reads as a “glow” at tab sizes.
  const glowCore = Math.max(4, Math.round(size * 0.72));
  const blurSigma = Math.max(1.2, size * 0.085);
  const goldDisc = await sharp({
    create: {
      width: glowCore,
      height: glowCore,
      channels: 4,
      background: { r: 255, g: 214, b: 120, alpha: 0.95 },
    },
  })
    .composite([
      {
        input: Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${glowCore}" height="${glowCore}">
  <circle cx="${glowCore / 2}" cy="${glowCore / 2}" r="${glowCore / 2}" fill="#f0c45a"/>
</svg>`),
      },
    ])
    .blur(blurSigma)
    .ensureAlpha()
    .png()
    .toBuffer();

  const glowLeft = Math.round((size - glowCore) / 2);
  const bg = opaque
    ? { r: 243, g: 235, b: 224, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 0 };

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([
      { input: goldDisc, left: glowLeft, top: glowLeft },
      { input: crest, left: pad, top: pad },
    ])
    .png()
    .toBuffer();
}

function pngToIco(pngBuffers) {
  const images = pngBuffers;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + dirEntrySize * images.length;
  let offset = dirSize;
  const entries = images.map((png) => {
    const e = { png, offset, size: png.length };
    offset += png.length;
    return e;
  });
  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(images.length, 4);
  let entryAt = 6;
  for (const e of entries) {
    const w = e.png.readUInt32BE(16);
    const h = e.png.readUInt32BE(20);
    buf.writeUInt8(w >= 256 ? 0 : w, entryAt);
    buf.writeUInt8(h >= 256 ? 0 : h, entryAt + 1);
    buf.writeUInt8(0, entryAt + 2);
    buf.writeUInt8(0, entryAt + 3);
    buf.writeUInt16LE(1, entryAt + 4);
    buf.writeUInt16LE(32, entryAt + 6);
    buf.writeUInt32LE(e.size, entryAt + 8);
    buf.writeUInt32LE(e.offset, entryAt + 12);
    e.png.copy(buf, e.offset);
    entryAt += 16;
  }
  return buf;
}

const outs = [
  ["src/app/icon.png", 32, false],
  ["src/app/apple-icon.png", 180, true],
  ["public/icon-32.png", 32, false],
  ["public/icon-192.png", 192, false],
  ["public/icon-512.png", 512, false],
  ["public/apple-touch-icon.png", 180, true],
];

for (const [file, size, opaque] of outs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const buf = await withGlow(size, { opaque });
  fs.writeFileSync(file, buf);
  console.log("ok", file, buf.length);
}

const ico = pngToIco([
  await withGlow(16),
  await withGlow(32),
  await withGlow(48),
]);
fs.writeFileSync("src/app/favicon.ico", ico);
fs.writeFileSync("public/favicon.ico", ico);
console.log("ok favicon.ico", ico.length);
