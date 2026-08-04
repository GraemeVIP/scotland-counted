"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A YouTube video that costs nothing until somebody wants to watch it.
 *
 * A normal YouTube embed pulls about a megabyte of third-party JavaScript and
 * sets cookies on every page view, whether or not anyone presses play. On a
 * site that tells people "nothing you type is sent anywhere" that is the wrong
 * trade, and it would slow the page for the majority who never watch.
 *
 * So this is a facade: a self-hosted poster and a play button, and the iframe
 * is only created on the click. That also keeps the Content-Security-Policy
 * tight, the poster is served from this origin, so img-src stays 'self', and
 * the only concession is youtube-nocookie.com in frame-src.
 *
 * youtube-nocookie.com is YouTube's privacy-enhanced host: no cookie is set
 * until playback actually begins.
 */

export default function VideoEmbed({
  id,
  title,
  poster,
  caption,
  onDark = false,
  className = "",
}: {
  /** The YouTube video id. */
  id: string;
  title: string;
  /** Self-hosted poster in /public. */
  poster: string;
  caption?: string;
  /** Set on a dark slab, where the usual caption grey would disappear. */
  onDark?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={className}>
      <div
        className="relative overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--deep)]"
        style={{ aspectRatio: "16 / 9", boxShadow: "var(--shadow-2)" }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play video: ${title}`}
          >
            <Image
              src={poster}
              alt={`${title} video thumbnail`}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/*
              No title or "watch on YouTube" caption over the poster. These
              thumbnails already carry their own words, so a second layer of
              text on top of them fought the artwork and repeated the heading
              sitting right beside it. A play button on a picture is
              self-explanatory.

              The scrim is only deep enough to keep the button readable over a
              pale frame, and it lifts on hover.
            */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/5"
            />

            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--action)] transition-transform duration-300 group-hover:scale-110"
              style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.45)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {caption && (
        <figcaption
          className={`mt-3 text-[15px] leading-[1.55] ${
            onDark ? "opacity-75" : "text-[var(--ink-2)]"
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
