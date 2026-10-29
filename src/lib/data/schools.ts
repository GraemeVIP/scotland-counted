/**
 * Modern Studies course facts, and the poverty evidence behind the schools
 * guides: /modern-studies, the National 5, Higher and Advanced Higher pages,
 * the two past paper pages and /causes-of-poverty.
 *
 * Course facts are copied from Qualifications Scotland's course
 * specifications, specimen papers, 2026 marking instructions, coursework
 * assessment tasks and course reports, all read on 29 October 2026.
 * Qualifications Scotland replaced SQA on 1 February 2026. It still publishes
 * on sqa.org.uk while its new website is built, and its own course pages say
 * the SQA branded documents remain current, so the links below are the live
 * official ones.
 *
 * Poverty figures that are not already held elsewhere in src/lib/data come
 * from JRF's Poverty in Scotland 2026 and from Public Health Scotland. Each
 * block names its source. The headline Scottish rates (17%, 21% and so on)
 * stay in scotland.ts and are imported from there, never repeated here.
 */

import { holyroodConstituencies, holyroodRegions } from "@/lib/data/holyrood";

/** The date the awarding body changed name. From every Modern Studies course page. */
export const QS_REPLACED_SQA = "1 February 2026";

/** Official pages, each checked to return a live page on 29 October 2026. */
export const MODERN_STUDIES_LINKS = {
  subject: "https://www.sqa.org.uk/sqa/45629.html",
  n5: "https://www.sqa.org.uk/sqa/47448.html",
  higher: "https://www.sqa.org.uk/sqa/47924.html",
  advancedHigher: "https://www.sqa.org.uk/sqa/48467.html",
  pastPapersN5: "https://www.sqa.org.uk/pastpapers/findpastpaper.htm?subject=Modern+Studies&level=N5",
  pastPapersHigher: "https://www.sqa.org.uk/pastpapers/findpastpaper.htm?subject=Modern+Studies&level=NH",
  pastPapersAdvancedHigher: "https://www.sqa.org.uk/pastpapers/findpastpaper.htm?subject=Modern+Studies&level=NAH",
  pastPapersHome: "https://www.sqa.org.uk/pastpapers/findpastpaper.htm",
  timetable2027: "https://www.sqa.org.uk/sqa/files_ccc/nq-2027-exam-timetable.pdf",
  bitesizeN5: "https://www.bbc.co.uk/bitesize/subjects/zxsnb9q",
  bitesizeHigher: "https://www.bbc.co.uk/bitesize/subjects/ztsvr82",
} as const;

export const QS_SOURCE = { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.subject } as const;

/** Past papers listed on the official finder for N5, Higher and Advanced Higher. */
export const MODERN_STUDIES_PAST_PAPERS = {
  firstYear: 2022,
  lastYear: 2026,
  years: 5,
  /** The finder labels some 2022 and 2023 papers "modified" after Covid changes. */
  modifiedYears: "2022 and 2023",
} as const;

/** Wednesday 26 May 2027, from the Exam Timetable 2027, version 02, August 2026. */
export const MODERN_STUDIES_EXAMS_2027 = {
  date: "Wednesday 26 May 2027",
  n5: "1pm to 3.20pm",
  higherPaper1: "9am to 10.45am",
  higherPaper2: "11.15am to 12.30pm",
  advancedHigher: "9am to 12 noon",
  source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.timetable2027 },
} as const;

