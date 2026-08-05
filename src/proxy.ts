import { NextResponse, type NextRequest } from "next/server";
import { site } from "../site.config";

/**
 * Keeps every host except the real one out of search results.
 *
 * The canonical home is scotlandcounted.org.uk. The site is also reachable on
 * scotlandcounted.co.uk (which 308-redirects at the edge) and on the Vercel
 * deployment domain. Anything indexed on those would have to be migrated and
 * redirected later, so this sends noindex on any host that is not the canonical
 * one. They stay crawlable, so audits and search engines can still follow the
 * full site.
 *
 * Gating on the host rather than hardcoding a flag means there is no switch to
 * remember on launch day: the moment the real domain resolves here, the header
 * stops being sent and the site becomes indexable on its own. A forgotten
 * noindex is the one SEO mistake that silently costs everything.
 */

const CANONICAL_HOST = new URL(site.url).host;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const host = request.headers.get("host");

  if (host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // The site has a public /embed route. Keep normal pages protected against
  // clickjacking without blocking those intentionally embeddable charts.
  const isEmbed = request.nextUrl.pathname === "/embed" || request.nextUrl.pathname.startsWith("/embed/");
  if (!isEmbed) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
  }

  return response;
}

/**
 * The export has to be named `config`. Next.js does not recognise any other
 * name, and an unrecognised one is not an error: the proxy simply runs with no
 * matcher at all, which the docs spell out as running "on every request,
 * including static files". This shipped as `proxyConfig`, so every stylesheet,
 * font and image went through the proxy to be told it was noindex.
 */
export const config = {
  // Written out in full on purpose. Next.js static-analyses this at build time
  // and rejects a variable: "Entry `matcher[0]` need to be static strings".
  // src/proxyMatcher.ts mirrors it so the tests can exercise the pattern
  // without pulling in next/server, and a test fails if the two ever diverge.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:csv|png|jpe?g|svg|webp|ico|pdf|woff2?)$).*)",
  ],
};
