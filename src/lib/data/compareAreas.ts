import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "./councils.ts";
import { councilExtra, SCOTLAND_EXTRA, CC_YEARS, JD_YEARS, PAY_YEARS } from "./councilExtra.ts";
import { councilTaxByBand, COUNCIL_TAX_YEAR } from "./councilTax.ts";
import { COUNCIL_UNEMPLOYMENT, ANNUAL_POPULATION_SURVEY, LIFE_EXPECTANCY } from "./local.ts";
import { councilDrugDeathRates2021to2025, councilPeriodRate2021to2025 } from "./drugDeaths.ts";
import { councilBenchmarks, LGBF_SOURCE } from "./councilBenchmarks.ts";
import { COMPARE_EXTRA } from "./compareAreasData.ts";

/**
 * Every measure the compare tool can show, for all 32 council areas.
 *
 * Each metric reads from the dataset its own area page already uses, so the
 * comparison can never disagree with the page it links to. Measures still
 * being gathered are listed with `pending: true` and no values, so the layout
 * shows where they will sit without inventing a figure.
 */

export type Direction = "higher-better" | "lower-better" | "neutral";

export type CompareMetric = {
  id: string;
  theme: ThemeId;
  label: string;
  plain: string;
  period: string;
  direction: Direction;
  source: { publisher: string; url: string };
  /** Formats a value for display, e.g. 23.3 → "23.3%". */
  format: (value: number) => string;
  /** What a higher figure means, in words, e.g. "More crime". Used as "More crime in Glasgow". */
  more?: string;
  /** Small print after the number, e.g. "per 10,000", so the big figure stays short. */
  unit?: string;
  /** Formats a difference between two areas, e.g. 4.1 → "4.1 points". */
  formatDiff: (value: number) => string;
  scotland: number | null;
  values: Record<string, number | null>;
  /** Where several councils share one published figure: the name of the shared area. */
  groups?: Record<string, string | null>;
  /** What a shared area is called, e.g. "rental area". */
  groupKind?: string;
  /** Why a value can be missing, shown in place of the number. */
  missing?: string;
  note?: string;
  pending?: boolean;
};

