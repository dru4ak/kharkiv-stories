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

function pickProvider(raw: unknown): "google" | "edge" | "auto" {
  if (raw === "google" || raw === "edge") return raw;
  return "auto";
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}_timeout`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err: unknown) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

async function synthesizeGoogle(text: string, locale: string, rate: RateKey) {
  const buffer = await withTimeout(
    googleTranslateTts(text, locale),
    15000,
    "google",
  );
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
}

async function synthesizeEdge(
  text: string,
  locale: string,
  gender: VoiceGender,
  rate: RateKey,
) {
  const { buffer, voice } = await withTimeout(
    edgeNativeTts(text, locale, gender, rate),
    20000,
    "edge",
  );
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
}

export async function POST(request: Request) {
  let body: {
    text?: string;
    locale?: string;
    voice?: string;
    rate?: string;
    provider?: string;
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
  const provider = pickProvider(body.provider);

  if (provider === "google") {
    try {
      return await synthesizeGoogle(text, locale, rate);
    } catch (err) {
      const message = err instanceof Error ? err.message : "tts_failed";
      return NextResponse.json(
        { error: "tts_failed", provider: "google", message },
        { status: 502 },
      );
    }
  }

  if (provider === "edge") {
    try {
      return await synthesizeEdge(text, locale, gender, rate);
    } catch (err) {
      const message = err instanceof Error ? err.message : "tts_failed";
      return NextResponse.json(
        {
          error: "tts_failed",
          provider: "edge",
          message,
          hint: "Microsoft often blocks Edge TTS from Vercel IPs (403).",
        },
        { status: 502 },
      );
    }
  }

  // auto: Edge first, Google fallback (server / Vercel path)
  try {
    return await synthesizeEdge(text, locale, gender, rate);
  } catch (edgeErr) {
    console.warn(
      "[tts] edge failed, google fallback:",
      edgeErr instanceof Error ? edgeErr.message : edgeErr,
    );
  }

  try {
    return await synthesizeGoogle(text, locale, rate);
  } catch (err) {
    const message = err instanceof Error ? err.message : "tts_failed";
    return NextResponse.json({ error: "tts_failed", message }, { status: 502 });
  }
}
