"use client";

import { useEffect, useState } from "react";

export function ScrollToTop({ label = "Наверх" }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] bg-[var(--paper-elevated)] text-[1.15rem] text-[var(--ink)] shadow-[var(--shadow)] transition hover:border-[var(--brick)] hover:text-[var(--brick)] sm:bottom-7 sm:right-7"
    >
      ↑
    </button>
  );
}
