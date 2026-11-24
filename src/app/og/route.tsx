import { type NextRequest } from "next/server";
import { renderOgForPath } from "@/lib/ogResolver";

export const runtime = "nodejs";

/**
 * Dynamic 1200x630 Open Graph share card endpoint for every URL on the site.
 *
 * Cached on the CDN for 30 days so every page, MP, MSP, investigation, council,
 * salary, council-tax and comparison pairing gets a unique branded card without
 * rendering hundreds of PNGs during every build.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawPath = searchParams.get("path") ?? "/";
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const a = searchParams.get("a") ?? undefined;
  const b = searchParams.get("b") ?? undefined;
  const title = searchParams.get("t")?.slice(0, 140) ?? undefined;
  const description = searchParams.get("d")?.slice(0, 220) ?? undefined;

  const response = renderOgForPath(path, { a, b, title, description });
  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400",
  );
  return response;
}
