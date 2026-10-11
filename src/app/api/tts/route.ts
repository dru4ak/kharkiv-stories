import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { EdgeTTS } from "node-edge-tts";
import { NextResponse } from "next/server";

const MAX_CHARS = 2200;

type VoiceGender = "female" | "male";
type RateKey = "slow" | "normal" | "fast";

const VOICES: Record<string, Record<VoiceGender, string>> = {
  kh: {
    female: "ru-RU-SvetlanaNeural",
    male: "ru-RU-DmitryNeural",
  },
  uk: {
    female: "uk-UA-PolinaNeural",
    male: "uk-UA-OstapNeural",
  },
  en: {
    female: "en-US-JennyNeural",
    male: "en-US-GuyNeural",
  },
};

const LANG: Record<string, string> = {
  kh: "ru-RU",
  uk: "uk-UA",
  en: "en-US",
};

const RATE: Record<RateKey, string> = {
  slow: "-15%",
  normal: "-5%",
  fast: "+10%",
};

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
  const voice = VOICES[locale][gender];
  const lang = LANG[locale];
  const outPath = path.join(os.tmpdir(), `kh-tts-${randomUUID()}.mp3`);

  try {
    const tts = new EdgeTTS({
      voice,
      lang,
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      rate: RATE[rate],
      pitch: "-2Hz",
      timeout: 55000,
    });
    await tts.ttsPromise(text, outPath);
    const buffer = await fs.readFile(outPath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-TTS-Voice": voice,
        "X-TTS-Provider": "edge",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "tts_failed";
    console.error("[tts]", voice, message);
    return NextResponse.json(
      {
        error: "tts_failed",
        voice,
        message,
      },
      { status: 502 },
    );
  } finally {
    await fs.unlink(outPath).catch(() => {});
  }
}
