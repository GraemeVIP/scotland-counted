/**
 * Pay figures for the wages guides: the minimum wage 2027 page, the average
 * salary page and the four city minimum wage pages.
 *
 * The legal rates live in MINIMUM_WAGE (quickAnswers.ts) and take home pay
 * comes from the shared tax engine, so nothing here repeats a rate. What is
 * new here is local: ONS earnings by council and ONS rents by rental area.
 *
 * Checked on 29 October 2026.
 */

import { calculate } from "@/lib/tax/engine";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, bandFor } from "@/lib/data/quickAnswers";

/** The illustration every pay page uses: 37.5 paid hours, every week of the year. */
export const FULL_TIME = { hours: 37.5, weeks: 52 } as const;

/**
 * Gross and take home pay for an hourly rate at FULL_TIME hours, with Scottish
 * income tax and employee National Insurance for 2026/27, from the same engine
 * as the take home pay calculator.
 */
export function fullTimePay(hourly: number) {
  const weekly = hourly * FULL_TIME.hours;
  const annual = weekly * FULL_TIME.weeks;
  const result = calculate(annual, "scotland");
  return {
    hourly,
    weekly,
    annual,
    monthly: annual / 12,
    tax: result.tax.total,
    ni: result.ni.total,
    net: result.net,
    netMonthly: result.net / 12,
    netWeekly: result.net / FULL_TIME.weeks,
  };
}

/** Full time pay at the legal minimum for 21 and over, now and from April 2027. */
export const minimumWageNow = fullTimePay(MINIMUM_WAGE.current.over21);
export const minimumWageNext = fullTimePay(MINIMUM_WAGE.next.over21);

/** The real Living Wage gap, per hour and over a full time year. */
export function livingWageGap(legalRate: number) {
  const hourly = REAL_LIVING_WAGE.uk - legalRate;
  return { hourly, annual: hourly * FULL_TIME.hours * FULL_TIME.weeks };
}

/** Where to go if you are paid less than the minimum wage. GOV.UK, checked 29 October 2026. */
export const PAY_HELP = {
  acasPhone: "0300 123 1100",
  acasPhoneHref: "tel:03001231100",
  acasHours: "Monday to Friday, 8am to 6pm",
  complainUrl: "https://www.gov.uk/pay-and-work-rights",
  source: { publisher: "GOV.UK", url: "https://www.gov.uk/pay-and-work-rights" },
} as const;

/**
 * ONS Annual Survey of Hours and Earnings, 2026 provisional results, released
 * 22 October 2026. Pay period including 22 April 2026.
 *
 * Annual pay covers full time employees who had been in the same job for at
 * least a year, which is why it is a little lower than the weekly median times
 * 52. Medians, not means. Residence basis (where people live) unless marked.
 */
export const ASHE_2026 = {
  period: "April 2026",
  released: "22 October 2026",
  residenceSource: {
    publisher: "ONS",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/placeofresidencebylocalauthorityashetable8",
  },
  workplaceSource: {
    publisher: "ONS",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/placeofworkbylocalauthorityashetable7",
  },
  /** Table 8.7a, 8.1a and 8.6a, full time, people who live in Scotland. */
  scotland: {
    annual: 41591,
    annualMean: 48435,
    annualChangePct: 4.2,
    weekly: 825.4,
    /** Hourly, excluding overtime. */
    hourly: 21.59,
    spread: { p10: 26109, p20: 29689, p25: 31264, p75: 55145, p90: 75447 },
    /** Table 8.7a, all employees, full and part time, same job for a year. */
    allEmployeesAnnual: 34559,
  },
  /** Table 8.7a and 8.1a, full time, UK. */
  uk: { annual: 40911, weekly: 811.2 },
};

/**
 * Table 8.7a and 8.1a by council, full time, residence basis. annualCv is the
 * ONS coefficient of variation for the annual median: above 10 ONS says use
 * with caution. Orkney's annual figure is not published (sample too small).
 */
