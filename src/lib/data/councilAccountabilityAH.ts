/**
 * Starter accountability records for the 15 councils that are not Glasgow.
 *
 * These records deliberately separate an allocation from spending, and a
 * published audit finding from a claim that a council has fixed it. A blank or
 * "not verified" result is safer than filling a gap with an assumption.
 */

import type {
  AccountabilitySource,
  AuditFinding,
  CouncilAccountabilityRecord,
} from "./councilAccountability";

const REVIEW_DATE = "2026-08-02";

const settlementSource: AccountabilitySource = {
  id: "sg-local-government-settlement-2025-26",
  title: "£15 billion for councils",
  publisher: "Scottish Government",
  kind: "government",
  url: "https://www.gov.scot/news/15-billion-for-councils/",
  publishedOn: "2024-12-12",
  usedFor:
    "The provisional 2025/26 local government settlement table, including each council's allocation and year-on-year change.",
};

const financeSource: AccountabilitySource = {
  id: "sg-local-government-finance-2025-26",
  title: "Local Government 2025-26 Provisional Outturn and 2026-27 Budget Estimates",
  publisher: "Scottish Government",
  kind: "government",
  url: "https://www.gov.scot/publications/local-government-2025-26-provisional-outturn-and-2026-27-budget-estimates/",
  publishedOn: "2026-07-24",
  usedFor:
    "The publication that contains the council finance outturn and budget-estimate data. Service-level comparisons have not yet been extracted into these starter records.",
};

const budgetBulletinSource: AccountabilitySource = {
  id: "audit-scotland-budget-bulletin-2026-27",
  title: "Local government budgets 2026/27",
  publisher: "Audit Scotland / Accounts Commission",
  kind: "audit",
  url: "https://audit.scot/uploads/2026-06/nr_260611_lg_council_budgets.pdf",
  publishedOn: "2026-06-11",
  usedFor:
    "The General Fund revenue budget, budget gap, approved savings and other budget measures reported by each council for 2026/27.",
};

type StarterAudit = {
  id: string;
  title: string;
  url: string;
  reportDate: string;
  severity: AuditFinding["severity"];
  finding: string;
  recommendation?: string;
  status: AuditFinding["status"];
  usedFor: string;
};

type StarterConfig = {
  councilName: string;
  councilSlug: string;
  councilCode: string;
  settlementMillion: number;
  summary: string;
  audit: StarterAudit;
  knownGaps: string[];
};

type CurrentBudget = {
  budget: number;
  gap: number;
  savings: number;
  otherMeasures: number;
};

const currentBudgets: Record<string, CurrentBudget> = {
  "aberdeen-city": { budget: 697.2, gap: 11.0, savings: 3.5, otherMeasures: 11.1 },
  aberdeenshire: { budget: 866.2, gap: 19.2, savings: 9.3, otherMeasures: 10.3 },
  angus: { budget: 388.1, gap: 13.9, savings: 5.3, otherMeasures: 8.6 },
  "argyll-and-bute": { budget: 362.0, gap: 14.9, savings: 6.1, otherMeasures: 8.8 },
  "city-of-edinburgh": { budget: 1534.5, gap: 27.9, savings: 20.0, otherMeasures: 31.3 },
  clackmannanshire: { budget: 181.2, gap: 7.0, savings: 3.6, otherMeasures: 3.4 },
  "dumfries-and-galloway": { budget: 515.8, gap: 12.5, savings: 4.2, otherMeasures: 8.3 },
  "dundee-city": { budget: 521.3, gap: 5.0, savings: 0.8, otherMeasures: 6.6 },
  "east-ayrshire": { budget: 460.2, gap: 9.5, savings: 3.5, otherMeasures: 6.1 },
  "east-dunbartonshire": { budget: 381.8, gap: 23.7, savings: 4.1, otherMeasures: 19.6 },
  "east-lothian": { budget: 379.9, gap: 3.5, savings: 1.4, otherMeasures: 2.1 },
  "east-renfrewshire": { budget: 363.1, gap: 8.7, savings: 3.2, otherMeasures: 5.5 },
  falkirk: { budget: 508.4, gap: 14.5, savings: 10.2, otherMeasures: 7.1 },
  fife: { budget: 1205.3, gap: 3.6, savings: 0.1, otherMeasures: 14.1 },
  highland: { budget: 868.0, gap: 23.4, savings: 5.4, otherMeasures: 18.1 },
};

