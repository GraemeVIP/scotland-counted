/**
 * Every headline time series on the site.
 *
 * All figures were retrieved from the original publishers, not from
 * secondary reporting. See src/lib/data/sources.ts for provenance and
 * /methods for the caveats attached to each series.
 */

export type Direction = "worsening" | "improving" | "stalled";

export type Series = {
  name: string;
  colorVar: "--glasgow" | "--scotland" | "--workplace";
  data: number[];
};

export type Indicator = {
  slug: string;
  /** Short label for navigation and cards. */
  label: string;
  /** Plain-English headline used as the page H1. */
  title: string;
  /** One sentence a non-specialist can act on. */
  summary: string;
  direction: Direction;
  unit: "%" | "years" | "£";
  x: string[];
  xLabel: string;
  series: Series[];
  yMin: number;
  yMax: number;
  yTicks: number[];
  decimals: number;
  chartTitle: string;
  chartSub: string;
  caption: string;
  /** Optional collapsible technical note. */
  technical?: string[];
  /** Index from which the data becomes unreliable, if applicable. */
  provisionalFrom?: number;
  provisionalLabel?: string;
  sourceIds: string[];
};

export const CHILD_POVERTY_YEARS = [
  "2014/15",
  "2015/16",
  "2016/17",
  "2017/18",
  "2018/19",
  "2019/20",
  "2020/21",
  "2021/22",
  "2022/23",
  "2023/24",
];

/** Number of Glasgow children in poverty, matching CHILD_POVERTY_YEARS. */
export const GLASGOW_CHILD_COUNTS = [
  29527, 32182, 32294, 32796, 30383, 33734, 34829, 35891, 36348, 39319,
];