/** National 5 course specification, version 4.0, September 2024, valid from session 2024/25. */
export const N5_MODERN_STUDIES = {
  code: "C849 75",
  scqfLevel: 5,
  credits: 24,
  hours: 160,
  specVersion: "version 4.0, September 2024",
  totalMarks: 100,
  paper: { marks: 80, duration: "2 hours and 20 minutes", sharePct: 80 },
  assignment: { marks: 20, duration: "1 hour", sharePct: 20, researchHours: 8 },
  /** Coursework assessment task, version 3.0. Skills 14, knowledge and understanding 6. */
  assignmentMarks: [
    { part: "Evaluating two research methods you used, with their strengths and weaknesses", marks: 10 },
    { part: "Using your knowledge to explain and analyse what you found", marks: 6 },
    { part: "A well supported conclusion", marks: 4 },
  ],
  sections: [
    { name: "Democracy in Scotland and the United Kingdom", choice: "Democracy in Scotland, or democracy in the United Kingdom" },
    { name: "Social issues in the United Kingdom", choice: "Social inequality, or crime and the law" },
    { name: "International issues", choice: "A world power, or a world issue" },
  ],
  /** Specimen paper (August 2025) and the 2026 paper. */
  questionTypes: [
    { type: "Describe, in detail", marks: "4 or 6", rule: "Up to 3 marks for any one description. A list of short points gets 2 marks at most." },
    { type: "Explain, in detail", marks: "6 or 8", rule: "Up to 4 marks for any one explanation. Give no more reasons than the question asks for." },
    { type: "Options: make and justify a decision", marks: "10", rule: "Say why you rejected the other option, or the most you can get is 8." },
    { type: "Support and oppose a view", marks: "10", rule: "Use evidence for and against. One side only gets 6 at most." },
    { type: "What conclusions can be drawn", marks: "10", rule: "Four conclusions for full marks, each backed by evidence from the sources." },
  ],
  /** Every source question: all sources for full marks, 6 at most from two, 4 from one. */
  sourceRule: { twoSourcesMax: 6, oneSourceMax: 4 },
  /** Course report 2025. The 2026 report was not yet published on 29 October 2026. */
  results: { year: 2025, entries: 12_543, a: 70, b: 58, c: 47, d: 35, pctA: 35.9 },
  source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.n5 },
} as const;

/** Higher course specification, version 4.0, September 2024, valid from session 2024/25. */
export const HIGHER_MODERN_STUDIES = {
  code: "C849 76",
  scqfLevel: 6,
  credits: 24,
  hours: 160,
  specVersion: "version 4.0, September 2024",
  totalMarks: 110,
  paper1: { marks: 52, duration: "1 hour and 45 minutes", sharePct: 47 },
  paper2: { marks: 28, duration: "1 hour and 15 minutes", sharePct: 26 },
  assignment: { marks: 30, duration: "1 hour and 30 minutes", sharePct: 27, researchHours: 8 },
  /** Coursework assessment task, version 3.0. */
  assignmentMarks: [
    { part: "Knowledge and understanding of the issue and the alternatives", marks: 10 },
    { part: "Analysing and synthesising information from your sources", marks: 10 },
    { part: "Evaluating how useful and reliable your sources are", marks: 2 },
    { part: "Writing it as a report", marks: 4 },
    { part: "Reaching a decision supported by evidence", marks: 4 },
  ],
  /** Paper 1: two 20 mark essays and one 12 mark essay. 2026 marking instructions. */
  paper1Types: [
    { type: "Discuss", marks: 20, needs: "Analyse and evaluate different views of the statement." },
    { type: "To what extent", marks: 20, needs: "Analyse the issue and reach a judgement, usually about how much." },
    { type: "Evaluate", marks: 12, needs: "Make a judgement based on criteria." },
    { type: "Analyse", marks: 12, needs: "Break the issue into parts and show how they relate and what follows." },
  ],
  essay20: { knowledge: 8, analysis: 6, structure: 2, conclusions: 4 },
  essay12: { knowledge: 8, higherSkills: 4 },
  /** Knowledge capped at 6 of 8 with no examples. 2026 marking instructions. */
  noExampleKnowledgeCap: 6,
  /** Paper 2: three compulsory source questions. */
  paper2Types: [
    { skill: "Drawing conclusions", marks: 10, sources: "two to four", wording: "What conclusions can be drawn about ...?" },
    { skill: "Objectivity", marks: 10, sources: "two to four", wording: "To what extent is it accurate to state that ...?" },
    { skill: "Reliability", marks: 8, sources: "three", wording: "To what extent are Sources A, B and C reliable?" },
  ],
  /** Course report 2026. */
  results: { year: 2026, entries: 8_772, a: 77, b: 65, c: 53, d: 41, pctA: 32.1 },
  source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.higher },
} as const;

