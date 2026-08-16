/**
 * Scottish Welfare Fund Crisis Grant outcomes by council.
 *
 * Source: Scottish Government, Scottish Welfare Fund statistics update to
 * 31 March 2026, Tables 6, 18, 24, 28 and 36. Council counts are published
 * rounded to the nearest five, so independently rounded rows do not always
 * add exactly to the Scotland total.
 */

export const CRISIS_GRANT_YEARS = ["2021/22", "2022/23", "2023/24", "2024/25", "2025/26"] as const;

export const CRISIS_GRANT_SOURCE_URL =
  "https://www.gov.scot/publications/scottish-welfare-fund-statistics-update-to-31-march-2026/";

export const CRISIS_GRANT_TABLES_URL =
  "https://www.gov.scot/binaries/content/documents/govscot/publications/statistics/2026/07/scottish-welfare-fund-statistics-update-to-31-march-2026/documents/swf-tables---april-2021-to-march-2026---web-version/swf-tables---april-2021-to-march-2026---web-version/govscot%3Adocument/SWF%2BTables%2B-%2BApril%2B2021%2Bto%2BMarch%2B2026%2B-%2Bweb%2Bversion.xlsx";

export const CRISIS_GRANT_CSV_URL = "/data/scottish-crisis-grants-by-council-2025-26.csv";

export const crisisGrantScotland = {
  applications: 258_490,
  decisions: 257_980,
  awards: 167_990,
  rejections: 89_990,
  acceptanceRate: 65,
  spend: 21_916_047,
  averageAward: 130,
  processedByNextWorkingDay: 98,
} as const;

export const crisisGrantScotlandAcceptanceHistory = [66, 63, 62, 63, 65] as const;

export type CrisisGrantCouncil = {
  council: string;
  slug: string;
  applications: number;
  decisions: number;
  awards: number;
  rejections: number;
  acceptanceRate: number;
  /** Competition rank: councils with the same published rate share a rank. */
  rank: number;
  differenceFromScotland: number;
  annualChange: number;
  acceptanceHistory: number[];
  spend: number;
  averageAward: number;
  /** Latest quarter, January to March 2026. */
  processedByNextWorkingDay: number;
};