export const indicators: Indicator[] = [
  {
    slug: "child-poverty",
    label: "Children",
    title: "More than one in three Glasgow children is growing up poor",
    summary:
      "Ten years ago the figure was 27.1%. It is now 36.1% — the biggest rise of any Scottish council area.",
    direction: "worsening",
    unit: "%",
    x: CHILD_POVERTY_YEARS,
    xLabel: "Financial year",
    yMin: 15,
    yMax: 40,
    yTicks: [15, 20, 25, 30, 35, 40],
    decimals: 1,
    chartTitle: "Children living in poverty, after the rent is paid",
    chartSub:
      "Share of children aged 0–15 · 2014/15 – 2023/24 · End Child Poverty / Loughborough University",
    caption:
      "The dip in 2020/21 is the pandemic. Benefits went up — the extra £20 a week on Universal Credit, plus furlough — and child poverty fell. The support was withdrawn, and it went straight back up.",
    series: [
      {
        name: "Glasgow",
        colorVar: "--glasgow",
        data: [27.1, 29.5, 29.6, 30.9, 31.0, 32.2, 29.4, 32.0, 32.9, 36.1],
      },
      {
        name: "Scotland",
        colorVar: "--scotland",
        data: [21.6, 22.8, 23.3, 24.2, 23.1, 24.2, 20.9, 23.9, 24.5, 23.3],
      },
    ],
    technical: [
      "These are relative poverty figures after housing costs: children in households with less than 60% of median UK income once rent or mortgage is paid.",
      "The Scotland figure is not published directly in this dataset. It is recomputed here by summing the 32 council-area counts and dividing by the implied child populations. That method reproduces the published Scottish rate of 24.5% for 2022/23, which is how we know it is sound.",
    ],
    sourceIds: ["ecp"],
  },

  {
    slug: "work",
    label: "Work",
    title: "Far more Glaswegians are in work than in 2004",
    summary:
      "In 2004, 62.7% of working-age Glaswegians had a job. The figure reached 72.1% in 2022, much closer to Scotland as a whole.",
    direction: "improving",
    unit: "%",
    x: [
      "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
      "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021",
      "2022", "2023", "2024", "2025",
    ],
    xLabel: "Calendar year",
    yMin: 55,
    yMax: 80,
    yTicks: [55, 60, 65, 70, 75, 80],
    decimals: 1,
    provisionalFrom: 19,
    provisionalLabel: "ONS: unreliable",
    chartTitle: "Share of working-age people in a job",
    chartSub: "Ages 16–64 · 2004 – 2025 · ONS Annual Population Survey",
    caption:
      "The dotted section at the end is shaded for a reason: these figures come from a survey that stopped working properly after 2023. Glasgow's apparent six-point crash in 2024 is almost certainly the survey, not the city.",
    series: [
      {
        name: "Glasgow",
        colorVar: "--glasgow",
        data: [
          62.7, 64.1, 62.7, 64.6, 64.8, 61.8, 61.4, 63.0, 58.6, 62.5, 64.2,
          66.8, 67.4, 65.9, 64.3, 67.3, 69.8, 69.7, 72.1, 71.2, 65.6, 67.4,
        ],
      },
      {
        name: "Scotland",
        colorVar: "--scotland",
        data: [
          72.6, 73.0, 73.7, 73.9, 73.6, 72.0, 71.0, 70.5, 70.5, 70.8, 72.6,
          73.1, 73.0, 74.2, 74.1, 74.8, 73.4, 73.2, 74.4, 74.8, 74.2, 74.7,
        ],
      },
    ],
    technical: [
      "The Annual Population Survey samples households rather than counting everyone. After 2023 response rates fell so far that the ONS downgraded the estimates and flagged them as unreliable for local areas.",
      "Rates here are calculated as people aged 16–64 in employment divided by the resident population aged 16–64, both taken from the same survey.",
    ],
    sourceIds: ["aps"],
  },

  {
    slug: "benefits",
    label: "Benefits",
    title: "Fewer people need out-of-work benefits than in 2000",
    summary:
      "The figure fell from 6.0% in 2000 to 3.2% in 2016, jumped during the pandemic and is about 4.5% now.",
    direction: "improving",
    unit: "%",
    x: [
      "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008",
      "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017",
      "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026",
    ],
    xLabel: "January of each year",
    yMin: 0,
    yMax: 9,
    yTicks: [0, 2, 4, 6, 8],
    decimals: 1,
    chartTitle: "Share of working-age people claiming out-of-work benefits",
    chartSub: "Each January · 2000 – 2026 · ONS Claimant Count",
    caption:
      "Glasgow's figure has stayed higher than Scotland's throughout the full 26 years.",
    series: [
      {
        name: "Glasgow",
        colorVar: "--glasgow",
        data: [
          6.0, 5.4, 4.8, 4.6, 4.6, 4.1, 4.0, 4.0, 3.4, 4.5, 6.0, 6.2, 6.0, 5.8,
          4.6, 3.7, 3.2, 3.2, 3.2, 3.4, 4.6, 8.3, 5.8, 4.7, 4.4, 4.7, 4.5,
        ],
      },
      {
        name: "Scotland",
        colorVar: "--scotland",
        data: [
          4.1, 3.6, 3.4, 3.3, 3.2, 2.9, 2.7, 2.6, 2.2, 3.2, 4.2, 4.2, 4.3, 4.1,
          3.3, 2.4, 2.2, 2.3, 2.4, 2.9, 3.2, 6.0, 3.9, 3.1, 3.0, 3.0, 2.9,
        ],
      },
    ],
    technical: [
      "From 2015 this count includes people on Universal Credit who are required to look for work, which is a wider group than the Jobseeker's Allowance count it replaced. The line before and after 2015 is not measuring quite the same thing.",
      "The Glasgow-to-Scotland ratio is unaffected by that change, because it applies equally to both.",
    ],
    sourceIds: ["claimant"],
  },

  {
    slug: "pay",
    label: "Pay",
    title: "What the Glasgow pay figures actually measure",
    summary:
      "£796.50 a week works out at about £41,400 a year, which sounds far too high to most people. Three things explain it: the figure is before tax and National Insurance, it counts only full-time employee jobs, and it includes overtime, bonuses and shift pay.",
    direction: "worsening",
    unit: "£",
    x: [
      "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016",
      "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025",
    ],
    xLabel: "Year",
    yMin: 400,
    yMax: 820,
    yTicks: [400, 500, 600, 700, 800],
    decimals: 0,
    chartTitle: "Pay in a restricted sample of full-time employee jobs",
    chartSub: "Gross weekly pay in one April pay period · cash terms · 2008–2025 · ONS ASHE",
    caption:
      "This is not what the average worker earns, and it is not the pay of people in poverty. Green is the median within selected full-time PAYE employee jobs located in Glasgow. Blue is the same restricted measure for jobs held by Glasgow residents. Grey is Scotland. The difference between the lines compares separate groups; it does not track wages or people moving between them.",
    series: [
      {
        name: "Selected full-time jobs based in Glasgow",
        colorVar: "--workplace",
        data: [
          459.8, 476.0, 476.8, 486.4, 498.9, 523.6, 539.1, 538.3, 546.7, 558.2,
          573.5, 589.5, 621.7, 638.3, 670.8, 753.8, 757.3, 796.5,
        ],
      },
      {
        name: "Selected full-time jobs held by Glasgow residents",
        colorVar: "--glasgow",
        data: [
          434.1, 451.7, 452.5, 460.0, 474.3, 483.9, 497.1, 514.9, 522.2, 519.7,
          549.7, 566.9, 592.5, 620.4, 635.7, 689.0, 721.5, 745.5,
        ],
      },
      {
        name: "Selected full-time jobs held by Scottish residents",
        colorVar: "--scotland",
        data: [
          462.9, 471.2, 486.6, 487.2, 498.3, 507.9, 518.6, 527.0, 536.0, 547.4,
          562.7, 578.3, 595.0, 619.9, 641.3, 709.4, 740.1, 775.6,
        ],
      },
    ],
    technical: [
      "Why the figure looks too high. It is gross pay, before income tax and National Insurance are taken off. It is the middle of full-time employee jobs only, so every part-time job and every self-employed person is excluded. And it counts overtime, bonuses and shift premiums, not basic salary. A single profession's advertised salary is not the same statistic as the median across all full-time jobs.",
      "For scale, the Scottish Government's own ASHE 2025 release puts median gross weekly pay for full-time employees in Scotland at £773.80 — about £40,200 a year. A city figure slightly above that is expected, because cities concentrate higher-paying employment.",
      "The gap from the minimum wage is also smaller than it looks, and it is deliberate. The National Living Wage is set by law at two-thirds of median hourly earnings — that is the Low Pay Commission's remit from government. So the middle of full-time pay sitting around one and a half times the minimum is not an odd result; it is the arithmetic of how the minimum wage is defined. Full-time minimum wage is about £24,800 a year against a Glasgow full-time median near £41,400: roughly 1.7 times, not double.",
      "ASHE samples employee jobs from PAYE records. This displayed series is then restricted to jobs classed as full-time, paid at adult rates and unaffected by absence. It excludes every part-time job, self-employment, employees outside PAYE, junior rates and pay affected by sickness or other absence. A person with more than one job can be counted more than once.",
      "For scale, a separate ONS count found 128,000 of Glasgow's 442,000 employee jobs were part-time in 2024 — 29%. None of those part-time jobs is represented in this full-time series.",
      "Gross weekly pay can include overtime, bonuses, shift premiums and allowances. ONS normally defines full-time as more than 30 paid hours a week, with a separate rule for teaching jobs.",
      "Figures are in cash, not adjusted for inflation. Compare the lines against each other within a year — that comparison is valid. Do not read the upward slope as people getting better off; most of it is price rises.",
    ],
    sourceIds: ["ashe", "ashe-guide", "glasgow-labour-profile", "minimum-wage-2026", "mis-2025", "real-living-wage", "ashe-scotland-2025", "lpc-remit"],
  },
];

