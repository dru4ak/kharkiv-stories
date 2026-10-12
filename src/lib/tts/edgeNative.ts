import { createHash, randomUUID } from "crypto";
import WebSocket from "ws";

export type VoiceGender = "female" | "male";
export type RateKey = "slow" | "normal" | "fast";

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const CHROMIUM_FULL_VERSION = "143.0.7499.0";
const WIN_EPOCH = 11644473600;
const WSS_BASE =
  "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
const CHUNK_CHARS = 480;

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

const RATE: Record<RateKey, string> = {
  slow: "-15%",
  normal: "+0%",
  fast: "+20%",
};

function secMsGec(): string {
  let ticks = Math.floor(Date.now() / 1000 + WIN_EPOCH);
  ticks -= ticks % 300;
  ticks = Math.floor(ticks * (1e9 / 100));
  return createHash("sha256")
    .update(`${ticks}${TRUSTED_CLIENT_TOKEN}`)
    .digest("hex")
    .toUpperCase();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSsml(text: string, voice: string, rate: RateKey): string {
  const locale = voice.slice(0, 5);
  const body =
    rate === "normal"
      ? escapeXml(text)
      : `<prosody rate="${RATE[rate]}">${escapeXml(text)}</prosody>`;
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}">` +
    `<voice name="${voice}">${body}</voice></speak>`
  );
}

function splitChunks(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= CHUNK_CHARS) return [clean];
  const parts: string[] = [];
  let rest = clean;
  while (rest.length > CHUNK_CHARS) {
    let cut = rest.slice(0, CHUNK_CHARS);
    const stop = Math.max(
      cut.lastIndexOf(". "),
      cut.lastIndexOf("! "),
      cut.lastIndexOf("? "),
      cut.lastIndexOf("; "),
      cut.lastIndexOf(", "),
      cut.lastIndexOf(" "),
    );
    if (stop > 80) cut = cut.slice(0, stop + 1);
    parts.push(cut.trim());
    rest = rest.slice(cut.length).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

async function synthesizeChunk(
  text: string,
  voice: string,
  rate: RateKey,
): Promise<Buffer> {
  const connectionId = randomUUID().replace(/-/g, "");
  const url =
    `${WSS_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
    `&Sec-MS-GEC=${secMsGec()}` +
    `&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}` +
    `&ConnectionId=${connectionId}`;

  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const ws = new WebSocket(url, {
      host: "speech.platform.bing.com",
      origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
      headers: {
        "User-Agent":
          `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_FULL_VERSION} Safari/537.36 Edg/${CHROMIUM_FULL_VERSION}`,
      },
    });

    const done = (err?: Error) => {
      if (settled) return;
      settled = true;
      if (idleTimer) clearTimeout(idleTimer);
      clearTimeout(hardTimer);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      if (err) reject(err);
      else resolve();
    };

    const bumpIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (chunks.length) done();
      }, 900);
    };

    const hardTimer = setTimeout(() => {
      if (chunks.length) done();
      else done(new Error("edge_timeout"));
    }, 14000);

    ws.on("error", (err) => {
      done(err instanceof Error ? err : new Error(String(err)));
    });

    ws.on("open", () => {
      const config = JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: {
                sentenceBoundaryEnabled: "false",
                wordBoundaryEnabled: "false",
              },
              outputFormat: "audio-24khz-96kbitrate-mono-mp3",
            },
          },
        },
      });
      ws.send(
        `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${config}`,
      );

      const ssml = buildSsml(text, voice, rate);
      const requestId = randomUUID().replace(/-/g, "");
      ws.send(
        `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\n` +
          `X-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n${ssml}`,
      );
    });

    ws.on("message", (data, isBinary) => {
      if (isBinary) {
        const buf = Buffer.isBuffer(data)
          ? data
          : Buffer.from(data as ArrayBuffer);
        if (buf.length < 2) return;
        const headerLen = buf.readUInt16BE(0);
        if (headerLen + 2 > buf.length) return;
        const audio = buf.subarray(2 + headerLen);
        if (audio.length) {
          chunks.push(audio);
          bumpIdle();
        }
        return;
      }
      if (data.toString().includes("Path:turn.end")) done();
    });

    ws.on("close", () => {
      if (chunks.length) done();
      else done(new Error("edge_closed"));
    });
  });

  const buffer = Buffer.concat(chunks);
  if (!buffer.length) throw new Error("edge_empty");
  return buffer;
}

export async function edgeNativeTts(
  text: string,
  locale: string,
  gender: VoiceGender,
  rate: RateKey,
): Promise<{ buffer: Buffer; voice: string }> {
  const voice =
    VOICES[locale]?.[gender] ?? VOICES.kh[gender] ?? VOICES.kh.female;
  const parts = splitChunks(text);
  const buffers: Buffer[] = [];
  for (const part of parts) {
    buffers.push(await synthesizeChunk(part, voice, rate));
  }
  return { buffer: Buffer.concat(buffers), voice };
}
