/**
 * Starter accountability records for councils outside Glasgow.
 *
 * These records are deliberately modest. They use figures that can be checked
 * in a primary source and say when a result has not yet been checked. A blank
 * field is safer than turning a budget pressure into an accusation.
 */

import type {
  AccountabilitySource,
  BudgetFigure,
  CouncilAccountabilityRecord,
} from "./councilAccountability";

const auditBudgetBulletin: AccountabilitySource = {
  id: "audit-scotland-council-budgets-2026-27",
  title: "Local government budgets 2026/27",
  publisher: "Audit Scotland / Accounts Commission",
  kind: "audit",
  url: "https://audit.scot/uploads/2026-06/nr_260611_lg_council_budgets.pdf",
  publishedOn: "2026-06-11",
  usedFor:
    "The money for everyday services, extra money councils said they needed when setting their 2026/27 budgets, planned savings and other budget entries.",
};

const auditSource = (
  id: string,
  title: string,
  url: string,
  usedFor: string,
  publishedOn: string,
): AccountabilitySource => ({
  id,
  title,
  publisher: "Audit Scotland / Accounts Commission",
  kind: "audit",
  url,
  publishedOn,
  usedFor,
});

const councilSource = (
  id: string,
  title: string,
  url: string,
  usedFor: string,
  publishedOn?: string,
): AccountabilitySource => ({
  id,
  title,
  publisher: "Council",
  kind: "council",
  url,
  ...(publishedOn ? { publishedOn } : {}),
  usedFor,
});

type BudgetInputs = {
  slug: string;
  councilName: string;
  budget: number;
  gap: number;
  savings: number;
};

const money = (value: number) => `£${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })}m`;

const budgetFigures = ({
  slug,
  councilName,
  budget,
  gap,
  savings,
}: BudgetInputs): BudgetFigure[] => [
  {
    id: `${slug}-revenue-budget-2026-27`,
    label: "Money for everyday council services",
    value: budget,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    plainEnglish: `${councilName} planned to spend ${money(budget)} on everyday services in 2026/27.`,
    sourceIds: [auditBudgetBulletin.id],
  },
  {
    id: `${slug}-projected-budget-gap-2026-27`,
    label: "Extra money needed for services",
    value: gap,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    plainEnglish: `The 2026/27 plan needed ${money(gap)} more to pay for ${councilName}'s planned services. The council said it would find the extra money through savings, extra income, money already set aside or other changes. The final accounts will show what really happened.`,
    sourceIds: [auditBudgetBulletin.id],
  },
  {
    id: `${slug}-approved-savings-2026-27`,
    label: "Savings the council planned to make",
    value: savings,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    plainEnglish: `The council's 2026/27 plan says it will save ${money(savings)}. That money has not necessarily been saved yet. The final accounts will show whether it happened.`,
    sourceIds: [auditBudgetBulletin.id],
  },
];

const sourceIdList = (...ids: string[]) => ids;

