/**
 * Every source used on the site, in one place.
 *
 * Nothing on this site is cited from secondary reporting. Each figure
 * was taken from the publisher named here, and where a number was
 * derived rather than published, the derivation is stated.
 */

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** What we took from it. */
  used: string;
  /** Any transformation we applied. Blank means we used it as published. */
  derivation?: string;
};

export const sources: Source[] = [
  {
    id: "sg-poverty-2026",
    title: "Poverty and Income Inequality in Scotland 2022–25",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/poverty-and-income-inequality-in-scotland-2022-25/",
    used: "The Scotland-wide headline poverty rates for all people, children, working-age adults and pensioners, and the share of children in poverty living in a working household.",
  },
  {
    id: "ecp",
    title: "Local child poverty estimates after housing costs, 2015–2024",
    publisher: "End Child Poverty / Loughborough University",
    url: "https://endchildpoverty.org.uk/child-poverty-2025/",
    used: "Child poverty rates and counts for Glasgow and all 32 Scottish council areas.",
    derivation:
      "The Scotland-wide rate is not published in this dataset. We recompute it by summing the 32 council counts and dividing by the implied child populations. The method reproduces the published Scottish rate of 24.5% for 2022/23.",
  },
  {
    id: "aps",
    title: "Annual Population Survey, table T01",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Employment rates for Glasgow and Scotland, 2004–2025.",
    derivation:
      "Rates calculated as people aged 16–64 in employment divided by the resident population aged 16–64, both from the same survey.",
  },
  {
    id: "claimant",
    title: "Claimant Count",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Claimants as a share of residents aged 16–64, each January 2000–2026.",
  },
  {
    id: "ashe",
    title: "Annual Survey of Hours and Earnings, resident and workplace analyses",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Median gross weekly pay for full-time employees, 2008–2025, on both the workplace and residence bases.",
  },
  {
    id: "jobs-density",
    title: "Jobs Density",
    publisher: "Office for National Statistics, via NOMIS",
    url: "https://www.nomisweb.co.uk/",
    used: "Jobs per working-age resident, Glasgow and Scotland. Published for Glasgow to 2021.",
  },
  {
    id: "ons-le",
    title: "Life Expectancy by Local Authority, time series",
    publisher: "Office for National Statistics",
    url: "https://www.ons.gov.uk/datasets/life-expectancy-by-local-authority",
    used: "Life expectancy at birth by sex, Glasgow and Scotland, 2001–03 to 2017–19.",
  },
  {
    id: "simd",
    title: "Scottish Index of Multiple Deprivation",
    publisher: "Scottish Government, via Understanding Glasgow",
    url: "https://www.understandingglasgow.com/glasgow-indicators/poverty/deprivation/trends",
    used: "Share of Glasgow's population living in Scotland's most deprived 10% and 20% of neighbourhoods, SIMD 2004 and SIMD 2020.",
    derivation:
      "Intermediate releases (2006, 2009, 2012, 2016) are omitted because neighbourhood boundaries were redrawn between the 2001 and 2011 censuses, so the middle points are not comparable with either end.",
  },
  {
    id: "gcph",
    title:
      "History, politics and vulnerability: explaining excess mortality",
    publisher:
      "Walsh, McCartney, Collins, Taulbut and Batty — GCPH, NHS Health Scotland, UWS and UCL, 2016",
    url: "https://www.gcph.co.uk/latest/publications/310-history-politics-and-vulnerability-explaining-excess-mortality",
    used: "The explanation for Glasgow's excess mortality relative to Liverpool and Manchester, and the historical policy causes.",
  },
  {
    id: "scotpho",
    title: "Excess mortality in Scotland and Glasgow",
    publisher: "ScotPHO",
    url: "https://www.scotpho.org.uk/comparative-health/excess-mortality-in-scotland-and-glasgow",
    used: "The size of Glasgow's excess mortality after adjusting for deprivation.",
  },
  {
    id: "targets",
    title: "Tackling Child Poverty Delivery Plan progress report 2024–25",
    publisher: "Scottish Government",
    url: "https://www.gov.scot/publications/tackling-child-poverty-delivery-plan-progress-report-2024-25/pages/6/",
    used: "Outturns against the four statutory interim targets in the Child Poverty (Scotland) Act 2017.",
  },
  {
    id: "jrf",
    title: "What reaching Scotland's child poverty targets requires",
    publisher: "Joseph Rowntree Foundation",
    url: "https://www.jrf.org.uk/news/scale-of-action-needed-to-reach-scottish-child-poverty-targets-requires-every-ounce-of",
    used: "Modelled effect and cost of individual policy options.",
  },
  {
    id: "ippr",
    title: "What would it take to eradicate child poverty in Scotland?",
    publisher: "IPPR Scotland",
    url: "https://www.ippr.org/articles/what-would-it-take-to-eradicate-child-poverty-in-scotland",
    used: "Modelled effect and cost of individual policy options.",
  },
  {
    id: "fai",
    title: "No shortcuts to Scotland's child poverty targets",
    publisher: "Fraser of Allander Institute",
    url: "https://fraserofallander.org/no-shortcuts-to-child-poverty-targets/",
    used: "Independent confirmation that income transfers, not employment programmes, drive the child poverty figure.",
  },
  {
    id: "cpag",
    title: "Two-child limit abolition and Scottish Child Payment rates",
    publisher: "CPAG in Scotland",
    url: "https://cpag.org.uk/news/scotlands-child-poverty-campaigners-hail-two-child-limit-abolition",
    used: "Confirmation of the April 2026 abolition and current Scottish Child Payment rates.",
  },
  {
    id: "thresholds",
    title: "Poverty thresholds by household type",
    publisher: "Trust for London",
    url: "https://trustforlondon.org.uk/data/poverty-thresholds/",
    used: "The poverty line expressed in pounds per week for different household types, 2022/23.",
  },
  {
    id: "housing",
    title: "Glasgow's housing emergency: submission to the Local Government Committee",
    publisher: "Glasgow City Council / Scottish Parliament",
    url: "https://www.parliament.scot/-/media/files/committees/local-gov/correspondence/2025/glasgowcitycouncilsubmision.pdf",
    used: "Temporary accommodation spending and the projected unfunded homelessness shortfall to 2027/28.",
  },
  {
    id: "migration",
    title: "Asylum dispersal in Scotland",
    publisher: "Migration Scotland",
    url: "https://migrationscotland.org.uk/policyarea/asylum-dispersal/",
    used: "Glasgow's share of Scotland's dispersed asylum seekers.",
  },
  {
    id: "ug",
    title: "The Glasgow Indicators Project",
    publisher: "Understanding Glasgow / Glasgow Centre for Population Health",
    url: "https://www.understandingglasgow.com/",
    used: "In-work poverty, neighbourhood variation in child poverty, and workless household figures.",
  },
];

export const sourcesById: Record<string, Source> = Object.fromEntries(
  sources.map((s) => [s.id, s])
);

export function getSources(ids: string[]) {
  return ids.map((id) => sourcesById[id]).filter(Boolean);
}
