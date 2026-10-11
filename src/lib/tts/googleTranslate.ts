/** Unofficial Google Translate TTS — HTTP only, works on Vercel serverless. */

const MAX_CHUNK = 180;

function splitChunks(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_CHUNK) return [clean];

  const parts: string[] = [];
  let rest = clean;
  while (rest.length > MAX_CHUNK) {
    let cut = rest.slice(0, MAX_CHUNK);
    const stop = Math.max(
      cut.lastIndexOf(". "),
      cut.lastIndexOf("! "),
      cut.lastIndexOf("? "),
      cut.lastIndexOf(", "),
      cut.lastIndexOf(" "),
    );
    if (stop > 40) cut = cut.slice(0, stop + 1);
    parts.push(cut.trim());
    rest = rest.slice(cut.length).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

function googleLang(locale: string): string {
  if (locale === "uk") return "uk";
  if (locale === "en") return "en";
  return "ru";
}

export async function googleTranslateTts(
  text: string,
  locale: string,
): Promise<Buffer> {
  const lang = googleLang(locale);
  const chunks = splitChunks(text);
  const buffers: Buffer[] = [];

  for (const chunk of chunks) {
    const url = new URL("https://translate.google.com/translate_tts");
    url.searchParams.set("ie", "UTF-8");
    url.searchParams.set("client", "tw-ob");
    url.searchParams.set("tl", lang);
    url.searchParams.set("q", chunk);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`google_tts_${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) throw new Error("google_tts_empty");
    buffers.push(buf);
  }

  return Buffer.concat(buffers);
}
