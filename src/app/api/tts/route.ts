import { NextResponse } from "next/server";
import {
  edgeNeuralTts,
  type RateKey,
  type VoiceGender,
} from "@/lib/tts/edgeNeural";
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

/** Edge WebSocket crashes the Vercel isolate (ws mask bug) — Google HTTP is primary there. */
function preferEdge(): boolean {
  if (process.env.TTS_PROVIDER === "edge") return true;
  if (process.env.TTS_PROVIDER === "google") return false;
  return !process.env.VERCEL;
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

  if (preferEdge()) {
    try {
      const { buffer, voice } = await edgeNeuralTts(text, locale, gender, rate);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400",
          "X-TTS-Voice": voice,
          "X-TTS-Provider": "edge",
        },
      });
    } catch (edgeErr) {
      console.warn(
        "[tts] edge failed, trying google:",
        edgeErr instanceof Error ? edgeErr.message : edgeErr,
      );
    }
  }

  try {
    const buffer = await googleTranslateTts(text, locale);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Voice": `google-${locale}-${gender}`,
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
