/**
 * National Records of Scotland, Drug-related deaths in Scotland, 2025.
 * Published 23 September 2026. NRS now calls its headline measure "drug use
 * deaths"; until the 2024 release it was "drug misuse deaths". The definition
 * did not change.
 *
 * The council rates use five years of registrations (2021 to 2025) so
 * small-area comparisons are less vulnerable to one noisy year. The deprivation
 * rates are for 2025. Both are age-standardised to the 2013 European Standard
 * Population. The UK comparison uses the wider drug poisoning definition for
 * 2024, the latest year available for every UK country.
 *
 * Source workbook (main tables) sheets: Table_1, Table_3, Table_4, Table_8,
 * Table_9, Table_12, Table_C1 and Table_C4.
 */

export const drugDeathHeadline2025 = {
  deaths: 1_133,
  previousDeaths: 1_017,
  changePct: 11.4,
  ageStandardisedRate: 21.4,
  rateLower95: 20.1,
  rateUpper95: 22.6,
  previousRate: 19.1,
  previousRateLower95: 17.9,
  previousRateUpper95: 20.3,
  rateIn2000: 5.3,
  peakDeaths: 1_339,
  peakYear: 2020,
  maleDeaths: 830,
  maleChange: 131,
  femaleDeaths: 303,
  femaleChange: -15,
  averageAge: 46,
  age35To54Pct: 65,
  multipleDrugsPct: 78,
  glasgowDeaths: 196,
  glasgowPreviousDeaths: 185,
} as const;

export const deprivationDrugDeathRates2025 = [
  { area: "Most deprived fifth", rate: 54.5, lower95: 49.9, upper95: 59, deaths: 559 },
  { area: "Second fifth", rate: 29.5, lower95: 26.2, upper95: 32.8, deaths: 305 },
  { area: "Middle fifth", rate: 14.2, lower95: 11.9, upper95: 16.6, deaths: 147 },
  { area: "Fourth fifth", rate: 7.2, lower95: 5.6, upper95: 8.8, deaths: 83 },
  { area: "Least deprived fifth", rate: 3.6, lower95: 2.5, upper95: 4.8, deaths: 39 },
] as const;

/**
 * The 2024 rates as published in the 2024 release (September 2025). Kept for
 * other pages that quote that year. The 2025 release revised these slightly
 * (most deprived fifth 46.6, least deprived 4.1).
 */
export const deprivationDrugDeathRates2024 = [
  { area: "Most deprived fifth", rate: 47.3, lower95: 43, upper95: 51.5, deaths: 484 },
  { area: "Second fifth", rate: 25.9, lower95: 22.7, upper95: 29, deaths: 266 },
  { area: "Middle fifth", rate: 14.8, lower95: 12.4, upper95: 17.2, deaths: 150 },
  { area: "Fourth fifth", rate: 6.6, lower95: 5.1, upper95: 8.2, deaths: 74 },
  { area: "Least deprived fifth", rate: 4.1, lower95: 2.9, upper95: 5.3, deaths: 43 },
] as const;

export const councilPeriodRate2021to2025 = {
  area: "Scotland",
  rate: 21.6,
  lower95: 21.1,
  upper95: 22.2,
  deaths: 5_703,
} as const;

/**
 * Ranked by published rate; equal rates are listed alphabetically. Orkney is
 * unranked because five deaths are too few for a reliable rate.
 */
