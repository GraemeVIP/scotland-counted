import type { BAND_LETTERS } from "@/lib/data/councilTax";
import { pounds } from "@/lib/data/quickAnswers";

/**
 * The rules around a council tax bill: what each band was worth in 1991, how
 * to challenge a band, Council Tax Reduction, the single person discount and
 * the help with water charges. Checked on 29 October 2026.
 *
 * The charges themselves (council tax by council and band, and Scottish
 * Water's 2026-27 charges) stay in councilTax.ts. This file holds everything
 * the four council tax guides share, so a threshold that changes in April is
 * changed once.
 *
 * Named councilTaxHelp rather than counciltax: on a case insensitive disk a
 * file called counciltax.ts would collide with councilTax.ts.
 */

type Band = (typeof BAND_LETTERS)[number];
type SourceRef = { publisher: string; url: string };

export const COUNCIL_TAX_HELP_CHECKED = "29 October 2026";

/** Where anyone can look up the band of any home in Scotland. */
export const SCOTTISH_ASSESSORS = {
  name: "Scottish Assessors Association",
  url: "https://www.saa.gov.uk/",
} as const;

/** Open market value on 1 April 1991. `to` is null for Band H, which has no ceiling. */
export const BAND_VALUES_1991: Record<Band, { from: number; to: number | null }> = {
  A: { from: 0, to: 27000 },
  B: { from: 27001, to: 35000 },
  C: { from: 35001, to: 45000 },
  D: { from: 45001, to: 58000 },
  E: { from: 58001, to: 80000 },
  F: { from: 80001, to: 106000 },
  G: { from: 106001, to: 212000 },
  H: { from: 212001, to: null },
};

/** "Up to £27,000", "£27,001 to £35,000", "Over £212,000". */
export function bandValueLabel(band: Band) {
  const { from, to } = BAND_VALUES_1991[band];
  if (to === null) return `Over ${pounds(from - 1)}`;
  if (from === 0) return `Up to ${pounds(to)}`;
  return `${pounds(from)} to ${pounds(to)}`;
}

export const LOTHIAN_VJB_SOURCE: SourceRef = {
  publisher: "Lothian Valuation Joint Board",
  url: "https://www.lothian-vjb.gov.uk/council-tax/",
};

/** Asking the Assessor to change a band, which Scotland calls a proposal. */
export const BAND_PROPOSALS = {
  /** Months after becoming the owner or the person who pays. */
  newOwnerMonths: 6,
  /** Months the Assessor has to decide a valid proposal. */
  assessorMonths: 6,
  /** The tribunal appeal must be in within this many months plus weeks of the Assessor receiving the proposal. */
  tribunalMonths: 6,
  tribunalWeeks: 6,
  tribunal: "Local Taxation Chamber",
  source: { publisher: "Lanarkshire Valuation Joint Board", url: "https://www.lanarkshire-vjb.gov.uk/info/2/council_tax/4/council_tax/9" },
} as const;

/** Two new bands above H, as described by Lothian Valuation Joint Board. */
export const HIGH_VALUE_BANDS = {
  start: "1 April 2028",
  valuationDate: "1 April 2026",
  bandIFrom: 1_000_000,
  bandITo: 2_000_000,
  bandJFrom: 2_000_000,
} as const;

/** Council Tax Reduction for working age households, 2026-27. */
export const COUNCIL_TAX_REDUCTION = {
  /** The most it can take off the council tax part of the bill. */
  maxPercent: 100,
  /** Savings above this rule you out, unless you get Guarantee Credit. */
  savingsLimit: 16000,
  /** Share of income above your applicable amount you pay towards council tax. */
  taperPercent: 20,
  source: { publisher: "legislation.gov.uk", url: "https://www.legislation.gov.uk/ssi/2021/249/regulation/66" },
} as const;

/**
 * Second adult rebate, 2026-27. Based on the income of another adult who lives
 * with you and doesn't pay the bill, not on yours. Weekly gross income limits.
 */
