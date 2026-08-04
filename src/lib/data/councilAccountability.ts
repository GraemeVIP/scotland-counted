/**
 * Evidence-led council accountability records.
 *
 * This is deliberately separate from the area statistics in councils.ts. An
 * area page answers "what is happening here?"; this record answers "what did
 * the council promise, what was measured, and what did independent scrutiny
 * find?" Every item must point to a primary public source. A missing value is
 * preferable to an inference about performance.
 */

import { additionalCouncilAccountabilityRecords as councilAccountabilityAHRecords } from "./councilAccountabilityAH.ts";
import { additionalCouncilAccountabilityRecords as councilAccountabilityIRRecords } from "./councilAccountabilityIR.ts";
import { southAndWestCouncilAccountabilityRecords } from "./councilAccountabilitySZ.ts";

export type AccountabilitySourceKind = "council" | "government" | "regulator" | "audit";

export type AccountabilitySource = {
  id: string;
  title: string;
  publisher: string;
  kind: AccountabilitySourceKind;
  url: string;
  /** The source's publication date where the publisher makes it clear. */
  publishedOn?: string;
  /** The specific evidence used in this record. */
  usedFor: string;
};

export type BudgetFigure = {
  id: string;
  label: string;
  value: number;
  unit: "million" | "billion";
  currency: "GBP";
  period: string;
  qualifier?: "over" | "projected" | "expected";
  plainEnglish: string;
  sourceIds: string[];
};

export type PerformanceStatus = "met" | "missed" | "not-comparable" | "not-verified";

export type PerformanceOutcome = {
  id: string;
  service: string;
  measure: string;
  period: string;
  target: string;
  actual: string;
  status: PerformanceStatus;
  /** Difference from target when both numbers use the same unit. */
  variance?: string;
  /** One short explanation of what a technical measure means. */
  explanation?: string;
  /** Explains any unit or denominator limitation in the comparison. */
  comparisonNote?: string;
  sourceIds: string[];
};

export type AuditFindingStatus = "open" | "in-progress" | "closed" | "not-verified";

export type AuditFinding = {
  id: string;
  title: string;
  reportDate: string;
  publisher: string;
  severity: "grade-1" | "grade-2" | "observation";
  finding: string;
  recommendation?: string;
  managementResponse?: string;
  implementationDate?: string;
  status: AuditFindingStatus;
  sourceIds: string[];
};

export type CommitmentStatus = "planned" | "in-progress" | "complete" | "not-verified";

export type CouncilCommitment = {
  id: string;
  title: string;
  commitment: string;
  announcedOn: string;
  dueBy?: string;
  owner: string;
  status: CommitmentStatus;
  currentEvidence: string;
  sourceIds: string[];
};

export type CouncilAccountabilityRecord = {
  councilName: string;
  councilSlug: string;
  councilCode: string;
  lastReviewedOn: string;
  summary: string;
  budgetContext: BudgetFigure[];
  outcomes: PerformanceOutcome[];
  auditFindings: AuditFinding[];
  commitments: CouncilCommitment[];
  sources: AccountabilitySource[];
  /** Fields that should be populated only after a fresh primary-source check. */
  knownGaps: string[];
};

const sources: AccountabilitySource[] = [
  {
    id: "audit-bv-2024-25",
    title: "Glasgow City Council Best Value Thematic Review 2024/25",
    publisher: "Audit Scotland / Accounts Commission",
    kind: "audit",
    url: "https://audit.scot/uploads/2026-03/bv_2425_glasgow.pdf",
    publishedOn: "2026-03",
    usedFor:
      "The £109.7m Glasgow says it may need over two years. Also the £105.4m set aside to help change the budget, the missing long-term money plan, the unfinished results system and the council's stated poverty priority.",
  },
  {
    id: "audit-2023-24",
    title: "The 2023/24 audit of Glasgow City Council",
    publisher: "Audit Scotland / Accounts Commission",
    kind: "audit",
    url: "https://audit.scot/publications/the-202324-audit-of-glasgow-city-council",
    publishedOn: "2025-09-04",
    usedFor:
      "The dated finding about the process that allowed five senior officers to receive large early-retirement and redundancy payouts.",
  },
  {
    id: "gcc-operational-kpis-2024-25",
    title: "Operational performance and delivery: 2024/25 KPI appendix",
    publisher: "Glasgow City Council",
    kind: "council",
    url: "https://onlineservices.glasgow.gov.uk/councillorsandcommittees/viewSelectedDocument.asp?c=P62AFQDNNTDXDN2U81",
    publishedOn: "2025-05-07",
    usedFor:
      "The council's own goals and actual results for Scottish Welfare Fund grants and Housing Benefit claim processing in 2024/25.",
  },
  {
    id: "shr-glasgow-engagement-2026-27",
    title: "Engagement plan from 1 April 2026 to 31 March 2027",
    publisher: "Scottish Housing Regulator",
    kind: "regulator",
    url: "https://www.housingregulator.gov.scot/landlord-performance/landlords/glasgow-city-council/engagement-plan-from-1-april-2026-to-31-march-2027/",
    publishedOn: "2026-04-02",
    usedFor:
      "The regulator's statement that Glasgow has a serious homelessness-service problem, 12,800 cases without temporary accommodation in 2024/25, and the council's plan for temporary housing.",
  },
  {
    id: "sp-glasgow-funding-2025-26",
    title: "Written answer S6W-39654: local government funding",
    publisher: "Scottish Parliament (Scottish Government answer)",
    kind: "government",
    url: "https://www.parliament.scot/chamber-and-committees/questions-and-answers?msp=16198&page=25",
    publishedOn: "2025-08-15",
    usedFor:
      "The Scottish Government's listed 2025/26 money for Glasgow's everyday council services and the change from the year before.",
  },
];

