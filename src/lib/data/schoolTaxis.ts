import { councilTaxByBand } from "./councilTax";

export type TaxiDisclosureStatus =
  | "School split published"
  | "Total only"
  | "Not recorded"
  | "No reply";

export type CouncilTaxiRaw = {
  council: string;
  slug: string;
  region: "City" | "Central Belt" | "Rural & Islands" | "Ayrshire" | "North East";
  status: TaxiDisclosureStatus;
  /** Total reported taxi and private hire spend in GBP (2024/25), or null if undisclosed. */
  allTaxiGbp: number | null;
  /** School run taxi and private hire spend in GBP (2024/25), or null if not split/undisclosed. */
  schoolTaxiGbp: number | null;
  /** Total pupils on the school roll, September 2024 pupil census. */
  pupils: number;
  /** Pupils recorded with Additional Support Needs, September 2024. */
  asnPupils: number;
  /** Note on precision or source quirks. */
  note?: string;
};

export type CouncilTaxiRow = CouncilTaxiRaw & {
  nonSchoolGbp: number | null;
  schoolSharePct: number | null;
  perPupilGbp: number | null;
  perAsnPupilGbp: number | null;
  asnSharePct: number;
  bandD2026: number;
  bandDHomesAll: number | null;
  bandDHomesSchool: number | null;
  /** 1-based rank by school taxi spend per pupil (1 = highest) among the 25 reporting councils. */
  rankPerPupil: number | null;
  /** 1-based rank by total taxi spend (1 = highest) among the 27 councils with a total. */
  rankTotalSpend: number | null;
};

