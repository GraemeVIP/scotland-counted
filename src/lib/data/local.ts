/**
 * Figures for the "who represents you" and "your area" guides: councillors,
 * MSPs, life expectancy in Glasgow, unemployment and Glasgow crime.
 *
 * Every block carries its own source, read on 29 October 2026. Small on
 * purpose: posts.ts reads the quick answers from here, and posts.ts reaches
 * some client bundles, so nothing heavy (the Holyrood snapshot, the council
 * index) is imported into this file. The post bodies import those directly.
 */

import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";

type Source = { publisher: string; url: string };

/* ------------------------------------------------------------------ */
/* Councillors                                                         */
/* ------------------------------------------------------------------ */

export const COUNCILLOR_SOURCE: Source = {
  publisher: "Boundaries Scotland",
  url: "https://www.boundaries.scot/wp-content/uploads/2026/03/Local_government_electoral_1995_onwards.pdf",
};

/** Polling day for the next council elections, from the Electoral Management Board for Scotland. */
export const LOCAL_ELECTION_2027 = {
  date: "Thursday 6 May 2027",
  source: {
    publisher: "Electoral Management Board for Scotland",
    url: "https://www.emb.scot/scottish-local-government/scottish-local-government-elections-2027",
  } satisfies Source,
};

export type CouncillorFinder = {
  councilSlug: string;
  /** Wards and councillors in use since the May 2022 election (Boundaries Scotland, Appendix A). */
  wards: number;
  councillors: number;
  /** The council's own councillor search or list. Checked 29 October 2026. */
  url: string;
};

