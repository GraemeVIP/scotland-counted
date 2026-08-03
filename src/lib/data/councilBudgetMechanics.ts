/**
 * How council budgets actually work — the national picture, one place.
 *
 * This exists because of a pattern anyone can see but almost nobody has had
 * explained to them: no matter how much money a council gets, it announces
 * that it needs another twenty million. That looks like a stitch-up. The
 * honest answer is more useful than the suspicion, and it is all in one
 * published document.
 *
 * Every figure below is from Audit Scotland's "Local government budgets
 * 2026/27" bulletin (June 2026), prepared for the Accounts Commission, which
 * collects a data return from all 32 councils. Paragraph and exhibit numbers
 * are given so any claim can be checked against the page it came from.
 *
 * The one thing this file must never do is tell the reader what to conclude.
 * It sets out how the money is decided, what a "gap" is, and who ended up
 * paying to close it. The reader can draw their own conclusion from there.
 */

export const BUDGET_SOURCE = {
  id: "audit-scotland-council-budgets-2026-27",
  title: "Local government budgets 2026/27",
  publisher: "Audit Scotland, for the Accounts Commission",
  url: "https://audit.scot/uploads/2026-06/nr_260611_lg_council_budgets.pdf",
  publishedOn: "2026-06-11",
} as const;

/** The Scottish Parliament research briefing on the funding formula (GAE). */
export const FORMULA_SOURCE = {
  id: "spice-funding-formula",
  title: "Local Government finance: the Funding Formula and local taxation income",
  publisher: "SPICe, the Scottish Parliament's research service",
  url: "https://www.parliament.scot/chamber-and-committees/research-prepared-for-parliament/research-briefings/2018/11/9/sb-1860",
} as const;

/**
 * Where each £1 of everyday service money comes from. Exhibit 4.
 * Rounded to whole pence for reading; the exact shares are in the comment.
 */
export const FUNDING_MIX = [
  { source: "A grant from the Scottish Government", pence: 60, exact: 59.7 },
  { source: "Council tax", pence: 20, exact: 20.1 },
  { source: "Business rates, paid by shops and offices", pence: 18, exact: 18.4 },
  { source: "Money set aside, and other income", pence: 2, exact: 1.8 },
] as const;

/**
 * What the grant formula counts. From the SPICe briefing: allocations use a
 * "client group approach", and the secondary indicators are "demand and cost
 * factors that are outside of the control of Local Authorities".
 *
 * The briefing is explicit that past spending is not the basis for allocation
 * — it is used only as a last resort where no client group can be identified,
 * for small services such as coast protection. That matters, because it is
 * the answer to the obvious suspicion: a council that comes in on budget does
 * not have its grant cut the next year for having done so.
 */
export const FORMULA_COUNTS = [
  "How many people live in the area",
  "How many children are at school",
  "How poor the area is",
  "How far apart people live, and how many miles of road there are",
] as const;

/** The national totals. Key facts page, and paragraphs 24, 31 and 33. */
export const NATIONAL = {
  /** Total Scottish Government funding to councils, 2026/27. Key facts. */
  totalFunding: "£15.7bn",
  /** Real terms change in revenue funding against 2025/26. Key facts. */
  revenueChange: "up 2%",
  /** Real terms change in capital funding against 2025/26. Key facts. */
  capitalChange: "down 15%",
  /** Councils' approved net revenue budgets. Paragraph 24. */
  revenueBudgets: "£18.9bn",
  /** Combined gap councils identified when setting budgets. Paragraph 31. */
  gapTotal: "£528.6m",
  gapShare: "about 3%",
  /**
   * The same 3% said as money. A percentage is a hard idea for the reader this
   * site is written for; pence in the pound is not, and it matches the "where
   * every £1 comes from" block on the same page.
   */
  gapSharePence: "about 3p in every pound they spend",
  /**
   * Paragraph 31, verbatim: "broadly consistent over the last seven years".
   * Spelled as a word because it reads inside a sentence, not as a statistic.
   */
  gapYears: "seven",
  /** Councils reporting a gap vs a surplus. Exhibit 5. */
  councilsWithGap: 31,
  councilsWithSurplus: 1,
  surplusCouncil: "South Lanarkshire",
  councilsTotal: 32,
} as const;