const money = (value: number) =>
  `£${value.toLocaleString("en-GB", { maximumFractionDigits: 1 })}m`;

const createRecord = ({
  councilName,
  councilSlug,
  councilCode,
  settlementMillion,
  summary,
  audit,
  knownGaps,
}: StarterConfig): CouncilAccountabilityRecord => {
  const currentBudget = currentBudgets[councilSlug];

  if (!currentBudget) {
    throw new Error(`No 2026/27 budget figures configured for ${councilSlug}`);
  }

  const auditSource: AccountabilitySource = {
    id: audit.id,
    title: audit.title,
    publisher: "Audit Scotland / Accounts Commission",
    kind: "audit",
    url: audit.url,
    publishedOn: audit.reportDate,
    usedFor: audit.usedFor,
  };

  const auditFinding: AuditFinding = {
    id: audit.id,
    title: audit.title,
    reportDate: audit.reportDate,
    publisher: "Audit Scotland / Accounts Commission",
    severity: audit.severity,
    finding: audit.finding,
    recommendation: audit.recommendation,
    status: audit.status,
    sourceIds: [audit.id],
  };

  return {
    councilName,
    councilSlug,
    councilCode,
    lastReviewedOn: REVIEW_DATE,
    summary,
    budgetContext: [
      {
        // The route uses this stable id to show the main day-to-day budget in
        // its short answer. The period is kept current at 2026/27.
        id: "day-to-day-funding-2025-26",
        label: "Money planned for everyday council services",
        value: currentBudget.budget,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `Audit Scotland lists a planned budget of ${money(currentBudget.budget)} for ${councilName}'s everyday services in 2026/27. This is a plan, not the final amount spent.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "budget-gap-before-measures",
        label: "Projected shortfall in the 2026/27 budget",
        value: currentBudget.gap,
        unit: "million",
        currency: "GBP",
        period: "2026/27 budget setting",
        qualifier: "projected",
        plainEnglish: `At the time of setting its budget, ${councilName} reported a projected gap of ${money(currentBudget.gap)}. A gap is a shortfall the council planned to cover with measures; it is not money already missing from a bank account.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "approved-savings-2026-27",
        label: "Savings written into the budget",
        value: currentBudget.savings,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `The budget lists ${money(currentBudget.savings)} of approved savings. This record does not assume that every saving has been delivered; the final outturn needs a later check.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "other-budget-measures-2026-27",
        label: "Other ways the budget is being balanced",
        value: currentBudget.otherMeasures,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `The budget lists another ${money(currentBudget.otherMeasures)} of measures. Audit Scotland says this can include council tax, extra income, reserves and other actions, so it is not all a cut to services.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "sg-settlement-2025-26",
        label: "Scottish Government funding allocation",
        value: settlementMillion,
        unit: "million",
        currency: "GBP",
        period: "2025/26",
        qualifier: "projected",
        plainEnglish: `For context, the Scottish Government's provisional 2025/26 table lists ${money(settlementMillion)} for ${councilName}. This is a funding allocation, not proof of what the council finally spent.`,
        sourceIds: [settlementSource.id],
      },
    ],
    outcomes: [
      {
        id: "finance-source-check",
        service: "Council finance",
        measure: "A council budget can be compared with its final outturn",
        period: "2025/26 outturn and 2026/27 estimate",
        target: "A like-for-like council service result",
        actual:
          "The Scottish Government has published the underlying finance publication, but this starter record has not yet extracted this council's service rows.",
        status: "not-verified",
        comparisonNote:
          "This is a clear data gap, not a claim that the council met or missed a service target. The next update should compare the approved budget with the outturn for each service.",
        sourceIds: [financeSource.id],
      },
    ],
    auditFindings: [auditFinding],
    commitments: [],
    sources: [budgetBulletinSource, settlementSource, financeSource, auditSource],
    knownGaps,
  };
};