const records: CouncilAccountabilityRecord[] = [
  {
    councilName: "Inverclyde Council",
    councilSlug: "inverclyde",
    councilCode: "S12000018",
    lastReviewedOn: "2026-08-02",
  summary:
      "Inverclyde planned to spend £276.6m on everyday services in 2026/27 and needed another £4m in its plan. The council said it would use savings and other changes to find it. The 2024/25 audit found that nearly all planned savings happened, but £70,000 was still outstanding.",
    budgetContext: budgetFigures({
      slug: "inverclyde",
      councilName: "Inverclyde Council",
      budget: 276.6,
      gap: 4.0,
      savings: 0.6,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "inverclyde-savings-mostly-delivered",
        title: "A small part of planned savings was not delivered",
        reportDate: "2026-07-09",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "observation",
        finding:
          "The 2024/25 audit says Inverclyde agreed £3.4m of savings and delivered all but £70,000. It also found pressure in the building programme and high borrowing costs.",
        recommendation:
          "Keep a clear public record of savings still outstanding and explain how each budget gap is being covered.",
        status: "not-verified",
        sourceIds: sourceIdList("inverclyde-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "inverclyde-report-2026-27-savings",
        title: "Show whether the 2026/27 savings were delivered",
        commitment:
          "Publish the final amount saved against each 2026/27 saving and explain any service change that followed.",
        announcedOn: "2026-03",
        owner: "Inverclyde Council",
        status: "planned",
        currentEvidence:
          "The 2026/27 budget sets out savings and other changes. The final spending result has not been checked for this page.",
        sourceIds: sourceIdList("inverclyde-budget-2026-28"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "inverclyde-budget-2026-28",
        "2026/27 and 2027/28 Inverclyde budget and council tax agreed",
        "https://www.inverclyde.gov.uk/news/2026/mar/2026-28-inverclyde-budget-and-council-tax-agreed",
        "The council's approved budget, council tax decision and two-year funding gap explanation.",
        "2026-03",
      ),
      auditSource(
        "inverclyde-audit-2024-25",
        "Inverclyde Council annual audit 2024/25",
        "https://audit.scot/uploads/2026-07/bv_260709_inverclyde_council.pdf",
        "The external audit's savings, capital programme and financial sustainability findings.",
        "2026-07-09",
      ),
    ],
    knownGaps: [
      "A service-by-service list of the 2026/27 savings and their final results still needs to be added.",
      "This page does not yet show council goals and actual results for homelessness, education, roads or social care.",
      "The audit finding is dated. A newer follow-up source is needed before calling the outstanding savings complete or missed.",
    ],
  },
  {
    councilName: "Midlothian Council",
    councilSlug: "midlothian",
    councilCode: "S12000019",
    lastReviewedOn: "2026-08-02",
    summary:
      "Midlothian plans to spend £340.7m on everyday services in 2026/27 and needed another £13.3m in its plan. Its 2024/25 audit recorded an unplanned £3m overspend, paid for with money set aside. The audit also says some change projects need to move faster.",
    budgetContext: budgetFigures({
      slug: "midlothian",
      councilName: "Midlothian Council",
      budget: 340.7,
      gap: 13.3,
      savings: 0.6,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "midlothian-unplanned-overspend-2024-25",
        title: "An unplanned £3m overspend was covered with money set aside",
        reportDate: "2025-10-15",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit says Midlothian ended the year £3m over budget. Money set aside for future use covered it. The report also says the remaining service-change work needs to speed up.",
        recommendation:
          "Finish the remaining change projects and show publicly how they reduce costs or improve services.",
        status: "in-progress",
        sourceIds: sourceIdList("midlothian-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "midlothian-complete-transformation",
        title: "Finish the remaining service changes",
        commitment:
          "Complete the remaining service-change projects and report what changed for residents and the budget.",
        announcedOn: "2025-10-15",
        owner: "Midlothian Council",
        status: "in-progress",
        currentEvidence:
          "The audit says projects remained to be completed. This page does not claim that the work is now finished.",
        sourceIds: sourceIdList("midlothian-audit-2024-25"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "midlothian-budget-2026-27",
        "How the council budget is allocated",
        "https://www.midlothian.gov.uk/info/606/council_tax/695/how_the_council_budget_is_allocated",
        "The council's 2026/27 spending on everyday services, funding sources and service shares.",
        "2026",
      ),
      auditSource(
        "midlothian-audit-2024-25",
        "Midlothian Council annual audit 2024/25",
        "https://audit.scot/uploads/2025-10/aar_2425_midlothian.pdf",
        "The unplanned overspend, money set aside and service-change findings in the external audit.",
        "2025-10-15",
      ),
    ],
    knownGaps: [
      "The £340.7m figure is spending on everyday services. It is not every pound the council receives or spends on building projects.",
      "A full list of service-change projects, deadlines and results still needs to be added.",
      "Service goals and actual results for children, housing, social care and roads have not yet been checked here.",
    ],
  },
  {
    councilName: "Moray Council",
    councilSlug: "moray",
    councilCode: "S12000020",
    lastReviewedOn: "2026-08-02",
    summary:
      "Moray planned to spend £311.7m on everyday services in 2026/27 and needed another £10.6m in its plan. A review found that service changes had been too slow and that relying on savings not yet identified or money set aside could not continue. Those findings are dated, so current progress needs checking.",
    budgetContext: budgetFigures({
      slug: "moray",
      councilName: "Moray Council",
      budget: 311.7,
      gap: 10.6,
      savings: 4.2,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "moray-transformation-too-slow",
        title: "Service changes were too slow",
        reportDate: "2024-03-28",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "A review said Moray's service-change work had moved too slowly. It warned that relying on savings not yet identified and money set aside was not a lasting answer to the money problem.",
        recommendation:
          "Set clear milestones, name the savings, and report what has actually changed each year.",
        status: "in-progress",
        sourceIds: sourceIdList("moray-best-value-2024"),
      },
    ],
    commitments: [
      {
        id: "moray-accelerate-transformation",
        title: "Speed up service changes and name the savings",
        commitment:
          "Show which change projects will close the budget gap, when they will happen and what residents should see.",
        announcedOn: "2024-03-28",
        owner: "Moray Council",
        status: "in-progress",
        currentEvidence:
          "The review called for faster progress. This page has not yet checked a later report that proves the recommendation is complete.",
        sourceIds: sourceIdList("moray-best-value-2024"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "moray-budget-2026-27",
        "Moray Council revenue budget",
        "https://www.moray.gov.uk/council-and-government/budget-and-finance/revenue-budget/",
        "The council's approved 2026/27 everyday-services budget and savings figure.",
        "2026",
      ),
      auditSource(
        "moray-best-value-2024",
        "Best Value: Moray Council",
        "https://audit.scot/publications/best-value-moray-council",
        "The review's findings about the pace of service changes, money set aside and savings not yet identified.",
        "2024-03-28",
      ),
    ],
    knownGaps: [
      "Moray's council budget page and Audit Scotland bulletin use slightly different rounded totals. They should be reconciled against the signed budget papers.",
      "The service-change finding is from 2024. A current progress report is needed before saying whether the problem was fixed.",
      "No service goal and actual comparisons have been added yet.",
    ],
  },
  {
    councilName: "Na h-Eileanan Siar (Comhairle nan Eilean Siar)",
    councilSlug: "na-h-eileanan-siar",
    councilCode: "S12000013",
    lastReviewedOn: "2026-08-02",
    summary:
      "Na h-Eileanan Siar plans £140.8m for everyday services in 2026/27 and needed another £5m in its plan. The council said it balanced the budget with council tax, money set aside and savings. An audit found that a 2023 cyber attack caused long disruption and that some recovery work was still under way.",
    budgetContext: budgetFigures({
      slug: "na-h-eileanan-siar",
      councilName: "Comhairle nan Eilean Siar",
      budget: 140.8,
      gap: 5.0,
      savings: 0.4,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "eilean-siar-cyber-attack-recovery",
        title: "A cyber attack caused long disruption to services",
        reportDate: "2025-11-27",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The audit says the 2023 cyber attack caused severe, long disruption and the loss of nearly all server data. Emergency plans did not expect an attack this large, and some services were still recovering or clearing backlogs two years later.",
        recommendation:
          "Finish the outstanding cyber recommendations and publish realistic dates for the work that is still open.",
        status: "in-progress",
        sourceIds: sourceIdList("eilean-siar-cyber-audit"),
      },
    ],
    commitments: [
      {
        id: "eilean-siar-cyber-improvements",
        title: "Finish the cyber security improvements",
        commitment:
          "Complete the remaining work to protect council systems and keep essential services running during an emergency.",
        announcedOn: "2025-11-27",
        owner: "Comhairle nan Eilean Siar",
        status: "in-progress",
        currentEvidence:
          "The audit says some recommendations were still outstanding. This record does not claim that the council has completed them.",
        sourceIds: sourceIdList("eilean-siar-cyber-audit"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "eilean-siar-budget-2026-27",
        "Comhairle nan Eilean Siar budget 2026/27",
        "https://www.cne-siar.gov.uk/news/2026/comhairle-nan-eileanan-siar-budget-202627",
        "The council's initial money problem and the council tax, money set aside and savings used to balance its 2026/27 budget.",
        "2026",
      ),
      auditSource(
        "eilean-siar-cyber-audit",
        "Cyber attack affecting operations and services: the 2023/24 audit of Comhairle nan Eilean Siar",
        "https://audit.scot/news/cyber-attack-on-comhairle-nan-eilean-siar-highlights-risks-to-all-councils",
        "The impact of the 2023 cyber attack, the continuity-planning weaknesses and the open cyber recommendations.",
        "2025-11-27",
      ),
    ],
    knownGaps: [
      "The extra money needed is a planning figure. Final 2026/27 spending figures are needed before comparing it with what was actually spent.",
      "The cyber audit gives a national summary. A council action list with each open recommendation and date still needs to be added.",
      "No local service goals and actual results have been checked yet.",
    ],
  },
  {
    councilName: "North Ayrshire Council",
    councilSlug: "north-ayrshire",
    councilCode: "S12000021",
    lastReviewedOn: "2026-08-03",
    summary:
      "North Ayrshire’s 2026/27 budget is £486.1m. The plan needed an extra £17.8m to pay for planned services. The 2024/25 accounts passed their final check, but £82.374m of corrections were needed before they were signed off. Seven checked goals were missed. The council also reports a fall in child poverty. The council says it must find £46.7m more by 2027/28. There is £38.5m of road repairs waiting to be done. And council-funded adult care is now only for people at critical risk.",
    budgetContext: [
      ...budgetFigures({
        slug: "north-ayrshire",
        councilName: "North Ayrshire Council",
        budget: 486.1,
        gap: 17.8,
        savings: 0.2,
      }),
      {
        id: "north-ayrshire-other-budget-measures-2026-27",
        label: "Money the budget does not explain",
        value: 17.5,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish:
          "The budget lists £17.5m as ‘other measures’. It does not say exactly what this money will pay for or where it will come from. In real life, this is an unexplained part of the plan — not proof that the money has already been found.",
        sourceIds: [auditBudgetBulletin.id],
      },
    ],
    outcomes: [
      {
        id: "north-ayrshire-poverty-attainment",
        service: "Children in poorer areas",
        measure: "Exam points for pupils in poorer areas",
        period: "2023/24, latest figure in the 2024/25 audit",
        target: "714 points",
        actual: "664.3 points",
        status: "missed",
        variance: "49.7 points below goal",
        explanation:
          "This score adds up points from school qualifications. It looks at pupils in one in five neighbourhoods facing the most hardship.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-all-leavers-attainment",
        service: "School leavers",
        measure: "Exam points for pupils leaving school",
        period: "2023/24, latest figure in the 2024/25 audit",
        target: "908 points",
        actual: "840.8 points",
        status: "missed",
        variance: "67.2 points below goal",
        explanation: "This score adds up points from school qualifications for every pupil who left school.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-care-experienced-attainment",
        service: "Young people who have been in care",
        measure: "Exam points for young people who have been in care",
        period: "Latest figure in the 2024/25 audit",
        target: "465 points",
        actual: "355 points",
        status: "missed",
        variance: "110 points below goal",
        explanation: "This score adds up points from school qualifications for pupils who have been in care.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-new-homes",
        service: "Housing",
        measure: "New homes built",
        period: "2024/25",
        target: "396 homes",
        actual: "371 homes",
        status: "missed",
        variance: "25 homes below goal",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-low-carbon-capacity",
        service: "Clean energy",
        measure: "Clean energy on the council estate",
        period: "2024/25",
        target: "28,499 kW",
        actual: "17,630 kW",
        status: "missed",
        variance: "10,869 kW below goal",
        explanation: "This measures how much clean heat and electricity the council’s buildings could produce at once. kW is the unit used to measure that power.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-recycling",
        service: "Waste",
        measure: "Household waste recycled",
        period: "2024/25",
        target: "56%",
        actual: "52.8%",
        status: "missed",
        variance: "3.2 percentage points below goal",
        comparisonNote:
          "The fall was partly linked to new SEPA rules sending upholstered domestic seating for incineration rather than recycling.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-sickness-absence",
        service: "Council staff",
        measure: "Days council staff were off sick",
        period: "2024/25",
        target: "10.47 days",
        actual: "12.76 days",
        status: "missed",
        variance: "2.29 days above goal",
        explanation: "This is the average number of work days lost to sickness for one full-time staff member.",
        comparisonNote:
          "Teacher and waste-service cover contributed about £2.6m of extra cost. Waste Services reported 30.42 days lost per employee.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-child-poverty",
        service: "Child poverty",
        measure: "Children living in poverty after rent or mortgage costs",
        period: "2023/24",
        target: "A sustained decrease",
        actual: "24.3%, down from 29.2% in 2022/23",
        status: "not-comparable",
        comparisonNote:
          "This is a one-year fall reported by the council using End Child Poverty Coalition figures. It is encouraging, but one fall does not prove a sustained trend or show what caused it.",
        sourceIds: sourceIdList("north-ayrshire-annual-performance-2024-25"),
      },
      {
        id: "north-ayrshire-money-matters",
        service: "Money help",
        measure: "People helped and money gained",
        period: "2024/25",
        target: "No goal published",
        actual: "5,842 referrals; £21.5m financial gains",
        status: "not-comparable",
        explanation: "This counts people sent for help and the money the service says it helped them gain.",
        comparisonNote:
          "A reported financial gain is not the same as new council spending. The report does not publish a goal or show the average gain per household.",
        sourceIds: sourceIdList("north-ayrshire-annual-performance-2024-25"),
      },
    ],
    auditFindings: [
      {
        id: "north-ayrshire-accounts-adjustments-2024-25",
        title: "The books passed the final check — but £82.374m had to be fixed",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The final accounts were judged to show a true and fair picture. Before sign-off, auditors found £82.374m of errors in the draft accounts. Most were in the numbers for buildings, equipment and leased items. The council corrected them. The recorded value of the council’s homes was reduced by a further £33.673m for the previous year.",
        recommendation:
          "Check the figures for buildings, equipment and council homes more carefully before the accounts are published.",
        managementResponse:
          "The council accepted this and said it would improve its year-end checks during 2025/26.",
        implementationDate: "2026-03",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-structural-funding-gap",
        title: "The council says it needs to find £46.7m more",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The council’s plan says it needs £46.7m more by 2027/28. £18.2m of that pressure comes from health and social care. Savings alone will not be enough: the plan also mentions changing services, cutting some services, raising income and using money set aside for the future.",
        recommendation:
          "Show how much each change is meant to save, and compare that with the £46.7m still needed.",
        managementResponse:
          "The council said its plan would show the changes to services, extra income and use of money set aside for the future.",
        implementationDate: "2029-03",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-adult-social-care-threshold",
        title: "Council-funded care is now limited to people judged at critical risk",
        reportDate: "2026-06-11",
        publisher: "Accounts Commission",
        severity: "grade-1",
        finding:
          "North Ayrshire moved to a ‘critical only’ rule for council-funded adult care. In everyday words, people may now need to be at very serious risk before the council will pay for help. The change is linked to more people needing care, higher costs and pressure on the budget.",
        status: "not-verified",
        sourceIds: sourceIdList("audit-scotland-council-budgets-2026-27"),
      },
      {
        id: "north-ayrshire-roads-backlog",
        title: "Road repair bill reaches £38.5m",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "North Ayrshire has a £38.5m bill for road repairs waiting to be done. In 2025, 30.6% of its roads were marked for possible treatment — almost 1 in 3. Keeping roads at about the same standard needs about £5.5m each year. The 2025/26 budget was £5.3m before clearing the backlog.",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-ardrossan-campus-cost",
        title: "The Ardrossan Campus could cost £27.8m more than planned",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "observation",
        finding:
          "The planned final cost rose from £86.8m to £114.6m. That is £27.8m, or 32%, above the original budget. The approved response included up to £16m in extra borrowing. That could add about £912,000 a year to council running costs.",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-performance-criteria",
        title: "The council said 45 of 46 promises were on track — but the rules were unclear",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The council said 45 of 46 Council Plan actions were on track. The review found that it had not set the pass rules first. In a sample of eight actions, two did not show enough evidence to prove why they were marked on track.",
        recommendation:
          "Set the rules before judging whether a promise has been met. Make the next steps specific and measurable.",
        managementResponse:
          "The council’s new strategy says it will use clear next steps. Its public dashboard is still being rebuilt, so this is not counted as finished.",
        implementationDate: "2026-09",
        status: "in-progress",
        sourceIds: sourceIdList(
          "north-ayrshire-audit-2024-25",
          "north-ayrshire-performance-strategy-2023-28",
          "north-ayrshire-council-performance",
        ),
      },
      {
        id: "north-ayrshire-transformation-reporting",
        title: "People cannot yet see what the big changes saved",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "At the time of the audit, North Ayrshire did not publish the full savings or service changes from its big change programme in one place. People therefore could not see what a promised saving changed in practice.",
        recommendation:
          "Show people the savings planned, the savings made and what changed for services.",
        managementResponse:
          "The council said it would publish more information. Its dashboard is still being rebuilt.",
        implementationDate: "2026-09",
        status: "in-progress",
        sourceIds: sourceIdList(
          "north-ayrshire-audit-2024-25",
          "north-ayrshire-performance-strategy-2023-28",
          "north-ayrshire-council-performance",
        ),
      },
      {
        id: "north-ayrshire-sickness-costs",
        title: "Staff sickness cost about £2.6m to cover",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "Staff were off sick for an average of 12.76 days. The goal was 10.47 days. Cover for teachers and waste workers cost about £2.6m. Waste Services lost 30.42 days per employee.",
        recommendation:
          "Check whether the absence plan is reducing sick days where cover costs the most.",
        managementResponse:
          "The council reported better results and said it improved tracking and manager training. Sick days were still above the goal.",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-dormant-trusts",
        title: "Seven charity funds sat unused for at least three years",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "observation",
        finding:
          "Seven council-run charity funds had not been used for at least three years. There was no clear plan to put them back to work. The council said it would keep advertising the funds and review the issue during the 2025/26 audit.",
        status: "in-progress",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "north-ayrshire-review-capital-accounting",
        title: "Check the accounts and property numbers",
        commitment:
          "Check the accounts and property values more carefully after the large corrections.",
        announcedOn: "2025-09-26",
        dueBy: "2026-03",
        owner: "North Ayrshire Council",
        status: "not-verified",
        currentEvidence:
          "The council accepted this and said it would do the work during 2025/26. An independent check that it is finished is not linked here.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-performance-rules",
        title: "Set clear rules for calling a promise finished",
        commitment:
          "Decide what success looks like before saying a Council Plan action is finished. Use clear next steps and dates.",
        announcedOn: "2025-09-26",
        dueBy: "2025-11-20",
        owner: "North Ayrshire Council Corporate Policy and Performance Team",
        status: "in-progress",
        currentEvidence:
          "The council’s new strategy says it will use clear next steps. This shows a process change, not proof that every promise has been checked.",
        sourceIds: sourceIdList(
          "north-ayrshire-audit-2024-25",
          "north-ayrshire-performance-strategy-2023-28",
        ),
      },
      {
        id: "north-ayrshire-public-transformation-reporting",
        title: "Show people what the changes saved",
        commitment:
          "Publish the savings planned, the savings actually made and what changed for services.",
        announcedOn: "2025-09-26",
        dueBy: "2026-09-30",
        owner: "North Ayrshire Council Financial Services",
        status: "in-progress",
        currentEvidence:
          "The council said it would publish more information. Its dashboard is still being rebuilt.",
        sourceIds: sourceIdList(
          "north-ayrshire-audit-2024-25",
          "north-ayrshire-performance-strategy-2023-28",
          "north-ayrshire-council-performance",
        ),
      },
      {
        id: "north-ayrshire-joint-workforce",
        title: "See whether councils can share work",
        commitment:
          "Check whether shared services or staff arrangements could protect services or save money.",
        announcedOn: "2024-09",
        dueBy: "2026-03",
        owner: "North Ayrshire Council and partner organisations",
        status: "not-verified",
        currentEvidence:
          "The audit recorded discussions with East and South Ayrshire Councils, but this sample does not claim that a shared arrangement was completed.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-workforce-dashboard",
        title: "Show how staff planning affects services",
        commitment:
          "Publish a simple dashboard showing whether staffing levels and planning are improving services.",
        announcedOn: "2024-09",
        dueBy: "2025-09-30",
        owner: "North Ayrshire Council",
        status: "not-verified",
        currentEvidence:
          "The audit says this was still unfinished in 2024/25. A later source is needed.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
      {
        id: "north-ayrshire-dormant-trusts-action",
        title: "Put unused charity funds back to work",
        commitment:
          "Make a clear plan for managing, advertising and using the funds for local public benefit.",
        announcedOn: "2023",
        owner: "North Ayrshire Council as trustee",
        status: "in-progress",
        currentEvidence:
          "The audit still listed this as ongoing and said it would be reviewed in the 2025/26 audit.",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "north-ayrshire-budget-2026-27",
        "North Ayrshire Council sets its 2026/27 budget",
        "https://www.north-ayrshire.gov.uk/news/north-ayrshire-council-sets-202627-budget",
        "The council's budget decision, council tax increase and Scottish Government grant change.",
        "2026",
      ),
      auditSource(
        "north-ayrshire-audit-2024-25",
        "North Ayrshire Council annual audit 2024/25",
        "https://audit.scot/uploads/2025-09/aar_2425_north_ayrshire.pdf",
        "The audited accounts, independent checks, performance results, roads backlog, building-project risks and agreed action plan.",
        "2025-09-26",
      ),
      councilSource(
        "north-ayrshire-annual-performance-2024-25",
        "North Ayrshire Council Annual Performance Report 2024/25",
        "https://www.north-ayrshire.gov.uk/Document-library/annual-performance-report-2024-2025.pdf",
        "The council’s own headline facts, child-poverty figure, Money Matters result and reported service achievements.",
        "2025",
      ),
      councilSource(
        "north-ayrshire-annual-accounts-2024-25",
        "North Ayrshire Council Audited Annual Accounts 2024/25",
        "https://www.north-ayrshire.gov.uk/Document-library/annual-accounts-2024-to-2025.pdf",
        "The council’s published financial statements, performance summary and context for how money is shared between services.",
        "2025-09-23",
      ),
      councilSource(
        "north-ayrshire-mid-year-2025-26",
        "Our Council Plan Six Monthly Progress Report: 1 April to 30 September 2025",
        "https://www.north-ayrshire.gov.uk/documents/our-council-plan-six-monthly-progress-report-1-april-2025-to-30-september-2025",
        "The council’s follow-up reporting on independent audit actions and the refreshed performance results available after the annual audit.",
        "2026-01-26",
      ),
      councilSource(
        "north-ayrshire-performance-strategy-2023-28",
        "Performance Management Strategy 2023 to 2028",
        "https://www.north-ayrshire.gov.uk/documents/performance-management-strategy",
        "The council’s revised rules for performance judgements, SMART next steps, dashboards and public reporting actions.",
        "2026-01-08",
      ),
      councilSource(
        "north-ayrshire-council-performance",
        "North Ayrshire Council performance information",
        "https://www.north-ayrshire.gov.uk/council-voting-elections/performance-and-spending/council-performance",
        "The current public performance page, including its statement that the public performance dashboard is being redeveloped.",
      ),
      councilSource(
        "north-ayrshire-lgbf-2025",
        "Local Government Benchmarking Framework Analysis of October 2025 Data Release",
        "https://www.north-ayrshire.gov.uk/documents/local-government-benchmarking-framework-analysis-of-october-2025-data-release",
        "North Ayrshire’s council-published benchmarking context for housing quality, council-tax collection and other priority indicators.",
        "2026-01-27",
      ),
    ],
    knownGaps: [
      "The council spent £17m less than planned in 2024/25. That does not tell us whether services were good. The audit explains some of the differences, but we still do not have a full explanation for each service.",
      "The seven missed goals come from the council’s own performance list and are repeated in the independent audit. The rules for calling actions ‘on track’ were not clear enough.",
      "We do not yet know how many people lost help, waited longer or were affected by the critical-only care rule.",
      "The audit covers 2024/25. We still need the final 2025/26 spending figures, the result of the budget changes and the latest outside checks.",
      "The council says its public performance dashboard is being rebuilt. A plan to publish information is not proof that every promise is finished.",
      "No individual councillor is attributed with a service result here. Council decisions, officer accountability and national funding responsibilities need separate evidence.",
    ],
  },
  {
    councilName: "North Lanarkshire Council",
    councilSlug: "north-lanarkshire",
    councilCode: "S12000050",
    lastReviewedOn: "2026-08-02",
    // Leads with what went wrong, because that is what the audit actually
    // found. Every figure here is on the page below it: the 28 measures and
    // the untracked project benefits come from the 2024/25 annual audit, the
    // per-pupil spend from the national benchmarking file, the £19.3m from
    // the Audit Scotland budget bulletin.
    summary:
      "Half of North Lanarkshire's own 28 progress measures did not improve. The auditors also said the council could not show what its change projects actually achieved. It spends about £670 less on each primary school pupil than the Scottish average. And it said it needed another £19.3m to pay for services this year.",
    budgetContext: budgetFigures({
      slug: "north-lanarkshire",
      councilName: "North Lanarkshire Council",
      budget: 1182.6,
      gap: 19.3,
      savings: 9.2,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "north-lanarkshire-performance-not-easy-to-see",
        title: "The public cannot easily see all the progress measures",
        reportDate: "2025-10-15",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-2",
        finding:
          "The 2024/25 audit says 50% of North Lanarkshire's 28 health-check measures had improved and 50% had not. It also says the summary was hard for the public to find and the council did not yet track the money or service benefit of each project.",
        recommendation:
          "Publish the 28 measures in one easy-to-read place and show the money and service benefit for each major change project.",
        status: "in-progress",
        sourceIds: sourceIdList("north-lanarkshire-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "north-lanarkshire-publish-health-checks",
        title: "Make progress and project benefits easy to check",
        commitment:
          "Publish the 28 health-check measures and track the money and service benefit of each change project.",
        announcedOn: "2025-10-15",
        owner: "North Lanarkshire Council",
        status: "in-progress",
        currentEvidence:
          "The audit says a benefits tool was being developed and public reporting was due for review. This record does not claim that the new system is complete.",
        sourceIds: sourceIdList("north-lanarkshire-audit-2024-25"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "north-lanarkshire-budget-2026-27",
        "Council budget 2026/27",
        "https://www.northlanarkshire.gov.uk/your-community/council-budget-202627",
        "The council's 2026/27 budget decision, council tax and investment announcements.",
        "2026",
      ),
      auditSource(
        "north-lanarkshire-audit-2024-25",
        "North Lanarkshire Council annual audit 2024/25",
        "https://audit.scot/uploads/2025-10/aar_2425_north_lanarkshire.pdf",
        "The 28 health-check measures, change-project benefit tracking and public performance-reporting findings.",
        "2025-10-15",
      ),
    ],
    knownGaps: [
      "The budget figure is the national everyday-services measure. A signed council budget table should be linked when the exact table is available.",
      "The 50/50 result is for the period of The Plan for North Lanarkshire and is not a complete scorecard for every service.",
      "No goal-and-result comparisons for individual services have been added yet.",
    ],
  },
  {
    councilName: "Orkney Islands Council",
    councilSlug: "orkney-islands",
    councilCode: "S12000023",
    lastReviewedOn: "2026-08-02",
    summary:
      "Orkney planned to spend £153.3m on everyday services in 2026/27 and needed another £21.3m in its plan. The council says about 78% of its funding is early Scottish Government support and that up to £20m may come from money set aside. The review called for a clearer long-term plan.",
    budgetContext: budgetFigures({
      slug: "orkney-islands",
      councilName: "Orkney Islands Council",
      budget: 153.3,
      gap: 21.3,
      savings: 0.2,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "orkney-long-term-financial-plan",
        title: "A long-term funding gap needs a clear plan",
        reportDate: "2024-01-30",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The review found that Orkney provides high-quality services but has a large gap between what services cost and the money available. It called for urgent action on service changes, building projects and climate change, and warned against unplanned use of money set aside.",
        recommendation:
          "Publish a clear plan showing the money still needed, the role of money set aside and the changes residents should expect.",
        status: "in-progress",
        sourceIds: sourceIdList("orkney-best-value-2024"),
      },
    ],
    commitments: [
      {
        id: "orkney-reserves-transformation-plan",
        title: "Set out the money and service-change plan",
        commitment:
          "Show how money set aside will be used, what service changes will save, and how essential island services will be protected.",
        announcedOn: "2024-01-30",
        owner: "Orkney Islands Council",
        status: "in-progress",
        currentEvidence:
          "The review called for a clear plan. The 2026/27 budget explains the use of money set aside, but this page has not checked every longer-term action.",
        sourceIds: sourceIdList("orkney-best-value-2024", "orkney-budget-2026-27"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "orkney-budget-2026-27",
        "Budget setting for 2026/27: an explainer",
        "https://www.orkney.gov.uk/latest-news/budget-setting-for-20262027-explainer",
        "The council's 2026/27 budget, early Scottish Government funding, money set aside and saving proposals.",
        "2026",
      ),
      auditSource(
        "orkney-best-value-2024",
        "Orkney Islands Council delivers excellent services but must focus on the future",
        "https://audit.scot/news/orkney-islands-council-delivers-excellent-services-but-must-focus-on-the-future",
        "The review's findings about the long-term money problem, service changes and money set aside.",
        "2024-01-30",
      ),
    ],
    knownGaps: [
      "The £20m reserve figure is a maximum planned draw, not proof that the full amount will be spent.",
      "The review finding is dated. A current follow-up report is needed before calling the long-term plan complete.",
      "Island-specific service goals and actual results are not yet included.",
    ],
  },
  {
    councilName: "Perth and Kinross Council",
    councilSlug: "perth-and-kinross",
    councilCode: "S12000048",
    lastReviewedOn: "2026-08-02",
    summary:
      "Perth and Kinross planned to spend £533.8m on everyday services in 2026/27 and needed another £20.7m in its plan. Its audit says a plan covering 2024/25 to 2030/31 showed £80.4m still needed, with money set aside used to balance budgets. This page needs more service results before judging what residents received for the money.",
    budgetContext: budgetFigures({
      slug: "perth-and-kinross",
      councilName: "Perth and Kinross Council",
      budget: 533.8,
      gap: 20.7,
      savings: 8.8,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "perth-kinross-medium-term-funding-gap",
        title: "The six-year plan shows £80.4m still needed",
        reportDate: "2025-12-18",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit says Perth and Kinross's six-year plan showed £80.4m still needed between 2024/25 and 2030/31. The council planned to use money set aside and said service changes alone would not solve the longer-term problem.",
        recommendation:
          "Keep the long-term money still needed, use of money set aside and savings plan visible, with a clear yearly update on what has actually happened.",
        status: "in-progress",
        sourceIds: sourceIdList("perth-kinross-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "perth-kinross-track-transformation-savings",
        title: "Track savings from service changes and money set aside",
        commitment:
          "Report each year which savings came from service changes and how much money set aside was used to balance the budget.",
        announcedOn: "2025-12-18",
        owner: "Perth and Kinross Council",
        status: "in-progress",
        currentEvidence:
          "The audit sets out the long-term money still needed and use of money set aside. This page has not checked a later report that proves the planned savings will keep happening.",
        sourceIds: sourceIdList("perth-kinross-audit-2024-25"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "perth-kinross-budget-2026-27",
        "Council budget and expenditure",
        "https://www.pkc.gov.uk/article/14766/Council-budget",
        "The council's budget and expenditure information page.",
        "2026",
      ),
      auditSource(
        "perth-kinross-audit-2024-25",
        "Perth and Kinross Council annual audit 2024/25",
        "https://audit.scot/uploads/2025-12/aar_2425_perth_kinross.pdf",
        "The long-term money still needed, use of money set aside and service-change findings.",
        "2025-12-18",
      ),
    ],
    knownGaps: [
      "The £533.8m figure is the national everyday-services measure. It should be paired with the council's signed 2026/27 budget table.",
      "The £80.4m gap covers six years and must not be presented as one year's overspend.",
      "No local service goal and actual comparisons have been added yet.",
    ],
  },
  {
    councilName: "Renfrewshire Council",
    councilSlug: "renfrewshire",
    councilCode: "S12000038",
    lastReviewedOn: "2026-08-02",
    summary:
      "Renfrewshire planned to spend £630.9m on everyday services in 2026/27 and needed another £5m in its plan. The council's own page gives a £622.794m budget figure and a £337m five-year housing plan, so the different totals need explaining rather than silently merged. The audit warns that the money problem over the next few years could put services at risk.",
    budgetContext: budgetFigures({
      slug: "renfrewshire",
      councilName: "Renfrewshire Council",
      budget: 630.9,
      gap: 5.0,
      savings: 2.4,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "renfrewshire-recurring-financial-gap",
        title: "The money problem could put services at risk",
        reportDate: "2026-03-18",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit says Renfrewshire faces a growing, repeating money problem and may need to use money set aside over the next few years. It says this makes it harder for the council to keep services going safely for the long term.",
        recommendation:
          "Set out the full savings plan for the next few years and report the result of each saving, rather than only reporting problems after spending goes over budget.",
        status: "in-progress",
        sourceIds: sourceIdList("renfrewshire-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "renfrewshire-housing-investment",
        title: "Deliver the five-year housing investment plan",
        commitment:
          "Deliver the planned £337m five-year housing investment and publish progress against the work and funding each year.",
        announcedOn: "2026-02",
        dueBy: "2031",
        owner: "Renfrewshire Council",
        status: "planned",
        currentEvidence:
          "The council has announced the plan. This record does not yet verify how much work or funding has been delivered.",
        sourceIds: sourceIdList("renfrewshire-budget-2026-27"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "renfrewshire-budget-2026-27",
        "Council budget 2026/27",
        "https://www.renfrewshire.gov.uk/council-and-elections/budget-and-performance/council-budget/council-budget-2026-2027",
        "The council's 2026/27 budget and five-year housing investment announcement.",
        "2026-02",
      ),
      auditSource(
        "renfrewshire-audit-2024-25",
        "Renfrewshire Council annual audit 2024/25",
        "https://audit.scot/uploads/2026-03/aar_2425_renfrewshire.pdf",
        "The money problem over the next few years, risk to money set aside and service sustainability findings.",
        "2026-03-18",
      ),
    ],
    knownGaps: [
      "Renfrewshire's council page and the national budget bulletin use different totals. The signed budget papers need to explain whether this is because they count different things or round the numbers differently.",
      "The housing investment plan is an announcement, not proof that work has been completed.",
      "No service goal and actual comparisons have been added yet.",
    ],
  },
];

/** All non-Glasgow starter records ready to merge with the Glasgow record. */
export const additionalCouncilAccountabilityRecords = records;

/** Alias with a descriptive name for callers that only want this module. */
export const councilAccountabilityIRRecords = additionalCouncilAccountabilityRecords;

export function getAdditionalCouncilAccountability(slug: string) {
  return additionalCouncilAccountabilityRecords.find((record) => record.councilSlug === slug);
}

export const getCouncilAccountabilityIR = getAdditionalCouncilAccountability;
