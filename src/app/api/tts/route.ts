import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_CHARS = 900;

/** MMS models — best for RU/UK; may need HF token + warm model. */
const MMS_BY_LOCALE: Record<string, string> = {
  kh: "facebook/mms-tts-rus",
  uk: "facebook/mms-tts-ukr",
  en: "facebook/mms-tts-eng",
};

function pickModel(locale: string): string {
  const override = process.env.HF_TTS_MODEL?.trim();
  if (override) return override;
  return MMS_BY_LOCALE[locale] ?? MMS_BY_LOCALE.kh;
}

function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/[#*_`]/g, "")
    .trim()
    .slice(0, MAX_CHARS);
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      {
        error: "missing_token",
        message:
          "Add HF_TOKEN in Vercel env (huggingface.co/settings/tokens).",
      },
      { status: 503 },
    );
  }

  let body: { text?: string; locale?: string };
  try {
    body = (await request.json()) as { text?: string; locale?: string };
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const text = cleanText(body.text ?? "");
  if (text.length < 2) {
    return NextResponse.json({ error: "empty_text" }, { status: 400 });
  }

  const locale = body.locale === "uk" || body.locale === "en" ? body.locale : "kh";
  const model = pickModel(locale);
  const client = new InferenceClient(token);

  try {
    const audio = await client.textToSpeech({
      model,
      inputs: text,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    const type = audio.type || "audio/wav";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Model": model,
        "X-TTS-Provider": "huggingface",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "tts_failed";
    console.error("[tts]", model, message);
    return NextResponse.json(
      {
        error: "hf_failed",
        model,
        message,
        hint: "Model may be cold or not on Inference API. Browser voice will be used as fallback.",
      },
      { status: 502 },
    );
  }
}
