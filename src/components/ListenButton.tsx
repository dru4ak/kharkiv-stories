"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

type Labels = {
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

function chunkText(text: string, max = 850): string {
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

export function ListenButton({
  text,
  locale,
  labels,
}: {
  text: string;
  locale: Locale;
  labels: Labels;
}) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const [note, setNote] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const stopRef = useRef(false);

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

  async function playHf(payload: string): Promise<boolean> {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: payload, locale }),
    });
    if (!res.ok) return false;
    const blob = await res.blob();
    if (!blob.size || stopRef.current) return false;

    const url = URL.createObjectURL(blob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
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
      u.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) =>
        v.lang.toLowerCase().startsWith(speechLang(locale).slice(0, 2)),
      );
      if (match) u.voice = match;
      u.onend = () => resolve();
      u.onerror = () => reject(new Error("speech_error"));
      setState("playing");
      window.speechSynthesis.speak(u);
    });
  }

  async function start() {
    const payload = chunkText(text);
    if (!payload) return;

    stopRef.current = false;
    setNote(null);
    setState("loading");
    cleanupAudio();

    try {
      const usedHf = await playHf(payload).catch(() => false);
      if (stopRef.current) return;
      if (!usedHf) {
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
        cleanupAudio();
        setState("idle");
      }
    }
  }

  function stop() {
    stopRef.current = true;
    cleanupAudio();
    setState("idle");
  }

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