export const ASHE_2026_COUNCILS: { slug: string; annual: number | null; weekly: number; annualCv: number | null }[] = [
  { slug: "aberdeen-city", annual: 43092, weekly: 845.6, annualCv: 4.1 },
  { slug: "aberdeenshire", annual: 45213, weekly: 924.6, annualCv: 6 },
  { slug: "angus", annual: 39499, weekly: 801.7, annualCv: 5.5 },
  { slug: "argyll-and-bute", annual: 38865, weekly: 794.4, annualCv: 7.6 },
  { slug: "clackmannanshire", annual: 40582, weekly: 812.5, annualCv: 8.5 },
  { slug: "dumfries-and-galloway", annual: 34683, weekly: 705.3, annualCv: 7.1 },
  { slug: "dundee-city", annual: 38424, weekly: 759.5, annualCv: 3.8 },
  { slug: "east-ayrshire", annual: 38976, weekly: 756.7, annualCv: 5.9 },
  { slug: "east-dunbartonshire", annual: 46797, weekly: 976.4, annualCv: 7.3 },
  { slug: "east-lothian", annual: 39405, weekly: 802, annualCv: 6.9 },
  { slug: "east-renfrewshire", annual: 49073, weekly: 964.9, annualCv: 6.4 },
  { slug: "city-of-edinburgh", annual: 43272, weekly: 851, annualCv: 4.8 },
  { slug: "falkirk", annual: 40218, weekly: 761.8, annualCv: 5.6 },
  { slug: "fife", annual: 41409, weekly: 808.6, annualCv: 3.5 },
  { slug: "glasgow-city", annual: 39817, weekly: 810.4, annualCv: 4.7 },
  { slug: "highland", annual: 41485, weekly: 827.4, annualCv: 4 },
  { slug: "inverclyde", annual: 37819, weekly: 755.2, annualCv: 10 },
  { slug: "midlothian", annual: 42038, weekly: 833.5, annualCv: 6 },
  { slug: "moray", annual: 35605, weekly: 696.4, annualCv: 11 },
  { slug: "na-h-eileanan-siar", annual: 37728, weekly: 731.5, annualCv: 13 },
  { slug: "north-ayrshire", annual: 42234, weekly: 845.6, annualCv: 8.2 },
  { slug: "north-lanarkshire", annual: 41516, weekly: 824.8, annualCv: 4.1 },
  { slug: "orkney-islands", annual: null, weekly: 820.2, annualCv: null },
  { slug: "perth-and-kinross", annual: 40826, weekly: 823.4, annualCv: 5.7 },
  { slug: "renfrewshire", annual: 42592, weekly: 854.7, annualCv: 5.8 },
  { slug: "scottish-borders", annual: 35622, weekly: 743.9, annualCv: 7.6 },
  { slug: "shetland-islands", annual: 42282, weekly: 830.4, annualCv: 12 },
  { slug: "south-ayrshire", annual: 45079, weekly: 946.1, annualCv: 9.2 },
  { slug: "south-lanarkshire", annual: 41649, weekly: 829.2, annualCv: 4.3 },
  { slug: "stirling", annual: 45014, weekly: 860.7, annualCv: 8.4 },
  { slug: "west-dunbartonshire", annual: 39813, weekly: 780.3, annualCv: 9.3 },
  { slug: "west-lothian", annual: 41532, weekly: 808.6, annualCv: 5.2 },
];

export function asheCouncil(slug: string) {
  const row = ASHE_2026_COUNCILS.find((council) => council.slug === slug);
  if (!row) throw new Error(`No ASHE 2026 figures for ${slug}`);
  return row;
}

/**
 * ONS Price Index of Private Rents, released 21 October 2026, figures for
 * September 2026. Scotland is published by Broad Rental Market Area, not by
 * council. Scottish rents here are mostly advertised new lets, so they show
 * what someone moving now would pay.
 */
export const PRIVATE_RENTS = {
  month: "September 2026",
  released: "21 October 2026",
  source: {
    publisher: "ONS",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
  },
  scotland: { oneBed: 702, oneBedChangePct: 2.5, all: 1011, allChangePct: 0.7 },
};

export type CitySlug = "glasgow-city" | "city-of-edinburgh" | "aberdeen-city" | "dundee-city";

