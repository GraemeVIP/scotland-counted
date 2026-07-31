/**
 * Turning a postcode into the two things a lookup needs: which council area it
 * sits in, and which UK Parliament seat covers it.
 *
 * There are two postcode directories and they do not hold the same postcodes.
 * The Scottish Postcode Directory (postcodes.io /scotland) carries Holyrood
 * detail but omits some live Scottish postcodes; the ONS directory
 * (postcodes.io /postcodes) has full coverage. PA75 6NU in Argyll and Bute is a
 * real example: introduced in 1980, absent from the SPD, and previously told
 * "not found in Scotland" — a false rejection aimed at the resident.
 *
 * So we ask the Scottish directory first and fall back to the ONS one, which
 * also lets us tell three different failures apart instead of blaming the user
 * for all of them.
 */

import { REQUEST_TIMEOUT_MS } from "@/lib/parliament";

export type PostcodeArea = {
  postcode: string;
  /** ONS GSS code for the council area, e.g. S12000049. */
  councilCode: string;
  /** UK Parliament constituency name on 2024 boundaries. */
  constituency: string;
};

export type PostcodeFailure =
  /** No such postcode in either directory. */
  | "not-found"
  /** A real postcode, but not a Scottish one. */
  | "outside-scotland"
  /** Found, but the directory did not give us a council or a seat. */
  | "incomplete"
  /** Neither directory could be reached. */
  | "unavailable";

export type PostcodeResult =
  | { ok: true; area: PostcodeArea }
  | { ok: false; reason: PostcodeFailure };

type ScottishResponse = {
  result?: {
    postcode: string;
    uk_parliamentary_constituency: string | null;
    codes: { council_area: string | null };
  };
};

type OnsResponse = {
  result?: {
    postcode: string;
    country: string | null;
    parliamentary_constituency_2024: string | null;
    parliamentary_constituency: string | null;
    codes: { admin_district: string | null };
  };
};

async function fetchJson(url: string) {
  return fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

/** The plain-English message for each way a lookup can fail. */
export const POSTCODE_MESSAGES: Record<PostcodeFailure, string> = {
  "not-found": "We could not find that postcode. Check it and try again.",
  "outside-scotland": "That postcode is not in Scotland. This site only covers Scotland.",
  incomplete: "We found that postcode but could not match it to a council area.",
  unavailable: "The postcode service is not responding just now. Please try again shortly.",
};

export async function lookupPostcodeArea(compact: string): Promise<PostcodeResult> {
  const encoded = encodeURIComponent(compact);

  // The Scottish directory first: it is the more specific source for Scotland.
  try {
    const response = await fetchJson(`https://api.postcodes.io/scotland/postcodes/${encoded}`);
    if (response.ok) {
      const area = ((await response.json()) as ScottishResponse).result;
      if (area?.uk_parliamentary_constituency && area.codes.council_area) {
        return {
          ok: true,
          area: {
            postcode: area.postcode,
            councilCode: area.codes.council_area,
            constituency: area.uk_parliamentary_constituency,
          },
        };
      }
    } else if (response.status !== 404) {
      throw new Error(`Scottish postcode lookup failed with ${response.status}`);
    }
  } catch {
    // Fall through: the ONS directory can still answer this.
  }

  // Fall back to the ONS directory, which covers every live UK postcode.
  try {
    const response = await fetchJson(`https://api.postcodes.io/postcodes/${encoded}`);
    if (response.status === 404) return { ok: false, reason: "not-found" };
    if (!response.ok) return { ok: false, reason: "unavailable" };

    const area = ((await response.json()) as OnsResponse).result;
    if (!area) return { ok: false, reason: "not-found" };
    if (area.country !== "Scotland") return { ok: false, reason: "outside-scotland" };

    const constituency =
      area.parliamentary_constituency_2024 ?? area.parliamentary_constituency ?? null;
    if (!constituency || !area.codes.admin_district) {
      return { ok: false, reason: "incomplete" };
    }

    return {
      ok: true,
      area: {
        postcode: area.postcode,
        councilCode: area.codes.admin_district,
        constituency,
      },
    };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
