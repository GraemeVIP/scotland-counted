/**
 * Source-backed starter records for seven councils in the south, east and
 * west of Scotland.
 *
 * These records are intentionally honest about their limits. The budget
 * numbers come from Audit Scotland's 2026/27 council returns, while the
 * scrutiny notes come from the relevant annual audit or Best Value report.
 * They are written in short, everyday language so a reader does not need to
 * know council finance terms before they can understand the point.
 */

import type {
  AccountabilitySource,
  AuditFinding,
  BudgetFigure,
  CouncilAccountabilityRecord,
  CouncilCommitment,
} from "./councilAccountability.ts";

const reviewedOn = "2026-08-02";

const budgetBulletin: AccountabilitySource = {
  id: "audit-scotland-budget-bulletin-2026-27",
  title: "Local government budgets 2026/27",
  publisher: "Audit Scotland / Accounts Commission",
  kind: "audit",
  url: "https://audit.scot/uploads/2026-06/nr_260611_lg_council_budgets.pdf",
  publishedOn: "2026-06-11",
  usedFor:
    "The General Fund revenue budget, the budget gap identified when the 2026/27 budget was set, approved savings and other measures. Audit Scotland says these figures come from council data returns and should be compared with care because councils describe gaps and measures in different ways.",
};

type BudgetNumbers = {
  budget: number;
  gap: number;
  savings: number;
  otherMeasures: number;
};

const money = (value: number) => `£${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })}m`;

