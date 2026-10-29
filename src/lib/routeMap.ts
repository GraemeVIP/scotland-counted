/**
 * Exact match addresses.
 *
 * Every page that targets a search phrase carries that phrase, word for word
 * and in order, in its address, its title and its H1. This file maps the old
 * addresses to the new ones. next.config.ts reads it for the permanent
 * redirects, the sitemap reads it, and every internal link goes through the
 * helpers below, so an address is changed in one place.
 *
 * No imports: next.config.ts loads this file directly.
 */

/** Council slug to the place name people actually search with. */
export const COUNCIL_SEARCH_NAMES: Record<string, string> = {
  "aberdeen-city": "Aberdeen",
  aberdeenshire: "Aberdeenshire",
  angus: "Angus",
  "argyll-and-bute": "Argyll and Bute",
  "city-of-edinburgh": "Edinburgh",
  clackmannanshire: "Clackmannanshire",
  "dumfries-and-galloway": "Dumfries and Galloway",
  "dundee-city": "Dundee",
  "east-ayrshire": "East Ayrshire",
  "east-dunbartonshire": "East Dunbartonshire",
  "east-lothian": "East Lothian",
  "east-renfrewshire": "East Renfrewshire",
  falkirk: "Falkirk",
  fife: "Fife",
  "glasgow-city": "Glasgow",
  highland: "Highland",
  inverclyde: "Inverclyde",
  midlothian: "Midlothian",
  moray: "Moray",
  "na-h-eileanan-siar": "Western Isles",
  "north-ayrshire": "North Ayrshire",
  "north-lanarkshire": "North Lanarkshire",
  "orkney-islands": "Orkney",
  "perth-and-kinross": "Perth and Kinross",
  renfrewshire: "Renfrewshire",
  "scottish-borders": "Scottish Borders",
  "shetland-islands": "Shetland",
  "south-ayrshire": "South Ayrshire",
  "south-lanarkshire": "South Lanarkshire",
  stirling: "Stirling",
  "west-dunbartonshire": "West Dunbartonshire",
  "west-lothian": "West Lothian",
};

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const BAND_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** /glasgow-council-tax-bands: carries "glasgow council tax" and "glasgow council tax bands". */
export function councilTaxPath(councilSlug: string) {
  const name = COUNCIL_SEARCH_NAMES[councilSlug];
  if (!name) throw new Error(`No search name for council ${councilSlug}`);
  return `/${slugify(name)}-council-tax-bands`;
}

/** /council-tax-band-d-scotland */
export function councilTaxBandPath(letter: string) {
  return `/council-tax-band-${letter.toLowerCase()}-scotland`;
}

/** Posts that moved out of /blog to a top level exact match address. */
export const POST_PATHS: Record<string, string> = {
  "minimum-wage-take-home-pay-scotland-2026": "/minimum-wage-scotland",
  "real-living-wage-vs-minimum-wage-scotland": "/real-living-wage-scotland",
  "crisis-grant-scotland-how-to-apply": "/crisis-grant-scotland",
  "council-tax-rises-scotland-2026-27": "/council-tax-increase-scotland",
  "what-is-the-scottish-child-payment": "/scottish-child-payment",
  "energy-price-cap-scotland-2026-explained": "/energy-price-cap-scotland",
  "best-performing-councils-scotland": "/best-council-in-scotland",
  "adult-disability-payment": "/adult-disability-payment",
  "adult-disability-payment-phone-number": "/adult-disability-payment-phone-number",
  "carer-support-payment": "/carer-support-payment",
  "best-start-grant": "/best-start-grant",
  "winter-fuel-payment-scotland": "/winter-fuel-payment-scotland",
  "winter-heating-payment": "/winter-heating-payment",
  "social-security-scotland-payment-dates": "/social-security-scotland-payment-dates",
  "young-carers-allowance-scotland": "/young-carers-allowance-scotland",
  "crisis-grant-phone-number": "/crisis-grant-phone-number",
  "minimum-wage-2027": "/minimum-wage-2027",
  "average-salary-scotland": "/average-salary-scotland",
  "minimum-wage-in-glasgow-scotland": "/minimum-wage-in-glasgow-scotland",
  "minimum-wage-in-edinburgh-scotland": "/minimum-wage-in-edinburgh-scotland",
  "minimum-wage-aberdeen": "/minimum-wage-aberdeen",
  "minimum-wage-dundee": "/minimum-wage-dundee",
  "check-council-tax-band": "/check-council-tax-band",
  "council-tax-reduction-scotland": "/council-tax-reduction-scotland",
  "single-person-discount-council-tax-scotland": "/single-person-discount-council-tax-scotland",
  "water-rates-scotland": "/water-rates-scotland",
  "modern-studies": "/modern-studies",
  "national-5-modern-studies": "/national-5-modern-studies",
  "higher-modern-studies": "/higher-modern-studies",
  "higher-modern-studies-past-papers": "/higher-modern-studies-past-papers",
  "nat-5-modern-studies-past-papers": "/nat-5-modern-studies-past-papers",
  "advanced-higher-modern-studies": "/advanced-higher-modern-studies",
  "causes-of-poverty": "/causes-of-poverty",
  "who-is-my-msp": "/who-is-my-msp",
  "who-is-my-local-councillor-by-postcode": "/who-is-my-local-councillor-by-postcode",
  "life-expectancy-glasgow": "/life-expectancy-glasgow",
  "unemployment-scotland": "/unemployment-scotland",
  "crime-rate-glasgow": "/crime-rate-glasgow",
  "why-is-the-cost-of-living-so-high": "/cost-of-living-scotland",
  "what-does-poverty-mean": "/uk-poverty-line",
  "do-people-in-poverty-work": "/in-work-poverty-scotland",
};

