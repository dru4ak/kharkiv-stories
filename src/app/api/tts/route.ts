import { NextResponse } from "next/server";
import {
  edgeNativeTts,
  type RateKey,
  type VoiceGender,
} from "@/lib/tts/edgeNative";
import { googleTranslateTts } from "@/lib/tts/googleTranslate";

const MAX_CHARS = 2200;

function cleanText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/[#*_`]/g, "")
    .trim()
    .slice(0, MAX_CHARS);
}

function pickLocale(raw: unknown): "kh" | "uk" | "en" {
  return raw === "uk" || raw === "en" ? raw : "kh";
}

function pickGender(raw: unknown): VoiceGender {
  return raw === "male" ? "male" : "female";
}

function pickRate(raw: unknown): RateKey {
  if (raw === "slow" || raw === "fast") return raw;
  return "normal";
}

export async function POST(request: Request) {
  let body: {
    text?: string;
    locale?: string;
    voice?: string;
    rate?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const text = cleanText(body.text ?? "");
  if (text.length < 2) {
    return NextResponse.json({ error: "empty_text" }, { status: 400 });
  }

  const locale = pickLocale(body.locale);
  const gender = pickGender(body.voice);
  const rate = pickRate(body.rate);

  try {
    const { buffer, voice } = await edgeNativeTts(text, locale, gender, rate);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
        "X-TTS-Voice": voice,
        "X-TTS-Provider": "edge",
        "X-TTS-Rate": rate,
      },
    });
  } catch (edgeErr) {
    console.warn(
      "[tts] edge failed, google fallback:",
      edgeErr instanceof Error ? edgeErr.message : edgeErr,
    );
  }

  try {
    const buffer = await googleTranslateTts(text, locale);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
        "X-TTS-Voice": `google-${locale}`,
        "X-TTS-Provider": "google",
        "X-TTS-Rate": rate,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "tts_failed";
    console.error("[tts] google failed", message);
    return NextResponse.json({ error: "tts_failed", message }, { status: 502 });
  }
}
