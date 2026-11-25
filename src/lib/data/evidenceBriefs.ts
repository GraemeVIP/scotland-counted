import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "./councils";
import { councilExtra, SCOTLAND_EXTRA, CC_YEARS, PAY_YEARS } from "./councilExtra";
import {
  councilTaxByBand,
  councilTaxChangeFor,
  waterCharges2026,
  COUNCIL_TAX_YEAR,
} from "./councilTax";
import {
  crisisGrantCouncils,
  crisisGrantScotland,
  CRISIS_GRANT_SOURCE_URL,
} from "./crisisGrants";
import { councilPerformanceBySlug } from "./councilPerformanceIndex";
import { ANNUAL_POPULATION_SURVEY, COUNCIL_UNEMPLOYMENT, LIFE_EXPECTANCY, LIFE_EXPECTANCY_LATEST } from "./local";

export type BriefMetricRow = {
  label: string;
  localDisplay: string;
  scotlandDisplay: string;
  note: string;
  barPct?: number;
  period: string;
  source: string;
};

export type BriefSourceItem = {
  title: string;
  publisher: string;
  period: string;
  url: string;
};

export type CouncilEvidenceBrief = {
  slug: string;
  name: string;
  code: string;
  path: string;
  childPovertyPct: number;
  childPovertyCount: number;
  childPovertyRank: number;
  childPovertyChange: number;
  childPovertyScotland: number;
  childPovertyPeriod: string;
  crisisApplications: number;
  crisisAwards: number;
  crisisRejections: number;
  crisisAcceptanceRate: number;
  crisisAcceptanceScotland: number;
  crisisSpend: number;
  crisisAverageAward: number;
  crisisRank: number;
  bandDTax: number;
  bandDRiseCash: number;
  bandDRisePct: number;
  bandDWater: number;
  bandDTotal: number;
  medianPay: number | null;
  medianPayScotland: number;
  claimantRate: number | null;
  claimantScotland: number;
  unemploymentRate: number | null;
  unemploymentScotland: number;
  lifeMen: number | null;
  lifeWomen: number | null;
  lifeScotlandMen: number;
  lifeScotlandWomen: number;
  crimeRatePer10k: number | null;
  budgetGapMillions: number | null;
  performanceRank: number | null;
  rows: BriefMetricRow[];
  grantParagraph: string;
  sources: BriefSourceItem[];
};

const CHILD_POVERTY_URL = "https://endchildpoverty.org.uk/child-poverty-2025/";
const COUNCIL_TAX_URL = "https://www.gov.scot/publications/council-tax-datasets/";
const NOMIS_URL = "https://www.nomisweb.co.uk/";
const NRS_LIFE_URL =
  "https://www.nrscotland.gov.uk/publications/life-expectancy-in-scotland-2022-2024/";
const LGBF_URL = "https://www.improvementservice.org.uk/benchmarking";

export function evidenceBriefPath(slug: string) {
  return `/briefs/${slug}`;
}

