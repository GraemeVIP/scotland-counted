"use client";

import { useState } from "react";

/** A pre-written, sourced stat line with a one-tap copy button. */
export default function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-stretch gap-2">
      <p className="flex-1 text-[15.5px] leading-[1.55] text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--rule)] rounded-l-[var(--r-s)] px-4 py-3 m-0">
        {text}
      </p>
      <button
        type="button"
        onClick={copy}
        className="ui shrink-0 self-stretch bg-[var(--ink)] text-[var(--paper)] rounded-r-[var(--r-s)] px-4 text-[13px] font-[620] hover:bg-[var(--brand)] hover:text-white transition-colors"
        aria-label={copied ? "Copied" : "Copy this line"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
