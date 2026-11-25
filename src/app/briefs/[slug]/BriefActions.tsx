"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../briefs.module.css";

export function BriefToolbar({
  currentSlug,
  councils,
  grantParagraph,
}: {
  currentSlug: string;
  councils: { slug: string; name: string }[];
  grantParagraph: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  async function copyParagraph() {
    try {
      await navigator.clipboard.writeText(grantParagraph);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`${styles.actionBar} no-print`}>
      <div className={styles.actionGroup}>
        <button type="button" className={styles.primaryBtn} onClick={() => window.print()}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Print or save 2-page PDF</span>
        </button>

        <button type="button" className={styles.ghostBtn} onClick={copyParagraph}>
          <span>{copied ? "Copied funding-bid summary" : "Copy funding-bid summary"}</span>
        </button>
      </div>

      <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <span className="sr-only">Switch Scottish council area</span>
        <select
          aria-label="Switch Scottish council area"
          className={styles.councilSelect}
          value={currentSlug}
          onChange={(e) => router.push(`/briefs/${e.target.value}`)}
        >
          {councils.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function CopyGrantButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className={`${styles.copyInlineBtn} no-print`} onClick={handleCopy}>
      {copied ? "Copied with citations" : "Copy paragraph"}
    </button>
  );
}
