/**
 * A copy of the proxy matcher, for testing only.
 *
 * The real one lives as a string literal in proxy.ts, because Next.js
 * static-analyses the config at build time and rejects a variable. This module
 * exists so the pattern can be exercised by `node --test`, which cannot import
 * proxy.ts: that pulls in `next/server`, which only resolves inside the build.
 *
 * The duplication is deliberate but not unguarded. proxy.test.ts extracts the
 * literal out of proxy.ts and fails if it no longer matches this one.
 *
 * Extensions are excluded rather than directories, so generated routes stay
 * covered. robots.txt and sitemap.xml are deliberately left in: on a preview
 * host those should still carry the noindex header.
 */
export const PROXY_MATCHER =
  "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:csv|png|jpe?g|svg|webp|ico|pdf|woff2?)$).*)";

/** Does the proxy run for this path? Mirrors how Next.js applies the matcher. */
export function proxyRunsOn(pathname: string): boolean {
  return new RegExp(`^${PROXY_MATCHER}$`).test(pathname);
}
