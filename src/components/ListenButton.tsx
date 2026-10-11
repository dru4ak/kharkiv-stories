"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

export type VoiceGender = "female" | "male";
export type RateKey = "slow" | "normal" | "fast";

export type ListenLabels = {
  listen: string;
  stop: string;
  loading: string;
  unavailable: string;
  voice: string;
  voiceFemale: string;
  voiceMale: string;
  rate: string;
  rateSlow: string;
  rateNormal: string;
  rateFast: string;
};

const STORAGE_KEY = "kh-tts-prefs-v1";

export function loadTtsPrefs(): { voice: VoiceGender; rate: RateKey } {
  if (typeof window === "undefined") {
    return { voice: "female", rate: "normal" };
  }
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as {
      voice?: string;
      rate?: string;
    };
    return {
      voice: raw.voice === "male" ? "male" : "female",
      rate: raw.rate === "slow" || raw.rate === "fast" ? raw.rate : "normal",
    };
  } catch {
    return { voice: "female", rate: "normal" };
  }
}

export function saveTtsPrefs(voice: VoiceGender, rate: RateKey) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ voice, rate }));
}

function speechLang(locale: Locale): string {
  if (locale === "uk") return "uk-UA";
  if (locale === "en") return "en-US";
  return "ru-RU";
}

function chunkText(text: string, max = 2000): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastStop = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
    cut.lastIndexOf("; "),
  );
  return (lastStop > 120 ? cut.slice(0, lastStop + 1) : cut).trim();
}

function playbackRate(rate: RateKey, provider: string | null): number {
  if (provider === "edge") return 1;
  if (rate === "slow") return 0.85;
  if (rate === "fast") return 1.15;
  return 1;
}

