import fs from "node:fs";

const raw = fs.readFileSync("scripts/book-raw.txt", "utf8");
const stories = JSON.parse(fs.readFileSync("src/data/stories.json", "utf8"));

function countWord(text, w) {
  const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(?<![А-Яа-яЁёІіЇїЄєҐґ])${escaped}(?![А-Яа-яЁёІіЇїЄєҐґ])`,
    "gi",
  );
  return (text.match(re) || []).length;
}

function likelyRealCompound(h) {
  const low = h.toLowerCase();
  if (
    /^(из|по|кое|кто|что|как|где|когда|куда|откуда|зачем|почему|всё|все)-/i.test(
      low,
    )
  ) {
    return true;
  }
  if (/-(то|либо|нибудь)$/i.test(low)) return true;

  const parts = h.split("-");
  if (parts.length !== 2) return parts.length > 2;

  const [a, b] = parts.map((p) => p.toLowerCase());
  const suffixLike =
    /^(ка|на|ная|ный|ное|ные|ского|ской|ском|ская|ские|щины|ровка|нием|тор|туры|ская)$/;
  if (suffixLike.test(b)) return false;

  // adjective compounds: художественно-этнографического
  if (/[ое]$/i.test(a) && a.length >= 5 && b.length >= 5) return true;

  // appositions: писатель-сатирик, босяка-хулигана
  if (a.length >= 4 && b.length >= 4) return true;

  return false;
}

function preserveCaps(original, next) {
  if (original === original.toUpperCase()) return next.toUpperCase();
  if (/^[А-ЯЁІЇЄҐ]/.test(original)) {
    return next.charAt(0).toUpperCase() + next.slice(1);
  }
  return next;
}

let toGlued = 0;
let kept = 0;
const samplesG = [];

for (const s of stories) {
  s.body = s.body.replace(
    /[А-Яа-яЁёІіЇїЄєҐґ]{2,}(?:-[А-Яа-яЁёІіЇїЄєҐґ]{2,})+/g,
    (h) => {
      if (likelyRealCompound(h)) {
        kept++;
        return h;
      }
      const glued = h.replace(/-/g, "");
      const ch = countWord(raw, h);
      const cg = countWord(raw, glued);
      if (cg >= ch && cg > 0) {
        toGlued++;
        if (samplesG.length < 15) samplesG.push(`${h} -> ${glued} (${ch}/${cg})`);
        return preserveCaps(h, glued);
      }
      const last = h.split("-").at(-1).toLowerCase();
      if (
        last.length <= 5 &&
        /^(ка|на|ная|ный|ное|щины|ров|ние|тор|туры|ская|рово)$/.test(last)
      ) {
        toGlued++;
        if (samplesG.length < 15) samplesG.push(`${h} -> ${glued} (suffix)`);
        return preserveCaps(h, glued);
      }
      kept++;
      return h;
    },
  );
}

fs.writeFileSync("src/data/stories.json", JSON.stringify(stories, null, 2), "utf8");

const body = stories.map((s) => s.body).join("\n");
console.log({ toGlued, kept, samplesG });
console.log({
  writer: body.includes("писатель-сатирик"),
  slob:
    !body.includes("Слобожан-щины") && body.includes("Слобожанщины"),
  flan: body.includes("фланирования") && !body.includes("фла-нирования"),
  bas: !body.includes("Бассей-ная") && body.includes("Бассейная"),
  mir: !body.includes("Миро-носицкая") && body.includes("Мироносицкая"),
  gab: !body.includes("Габ-рово") && body.includes("Габрово"),
  kakom: body.includes("каком-то"),
  plodo: body.includes("плодово-ягодных"),
});
