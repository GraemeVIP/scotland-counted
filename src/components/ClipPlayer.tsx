import type { ReactNode } from "react";

/**
 * A short portrait clip, hosted on this site.
 *
 * preload="none" means only the poster is fetched until somebody presses
 * play, so the page costs the same as one with a single photo. Hosting the
 * file here, rather than embedding the social post it was shared in, adds no
 * third-party script or cookie and leaves the Content-Security-Policy as it
 * is: media-src falls back to default-src 'self'.
 *
 * Clips filmed by somebody else are credited in the caption, with a way to
 * ask for the clip to come down.
 */
export default function ClipPlayer({
  src,
  poster,
  title,
  children,
}: {
  /** Self-hosted video in /public. */
  src: string;
  /** Self-hosted poster in /public, the same 9:16 shape as the clip. */
  poster: string;
  title: string;
  /** Caption, including the credit. */
  children?: ReactNode;
}) {
  return (
    <figure className="my-8">
      <div
        className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--deep)]"
        style={{ aspectRatio: "9 / 16", boxShadow: "var(--shadow-2)" }}
      >
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          aria-label={title}
          className="block h-full w-full object-cover"
        />
      </div>
      {children && (
        <figcaption className="mx-auto mt-3 max-w-[480px] text-center text-[15px] leading-[1.55] text-[var(--ink-2)]">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
