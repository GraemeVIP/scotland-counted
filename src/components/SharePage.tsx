"use client";

import { useState } from "react";

export default function SharePage({
  title,
  text,
  label = "Share this local evidence",
}: {
  title: string;
  text: string;
  /** Area pages share evidence; articles share an article. */
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  }

  return (
    <button type="button" onClick={share} className="btn btn-ghost" aria-live="polite">
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </svg>
      {state === "copied" ? "Link copied" : label}
    </button>
  );
}
