/**
 * The local facts shown the moment a postcode resolves, for all 32 councils.
 *
 * The homepage promises figures for your area, what your council spends, what
 * you keep from your pay and who decides each of it. For a long time the form
 * under that promise went straight to the email composer, so a reader was
 * told about four things and handed the fifth. This is the data behind
 * keeping the promise in the order it is made.
 *
 * Built on the server and passed down as a prop. Importing the council
 * datasets into the client instead would cost several hundred kilobytes on
 * every page to answer a question most visitors never ask. Thirty-two rows of
 * this is about three kilobytes.
 *
 * Every figure here already appears on a page of its own, with its source.
 * Nothing is computed that is not computed identically elsewhere.
 */

// Extensions kept explicit so this runs under `node --test` as well as Next.
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "./data/councils.ts";
import { gapFor, NATIONAL } from "./data/councilBudgetMechanics.ts";
import { RESPONSIBILITIES } from "./data/responsibilities.ts";

export type LocalFacts = {
  councilName: string;
  childPovertyPct: number;
  childPovertyCount: number;
  childPovertyYear: string;
  /** The same measure for Scotland, so the local figure has a scale. */
  scotlandPct: number;
  /** Change across the published series, signed. */
  changePoints: number;
  firstYear: string;
  /**
   * 2026/27 budget gap in £m. Negative is a surplus. Absent where the
   * bulletin gives no figure for this council.
   */
  budgetGapM?: number;
};

/** Keyed by council slug, which is also the slug of every page it links to. */
export function buildLocalFacts(): Record<string, LocalFacts> {
  const latestYear = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const scotlandPct = SCOTLAND_PCTS[SCOTLAND_PCTS.length - 1];

  const out: Record<string, LocalFacts> = {};
  for (const council of councils) {
    const gap = gapFor(council.slug);
    out[council.slug] = {
      councilName: council.name.replace(/ Council$/, ""),
      childPovertyPct: council.pcts[council.pcts.length - 1],
      childPovertyCount: council.counts[council.counts.length - 1],
      childPovertyYear: latestYear,
      scotlandPct,
      changePoints: council.change,
      firstYear: COUNCIL_YEARS[0],
      ...(gap === undefined ? {} : { budgetGapM: gap }),
    };
  }
  return out;
}

export type ResponsibilitySplit = {
  uk: number;
  scotland: number;
  council: number;
  total: number;
};

/**
 * How the tracked issues split between the three levels of government.
 *
 * Counted from the data rather than written out, so the homepage cannot claim
 * a split the /who-decides page does not show.
 */
export function responsibilitySplit(): ResponsibilitySplit {
  const count = (level: string) => RESPONSIBILITIES.filter((r) => r.level === level).length;
  return {
    uk: count("uk"),
    scotland: count("scotland"),
    council: count("council"),
    total: RESPONSIBILITIES.length,
  };
}

/** The national line that gives one council's gap its context. */
export const NATIONAL_GAP_CONTEXT = {
  councilsWithGap: NATIONAL.councilsWithGap,
  councilsTotal: NATIONAL.councilsTotal,
  gapTotal: NATIONAL.gapTotal,
} as const;
