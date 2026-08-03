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
    "The money for everyday services, the extra money councils said they needed when setting their 2026/27 budgets, planned savings and other budget entries. These figures come from council returns, not final accounts, and councils describe their money problems in different ways.",
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
      label: "Money for everyday council services",
      value: numbers.budget,
      unit: "million",
      currency: "GBP",
      period: "2026/27 budget",
      plainEnglish:
        `${councilName} planned to spend ${money(numbers.budget)} on everyday services in 2026/27. It is a budget, not the final amount spent.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "budget-gap-before-measures",
      label: positionIsSurplus ? "Money left before other changes" : "Extra money needed for services",
      value: positionValue,
      unit: "million",
      currency: "GBP",
      period: "2026/27",
      plainEnglish: positionIsSurplus
        ? `When the budget was set, ${councilName} had ${money(positionValue)} left before its other changes were counted. This is a budget-setting figure, not a final year-end result.`
        : `When the budget was set, ${councilName} needed ${money(positionValue)} more to pay for planned services. The council planned to find it through savings, extra income, money already set aside or other changes. It is not money already missing from a bank account.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "approved-savings-2026-27",
      label: "Savings the council planned to make",
      value: numbers.savings,
      unit: "million",
      currency: "GBP",
      period: "2026/27",
      plainEnglish:
        `The 2026/27 plan says the council will save ${money(numbers.savings)}. That money has not necessarily been saved yet. The final accounts will show whether it happened.`,
      sourceIds: [budgetBulletin.id],
    },
    {
      id: "other-budget-measures-2026-27",
      label: "Money the budget does not explain",
      value: numbers.otherMeasures,
      unit: "million",
      currency: "GBP",
      period: "2026/27",
      plainEnglish:
        `The budget puts ${money(numbers.otherMeasures)} into a box called ‘other measures’. This can include council tax, extra income, money already set aside or other actions. The published table does not show how much comes from each one.`,
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
    "Scottish Borders kept its yearly spending under control, but still needs large savings over the next few years. The audit also found delays in the papers needed to check the accounts and said the council must show whether its change plans actually save money.",
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
      "The audit found delays in providing the papers and other evidence it needed. The report linked this to staff shortages and unplanned absences in the finance team.",
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
      "The council needs clearer proof that its change plans save money",
      "2025-09",
      "The review recognised Scottish Borders' record of savings, but said it should report more clearly on change-plan milestones, expected benefits and how improvement work affects results.",
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
      "Show whether the change plan is working",
      "Improve public reporting on change-plan dates, expected benefits and regular savings.",
      "2025-09",
      "2026-03-31",
      "The audit records this as a required improvement. This record does not claim the later milestone was met.",
      [scottishBordersAudit.id],
    ),
  ],
  sources: [budgetBulletin, scottishBordersAudit],
  knownGaps: [
    "The budget figures are council returns collected for the 2026/27 national bulletin. They are not the final accounts or final spending result.",
    "The report says service performance was broadly stable, but this page does not yet contain a full service-by-service goal table.",
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
    "The audit's findings on money set aside for future years, the four-year money problem, the plan to change services and performance measures.",
);

