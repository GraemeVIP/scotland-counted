/**
 * The spread of full-time pay in Glasgow, not just the middle of it.
 *
 * A single median invites the obvious objection — that £40,000-odd is nothing
 * like what people around you earn — and the objection is fair, because a
 * median says nothing about the shape either side of it. A quarter of
 * full-time Glasgow residents earn under £30,000. That is true at the same
 * time as the median being what it is, and the page should say both.
 *
 * Residence basis: jobs held by people who live in Glasgow, which is the one
 * that answers "what do people here earn". Full-time employee jobs only —
 * part-time work, which is 29% of the city's employee jobs, is not in here at
 * all and is paid far less.
 *
 * Source: ONS ASHE via NOMIS, dataset NM_30_1, latest release.
 */

export type PayPoint = {
  /** Percentile label, or "Median". */
  label: string;
  /** Plain-English gloss of what the percentile means. */
  meaning: string;
  weekly: number;
  annual: number;
  emphasis?: boolean;
};

export const glasgowPaySpread: PayPoint[] = [
  {
    label: "Lowest tenth",
    meaning: "1 in 10 full-time workers earn less than this",
    weekly: 496.1,
    annual: 25797,
  },
  {
    label: "Lowest quarter",
    meaning: "1 in 4 earn less than this",
    weekly: 574.9,
    annual: 29895,
  },
  {
    label: "The middle",
    meaning: "Half earn less, half earn more",
    weekly: 745.5,
    annual: 38766,
    emphasis: true,
  },
  {
    label: "Top quarter",
    meaning: "1 in 4 earn more than this",
    weekly: 979.2,
    annual: 50918,
  },
  {
    label: "Top fifth",
    meaning: "1 in 5 earn more than this",
    weekly: 1058.7,
    annual: 55052,
  },
];

/**
 * The mean sits well above the median because high earners pull it up. Worth
 * showing, because "average" usually means the mean in ordinary speech and the
 * two numbers are £7,000 apart.
 */
export const glasgowPayMean = { weekly: 886.9, annual: 46119 };

export const glasgowPayMedian = glasgowPaySpread.find((p) => p.emphasis)!;

/** Full-time employee jobs held by Glasgow residents, in the ASHE sample. */
export const glasgowFullTimeJobs = 199_000;

/**
 * An independent check on the survey.
 *
 * ASHE is a 1% sample survey, so "how do we know it is right" is a fair
 * question. HMRC's PAYE Real Time Information is not a survey at all: it is
 * every payroll submission in the country. The two are collected differently,
 * cover different populations, and agree once that difference is accounted
 * for — the gap between them is what including part-time work does.
 */
export const rtiCrossCheck = {
  monthly: 2538,
  annual: 30456,
  month: "October 2025",
  scope: "All payrolled employees, full-time and part-time",
  sourceId: "hmrc-rti",
};

/** The same measure from the survey, for the comparison. */
export const asheFullTimeUk = {
  weekly: 766.6,
  annual: 39863,
  scope: "Full-time employees only",
  sourceId: "ashe-uk-2025",
};
