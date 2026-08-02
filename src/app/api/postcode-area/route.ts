import { NextResponse } from "next/server";
import { councils } from "@/lib/data/councils";
import { POSTCODE_MESSAGES, lookupPostcodeArea } from "@/lib/postcode";
import { representativePostcodeFromRequest } from "@/lib/representatives";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

/**
 * The council-tax calculator only needs a council area. Keeping that lookup
 * separate avoids waiting for two Parliament services before showing a bill.
 */
export async function POST(request: Request) {
  const postcode = await representativePostcodeFromRequest(request);
  if (!postcode) return error("Enter a full UK postcode, for example G12 8QQ.", 400);

  const result = await lookupPostcodeArea(postcode.compact);
  if (!result.ok) {
    return error(
      POSTCODE_MESSAGES[result.reason],
      result.reason === "unavailable" ? 502 : 400
    );
  }

  const council = councils.find((item) => item.code === result.area.councilCode);
  if (!council) {
    return error("I found the postcode but could not match its council data.", 404);
  }

  return NextResponse.json(
    {
      postcode: result.area.postcode || postcode.formatted,
      council: { name: council.name, slug: council.slug },
    },
    { headers: NO_STORE_HEADERS }
  );
}