export const shetlandIslandsAccountability: CouncilAccountabilityRecord = {
  councilName: "Shetland Islands Council",
  councilSlug: "shetland-islands",
  councilCode: "S12000027",
  lastReviewedOn: reviewedOn,
  summary:
    "Shetland's day-to-day finances were judged well managed in 2024/25, but the council used £20.9m of money set aside for future use to balance its 2025/26 plan. Its own plan shows a much bigger money problem over four years, and the detailed plans for changing services were slow to arrive.",
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
      "The audit found that Shetland used £20.9m of money set aside for future use to balance its 2025/26 everyday-services budget. It warned that repeated large withdrawals could leave less money for future investment.",
      [shetlandAudit.id],
      {
        recommendation:
          "Keep the long-term money plan under review and reduce reliance on one-off withdrawals from money set aside for the future.",
        status: "open",
      },
    ),
    finding(
      "slow-change-project-plans",
      "Detailed plans for the change programme were slow",
      "2025-12",
      "The audit said Shetland had clear themes and projects for changing services, but detailed project plans were slow and the council had limited capacity to move the work forward.",
      [shetlandAudit.id],
      {
        recommendation: "Set out clear project plans, owners, dates and expected results for the service changes.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "shetland-financial-sustainability",
      "Use less money set aside for future years",
      "Take further action so the council's plan for the next few years does not depend on repeated large withdrawals from money set aside.",
      "2025-12",
      "2029-30",
      "The audit records an estimated four-year money problem of £134.3m. A later source is needed to show how much of it has been solved.",
      [shetlandAudit.id],
    ),
    commitment(
      "shetland-change-project-plans",
      "Finish the detailed change plans",
      "Turn the service-change themes into detailed project plans with clear delivery dates and results.",
      "2025-12",
      "Not published",
      "The audit says this work was slow. No later completion evidence is included here.",
      [shetlandAudit.id],
    ),
  ],
  sources: [budgetBulletin, shetlandAudit],
  knownGaps: [
    "Shetland's budget figures are affected by money linked to its harbour. Island councils are different in this respect, so simple comparisons with other councils can mislead.",
    "The £134.3m figure is an estimated four-year money problem from the 2024/25 audit, not a final bill or money already lost.",
    "The audit reports that 56% of national comparison measures were in the best two groups, but this page does not yet show each measure or its goal.",
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
    "The audit's findings on money set aside for future use, building work, council tax, the money problem over the next few years and performance measures.",
);

export const southAyrshireAccountability: CouncilAccountabilityRecord = {
  councilName: "South Ayrshire Council",
  councilSlug: "south-ayrshire",
  councilCode: "S12000028",
  lastReviewedOn: reviewedOn,
  summary:
    "South Ayrshire balanced its 2024/25 accounts by using £4.586m of money set aside for future use. The audit found that only 56% of planned building work was delivered and warned that the money problem over the next few years still had no full plan. The 2026/27 budget shows another £20.7m needed before other changes.",
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
      "The council stayed within its budget in 2024/25, but used £4.586m of money set aside to do it. The audit noted that this money can only be spent once and that the amount left was below the council's own 2% to 4% safety range.",
      [southAyrshireAudit.id],
      {
        recommendation:
          "Set out how the money set aside will be rebuilt and how the money problem over the next few years will be solved.",
        status: "open",
      },
    ),
    finding(
      "capital-programme-delivery-south-ayrshire",
      "Only 56% of the original building plan was delivered",
      "2025-09",
      "The audit found that only 56% of the original building budget was spent in 2024/25. It said the council needs to finish more of the work or make its plan more realistic.",
      [southAyrshireAudit.id],
      {
        recommendation: "Finish more building projects and explain clearly when projects move or change.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "south-ayrshire-reserves",
      "Rebuild money set aside and solve the problem over the next few years",
      "Identify savings and service changes that can solve the money problem over the next few years without relying on one-off withdrawals from money set aside.",
      "2025-09",
      "2029-30",
      "The audit recorded £32.9m still needed by 2029/30 in the 2025/26 update, later revised to £26.2m. Fresh final spending figures are needed to check the position now.",
      [southAyrshireAudit.id],
    ),
    commitment(
      "south-ayrshire-capital-delivery",
      "Finish the building plan or reset it openly",
      "Finish more building projects, or publish a more realistic plan when work cannot be delivered as promised.",
      "2025-09",
      "Not published",
      "The audit made the issue clear but did not publish a later delivery result in the source used here.",
      [southAyrshireAudit.id],
    ),
  ],
  sources: [budgetBulletin, southAyrshireAudit],
  knownGaps: [
    "The 2026/27 budget numbers come from council returns in the national bulletin, not the final accounts.",
    "The audit said 52% of national service measures improved or stayed the same and 40% got worse. This page does not yet list the services behind those figures.",
    "The 2024/25 audit records a stopped Spaceport project and a £3.279m accounting correction. A separate project history is needed before drawing wider conclusions about value for money.",
    "The current status of money set aside, savings and building work needs newer council papers.",
  ],
};

const southLanarkshireAudit = source(
  "audit-south-lanarkshire-2024-25",
  "South Lanarkshire Council 2024/25 Annual Audit Report",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2025-10/aar_2425_south_lanarkshire.pdf",
  "2025-09",
    "The audit's findings on the money problem over the next few years, the new finance system, savings from service changes and results for people.",
);