export const COUNCILLOR_FINDERS: CouncillorFinder[] = [
  { councilSlug: "aberdeen-city", wards: 13, councillors: 45, url: "https://www.aberdeencity.gov.uk/Council-Services/council-and-democracy/councillors/find-your-local-councillor" },
  { councilSlug: "aberdeenshire", wards: 19, councillors: 70, url: "https://www.aberdeenshire.gov.uk/council-and-democracy/councillors-and-committees" },
  { councilSlug: "angus", wards: 8, councillors: 28, url: "https://www.angus.gov.uk/council_committees_and_elections/councillors" },
  { councilSlug: "argyll-and-bute", wards: 11, councillors: 36, url: "https://www.argyll-bute.gov.uk/my-council/councillors" },
  { councilSlug: "clackmannanshire", wards: 5, councillors: 18, url: "https://www.clacks.gov.uk/council/wards/" },
  { councilSlug: "dumfries-and-galloway", wards: 12, councillors: 43, url: "https://www.dumfriesandgalloway.gov.uk/council-elections/councillors-wards/local-wards" },
  { councilSlug: "dundee-city", wards: 8, councillors: 29, url: "https://www.dundeecity.gov.uk/link/find-your-councillor-ward" },
  { councilSlug: "east-ayrshire", wards: 9, councillors: 32, url: "https://www.east-ayrshire.gov.uk/CouncilAndGovernment/About-the-Council/Councillors-and-Provost/YourCouncillor.aspx" },
  { councilSlug: "east-dunbartonshire", wards: 7, councillors: 22, url: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/elections-voting/who-represents-you/" },
  { councilSlug: "east-lothian", wards: 6, councillors: 22, url: "https://www.eastlothian.gov.uk/council-and-democracy/councillors" },
  { councilSlug: "east-renfrewshire", wards: 5, councillors: 18, url: "https://eastrenfrewshire.gov.uk/Find-my-councillor" },
  { councilSlug: "city-of-edinburgh", wards: 17, councillors: 63, url: "https://www.edinburgh.gov.uk/findyourcouncillor" },
  { councilSlug: "falkirk", wards: 9, councillors: 30, url: "https://council.falkirk.gov.uk/Councillors" },
  { councilSlug: "fife", wards: 22, councillors: 75, url: "https://www.fife.gov.uk/about-your-council/politicians-and-committees/your-local-councillors/councillor/councillors-by-ward" },
  { councilSlug: "glasgow-city", wards: 23, councillors: 85, url: "https://www.glasgow.gov.uk/article/12567/My-Councillor-Address-Search" },
  { councilSlug: "highland", wards: 21, councillors: 74, url: "https://www.highland.gov.uk/councillors" },
  { councilSlug: "inverclyde", wards: 7, councillors: 22, url: "https://www2.inverclyde.gov.uk/memberscontact/" },
  { councilSlug: "midlothian", wards: 6, councillors: 18, url: "https://midlothian.gov.uk/councillors/search" },
  { councilSlug: "moray", wards: 8, councillors: 26, url: "https://www.moray.gov.uk/council-and-government/councillors/" },
  { councilSlug: "na-h-eileanan-siar", wards: 11, councillors: 29, url: "https://www.cne-siar.gov.uk/council-and-committees/wards-and-councillors/councillors" },
  { councilSlug: "north-ayrshire", wards: 9, councillors: 33, url: "https://north-ayrshire.cmis.uk.com/north-ayrshire/Councillors.aspx" },
  { councilSlug: "north-lanarkshire", wards: 21, councillors: 77, url: "https://www.northlanarkshire.gov.uk/your-council/councillors-and-committees/your-councillor" },
  { councilSlug: "orkney-islands", wards: 6, councillors: 21, url: "https://www.orkney.gov.uk/council-and-democracy/how-the-council-works/your-councillors/find-your-councillor" },
  { councilSlug: "perth-and-kinross", wards: 12, councillors: 40, url: "https://www.pkc.gov.uk/article/15505/Find-your-local-councillor" },
  { councilSlug: "renfrewshire", wards: 12, councillors: 43, url: "https://www.renfrewshire.gov.uk/council-and-elections/councillors-and-council-boards/councillors" },
  { councilSlug: "scottish-borders", wards: 11, councillors: 34, url: "https://www.scotborders.gov.uk/councillors-committees/council-wards" },
  { councilSlug: "shetland-islands", wards: 7, councillors: 23, url: "https://www.shetland.gov.uk/councillors" },
  { councilSlug: "south-ayrshire", wards: 8, councillors: 28, url: "https://www.south-ayrshire.gov.uk/article/24777/Find-my-councillor" },
  { councilSlug: "south-lanarkshire", wards: 20, councillors: 64, url: "https://www.southlanarkshire.gov.uk/info/200236/politicians/933/councillors/2" },
  { councilSlug: "stirling", wards: 7, councillors: 23, url: "https://my.stirling.gov.uk/councillors" },
  { councilSlug: "west-dunbartonshire", wards: 6, councillors: 22, url: "https://www.west-dunbarton.gov.uk/council/councillors-and-committees/councillor/find-my-councillor" },
  { councilSlug: "west-lothian", wards: 9, councillors: 33, url: "https://coins.westlothian.gov.uk/coins/allMembers.asp?sort=0" },
];

/** The name people search with, e.g. "Glasgow", "Western Isles". */
export function councilSearchName(slug: string) {
  return COUNCIL_SEARCH_NAMES[slug] ?? slug;
}

/** 355 wards and 1,226 councillors, summed rather than typed. */
export const COUNCILLOR_TOTALS = {
  councils: COUNCILLOR_FINDERS.length,
  wards: COUNCILLOR_FINDERS.reduce((sum, row) => sum + row.wards, 0),
  councillors: COUNCILLOR_FINDERS.reduce((sum, row) => sum + row.councillors, 0),
};

export function councillorFinder(slug: string) {
  return COUNCILLOR_FINDERS.find((row) => row.councilSlug === slug);
}

/* ------------------------------------------------------------------ */
/* MSPs                                                                */
/* ------------------------------------------------------------------ */

export const SCOTTISH_PARLIAMENT = {
  constituencyMsps: 73,
  regionalMsps: 56,
  regions: 8,
  regionalPerRegion: 7,
  /** One constituency MSP plus seven regional MSPs. */
  perPerson: 8,
  /** The current Parliament was elected on this date (term start in the Scottish Parliament's own data). */
  elected: "7 May 2026",
  phone: "0131 348 5000",
  phoneHref: "tel:01313485000",
  freephone: "0800 092 7500",
  freephoneHref: "tel:08000927500",
  hours: "10am to 1pm and 2pm to 4pm, Monday to Friday",
  address: ["The Scottish Parliament", "Edinburgh", "EH99 1SP"],
  source: { publisher: "Scottish Parliament", url: "https://www.parliament.scot/msps/about-msps" } satisfies Source,
  contactSource: { publisher: "Scottish Parliament", url: "https://www.parliament.scot/contact-us" } satisfies Source,
} as const;

export const TOTAL_MSPS = SCOTTISH_PARLIAMENT.constituencyMsps + SCOTTISH_PARLIAMENT.regionalMsps;

/* ------------------------------------------------------------------ */
/* Life expectancy, Glasgow                                            */
/* ------------------------------------------------------------------ */

type MenWomen = { men: number; women: number };

/**
 * National Records of Scotland, Life Expectancy in Scotland 2022 to 2024,
 * published 10 December 2025. Council figures come from abridged life tables
 * (Table 5), so Scotland is compared on the same abridged basis (Table 3).
 * The national headline from full life tables (Table 1) is kept separately.
 */
export const LIFE_EXPECTANCY = {
  published: "10 December 2025",
  /** Life expectancy at birth, three year periods, Glasgow City and Scotland. Oldest first; the last row is the latest. */
  trend: [
    { period: "2001 to 2003", glasgow: { men: 69.1, women: 76.4 }, scotland: { men: 73.5, women: 78.9 } },
    { period: "2009 to 2011", glasgow: { men: 72.1, women: 78.2 }, scotland: { men: 76.2, women: 80.6 } },
    { period: "2012 to 2014", glasgow: { men: 73.3, women: 78.7 }, scotland: { men: 77.1, women: 81.1 } },
    { period: "2017 to 2019", glasgow: { men: 73.6, women: 78.3 }, scotland: { men: 77.2, women: 81.1 } },
    { period: "2020 to 2022", glasgow: { men: 72.9, women: 77.9 }, scotland: { men: 76.5, women: 80.7 } },
    { period: "2021 to 2023", glasgow: { men: 73.6, women: 78.3 }, scotland: { men: 76.8, women: 80.8 } },
    { period: "2022 to 2024", glasgow: { men: 74.3, women: 78.7 }, scotland: { men: 77.2, women: 81.1 } },
  ] as { period: string; glasgow: MenWomen; scotland: MenWomen }[],
  /** NRS headline national figures, full life tables, 2022 to 2024. */
  scotlandHeadline: { men: 77.12, women: 81.06 } as MenWomen,
  /** Further years expected at age 65, 2022 to 2024 (abridged tables). */
  at65: { glasgow: { men: 15.8, women: 18.1 }, scotland: { men: 17.8, women: 19.8 } },
  /** All 32 council areas at birth, 2022 to 2024, lowest male figure first. */
  councils: [
    { slug: "glasgow-city", men: 74.3, women: 78.7 },
    { slug: "north-ayrshire", men: 75.0, women: 79.7 },
    { slug: "west-dunbartonshire", men: 75.0, women: 79.7 },
    { slug: "north-lanarkshire", men: 75.2, women: 78.9 },
    { slug: "dundee-city", men: 75.3, women: 79.6 },
    { slug: "inverclyde", men: 75.6, women: 79.6 },
    { slug: "east-ayrshire", men: 75.7, women: 78.9 },
    { slug: "clackmannanshire", men: 75.9, women: 80.3 },
    { slug: "falkirk", men: 76.3, women: 80.0 },
    { slug: "renfrewshire", men: 76.5, women: 80.9 },
    { slug: "na-h-eileanan-siar", men: 76.8, women: 80.8 },
    { slug: "south-ayrshire", men: 76.8, women: 81.3 },
    { slug: "south-lanarkshire", men: 76.8, women: 80.5 },
    { slug: "dumfries-and-galloway", men: 77.2, women: 81.2 },
    { slug: "aberdeen-city", men: 77.3, women: 81.3 },
    { slug: "fife", men: 77.3, women: 80.9 },
    { slug: "west-lothian", men: 77.3, women: 80.8 },
    { slug: "highland", men: 77.7, women: 82.0 },
    { slug: "moray", men: 77.7, women: 82.2 },
    { slug: "midlothian", men: 77.8, women: 82.0 },
    { slug: "angus", men: 78.1, women: 81.7 },
    { slug: "argyll-and-bute", men: 78.1, women: 81.9 },
    { slug: "city-of-edinburgh", men: 78.3, women: 82.2 },
    { slug: "stirling", men: 78.5, women: 82.2 },
    { slug: "east-lothian", men: 78.7, women: 82.6 },
    { slug: "scottish-borders", men: 79.0, women: 82.7 },
    { slug: "perth-and-kinross", men: 79.1, women: 82.8 },
    { slug: "orkney-islands", men: 79.3, women: 82.8 },
    { slug: "aberdeenshire", men: 79.5, women: 82.9 },
    { slug: "shetland-islands", men: 79.5, women: 83.9 },
    { slug: "east-dunbartonshire", men: 80.3, women: 84.2 },
    { slug: "east-renfrewshire", men: 81.5, women: 84.9 },
  ] as ({ slug: string } & MenWomen)[],
  /**
   * Inside Glasgow, by local deprivation fifth: 1 is the most deprived 20% of
   * Glasgow's own neighbourhoods, 5 the least. Five year period, published
   * 25 March 2026.
   */
  glasgowByDeprivation: {
    period: "2020 to 2024",
    rows: [
      { fifth: 1, men: 67.6, women: 74.0 },
      { fifth: 2, men: 71.0, women: 76.2 },
      { fifth: 3, men: 72.8, women: 77.6 },
      { fifth: 4, men: 76.8, women: 80.6 },
      { fifth: 5, men: 80.9, women: 84.0 },
    ],
  },
  /** Scotland's most and least deprived tenths (national SIMD deciles), 2022 to 2024. */
  scotlandByDeprivation: {
    mostDeprived: { men: 69.8, women: 75.3 } as MenWomen,
    leastDeprived: { men: 83.0, women: 85.8 } as MenWomen,
  },
  source: {
    publisher: "National Records of Scotland",
    url: "https://nrscotland.gov.uk/publications/life-expectancy-in-scotland-2022-2024",
  } satisfies Source,
  deprivationSource: {
    publisher: "National Records of Scotland",
    url: "https://nrscotland.gov.uk/media/rxznc42q/life-expectancy-in-council-areas-by-local-simd-quintile.xlsx",
  } satisfies Source,
};

export const LIFE_EXPECTANCY_LATEST = LIFE_EXPECTANCY.trend[LIFE_EXPECTANCY.trend.length - 1];

/** One decimal place, without floating point noise. */
export function years(value: number) {
  return value.toFixed(1);
}

/* ------------------------------------------------------------------ */
/* Unemployment                                                        */
/* ------------------------------------------------------------------ */

/**
 * ONS Labour Force Survey, Scotland (dataset HI11) and the regional bulletin,
 * both published 20 October 2026. Seasonally adjusted. Unemployment is for
 * people aged 16 and over; employment and inactivity are for ages 16 to 64.
 */
export const LABOUR_MARKET = {
  published: "20 October 2026",
  nextRelease: "17 November 2026",
  /** June to August in each year, so the months match. Oldest first; the last row is the latest. */
  junToAug: [
    { year: 2008, rate: 4.6, employment: 73.8 },
    { year: 2010, rate: 8.5, employment: 70.4 },
    { year: 2012, rate: 8.4, employment: 70.7 },
    { year: 2014, rate: 5.7, employment: 73.8 },
    { year: 2016, rate: 4.8, employment: 73.7 },
    { year: 2018, rate: 3.9, employment: 74.9 },
    { year: 2020, rate: 4.3, employment: 73.5 },
    { year: 2022, rate: 3.3, employment: 75.0 },
    { year: 2024, rate: 3.9, employment: 73.4 },
    { year: 2025, rate: 3.7, employment: 74.4 },
    { year: 2026, rate: 4.3, employment: 74.0 },
  ],
  /** The rolling three month figures earlier in 2026, before the latest. */
  earlier2026: [
    { months: "January to March", rate: 4.4 },
    { months: "February to April", rate: 4.4 },
    { months: "March to May", rate: 4.7 },
    { months: "April to June", rate: 5.1 },
    { months: "May to July", rate: 5.1 },
  ],
  scotland: {
    /** People aged 16 and over, unemployed, June to August 2026. */
    unemployed: 118_940,
    inactivity: 22.6,
  },
  uk: { rate: 4.7, changeOnYear: -0.1, employment: 75.3, inactivity: 20.9 },
  source: {
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/regionallabourmarket/october2026",
  } satisfies Source,
  datasetSource: {
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/datasets/headlinelabourforcesurveyindicatorsforscotlandhi11",
  } satisfies Source,
};

const junToAugLatest = LABOUR_MARKET.junToAug[LABOUR_MARKET.junToAug.length - 1];
const junToAugYearBefore = LABOUR_MARKET.junToAug[LABOUR_MARKET.junToAug.length - 2];

export const LABOUR_MARKET_LATEST = {
  period: "June to August 2026",
  ...junToAugLatest,
  /** Percentage points against the same months a year earlier, from the rounded rates. */
  rateChangeOnYear: Math.round((junToAugLatest.rate - junToAugYearBefore.rate) * 10) / 10,
  employmentChangeOnYear: Math.round((junToAugLatest.employment - junToAugYearBefore.employment) * 10) / 10,
};

/**
 * ONS Annual Population Survey via Nomis, July 2025 to June 2026. A bigger
 * pooled sample than the monthly survey, so it is the one that splits by age.
 */
export const ANNUAL_POPULATION_SURVEY = {
  period: "July 2025 to June 2026",
  scotland: { rate: 4.0, youth: 14.3, youthMargin: 2.6, youthUnemployed: 49_700, employment: 74.4, youthEmployment: 53.1 },
  uk: { rate: 4.4, youth: 14.0, employment: 75.5, youthEmployment: 51.4 },
  source: { publisher: "ONS Annual Population Survey, via Nomis", url: "https://www.nomisweb.co.uk/datasets/apsnew" } satisfies Source,
};

/**
 * ONS model based estimates of unemployment for each council, July 2025 to
 * June 2026, people aged 16 and over. Margin is the published 95% confidence
 * interval, plus or minus, in percentage points. Highest first.
 */
export const COUNCIL_UNEMPLOYMENT = {
  period: "July 2025 to June 2026",
  rows: [
    { slug: "glasgow-city", rate: 7.0, margin: 1.6, unemployed: 22_500 },
    { slug: "dundee-city", rate: 5.9, margin: 1.7, unemployed: 4_400 },
    { slug: "orkney-islands", rate: 5.5, margin: 3.9, unemployed: 100 },
    { slug: "aberdeen-city", rate: 4.7, margin: 1.5, unemployed: 5_900 },
    { slug: "east-ayrshire", rate: 4.5, margin: 1.4, unemployed: 2_600 },
    { slug: "west-dunbartonshire", rate: 4.5, margin: 1.4, unemployed: 2_000 },
    { slug: "inverclyde", rate: 4.2, margin: 1.5, unemployed: 1_600 },
    { slug: "fife", rate: 4.2, margin: 1.1, unemployed: 7_700 },
    { slug: "south-lanarkshire", rate: 4.0, margin: 1.1, unemployed: 6_400 },
    { slug: "north-ayrshire", rate: 3.9, margin: 1.2, unemployed: 2_500 },
    { slug: "north-lanarkshire", rate: 3.9, margin: 1.1, unemployed: 6_700 },
    { slug: "renfrewshire", rate: 3.8, margin: 1.1, unemployed: 3_300 },
    { slug: "angus", rate: 3.7, margin: 1.2, unemployed: 2_200 },
    { slug: "south-ayrshire", rate: 3.6, margin: 1.1, unemployed: 1_900 },
    { slug: "city-of-edinburgh", rate: 3.6, margin: 1.0, unemployed: 10_900 },
    { slug: "falkirk", rate: 3.4, margin: 1.0, unemployed: 2_900 },
    { slug: "stirling", rate: 3.4, margin: 1.1, unemployed: 1_700 },
    { slug: "east-dunbartonshire", rate: 3.4, margin: 1.1, unemployed: 1_700 },
    { slug: "midlothian", rate: 3.3, margin: 1.2, unemployed: 1_600 },
    { slug: "argyll-and-bute", rate: 3.3, margin: 1.2, unemployed: 1_300 },
    { slug: "clackmannanshire", rate: 3.2, margin: 1.2, unemployed: 900 },
    { slug: "dumfries-and-galloway", rate: 3.2, margin: 1.1, unemployed: 2_500 },
    { slug: "east-lothian", rate: 3.1, margin: 1.1, unemployed: 1_800 },
    { slug: "highland", rate: 3.1, margin: 1.2, unemployed: 3_700 },
    { slug: "moray", rate: 3.0, margin: 1.0, unemployed: 1_600 },
    { slug: "scottish-borders", rate: 3.0, margin: 1.0, unemployed: 1_800 },
    { slug: "east-renfrewshire", rate: 2.9, margin: 1.0, unemployed: 1_400 },
    { slug: "west-lothian", rate: 2.9, margin: 0.9, unemployed: 3_200 },
    { slug: "aberdeenshire", rate: 2.8, margin: 0.9, unemployed: 4_100 },
    { slug: "perth-and-kinross", rate: 2.8, margin: 0.9, unemployed: 2_400 },
    { slug: "na-h-eileanan-siar", rate: 2.3, margin: 1.3, unemployed: 200 },
    { slug: "shetland-islands", rate: 2.2, margin: 1.9, unemployed: 300 },
  ],
  source: { publisher: "ONS model based estimates of unemployment, via Nomis", url: "https://www.nomisweb.co.uk/datasets/umb" } satisfies Source,
};

/** ONS Claimant Count via Nomis, not seasonally adjusted, share of residents aged 16 to 64. */
export const CLAIMANT_COUNT = {
  month: "September 2026",
  scotland: { claimants: 108_760, rate: 3.1 },
  uk: { rate: 3.9 },
  source: { publisher: "ONS Claimant Count, via Nomis", url: "https://www.nomisweb.co.uk/datasets/ucjsa" } satisfies Source,
};

/** "4.3%", with one decimal place always shown. */
export function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

/** "+0.6 points" or "down 0.4 points" style wording, for plain sentences. */
export function pointsChange(value: number) {
  if (value === 0) return "no change";
  return `${value > 0 ? "up" : "down"} ${Math.abs(value).toFixed(1)} points`;
}

/* ------------------------------------------------------------------ */
/* Crime, Glasgow                                                      */
/* ------------------------------------------------------------------ */

/**
 * Scottish Government, Recorded Crimes and Offences open data (data.gov.scot),
 * updated 13 August 2026, which matches the Recorded Crime in Scotland
 * 2025/26 bulletin. Years run April to March. Rates are per 10,000 people,
 * as published (whole numbers).
 */
export const GLASGOW_CRIME = {
  year: "2025/26",
  previousYear: "2024/25",
  glasgow: { crimes: 55_193, rate: 849, offences: 33_940, offenceRate: 522 },
  scotland: { crimes: 315_357, rate: 569, offenceRate: 347 },
  /** The five crime groups, 2025/26. */
  groups: [
    { group: "Violence that is not sexual", glasgow: 12_567, glasgowRate: 193, scotlandRate: 136 },
    { group: "Sexual crimes", glasgow: 2_454, glasgowRate: 38, scotlandRate: 30 },
    { group: "Theft, fraud and other dishonesty", glasgow: 20_167, glasgowRate: 310, scotlandRate: 213 },
    { group: "Damage and reckless behaviour", glasgow: 5_244, glasgowRate: 81, scotlandRate: 69 },
    { group: "Crimes against society (drugs, weapons, justice)", glasgow: 14_761, glasgowRate: 227, scotlandRate: 121 },
  ],
  /** Selected crimes inside those groups, Glasgow City, 2025/26. */
  detail: {
    murderAndCulpableHomicide: 13,
    seriousAssaultAndAttemptedMurder: 555,
    commonAssault: 10_688,
    robbery: 306,
    housebreaking: 839,
    fraud: 2_438,
    vandalism: 4_263,
    drugsPossession: 4_823,
    drugsSupply: 1_275,
    weaponsUsed: 1_930,
    weaponsNotUsed: 1_007,
  },
  /** Earlier years for the trend, oldest first. The latest year is the glasgow and scotland blocks above. */
  history: [
    { year: "1996/97", glasgow: 98_626, glasgowRate: 1_647, scotland: 488_968, scotlandRate: 960 },
    { year: "2006/07", glasgow: 88_394, glasgowRate: 1_555, scotland: 497_424, scotlandRate: 969 },
    { year: "2016/17", glasgow: 53_990, glasgowRate: 899, scotland: 298_154, scotlandRate: 555 },
    { year: "2019/20", glasgow: 53_286, glasgowRate: 870, scotland: 305_220, scotlandRate: 564 },
    { year: "2021/22", glasgow: 48_846, glasgowRate: 800, scotland: 286_464, scotlandRate: 529 },
    { year: "2024/25", glasgow: 52_406, glasgowRate: 806, scotland: 299_111, scotlandRate: 539 },
  ],
  source: {
    publisher: "Scottish Government",
    url: "https://data.gov.scot/dataset/recorded_crimes_and_offences",
  } satisfies Source,
};

/** The year before the latest, from the history. */
export const GLASGOW_CRIME_PREVIOUS = GLASGOW_CRIME.history[GLASGOW_CRIME.history.length - 1];

/** Percentage change, rounded to a whole number. */
export function changePct(from: number, to: number) {
  return Math.round(((to - from) / from) * 100);
}