export function getCouncilEvidenceBrief(slug: string): CouncilEvidenceBrief | null {
  const council = councils.find((c) => c.slug === slug);
  if (!council) return null;

  const lastIdx = council.pcts.length - 1;
  const childPovertyPct = council.pcts[lastIdx];
  const childPovertyCount = council.counts[lastIdx];
  const childPovertyScotland = SCOTLAND_PCTS[SCOTLAND_PCTS.length - 1];
  const childPovertyPeriod = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];

  const crisis = crisisGrantCouncils.find((c) => c.slug === slug)!;
  const extra = councilExtra[slug];
  const payIdx = PAY_YEARS.length - 1;
  const ccIdx = CC_YEARS.length - 1;
  const medianPay = extra?.pay[payIdx] ?? null;
  const medianPayScotland = SCOTLAND_EXTRA.pay[payIdx];
  const claimantRate = extra?.cc[ccIdx] ?? null;
  const claimantScotland = SCOTLAND_EXTRA.cc[ccIdx];

  const taxD = councilTaxByBand[slug]?.D ?? 0;
  const taxChange = councilTaxChangeFor(slug, "D");
  const waterD = waterCharges2026.D.water + waterCharges2026.D.wasteWater;

  const unemp = COUNCIL_UNEMPLOYMENT.rows.find((r) => r.slug === slug);
  const life = LIFE_EXPECTANCY.councils.find((r) => r.slug === slug);
  const perf = councilPerformanceBySlug[slug];

  const povertyGap = Math.round((childPovertyPct - childPovertyScotland) * 10) / 10;
  const povertyGapText =
    povertyGap > 0
      ? `${povertyGap.toFixed(1)} percentage points above the Scottish average`
      : povertyGap < 0
        ? `${Math.abs(povertyGap).toFixed(1)} percentage points below the Scottish average`
        : "in line with the Scottish average";

  const rows: BriefMetricRow[] = [
    {
      label: "Child poverty (after housing costs)",
      localDisplay: `${childPovertyPct.toFixed(1)}% (${childPovertyCount.toLocaleString("en-GB")} children)`,
      scotlandDisplay: `${childPovertyScotland.toFixed(1)}%`,
      note: `Rank ${council.rankLevel} highest of 32 councils; ${council.change >= 0 ? "+" : ""}${council.change.toFixed(1)} percentage points since ${COUNCIL_YEARS[0]}`,
      barPct: Math.min(100, Math.round((childPovertyPct / 35) * 100)),
      period: childPovertyPeriod,
      source: "End Child Poverty / Loughborough University",
    },
    {
      label: "Scottish Welfare Fund Crisis Grants",
      localDisplay: `${crisis.applications.toLocaleString("en-GB")} applications (${crisis.acceptanceRate}% awarded)`,
      scotlandDisplay: `${crisisGrantScotland.acceptanceRate}% awarded`,
      note: `${crisis.awards.toLocaleString("en-GB")} awards totalling £${Math.round(crisis.spend).toLocaleString("en-GB")} (average £${crisis.averageAward})`,
      barPct: crisis.acceptanceRate,
      period: "2025/26",
      source: "Scottish Government",
    },
    {
      label: "Full-time median weekly pay",
      localDisplay: medianPay !== null ? `£${Math.round(medianPay).toLocaleString("en-GB")} / week` : "Sample too small to publish",
      scotlandDisplay: `£${Math.round(medianPayScotland).toLocaleString("en-GB")} / week`,
      note:
        medianPay !== null
          ? `${medianPay >= medianPayScotland ? "Above" : "Below"} Scotland by £${Math.abs(Math.round(medianPay - medianPayScotland))} a week (resident PAYE employees)`
          : "ONS suppresses island small samples under disclosure rules",
      barPct: medianPay !== null ? Math.min(100, Math.round((medianPay / 950) * 100)) : undefined,
      period: PAY_YEARS[payIdx],
      source: "ONS ASHE, via Nomis",
    },
    {
      label: "Out-of-work benefit claimants (ages 16 to 64)",
      localDisplay: claimantRate !== null ? `${claimantRate.toFixed(1)}%` : "Not published",
      scotlandDisplay: `${claimantScotland.toFixed(1)}%`,
      note:
        claimantRate !== null
          ? `${claimantRate >= claimantScotland ? "+" : ""}${(claimantRate - claimantScotland).toFixed(1)} percentage points vs Scotland`
          : "Published by ONS Nomis",
      barPct: claimantRate !== null ? Math.min(100, Math.round((claimantRate / 7) * 100)) : undefined,
      period: `January ${CC_YEARS[ccIdx]}`,
      source: "ONS Claimant Count, via Nomis",
    },
    {
      label: "Unemployment rate (ages 16+)",
      localDisplay: unemp ? `${unemp.rate.toFixed(1)}%` : "Not published",
      scotlandDisplay: `${ANNUAL_POPULATION_SURVEY.scotland.rate.toFixed(1)}%`,
      note: unemp
        ? `Estimated ${unemp.unemployed.toLocaleString("en-GB")} people (±${unemp.margin.toFixed(1)} percentage point survey margin)`
        : "Model-based estimate",
      barPct: unemp ? Math.min(100, Math.round((unemp.rate / 8) * 100)) : undefined,
      period: COUNCIL_UNEMPLOYMENT.period,
      source: "ONS Annual Population Survey",
    },
    {
      label: "Band D council tax (excluding water)",
      localDisplay: `£${Math.round(taxD).toLocaleString("en-GB")} / year`,
      scotlandDisplay: `Plus £${Math.round(waterD)} Scottish Water`,
      note: taxChange
        ? `Up £${Math.round(taxChange.cash)} (+${taxChange.percent.toFixed(1)}%) from 2025-26; total with water £${Math.round(taxD + waterD).toLocaleString("en-GB")}`
        : `Total with Scottish Water £${Math.round(taxD + waterD).toLocaleString("en-GB")}`,
      period: COUNCIL_TAX_YEAR,
      source: "Scottish Government & Scottish Water",
    },
    {
      label: "Life expectancy at birth (men / women)",
      localDisplay: life ? `${life.men.toFixed(1)} / ${life.women.toFixed(1)} years` : "Not published",
      scotlandDisplay: `${LIFE_EXPECTANCY_LATEST.scotland.men.toFixed(1)} / ${LIFE_EXPECTANCY_LATEST.scotland.women.toFixed(1)} years`,
      note: life
        ? `Men ${life.men >= LIFE_EXPECTANCY_LATEST.scotland.men ? "+" : ""}${(life.men - LIFE_EXPECTANCY_LATEST.scotland.men).toFixed(1)} yrs; women ${life.women >= LIFE_EXPECTANCY_LATEST.scotland.women ? "+" : ""}${(life.women - LIFE_EXPECTANCY_LATEST.scotland.women).toFixed(1)} yrs vs Scotland`
        : "National Records of Scotland",
      period: LIFE_EXPECTANCY_LATEST.period,
      source: "National Records of Scotland",
    },
  ];

  if (perf) {
    rows.push({
      label: "Police recorded crime rate",
      localDisplay: `${Math.round(perf.context.recordedCrimeRate).toLocaleString("en-GB")} per 10,000`,
      scotlandDisplay: "Local authority benchmark",
      note: `Council overall service rank: ${perf.overallRank} of 32; published budget gap £${perf.context.budgetGapMillions.toFixed(1)}m`,
      period: "Latest published",
      source: "Scottish Government / LGBF",
    });
  }

  const paySentence =
    medianPay !== null
      ? `Resident full-time median weekly pay was £${Math.round(medianPay).toLocaleString("en-GB")} in ${PAY_YEARS[payIdx]}, compared with £${Math.round(medianPayScotland).toLocaleString("en-GB")} across Scotland (ONS ASHE via Nomis). `
      : "";

  const claimantSentence =
    claimantRate !== null
      ? `In January ${CC_YEARS[ccIdx]}, ${claimantRate.toFixed(1)}% of working-age residents claimed out-of-work benefits compared with ${claimantScotland.toFixed(1)}% across Scotland (ONS Nomis). `
      : "";

  const grantParagraph = `In ${council.name}, ${childPovertyPct.toFixed(1)}% of children (${childPovertyCount.toLocaleString("en-GB")} children) lived in poverty after housing costs in ${childPovertyPeriod}, ${povertyGapText} of ${childPovertyScotland.toFixed(1)}% and ranked ${council.rankLevel} highest of Scotland's 32 council areas (End Child Poverty / Loughborough University). During 2025/26, local residents submitted ${crisis.applications.toLocaleString("en-GB")} Scottish Welfare Fund Crisis Grant applications, with ${crisis.awards.toLocaleString("en-GB")} awards (${crisis.acceptanceRate}%) totalling £${Math.round(crisis.spend).toLocaleString("en-GB")} (Scottish Government). ${paySentence}${claimantSentence}Band D council tax for ${COUNCIL_TAX_YEAR} is £${Math.round(taxD).toLocaleString("en-GB")}${taxChange ? `, up ${taxChange.percent.toFixed(1)}% on the previous year` : ""}, before £${Math.round(waterD)} in Scottish Water charges (Scottish Government). Compiled from official public records via Scotland Counted (scotlandcounted.org.uk/briefs/${slug}).`;

  const sources: BriefSourceItem[] = [
    {
      title: "Local child poverty after housing costs (2014/15 to 2023/24)",
      publisher: "End Child Poverty Coalition / Loughborough University",
      period: childPovertyPeriod,
      url: CHILD_POVERTY_URL,
    },
    {
      title: "Scottish Welfare Fund Statistics (Crisis Grants to 31 March 2026)",
      publisher: "Scottish Government",
      period: "2025/26",
      url: CRISIS_GRANT_SOURCE_URL,
    },
    {
      title: "Annual Survey of Hours and Earnings (ASHE) & Claimant Count",
      publisher: "Office for National Statistics (via Nomis)",
      period: `${PAY_YEARS[payIdx]} / Jan ${CC_YEARS[ccIdx]}`,
      url: NOMIS_URL,
    },
    {
      title: "Council Tax Datasets (2025-26 & 2026-27) and Scottish Water Charges",
      publisher: "Scottish Government & Scottish Water",
      period: COUNCIL_TAX_YEAR,
      url: COUNCIL_TAX_URL,
    },
    {
      title: "Life Expectancy in Scotland (2022 to 2024)",
      publisher: "National Records of Scotland",
      period: LIFE_EXPECTANCY_LATEST.period,
      url: NRS_LIFE_URL,
    },
    {
      title: "Local Government Benchmarking Framework (LGBF)",
      publisher: "Improvement Service",
      period: "Latest release",
      url: LGBF_URL,
    },
  ];

  return {
    slug: council.slug,
    name: council.name,
    code: council.code,
    path: evidenceBriefPath(council.slug),
    childPovertyPct,
    childPovertyCount,
    childPovertyRank: council.rankLevel,
    childPovertyChange: council.change,
    childPovertyScotland,
    childPovertyPeriod,
    crisisApplications: crisis.applications,
    crisisAwards: crisis.awards,
    crisisRejections: crisis.rejections,
    crisisAcceptanceRate: crisis.acceptanceRate,
    crisisAcceptanceScotland: crisisGrantScotland.acceptanceRate,
    crisisSpend: crisis.spend,
    crisisAverageAward: crisis.averageAward,
    crisisRank: crisis.rank,
    bandDTax: taxD,
    bandDRiseCash: taxChange?.cash ?? 0,
    bandDRisePct: taxChange?.percent ?? 0,
    bandDWater: waterD,
    bandDTotal: taxD + waterD,
    medianPay,
    medianPayScotland,
    claimantRate,
    claimantScotland,
    unemploymentRate: unemp?.rate ?? null,
    unemploymentScotland: ANNUAL_POPULATION_SURVEY.scotland.rate,
    lifeMen: life?.men ?? null,
    lifeWomen: life?.women ?? null,
    lifeScotlandMen: LIFE_EXPECTANCY_LATEST.scotland.men,
    lifeScotlandWomen: LIFE_EXPECTANCY_LATEST.scotland.women,
    crimeRatePer10k: perf?.context.recordedCrimeRate ?? null,
    budgetGapMillions: perf?.context.budgetGapMillions ?? null,
    performanceRank: perf?.overallRank ?? null,
    rows,
    grantParagraph,
    sources,
  };
}

export function allCouncilBriefLinks() {
  return [...councils]
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      path: evidenceBriefPath(c.slug),
      childPovertyPct: c.pcts[c.pcts.length - 1],
      rankLevel: c.rankLevel,
    }));
}