/** Life expectancy is a four-series small-multiple, handled separately. */
export const lifeExpectancy = {
  slug: "life-expectancy",
  label: "Life expectancy",
  title: "Glasgow gained four years of life, then it stopped",
  summary:
    "People in Glasgow were living longer until about 2012. Then progress stopped. The latest male figure on this chart is 73.6 years, the lowest in Scotland.",
  direction: "stalled" as Direction,
  x: [
    "2001-03", "2002-04", "2003-05", "2004-06", "2005-07", "2006-08", "2007-09",
    "2008-10", "2009-11", "2010-12", "2011-13", "2012-14", "2013-15", "2014-16",
    "2015-17", "2016-18", "2017-19",
  ],
  glaM: [69.0, 69.3, 69.9, 70.4, 70.7, 70.7, 71.1, 71.7, 72.2, 72.6, 73.0, 73.3, 73.4, 73.4, 73.3, 73.4, 73.6],
  scoM: [73.5, 73.8, 74.2, 74.6, 74.8, 75.0, 75.3, 75.8, 76.2, 76.5, 76.8, 77.1, 77.1, 77.1, 77.0, 77.1, 77.2],
  glaF: [76.4, 76.4, 76.7, 76.9, 77.0, 77.1, 77.4, 77.9, 78.2, 78.5, 78.5, 78.7, 78.8, 78.9, 78.7, 78.7, 78.5],
  scoF: [78.9, 79.0, 79.2, 79.5, 79.7, 79.8, 80.0, 80.3, 80.6, 80.7, 80.9, 81.1, 81.1, 81.1, 81.1, 81.1, 81.1],
  sourceIds: ["ons-le"],
};

