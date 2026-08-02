import type { VoteRecord } from "./voting";

export type Representative = {
  role: "MP" | "MSP";
  name: string;
  party: string;
  constituency: string;
  email: string;
  memberId?: number;
  phone?: string;
  officeAddress?: string;
  profileUrl: string;
  /** Local copy of the official parliamentary portrait, when published. */
  photoUrl?: string;
  /** Original official portrait URL, retained only for deliberate directory refreshes. */
  photoSourceUrl?: string;
  /** Start of the representative's current constituency or regional term. */
  termStart?: string;
  committeeRoles?: string[];
  governmentRoles?: string[];
  partyRoles?: string[];
  /** Most recent recorded votes, when the relevant Parliament publishes them. */
  votes?: VoteRecord[];
  /** How an MSP represents the reader. MPs do not use this field. */
  representationType?: "constituency" | "regional";
};

export type RepresentativeSource = {
  name: string;
  url: string;
  /** ISO timestamp for when Scotland Counted last checked the official data. */
  checkedAt?: string;
};

export type RepresentativeLookup = {
  postcode: string;
  council: {
    name: string;
    slug: string;
  };
  mp: Representative;
  /**
   * Backwards-compatible alias for constituencyMsp. The main email flow keeps
   * using the constituency MSP automatically, so the reader never has to
   * understand or choose between eight representatives before taking action.
   */
  msp: Representative | null;
  /** The one MSP elected for the reader's Scottish Parliament constituency. */
  constituencyMsp: Representative | null;
  /** The seven additional MSPs elected for the reader's Holyrood region. */
  regionalMsps: Representative[];
  holyrood: {
    constituency: string | null;
    region: string | null;
    source: RepresentativeSource;
  };
  /** A plain-English reason to show the reader when msp is null. */
  mspUnavailable?: string;
};

export type ParsedRepresentativePostcode = {
  compact: string;
  formatted: string;
};

export function representativeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The crawlable contact page for a representative returned by the postcode API. */
export function representativePagePath(representative: Representative) {
  const slug = representativeSlug(representative.constituency);
  if (representative.role === "MP") return `/representatives/mps/${slug}`;
  if (representative.representationType === "regional") {
    return `/representatives/msps/regions/${slug}/${representativeSlug(representative.name)}`;
  }
  return `/representatives/msps/constituencies/${slug}`;
}

/** Validate and consistently format a postcode without retaining the raw input. */
export function parseRepresentativePostcode(value: unknown): ParsedRepresentativePostcode | null {
  if (typeof value !== "string") return null;

  const compact = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(compact)) return null;

  return {
    compact,
    formatted: `${compact.slice(0, -3)} ${compact.slice(-3)}`,
  };
}

/**
 * Read a postcode from POST JSON for the normal private flow, or from the old
 * GET query parameter while bookmarked links and diagnostics transition.
 */
export async function representativePostcodeFromRequest(
  request: Request
): Promise<ParsedRepresentativePostcode | null> {
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as { postcode?: unknown } | null;
      return parseRepresentativePostcode(body?.postcode);
    } catch {
      return null;
    }
  }

  return parseRepresentativePostcode(new URL(request.url).searchParams.get("postcode"));
}

/** Carries a postcode from the homepage to the action tool in this browser tab only. */
export const POSTCODE_SESSION_KEY = "scotland-counted-postcode";