const RAW_COUNCIL_TAXIS: CouncilTaxiRaw[] = [
  { council: "North Lanarkshire", slug: "north-lanarkshire", region: "Central Belt", status: "School split published", allTaxiGbp: 12250000, schoolTaxiGbp: 12250000, pupils: 48345, asnPupils: 17128 },
  { council: "City of Edinburgh", slug: "city-of-edinburgh", region: "City", status: "School split published", allTaxiGbp: 10600000, schoolTaxiGbp: 8320000, pupils: 54063, asnPupils: 24831 },
  { council: "Aberdeenshire", slug: "aberdeenshire", region: "North East", status: "School split published", allTaxiGbp: 9340000, schoolTaxiGbp: 8430000, pupils: 36148, asnPupils: 17191 },
  { council: "Glasgow City", slug: "glasgow-city", region: "City", status: "School split published", allTaxiGbp: 9230000, schoolTaxiGbp: 7820000, pupils: 71957, asnPupils: 37224 },
  { council: "Fife", slug: "fife", region: "Central Belt", status: "School split published", allTaxiGbp: 8440000, schoolTaxiGbp: 6750000, pupils: 48674, asnPupils: 18421 },
  { council: "South Lanarkshire", slug: "south-lanarkshire", region: "Central Belt", status: "School split published", allTaxiGbp: 7000000, schoolTaxiGbp: 6400000, pupils: 45990, asnPupils: 16045 },
  { council: "West Lothian", slug: "west-lothian", region: "Central Belt", status: "School split published", allTaxiGbp: 5580000, schoolTaxiGbp: 5580000, pupils: 27837, asnPupils: 10742 },
  { council: "East Ayrshire", slug: "east-ayrshire", region: "Ayrshire", status: "School split published", allTaxiGbp: 4400000, schoolTaxiGbp: 4100000, pupils: 16029, asnPupils: 4957 },
  { council: "Dumfries and Galloway", slug: "dumfries-and-galloway", region: "Rural & Islands", status: "School split published", allTaxiGbp: 4010000, schoolTaxiGbp: 4010000, pupils: 17995, asnPupils: 8187 },
  { council: "North Ayrshire", slug: "north-ayrshire", region: "Ayrshire", status: "School split published", allTaxiGbp: 2830000, schoolTaxiGbp: 2450000, pupils: 17037, asnPupils: 6706 },
  { council: "East Dunbartonshire", slug: "east-dunbartonshire", region: "Central Belt", status: "Total only", allTaxiGbp: 2420000, schoolTaxiGbp: null, pupils: 17507, asnPupils: 4684, note: "Reported total taxi spend but gave no school run split." },
  { council: "Renfrewshire", slug: "renfrewshire", region: "Central Belt", status: "School split published", allTaxiGbp: 2330000, schoolTaxiGbp: 1990000, pupils: 24261, asnPupils: 8606 },
  { council: "Scottish Borders", slug: "scottish-borders", region: "Rural & Islands", status: "School split published", allTaxiGbp: 2250000, schoolTaxiGbp: 1960000, pupils: 14003, asnPupils: 5896 },
  { council: "Falkirk", slug: "falkirk", region: "Central Belt", status: "School split published", allTaxiGbp: 1890000, schoolTaxiGbp: 1840000, pupils: 21300, asnPupils: 8154 },
  { council: "Aberdeen City", slug: "aberdeen-city", region: "City", status: "School split published", allTaxiGbp: 1840000, schoolTaxiGbp: 1290000, pupils: 26305, asnPupils: 10987 },
  { council: "West Dunbartonshire", slug: "west-dunbartonshire", region: "Central Belt", status: "School split published", allTaxiGbp: 1750000, schoolTaxiGbp: 1580000, pupils: 11884, asnPupils: 5434 },
  { council: "Moray", slug: "moray", region: "North East", status: "School split published", allTaxiGbp: 1446047, schoolTaxiGbp: 1284117, pupils: 12110, asnPupils: 4917, note: "Exact figures from Moray Council's published FOI log." },
  { council: "Clackmannanshire", slug: "clackmannanshire", region: "Central Belt", status: "School split published", allTaxiGbp: 1330000, schoolTaxiGbp: 1330000, pupils: 6483, asnPupils: 2501 },
  { council: "East Renfrewshire", slug: "east-renfrewshire", region: "Central Belt", status: "School split published", allTaxiGbp: 1300000, schoolTaxiGbp: 1270000, pupils: 17776, asnPupils: 5097 },
  { council: "Stirling", slug: "stirling", region: "Central Belt", status: "School split published", allTaxiGbp: 1000000, schoolTaxiGbp: 988000, pupils: 12617, asnPupils: 4783 },
  { council: "Midlothian", slug: "midlothian", region: "Central Belt", status: "School split published", allTaxiGbp: 806000, schoolTaxiGbp: 6000, pupils: 14298, asnPupils: 6016, note: "Reported only £6,000 as school runs out of £806,000 total, likely reflecting how contracts are coded." },
  { council: "Dundee City", slug: "dundee-city", region: "City", status: "School split published", allTaxiGbp: 668000, schoolTaxiGbp: 609000, pupils: 18627, asnPupils: 7689 },
  { council: "Inverclyde", slug: "inverclyde", region: "Central Belt", status: "School split published", allTaxiGbp: 548000, schoolTaxiGbp: 531000, pupils: 9676, asnPupils: 4000 },
  { council: "Argyll and Bute", slug: "argyll-and-bute", region: "Rural & Islands", status: "School split published", allTaxiGbp: 384000, schoolTaxiGbp: 384000, pupils: 9794, asnPupils: 3796 },
  { council: "East Lothian", slug: "east-lothian", region: "Central Belt", status: "Total only", allTaxiGbp: 303800, schoolTaxiGbp: null, pupils: 15124, asnPupils: 5710, note: "Reported total taxi spend but gave no school run split." },
  { council: "South Ayrshire", slug: "south-ayrshire", region: "Ayrshire", status: "School split published", allTaxiGbp: 180600, schoolTaxiGbp: 13000, pupils: 13977, asnPupils: 5888, note: "Reported only £13,000 for school taxis out of £180,600 total, likely reflecting how contracts are coded." },
  { council: "Orkney Islands", slug: "orkney-islands", region: "Rural & Islands", status: "School split published", allTaxiGbp: 116500, schoolTaxiGbp: 116500, pupils: 2734, asnPupils: 1246 },
  { council: "Highland", slug: "highland", region: "Rural & Islands", status: "Not recorded", allTaxiGbp: null, schoolTaxiGbp: null, pupils: 29973, asnPupils: 12820, note: "Said taxi spending is not recorded separately." },
  { council: "Perth and Kinross", slug: "perth-and-kinross", region: "Rural & Islands", status: "Not recorded", allTaxiGbp: null, schoolTaxiGbp: null, pupils: 17778, asnPupils: 6959, note: "Said taxi spending is not recorded separately." },
  { council: "Angus", slug: "angus", region: "North East", status: "No reply", allTaxiGbp: null, schoolTaxiGbp: null, pupils: 14637, asnPupils: 4992, note: "Did not reply to the FOI request." },
  { council: "Shetland Islands", slug: "shetland-islands", region: "Rural & Islands", status: "Not recorded", allTaxiGbp: null, schoolTaxiGbp: null, pupils: 3196, asnPupils: 1366, note: "Said taxi spending is not recorded separately." },
  { council: "Na h-Eileanan Siar", slug: "na-h-eileanan-siar", region: "Rural & Islands", status: "No reply", allTaxiGbp: null, schoolTaxiGbp: null, pupils: 3139, asnPupils: 1175, note: "Did not reply to the FOI request." },
];

