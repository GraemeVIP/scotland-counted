"use client";

import { useState } from "react";
import Image from "next/image";
import { infographic } from "@/lib/data/infographic";

/**
 * The one-page summary, offered at the moment somebody is most likely to pass
 * it on.
 *
 * It is portrait, because it was made for a phone screen and for the feeds
 * people actually share things in. That shape is awkward on a wide desktop
 * layout, so on desktop it sits in one column beside the words rather than
 * being stretched to fill the row.
 *
 * The share button uses the native sheet where the browser has one — on a
 * phone that is the whole path, straight into WhatsApp or Instagram. Where
 * there is no share sheet it falls back to copying the link, and the download
 * is always there regardless.
 */

export default function ShareGraphic({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window === "undefined" ? "" : window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: infographic.title, text: infographic.shareText, url });
        return;
      } catch {
        /* Dismissed the sheet — fall through to copying. */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked; the download still works. */
    }
  }

  return (
    <section
      className={`grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center ${className}`}
      aria-labelledby="share-graphic"
    >
      <a
        href={infographic.src}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] no-underline"
        style={{ boxShadow: "var(--shadow-2)" }}
        aria-label={`${infographic.title} — open the full-size image`}
      >
        <Image
          src={infographic.src}
          alt={infographic.alt}
          width={infographic.width}
          height={infographic.height}
          sizes="(max-width: 1024px) 100vw, 420px"
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </a>

      <div>
        <p className="kicker mb-3 text-[var(--action)]">Pass it on</p>
        <h2 id="share-graphic" className="display-stat text-[clamp(30px,3.8vw,46px)] max-w-[16ch]">
          Send this to someone who thinks poverty means not working
        </h2>
        <p className="mt-5 max-w-[46ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
          Every figure on it is on this site with the organisation that published it. Three in four
          children in poverty live with someone who works — that one fact changes the argument, and
          almost nobody knows it.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={share} className="btn btn-primary">
            {copied ? "Link copied" : "Share it"}
            <span aria-hidden="true">→</span>
          </button>
          <a
            href={infographic.src}
            download={infographic.downloadName}
            className="btn border-[var(--rule-strong)] hover:border-[var(--brand)]"
          >
            Download the image
          </a>
        </div>

        <p className="mt-5 text-[15px] leading-[1.55] text-[var(--muted)]">
          Free to reuse with credit. Made for a phone screen, so it fits a story or a post as it is.
        </p>
      </div>
    </section>
  );
}
