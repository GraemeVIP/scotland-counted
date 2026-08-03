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
    "The early 2025/26 national council-funding table, including each council's share and the change from the year before.",
};

const financeSource: AccountabilitySource = {
  id: "sg-local-government-finance-2025-26",
  title: "Local Government 2025-26 Provisional Outturn and 2026-27 Budget Estimates",
  publisher: "Scottish Government",
  kind: "government",
  url: "https://www.gov.scot/publications/local-government-2025-26-provisional-outturn-and-2026-27-budget-estimates/",
  publishedOn: "2026-07-24",
  usedFor:
    "The publication containing the council finance results and 2026/27 budget estimates. Service-by-service comparisons have not yet been extracted into these records.",
};

const budgetBulletinSource: AccountabilitySource = {
  id: "audit-scotland-budget-bulletin-2026-27",
  title: "Local government budgets 2026/27",
  publisher: "Audit Scotland / Accounts Commission",
  kind: "audit",
  url: "https://audit.scot/uploads/2026-06/nr_260611_lg_council_budgets.pdf",
  publishedOn: "2026-06-11",
  usedFor:
    "The money set aside for everyday services, the extra money councils said they needed, planned savings and other budget entries for 2026/27.",
};

type StarterAudit = {
  id: string;
  title: string;
  plainTitle?: string;
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
    title: audit.plainTitle ?? "What the independent check found",
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
        label: "Money for everyday council services",
        value: currentBudget.budget,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `${councilName} planned to spend ${money(currentBudget.budget)} on everyday services in 2026/27. This is a plan, not the final amount spent.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "budget-gap-before-measures",
        label: "Extra money needed for services",
        value: currentBudget.gap,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `When the budget was set, ${councilName} needed ${money(currentBudget.gap)} more to pay for planned services. The council planned to find it through savings, extra income, money already set aside or other changes. It is not money already missing from a bank account.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "approved-savings-2026-27",
        label: "Savings the council planned to make",
        value: currentBudget.savings,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `The 2026/27 plan says the council will save ${money(currentBudget.savings)}. That money has not necessarily been saved yet. The final accounts will show whether it happened.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "other-budget-measures-2026-27",
        label: "Money the budget does not explain",
        value: currentBudget.otherMeasures,
        unit: "million",
        currency: "GBP",
        period: "2026/27",
        plainEnglish: `The budget puts ${money(currentBudget.otherMeasures)} into a box called ‘other measures’. This can include council tax, extra income, money already set aside or other actions. The published table does not show how much comes from each one.`,
        sourceIds: [budgetBulletinSource.id],
      },
      {
        id: "sg-settlement-2025-26",
        label: "Scottish Government money listed for the council",
        value: settlementMillion,
        unit: "million",
        currency: "GBP",
        period: "2025/26",
        plainEnglish: `For context, the Scottish Government lists ${money(settlementMillion)} as ${councilName}'s share of national council funding for 2025/26. It is not proof of what the council finally spent.`,
        sourceIds: [settlementSource.id],
      },
    ],
    outcomes: [
      {
        id: "finance-source-check",
        service: "Council finance",
        measure: "Can we check what the council actually spent?",
        period: "2025/26 final spending and 2026/27 plan",
        target: "A like-for-like result for each service",
        actual: "The final spending figures for each service have not been added yet.",
        status: "not-verified",
        comparisonNote:
          "This is a missing check, not proof that the council met or missed a goal. The next update should compare the plan with what was actually spent in each service.",
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
      "Weak checks at Aberdeen City let 655 council-tax refunds be paid out fraudulently between 2006 and 2023, worth £1.109m. The audit says staff did not always follow the checks meant to stop it. The council was expected to get the money back and tighten up. This page does not assume that is finished.",
    audit: {
      id: "audit-aberdeen-fraud-2023-24",
      title: "The 2023/24 audit of Aberdeen City Council",
      plainTitle: "Weak checks let £1.109m of council-tax refunds go out fraudulently",
      url: "https://audit.scot/news/%C2%A31-million-fraud-at-aberdeen-city-council-sends-a-warning-across-local-government",
      reportDate: "2025-01-09",
      severity: "grade-1",
      finding:
        "The audit counted 655 fraudulent council-tax refund payments worth £1.109m between 2006 and 2023. Checks were supposed to stop this, but staff did not always follow them or check them closely enough.",
      recommendation:
        "The council was expected to recover the money and keep working through outstanding improvement actions. The latest completion position needs a fresh check.",
      status: "in-progress",
      usedFor:
        "The number and value of fraudulent council-tax refund payments, the period covered, and the audit's explanation of control failures.",
    },
    knownGaps: [
      "The final 2025/26 spending figures have not yet been matched to the early funding figure.",
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
      "Aberdeenshire needs to find £81m in the coming years. The review found that some savings it had planned had not happened. It costs £86 to collect the bins from each home here, against £77 across Scotland. The review did judge the council well run, with services improving.",
    audit: {
      id: "audit-bv-aberdeenshire-2026",
      title: "Best Value: Aberdeenshire Council",
      plainTitle: "Aberdeenshire needs to find £81m more",
      url: "https://audit.scot/publications/best-value-aberdeenshire-council",
      reportDate: "2026-03-25",
      severity: "grade-1",
      finding:
        "The review says Aberdeenshire needs to find £81m over the coming years and that some planned savings had not happened. This is a warning about future budgets, not money already missing.",
      recommendation:
        "The council needs to turn its savings plans into delivered changes and keep showing residents what changed and what it cost.",
      status: "in-progress",
      usedFor:
        "The future money needed, the savings not yet delivered and the report's description of the council as well run with improving services.",
    },
    knownGaps: [
      "The £81m figure is an estimate about future years and needs updating when the council publishes a new multi-year budget.",
      "Service-by-service goals and results are not yet mapped here.",
      "The council's response and due dates for each Best Value action need to be added.",
    ],
  }),
  createRecord({
    councilName: "Angus",
    councilSlug: "angus",
    councilCode: "S12000041",
    settlementMillion: 287.8,
    summary:
      "Angus may need to find £24.5m. The report says savings and money set aside cannot be the whole answer, and asks for a clearer plan for changing services. The review did find the council well run and good at working with others, but its results were mixed.",
    audit: {
      id: "audit-bv-angus-2026",
      title: "Best Value: Angus Council",
      plainTitle: "Angus needs a lasting plan for a £24.5m gap",
      url: "https://audit.scot/news/angus-council-is-focused-on-the-future",
      reportDate: "2026-06",
      severity: "grade-1",
      finding:
        "The report says Angus may need to find £24.5m. Planned savings and money already set aside cannot be the whole long-term answer, so the council needs a clearer plan for changing services.",
      recommendation:
        "The council should publish a clear route from the £24.5m it may need to find to sustainable services, including which changes will happen and when.",
      status: "in-progress",
      usedFor:
        "The £24.5m estimate, the warning about one-off fixes and money already set aside, and the report's comments on service redesign.",
    },
    knownGaps: [
      "The £24.5m figure is an estimate and needs a date-stamped update after the next budget review.",
      "A full list of Angus service goals and actual results is not yet extracted.",
      "The council's response to the Best Value recommendations needs to be linked.",
    ],
  }),
  createRecord({
    councilName: "Argyll and Bute",
    councilSlug: "argyll-and-bute",
    councilCode: "S12000035",
    settlementMillion: 259.5,
    summary:
      "The review found that Argyll and Bute may need to find nearly £29m and rethink how services work. It found no serious problems at the time, but said the council must make its performance information easier to understand.",
    audit: {
      id: "audit-bv-argyll-bute-2025",
      title: "Best Value: Argyll and Bute Council",
      plainTitle: "Argyll and Bute must rethink services to close the gap",
      url: "https://audit.scot/publications/best-value-argyll-and-bute-council",
      reportDate: "2025-04-03",
      severity: "grade-2",
      finding:
        "The review says Argyll and Bute may need to find nearly £29m and must rethink how services are delivered. It found no serious problems at that time, but asked for clearer plans and performance information.",
      recommendation:
        "The council should show residents how its service changes close the gap and publish results in a form people can follow.",
      status: "in-progress",
      usedFor:
      "The possible £29m funding gap, the need for service redesign and clearer performance reporting, and the review's statement that it found no serious areas of concern.",
    },
    knownGaps: [
      "The nearly £29m figure is an estimate about future years and needs to be refreshed against the latest budget.",
      "Current performance measures and missed goals are not yet listed service by service.",
      "A public tracker of the council's Best Value actions still needs to be added.",
    ],
  }),
  createRecord({
    councilName: "City of Edinburgh",
    councilSlug: "city-of-edinburgh",
    councilCode: "S12000036",
    settlementMillion: 1059.0,
    summary:
      "Edinburgh recycles less household rubbish than almost anywhere in Scotland: 37.5%, against 44.3%. Its staff lose 16 days a year to sickness, against 14.5 across Scotland. The review says the council must make big savings, and should keep residents involved in the choices.",
    audit: {
      id: "audit-bv-edinburgh-2024",
      title: "Best Value: City of Edinburgh Council",
      plainTitle: "Edinburgh must make big savings with residents involved",
      url: "https://audit.scot/publications/best-value-city-of-edinburgh-council",
      reportDate: "2024-10-24",
      severity: "grade-2",
      finding:
        "The review says Edinburgh needs to make big savings and should keep residents involved as it decides how services change.",
      recommendation:
        "The council should publish the savings it has chosen, the effect on services and how residents can see whether the changes worked.",
      status: "in-progress",
      usedFor:
        "The report's warning about significant savings and its requirement for continued resident involvement in the choices.",
    },
    knownGaps: [
      "The settlement is an early funding figure and is not Edinburgh's final spending result.",
      "The current savings programme and service-by-service results are not yet extracted.",
      "A current tracker of resident engagement and resulting decisions needs to be added.",
    ],
  }),
  createRecord({
    councilName: "Clackmannanshire",
    councilSlug: "clackmannanshire",
    councilCode: "S12000005",
    settlementMillion: 134.5,
    summary:
      "The audit found serious delays in Clackmannanshire's accounts. Leaders were making budget and council-tax decisions without up-to-date financial information, and the delay had happened for five years.",
    audit: {
      id: "audit-clackmannanshire-delays-2026",
      title: "Collective leadership needed to tackle significant audit delays at Clackmannanshire Council",
      plainTitle: "Clackmannanshire accounts were almost two years late",
      url: "https://audit.scot/news/collective-leadership-needed-to-tackle-significant-audit-delays-at-clackmannanshire-council",
      reportDate: "2026-07-01",
      severity: "grade-1",
      finding:
        "The 2023/24 accounts were not signed until nearly two years after the legal deadline. The audit says accounts had been late for five years and warned that the next two years could also be delayed without action.",
      recommendation:
        "The council needs a shared recovery plan so its financial decisions are based on current, audited information.",
      status: "open",
      usedFor:
        "The length and repeated nature of the audit delays and the warning about decisions being made without current audited information.",
    },
    knownGaps: [
      "The next signed accounts need to be checked before the delay can be marked closed.",
      "The council's recovery plan, owner and milestones are not yet linked.",
      "Service goals and results are not yet mapped to the financial record.",
    ],
  }),
  createRecord({
    councilName: "Dumfries and Galloway",
    councilSlug: "dumfries-and-galloway",
    councilCode: "S12000006",
    settlementMillion: 397.2,
    summary:
      "The audit found that Dumfries and Galloway had to find a lot more money before its savings were counted. It said the council needed to change services and explain results better. The council then approved a balanced budget after its planned changes.",
    audit: {
      id: "audit-dumfries-galloway-2023-24",
      title: "Dumfries and Galloway Council annual audit 2023/24",
      plainTitle: "The council had to find £30.075m more by 2026/27",
      url: "https://audit.scot/uploads/2024-12/aar_2324_dumfries_galloway.pdf",
      reportDate: "2024-12",
      severity: "grade-2",
      finding:
        "The audit says Dumfries and Galloway needed to find £10.4m for 2024/25 before extra savings, rising to £30.075m by 2026/27 before other changes. The approved budget was then balanced using planned savings and money already held. Earlier review work also called for simpler public performance information.",
      recommendation:
        "The council should show which savings were delivered, what services changed and whether the future money problem is getting smaller.",
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
      "Dundee's audit found that services spent £18m more than planned, 36% of its building programme was delayed and more money was needed for future budgets. This page keeps those dated figures separate from the Scottish Government money listed for the council.",
    audit: {
      id: "audit-dundee-2023-24",
      title: "Dundee City Council annual audit 2023/24",
      plainTitle: "Dundee overspent by £18m and delayed 36% of its building plan",
      url: "https://audit.scot/uploads/2024-12/aar_2324_dundee.pdf",
      reportDate: "2024-12",
      severity: "grade-1",
      finding:
        "The audit says services spent £18m more than planned in 2023/24. City Development was £5.2m over, housing was £4.1m over and 36% of the building programme was delayed. It also recorded £13.1m more needed for 2024/25 and £24m more needed across 2024 to 2027.",
      recommendation:
        "The council needs to show how overspends are being brought under control and whether the capital work that slipped has been rescheduled and delivered.",
      status: "in-progress",
      usedFor:
        "The audit's dated overspends, capital-plan slippage and budget-gap figures, including the separate housing-account result.",
    },
    knownGaps: [
      "The 2023/24 figures are not the current 2025/26 final spending result and need updating.",
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
      "Fewer than half the people in East Ayrshire are happy with how clean the streets are. That is 47.3%, against 57% across Scotland. Its staff lose 16.4 days a year to sickness, against 14.5. The last full review said services were improving, but that was 2018 and does not show how things are now.",
    audit: {
      id: "audit-bv-east-ayrshire-2018",
      title: "Best Value Assurance Report: East Ayrshire Council",
      plainTitle: "The last review found improving services — but it is from 2018",
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
      "The current council budget, savings plan and service goals are not yet extracted.",
      "No current negative claim is made until a fresh primary-source check is complete.",
    ],
  }),
  createRecord({
    councilName: "East Dunbartonshire",
    councilSlug: "east-dunbartonshire",
    councilCode: "S12000045",
    settlementMillion: 274.9,
    summary:
      "Nearly a third of East Dunbartonshire's main roads need repair: 32.7%, against 30.3% across Scotland. Only 52.7% of people are happy with how clean the streets are. The council said it needed another £23.7m this year. No dated service failure has been checked here yet, and this page says so rather than guessing.",
    audit: {
      id: "audit-east-dunbartonshire-plan-2024-25",
      title: "East Dunbartonshire Council annual audit plan 2024/25",
      plainTitle: "There is an audit plan, but no current result has been checked",
      url: "https://audit.scot/publications/east-dunbartonshire-council-annual-audit-plan-202425",
      reportDate: "2024",
      severity: "observation",
      finding:
        "The document is an audit plan, not a report of a missed service goal. It gives us no dated failure to report, so this page makes no negative claim about the council.",
      recommendation:
        "Add the latest signed accounts, Best Value findings and service measures after a fresh source check.",
      status: "not-verified",
      usedFor:
        "The existence of a public audit plan and the boundary that it is not, by itself, evidence of a missed service goal.",
    },
    knownGaps: [
      "A current audit report or Best Value finding still needs to be added.",
      "The council's budget, savings decisions and service goals are not yet extracted.",
      "No negative claim is made until dated evidence is available.",
    ],
  }),
  createRecord({
    councilName: "East Lothian",
    councilSlug: "east-lothian",
    councilCode: "S12000010",
    settlementMillion: 258.2,
    summary:
      "The review found that East Lothian spent £12.3m more than planned in 2023/24 and did not deliver all its savings. It also said the council needed £17.7m more for 2025/26 and must make big service changes as the population changes.",
    audit: {
      id: "audit-bv-east-lothian-2025",
      title: "Best Value: East Lothian Council",
      plainTitle: "East Lothian overspent by £12.3m and still needed £17.7m",
      url: "https://audit.scot/uploads/2025-06/bv_250626_east_lothian_council.pdf",
      reportDate: "2025-06-26",
      severity: "grade-1",
      finding:
        "The review reported that East Lothian spent £12.3m more than planned in 2023/24. £9.2m was covered with money the council had set aside and £3.1m with money held by its health-and-care partnership. It also reported £17.7m more needed for 2025/26 and savings that were not fully delivered.",
      recommendation:
        "The council should show which savings were delivered, how the money it had set aside was used and what service changes will solve the problem.",
      status: "in-progress",
      usedFor:
        "The dated overspend, reserve-use, budget-gap and savings-delivery figures in the Best Value report.",
    },
    knownGaps: [
      "The £17.7m gap is a dated forecast and needs to be refreshed against the latest budget.",
      "The council's current savings tracker and service results are not yet listed.",
      "The longer-term money problem and finance-system control issues need a separate current source check.",
    ],
  }),
  createRecord({
    councilName: "East Renfrewshire",
    councilSlug: "east-renfrewshire",
    councilCode: "S12000011",
    settlementMillion: 261.4,
    summary:
      "East Renfrewshire may need to find about £32m by 2027. The review says it needs a detailed plan showing where that money would come from. Its services scored highly. Good services do not remove the need to show how the money problem gets solved.",
    audit: {
      id: "audit-bv-east-renfrewshire-2025",
      title: "Best Value: East Renfrewshire Council",
      plainTitle: "Strong services still face a £32m money problem",
      url: "https://audit.scot/publications/best-value-east-renfrewshire-council",
      reportDate: "2025-02-06",
      severity: "grade-2",
      finding:
        "The review described strong services and excellent work with residents, but said East Renfrewshire may need to find about £32m by 2027. It needs a detailed plan showing the savings and extra income that would cover it.",
      recommendation:
        "The council should publish the detailed savings and income choices, then report whether they closed the forecast gap without reducing the quality of services.",
      status: "in-progress",
      usedFor:
        "The review's positive service findings and the reported £32m budget-gap pressure.",
    },
    knownGaps: [
      "The £32m figure is a forecast and needs a current budget update.",
      "Service-by-service goals and the effect of savings are not yet extracted.",
      "The council's detailed income and savings plan needs to be linked.",
    ],
  }),
  createRecord({
    councilName: "Falkirk",
    councilSlug: "falkirk",
    councilCode: "S12000014",
    settlementMillion: 381.0,
    summary:
      "Falkirk may need to find £62m. The review warned that one-off savings will not last, and that services could suffer without deeper change. Just over half of people are happy with how clean the streets are. Nearly a third of its main roads need repair.",
    audit: {
      id: "audit-bv-falkirk-2024",
      title: "Best Value: Falkirk Council",
      plainTitle: "Falkirk faces a £62m gap despite improvement",
      url: "https://audit.scot/news/falkirk-council-improving-but-faces-significant-financial-challenge",
      reportDate: "2024-05-02",
      severity: "grade-1",
      finding:
        "The review says Falkirk may need to find £62m and warned that one-off savings will not last. It called for urgent service changes, while noting that performance reporting was strong but some services were falling behind.",
      recommendation:
        "The council should show a lasting way to solve the money problem and publish action for services that are below their goals.",
      status: "in-progress",
      usedFor:
        "The estimated money problem, warning about one-off savings, and comments about performance reporting and underperforming areas.",
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
      "Fife must save more than £46m by 2027/28. Its emergency money has fallen below the level the council itself calls safe. The review found growing inequality and worsening pressure in social care. Its staff lose 16.7 days a year to sickness, against 14.5 across Scotland.",
    audit: {
      id: "audit-bv-fife-2025",
      title: "Best Value: Fife Council",
      plainTitle: "Fife needs more than £46m of savings",
      url: "https://audit.scot/news/fife-council-faces-a-turning-point",
      reportDate: "2025-02-25",
      severity: "grade-1",
      finding:
        "The review found mixed results, growing inequality and worsening pressure in social care. It said Fife must save more than £46m by 2027/28 and noted that its emergency money set aside had fallen below its own safety goal.",
      recommendation:
        "The council should publish the savings and service-reform choices, then report their effect on inequalities and social care.",
      status: "in-progress",
      usedFor:
        "The review's descriptions of mixed performance, inequality and social-care pressure, the £46m savings requirement and reserve position.",
    },
    knownGaps: [
      "The more-than-£46m figure is an estimate about future years and needs a current budget update.",
      "Service-by-service goals, savings delivered and results are not yet mapped here.",
      "The current amount of emergency money set aside needs to be checked against the latest signed accounts.",
    ],
  }),
  createRecord({
    councilName: "Highland",
    councilSlug: "highland",
    councilCode: "S12000017",
    settlementMillion: 621.0,
    summary:
      "Highland spent £3.4m more than its updated budget in 2024/25. Adult social care fell £4.5m short of its savings goal, and another £2.4m of planned savings did not happen. It costs £101 to collect the bins from each home here, against £77 across Scotland.",
    audit: {
      id: "audit-highland-2024-25",
      title: "Highland Council annual audit 2024/25",
      plainTitle: "Highland spent £3.4m more than its updated budget",
      url: "https://audit.scot/publications/highland-council-annual-audit-202425",
      reportDate: "2025-12-10",
      severity: "observation",
      finding:
        "The audit says Highland ended 2024/25 £3.4m over its updated budget after adjustments. It also says adult social care fell £4.5m short of its savings goal and that another £2.4m of planned savings had not happened.",
      recommendation:
        "Show how the missed adult social care savings will be dealt with and report what later changes mean for services and the budget.",
      status: "not-verified",
      usedFor:
        "The 2024/25 overspend, the adult social care savings missed and the need for a clear follow-up.",
    },
    knownGaps: [
      "The current 2026/27 savings plan and final spending results are not yet added.",
      "A full list of Highland service goals and results is not yet extracted.",
      "The latest progress on the adult social care changes still needs a dated update.",
    ],
  }),
];

/** Alias with a descriptive name for consumers that prefer the module name. */
export const councilAccountabilityAHRecords = additionalCouncilAccountabilityRecords;