const totalRankOrder = [...RAW_COUNCIL_TAXIS]
  .filter((r) => r.allTaxiGbp !== null)
  .sort((a, b) => (b.allTaxiGbp ?? 0) - (a.allTaxiGbp ?? 0));

const perPupilRankOrder = [...RAW_COUNCIL_TAXIS]
  .filter((r) => r.schoolTaxiGbp !== null)
  .sort((a, b) => (b.schoolTaxiGbp ?? 0) / b.pupils - (a.schoolTaxiGbp ?? 0) / a.pupils);

export const schoolTaxiCouncils: CouncilTaxiRow[] = RAW_COUNCIL_TAXIS.map((raw) => {
  const bandD2026 = councilTaxByBand[raw.slug]?.D ?? 1661.92;
  const nonSchoolGbp =
    raw.allTaxiGbp !== null && raw.schoolTaxiGbp !== null
      ? raw.allTaxiGbp - raw.schoolTaxiGbp
      : null;
  const schoolSharePct =
    raw.allTaxiGbp && raw.schoolTaxiGbp !== null
      ? Number(((raw.schoolTaxiGbp / raw.allTaxiGbp) * 100).toFixed(1))
      : null;
  const perPupilGbp =
    raw.schoolTaxiGbp !== null
      ? Number((raw.schoolTaxiGbp / raw.pupils).toFixed(2))
      : null;
  const perAsnPupilGbp =
    raw.schoolTaxiGbp !== null
      ? Number((raw.schoolTaxiGbp / raw.asnPupils).toFixed(0))
      : null;
  const asnSharePct = Number(((raw.asnPupils / raw.pupils) * 100).toFixed(1));
  const rankTotalIdx = totalRankOrder.findIndex((x) => x.slug === raw.slug);
  const rankPupilIdx = perPupilRankOrder.findIndex((x) => x.slug === raw.slug);

  return {
    ...raw,
    nonSchoolGbp,
    schoolSharePct,
    perPupilGbp,
    perAsnPupilGbp,
    asnSharePct,
    bandD2026,
    bandDHomesAll: raw.allTaxiGbp !== null ? Math.round(raw.allTaxiGbp / bandD2026) : null,
    bandDHomesSchool: raw.schoolTaxiGbp !== null ? Math.round(raw.schoolTaxiGbp / bandD2026) : null,
    rankTotalSpend: rankTotalIdx >= 0 ? rankTotalIdx + 1 : null,
    rankPerPupil: rankPupilIdx >= 0 ? rankPupilIdx + 1 : null,
  };
});

export const schoolTaxiSummary = {
  financialYear: "2024/25",
  councilsTotal: 32,
  councilsWithTotal: 27,
  councilsWithSchoolSplit: 25,
  councilsTotalOnly: 2,
  councilsMissingCompletely: 5,
  councilsWithoutSchoolSplit: 7,
  totalReportedAllGbp: 94242947,
  totalReportedSchoolGbp: 81301617,
  totalReportedNonSchoolGbp: 10217530,
  schoolShareOf25Pct: 88.8,
  avgPerPupil25Gbp: 135.52,
  avgPerAsn25Gbp: 329.9,
  perDayAllGbp: 258200,
  perSchoolDayGbp: 427903,
  allPupils32: 701274,
  allAsn32: 284148,
  allAsnSharePct: 40.5,
  missing5Pupils: 68723,
  missing7Pupils: 101354,
  avgBandD2026: 1661.92,
  bandDHomesAll: 56707,
  csvUrl: "/data/scottish-school-taxi-spending-2024-25.csv",
  reportingUrl:
    "https://www.scottishdailyexpress.co.uk/news/scottish-news/cash-strapped-councils-spending-millions-36436320",
} as const;
