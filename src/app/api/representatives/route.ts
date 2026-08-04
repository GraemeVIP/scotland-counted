import { NextResponse } from "next/server";
import { councils } from "@/lib/data/councils";
import {
  representativePostcodeFromRequest,
  type RepresentativeLookup,
} from "@/lib/representatives";
import { findMemberForConstituency, toRepresentative } from "@/lib/parliament";
import { POSTCODE_MESSAGES, lookupPostcodeArea } from "@/lib/postcode";
import {
  fetchHolyroodRepresentatives,
  SCOTTISH_PARLIAMENT_SOURCE_URL,
} from "@/lib/scottishParliament";
import { getSnapshotHolyroodRepresentatives } from "@/lib/data/holyrood";
import {
  getMpByConstituencyName,
  mpRecordToRepresentative,
} from "@/lib/data/mps";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE_HEADERS });
}

async function fetchLiveMp(constituency: string) {
  const member = await findMemberForConstituency(constituency);
  return member ? toRepresentative(member) : null;
}

async function lookupRepresentatives(request: Request) {
  const parsedPostcode = await representativePostcodeFromRequest(request);
  if (!parsedPostcode) {
    return error("Enter a full UK postcode, for example G12 8QQ.", 400);
  }

  try {
    const geography = await lookupPostcodeArea(parsedPostcode.compact);
    if (!geography.ok) {
      const status = geography.reason === "unavailable" ? 502 : 400;
      return error(POSTCODE_MESSAGES[geography.reason], status);
    }

    const area = geography.area;
    const council = councils.find((item) => item.code === area.councilCode);
    if (!council) {
      return error("I found the postcode but could not match its council data.", 404);
    }

    const snapshotMp = getMpByConstituencyName(area.constituency);
    const snapshotHolyrood =
      area.scottishParliamentConstituency && area.scottishParliamentRegion
        ? getSnapshotHolyroodRepresentatives(
            area.scottishParliamentConstituency,
            area.scottishParliamentRegion
          )
        : null;

    /**
     * Checked official snapshots make the normal path fast and resilient. Live
     * APIs are only a fallback for a new geography that is not in the latest
     * reviewed snapshot. Westminster and Holyrood still fail independently.
     */
    const mpPromise = snapshotMp
      ? Promise.resolve(mpRecordToRepresentative(snapshotMp))
      : fetchLiveMp(area.constituency);
    const holyroodPromise = snapshotHolyrood
      ? Promise.resolve(snapshotHolyrood)
      : area.scottishParliamentConstituency && area.scottishParliamentRegion
        ? fetchHolyroodRepresentatives(
            area.scottishParliamentConstituency,
            area.scottishParliamentRegion
          )
        : Promise.resolve(null);

    const [mpResult, holyroodResult] = await Promise.allSettled([
      mpPromise,
      holyroodPromise,
    ]);

    const mp = mpResult.status === "fulfilled" ? mpResult.value : null;
    const holyrood =
      holyroodResult.status === "fulfilled"
        ? holyroodResult.value
        : null;

    if (!mp) {
      return error("I could not find your MP just now. Please try again shortly.", 502);
    }

    const result: RepresentativeLookup = {
      postcode: area.postcode || parsedPostcode.formatted,
      council: { name: council.name, slug: council.slug },
      mp,
      msp: holyrood?.constituencyMsp ?? null,
      constituencyMsp: holyrood?.constituencyMsp ?? null,
      regionalMsps: holyrood?.regionalMsps ?? [],
      holyrood: {
        constituency: area.scottishParliamentConstituency,
        region: area.scottishParliamentRegion,
        source:
          holyrood?.source ?? {
            name: "Scottish Parliament Open Data",
            url: SCOTTISH_PARLIAMENT_SOURCE_URL,
          },
      },
      mspUnavailable: holyrood?.constituencyMsp
        ? undefined
        : area.scottishParliamentConstituency && area.scottishParliamentRegion
          ? "The Scottish Parliament's official data could not be read just now, so your MSPs could not be found. Your MP email is ready below."
          : "The postcode directory could not match this address to its Scottish Parliament areas. Your MP email is ready below.",
    };

    return NextResponse.json(result, { headers: NO_STORE_HEADERS });
  } catch {
    return error("The representative lookup is temporarily unavailable. Please try again shortly.", 502);
  }
}

/**
 * POST only, and that is the point: it keeps the exact postcode out of the
 * URL, and so out of access logs, Referer headers and anything anyone shares.
 *
 * There was a GET here for bookmarked diagnostic URLs. Nothing on the site
 * called it, both the app and the check script POST, and every request it
 * served wrote a reader's postcode into a log line. The result pages the site
 * wants people to share are the resolved area URLs, which name a council, not
 * a house.
 */
export async function POST(request: Request) {
  return lookupRepresentatives(request);
}