export const southLanarkshireAccountability: CouncilAccountabilityRecord = {
  councilName: "South Lanarkshire Council",
  councilSlug: "south-lanarkshire",
  councilCode: "S12000029",
  lastReviewedOn: reviewedOn,
  summary:
    "South Lanarkshire stayed within its yearly budget and kept its money set aside for future use in line with its long-term plan. But a money problem over the next few years remains, and the council does not routinely show whether service changes affect the quality of services people receive.",
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
      "More money is still needed over the next few years",
      "2025-09",
      "The council reported money left over in its 2025/26 plan, but the audit found that more money was still needed over the next few years. The council was using different possible plans and service-change reviews to work out what to do next.",
      [southLanarkshireAudit.id],
      {
        recommendation:
          "Keep the plan for the next few years up to date and show how savings will protect essential services.",
        status: "open",
      },
    ),
    finding(
      "south-lanarkshire-transformation-outcomes",
      "Savings are tracked, but service results are not tracked separately",
      "2025-09",
      "The audit found that the council focuses on the money saved by service changes, but does not routinely report what happened to service quality or to people using services.",
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
      "Track service quality and results alongside the money saved by service-change projects.",
      "2025-09",
      "Not published",
      "The audit says a performance framework exists, but service-change results are not routinely shown separately. No later report is included here.",
      [southLanarkshireAudit.id],
    ),
    commitment(
      "south-lanarkshire-financial-strategy",
      "Keep the plan for the next few years under review",
      "Use different possible plans and service-change reviews to solve the remaining money problem over the next few years.",
      "2025-09",
      "Not published",
      "The audit records ongoing work but no final date for closing the gap.",
      [southLanarkshireAudit.id],
    ),
  ],
  sources: [budgetBulletin, southLanarkshireAudit],
  knownGaps: [
    "South Lanarkshire reported £1.5m left over before other changes when setting its 2026/27 budget. This is not the same as a final year-end result.",
    "The audit says the council has improvement plans for measures below the Scottish average, but this page does not yet list those measures or goals.",
    "The exact money problem after later decisions needs a current council plan.",
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
    "The review's findings on the new finance and HR system, working from home, sickness absence and workforce planning.",
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
    "Stirling approved a balanced 2026/27 budget, but says it may need to find £37.2m over the next five years. The review also found its new finance and staff system cost more time and money than planned. And the council had not shown whether working from home changed sickness absence.",
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
      "The review found that the new finance and HR system used much more time and money than its original plan allowed. The council had a fix-it plan, but the report said it still had to show the promised benefits.",
      [stirlingAudit.id],
      {
        recommendation: "Track the remaining costs, benefits and service improvements from the new system in public reports.",
        status: "not-verified",
      },
    ),
    finding(
      "stirling-hybrid-working-evidence",
      "The effect of hybrid working on sickness absence was not shown",
      "2025-04-07",
      "The review found that Stirling had tested working from home, but had not shown whether it changed sickness absence. Absence was above the national average, with stress and muscle-and-bone problems the main recorded reasons.",
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
      "Show what the new finance system achieved",
      "Use the fix-it plan to show whether the new system delivers the promised workforce and service benefits.",
      "2025-04-07",
      "Not published",
      "The audit records a stabilisation plan but not a completed benefits report.",
      [stirlingAudit.id],
    ),
    commitment(
      "stirling-people-strategy",
      "Join staff, service-change and money plans",
      "Develop a People Strategy that links staff numbers and skills to the service-change plan and the plan for the next few years.",
      "2025-04-07",
      "2026-03",
      "The audit set March 2026 as the goal date. A later published review is needed before calling this complete.",
      [stirlingAudit.id],
    ),
  ],
  sources: [budgetBulletin, stirlingBudget, stirlingAudit],
  knownGaps: [
      "The 2026/27 budget figures are council returns collected for the national bulletin; they are not final accounts.",
      "The review covers workforce changes in 2023/24, not every council service or the final 2025/26 position.",
      "The council's published £37.2m five-year money problem is an estimate based on assumptions about future savings and investment.",
      "No current service-goal table or individual councillor decision trail is included yet.",
  ],
};

