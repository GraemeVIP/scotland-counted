/**
 * Glasgow City recorded sexual crime and the migration measures used in the
 * "Glasgow sex crimes went up 28%. Was it migrants?" article.
 *
 * Quarterly counts are derived from Police Scotland year-to-date management
 * information workbooks (2025/26 Q1 to Q4 and 2026/27 Q1): each quarter is the
 * difference between consecutive cumulative totals, so the Q2 to Q4 figures mix
 * publication vintages. Financial-year totals are the Q4 year-to-date values.
 * Every other figure is typed from the document named beside it. Workings:
 * /data/glasgow-sexual-crime-review-results-2026.json.
 */

export const quarterLabels = ["Oct 2020", "Jan 2021", "Apr 2021", "Jul 2021", "Oct 2021", "Jan 2022", "Apr 2022", "Jul 2022", "Oct 2022", "Jan 2023", "Apr 2023", "Jul 2023", "Oct 2023", "Jan 2024", "Apr 2024", "Jul 2024", "Oct 2024", "Jan 2025", "Apr 2025", "Jul 2025", "Oct 2025", "Jan 2026", "Apr 2026"] as const;

/** Crimes recorded per quarter, Glasgow City. */
export const glasgowQuarterly = {
  rape: [72, 86, 80, 87, 78, 88, 72, 72, 78, 70, 80, 79, 94, 96, 118, 118, 121, 111, 117, 136, 90, 130, 108],
  sexualAssault: [115, 132, 138, 220, 198, 203, 191, 176, 174, 194, 185, 158, 152, 154, 227, 197, 210, 157, 179, 198, 189, 183, 192],
} as const;

/** Index of the first quarter after the April 2024 changes (Apr-Jun 2024). */
export const april2024Index = 14;

/** Full financial years (April to March), Police Scotland Q4 year-to-date workbook. */
export const financialYears = ["2020/21", "2021/22", "2022/23", "2023/24", "2024/25", "2025/26"] as const;
export const fullYear = {
  rape: { glasgow: [322, 333, 292, 349, 468, 473], rest: [1898, 2073, 2118, 2012, 2297, 2590] },
  sexualAssault: { glasgow: [573, 759, 735, 649, 791, 749], rest: [3701, 4711, 4550, 4343, 4397, 4482] },
} as const;

/** Police Scotland, Glasgow City Q3 2024/25 report to Safe Glasgow Partnership, appendix page 4. April to December. */
export const q3Table2024 = [
  { crime: "Sexual assault", before: 499, after: 639, changePct: 28.1 },
  { crime: "Rape", before: 254, after: 357, changePct: 40.6 },
  { crime: "Domestic abuse of a woman", before: 136, after: 192, changePct: 41.2 },
] as const;

/** Police Scotland Q3 2025/26 management information workbook, Glasgow City, April to December. */
export const detected2023to2024 = [
  { label: "Rapes recorded", y2023: 253, y2024: 357 },
  { label: "Rapes detected (suspect named)", y2023: 90, y2024: 181 },
  { label: "Sexual assaults recorded", y2023: 495, y2024: 634 },
  { label: "Sexual assaults detected", y2023: 294, y2024: 312 },
] as const;

/** Police Scotland FOI 26-0040: accused linked to detected rapes, Greater Glasgow division, 2025. Entries, not unique people. */
export const rapeAccusedNationality2025 = [
  { nationality: "Not recorded or not known", count: 62 },
  { nationality: "British", count: 43 },
  { nationality: "Indian", count: 2 },
  { nationality: "Iranian", count: 2 },
  { nationality: "Romanian", count: 2 },
  { nationality: "Afghan", count: 1 },
  { nationality: "Irish", count: 1 },
  { nationality: "Latvian", count: 1 },
  { nationality: "Palestinian", count: 1 },
  { nationality: "Polish", count: 1 },
  { nationality: "Sudanese", count: 1 },
] as const;

/** Scotland's Census 2022, tables UV204 (country of birth) and UV206 (passports held). */
export const census2022 = {
  glasgowCity: { population: 620_756, bornOutsideUkPct: 19.1, nonUkPassportPctOfHolders: 15.5 },
  greaterGlasgowDivision: { population: 826_510, bornOutsideUkPct: 16.1, nonUkPassportPctOfHolders: 12.5 },
  scotland: { population: 5_439_843, bornOutsideUkPct: 10.2, nonUkPassportPctOfHolders: 8.6 },
} as const;

