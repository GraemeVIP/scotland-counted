/**
 * Headers every page gets, applied as static rules from next.config.ts.
 *
 * These used to be added by a proxy (src/proxy.ts), which Next.js runs as a
 * function on every request. On Vercel that meant a function call, and server
 * time from the free plan's monthly allowance, for every page view and every
 * prefetch, only to attach three headers. Static rules do the same job at
 * Vercel's edge without running anything.
 *
 * What they do:
 *
 *   noindex on any host that is not the canonical one, so the Vercel
 *   deployment domains and scotlandcounted.co.uk stay out of search results
 *   while staying crawlable. Gating on the host means there is no switch to
 *   remember on launch day: on the real domain the header is never sent.
 *
 *   X-Frame-Options on everything except /embed, which exists to be framed.
 *
 *   a stricter set on the review moderation pages, which must never be
 *   indexed, cached or leak their address in a referrer.
 *
 * scripts/check-proxy.mjs checks the real responses against a build.
 */

/**
 * Every path except built assets. Extensions are excluded rather than
 * directories, so generated routes stay covered: on a preview host,
 * robots.txt and sitemap.xml should still say noindex.
 */
export const PAGE_PATHS =
  "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:csv|png|jpe?g|svg|webp|ico|pdf|woff2?)$).*)";

/** The same, minus /embed and everything under it. */
export const FRAME_PROTECTED_PATHS =
  "/((?!embed(?:/|$)|_next/static|_next/image|favicon\\.ico|.*\\.(?:csv|png|jpe?g|svg|webp|ico|pdf|woff2?)$).*)";

/** In order: when two rules set the same header, the later one wins. */
export function pageHeaderRules(canonicalHost: string) {
  return [
    {
      source: PAGE_PATHS,
      // The host is left unescaped on purpose. Read as a pattern or as a
      // literal, it matches the canonical host either way.
      missing: [{ type: "host" as const, value: canonicalHost }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    },
    {
      source: FRAME_PROTECTED_PATHS,
      headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
    },
    {
      // Last, so its noindex and referrer policy override everything above.
      source: "/review-moderation/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Cache-Control", value: "private, no-store, max-age=0" },
      ],
    },
  ];
}

/** Does one of the patterns above cover this path? Mirrors how Next.js applies it. */
export function sourceCovers(source: string, pathname: string): boolean {
  return new RegExp(`^${source}$`).test(pathname);
}
