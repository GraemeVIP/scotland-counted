import { NextResponse, type NextRequest } from "next/server";
import { site } from "../site.config";

/**
 * Keeps every host except the real one out of search results.
 *
 * The site is served from a temporary Vercel domain until scotlandcounted.co.uk
 * is registered and pointed at it. Anything indexed on the temporary domain
 * would have to be migrated and redirected later, so this sends noindex on any
 * host that is not the canonical one. The temporary host remains crawlable so
 * audits and search engines can follow the full site while the real domain is
 * being prepared.
 *
 * Gating on the host rather than hardcoding a flag means there is no switch to
 * remember on launch day: the moment the real domain resolves here, the header
 * stops being sent and the site becomes indexable on its own. A forgotten
 * noindex is the one SEO mistake that silently costs everything.
 */

const CANONICAL_HOST = new URL(site.url).host;

export function middleware(request: NextRequest) {
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

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