export const crisisGrantCouncils: CrisisGrantCouncil[] = [
  { council: "Aberdeen City", slug: "aberdeen-city", applications: 17720, decisions: 17730, awards: 10675, rejections: 7055, acceptanceRate: 60, rank: 25, differenceFromScotland: -5, annualChange: 1, acceptanceHistory: [60, 65, 56, 59, 60], spend: 1099324, averageAward: 105, processedByNextWorkingDay: 98 },
  { council: "Aberdeenshire", slug: "aberdeenshire", applications: 7255, decisions: 7245, awards: 4655, rejections: 2590, acceptanceRate: 64, rank: 17, differenceFromScotland: -1, annualChange: -3, acceptanceHistory: [72, 65, 62, 67, 64], spend: 595227, averageAward: 130, processedByNextWorkingDay: 97 },
  { council: "Angus", slug: "angus", applications: 3780, decisions: 3790, awards: 2990, rejections: 800, acceptanceRate: 79, rank: 2, differenceFromScotland: 14, annualChange: 0, acceptanceHistory: [88, 82, 75, 79, 79], spend: 300683, averageAward: 100, processedByNextWorkingDay: 98 },
  { council: "Argyll and Bute", slug: "argyll-and-bute", applications: 1625, decisions: 1625, awards: 970, rejections: 655, acceptanceRate: 60, rank: 25, differenceFromScotland: -5, annualChange: 5, acceptanceHistory: [51, 54, 53, 55, 60], spend: 130854, averageAward: 135, processedByNextWorkingDay: 100 },
  { council: "City of Edinburgh", slug: "city-of-edinburgh", applications: 26145, decisions: 26160, awards: 17290, rejections: 8870, acceptanceRate: 66, rank: 14, differenceFromScotland: 1, annualChange: 4, acceptanceHistory: [58, 57, 64, 62, 66], spend: 2120654, averageAward: 125, processedByNextWorkingDay: 100 },
  { council: "Clackmannanshire", slug: "clackmannanshire", applications: 2170, decisions: 2170, awards: 1475, rejections: 700, acceptanceRate: 68, rank: 11, differenceFromScotland: 3, annualChange: 5, acceptanceHistory: [62, 67, 61, 63, 68], spend: 228074, averageAward: 155, processedByNextWorkingDay: 100 },
  { council: "Dumfries and Galloway", slug: "dumfries-and-galloway", applications: 6910, decisions: 6900, awards: 4770, rejections: 2130, acceptanceRate: 69, rank: 8, differenceFromScotland: 4, annualChange: 0, acceptanceHistory: [68, 69, 68, 69, 69], spend: 597515, averageAward: 125, processedByNextWorkingDay: 97 },
  { council: "Dundee City", slug: "dundee-city", applications: 4285, decisions: 4285, awards: 3350, rejections: 935, acceptanceRate: 78, rank: 3, differenceFromScotland: 13, annualChange: 3, acceptanceHistory: [76, 76, 76, 75, 78], spend: 338560, averageAward: 100, processedByNextWorkingDay: 96 },
  { council: "East Ayrshire", slug: "east-ayrshire", applications: 5865, decisions: 5880, awards: 3930, rejections: 1950, acceptanceRate: 67, rank: 13, differenceFromScotland: 2, annualChange: 2, acceptanceHistory: [59, 57, 61, 65, 67], spend: 400708, averageAward: 100, processedByNextWorkingDay: 100 },
  { council: "East Dunbartonshire", slug: "east-dunbartonshire", applications: 3645, decisions: 3645, awards: 2630, rejections: 1015, acceptanceRate: 72, rank: 6, differenceFromScotland: 7, annualChange: 3, acceptanceHistory: [69, 71, 74, 69, 72], spend: 419064, averageAward: 160, processedByNextWorkingDay: 100 },
  { council: "East Lothian", slug: "east-lothian", applications: 3765, decisions: 3765, awards: 2180, rejections: 1585, acceptanceRate: 58, rank: 29, differenceFromScotland: -7, annualChange: 3, acceptanceHistory: [52, 45, 41, 55, 58], spend: 282347, averageAward: 130, processedByNextWorkingDay: 93 },
  { council: "East Renfrewshire", slug: "east-renfrewshire", applications: 2035, decisions: 2035, awards: 1475, rejections: 560, acceptanceRate: 72, rank: 6, differenceFromScotland: 7, annualChange: -4, acceptanceHistory: [85, 79, 80, 76, 72], spend: 218912, averageAward: 150, processedByNextWorkingDay: 99 },
  { council: "Falkirk", slug: "falkirk", applications: 5395, decisions: 5360, awards: 3625, rejections: 1735, acceptanceRate: 68, rank: 11, differenceFromScotland: 3, annualChange: 9, acceptanceHistory: [48, 51, 44, 59, 68], spend: 487029, averageAward: 135, processedByNextWorkingDay: 95 },
  { council: "Fife", slug: "fife", applications: 25670, decisions: 25550, awards: 18555, rejections: 6995, acceptanceRate: 73, rank: 5, differenceFromScotland: 8, annualChange: 3, acceptanceHistory: [74, 71, 69, 70, 73], spend: 2606067, averageAward: 140, processedByNextWorkingDay: 98 },
  { council: "Glasgow City", slug: "glasgow-city", applications: 41255, decisions: 41195, awards: 25940, rejections: 15250, acceptanceRate: 63, rank: 21, differenceFromScotland: -2, annualChange: 1, acceptanceHistory: [70, 62, 62, 62, 63], spend: 3950416, averageAward: 150, processedByNextWorkingDay: 100 },
  { council: "Highland", slug: "highland", applications: 5925, decisions: 5925, awards: 3165, rejections: 2760, acceptanceRate: 53, rank: 31, differenceFromScotland: -12, annualChange: -1, acceptanceHistory: [65, 53, 49, 54, 53], spend: 606333, averageAward: 190, processedByNextWorkingDay: 95 },
  { council: "Inverclyde", slug: "inverclyde", applications: 1975, decisions: 1980, awards: 1765, rejections: 210, acceptanceRate: 89, rank: 1, differenceFromScotland: 24, annualChange: 5, acceptanceHistory: [83, 82, 77, 84, 89], spend: 251670, averageAward: 145, processedByNextWorkingDay: 97 },
  { council: "Midlothian", slug: "midlothian", applications: 7315, decisions: 7320, awards: 3815, rejections: 3510, acceptanceRate: 52, rank: 32, differenceFromScotland: -13, annualChange: 1, acceptanceHistory: [57, 52, 49, 51, 52], spend: 449065, averageAward: 120, processedByNextWorkingDay: 100 },
  { council: "Moray", slug: "moray", applications: 2530, decisions: 2530, awards: 1650, rejections: 880, acceptanceRate: 65, rank: 16, differenceFromScotland: 0, annualChange: 1, acceptanceHistory: [63, 60, 58, 64, 65], spend: 194492, averageAward: 120, processedByNextWorkingDay: 100 },
  { council: "Na h-Eileanan Siar", slug: "na-h-eileanan-siar", applications: 310, decisions: 315, awards: 215, rejections: 95, acceptanceRate: 69, rank: 8, differenceFromScotland: 4, annualChange: -2, acceptanceHistory: [72, 71, 75, 71, 69], spend: 38614, averageAward: 180, processedByNextWorkingDay: 99 },
  { council: "North Ayrshire", slug: "north-ayrshire", applications: 6140, decisions: 6140, awards: 3615, rejections: 2525, acceptanceRate: 59, rank: 27, differenceFromScotland: -6, annualChange: 2, acceptanceHistory: [44, 52, 55, 57, 59], spend: 329636, averageAward: 90, processedByNextWorkingDay: 99 },
  { council: "North Lanarkshire", slug: "north-lanarkshire", applications: 19985, decisions: 19645, awards: 13525, rejections: 6115, acceptanceRate: 69, rank: 8, differenceFromScotland: 4, annualChange: 9, acceptanceHistory: [67, 65, 65, 60, 69], spend: 2078879, averageAward: 155, processedByNextWorkingDay: 97 },
  { council: "Orkney Islands", slug: "orkney-islands", applications: 190, decisions: 190, awards: 125, rejections: 65, acceptanceRate: 66, rank: 14, differenceFromScotland: 1, annualChange: 15, acceptanceHistory: [42, 66, 83, 51, 66], spend: 30812, averageAward: 245, processedByNextWorkingDay: 100 },
  { council: "Perth and Kinross", slug: "perth-and-kinross", applications: 8145, decisions: 8175, awards: 5160, rejections: 3015, acceptanceRate: 63, rank: 21, differenceFromScotland: -2, annualChange: -1, acceptanceHistory: [59, 64, 65, 64, 63], spend: 762476, averageAward: 150, processedByNextWorkingDay: 99 },
  { council: "Renfrewshire", slug: "renfrewshire", applications: 9370, decisions: 9385, awards: 6035, rejections: 3350, acceptanceRate: 64, rank: 17, differenceFromScotland: -1, annualChange: -3, acceptanceHistory: [70, 68, 67, 67, 64], spend: 699544, averageAward: 115, processedByNextWorkingDay: 96 },
  { council: "Scottish Borders", slug: "scottish-borders", applications: 2570, decisions: 2565, awards: 1950, rejections: 615, acceptanceRate: 76, rank: 4, differenceFromScotland: 11, annualChange: 9, acceptanceHistory: [73, 74, 63, 67, 76], spend: 214885, averageAward: 110, processedByNextWorkingDay: 99 },
  { council: "Shetland Islands", slug: "shetland-islands", applications: 160, decisions: 160, awards: 90, rejections: 65, acceptanceRate: 58, rank: 29, differenceFromScotland: -7, annualChange: 16, acceptanceHistory: [44, 49, 51, 42, 58], spend: 26072, averageAward: 285, processedByNextWorkingDay: 67 },
  { council: "South Ayrshire", slug: "south-ayrshire", applications: 4115, decisions: 4110, awards: 2620, rejections: 1490, acceptanceRate: 64, rank: 17, differenceFromScotland: -1, annualChange: 1, acceptanceHistory: [67, 57, 56, 63, 64], spend: 395047, averageAward: 150, processedByNextWorkingDay: 99 },
  { council: "South Lanarkshire", slug: "south-lanarkshire", applications: 10185, decisions: 10180, awards: 6215, rejections: 3965, acceptanceRate: 61, rank: 24, differenceFromScotland: -4, annualChange: 3, acceptanceHistory: [62, 61, 60, 58, 61], spend: 595532, averageAward: 95, processedByNextWorkingDay: 99 },
  { council: "Stirling", slug: "stirling", applications: 3965, decisions: 3965, awards: 2535, rejections: 1430, acceptanceRate: 64, rank: 17, differenceFromScotland: -1, annualChange: 4, acceptanceHistory: [66, 63, 60, 60, 64], spend: 359773, averageAward: 140, processedByNextWorkingDay: 99 },
  { council: "West Dunbartonshire", slug: "west-dunbartonshire", applications: 9065, decisions: 9035, awards: 5330, rejections: 3705, acceptanceRate: 59, rank: 27, differenceFromScotland: -6, annualChange: 6, acceptanceHistory: [79, 80, 61, 53, 59], spend: 498799, averageAward: 95, processedByNextWorkingDay: 93 },
  { council: "West Lothian", slug: "west-lothian", applications: 9030, decisions: 9035, awards: 5670, rejections: 3365, acceptanceRate: 63, rank: 21, differenceFromScotland: -2, annualChange: 5, acceptanceHistory: [65, 60, 49, 58, 63], spend: 608985, averageAward: 105, processedByNextWorkingDay: 99 },
];

export function getCrisisGrantCouncil(slug: string) {
  return crisisGrantCouncils.find((council) => council.slug === slug);
}

export const crisisGrantCouncilsByAcceptance = [...crisisGrantCouncils].sort(
  (a, b) => b.acceptanceRate - a.acceptanceRate || a.council.localeCompare(b.council),
);
