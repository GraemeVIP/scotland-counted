import { NextResponse } from "next/server";
import { getConstituency } from "@/lib/data/constituencies";
import { fetchMpForConstituency } from "@/lib/parliament";
import {
  getMpByConstituencyName,
  mpRecordToRepresentative,
} from "@/lib/data/mps";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

/**
 * Look up the sitting MP for one of our constituency pages.
 *
 * Deliberately needs no postcode: a Westminster seat already identifies the
 * MP, so someone landing on a constituency page from search can act without
 * being sent back to the start of the postcode flow.
 */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("constituency")?.trim() ?? "";
  const constituency = getConstituency(slug);
  if (!constituency) return error("I do not have a page for that area.", 404);

  try {
    const snapshot = getMpByConstituencyName(constituency.name);
    const mp = snapshot
      ? mpRecordToRepresentative(snapshot)
      : await fetchMpForConstituency(constituency.name);
    if (!mp) {
      return error(
        "Parliament's records could not be reached just now. Try again shortly.",
        502
      );
    }

    return NextResponse.json(
      { mp, constituency: { name: constituency.name, slug: constituency.slug } },
      { headers: NO_STORE_HEADERS }
    );
  } catch {
    return error("Parliament's records could not be reached just now. Try again shortly.", 502);
  }
}