export const councilDrugDeathRates2021to2025 = [
  { area: "Glasgow City", rate: 38, lower95: 35.7, upper95: 40.2, deaths: 1_134 },
  { area: "Dundee City", rate: 34, lower95: 29.5, upper95: 38.4, deaths: 225 },
  { area: "North Ayrshire", rate: 31, lower95: 26.4, upper95: 35.5, deaths: 183 },
  { area: "Inverclyde", rate: 30.2, lower95: 24.6, upper95: 35.9, deaths: 113 },
  { area: "West Dunbartonshire", rate: 30.2, lower95: 24.9, upper95: 35.4, deaths: 127 },
  { area: "East Ayrshire", rate: 29.9, lower95: 25.4, upper95: 34.5, deaths: 168 },
  { area: "Clackmannanshire", rate: 25.6, lower95: 19.1, upper95: 32.1, deaths: 60 },
  { area: "Renfrewshire", rate: 24.3, lower95: 21.1, upper95: 27.5, deaths: 220 },
  { area: "South Lanarkshire", rate: 23.9, lower95: 21.5, upper95: 26.3, deaths: 381 },
  { area: "North Lanarkshire", rate: 23.7, lower95: 21.4, upper95: 26.1, deaths: 402 },
  { area: "Aberdeen City", rate: 23.1, lower95: 20.3, upper95: 26, deaths: 260 },
  { area: "Dumfries and Galloway", rate: 22.9, lower95: 19, upper95: 26.8, deaths: 137 },
  { area: "South Ayrshire", rate: 20.9, lower95: 16.8, upper95: 25.1, deaths: 101 },
  { area: "City of Edinburgh", rate: 20.8, lower95: 19, upper95: 22.6, deaths: 525 },
  { area: "Shetland Islands", rate: 20.8, lower95: 12, upper95: 29.5, deaths: 22 },
  { area: "Falkirk", rate: 19.7, lower95: 16.5, upper95: 22.8, deaths: 154 },
  { area: "Fife", rate: 19.1, lower95: 17, upper95: 21.2, deaths: 331 },
  { area: "Stirling", rate: 18.7, lower95: 14.6, upper95: 22.8, deaths: 82 },
  { area: "West Lothian", rate: 17, lower95: 14.3, upper95: 19.7, deaths: 156 },
  { area: "Midlothian", rate: 16.4, lower95: 12.8, upper95: 20.1, deaths: 78 },
  { area: "East Lothian", rate: 16.1, lower95: 12.7, upper95: 19.5, deaths: 87 },
  { area: "Argyll and Bute", rate: 15.6, lower95: 11.6, upper95: 19.6, deaths: 60 },
  { area: "Perth and Kinross", rate: 15.6, lower95: 12.6, upper95: 18.5, deaths: 109 },
  { area: "Angus", rate: 15.1, lower95: 11.7, upper95: 18.5, deaths: 78 },
  { area: "Highland", rate: 13.8, lower95: 11.5, upper95: 16, deaths: 148 },
  { area: "Moray", rate: 13.4, lower95: 9.9, upper95: 16.9, deaths: 56 },
  { area: "Scottish Borders", rate: 12.4, lower95: 9.2, upper95: 15.5, deaths: 61 },
  { area: "East Dunbartonshire", rate: 12.1, lower95: 8.9, upper95: 15.2, deaths: 58 },
  { area: "Aberdeenshire", rate: 11.5, lower95: 9.6, upper95: 13.4, deaths: 140 },
  { area: "Na h-Eileanan Siar", rate: 10.7, lower95: 4.3, upper95: 17.1, deaths: 11 },
  { area: "East Renfrewshire", rate: 6.6, lower95: 4.3, upper95: 9, deaths: 31 },
  { area: "Orkney Islands", rate: null, lower95: null, upper95: null, deaths: 5 },
] as const;

/** Ordered by number of deaths, as NRS lists them. Percentages are of 1,133 deaths. */
export const implicatedSubstances2025 = [
  { label: "Any opiate or opioid", deaths: 881, pct: 78, kind: "parent class" },
  { label: "Cocaine", deaths: 589, pct: 52, kind: "specific substance" },
  { label: "Any benzodiazepine", deaths: 433, pct: 38, kind: "parent class" },
  { label: "Gabapentin and/or pregabalin", deaths: 330, pct: 29, kind: "combined category" },
] as const;

/** Drug poisoning definition, registrations in 2024. Ordered by rate. */
export const ukDrugPoisoningRates2024 = [
  { area: "Scotland", rate: 21.6 },
  { area: "Wales", rate: 14.04 },
  { area: "Northern Ireland", rate: 13.5 },
  { area: "England", rate: 9.11 },
] as const;
