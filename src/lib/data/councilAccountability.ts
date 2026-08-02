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
      "The projected £109.7m funding gap, the £105.4m budget support fund, the lack of a medium-term financial plan, the unfinished performance framework, and the Council's stated poverty priority and commitments.",
  },
  {
    id: "audit-2023-24",
    title: "The 2023/24 audit of Glasgow City Council",
    publisher: "Audit Scotland / Accounts Commission",
    kind: "audit",
    url: "https://audit.scot/publications/the-202324-audit-of-glasgow-city-council",
    publishedOn: "2025-09-04",
    usedFor:
      "The Accounts Commission's dated finding about the processes that enabled five senior officers to receive significant early-retirement and redundancy payouts.",
  },
  {
    id: "gcc-operational-kpis-2024-25",
    title: "Operational performance and delivery: 2024/25 KPI appendix",
    publisher: "Glasgow City Council",
    kind: "council",
    url: "https://onlineservices.glasgow.gov.uk/councillorsandcommittees/viewSelectedDocument.asp?c=P62AFQDNNTDXDN2U81",
    publishedOn: "2025-05-07",
    usedFor:
      "The Council's own targets and actual results for Scottish Welfare Fund grants and Housing Benefit claim processing in 2024/25.",
  },
  {
    id: "shr-glasgow-engagement-2026-27",
    title: "Engagement plan from 1 April 2026 to 31 March 2027",
    publisher: "Scottish Housing Regulator",
    kind: "regulator",
    url: "https://www.housingregulator.gov.scot/landlord-performance/landlords/glasgow-city-council/engagement-plan-from-1-april-2026-to-31-march-2027/",
    publishedOn: "2026-04-02",
    usedFor:
      "The regulator's statement that Glasgow is affected by systemic failure in homelessness services, 12,800 instances without temporary accommodation in 2024/25, and the Council's stated plans for a temporary accommodation strategy.",
  },
  {
    id: "sp-glasgow-funding-2025-26",
    title: "Written answer S6W-39654: local government funding",
    publisher: "Scottish Parliament (Scottish Government answer)",
    kind: "government",
    url: "https://www.parliament.scot/chamber-and-committees/questions-and-answers?msp=16198&page=25",
    publishedOn: "2025-08-15",
    usedFor:
      "The Scottish Government's stated 2025/26 day-to-day funding for Glasgow City Council and the reported year-on-year increase.",
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
    "Glasgow has a clear public priority to reduce poverty, but current scrutiny records show serious pressure in homelessness, missed service targets and gaps in longer-term financial and performance planning. The record separates what was measured from what still needs checking.",
  budgetContext: [
    {
      id: "funding-gap-2026-28",
      label: "Projected funding gap over the next two financial years",
      value: 109.7,
      unit: "million",
      currency: "GBP",
      period: "2026/27 to 2027/28",
      qualifier: "projected",
      plainEnglish:
        "Audit Scotland says Glasgow expects a £109.7m gap across the next two years. That is a forecast, not money already missing from a bank account.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "budget-support-fund",
      label: "Budget Support Fund",
      value: 105.4,
      unit: "million",
      currency: "GBP",
      period: "At 31 March 2023; expected to be fully used by 31 March 2026",
      qualifier: "expected",
      plainEnglish:
        "The fund was intended to help implement budget options. Audit Scotland says much of it was used for emerging pressures and that it was expected to be fully used by March 2026.",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "day-to-day-funding-2025-26",
      label: "Day-to-day funding reported for Glasgow",
      value: 1.7,
      unit: "billion",
      currency: "GBP",
      period: "2025/26",
      qualifier: "over",
      plainEnglish:
        "A Scottish Government answer says Glasgow received over £1.7bn for day-to-day services in 2025/26, £86.5m more than the year before. The figure is a funding allocation, not the Council's final outturn.",
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
      variance: "4 percentage points below target",
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
      variance: "8 percentage points below target",
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
      variance: "4 days slower than target",
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
      variance: "4 days faster than target",
      sourceIds: ["gcc-operational-kpis-2024-25"],
    },
    {
      id: "temporary-accommodation-duty",
      service: "Homelessness services",
      measure: "Provide temporary accommodation when the statutory duty applies",
      period: "2024/25",
      target: "100% of cases where the duty applies",
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
      title: "Long-term financial planning was not yet in place",
      reportDate: "2026-03",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "grade-1",
      finding:
        "The Council did not have a medium-term financial plan. Audit Scotland said this could lead to short-term decisions, and that the financial benefits of public service reform had not been clearly articulated or quantified.",
      recommendation:
        "Align financial planning with public service reform and clearly quantify the financial benefits and savings from transformation projects.",
      managementResponse:
        "A Financial Outlook for 2026–2028 was presented in August 2025; a 10-year forecast was under development.",
      implementationDate: "2026-09",
      status: "in-progress",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "performance-framework-not-finalised",
      title: "Community performance framework was not finalised on schedule",
      reportDate: "2026-03",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "grade-1",
      finding:
        "The new Glasgow Community Plan performance framework had not been finalised for testing in 2025, so outcomes could not yet be fully assessed.",
      recommendation:
        "Set a clear timeline for finalising and implementing the framework so progress against outcomes can be measured.",
      managementResponse:
        "The Council and partners said a first draft and testing work were ongoing across the Child Poverty Programme.",
      implementationDate: "2026-05",
      status: "not-verified",
      sourceIds: ["audit-bv-2024-25"],
    },
    {
      id: "senior-officer-payout-processes",
      title: "Senior officer payout processes fell below expected standards",
      reportDate: "2025-09-04",
      publisher: "Audit Scotland / Accounts Commission",
      severity: "observation",
      finding:
        "The Accounts Commission said the processes, decisions and actions that enabled five senior officers to receive significant early-retirement and redundancy payouts fell short of the behaviour and standards expected of public servants.",
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
        "Audit Scotland records poverty as the Council and partnership's main public-service-reform focus, but says stronger outcome and financial evidence is still needed.",
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
      currentEvidence: "Audit Scotland recorded the forecast as under development and gave September 2026 as the implementation date.",
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
    "The 12,800 homelessness failures are a count of instances, not a denominator-based rate; do not turn them into a percentage without the matching Scottish Government dataset.",
    "The Budget Support Fund was expected to be fully used by 31 March 2026. A later outturn or council paper is still needed to say what was actually spent.",
    "This sample does not include audited 2025/26 outturns for every service, the full council capital programme, procurement data, or all 244 Strategic Plan commitments.",
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