export type CityPay = {
  /** Council slug. */
  slug: CitySlug;
  /** The name people search with. */
  name: string;
  /** This city's minimum wage page. */
  path: string;
  /** ONS rental area the city sits in. */
  rentArea: string;
  rent: { oneBed: number; oneBedChangePct: number; all: number; allChangePct: number };
  /**
   * ASHE 2026 Table 7, jobs based in the city (workplace basis).
   * Hourly is all employees, full and part time, excluding overtime.
   */
  jobs: {
    count: number;
    hourlyP10: number;
    hourlyP20: number;
    hourlyMedian: number;
    fullTimeAnnual: number;
    fullTimeWeekly: number;
  };
};

export const CITY_PAY: Record<CitySlug, CityPay> = {
  "glasgow-city": {
    slug: "glasgow-city",
    name: "Glasgow",
    path: "/minimum-wage-in-glasgow-scotland",
    rentArea: "Greater Glasgow",
    rent: { oneBed: 845, oneBedChangePct: 3.0, all: 1266, allChangePct: 1.1 },
    jobs: { count: 429000, hourlyP10: 13.32, hourlyP20: 14.37, hourlyMedian: 20.61, fullTimeAnnual: 42573, fullTimeWeekly: 838.2 },
  },
  "city-of-edinburgh": {
    slug: "city-of-edinburgh",
    name: "Edinburgh",
    path: "/minimum-wage-in-edinburgh-scotland",
    rentArea: "Lothian",
    rent: { oneBed: 1036, oneBedChangePct: 3.1, all: 1411, allChangePct: 1.0 },
    jobs: { count: 387000, hourlyP10: 13.69, hourlyP20: 15.18, hourlyMedian: 22.26, fullTimeAnnual: 44574, fullTimeWeekly: 871.5 },
  },
  "aberdeen-city": {
    slug: "aberdeen-city",
    name: "Aberdeen",
    path: "/minimum-wage-aberdeen",
    rentArea: "Aberdeen and Shire",
    rent: { oneBed: 602, oneBedChangePct: 0.9, all: 844, allChangePct: -1.2 },
    jobs: { count: 201000, hourlyP10: 13.9, hourlyP20: 15.53, hourlyMedian: 23.17, fullTimeAnnual: 45696, fullTimeWeekly: 963.1 },
  },
  "dundee-city": {
    slug: "dundee-city",
    name: "Dundee",
    path: "/minimum-wage-dundee",
    rentArea: "Dundee and Angus",
    rent: { oneBed: 573, oneBedChangePct: 1.9, all: 826, allChangePct: 0.8 },
    jobs: { count: 86000, hourlyP10: 13.4, hourlyP20: 14.35, hourlyMedian: 19.66, fullTimeAnnual: 39379, fullTimeWeekly: 790.7 },
  },
};

/** The same hourly figures for all of Scotland, ASHE 2026 Table 7.6a. */
export const SCOTLAND_JOBS_HOURLY = { hourlyP10: 13.24, hourlyP20: 14.25, hourlyMedian: 19.63 };

export const CITY_ORDER: CitySlug[] = ["glasgow-city", "city-of-edinburgh", "aberdeen-city", "dundee-city"];

/**
 * A month on the full time legal minimum in each city: take home pay, then an
 * average one bedroom rent, then a Band A council tax and water bill.
 */
export function cityBudget(slug: CitySlug) {
  const city = CITY_PAY[slug];
  const bandA = bandFor(slug, "A");
  const councilTaxMonthly = bandA.total / 12;
  const takeHome = minimumWageNow.netMonthly;
  return {
    ...city,
    takeHome,
    councilTaxMonthly,
    councilTaxAnnual: bandA.total,
    councilTaxRisePct: bandA.change.percent,
    left: takeHome - city.rent.oneBed - councilTaxMonthly,
    rentShare: city.rent.oneBed / takeHome,
    residentFullTimeAnnual: asheCouncil(slug).annual,
  };
}

/** All four cities side by side, in CITY_ORDER. */
export function cityBudgets() {
  return CITY_ORDER.map((slug) => cityBudget(slug));
}