/** Advanced Higher course specification, version 2.0, September 2019, valid from session 2019/20. */
export const ADVANCED_HIGHER_MODERN_STUDIES = {
  code: "C849 77",
  scqfLevel: 7,
  credits: 32,
  hours: 160,
  specVersion: "version 2.0, September 2019",
  totalMarks: 140,
  paper: { marks: 90, duration: "3 hours", sharePct: 64 },
  dissertation: { marks: 50, sharePct: 36, words: 5_000, penaltyOverPct: 10 },
  /** Coursework assessment task, version 1.1, September 2024. */
  dissertationMarks: [
    { part: "Justifying a complex, contemporary political or social issue", marks: 8 },
    { part: "Evaluating your research methods", marks: 6 },
    { part: "Using a wide range of sources", marks: 6 },
    { part: "Analysing the issue", marks: 8 },
    { part: "Evaluating arguments and evidence", marks: 8 },
    { part: "Synthesis: a sustained line of argument to a conclusion", marks: 10 },
    { part: "Organising, presenting and referencing", marks: 4 },
  ],
  sections: [
    {
      name: "Political issues and research methods",
      topics: ["Power and influence", "Political ideology", "Political structures", "Social science research methods and issues"],
    },
    {
      name: "Law and order and research methods",
      topics: ["Understanding the criminal justice system", "Understanding criminal behaviour", "Responses by society to crime", "Social science research methods and issues"],
    },
    {
      name: "Social inequality and research methods",
      topics: ["Understanding social inequality", "The impact of social inequality", "Responses to social inequality", "Social science research methods and issues"],
    },
  ],
  essayMarks: 30,
  researchMethodsMarks: 15,
  sourceTrustMarks: 15,
  /** Course report 2026. */
  results: { year: 2026, entries: 1_140, a: 98, b: 84, c: 70, d: 56, pctA: 36.5 },
  source: { publisher: "Qualifications Scotland", url: MODERN_STUDIES_LINKS.advancedHigher },
} as const;

/**
 * JRF, Poverty in Scotland 2026, published 5 October 2026. All figures are
 * three year averages for 2022 to 2025, after housing costs.
 */
