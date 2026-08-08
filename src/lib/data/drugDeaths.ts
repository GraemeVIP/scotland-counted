/**
 * National Records of Scotland, Drug-related deaths in Scotland, 2024.
 *
 * The council rates use five years of registrations so small-area comparisons
 * are less vulnerable to one noisy year. The deprivation rates are for 2024.
 * Both are age-standardised to the 2013 European Standard Population.
 *
 * Source workbook sheets: Table_1, Table_3, Table_4, Table_9, Table_12,
 * Table_C1 and Table_C4. Published 2 September 2025.
 */

export const drugDeathHeadline2024 = {
  deaths: 1_017,
  previousDeaths: 1_172,
  changePct: -13.2,
  ageStandardisedRate: 19.1,
  rateLower95: 18,
  rateUpper95: 20.3,
  rateIn2000: 5.3,
  peakDeaths: 1_339,
  peakYear: 2020,
  averageAge: 45,
  age35To54Pct: 63,
  multipleDrugsPct: 80,
  glasgowDeaths: 185,
  glasgowPreviousDeaths: 246,
} as const;

export const deprivationDrugDeathRates2024 = [
  { area: "Most deprived fifth", rate: 47.3, lower95: 43, upper95: 51.5, deaths: 484 },
  { area: "Second fifth", rate: 25.9, lower95: 22.7, upper95: 29, deaths: 266 },
  { area: "Middle fifth", rate: 14.8, lower95: 12.4, upper95: 17.2, deaths: 150 },
  { area: "Fourth fifth", rate: 6.6, lower95: 5.1, upper95: 8.2, deaths: 74 },
  { area: "Least deprived fifth", rate: 4.1, lower95: 2.9, upper95: 5.3, deaths: 43 },
] as const;

export const councilPeriodRate2020to2024 = {
  area: "Scotland",
  rate: 22.5,
  lower95: 21.9,
  upper95: 23.1,
  deaths: 5_909,
} as const;

/** Ranked by published rate. Orkney is unranked because six deaths are too few for a reliable rate. */
export const councilDrugDeathRates2020to2024 = [
  { area: "Glasgow City", rate: 41.1, lower95: 38.7, upper95: 43.4, deaths: 1_229 },
  { area: "Dundee City", rate: 35.6, lower95: 31, upper95: 40.2, deaths: 235 },
  { area: "Inverclyde", rate: 35.6, lower95: 29.3, upper95: 41.8, deaths: 129 },
  { area: "West Dunbartonshire", rate: 29.8, lower95: 24.6, upper95: 35.1, deaths: 126 },
  { area: "North Ayrshire", rate: 29.5, lower95: 25, upper95: 33.9, deaths: 174 },
  { area: "East Ayrshire", rate: 27.9, lower95: 23.5, upper95: 32.3, deaths: 156 },
  { area: "Renfrewshire", rate: 27.1, lower95: 23.7, upper95: 30.5, deaths: 246 },
  { area: "North Lanarkshire", rate: 25.3, lower95: 22.9, upper95: 27.7, deaths: 427 },
  { area: "South Lanarkshire", rate: 25.1, lower95: 22.6, upper95: 27.6, deaths: 397 },
  { area: "Clackmannanshire", rate: 24.5, lower95: 18.1, upper95: 30.9, deaths: 57 },
  { area: "Aberdeen City", rate: 23.3, lower95: 20.4, upper95: 26.1, deaths: 258 },
  { area: "Dumfries and Galloway", rate: 21.6, lower95: 17.8, upper95: 25.4, deaths: 130 },
  { area: "South Ayrshire", rate: 21.5, lower95: 17.4, upper95: 25.7, deaths: 105 },
  { area: "Stirling", rate: 21.4, lower95: 17, upper95: 25.8, deaths: 92 },
  { area: "City of Edinburgh", rate: 20.6, lower95: 18.8, upper95: 22.4, deaths: 517 },
  { area: "Falkirk", rate: 19.7, lower95: 16.6, upper95: 22.9, deaths: 155 },
  { area: "Fife", rate: 19.4, lower95: 17.3, upper95: 21.5, deaths: 336 },
  { area: "Midlothian", rate: 18.2, lower95: 14.3, upper95: 22, deaths: 85 },
  { area: "Shetland Islands", rate: 18.2, lower95: 10.2, upper95: 26.2, deaths: 20 },
  { area: "Perth and Kinross", rate: 18, lower95: 14.8, upper95: 21.2, deaths: 125 },
  { area: "Argyll and Bute", rate: 17.3, lower95: 13.1, upper95: 21.5, deaths: 67 },
  { area: "East Lothian", rate: 16.5, lower95: 13, upper95: 19.9, deaths: 88 },
  { area: "West Lothian", rate: 16.3, lower95: 13.6, upper95: 18.9, deaths: 149 },
  { area: "Angus", rate: 14.9, lower95: 11.5, upper95: 18.3, deaths: 76 },
  { area: "Highland", rate: 14.6, lower95: 12.3, upper95: 17, deaths: 157 },
  { area: "Na h-Eileanan Siar", rate: 13.6, lower95: 6.4, upper95: 20.8, deaths: 14 },
  { area: "Scottish Borders", rate: 13.5, lower95: 10.2, upper95: 16.8, deaths: 66 },
  { area: "Moray", rate: 13.2, lower95: 9.7, upper95: 16.6, deaths: 56 },
  { area: "East Dunbartonshire", rate: 12.5, lower95: 9.3, upper95: 15.7, deaths: 60 },
  { area: "Aberdeenshire", rate: 11.1, lower95: 9.2, upper95: 13, deaths: 136 },
  { area: "East Renfrewshire", rate: 7.5, lower95: 5, upper95: 10, deaths: 35 },
  { area: "Orkney Islands", rate: null, lower95: null, upper95: null, deaths: 6 },
] as const;

export const implicatedSubstances2024 = [
  { label: "Any opiate or opioid", deaths: 810, pct: 80, kind: "parent class" },
  { label: "Any benzodiazepine", deaths: 574, pct: 56, kind: "parent class" },
  { label: "Cocaine", deaths: 479, pct: 47, kind: "specific substance" },
  { label: "Gabapentin and/or pregabalin", deaths: 374, pct: 37, kind: "combined category" },
] as const;

export const ukDrugPoisoningRates2023 = [
  { area: "Scotland", rate: 25.1 },
  { area: "Wales", rate: 12.92 },
  { area: "England", rate: 9.08 },
  { area: "Northern Ireland", rate: 9.1 },
] as const;