/** Neighbourhood deprivation: a two-point comparison, not a series. */
export const deprivation = {
  slug: "neighbourhoods",
  label: "Neighbourhoods",
  title: "Far fewer Glaswegians live in Scotland's worst-off neighbourhoods",
  summary:
    "Almost half of Glaswegians lived in Scotland's worst-off tenth of neighbourhoods in 2004. By 2020 it was under a third — 29%.",
  direction: "improving" as Direction,
  rows: [
    { year: "SIMD 2004", pct: 46, note: "nearly half the city" },
    { year: "SIMD 2020", pct: 29, note: "185,000 people" },
  ],
  stillIn20pct: { pct: 44, people: 281000 },
  sourceIds: ["simd"],
};

/** Jobs per working-age resident. The city has more jobs than adults. */
export const jobsDensity = {
  glasgow: 1.08,
  scotland: 0.82,
  year: 2021,
  peak: { value: 1.15, year: 2005 },
  sourceIds: ["jobs-density"],
};

/** Poverty line in cash, 2022/23, after housing costs. */
export const povertyLine = {
  year: "2022/23",
  rows: [
    { who: "A couple with two young children needed more than", amount: "£407 a week" },
    { who: "A single parent with one small child needed more than", amount: "£224 a week" },
    { who: "A single adult needed more than", amount: "£166 a week" },
  ],
  sourceIds: ["thresholds"],
};

export const headlineStats = [
  {
    label: "Children in poverty, after housing costs",
    value: "36.1%",
    from: "27.1%",
    to: "36.1%",
    period: "2014/15 → 2023/24",
    direction: "worsening" as Direction,
    href: "/indicators/child-poverty",
  },
  {
    label: "Working-age employment rate",
    value: "71.2%",
    from: "62.7%",
    to: "71.2%",
    period: "2004 → 2023",
    direction: "improving" as Direction,
    href: "/indicators/work",
  },
  {
    label: "Living in Scotland's worst-off 10% of neighbourhoods",
    value: "29%",
    from: "46%",
    to: "29%",
    period: "SIMD 2004 → 2020",
    direction: "improving" as Direction,
    href: "/indicators/neighbourhoods",
  },
  {
    label: "Male life expectancy behind the Scottish average",
    value: "3.6 yrs",
    from: "4.5 yrs",
    to: "3.6 yrs",
    period: "2001–03 → 2017–19",
    direction: "improving" as Direction,
    href: "/indicators/life-expectancy",
  },
];

export function getIndicator(slug: string) {
  return indicators.find((i) => i.slug === slug);
}

export const allIndicatorSlugs = [
  ...indicators.map((i) => i.slug),
  lifeExpectancy.slug,
  deprivation.slug,
];