export const SECOND_ADULT_REBATE = {
  lowerIncome: 282,
  upperIncome: 383,
  onBenefitsPercent: 25,
  lowIncomePercent: 15,
  middleIncomePercent: 7.5,
  studentHomePercent: 100,
  source: { publisher: "legislation.gov.uk", url: "https://www.legislation.gov.uk/ssi/2021/249/schedule/2" },
} as const;

/** Applied by the council to anyone getting Council Tax Reduction. No form. */
export const WATER_CHARGES_REDUCTION = {
  maxPercent: 35,
  source: {
    publisher: "Scottish Water",
    url: "https://www.scottishwater.co.uk/your-home/your-charges/your-charges-2026-2027",
  },
} as const;

export const SINGLE_PERSON_DISCOUNT = {
  percent: 25,
  /** When every adult in the home is disregarded. */
  everyoneDisregardedPercent: 50,
  /** Days to tell the council in writing once the discount should stop. */
  notifyDays: 21,
  /** The penalty a council can charge for not telling it. */
  penalty: 50,
  source: {
    publisher: "City of Edinburgh Council",
    url: "https://www.edinburgh.gov.uk/discounts-exemptions/single-occupancy-discount",
  },
} as const;

/** Scottish Water's unmetered charges for 2025-26, kept to show this year's rise. */
export const WATER_CHARGES_2025: Record<Band, { water: number; wasteWater: number }> = {
  A: { water: 185.28, wasteWater: 214.98 },
  B: { water: 216.16, wasteWater: 250.81 },
  C: { water: 247.04, wasteWater: 286.64 },
  D: { water: 277.92, wasteWater: 322.47 },
  E: { water: 339.68, wasteWater: 394.13 },
  F: { water: 401.44, wasteWater: 465.79 },
  G: { water: 463.2, wasteWater: 537.45 },
  H: { water: 555.84, wasteWater: 644.94 },
};

export const SCOTTISH_WATER = {
  helpline: "0800 0778 778",
  helplineHref: "tel:08000778778",
  hours: "24 hours a day, 7 days a week",
  chargesUrl: "https://www.scottishwater.co.uk/your-home/your-charges/your-charges-2026-2027/unmetered-charges-2026-2027",
  faqUrl: "https://www.scottishwater.co.uk/help-and-resources/faqs/charges-faqs/unmetered-household-charges-faqs",
  source: {
    publisher: "Scottish Water",
    url: "https://www.scottishwater.co.uk/your-home/your-charges/your-charges-2026-2027/unmetered-charges-2026-2027",
  },
} as const;

/** The three councils people search for by name alongside Council Tax Reduction. */
export const CTR_COUNCILS = {
  edinburgh: {
    slug: "city-of-edinburgh",
    url: "https://www.edinburgh.gov.uk/counciltaxreduction",
    reviewUrl: "https://www.edinburgh.gov.uk/benefits-grants/council-tax-reduction-review",
    /** The online form logs out after this many minutes of nothing happening, and can't be saved. */
    formTimeoutMinutes: 40,
  },
  southLanarkshire: {
    slug: "south-lanarkshire",
    url: "https://www.southlanarkshire.gov.uk/counciltaxreduction",
    secondAdultUrl: "https://www.southlanarkshire.gov.uk/household-1/discounts-low-income-council-tax-reduction/2",
    phone: "0303 123 1011",
    phoneHref: "tel:03031231011",
    /** Pension age claims are backdated automatically by up to this many months. */
    backdatePensionMonths: 3,
    /** Working age claims can be backdated on request, by up to this many months from the request. */
    backdateWorkingMonths: 6,
  },
  northLanarkshire: {
    slug: "north-lanarkshire",
    url: "https://www.northlanarkshire.gov.uk/benefits-and-money/housing-benefits/calculate-and-claim-housing-benefit-and-council-tax-reduction",
    reviewUrl: "https://www.northlanarkshire.gov.uk/benefits-and-money/council-tax-support/Council-Tax-Reduction-Review",
    /** Months to ask for a review in writing, and months the council has to reply. */
    reviewMonths: 2,
  },
} as const;
