import { BAND_LETTERS, chargesFor, councilTaxByBand, councilTaxChangeFor } from "@/lib/data/councilTax";
import { getCouncil } from "@/lib/data/councils";

/**
 * The figures people search for most, in one place.
 *
 * The homepage tiles and the quick answer boxes on guide pages read from here,
 * so a rate that changes is changed once. Council tax figures are computed from
 * councilTax.ts rather than typed in, so they cannot drift from the band pages.
 */

export const MINIMUM_WAGE = {
  source: { publisher: "GOV.UK", url: "https://www.gov.uk/national-minimum-wage-rates" },
  /** National Living Wage, age 21 and over, from 1 April each year. */
  history: [
    { year: 2024, rate: 11.44 },
    { year: 2025, rate: 12.21 },
    { year: 2026, rate: 12.71 },
    { year: 2027, rate: 13.21 },
  ],
  current: { from: "2026-04-01", over21: 12.71, age18to20: 10.85, under18: 8, apprentice: 8 },
  next: { from: "2027-04-01", over21: 13.21, age18to20: 11.27, under18: 8.31, apprentice: 8.31 },
} as const;

export const REAL_LIVING_WAGE = {
  uk: 14.1,
  london: 15.45,
  announced: "2026-10-15",
  deadline: "2027-05-01",
  source: { publisher: "Living Wage Foundation", url: "https://www.livingwage.org.uk/what-real-living-wage" },
} as const;

export function bandFor(slug: string, band: (typeof BAND_LETTERS)[number]) {
  const councilTax = councilTaxByBand[slug]?.[band];
  const change = councilTaxChangeFor(slug, band);
  const total = chargesFor(slug)?.find((charge) => charge.band === band)?.total;
  if (councilTax === undefined || !change || total === undefined) {
    throw new Error(`No ${band} council tax for ${slug}`);
  }
  return { councilTax, change, total };
}

/** Lowest and highest full Band D bill, water included, across all 32 councils. */
export function bandDRange() {
  const bills = Object.keys(councilTaxByBand).map((slug) => ({
    slug,
    name: getCouncil(slug)?.name ?? slug,
    total: bandFor(slug, "D").total,
  }));
  bills.sort((a, b) => a.total - b.total);
  return { lowest: bills[0], highest: bills[bills.length - 1], count: bills.length };
}

export const pounds = (value: number, pence = false) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence ? 2 : 0,
    maximumFractionDigits: pence ? 2 : 0,
  }).format(value);