const westDunbartonshireAudit = source(
  "audit-west-dunbartonshire-2024-25",
  "West Dunbartonshire Council Best Value thematic work 2024/25",
  "Audit Scotland / Accounts Commission",
  "audit",
  "https://audit.scot/uploads/2026-02/bv_2425_west_dunbartonshire.pdf",
  "2026-01",
    "The review's findings on change planning, future finances, oversight and service reductions.",
);

export const westDunbartonshireAccountability: CouncilAccountabilityRecord = {
  councilName: "West Dunbartonshire Council",
  councilSlug: "west-dunbartonshire",
  councilCode: "S12000039",
  lastReviewedOn: reviewedOn,
  summary:
    "West Dunbartonshire identified £15.9m more needed in its 2026/27 budget and planned £5.4m of savings. The review found no single joined-up plan for all the changes, so it is hard to see the total cost and results. Many savings involved reducing local services.",
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
      "There is no single plan showing all the service changes",
      "2026-01",
      "The review found that West Dunbartonshire's service changes were spread across separate projects rather than one joined-up plan. That makes it difficult to measure the total cost, savings and effect on services.",
      [westDunbartonshireAudit.id],
      {
        recommendation:
          "Bring the projects together in one plan with clear costs, savings, dates and results.",
        status: "open",
      },
    ),
    finding(
      "west-dunbartonshire-service-reductions",
      "Budget gaps were mainly being closed by reducing services",
      "2026-01",
      "The audit reviewed 57 savings options and found most would reduce spending on education, roads, parks, street cleaning, environmental work, leisure and community services. It said the council recognised these changes would not fully solve its money problems over the next few years or later.",
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
      "Create one joined-up plan for all the service changes",
      "Bring separate change projects into one plan so councillors and residents can see the total cost and results.",
      "2026-01",
      "Not published",
      "The audit made this a recommendation. No later public programme report is included here.",
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
    "Councils describe their money problems and budget changes differently, so this figure should not be used as a league table.",
    "The service reductions are taken from the audit's review of budget options. A full list of final decisions and actual savings is still needed.",
    "This page does not yet include service-by-service goals or results for poverty, housing, education, roads and social care.",
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
    "The audit's findings on the 2024/25 overspend, money set aside, the remaining money problem over the next few years and performance measures.",
);

export const westLothianAccountability: CouncilAccountabilityRecord = {
  councilName: "West Lothian Council",
  councilSlug: "west-lothian",
  councilCode: "S12000040",
  lastReviewedOn: reviewedOn,
  summary:
    "West Lothian spent £3.1m more than its approved everyday-services budget in 2024/25 and used money set aside to balance the year. The audit found that £9.7m was still expected to be needed by 2027/28 after savings, although 68% of service measures improved from the year before.",
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
      "The council spent too much and used money set aside",
      "2025-09",
      "The audit recorded that West Lothian spent £3.1m more than its approved 2024/25 everyday-services budget of £613.4m. The council used money it had set aside to cover the extra spending.",
      [westLothianAudit.id],
      {
        recommendation: "Keep regular spending and savings under close review so money set aside is not used to cover the same problem every year.",
        status: "not-verified",
      },
    ),
    finding(
      "west-lothian-remaining-gap",
      "A gap remained after the planned savings",
      "2025-09",
      "The audit said West Lothian's three-year plan needed an estimated £34.9m before savings. After known savings and assumptions about its health-and-care partnership, £9.7m was still expected to be needed in 2027/28.",
      [westLothianAudit.id],
      {
        recommendation: "Set out regular savings and income that solve the remaining money problem without relying on one-off fixes.",
        status: "open",
      },
    ),
  ],
  commitments: [
    commitment(
      "west-lothian-close-gap",
      "Solve the remaining money problem over the next few years",
      "Deliver regular savings and other changes that reduce the money still needed by 2027/28.",
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
    "The 2026/27 budget figure is a council return in the national bulletin. It is not the final accounts or final spending result.",
    "The £9.7m figure is an estimate after known changes, not a final bill already due.",
    "The audit says 68% of measures improved, but this page does not yet show which services improved or got worse.",
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