function budgetContext(councilName: string, numbers: BudgetNumbers): BudgetFigure[] {
  const positionIsSurplus = numbers.gap < 0;
  const positionValue = Math.abs(numbers.gap);

  return [
    {
      // The current council route looks for this id when building its short
      // FAQ. The period and wording remain explicit so the integration can
      // update that route without losing the data.
      id: "day-to-day-funding-2025-26",
      label: "Money planned for everyday council services",
      value: numbers.budget,
      unit: "million",
      currency: "GBP",
      period: "2026/27 budget",
      plainEnglish:
        `Audit Scotland reports a General Fund budget of ${money(numbers.budget)} for ${councilName} in 2026/27. This is the council's main day-to-day pot for services. It is a budget, not the final amount spent.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "budget-gap-before-measures",
      label: positionIsSurplus ? "Reported budget surplus before measures" : "Budget gap before measures",
      value: positionValue,
      unit: "million",
      currency: "GBP",
      period: "2026/27 budget setting",
      qualifier: positionIsSurplus ? undefined : "projected",
      plainEnglish: positionIsSurplus
        ? `At the time of setting the budget, ${councilName} reported a ${money(positionValue)} surplus before its other budget measures. That is a budget-setting position, not a promise that every service will finish the year under budget.`
        : `When the budget was set, ${councilName} reported a ${money(positionValue)} gap before its other measures were counted. This is a forecast at budget time, not money already missing from a bank account.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "approved-savings-2026-27",
      label: "Approved savings in the budget",
      value: numbers.savings,
      unit: "million",
      currency: "GBP",
      period: "2026/27",
      plainEnglish:
        `The budget lists ${money(numbers.savings)} of approved savings. Savings can mean service changes, staff changes or other reductions; this record does not assume what each one means without the council's individual papers.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "other-budget-measures-2026-27",
      label: "Other measures used in the budget",
      value: numbers.otherMeasures,
      unit: "million",
      currency: "GBP",
      period: "2026/27",
      plainEnglish:
        `The council listed another ${money(numbers.otherMeasures)} of measures. Audit Scotland says this can include council tax, extra income, reserves and other actions, so it is not all a cut to services.`,
      sourceIds: [budgetBulletin.id],
    },
  ];
}

function source(
  id: string,
  title: string,
  publisher: string,
  kind: AccountabilitySource["kind"],
  url: string,
  publishedOn: string,
  usedFor: string,
): AccountabilitySource {
  return { id, title, publisher, kind, url, publishedOn, usedFor };
}

function finding(
  id: string,
  title: string,
  reportDate: string,
  findingText: string,
  sourceIds: string[],
  options: Partial<Pick<AuditFinding, "recommendation" | "managementResponse" | "implementationDate" | "status" | "severity">> = {},
): AuditFinding {
  return {
    id,
    title,
    reportDate,
    publisher: "Audit Scotland / Accounts Commission",
    severity: options.severity ?? "grade-1",
    finding: findingText,
    recommendation: options.recommendation,
    managementResponse: options.managementResponse,
    implementationDate: options.implementationDate,
    status: options.status ?? "not-verified",
    sourceIds,
  };
}

function commitment(
  id: string,
  title: string,
  commitmentText: string,
  announcedOn: string,
  dueBy: string,
  currentEvidence: string,
  sourceIds: string[],
): CouncilCommitment {
  return {
    id,
    title,
    commitment: commitmentText,
    announcedOn,
    dueBy,
    owner: "The council and its senior officers",
    status: "not-verified",
    currentEvidence,
    sourceIds,
  };
}

const scottishBordersAudit = source(
  "audit-scottish-borders-2024-25",
  "Scottish Borders Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-10/aar_2425_scottish_borders.pdf",
  "2025-09",
  "The audit's findings on late working papers, savings, performance reporting and the Hawick Flood Protection Scheme.",
);

export const scottishBordersAccountability: CouncilAccountabilityRecord = {
  councilName: "Scottish Borders Council",
  councilSlug: "scottish-borders",
  councilCode: "S12000026",
  lastReviewedOn: reviewedOn,
  summary:
    "Scottish Borders has kept its yearly finances under control, but it still needs large savings over the next few years. Audit Scotland also found delays in the papers needed to check the accounts and said the council needs to show more clearly whether its transformation plans deliver the promised savings.",
  budgetContext: budgetContext("Scottish Borders Council", {
    budget: 418.0,
    gap: 16.3,
    savings: 7.6,
    otherMeasures: 8.7,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "late-audit-working-papers",
      "Finance papers were late for the audit",
      "2025-09",
      "Audit Scotland said there were delays in providing working papers and other audit evidence. The report linked this to staff capacity problems and unplanned absences in the finance team.",
      [scottishBordersAudit.id],
      {
        recommendation:
          "Provide the full set of working papers at the start of the audit and check that they match the accounts.",
        implementationDate: "2026-03-31",
        status: "not-verified",
      },
    ),
    finding(
      "savings-and-transformation-reporting",
      "The council needs clearer proof that its change plans deliver savings",
      "2025-09",
      "The Accounts Commission recognised Scottish Borders' record of savings, but said it should strengthen reporting on transformation milestones, expected benefits and the link between improvement work and performance evidence.",
      [scottishBordersAudit.id],
      {
        recommendation:
          "Report clearly on milestones, benefits and recurring savings, and show how the work affects local outcomes.",
        implementationDate: "2025-08",
        status: "not-verified",
      },
    ),
  ],
  commitments: [
    commitment(
      "audit-working-papers",
      "Improve the papers supplied for audit",
      "Provide a complete, checked set of working papers at the start of the audit process.",
      "2025-09",
      "2026-03-31",
      "The audit report records the action and due date. A newer published check is still needed before calling it complete.",
      [scottishBordersAudit.id],
    ),
    commitment(
      "transformation-benefits-reporting",
      "Show whether the transformation plan is working",
      "Improve public reporting on transformation milestones, expected benefits and recurring savings.",
      "2025-09",
      "2026-03-31",
      "The audit records this as a required improvement. This record does not claim the later milestone was met.",
      [scottishBordersAudit.id],
    ),
  ],
  sources: [budgetBulletin, scottishBordersAudit],
  knownGaps: [
    "The budget figures are council returns collected for Audit Scotland's 2026/27 bulletin. They are not the final audited outturn.",
    "The report says service performance was broadly stable, but this record does not yet contain a full service-by-service target table.",
    "The Hawick Flood Protection Scheme had a dispute that was settled in July 2025. A later lessons-learned report is still needed to judge what changed.",
    "Commitments marked as needing a fresh check have not been called complete or missed without a newer source.",
  ],
};

const shetlandAudit = source(
  "audit-shetland-2024-25",
  "Shetland Islands Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-12/aar_2425_shetland_islands.pdf",
  "2025-12",
  "The audit's findings on using reserves, the four-year budget gap, the change programme and performance indicators.",
);

export const shetlandIslandsAccountability: CouncilAccountabilityRecord = {
  councilName: "Shetland Islands Council",
  councilSlug: "shetland-islands",
  councilCode: "S12000027",
  lastReviewedOn: reviewedOn,
  summary:
    "Shetland's day-to-day finances were judged to be well managed in 2024/25, but the council used reserves to plug a £20.9m gap for 2025/26. Its own plan shows a much bigger gap over four years, and auditors say detailed plans for its change programme are slow to arrive.",
  budgetContext: budgetContext("Shetland Islands Council", {
    budget: 186.5,
    gap: 43.7,
    savings: 0,
    otherMeasures: 43.7,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "reserves-used-to-balance",
      "Reserves were used to balance the yearly budget",
      "2025-12",
      "Audit Scotland said Shetland used reserves to meet a £20.9m gap in its 2025/26 General Fund budget. The audit warned that repeated large draws could weaken the council's ability to pay for future investment.",
      [shetlandAudit.id],
      {
        recommendation:
          "Keep the long-term financial plan under review and reduce reliance on one-off reserves where possible.",
        status: "open",
      },
    ),
    finding(
      "slow-change-project-plans",
      "Detailed plans for the change programme were slow",
      "2025-12",
      "The audit said Shetland's change programme had clear themes and projects, but progress on detailed project plans was slow and the council had limited capacity to move the work forward.",
      [shetlandAudit.id],
      {
        recommendation: "Set out clear project plans, owners, dates and expected results for the change programme.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "shetland-financial-sustainability",
      "Reduce reliance on reserves",
      "Take further action so the council's medium-term plan does not depend on repeated large reserve withdrawals.",
      "2025-12",
      "2029-30",
      "The audit records a projected four-year gap of £134.3m. A later source is needed to show how much of that gap has been closed.",
      [shetlandAudit.id],
    ),
    commitment(
      "shetland-change-project-plans",
      "Finish the detailed change plans",
      "Turn the change programme's themes into detailed project plans with clear delivery dates and results.",
      "2025-12",
      "Not published",
      "The audit says this work was slow. No later completion evidence is included here.",
      [shetlandAudit.id],
    ),
  ],
  sources: [budgetBulletin, shetlandAudit],
  knownGaps: [
    "Shetland's budget figures are affected by its harbour-related reserves. Audit Scotland says island councils are unusual in this respect, so simple comparisons with other councils can mislead.",
    "The £134.3m figure is a projected four-year gap from the 2024/25 audit, not a final bill or an amount already lost.",
    "The audit reports that 56% of benchmarking indicators were in the top two quartiles, but this record does not yet show each indicator or its target.",
    "The current status of the change programme and reserve plan needs a newer council or audit report.",
  ],
};

const southAyrshireAudit = source(
  "audit-south-ayrshire-2024-25",
  "South Ayrshire Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-10/aar_2425_south_ayrshire.pdf",
  "2025-09",
  "The audit's findings on reserve use, capital spending, council tax, the medium-term gap and performance indicators.",
);

export const southAyrshireAccountability: CouncilAccountabilityRecord = {
  councilName: "South Ayrshire Council",
  councilSlug: "south-ayrshire",
  councilCode: "S12000028",
  lastReviewedOn: reviewedOn,
  summary:
    "South Ayrshire balanced its 2024/25 accounts by using £4.586m of reserves. Audit Scotland said only 56% of the planned capital programme was spent and warned that the medium-term gap still had no full funding plan. The 2026/27 budget shows another £20.7m gap before measures.",
  budgetContext: budgetContext("South Ayrshire Council", {
    budget: 398.1,
    gap: 20.7,
    savings: 9.4,
    otherMeasures: 11.3,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "reserves-used-to-balance-south-ayrshire",
      "Reserves were used to balance the year",
      "2025-09",
      "The council operated within budget in 2024/25, but £4.586m of reserves was used to do it. Audit Scotland said reserves can only be spent once and that the unearmarked balance was below the council's own 2% to 4% policy range.",
      [southAyrshireAudit.id],
      {
        recommendation:
          "Set out how uncommitted reserves will be rebuilt and how the medium-term budget gap will be filled.",
        status: "open",
      },
    ),
    finding(
      "capital-programme-delivery-south-ayrshire",
      "Only 56% of the original capital programme was delivered",
      "2025-09",
      "Audit Scotland reported that capital spending reached 56% of the original budget in 2024/25. It said the council needs to improve delivery or make the programme more realistic.",
      [southAyrshireAudit.id],
      {
        recommendation: "Improve delivery of the capital programme and explain clearly when projects move or change.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "south-ayrshire-reserves",
      "Rebuild reserves and close the medium-term gap",
      "Identify savings and transformation work that can close the medium-term gap without relying on one-off reserves.",
      "2025-09",
      "2029-30",
      "Audit Scotland recorded a cumulative gap of £32.9m to 2029/30 in the 2025/26 update, with a later revised projection of £26.2m. A fresh outturn is needed to check the position now.",
      [southAyrshireAudit.id],
    ),
    commitment(
      "south-ayrshire-capital-delivery",
      "Deliver the capital programme or reset it openly",
      "Improve delivery of capital projects, or publish a more realistic programme when work cannot be delivered as planned.",
      "2025-09",
      "Not published",
      "The audit made the issue clear but did not publish a later delivery result in the source used here.",
      [southAyrshireAudit.id],
    ),
  ],
  sources: [budgetBulletin, southAyrshireAudit],
  knownGaps: [
    "The 2026/27 budget numbers are council returns in Audit Scotland's bulletin, not the final audited accounts.",
    "The audit said 52% of national indicators improved or stayed the same and 40% declined. This record does not yet list the individual services behind those percentages.",
    "The 2024/25 audit report records a discontinued Spaceport project and a £3.279m accounting adjustment. A separate project history would be needed before drawing wider conclusions about value for money.",
    "The current status of reserve rebuilding, savings and capital delivery needs newer council papers.",
  ],
};

const southLanarkshireAudit = source(
  "audit-south-lanarkshire-2024-25",
  "South Lanarkshire Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-10/aar_2425_south_lanarkshire.pdf",
  "2025-09",
  "The audit's findings on the medium-term budget gap, the new finance system, transformation savings and service outcomes.",
);

export const southLanarkshireAccountability: CouncilAccountabilityRecord = {
  councilName: "South Lanarkshire Council",
  councilSlug: "south-lanarkshire",
  councilCode: "S12000029",
  lastReviewedOn: reviewedOn,
  summary:
    "South Lanarkshire stayed within its yearly budget and kept reserves in line with its long-term plan. But Audit Scotland says a medium-term gap remains, and the council does not routinely show whether transformation savings change the quality of services people receive.",
  budgetContext: budgetContext("South Lanarkshire Council", {
    budget: 1086.7,
    gap: -1.5,
    savings: 4.2,
    otherMeasures: 11.5,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "south-lanarkshire-medium-term-gap",
      "A medium-term budget gap remains",
      "2025-09",
      "The council reported a projected surplus for 2025/26, but Audit Scotland said there was still a budget gap over the medium term. It said the council was using scenario planning and transformation reviews to plan for the longer term.",
      [southLanarkshireAudit.id],
      {
        recommendation:
          "Keep the medium-term financial strategy up to date and show how savings will protect essential services.",
        status: "open",
      },
    ),
    finding(
      "south-lanarkshire-transformation-outcomes",
      "Savings are tracked, but service results are not tracked separately",
      "2025-09",
      "Audit Scotland said the council focuses on the financial benefits of transformation, but does not routinely report separately on the effect on service quality or outcomes for people using services.",
      [southLanarkshireAudit.id],
      {
        recommendation:
          "Report both the money saved and what happened to service quality and outcomes after each major change.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "south-lanarkshire-transformation-reporting",
      "Report what service users get after changes",
      "Track service quality and outcomes alongside the money saved by transformation projects.",
      "2025-09",
      "Not published",
      "The audit says a performance framework exists, but it also says transformation outcomes are not routinely separated out. No later report is included here.",
      [southLanarkshireAudit.id],
    ),
    commitment(
      "south-lanarkshire-financial-strategy",
      "Keep the medium-term financial plan under review",
      "Use scenario planning and transformation reviews to close the remaining medium-term gap.",
      "2025-09",
      "Not published",
      "The audit records ongoing work but no final date for closing the gap.",
      [southLanarkshireAudit.id],
    ),
  ],
  sources: [budgetBulletin, southLanarkshireAudit],
  knownGaps: [
    "South Lanarkshire reported a £1.5m surplus before measures when setting its 2026/27 budget. This is not the same as a final year-end result.",
    "The audit says the council has improvement plans for indicators below the Scottish average, but this record does not yet list those indicators or targets.",
    "The exact medium-term gap after later decisions needs a current council financial strategy.",
    "No individual councillor is linked to a budget or service result here.",
  ],
};

const stirlingAudit = source(
  "audit-stirling-workforce-2023-24",
  "Stirling Council Best Value thematic work 2023/24: workforce innovation",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-05/bv_2324_stirling.pdf",
  "2025-04-07",
  "The Best Value review's findings on the ERP system, hybrid working, sickness absence and workforce planning.",
);
const stirlingBudget = source(
  "stirling-budget-2026-27",
  "Stirling Council approves 2026/27 budget",
  "Stirling Council",
  "council",
  "https://www.stirling.gov.uk/news/stirling-council-approves-2026-27-budget-that-commits-to-restoring-pride-in-communities/",
  "2026-02-26",
  "The council's approved 2026/27 budget and its published five-year cumulative budget gap.",
);

export const stirlingAccountability: CouncilAccountabilityRecord = {
  councilName: "Stirling Council",
  councilSlug: "stirling",
  councilCode: "S12000030",
  lastReviewedOn: reviewedOn,
  summary:
    "Stirling approved a balanced 2026/27 budget, but says it faces a £37.2m gap over the next five years. Audit work also found that its new finance and HR system cost more resources than planned, and that the council had not shown the effect of hybrid working on sickness absence.",
  budgetContext: budgetContext("Stirling Council", {
    budget: 323.0,
    gap: 11.4,
    savings: 5.5,
    otherMeasures: 6.0,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "stirling-erp-overrun",
      "The new finance and HR system used more time and money than planned",
      "2025-04-07",
      "The Best Value review said the ERP system implementation had significant cost and resource overruns compared with its original business case. The council had a stabilisation plan in place, but the report said further benefits still had to be realised.",
      [stirlingAudit.id],
      {
        recommendation: "Track the remaining costs, benefits and service improvements from the system in public reports.",
        status: "not-verified",
      },
    ),
    finding(
      "stirling-hybrid-working-evidence",
      "The effect of hybrid working on sickness absence was not shown",
      "2025-04-07",
      "The auditor said Stirling had tested hybrid working, but had not demonstrated whether it changed sickness absence. The report records absence above the national average, with stress and musculoskeletal problems the main recorded reasons.",
      [stirlingAudit.id],
      {
        recommendation: "Publish evidence on absence, staff wellbeing and service performance as the workforce plan changes.",
        status: "not-verified",
      },
    ),
  ],
  commitments: [
    commitment(
      "stirling-erp-benefits",
      "Show the benefits of the new finance system",
      "Use the stabilisation plan to show whether the ERP system delivers the promised workforce and service benefits.",
      "2025-04-07",
      "Not published",
      "The audit records a stabilisation plan but not a completed benefits report.",
      [stirlingAudit.id],
    ),
    commitment(
      "stirling-people-strategy",
      "Join workforce, transformation and financial plans",
      "Develop a People Strategy that links workforce capacity and skills to the transformation plan and medium-term financial plan.",
      "2025-04-07",
      "2026-03",
      "The audit set March 2026 as a target date. A later published review is needed before calling this complete.",
      [stirlingAudit.id],
    ),
  ],
  sources: [budgetBulletin, stirlingBudget, stirlingAudit],
  knownGaps: [
    "The 2026/27 budget figures are council returns collected by Audit Scotland; they are not final audited accounts.",
    "The Best Value source covers workforce innovation in 2023/24, not every council service or the final 2025/26 position.",
    "The council's published £37.2m five-year gap is a forecast and includes assumptions about future savings and investment.",
    "No current service target table or individual councillor decision trail is included yet.",
  ],
};

const westDunbartonshireAudit = source(
  "audit-west-dunbartonshire-2024-25",
  "West Dunbartonshire Council Best Value thematic work 2024/25",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2026-02/bv_2425_west_dunbartonshire.pdf",
  "2026-01",
  "The Best Value review's findings on transformation planning, financial sustainability, oversight and service reductions.",
);

export const westDunbartonshireAccountability: CouncilAccountabilityRecord = {
  councilName: "West Dunbartonshire Council",
  councilSlug: "west-dunbartonshire",
  councilCode: "S12000039",
  lastReviewedOn: reviewedOn,
  summary:
    "West Dunbartonshire identified a £15.9m gap in its 2026/27 budget and planned £5.4m of savings. Audit Scotland says the council has no single transformation programme, so it is hard to see the total cost and results. Many savings were tied to reducing local services.",
  budgetContext: budgetContext("West Dunbartonshire Council", {
    budget: 325.7,
    gap: 15.9,
    savings: 5.4,
    otherMeasures: 10.5,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "west-dunbartonshire-no-single-programme",
      "There is no single plan showing all transformation work",
      "2026-01",
      "Audit Scotland said West Dunbartonshire's transformation work was spread across individual projects rather than one joined-up programme. That makes it difficult to measure the total cost, savings and effect on services.",
      [westDunbartonshireAudit.id],
      {
        recommendation:
          "Bring the projects together in one programme with clear costs, savings, milestones and results.",
        status: "open",
      },
    ),
    finding(
      "west-dunbartonshire-service-reductions",
      "Budget gaps were mainly being closed by reducing services",
      "2026-01",
      "The audit reviewed 57 savings options and found most were reductions in education, roads, parks, street cleaning, environmental work, leisure and community services. It said the council recognised these changes would not fully solve its medium- and long-term financial problems.",
      [westDunbartonshireAudit.id],
      {
        recommendation: "Show residents the service effect and long-term value of each saving option before decisions are made.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "west-dunbartonshire-transformation-programme",
      "Create one joined-up transformation programme",
      "Bring separate change projects into one programme so elected members and residents can see the total cost and results.",
      "2026-01",
      "Not published",
      "Audit Scotland made this a recommendation. No later public programme report is included here.",
      [westDunbartonshireAudit.id],
    ),
    commitment(
      "west-dunbartonshire-service-impact",
      "Show what service reductions mean locally",
      "Publish the likely effect of savings on education, roads, environmental services, leisure and community facilities.",
      "2026-01",
      "Not published",
      "The audit says impact reporting is limited. This record does not assume the gap has been fixed.",
      [westDunbartonshireAudit.id],
    ),
  ],
  sources: [budgetBulletin, westDunbartonshireAudit],
  knownGaps: [
    "Audit Scotland warns that councils describe budget gaps and measures differently, so this figure should not be treated as a league table.",
    "The service reductions are taken from the audit's review of budget options. A full list of final decisions and actual savings is still needed.",
    "This record does not yet include service-by-service targets or results for poverty, housing, education, roads and social care.",
    "No individual councillor is attributed with a service result without a documented decision trail.",
  ],
};

const westLothianAudit = source(
  "audit-west-lothian-2024-25",
  "West Lothian Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-10/aar_2425_west_lothian.pdf",
  "2025-09",
  "The audit's findings on the 2024/25 overspend, reserve use, the remaining medium-term gap and performance indicators.",
);

export const westLothianAccountability: CouncilAccountabilityRecord = {
  councilName: "West Lothian Council",
  councilSlug: "west-lothian",
  councilCode: "S12000040",
  lastReviewedOn: reviewedOn,
  summary:
    "West Lothian spent £3.1m more than its approved core revenue budget in 2024/25 and used reserves to balance the year. Audit Scotland says a £9.7m gap was still expected by 2027/28 after savings, although 68% of performance indicators improved from the previous year.",
  budgetContext: budgetContext("West Lothian Council", {
    budget: 634.6,
    gap: 20.2,
    savings: 8.5,
    otherMeasures: 11.7,
  }),
  outcomes: [],
  auditFindings: [
    finding(
      "west-lothian-overspend-2024-25",
      "The council overspent and used reserves",
      "2025-09",
      "Audit Scotland reported a £3.1m overspend against West Lothian's approved 2024/25 core revenue budget of £613.4m. The council's planned use of reserves funded the overspend.",
      [westLothianAudit.id],
      {
        recommendation: "Keep recurring spending and savings under close review so reserves are not used to cover the same gap every year.",
        status: "not-verified",
      },
    ),
    finding(
      "west-lothian-remaining-gap",
      "A gap remained after the planned savings",
      "2025-09",
      "The audit said West Lothian's three-year plan had an estimated £34.9m gap before savings. After identified savings and Integrated Joint Board assumptions, a £9.7m gap was still expected in 2027/28.",
      [westLothianAudit.id],
      {
        recommendation: "Set out recurring savings and income that close the remaining gap without relying on one-off measures.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "west-lothian-close-gap",
      "Close the remaining medium-term gap",
      "Deliver recurring savings and other measures that reduce the remaining gap by 2027/28.",
      "2025-09",
      "2027-28",
      "The audit gives the forecast and the planned measures, but this record does not claim the later gap has been closed.",
      [westLothianAudit.id],
    ),
    commitment(
      "west-lothian-performance-reporting",
      "Keep showing service performance while budgets tighten",
      "Continue reporting progress against Council Plan indicators while financial changes are made.",
      "2025-09",
      "2028",
      "The audit says 68% of indicators improved from the previous year. A full current indicator table is still needed.",
      [westLothianAudit.id],
    ),
  ],
  sources: [budgetBulletin, westLothianAudit],
  knownGaps: [
    "The 2026/27 budget figure is a council return in Audit Scotland's bulletin. It is not the final audited outturn.",
    "The £9.7m figure is a forecast after identified measures, not a final bill already due.",
    "The audit says 68% of indicators improved, but this record does not yet show which services improved or declined.",
    "The audit also raised concerns about asset valuation assumptions. A later follow-up is needed to see whether the recommendation was completed.",
  ],
};

export const southAndWestCouncilAccountabilityRecords: CouncilAccountabilityRecord[] = [
  scottishBordersAccountability,
  shetlandIslandsAccountability,
  southAyrshireAccountability,
  southLanarkshireAccountability,
  stirlingAccountability,
  westDunbartonshireAccountability,
  westLothianAccountability,
];

export function getSouthAndWestCouncilAccountability(slug: string) {
  return southAndWestCouncilAccountabilityRecords.find((record) => record.councilSlug === slug);
}
