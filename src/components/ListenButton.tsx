"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

export type ListenLabels = {
  listen: string;
  stop: string;
  loading: string;
  unavailable: string;
};

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

async function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const current = window.speechSynthesis.getVoices();
  if (current.length) return current;
  await new Promise<void>((resolve) => {
    const done = () => resolve();
    window.speechSynthesis.addEventListener("voiceschanged", done, {
      once: true,
    });
    window.setTimeout(done, 700);
  });
  return window.speechSynthesis.getVoices();
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  locale: Locale,
): SpeechSynthesisVoice | null {
  const langPrefix = speechLang(locale).slice(0, 2).toLowerCase();
  const sameLang = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langPrefix),
  );
  if (!sameLang.length) return null;
  const neural = sameLang.find((v) =>
    /natural|neural|online/i.test(v.name),
  );
  return neural || sameLang[0];
}

export function ListenButton({
  text,
  locale,
  labels,
  autoStartToken = null,
  forceStop = false,
  onNaturalEnd,
  onStart,
  onStop,
}: {
  text: string;
  locale: Locale;
  labels: ListenLabels;
  autoStartToken?: string | null;
  forceStop?: boolean;
  onNaturalEnd?: () => void;
  onStart?: () => void;
  onStop?: () => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const [note, setNote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const stopRef = useRef(false);
  const naturalEndRef = useRef(false);
  const lastAutoToken = useRef<string | null>(null);

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

  async function playServer(payload: string): Promise<boolean> {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 45000);
    let res: Response;
    try {
      res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: payload,
          locale,
          voice: "female",
          rate: "normal",
        }),
        signal: ctrl.signal,
      });
    } finally {
      window.clearTimeout(timer);
    }
    if (!res.ok) return false;
    const blob = await res.blob();
    if (!blob.size || stopRef.current) return false;

    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
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

  function playBrowser(
    payload: string,
    preferred: SpeechSynthesisVoice | null,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        reject(new Error("no_speech"));
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(payload);
      u.lang = preferred?.lang || speechLang(locale);
      u.rate = 0.98;
      if (preferred) u.voice = preferred;
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
      const voices = await ensureVoices();
      const neural = pickVoice(voices, locale);
      if (neural && !stopRef.current) {
        await playBrowser(payload, neural);
        return;
      }

      const ok = await playServer(payload).catch(() => false);
      if (stopRef.current) return;
      if (ok) return;

      setNote(labels.unavailable);
      await playBrowser(payload, pickVoice(voices, locale));
    } catch {
      if (stopRef.current) return;
      setNote(labels.unavailable);
      try {
        const voices = await ensureVoices();
        await playBrowser(payload, pickVoice(voices, locale));
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
  );
}
