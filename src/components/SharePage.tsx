"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export default function SharePage({
  title,
  text,
  path,
  label = "Share",
  className = "",
}: {
  title: string;
  text: string;
  /** Optional explicit path (including query string on /compare-areas) to share. */
  path?: string;
  /** Short lead-in label shown beside the share buttons. */
  label?: string;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const [copied, setCopied] = useState(false);

  const resolvedPath = path ?? (pathname === "/" ? "" : pathname);
  const shareUrl = resolvedPath.startsWith("http")
    ? resolvedPath
    : `${site.url}${resolvedPath}`;
  const shareText = text || title;

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const pillCls =
    "ui inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3.5 py-1.5 text-[14px] font-[580] text-[var(--ink)] no-underline transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]";

  return (
    <div
      className={`no-print flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label={label}
    >
      <span className="ui mr-1 text-[13.5px] font-[600] text-[var(--muted)]">{label}:</span>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={pillCls}
        aria-label={`Share on WhatsApp: ${title}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        WhatsApp
      </a>

      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={pillCls}
        aria-label={`Share on Facebook: ${title}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
        Facebook
      </a>

      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={pillCls}
        aria-label={`Share on X: ${title}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </a>

      <button type="button" onClick={copyLink} className={pillCls} aria-live="polite">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