/**
 * A first Glasgow record. It is intentionally a small, source-complete sample
 * rather than a claim that every council service is covered yet.
 */
export const glasgowCityAccountability: CouncilAccountabilityRecord = {
  councilName: "Glasgow City Council",
  councilSlug: "glasgow-city",
  councilCode: "S12000049",
  lastReviewedOn: "2026-08-02",
  summary:
    "On 12,800 occasions Glasgow did not give someone temporary housing when the law said it must. Only 37.3% of people are happy with how clean the streets are, against 57% across Scotland. It recycles 30.6% of household rubbish, against 44.3%. Auditors also found no clear long-term money plan.",
  budgetContext: [
    {
      id: "funding-gap-2026-28",
      label: "Money Glasgow may need over the next two years",
      value: 109.7,
      unit: "million",
      currency: "GBP",
      period: "2026/27 to 2027/28",
      plainEnglish:
        "Glasgow's plan says it may need another £109.7m across the next two years to keep paying for services. This is a plan about future money, not money already missing from a bank account.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "budget-support-fund",
      label: "Money set aside to change the budget",
      value: 105.4,
      unit: "million",
      currency: "GBP",
      period: "At 31 March 2023; expected to be fully used by 31 March 2026",
      qualifier: "expected",
      plainEnglish:
        "Glasgow set aside £105.4m to help put its budget changes in place. The audit says much of it was used for new pressures and was expected to be gone by March 2026.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "day-to-day-funding-2025-26",
      label: "Money listed for Glasgow's everyday services",
      value: 1.7,
      unit: "billion",
      currency: "GBP",
      period: "2025/26",
      qualifier: "over",
      plainEnglish:
        "The Scottish Government lists over £1.7bn for Glasgow's everyday services in 2025/26, £86.5m more than the year before. This is money listed for the council, not its final spending result.",
      sourceIds: ["sp-glasgow-funding-2025-26"],
    },
  ],
  outcomes: [
    {
      id: "crisis-grants-24-hours",
      service: "Scottish Welfare Fund Crisis Grants",
      measure: "Applications processed within 24 hours",
      period: "2024/25",
      target: "95%",
      actual: "91%",
      status: "missed",
      variance: "4 percentage points below goal",
      sourceIds: ["gcc-operational-kpis-2024-25"],
    },
    {
      id: "community-care-grants-15-days",
      service: "Scottish Welfare Fund Community Care Grants",
      measure: "Applications processed within 15 days",
      period: "2024/25",
      target: "95%",
      actual: "87%",
      status: "missed",
      variance: "8 percentage points below goal",
      sourceIds: ["gcc-operational-kpis-2024-25"],
    },
    {
      id: "housing-benefit-new-claims",
      service: "Housing Benefit",
      measure: "Days to process new claims",
      period: "2024/25",
      target: "21 days or fewer",
      actual: "25 days",
      status: "missed",
      variance: "4 days slower than goal",
      sourceIds: ["gcc-operational-kpis-2024-25"],
    },
    {
      id: "housing-benefit-changes",
      service: "Housing Benefit",
      measure: "Days to process changes in circumstances",
      period: "2024/25",
      target: "11 days or fewer",
      actual: "7 days",
      status: "met",
      variance: "4 days faster than goal",
      sourceIds: ["gcc-operational-kpis-2024-25"],
    },
    {
      id: "temporary-accommodation-duty",
      service: "Homelessness services",
      measure: "Provide temporary accommodation when the law requires it",
      period: "2024/25",
      target: "All cases where the law says temporary housing must be provided",
      actual: "12,800 instances where temporary accommodation was not provided when it should have been",
      status: "missed",
      comparisonNote:
        "The regulator reports a count of instances, not a percentage. A rate must not be invented without the total number of duties or cases.",
      sourceIds: ["shr-glasgow-engagement-2026-27"],
    },
  ],
  auditFindings: [
    {
      id: "no-medium-term-financial-plan",
      title: "There was no clear long-term money plan",
      reportDate: "2026-03",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "grade-1",
      finding:
        "The council did not have a clear plan for the next few years. The audit warned that this could lead to short-term decisions, and that the money saved by changing services had not been clearly shown or counted.",
      recommendation:
        "Join the money plan to the service-change plan and show exactly how much each major change should save.",
      managementResponse:
        "A Financial Outlook for 2026–2028 was presented in August 2025; a 10-year forecast was under development.",
      implementationDate: "2026-09",
      status: "in-progress",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "performance-framework-not-finalised",
      title: "The council did not finish its results-checking system on time",
      reportDate: "2026-03",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "grade-1",
      finding:
        "The new Glasgow Community Plan results system was not ready to test in 2025, so it was not yet possible to check all the results.",
      recommendation:
        "Set a clear date for finishing and using the system so progress can be measured.",
      managementResponse:
        "The Council and partners said a first draft and testing work were ongoing across the Child Poverty Programme.",
      implementationDate: "2026-05",
      status: "not-verified",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "senior-officer-payout-processes",
      title: "Five senior officers received big leaving payments, the process fell short",
      reportDate: "2025-09-04",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "observation",
      finding:
        "Five senior officers were given large early-retirement and redundancy payouts. The review found that the process and the decisions behind them fell short of the standards expected of public servants.",
      status: "not-verified",
      sourceIds: ["audit-2023-24"],
    },
  ],
  commitments: [
    {
      id: "strategic-plan-reduce-poverty",
      title: "Reduce poverty and inequality",
      commitment:
        "The Council's Strategic Plan 2022–2027 lists reducing poverty and inequality in Glasgow's communities as one of its four Grand Challenges.",
      announcedOn: "2022-10",
      dueBy: "2027",
      owner: "Glasgow City Council",
      status: "not-verified",
      currentEvidence:
        "The review records poverty as the council and partnership's main service-change focus, but says stronger results and money evidence are still needed.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "ten-year-financial-forecast",
      title: "Develop a 10-year financial forecast",
      commitment:
        "The Council said a 10-year forecast would be developed after its Financial Outlook 2026–2028.",
      announcedOn: "2025-08-21",
      dueBy: "2026-09",
      owner: "Glasgow City Council Executive Director of Financial Services",
      status: "in-progress",
      currentEvidence: "The review recorded the forecast as under development and gave September 2026 as the date for putting it in place.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "community-performance-framework",
      title: "Finalise and test the community performance framework",
      commitment:
        "The Council and its community-planning partners committed to a first draft and iterative testing of the framework for the Glasgow Community Plan.",
      announcedOn: "2024",
      dueBy: "2026-05",
      owner: "Glasgow City Council and Glasgow Community Planning Partnership",
      status: "not-verified",
      currentEvidence:
        "The audit records the framework as not finalised for 2025 testing and says the Council reported ongoing draft and testing work. Whether the May 2026 milestone was met needs a newer primary source.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "temporary-accommodation-strategy",
      title: "Publish an updated temporary accommodation strategy",
      commitment:
        "Glasgow said it planned to publish an updated temporary accommodation strategy and improve alternatives to hotels and bed-and-breakfast accommodation.",
      announcedOn: "2026-04-02",
      dueBy: "2026-05",
      owner: "Glasgow City Health and Social Care Partnership / Glasgow City Council",
      status: "not-verified",
      currentEvidence:
        "The Scottish Housing Regulator records the plan but this sample does not claim publication or delivery after the proposed month.",
      sourceIds: ["shr-glasgow-engagement-2026-27"],
    },
  ],
  sources,
  knownGaps: [
    "The 12,800 homelessness failures are a count of cases, not a percentage. The total number of cases needed to calculate a rate is not included.",
    "The money set aside for budget changes was expected to be fully used by 31 March 2026. Later final spending figures or a council paper are needed to say what was actually spent.",
    "This page does not include final 2025/26 spending results for every service, the full council building programme, procurement data, or all 244 Strategic Plan promises.",
    "Commitment statuses marked not-verified need a later council, regulator or auditor publication before they can be called complete or missed.",
    "No individual councillor is attributed with a service result here. Council decisions, officer accountability and national funding responsibilities need separate evidence.",
  ],
};

export const councilAccountabilityRecords: CouncilAccountabilityRecord[] = [
  glasgowCityAccountability,
  ...councilAccountabilityAHRecords,
  ...councilAccountabilityIRRecords,
  ...southAndWestCouncilAccountabilityRecords,
];

export function getCouncilAccountability(slug: string) {
  return councilAccountabilityRecords.find((record) => record.councilSlug === slug);
}