export const THEMES = [
  { id: "money", label: "Money and housing", blurb: "Pay, council tax and what a home costs." },
  { id: "work", label: "Jobs", blurb: "How many people are out of work, and how many jobs there are." },
  { id: "poverty", label: "Poverty and deprivation", blurb: "Children growing up without enough, and the poorest neighbourhoods." },
  { id: "safety", label: "Crime", blurb: "Crimes recorded by the police, for every 10,000 people." },
  { id: "health", label: "Health", blurb: "How long people live, and deaths from drugs." },
  { id: "schools", label: "Schools", blurb: "How school leavers do." },
  { id: "services", label: "Council services", blurb: "How the council itself performs, from the official benchmarking figures." },
  { id: "people", label: "People", blurb: "How many people live there, and how old they are." },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const slugs = councils.map((c) => c.slug);
const bySlug = <T,>(get: (slug: string) => T | null | undefined) =>
  Object.fromEntries(slugs.map((s) => [s, get(s) ?? null])) as Record<string, T | null>;
const last = <T,>(arr: readonly T[]) => arr[arr.length - 1];

const pct = (v: number) => `${v.toFixed(1)}%`;
const points = (v: number) => `${v.toFixed(1)} ${v === 1 ? "point" : "points"}`;
const pounds = (v: number) => `£${Math.round(v).toLocaleString("en-GB")}`;
const years = (v: number) => `${v.toFixed(1)} years`;

const NOMIS = { publisher: "ONS, via Nomis", url: "https://www.nomisweb.co.uk/" };

const payIdx = PAY_YEARS.length - 1;
const ccIdx = CC_YEARS.length - 1;
const jdIdx = JD_YEARS.length - 1;

const drugBySlug = Object.fromEntries(
  councilDrugDeathRates2021to2025.map((row) => [councils.find((c) => c.name === row.area)?.slug, row.rate])
) as Record<string, number | null>;

const lifeBySlug = Object.fromEntries(LIFE_EXPECTANCY.councils.map((row) => [row.slug, row]));
const lifeScotland = last(LIFE_EXPECTANCY.trend).scotland;

const existing: CompareMetric[] = [
  {
    id: "pay",
    theme: "money",
    label: "Full time weekly pay",
    plain: "The middle weekly pay of full time employees who live here, before tax. It leaves out the self employed and some small samples.",
    period: PAY_YEARS[payIdx],
    direction: "higher-better",
    source: NOMIS,
    format: pounds,
    formatDiff: (v) => `${pounds(v)} a week`,
    scotland: SCOTLAND_EXTRA.pay[payIdx],
    values: bySlug((s) => councilExtra[s]?.pay[payIdx]),
    missing: "Sample too small to publish",
  },
  {
    id: "council_tax",
    theme: "money",
    label: "Council tax, Band D",
    plain: "The yearly council tax bill for a Band D home, not counting water and sewerage.",
    period: COUNCIL_TAX_YEAR,
    direction: "neutral",
    source: { publisher: "Scottish Government", url: "https://www.gov.scot/publications/council-tax-datasets/" },
    format: pounds,
    formatDiff: (v) => `${pounds(v)} a year`,
    scotland: null,
    values: bySlug((s) => councilTaxByBand[s]?.D),
  },
  {
    id: "unemployment",
    theme: "work",
    label: "Unemployment",
    plain: "People who want a job and are looking, as a share of everyone working or looking.",
    period: COUNCIL_UNEMPLOYMENT.period,
    direction: "lower-better",
    source: COUNCIL_UNEMPLOYMENT.source,
    format: pct,
    formatDiff: points,
    scotland: ANNUAL_POPULATION_SURVEY.scotland.rate,
    values: bySlug((s) => COUNCIL_UNEMPLOYMENT.rows.find((r) => r.slug === s)?.rate),
    note: "Small areas have wide margins of error, so a gap under a point or two may not be real.",
  },
  {
    id: "claimants",
    theme: "work",
    label: "Out of work benefits",
    plain: "Adults aged 16 to 64 claiming benefits mainly because they are out of work.",
    period: `January ${CC_YEARS[ccIdx]}`,
    direction: "lower-better",
    source: NOMIS,
    format: pct,
    formatDiff: points,
    scotland: SCOTLAND_EXTRA.cc[ccIdx],
    values: bySlug((s) => councilExtra[s]?.cc[ccIdx]),
  },
  {
    id: "jobs_density",
    theme: "work",
    label: "Jobs per working age adult",
    plain: "Jobs based in the area for every resident aged 16 to 64. Below 1 means fewer jobs than working age people.",
    period: JD_YEARS[jdIdx],
    direction: "higher-better",
    source: NOMIS,
    format: (v) => v.toFixed(2),
    formatDiff: (v) => v.toFixed(2),
    scotland: SCOTLAND_EXTRA.jd[jdIdx],
    values: bySlug((s) => councilExtra[s]?.jd[jdIdx]),
  },
  {
    id: "child_poverty",
    theme: "poverty",
    label: "Child poverty",
    plain: "Children living in poverty once rent or mortgage costs are paid.",
    period: last(COUNCIL_YEARS),
    direction: "lower-better",
    source: { publisher: "End Child Poverty / Loughborough University", url: "https://endchildpoverty.org.uk/child-poverty-2025/" },
    format: pct,
    formatDiff: points,
    scotland: last(SCOTLAND_PCTS),
    values: bySlug((s) => last(councils.find((c) => c.slug === s)!.pcts)),
  },
  {
    id: "life_men",
    theme: "health",
    label: "Life expectancy, men",
    plain: "How long a baby boy born here can expect to live, at today's death rates.",
    period: last(LIFE_EXPECTANCY.trend).period,
    direction: "higher-better",
    source: { publisher: "National Records of Scotland", url: "https://nrscotland.gov.uk/publications/life-expectancy-in-scotland-2022-2024" },
    format: (v) => v.toFixed(1),
    unit: "years",
    formatDiff: years,
    scotland: lifeScotland.men,
    values: bySlug((s) => lifeBySlug[s]?.men),
  },
  {
    id: "life_women",
    theme: "health",
    label: "Life expectancy, women",
    plain: "How long a baby girl born here can expect to live, at today's death rates.",
    period: last(LIFE_EXPECTANCY.trend).period,
    direction: "higher-better",
    source: { publisher: "National Records of Scotland", url: "https://nrscotland.gov.uk/publications/life-expectancy-in-scotland-2022-2024" },
    format: (v) => v.toFixed(1),
    unit: "years",
    formatDiff: years,
    scotland: lifeScotland.women,
    values: bySlug((s) => lifeBySlug[s]?.women),
  },
  {
    id: "drug_deaths",
    theme: "health",
    label: "Drug deaths",
    plain: "Drug misuse deaths each year for every 100,000 people, averaged over five years.",
    period: "2021 to 2025",
    direction: "lower-better",
    source: { publisher: "National Records of Scotland", url: "https://www.nrscotland.gov.uk/publications/drug-related-deaths-in-scotland-2025/" },
    format: (v) => `${Math.round(v)}`,
    unit: "per 100,000",
    formatDiff: (v) => `${Math.round(v)} per 100,000`,
    scotland: councilPeriodRate2021to2025.rate,
    values: bySlug((s) => drugBySlug[s]),
    missing: "Too few deaths for a reliable rate",
  },
];

/** The council's own performance, from the Local Government Benchmarking Framework. */
const services: CompareMetric[] = (councilBenchmarks["glasgow-city"] ?? []).map((first) => {
  const all = bySlug((s) => councilBenchmarks[s]?.find((b) => b.code === first.code)?.value);
  const isPct = first.display.trim().endsWith("%");
  const isMoney = first.display.trim().startsWith("£");
  const format = (v: number) => (isPct ? pct(v) : isMoney ? pounds(v) : v.toFixed(1));
  return {
    id: `lgbf_${first.code}`,
    theme: "services",
    label: first.label,
    plain: first.plain,
    period: first.year,
    direction: first.direction === "higher" ? "higher-better" : first.direction === "lower" ? "lower-better" : "neutral",
    source: { publisher: LGBF_SOURCE.publisher, url: LGBF_SOURCE.url },
    format,
    formatDiff: isPct ? points : format,
    scotland: first.scotland,
    values: all,
  } satisfies CompareMetric;
});

const whole = (v: number) => Math.round(v).toLocaleString("en-GB");
const per10k = (v: number) => `${whole(v)} per 10,000`;
const signedPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

/**
 * The gathered measures, in display order, with how each is shown. A measure
 * not yet in COMPARE_EXTRA is listed as "being added" rather than left out, so
 * the layout is honest about what is still to come.
 */
const EXTRA_SPEC: Array<{
  id: string;
  theme: ThemeId;
  label: string;
  plain: string;
  direction: Direction;
  format: (v: number) => string;
  formatDiff: (v: number) => string;
  unit?: string;
  groupKind?: string;
  missing?: string;
}> = [
  { id: "house_price", theme: "money", label: "Average house price", plain: "The average price paid for a home.", direction: "neutral", format: pounds, formatDiff: pounds },
  { id: "house_price_change", theme: "money", label: "House prices, change over a year", plain: "How much the average price has moved in the last 12 months.", direction: "neutral", format: signedPct, formatDiff: points },
  { id: "rent", theme: "money", label: "Average private rent", plain: "The average monthly rent for a private let. ONS publishes some areas together, so neighbouring councils can share a figure.", direction: "neutral", format: pounds, unit: "a month", formatDiff: (v) => `${pounds(v)} a month`, groupKind: "rental area" },
  { id: "rent_change", theme: "money", label: "Rents, change over a year", plain: "How much the average private rent has moved in the last 12 months.", direction: "neutral", format: signedPct, formatDiff: points, groupKind: "rental area" },
  { id: "simd_most_deprived", theme: "poverty", label: "Most deprived neighbourhoods", plain: "Share of the area's neighbourhoods in Scotland's most deprived 20%.", direction: "lower-better", format: pct, formatDiff: points },
  { id: "crime_total", theme: "safety", label: "Recorded crime", plain: "All crimes recorded by the police, for every 10,000 people.", direction: "lower-better", format: whole, unit: "per 10,000", formatDiff: per10k },
  { id: "crime_violence", theme: "safety", label: "Violent crime", plain: "Non sexual crimes of violence, for every 10,000 people. Most of it is common assault.", direction: "lower-better", format: whole, unit: "per 10,000", formatDiff: per10k },
  { id: "crime_housebreaking", theme: "safety", label: "Housebreaking", plain: "Break ins to homes and other buildings, including attempts, for every 10,000 people.", direction: "lower-better", format: whole, unit: "per 10,000", formatDiff: per10k },
  { id: "leavers_higher", theme: "schools", label: "Leavers with a Higher", plain: "School leavers with at least one Higher or better.", direction: "higher-better", format: pct, formatDiff: points, missing: "Withheld to protect small numbers" },
  { id: "leavers_positive", theme: "schools", label: "Leavers into work, study or training", plain: "School leavers going on to a job, college, university or training.", direction: "higher-better", format: pct, formatDiff: points },
  { id: "population", theme: "people", label: "Population", plain: "Everyone living in the area.", direction: "neutral", format: (v) => Math.round(v).toLocaleString("en-GB"), formatDiff: (v) => `${Math.round(v).toLocaleString("en-GB")} people` },
  { id: "median_age", theme: "people", label: "Median age", plain: "Half the people here are older than this, half younger.", direction: "neutral", format: (v) => v.toFixed(1), unit: "years", formatDiff: years },
];

const gathered: CompareMetric[] = EXTRA_SPEC.map((spec) => {
  const data = COMPARE_EXTRA.find((m) => m.id === spec.id);
  if (!data) {
    return { ...spec, period: "", source: { publisher: "", url: "" }, scotland: null, values: {}, pending: true };
  }
  return {
    ...spec,
    period: data.period,
    source: { publisher: data.source.publisher, url: data.source.url },
    scotland: data.scotland,
    values: data.values,
    groups: data.groups,
  };
});

/** How a higher figure reads in a sentence, for the verdict line on each measure. */
const MORE: Record<string, string> = {
  pay: "Pay is higher",
  council_tax: "Council tax is higher",
  house_price: "Homes cost more",
  house_price_change: "Prices are rising faster",
  rent: "Rent is higher",
  rent_change: "Rents are rising faster",
  unemployment: "More people out of work",
  claimants: "More people on out of work benefits",
  jobs_density: "More jobs per person",
  child_poverty: "More children in poverty",
  simd_most_deprived: "More deprived neighbourhoods",
  crime_total: "More crime",
  crime_violence: "More violent crime",
  crime_housebreaking: "More break ins",
  life_men: "Men live longer",
  life_women: "Women live longer",
  drug_deaths: "More drug deaths",
  leavers_higher: "More leavers get a Higher",
  leavers_positive: "More leavers go on to work or study",
  population: "More people live",
  median_age: "People are older",
};
const LGBF_MORE: Record<string, string> = {
  "Cost of bin collection, per property": "Bin collection costs more",
  "Cost per primary school pupil": "More is spent on each primary pupil",
  "Council tax actually collected": "More council tax is collected",
  "Happy with street cleaning": "More people are happy with street cleaning",
  "Household waste recycled": "More waste is recycled",
  "Main roads needing repair": "More main roads need repair",
  "Sick days per staff member": "Council staff take more sick days",
};

export const COMPARE_METRICS: CompareMetric[] = [...existing, ...gathered, ...services].map((m) => ({
  ...m,
  more: MORE[m.id] ?? LGBF_MORE[m.label],
}));

/** The one measure that sums up each theme in the "at a glance" summary. */
export const KEY_FACTS: Partial<Record<ThemeId, string>> = {
  money: "house_price",
  work: "unemployment",
  poverty: "child_poverty",
  safety: "crime_total",
  health: "life_men",
  schools: "leavers_higher",
  people: "population",
};

/** How big the gap between two areas is, measured against the spread across all 32. */
export function gapSize(metric: CompareMetric, a: string, b: string): "same" | "small" | "clear" | "big" | null {
  const va = metric.values[a];
  const vb = metric.values[b];
  if (va == null || vb == null) return null;
  if (metric.format(va) === metric.format(vb)) return "same";
  const { min, max } = rangeOf(metric);
  const share = Math.abs(va - vb) / (max - min || 1);
  return share < 0.06 ? "same" : share < 0.2 ? "small" : share < 0.45 ? "clear" : "big";
}

/**
 * The pairing /compare-areas opens on. Not Glasgow and Edinburgh, which has
 * its own page: the same comparison on two pages would compete in search.
 * Edinburgh and Fife is a real moving decision for commuters.
 */
export const COMPARE_DEFAULTS = { a: "city-of-edinburgh", b: "fife" };

/**
 * Where an area sits among all 32: 1 is the highest value. Ties share a rank.
 * Returns null when the area has no value.
 */
export function rankOf(metric: CompareMetric, slug: string) {
  const value = metric.values[slug];
  if (value == null) return null;
  const others = Object.values(metric.values).filter((v): v is number => v != null);
  return { rank: others.filter((v) => v > value).length + 1, of: others.length };
}

/** The lowest and highest value across every council with a figure. */
export function rangeOf(metric: CompareMetric) {
  const vals = Object.values(metric.values).filter((v): v is number => v != null);
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

/** Which of two areas is ahead on a measure where higher or lower is clearly better. */
export function winner(metric: CompareMetric, a: string, b: string): "a" | "b" | "tie" | null {
  const va = metric.values[a];
  const vb = metric.values[b];
  if (metric.direction === "neutral" || va == null || vb == null) return null;
  if (metric.format(va) === metric.format(vb)) return "tie";
  const aHigher = va > vb;
  return metric.direction === "higher-better" ? (aHigher ? "a" : "b") : aHigher ? "b" : "a";
}

/* ---------- Rankings across all 32 areas ---------- */

/** A gathered measure by its id; undefined while it is still being added. */
export const metricById = (id: string) => COMPARE_METRICS.find((m) => m.id === id && !m.pending);

/**
 * Every council on one measure, lowest first ("asc") or highest first
 * ("desc"). Equal figures, as displayed, share a rank. Councils without a
 * published figure are left out.
 */
export function rankAreas(id: string, order: "asc" | "desc") {
  const metric = metricById(id);
  if (!metric) return [];
  const rows = Object.entries(metric.values)
    .filter((entry): entry is [string, number] => entry[1] != null)
    .sort((x, y) => (order === "asc" ? x[1] - y[1] : y[1] - x[1]));
  let rank = 0;
  let previous: string | null = null;
  return rows.map(([slug, value], i) => {
    const shown = metric.format(value);
    if (shown !== previous) rank = i + 1;
    previous = shown;
    return { slug, value, rank };
  });
}

/**
 * 0 to 100 on one measure: 100 is the best of the 32 councils, 0 the worst.
 * Null where the area has no figure or the measure has no better direction.
 */
export function goodness(metric: CompareMetric, slug: string) {
  const v = metric.values[slug];
  if (v == null || metric.direction === "neutral") return null;
  const { min, max } = rangeOf(metric);
  const t = (v - min) / (max - min || 1);
  return (metric.direction === "higher-better" ? t : 1 - t) * 100;
}

/**
 * What the "best place to live" ranking weighs: six parts of life, each
 * counted once however many measures it has, so three crime measures do not
 * outweigh one on pay. Prices, rents and council tax are left out on purpose:
 * cheaper is not better for everyone, and they have their own ranking.
 */
export const LIVING_THEMES: Partial<Record<ThemeId, string[]>> = {
  money: ["pay"],
  work: ["unemployment", "claimants", "jobs_density"],
  poverty: ["child_poverty", "simd_most_deprived"],
  safety: ["crime_total", "crime_violence", "crime_housebreaking"],
  health: ["life_men", "life_women", "drug_deaths"],
  schools: ["leavers_higher", "leavers_positive"],
};

/** The same idea for families: schools, children growing up in poverty, safety and health. */
export const FAMILY_THEMES: Partial<Record<ThemeId, string[]>> = {
  schools: ["leavers_higher", "leavers_positive"],
  poverty: ["child_poverty"],
  safety: ["crime_total", "crime_violence", "crime_housebreaking"],
  health: ["life_men", "life_women"],
};

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

/**
 * Scores every council out of 100: the average of its theme scores, where a
 * theme score is the average of its measures' 0 to 100 scores. Highest first.
 */
export function placeScores(themes: Partial<Record<ThemeId, string[]>> = LIVING_THEMES) {
  const scored = slugs.map((slug) => {
    const byTheme = {} as Partial<Record<ThemeId, number | null>>;
    for (const [theme, ids] of Object.entries(themes) as Array<[ThemeId, string[]]>) {
      const parts = ids.flatMap((id) => {
        const metric = metricById(id);
        const g = metric ? goodness(metric, slug) : null;
        return g == null ? [] : [g];
      });
      byTheme[theme] = parts.length ? mean(parts) : null;
    }
    const present = Object.values(byTheme).filter((v): v is number => v != null);
    return { slug, score: present.length ? mean(present) : 0, themes: byTheme };
  });
  return scored.sort((x, y) => y.score - x.score).map((row, i) => ({ ...row, rank: i + 1 }));
}

/** The four council areas that are cities, for "best city" and "cheapest city" answers. */
export const CITY_SLUGS = ["aberdeen-city", "city-of-edinburgh", "dundee-city", "glasgow-city"];