export function postPath(slug: string) {
  return POST_PATHS[slug] ?? `/blog/${slug}`;
}

/** Salary after tax pages, written as people type them: /30000-after-tax-scotland. */
export const SALARIES = [
  15000, 18000, 20000, 22000, 24000, 25000, 26000, 28000, 30000, 32000, 35000, 38000, 40000, 45000, 50000,
  55000, 60000, 65000, 70000, 75000, 80000, 90000, 100000, 120000, 150000,
];

export function salaryPath(amount: number) {
  return `/${amount}-after-tax-scotland`;
}

export function salaryHubPath() {
  return "/salary-after-tax-scotland";
}

/** Whole pages that moved. */
export const PAGE_PATHS: Record<string, string> = {
  "/poverty": "/poverty-in-scotland",
};

/** Every permanent redirect from an old address to its exact match one. */
export function exactMatchRedirects() {
  return [
    ...Object.keys(COUNCIL_SEARCH_NAMES).map((slug) => ({
      source: `/council-tax-bands-scotland/${slug}`,
      destination: councilTaxPath(slug),
    })),
    ...BAND_KEYS.map((letter) => ({
      source: `/council-tax-bands-scotland/band-${letter}`,
      destination: councilTaxBandPath(letter),
    })),
    ...Object.entries(POST_PATHS).map(([slug, destination]) => ({ source: `/blog/${slug}`, destination })),
    ...Object.entries(PAGE_PATHS).map(([source, destination]) => ({ source, destination })),
  ];
}

/** What a top level exact match address resolves to. */
export type TopLevel =
  | { kind: "council-tax"; councilSlug: string }
  | { kind: "council-tax-band"; letter: string }
  | { kind: "post"; postSlug: string }
  | { kind: "salary"; amount: number }
  | { kind: "salary-hub" };

export function resolveTopLevel(segment: string): TopLevel | null {
  const path = `/${segment}`;
  for (const slug of Object.keys(COUNCIL_SEARCH_NAMES)) {
    if (councilTaxPath(slug) === path) return { kind: "council-tax", councilSlug: slug };
  }
  const band = /^\/council-tax-band-([a-h])-scotland$/.exec(path);
  if (band) return { kind: "council-tax-band", letter: band[1] };
  for (const [postSlug, target] of Object.entries(POST_PATHS)) {
    if (target === path) return { kind: "post", postSlug };
  }
  if (path === salaryHubPath()) return { kind: "salary-hub" };
  const salary = /^\/(\d+)-after-tax-scotland$/.exec(path);
  if (salary && SALARIES.includes(Number(salary[1]))) return { kind: "salary", amount: Number(salary[1]) };
  return null;
}

export function topLevelSegments() {
  return [
    ...Object.keys(COUNCIL_SEARCH_NAMES).map((slug) => councilTaxPath(slug).slice(1)),
    ...BAND_KEYS.map((letter) => councilTaxBandPath(letter).slice(1)),
    ...Object.values(POST_PATHS).map((path) => path.slice(1)),
    salaryHubPath().slice(1),
    ...SALARIES.map((amount) => salaryPath(amount).slice(1)),
  ];
}