/** Home Office, asylum support by local authority: people supported in Glasgow City at the end of each quarter. */
export const glasgowAsylumSupported = [
  { quarter: "Dec 2023", people: 3_939 },
  { quarter: "Dec 2024", people: 4_193 },
  { quarter: "Jun 2025", people: 3_844 },
  { quarter: "Jun 2026", people: 3_938 },
] as const;

/** People arriving in Glasgow, a year earlier against the latest figure. Sources named in the article. */
export const arrivalsLatest = [
  { measure: "Asylum seekers housed by the Home Office (June)", earlier: "3,844", latest: "3,938", change: "+2%" },
  { measure: "Refugee households applying as homeless (financial year)", earlier: "2,750", latest: "about 3,500", change: "+27%" },
  { measure: "Of which arrived from outside Glasgow", earlier: "1,048", latest: "about 900", change: "−14%" },
  { measure: "All international moves into Glasgow (year to June 2025, latest)", earlier: "20,730", latest: "15,160", change: "−27%" },
  { measure: "National Insurance numbers issued to overseas adults (year to March 2026)", earlier: "9,986", latest: "9,652", change: "−3%" },
  { measure: "Small boat arrivals, whole UK (2025, then January to June 2026)", earlier: "36,816", latest: "41,472 / 11,884", change: "+13% / falling" },
] as const;

/** Scottish Government, Recorded Crime in Scotland, year ending June 2026, Table 1. */
export const latestYear = [
  { crime: "Rape and attempted rape", glasgow2025: 488, glasgow2026: 485, glasgowChange: "−1%", scotlandChange: "+8%" },
  { crime: "Sexual assault", glasgow2025: 739, glasgow2026: 761, glasgowChange: "+3%", scotlandChange: "+3%" },
  { crime: "All sexual crimes", glasgow2025: 2_271, glasgow2026: 2_480, glasgowChange: "+9%", scotlandChange: "+9%" },
] as const;

/** The arithmetic. Extra crimes: Scottish Government annual tables, 2023/24 to 2024/25. Men 16+: NRS mid-2025. */
export const arithmetic = {
  extraCrimes: 266,
  menOver16: 270_541,
  cityRatePer1000Men: 3.8,
  rows: [
    { group: "the men in those 1,048 new households (say 1,000 men)", ratePer1000: 266, multiple: 70 },
    { group: "every man among the 4,000 asylum seekers (say 2,500 men)", ratePer1000: 106, multiple: 28 },
  ],
} as const;

/** Home Office CSP open data and asylum support by council: 276 English and Welsh councils (one row each) in four equal groups by asylum seekers per 1,000 residents (Dec 2023). Corrected 6 Sept 2026: an earlier build double-counted 55 councils. */
export const englandQuartiles = [
  { group: "Fewest asylum seekers", councils: 69, asylumPer1000: 0.02, offences2023: 21290, offences2024: 23016, changePct: 8.1 },
  { group: "Second group", councils: 69, asylumPer1000: 0.48, offences2023: 36052, offences2024: 38110, changePct: 5.7 },
  { group: "Third group", councils: 69, asylumPer1000: 1.63, offences2023: 46119, offences2024: 51717, changePct: 12.1 },
  { group: "Most asylum seekers", councils: 69, asylumPer1000: 3.60, offences2023: 60409, offences2024: 65747, changePct: 8.8 },
] as const;

/** Fixed-effects Poisson panel results and the between-council comparison (see "How we did the sums"). */
export const panelResults = {
  englandWales: { councils: 276, rows: 3539, pctPerAsylumSeekerPer1000: 0.72, low: -0.83, high: 2.3, p: 0.365 },
  scotlandAll: { pctPerAsylumSeekerPer1000: -3.8, low: -7.8, high: 0.4, p: 0.076 },
  scotlandWithoutGlasgow: { pctPerAsylumSeekerPer1000: -1.0, low: -7.0, high: 5.3, p: 0.743 },
} as const;

/** Between-council comparison, 276 councils: log change in sexual offences 2023/24 to 2024/25 against asylum seekers per 1,000 (Dec 2023). */
export const englandCrossSection = {
  councils: 276,
  corrLevel: 0.148,
  corrChange: 0.03,
  levelCoefWeighted: 0.0194,
  levelPWeighted: 0.025,
  levelCoefForceFixedEffects: 0.014,
  levelPForceFixedEffects: 0.036,
  changeCoefWeighted: 0.0055,
  changePWeighted: 0.774,
} as const;