/**
 * How the gap was closed, across all 32 councils. Exhibit 6, as a share of
 * the measures approved. Ordered biggest first, which is the point: the
 * largest single action was putting council tax up.
 */
export const BRIDGING_ACTIONS = [
  { action: "Council tax went up", share: 35.2, amount: "£221m" },
  { action: "Savings that repeat every year", share: 26.8, amount: "£168m" },
  { action: "Money taken out of the savings pot", share: 19.4, amount: "£122m" },
  { action: "Other one-off actions", share: 8.5, amount: null },
  { action: "Other repeating actions", share: 5.4, amount: null },
  { action: "Higher fees and charges", share: 2.7, amount: "£17m" },
  { action: "One-off savings", share: 1.8, amount: "£12m" },
] as const;

/** Council tax decisions for 2026/27. Paragraphs 40 to 44. */
export const COUNCIL_TAX = {
  /** Paragraph 40: every council raised its rate. */
  allRaised: true,
  averageIncrease: "7.7%",
  lowestIncrease: { council: "City of Edinburgh", value: "4%" },
  highestIncrease: { council: "Aberdeenshire and Moray", value: "10%" },
  /** Key message 3: a second consecutive year of increases. */
  consecutiveYears: 2,
  /** Paragraph 44: cumulative two-year increases. */
  twoYearAverage: "18%",
  twoYearLowest: { council: "City of Edinburgh", value: "12.3%" },
  twoYearHighest: { council: "Falkirk", value: "25.8%" },
  /** Paragraph 41: total expected from the increases. */
  totalRaised: "£248m",
} as const;

/**
 * The caveat, carried from the Exhibit 5 note and paragraph 3. Councils
 * budget in different ways and present gaps differently, so gap sizes are not
 * a perfect league table. Any page that ranks councils on the gap must say
 * this, or it is overclaiming.
 */
export const COMPARISON_CAVEAT =
  "Councils work out and describe their budget gap in different ways, so these figures are not a perfect like-for-like comparison. Audit Scotland says comparisons should be made with caution.";

/**
 * Shetland and Orkney are left out of Audit Scotland's own gap chart because
 * their harbour reserves from oil and gas make them outliers. Their gaps are
 * real, but ranking them against the other 30 would mislead.
 */
export const RESERVE_OUTLIERS = ["shetland-islands", "orkney-islands"] as const;

/**
 * Each council's 2026/27 budget gap in £m, exactly as printed in Exhibit 5.
 * A negative number is a surplus. Keyed by the site's council slug.
 *
 * This is the one authoritative table for cross-council comparison. The
 * per-record budget figures in councilAccountability*.ts use three different
 * id schemes and store the gap as a magnitude, so they cannot be compared
 * safely — read the sign from here.
 */
export const BUDGET_GAP_2026_27: Record<string, number> = {
  "east-dunbartonshire": 23.7,
  "south-ayrshire": 20.7,
  "west-dunbartonshire": 15.9,
  "argyll-and-bute": 14.9,
  "scottish-borders": 16.3,
  midlothian: 13.3,
  "perth-and-kinross": 20.7,
  "glasgow-city": 86.7,
  clackmannanshire: 7.0,
  "north-ayrshire": 17.8,
  angus: 13.9,
  "na-h-eileanan-siar": 5.0,
  stirling: 11.4,
  moray: 10.6,
  "west-lothian": 20.2,
  falkirk: 14.5,
  highland: 23.4,
  "dumfries-and-galloway": 12.5,
  "east-renfrewshire": 8.7,
  aberdeenshire: 19.2,
  "east-ayrshire": 9.5,
  "city-of-edinburgh": 27.9,
  "north-lanarkshire": 19.3,
  "aberdeen-city": 11.0,
  inverclyde: 4.0,
  "dundee-city": 5.0,
  "east-lothian": 3.5,
  renfrewshire: 5.0,
  fife: 3.6,
  "south-lanarkshire": -1.5,
  // Excluded from Exhibit 5 as reserve outliers, but stated in the bulletin.
  "shetland-islands": 43.7,
  "orkney-islands": 21.3,
};

export function gapFor(slug: string): number | undefined {
  return BUDGET_GAP_2026_27[slug];
}

/** True where the bulletin itself declines to rank the council. */
export function isReserveOutlier(slug: string): boolean {
  return (RESERVE_OUTLIERS as readonly string[]).includes(slug);
}
