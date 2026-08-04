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
 * Read a postcode from a POST body. Deliberately the only way in.
 *
 * This used to fall back to a ?postcode= query parameter, for bookmarked
 * diagnostic URLs. A postcode in a URL is a postcode in the access log, in
 * the Referer header sent to every third party the next page touches, and in
 * whatever the reader pastes to a friend. The site promises on the homepage,
 * the privacy page and the form itself that it does not save your postcode,
 * and a URL is the one place it could not help but save it.
 *
 * A GET is now unreadable rather than merely unused, so no future handler can
 * reintroduce the path by accident.
 */
export async function representativePostcodeFromRequest(
  request: Request
): Promise<ParsedRepresentativePostcode | null> {
  if (request.method !== "POST") return null;
  try {
    const body = (await request.json()) as { postcode?: unknown } | null;
    return parseRepresentativePostcode(body?.postcode);
  } catch {
    return null;
  }
}

/** Carries a postcode from the homepage to the action tool in this browser tab only. */
export const POSTCODE_SESSION_KEY = "scotland-counted-postcode";

export type LocalAreaLink = {
  href: string;
  label: string;
  /** What is actually on the other end, so the link is worth the tap. */
  blurb: string;
};

/**
 * Where a resolved postcode can take the reader next.
 *
 * A postcode is the best key this site has into its own data, and until now it
 * bought you four names and an email button. It can buy the whole local
 * record: what people here earn, what the council does with the money, what
 * every band on the tax bill costs, and the figures for the MP's area rather
 * than the council's.
 *
 * Every href names a council or a constituency. None carries the postcode, so
 * all of them are safe to bookmark, send to a neighbour or post in public,
 * which is exactly what a raw postcode URL never was. The reader types
 * something private and gets back only public pages.
 *
 * Both slug schemes are derived rather than looked up, so a test walks all 32
 * councils and all 57 constituencies and fails if any of these would 404.
 */
export function localAreaLinks(lookup: {
  council: { name: string; slug: string };
  mp: Pick<Representative, "constituency">;
}): LocalAreaLink[] {
  /*
   * Names arrive as the place, "Glasgow City", never "Glasgow City Council".
   * Two of these labels want the place and one wants the body, because it is
   * the council that spends the money, not the city. Stripping before adding
   * means a name that ever gains the suffix cannot read "Council Council".
   */
  const place = lookup.council.name.replace(/ Council$/, "");
  const body = `${place} Council`;
  const links: LocalAreaLink[] = [
    {
      href: `/areas/${lookup.council.slug}`,
      label: `Pay and poverty in ${place}`,
      blurb: "What people here actually earn, and how many are behind.",
    },
    {
      href: `/councils/${lookup.council.slug}`,
      label: `What ${body} does with the money`,
      blurb: "Its budget, the gap it says it has, and who paid to close it.",
    },
    {
      href: `/council-tax-bands-scotland/${lookup.council.slug}`,
      label: `Council tax bands in ${place}`,
      blurb: "Every band, with the water charge that lands on the same bill.",
    },
  ];

  const constituency = lookup.mp.constituency?.trim();
  if (constituency) {
    links.push({
      href: `/constituencies/${representativeSlug(constituency)}`,
      label: `${constituency} in numbers`,
      blurb: "Your MP's area on its own, which is not the same as the council.",
    });
  }

  return links;
}
