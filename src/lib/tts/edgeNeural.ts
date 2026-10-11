import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { EdgeTTS } from "node-edge-tts";

export type VoiceGender = "female" | "male";
export type RateKey = "slow" | "normal" | "fast";

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

export async function edgeNeuralTts(
  text: string,
  locale: string,
  gender: VoiceGender,
  rate: RateKey,
): Promise<{ buffer: Buffer; voice: string }> {
  const voice = VOICES[locale]?.[gender] ?? VOICES.kh.female;
  const lang = LANG[locale] ?? "ru-RU";
  const outPath = path.join(os.tmpdir(), `kh-tts-${randomUUID()}.mp3`);

  try {
    const tts = new EdgeTTS({
      voice,
      lang,
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      rate: RATE[rate],
      pitch: "-2Hz",
      timeout: 20000,
    });
    await tts.ttsPromise(text, outPath);
    const buffer = await fs.readFile(outPath);
    if (!buffer.length) throw new Error("edge_empty");
    return { buffer, voice };
  } finally {
    await fs.unlink(outPath).catch(() => {});
  }
}
