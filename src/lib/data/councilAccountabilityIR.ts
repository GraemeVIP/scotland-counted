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
    "The general fund revenue budget, reported 2026/27 budget gap, approved savings and other measures for each council.",
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
    label: "Money planned for everyday council services",
    value: budget,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    plainEnglish: `Audit Scotland lists a ${money(budget)} general fund budget for ${councilName} in 2026/27. This is the money planned for everyday council services.`,
    sourceIds: [auditBudgetBulletin.id],
  },
  {
    id: `${slug}-projected-budget-gap-2026-27`,
    label: "Projected gap in the 2026/27 budget",
    value: gap,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    qualifier: "projected",
    plainEnglish: `The same bulletin lists a projected ${money(gap)} gap. A gap is a shortfall the council says it must cover with savings, extra income, reserves or other measures. It is not money already missing from a bank account.`,
    sourceIds: [auditBudgetBulletin.id],
  },
  {
    id: `${slug}-approved-savings-2026-27`,
    label: "Approved savings listed for 2026/27",
    value: savings,
    unit: "million",
    currency: "GBP",
    period: "2026/27",
    plainEnglish: `Audit Scotland lists ${money(savings)} of approved savings. This record does not assume every saving has been delivered; the final outturn needs a later check.`,
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
      "Inverclyde has a planned day-to-day budget of £276.6m for 2026/27 and a projected £4.0m gap. The council says it is using savings and other changes to close the gap. The 2024/25 audit says most planned savings were delivered, but a small amount was still outstanding.",
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
          "The 2024/25 external audit report says Inverclyde agreed £3.4m of savings and delivered all but £0.07m. It also flags pressure in the capital programme and high financing costs.",
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
          "The 2026/27 budget sets out savings and other measures. A final outturn has not been checked for this record.",
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
      "A service-by-service list of the 2026/27 savings and their final outturn still needs to be added.",
      "This starter record does not yet show council targets and actual results for homelessness, education, roads or social care.",
      "The audit finding is dated. A newer follow-up source is needed before calling the outstanding savings complete or missed.",
    ],
  },
  {
    councilName: "Midlothian Council",
    councilSlug: "midlothian",
    councilCode: "S12000019",
    lastReviewedOn: "2026-08-02",
    summary:
      "Midlothian plans to spend £340.7m on day-to-day services in 2026/27 and reports a projected £13.3m gap. Its 2024/25 audit recorded an unplanned £3m overspend, paid for from reserves. The audit also says some change projects need to move faster.",
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
        title: "An unplanned overspend was covered with reserves",
        reportDate: "2025-10-15",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit report says Midlothian ended the year with an unplanned £3m overspend. Reserves were used to cover it. The report also says the remaining transformation work needs to speed up.",
        recommendation:
          "Finish the remaining change projects and show publicly how they reduce costs or improve services.",
        status: "in-progress",
        sourceIds: sourceIdList("midlothian-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "midlothian-complete-transformation",
        title: "Finish the remaining transformation work",
        commitment:
          "Complete the remaining transformation projects and report what changed for residents and the budget.",
        announcedOn: "2025-10-15",
        owner: "Midlothian Council",
        status: "in-progress",
        currentEvidence:
          "Audit Scotland says projects remained to be completed. This record does not claim that the work is now finished.",
        sourceIds: sourceIdList("midlothian-audit-2024-25"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "midlothian-budget-2026-27",
        "How the council budget is allocated",
        "https://www.midlothian.gov.uk/info/606/council_tax/695/how_the_council_budget_is_allocated",
        "The council's 2026/27 net revenue spending, funding sources and service allocations.",
        "2026",
      ),
      auditSource(
        "midlothian-audit-2024-25",
        "Midlothian Council annual audit 2024/25",
        "https://audit.scot/uploads/2025-10/aar_2425_midlothian.pdf",
        "The unplanned overspend, reserves and transformation findings in the external audit.",
        "2025-10-15",
      ),
    ],
    knownGaps: [
      "The £340.7m figure is net revenue spending. It is not the same as every pound the council receives or spends across capital projects.",
      "A full list of transformation projects, deadlines and results still needs to be added.",
      "Service targets and actual results for children, housing, social care and roads have not yet been checked here.",
    ],
  },
  {
    councilName: "Moray Council",
    councilSlug: "moray",
    councilCode: "S12000020",
    lastReviewedOn: "2026-08-02",
    summary:
      "Moray's 2026/27 day-to-day budget is listed as £311.7m, with a projected £10.6m gap. An Accounts Commission review said transformation had been too slow and that relying on unknown savings and reserves could not continue. Those are dated findings, so current progress needs checking.",
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
        title: "The Accounts Commission said change was too slow",
        reportDate: "2024-03-28",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "A Best Value report said Moray's transformation work had moved too slowly. It warned that relying on savings that had not been identified and on reserves was not a lasting answer to the budget pressure.",
        recommendation:
          "Set clear milestones, name the savings, and report what has actually changed each year.",
        status: "in-progress",
        sourceIds: sourceIdList("moray-best-value-2024"),
      },
    ],
    commitments: [
      {
        id: "moray-accelerate-transformation",
        title: "Speed up transformation and name the savings",
        commitment:
          "Show which change projects will close the budget gap, when they will happen and what residents should see.",
        announcedOn: "2024-03-28",
        owner: "Moray Council",
        status: "in-progress",
        currentEvidence:
          "The Accounts Commission called for faster progress. This record has not yet checked a later report that proves the recommendation is complete.",
        sourceIds: sourceIdList("moray-best-value-2024"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "moray-budget-2026-27",
        "Moray Council revenue budget",
        "https://www.moray.gov.uk/council-and-government/budget-and-finance/revenue-budget/",
        "The council's approved 2026/27 revenue budget and savings figure.",
        "2026",
      ),
      auditSource(
        "moray-best-value-2024",
        "Best Value: Moray Council",
        "https://audit.scot/publications/best-value-moray-council",
        "The Accounts Commission's findings about the pace of transformation, reserves and unidentified savings.",
        "2024-03-28",
      ),
    ],
    knownGaps: [
      "Moray's council budget page and Audit Scotland bulletin use slightly different rounded totals. They should be reconciled against the signed budget papers.",
      "The transformation finding is from 2024. A current progress report is needed before saying whether the problem was fixed.",
      "No service target and actual comparisons have been added yet.",
    ],
  },
  {
    councilName: "Na h-Eileanan Siar (Comhairle nan Eilean Siar)",
    councilSlug: "na-h-eileanan-siar",
    councilCode: "S12000013",
    lastReviewedOn: "2026-08-02",
    summary:
      "Na h-Eileanan Siar plans £140.8m for day-to-day services in 2026/27 and has a projected £5.0m gap. The council says it balanced the budget with council tax, reserves and savings. An audit found that a 2023 cyber attack caused long disruption and that some recovery work was still under way.",
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
          "Audit Scotland says the 2023 cyber attack caused severe and prolonged disruption and the near-total loss of server data. It says business-continuity plans did not expect an attack of this size and some services were still recovering or clearing backlogs two years later.",
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
        "The council's initial deficit and the tax, reserves and savings used to balance its 2026/27 budget.",
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
      "The budget gap is a planning figure. A final 2026/27 outturn is needed before comparing it with what was actually spent.",
      "The cyber audit gives a national summary. A council action list with each open recommendation and date still needs to be added.",
      "No local service targets and actual results have been checked yet.",
    ],
  },
  {
    councilName: "North Ayrshire Council",
    councilSlug: "north-ayrshire",
    councilCode: "S12000021",
    lastReviewedOn: "2026-08-02",
    summary:
      "North Ayrshire has a listed 2026/27 day-to-day budget of £486.1m and a projected £17.8m gap. Its 2024/25 audit recorded a £17m underspend against the budget. An underspend does not prove that services worked well, so the final result needs to be shown beside service results.",
    budgetContext: budgetFigures({
      slug: "north-ayrshire",
      councilName: "North Ayrshire Council",
      budget: 486.1,
      gap: 17.8,
      savings: 0.2,
    }),
    outcomes: [],
    auditFindings: [
      {
        id: "north-ayrshire-underspend-2024-25",
        title: "The council underspent its 2024/25 budget",
        reportDate: "2025-09-26",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "observation",
        finding:
          "The 2024/25 audit report records a £17m underspend against the council's budget. It also says the release of 85 staff delivered about £2.5m. These figures need to be read with service performance, not treated as proof that every service met its target.",
        recommendation:
          "Explain, in plain language, where the underspend came from and what happened to the services and people affected.",
        status: "not-verified",
        sourceIds: sourceIdList("north-ayrshire-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "north-ayrshire-explain-savings",
        title: "Show what the savings changed",
        commitment:
          "Link each major saving to the service change, target and result so residents can see what the money achieved.",
        announcedOn: "2025-09-26",
        owner: "North Ayrshire Council",
        status: "planned",
        currentEvidence:
          "The audit records savings and an underspend, but this starter record does not yet have a service-by-service explanation.",
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
        "https://www.north-ayrshire.gov.uk/Document-library/audit-scotland-annual-audit-report-2024-2025.pdf",
        "The 2024/25 outturn, workforce saving and Best Value findings.",
        "2025-09-26",
      ),
    ],
    knownGaps: [
      "North Ayrshire's signed budget paper gives a different base-budget measure from the Audit Scotland bulletin. The two totals should be reconciled before presenting them as one number.",
      "An underspend can come from delayed work, lower demand, or savings. The detailed outturn is needed before drawing a conclusion.",
      "Service targets and actual results for poverty, housing, education and social care are still missing.",
    ],
  },
  {
    councilName: "North Lanarkshire Council",
    councilSlug: "north-lanarkshire",
    councilCode: "S12000050",
    lastReviewedOn: "2026-08-02",
    summary:
      "North Lanarkshire's listed 2026/27 day-to-day budget is £1,182.6m, with a projected £19.3m gap. Audit Scotland says the council has a transformation programme and good governance, but the public cannot easily see all 28 progress measures or the benefits of each project.",
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
          "The 2024/25 audit says 50% of North Lanarkshire's 28 health-check indicators had improved and 50% had not. It also says the summary was not easy for the public to find and the council did not yet track transformation benefits at project level.",
        recommendation:
          "Publish the 28 indicators in one easy-to-read place and show the money and service benefit for each major transformation project.",
        status: "in-progress",
        sourceIds: sourceIdList("north-lanarkshire-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "north-lanarkshire-publish-health-checks",
        title: "Make progress and project benefits easy to check",
        commitment:
          "Publish the 28 health-check indicators and track the financial and service benefit of each transformation project.",
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
        "The 28 health-check indicators, transformation benefit tracking and public performance-reporting findings.",
        "2025-10-15",
      ),
    ],
    knownGaps: [
      "The budget figure is the Audit Scotland general fund measure. A signed council budget table should be linked when the exact table is available.",
      "The 50/50 indicator result is for the period of The Plan for North Lanarkshire and is not a complete service scorecard.",
      "No target and actual comparisons for individual services have been added yet.",
    ],
  },
  {
    councilName: "Orkney Islands Council",
    councilSlug: "orkney-islands",
    councilCode: "S12000023",
    lastReviewedOn: "2026-08-02",
    summary:
      "Orkney's listed 2026/27 day-to-day budget is £153.3m, with a projected £21.3m gap. The council says about 78% of its funding is provisional Scottish Government support and that up to £20m may be taken from reserves. The Accounts Commission has called for a clearer long-term plan.",
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
          "The Accounts Commission said Orkney provides high-quality services but faces a large gap between costs and funding. It called for urgent action on transformation, capital projects and climate change and warned about unplanned use of reserves.",
        recommendation:
          "Publish a robust plan showing the future gap, the role of reserves and the changes residents should expect.",
        status: "in-progress",
        sourceIds: sourceIdList("orkney-best-value-2024"),
      },
    ],
    commitments: [
      {
        id: "orkney-reserves-transformation-plan",
        title: "Set out the reserves and transformation plan",
        commitment:
          "Show how reserves will be used, what transformation will save, and how essential island services will be protected.",
        announcedOn: "2024-01-30",
        owner: "Orkney Islands Council",
        status: "in-progress",
        currentEvidence:
          "The Accounts Commission called for a robust plan. The 2026/27 budget explains reserve use, but this record has not checked every longer-term action.",
        sourceIds: sourceIdList("orkney-best-value-2024", "orkney-budget-2026-27"),
      },
    ],
    sources: [
      auditBudgetBulletin,
      councilSource(
        "orkney-budget-2026-27",
        "Budget setting for 2026/27: an explainer",
        "https://www.orkney.gov.uk/latest-news/budget-setting-for-20262027-explainer",
        "The council's 2026/27 budget, provisional Scottish Government funding, reserve use and saving proposals.",
        "2026",
      ),
      auditSource(
        "orkney-best-value-2024",
        "Orkney Islands Council delivers excellent services but must focus on the future",
        "https://audit.scot/news/orkney-islands-council-delivers-excellent-services-but-must-focus-on-the-future",
        "The Accounts Commission's findings about the long-term funding gap, transformation and reserves.",
        "2024-01-30",
      ),
    ],
    knownGaps: [
      "The £20m reserve figure is a maximum planned draw, not proof that the full amount will be spent.",
      "The Accounts Commission finding is dated. A current follow-up report is needed before calling the long-term plan complete.",
      "Island-specific service targets and actual results are not yet included.",
    ],
  },
  {
    councilName: "Perth and Kinross Council",
    councilSlug: "perth-and-kinross",
    councilCode: "S12000048",
    lastReviewedOn: "2026-08-02",
    summary:
      "Perth and Kinross has a listed 2026/27 day-to-day budget of £533.8m and a projected £20.7m gap. Its external audit says the medium-term plan showed an £80.4m gap from 2024/25 to 2030/31, with reserves being used to balance budgets. This page needs more service results before judging what residents received for the money.",
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
        title: "The medium-term plan shows a large funding gap",
        reportDate: "2025-12-18",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit report says Perth and Kinross's medium-term plan showed an £80.4m gap between 2024/25 and 2030/31. The council planned to use reserves and said transformation alone would not solve the longer-term problem.",
        recommendation:
          "Keep the long-term gap, reserve use and savings plan visible, with a clear update each year on what has actually been delivered.",
        status: "in-progress",
        sourceIds: sourceIdList("perth-kinross-audit-2024-25"),
      },
    ],
    commitments: [
      {
        id: "perth-kinross-track-transformation-savings",
        title: "Track transformation savings and reserve use",
        commitment:
          "Report each year which savings came from transformation and how much reserve money was used to balance the budget.",
        announcedOn: "2025-12-18",
        owner: "Perth and Kinross Council",
        status: "in-progress",
        currentEvidence:
          "The audit sets out the long-term gap and reserve use. This record has not checked a later report that proves the planned savings are recurring.",
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
        "The medium-term funding gap, reserve use and transformation findings.",
        "2025-12-18",
      ),
    ],
    knownGaps: [
      "The £533.8m figure is the general fund measure in the Audit Scotland bulletin. It should be paired with the council's signed 2026/27 budget table.",
      "The £80.4m gap covers six years and must not be presented as one year's overspend.",
      "No local service target and actual comparisons have been added yet.",
    ],
  },
  {
    councilName: "Renfrewshire Council",
    councilSlug: "renfrewshire",
    councilCode: "S12000038",
    lastReviewedOn: "2026-08-02",
    summary:
      "Renfrewshire's listed 2026/27 day-to-day budget is £630.9m, with a projected £5.0m gap. The council's own page gives a £622.794m budget figure and a £337m five-year housing investment plan, so the different totals need explaining rather than silently merged. Audit Scotland warns that the medium-term gap could put services at risk.",
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
        title: "The medium-term gap is a growing risk to services",
        reportDate: "2026-03-18",
        publisher: "Audit Scotland / Accounts Commission",
        severity: "grade-1",
        finding:
          "The 2024/25 audit report says Renfrewshire faces a growing recurring financial gap and may need to use reserves over the medium term. It says the gap creates an increasing risk to the council's ability to deliver services sustainably.",
        recommendation:
          "Set out the full medium-term savings plan and report the result of each saving, rather than only reporting exceptions when an overspend appears.",
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
        "The medium-term financial gap, reserve risk and service sustainability findings.",
        "2026-03-18",
      ),
    ],
    knownGaps: [
      "Renfrewshire's council page and Audit Scotland bulletin use different budget totals. The signed budget papers need to explain the difference in scope or rounding.",
      "The housing investment plan is an announcement, not proof that work has been completed.",
      "No service target and actual comparisons have been added yet.",
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