export const JRF_SCOTLAND_2026 = {
  published: "5 October 2026",
  deepPct: 11,
  veryDeepPct: 7,
  /** People in poverty, on average, had incomes this far below the line. */
  averageGapPct: 26,
  veryDeepGapPct: 60,
  /** Monthly gap for a couple with two children in very deep poverty. */
  veryDeepCoupleMonthlyGap: 1_325,
  /** Share of people in poverty with someone in work. */
  peopleInPovertyWithWorkPct: 66,
  work: [
    { family: "Everyone is in full time work", pct: 5 },
    { family: "At least one adult works full time", pct: 11 },
    { family: "Only part time work", pct: 27 },
    { family: "No one works (all under 60)", pct: 43 },
  ],
  tenure: [
    { home: "Social renters", pct: 34 },
    { home: "Private renters", pct: 31 },
    { home: "Own outright", pct: 12 },
    { home: "Own with a mortgage", pct: 8 },
  ],
  /** All private renters pulled into poverty by their housing costs. */
  privateRentersPulledInPct: 13,
  /** Private renters in poverty for whom rent is a primary driver. */
  privateRentersRentDriverPct: 44,
  /** People in a family getting Universal Credit or the benefits it replaced. */
  universalCreditFamiliesPct: 37,
  /** Poverty with disability benefits left out of income, as JRF measures it. */
  disabilityBenefitFamiliesPct: 23,
  noDisabilityBenefitPct: 17,
  priorityFamilies: [
    "Single parent families",
    "Households where someone is disabled",
    "Large families, with three or more children",
    "Families with a baby under one",
    "Minority ethnic families",
    "Families with a mum under 25",
  ],
  priorityShare: "over 9 in 10",
  priorityRates: [
    { family: "Minority ethnic families", pct: 47 },
    { family: "Families with a baby", pct: 39 },
    { family: "Large families", pct: 38 },
  ],
  /** Child Poverty (Scotland) Act 2017 targets for relative child poverty. */
  childTarget: { interimPct: 18, interimYear: "2023/24", finalPct: 10, finalYear: "2030/31" },
  /** Persistent child poverty, in points over its 5% final target. */
  persistentOverTargetPoints: 12,
  /** Single year relative child poverty on the new data, which JRF says to read with caution. */
  singleYearChildPoverty: [
    { year: "2022/23", pct: 27 },
    { year: "2023/24", pct: 16 },
    { year: "2024/25", pct: 21 },
  ],
  source: { publisher: "Joseph Rowntree Foundation", url: "https://www.jrf.org.uk/understanding-poverty/poverty-in-scotland-2026" },
} as const;

/** Public Health Scotland (NHS Health Scotland) child poverty briefings, 2018 and 2019. */
export const PHS_CHILD_POVERTY = {
  driversUrl: "https://www.publichealthscotland.scot/publications/child-poverty-the-national-and-local-drivers/",
  impactUrl: "https://publichealthscotland.scot/publications/child-poverty-and-low-income-health-impact-and-health-inequalities/",
  /** Children under 16 with fair, bad or very bad general health, Scottish Health Survey 2016. */
  poorHealth: { year: 2016, lowestIncomePct: 11, highestIncomePct: 3 },
  source: { publisher: "Public Health Scotland", url: "https://www.publichealthscotland.scot/publications/child-poverty-the-national-and-local-drivers/" },
} as const;

/** "2022–25" as plain words: "2022 to 2025". */
export function plainPeriod(period: string) {
  return period.replace(/(\d{2})(\d{2})\D(\d{2})$/, (_, century, start, end) => `${century}${start} to ${century}${end}`);
}

/** "2025-26" as "2025/26", the way the rest of the copy writes a financial year. */
export function slashYear(year: string) {
  return year.replace("-", "/");
}

const PARTY_LABELS: Record<string, string> = {
  "Scottish National Party": "SNP",
  "Scottish Labour": "Labour",
  "Reform UK": "Reform UK",
  "Scottish Green Party": "Scottish Greens",
  "Scottish Conservative and Unionist Party": "Conservatives",
  "Scottish Liberal Democrats": "Liberal Democrats",
  "No Party Affiliation": "No party",
};

const partyLabel = (party: string) => PARTY_LABELS[party] ?? party;

/**
 * The Scottish Parliament as it stands in the MSP snapshot: constituency and
 * regional seats by party. It is current membership, not the election result,
 * so the pages call it that.
 */
export function holyroodSeatsByParty() {
  const rows = new Map<string, { party: string; constituency: number; regional: number }>();
  const add = (party: string, kind: "constituency" | "regional") => {
    const label = partyLabel(party);
    const row = rows.get(label) ?? { party: label, constituency: 0, regional: 0 };
    row[kind] += 1;
    rows.set(label, row);
  };
  holyroodConstituencies.forEach((c) => add(c.msp.party, "constituency"));
  holyroodRegions.forEach((r) => r.msps.forEach((m) => add(m.party, "regional")));
  return [...rows.values()]
    .map((row) => ({ ...row, total: row.constituency + row.regional }))
    .sort((a, b) => b.total - a.total || b.constituency - a.constituency);
}