export function ListenPrefs({
  voice,
  rate,
  labels,
  disabled,
  onVoice,
  onRate,
}: {
  voice: VoiceGender;
  rate: RateKey;
  labels: ListenLabels;
  disabled?: boolean;
  onVoice: (v: VoiceGender) => void;
  onRate: (r: RateKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 text-[0.85rem] text-[var(--muted)]">
      <label className="flex items-center gap-2">
        <span className="uppercase tracking-[0.12em] text-[0.72rem]">
          {labels.voice}
        </span>
        <select
          className="border border-[var(--line)] bg-[var(--paper-elevated)] px-2 py-1.5 text-[0.9rem] text-[var(--ink)]"
          value={voice}
          disabled={disabled}
          onChange={(e) => onVoice(e.target.value as VoiceGender)}
        >
          <option value="female">{labels.voiceFemale}</option>
          <option value="male">{labels.voiceMale}</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="uppercase tracking-[0.12em] text-[0.72rem]">
          {labels.rate}
        </span>
        <select
          className="border border-[var(--line)] bg-[var(--paper-elevated)] px-2 py-1.5 text-[0.9rem] text-[var(--ink)]"
          value={rate}
          disabled={disabled}
          onChange={(e) => onRate(e.target.value as RateKey)}
        >
          <option value="slow">{labels.rateSlow}</option>
          <option value="normal">{labels.rateNormal}</option>
          <option value="fast">{labels.rateFast}</option>
        </select>
      </label>
    </div>
  );
}

export function ListenButton({
  text,
  locale,
  labels,
  voice: voiceProp,
  rate: rateProp,
  showPrefs = true,
  autoStartToken = null,
  forceStop = false,
  onNaturalEnd,
  onStart,
  onStop,
  onBusyChange,
  onPrefsChange,
}: {
  text: string;
  locale: Locale;
  labels: ListenLabels;
  voice?: VoiceGender;
  rate?: RateKey;
  showPrefs?: boolean;
  autoStartToken?: string | null;
  forceStop?: boolean;
  onNaturalEnd?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onBusyChange?: (busy: boolean) => void;
  onPrefsChange?: (voice: VoiceGender, rate: RateKey) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const [note, setNote] = useState<string | null>(null);
  const [voice, setVoice] = useState<VoiceGender>(voiceProp ?? "female");
  const [rate, setRate] = useState<RateKey>(rateProp ?? "normal");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const stopRef = useRef(false);
  const naturalEndRef = useRef(false);
  const lastAutoToken = useRef<string | null>(null);
  const voiceRef = useRef(voice);
  const rateRef = useRef(rate);

  useEffect(() => {
    const prefs = loadTtsPrefs();
    const v = voiceProp ?? prefs.voice;
    const r = rateProp ?? prefs.rate;
    setVoice(v);
    setRate(r);
    voiceRef.current = v;
    rateRef.current = r;
  }, [voiceProp, rateProp]);

  useEffect(() => {
    voiceRef.current = voice;
    rateRef.current = rate;
  }, [voice, rate]);

  function cleanupAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  useEffect(() => {
    return () => {
      stopRef.current = true;
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    onBusyChange?.(state !== "idle");
  }, [state, onBusyChange]);

  async function playServer(payload: string): Promise<boolean> {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 28000);
    let res: Response;
    try {
      res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: payload,
          locale,
          voice: voiceRef.current,
          rate: rateRef.current,
        }),
        signal: ctrl.signal,
      });
    } finally {
      window.clearTimeout(timer);
    }
    if (!res.ok) return false;
    const provider = res.headers.get("X-TTS-Provider");
    const blob = await res.blob();
    if (!blob.size || stopRef.current) return false;

    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audio.playbackRate = playbackRate(rateRef.current, provider);
    audioRef.current = audio;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        naturalEndRef.current = true;
        resolve();
      };
      audio.onerror = () => reject(new Error("audio_error"));
      audio.onpause = () => {
        if (stopRef.current) resolve();
      };
      void audio.play().then(() => setState("playing")).catch(reject);
    });
    return true;
  }

  function playBrowser(payload: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        reject(new Error("no_speech"));
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(payload);
      u.lang = speechLang(locale);
      const r = rateRef.current;
      const v = voiceRef.current;
      u.rate = r === "slow" ? 0.85 : r === "fast" ? 1.1 : 0.95;
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = speechLang(locale).slice(0, 2);
      const match =
        voices.find(
          (voiceItem) =>
            voiceItem.lang.toLowerCase().startsWith(langPrefix) &&
            (v === "male"
              ? /male|dmitry|guy|ostap|david/i.test(voiceItem.name)
              : /female|svetlana|jenny|polina|aria|zira/i.test(voiceItem.name)),
        ) ||
        voices.find((voiceItem) =>
          voiceItem.lang.toLowerCase().startsWith(langPrefix),
        );
      if (match) u.voice = match;
      u.onend = () => {
        naturalEndRef.current = true;
        resolve();
      };
      u.onerror = () => reject(new Error("speech_error"));
      setState("playing");
      window.speechSynthesis.speak(u);
    });
  }

  async function start() {
    const payload = chunkText(text);
    if (!payload) return;

    onStart?.();
    stopRef.current = false;
    naturalEndRef.current = false;
    setNote(null);
    setState("loading");
    cleanupAudio();

    try {
      const ok = await playServer(payload).catch(() => false);
      if (stopRef.current) return;
      if (!ok) {
        setNote(labels.unavailable);
        await playBrowser(payload);
      }
    } catch {
      if (stopRef.current) return;
      setNote(labels.unavailable);
      try {
        await playBrowser(payload);
      } catch {
        setNote(labels.unavailable);
      }
    } finally {
      if (!stopRef.current) {
        const endedNaturally = naturalEndRef.current;
        cleanupAudio();
        setState("idle");
        if (endedNaturally) onNaturalEnd?.();
      }
    }
  }

  function stop() {
    stopRef.current = true;
    naturalEndRef.current = false;
    cleanupAudio();
    setState("idle");
    onStop?.();
  }

  useEffect(() => {
    if (!autoStartToken) return;
    if (autoStartToken === lastAutoToken.current) return;
    lastAutoToken.current = autoStartToken;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartToken, text]);

  useEffect(() => {
    if (!forceStop) return;
    if (state === "idle") return;
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceStop]);

  const busy = state === "loading" || state === "playing";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-ink"
          onClick={() => (busy ? stop() : void start())}
          disabled={state === "loading"}
          aria-busy={state === "loading"}
        >
          {state === "loading"
            ? labels.loading
            : state === "playing"
              ? labels.stop
              : labels.listen}
        </button>
        {note ? (
          <span className="text-[0.85rem] text-[var(--muted)]">{note}</span>
        ) : null}
      </div>

      {showPrefs ? (
        <ListenPrefs
          voice={voice}
          rate={rate}
          labels={labels}
          disabled={busy}
          onVoice={(v) => {
            setVoice(v);
            saveTtsPrefs(v, rate);
            onPrefsChange?.(v, rate);
          }}
          onRate={(r) => {
            setRate(r);
            saveTtsPrefs(voice, r);
            onPrefsChange?.(voice, r);
          }}
        />
      ) : null}
    </div>
  );
}
