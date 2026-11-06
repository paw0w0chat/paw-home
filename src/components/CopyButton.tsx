"use client";

import { useState } from "react";

export function CopyButton({ text, label = "COPY" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      setDone(false);
    }
  };
  return (
    <button type="button" className="btn-copy" onClick={copy} disabled={!text} aria-live="polite">
      {done ? "COPIED" : label}
    </button>
  );
}