export const additionalCouncilAccountabilityRecords: CouncilAccountabilityRecord[] = [
  createRecord({
    councilName: "Aberdeen City",
    councilSlug: "aberdeen-city",
    councilCode: "S12000033",
    settlementMillion: 494.9,
    summary:
      "Audit Scotland found that weak checks allowed council-tax refunds worth £1.109m to be paid fraudulently over 17 years. The council was expected to recover the money and continue improvement work; this record does not assume that every action is complete.",
    audit: {
      id: "audit-aberdeen-fraud-2023-24",
      title: "The 2023/24 audit of Aberdeen City Council",
      url: "https://audit.scot/news/%C2%A31-million-fraud-at-aberdeen-city-council-sends-a-warning-across-local-government",
      reportDate: "2025-01-09",
      severity: "grade-1",
      finding:
        "Audit Scotland reported 655 fraudulent council-tax refund payments totalling £1.109m between 2006 and 2023. It said controls existed but were not followed or checked closely enough.",
      recommendation:
        "The council was expected to recover the money and keep working through outstanding improvement actions. The latest completion position needs a fresh check.",
      status: "in-progress",
      usedFor:
        "The number and value of fraudulent council-tax refund payments, the period covered, and the audit's explanation of control failures.",
    },
    knownGaps: [
      "The final 2025/26 spending outturn has not yet been matched to the provisional settlement.",
      "A current list of savings promises, owners and due dates still needs to be added.",
      "The latest status of the outstanding fraud-related improvement actions needs checking.",
    ],
  }),
  createRecord({
    councilName: "Aberdeenshire",
    councilSlug: "aberdeenshire",
    councilCode: "S12000034",
    settlementMillion: 615.3,
    summary:
      "The Accounts Commission describes Aberdeenshire as well run, with services improving, but says the council faces an £81m budget gap over the coming years and has savings that have not yet been delivered.",
    audit: {
      id: "audit-bv-aberdeenshire-2026",
      title: "Best Value: Aberdeenshire Council",
      url: "https://audit.scot/publications/best-value-aberdeenshire-council",
      reportDate: "2026-03-25",
      severity: "grade-1",
      finding:
        "The Accounts Commission said Aberdeenshire faces an £81m budget gap over the coming years and that some planned savings had not been delivered. The gap is a forecast, not money already missing.",
      recommendation:
        "The council needs to turn its savings plans into delivered changes and keep showing residents what changed and what it cost.",
      status: "in-progress",
      usedFor:
        "The projected budget gap, undelivered savings and the report's description of the council as well run with improving services.",
    },
    knownGaps: [
      "The £81m figure is a forecast and needs to be updated when the council publishes a new medium-term position.",
      "Service-by-service targets and results are not yet mapped here.",
      "The council's response and due dates for each Best Value action need to be added.",
    ],
  }),
  createRecord({
    councilName: "Angus",
    councilSlug: "angus",
    councilCode: "S12000041",
    settlementMillion: 287.8,
    summary:
      "Audit Scotland says Angus is well run and works well with partners, but its performance is mixed. It also says the council's plans to balance the budget are not sustainable over the longer term.",
    audit: {
      id: "audit-bv-angus-2026",
      title: "Best Value: Angus Council",
      url: "https://audit.scot/news/angus-council-is-focused-on-the-future",
      reportDate: "2026-06",
      severity: "grade-1",
      finding:
        "Audit Scotland reported a projected £24.5m budget gap. It said planned savings and using reserves cannot be the whole long-term answer, and that the council needs more ambitious service redesign.",
      recommendation:
        "The council should publish a clear route from the projected gap to sustainable services, including which changes will happen and when.",
      status: "in-progress",
      usedFor:
        "The projected £24.5m budget gap, the warning about one-off measures and reserves, and the report's comments on service redesign.",
    },
    knownGaps: [
      "The budget-gap figure is projected and needs a date-stamped update after the next budget review.",
      "A full list of Angus service targets and actual results is not yet extracted.",
      "The council's response to the Best Value recommendations needs to be linked.",
    ],
  }),
  createRecord({
    councilName: "Argyll and Bute",
    councilSlug: "argyll-and-bute",
    councilCode: "S12000035",
    settlementMillion: 259.5,
    summary:
      "The Accounts Commission says Argyll and Bute has an opportunity to close a funding gap of nearly £29m and rethink services. The same review found no significant areas of concern, but said performance reporting needs to be clearer.",
    audit: {
      id: "audit-bv-argyll-bute-2025",
      title: "Best Value: Argyll and Bute Council",
      url: "https://audit.scot/publications/best-value-argyll-and-bute-council",
      reportDate: "2025-04-03",
      severity: "grade-2",
      finding:
        "The review identified a projected funding gap of nearly £29m and said the council must rethink how services are delivered. It also found no significant areas of concern at that review, while asking for clearer corporate planning and performance reporting.",
      recommendation:
        "The council should show residents how its service changes close the gap and publish results in a form people can follow.",
      status: "in-progress",
      usedFor:
        "The projected funding gap, the need for service redesign and clearer performance reporting, and the review's statement that it found no significant areas of concern.",
    },
    knownGaps: [
      "The nearly £29m figure is a forecast and needs to be refreshed against the latest budget.",
      "Current performance measures and missed targets are not yet listed service by service.",
      "A public tracker of the council's Best Value actions still needs to be added.",
    ],
  }),
  createRecord({
    councilName: "City of Edinburgh",
    councilSlug: "city-of-edinburgh",
    councilCode: "S12000036",
    settlementMillion: 1059.0,
    summary:
      "Audit Scotland says Edinburgh must make significant savings while keeping residents involved in difficult choices. This page separates the council's large allocation from the savings and service decisions that still need to be tracked.",
    audit: {
      id: "audit-bv-edinburgh-2024",
      title: "Best Value: City of Edinburgh Council",
      url: "https://audit.scot/publications/best-value-city-of-edinburgh-council",
      reportDate: "2024-10-24",
      severity: "grade-2",
      finding:
        "The Accounts Commission said Edinburgh needs to make significant savings and should keep residents involved as it decides how services change.",
      recommendation:
        "The council should publish the savings it has chosen, the effect on services and how residents can see whether the changes worked.",
      status: "in-progress",
      usedFor:
        "The report's warning about significant savings and its requirement for continued resident involvement in the choices.",
    },
    knownGaps: [
      "The settlement is provisional and is not Edinburgh's final spending outturn.",
      "The current savings programme and service-level outcomes are not yet extracted.",
      "A current tracker of resident engagement and resulting decisions needs to be added.",
    ],
  }),
  createRecord({
    councilName: "Clackmannanshire",
    councilSlug: "clackmannanshire",
    councilCode: "S12000005",
    settlementMillion: 134.5,
    summary:
      "Audit Scotland reported serious delays in Clackmannanshire's accounts. It said leaders were making budget and council-tax decisions without up-to-date financial information, and that the delay had happened for five years.",
    audit: {
      id: "audit-clackmannanshire-delays-2026",
      title: "Collective leadership needed to tackle significant audit delays at Clackmannanshire Council",
      url: "https://audit.scot/news/collective-leadership-needed-to-tackle-significant-audit-delays-at-clackmannanshire-council",
      reportDate: "2026-07-01",
      severity: "grade-1",
      finding:
        "The 2023/24 accounts were not signed until nearly two years after the legal deadline. Audit Scotland said unaudited accounts had been late for five years and warned that 2024/25 and 2025/26 could also be delayed without action.",
      recommendation:
        "The council needs a shared recovery plan so its financial decisions are based on current, audited information.",
      status: "open",
      usedFor:
        "The length and repeated nature of the audit delays and the warning about decisions being made without current audited information.",
    },
    knownGaps: [
      "The next signed accounts need to be checked before the delay can be marked closed.",
      "The council's recovery plan, owner and milestones are not yet linked.",
      "Service targets and results are not yet mapped to the financial record.",
    ],
  }),
  createRecord({
    councilName: "Dumfries and Galloway",
    councilSlug: "dumfries-and-galloway",
    councilCode: "S12000006",
    settlementMillion: 397.2,
    summary:
      "Audit work found a large budget pressure before savings were applied and said the council needs to deliver service reform and explain performance better to residents. The council did approve a balanced budget after its savings measures.",
    audit: {
      id: "audit-dumfries-galloway-2023-24",
      title: "Dumfries and Galloway Council annual audit 2023/24",
      url: "https://audit.scot/uploads/2024-12/aar_2324_dumfries_galloway.pdf",
      reportDate: "2024-12",
      severity: "grade-2",
      finding:
        "The audit reported a £10.4m budget gap for 2024/25 before extra savings, and a cumulative £30.075m gap by 2026/27 before measures. The approved budget was balanced after targeted savings and use of balances; the earlier Best Value work also called for service reform and clearer public performance information.",
      recommendation:
        "The council should show which savings were delivered, what services changed and whether the projected gap is closing.",
      status: "in-progress",
      usedFor:
        "The pre-savings budget-gap figures, the balanced-budget qualification and the Best Value recommendation to improve service reform and performance communication.",
    },
    knownGaps: [
      "The pre-savings gap must not be presented as money already lost; a new forecast is needed.",
      "Savings delivery and service outcomes are not yet tracked here.",
      "The latest audit response and completion dates need to be linked.",
    ],
  }),
  createRecord({
    councilName: "Dundee City",
    councilSlug: "dundee-city",
    councilCode: "S12000042",
    settlementMillion: 398.9,
    summary:
      "Dundee's audit reported an £18m overspend in general-fund services, capital-plan slippage and a further budget gap. This page keeps those dated figures separate from the council's provisional Scottish Government allocation.",
    audit: {
      id: "audit-dundee-2023-24",
      title: "Dundee City Council annual audit 2023/24",
      url: "https://audit.scot/uploads/2024-12/aar_2324_dundee.pdf",
      reportDate: "2024-12",
      severity: "grade-1",
      finding:
        "The audit reported an £18m overspend in 2023/24 general-fund services, £5.2m overspend in City Development, £4.1m overspend in the housing account and 36% slippage in the capital plan. It also reported a £13.1m 2024/25 budget gap and a £24m cumulative gap for 2024 to 2027.",
      recommendation:
        "The council needs to show how overspends are being brought under control and whether the capital work that slipped has been rescheduled and delivered.",
      status: "in-progress",
      usedFor:
        "The audit's dated overspends, capital-plan slippage and budget-gap figures, including the separate housing-account result.",
    },
    knownGaps: [
      "The 2023/24 figures are not a current 2025/26 outturn and need updating.",
      "The reasons for each current service overspend and the council's action plan are not yet listed.",
      "Current delivery of the delayed capital projects needs a fresh check.",
    ],
  }),
  createRecord({
    councilName: "East Ayrshire",
    councilSlug: "east-ayrshire",
    councilCode: "S12000008",
    settlementMillion: 322.3,
    summary:
      "The most clearly linked Best Value review says East Ayrshire was performing well, with improving services and strong partnerships. That review is older, so the current page marks the latest service and finance position as needing a fresh check.",
    audit: {
      id: "audit-bv-east-ayrshire-2018",
      title: "Best Value Assurance Report: East Ayrshire Council",
      url: "https://audit.scot/publications/best-value-assurance-report-east-ayrshire-council",
      reportDate: "2018-05-29",
      severity: "observation",
      finding:
        "The review said East Ayrshire was performing well, services were improving and partnership working was strong. It is an older review and does not prove the council's current performance.",
      recommendation:
        "A current Best Value and service-outcome update should be linked before this record is used to judge today's performance.",
      status: "not-verified",
      usedFor:
        "The older Best Value review's positive findings and the fact that they cannot be treated as a current result.",
    },
    knownGaps: [
      "The linked Best Value evidence is from 2018 and needs a current update.",
      "The current council budget, savings plan and service targets are not yet extracted.",
      "No current negative claim is made until a fresh primary-source check is complete.",
    ],
  }),
  createRecord({
    councilName: "East Dunbartonshire",
    councilSlug: "east-dunbartonshire",
    councilCode: "S12000045",
    settlementMillion: 274.9,
    summary:
      "A public annual-audit plan is linked for East Dunbartonshire, but a specific current failure or missed target has not been extracted yet. This starter record says that plainly instead of guessing.",
    audit: {
      id: "audit-east-dunbartonshire-plan-2024-25",
      title: "East Dunbartonshire Council annual audit plan 2024/25",
      url: "https://audit.scot/publications/east-dunbartonshire-council-annual-audit-plan-202425",
      reportDate: "2024",
      severity: "observation",
      finding:
        "Audit Scotland publishes an annual-audit plan for East Dunbartonshire. This starter record has not yet extracted a dated performance failure from that plan, so it makes no negative claim about the council.",
      recommendation:
        "Add the latest signed accounts, Best Value findings and service measures after a fresh source check.",
      status: "not-verified",
      usedFor:
        "The existence of a public audit plan and the boundary that it is not, by itself, evidence of a missed service target.",
    },
    knownGaps: [
      "A current audit report or Best Value finding still needs to be added.",
      "The council's budget, savings decisions and service targets are not yet extracted.",
      "No negative claim is made until dated evidence is available.",
    ],
  }),
  createRecord({
    councilName: "East Lothian",
    councilSlug: "east-lothian",
    councilCode: "S12000010",
    settlementMillion: 258.2,
    summary:
      "Audit Scotland reported a £12.3m overspend in 2023/24 and said East Lothian did not fully deliver its savings plan. It also identified a £17.7m budget gap for 2025/26 and said major service changes are needed as the population changes.",
    audit: {
      id: "audit-bv-east-lothian-2025",
      title: "Best Value: East Lothian Council",
      url: "https://audit.scot/uploads/2025-06/bv_250626_east_lothian_council.pdf",
      reportDate: "2025-06-26",
      severity: "grade-1",
      finding:
        "The review reported a £12.3m 2023/24 overspend. £9.2m was met from council reserves and £3.1m from Integration Joint Board reserves. It also reported a £17.7m 2025/26 budget gap and savings that were not fully delivered.",
      recommendation:
        "The council should show which savings were delivered, how reserves were used and what service changes are planned to close the gap.",
      status: "in-progress",
      usedFor:
        "The dated overspend, reserve-use, budget-gap and savings-delivery figures in the Best Value report.",
    },
    knownGaps: [
      "The £17.7m gap is a dated forecast and needs to be refreshed against the latest budget.",
      "The council's current savings tracker and service results are not yet listed.",
      "The projected longer-term gap and finance-system control issues need a separate current source check.",
    ],
  }),
  createRecord({
    councilName: "East Renfrewshire",
    councilSlug: "east-renfrewshire",
    councilCode: "S12000011",
    settlementMillion: 261.4,
    summary:
      "East Renfrewshire's services score highly in the Accounts Commission review, but the council faces a budget gap of about £32m by 2027. A strong service rating does not remove the need to show how that gap will be closed.",
    audit: {
      id: "audit-bv-east-renfrewshire-2025",
      title: "Best Value: East Renfrewshire Council",
      url: "https://audit.scot/publications/best-value-east-renfrewshire-council",
      reportDate: "2025-02-06",
      severity: "grade-2",
      finding:
        "The review described high-performing services and excellent engagement, while Audit Scotland reported a budget gap of around £32m by 2027 that needs detailed income and savings plans.",
      recommendation:
        "The council should publish the detailed savings and income choices, then report whether they closed the forecast gap without reducing the quality of services.",
      status: "in-progress",
      usedFor:
        "The review's positive service findings and the reported £32m budget-gap pressure.",
    },
    knownGaps: [
      "The £32m figure is a forecast and needs a current budget update.",
      "Service-by-service targets and the effect of savings are not yet extracted.",
      "The council's detailed income and savings plan needs to be linked.",
    ],
  }),
  createRecord({
    councilName: "Falkirk",
    councilSlug: "falkirk",
    councilCode: "S12000014",
    settlementMillion: 381.0,
    summary:
      "Audit Scotland found significant improvement in Falkirk but warned of a £62m budget gap. It said one-off savings are not a sustainable answer and that services could be at risk without deeper change.",
    audit: {
      id: "audit-bv-falkirk-2024",
      title: "Best Value: Falkirk Council",
      url: "https://audit.scot/news/falkirk-council-improving-but-faces-significant-financial-challenge",
      reportDate: "2024-05-02",
      severity: "grade-1",
      finding:
        "Audit Scotland reported a £62m budget gap and warned that one-off savings are not sustainable. It said the council must act urgently to transform services, while noting that performance reporting was strong but some areas underperformed.",
      recommendation:
        "The council should show a sustainable route to close the gap and publish action for services that are below target.",
      status: "in-progress",
      usedFor:
        "The projected budget gap, warning about one-off savings, and comments about performance reporting and underperforming areas.",
    },
    knownGaps: [
      "The £62m figure is a forecast from the 2024 review and needs a fresh budget update.",
      "The current list of underperforming services and recovery actions is not yet extracted.",
      "Savings delivery and service outcomes need to be tracked together.",
    ],
  }),
  createRecord({
    councilName: "Fife",
    councilSlug: "fife",
    councilCode: "S12000047",
    settlementMillion: 927.5,
    summary:
      "Audit Scotland says Fife is at a turning point. It found mixed performance, deepening inequalities, deteriorating social care and a need to save more than £46m by 2027/28. This is a forecast and a warning, not a claim that all services have failed.",
    audit: {
      id: "audit-bv-fife-2025",
      title: "Best Value: Fife Council",
      url: "https://audit.scot/news/fife-council-faces-a-turning-point",
      reportDate: "2025-02-25",
      severity: "grade-1",
      finding:
        "The review found mixed performance, deepening inequalities and deteriorating social care. It said Fife must save more than £46m by 2027/28 and noted that contingency reserves had fallen below their target.",
      recommendation:
        "The council should publish the savings and service-reform choices, then report their effect on inequalities and social care.",
      status: "in-progress",
      usedFor:
        "The review's descriptions of mixed performance, inequality and social-care pressure, the £46m savings requirement and reserve position.",
    },
    knownGaps: [
      "The more-than-£46m figure is a forecast and needs a current budget update.",
      "Service-level targets, savings delivered and outcomes are not yet mapped here.",
      "The current reserves position needs to be checked against the latest signed accounts.",
    ],
  }),
  createRecord({
    councilName: "Highland",
    councilSlug: "highland",
    councilCode: "S12000017",
    settlementMillion: 621.0,
    summary:
      "A current annual-audit publication is linked for Highland. This starter record does not turn the existence of an audit into a negative claim; its detailed findings and service results still need to be extracted and checked.",
    audit: {
      id: "audit-highland-2024-25",
      title: "Highland Council annual audit 2024/25",
      url: "https://audit.scot/publications/highland-council-annual-audit-202425",
      reportDate: "2025-12-10",
      severity: "observation",
      finding:
        "Audit Scotland has published the annual-audit report for Highland Council. The detailed findings have not yet been extracted into this starter record, so no missed target or failure is claimed here.",
      recommendation:
        "Add the report's dated financial, performance and Best Value findings after a fresh review of the primary document.",
      status: "not-verified",
      usedFor:
        "The existence and date of the current annual-audit publication, with an explicit boundary against inventing a finding from its title alone.",
    },
    knownGaps: [
      "The detailed 2024/25 audit findings need to be read and added.",
      "The council's current budget, savings plan and service targets are not yet extracted.",
      "No negative claim is made until dated primary-source evidence is added.",
    ],
  }),
];

/** Alias with a descriptive name for consumers that prefer the module name. */
export const councilAccountabilityAHRecords = additionalCouncilAccountabilityRecords;
