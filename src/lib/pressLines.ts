/**
 * Lift-ready lines about councils for the press page.
 *
 * Generated from the same data the council pages render, not typed out, so a
 * refreshed benchmarking file updates the press lines with everything else. A
 * hand-written press line is the one most likely to go stale and the one most
 * likely to end up in print, which is the worst possible combination.
 *
 * Every line carries its source in brackets, because a line without one is
 * useless to the person lifting it.
 */

// Extensions kept explicit so this runs under `node --test` as well as Next.
import { councilBenchmarks, LGBF_SOURCE } from "./data/councilBenchmarks.ts";
import { councilAccountabilityRecords } from "./data/councilAccountability.ts";
import {
  BRIDGING_ACTIONS,
  BUDGET_SOURCE,
  COUNCIL_TAX,
  NATIONAL,
} from "./data/councilBudgetMechanics.ts";

const LGBF = `${LGBF_SOURCE.name}, published by the ${LGBF_SOURCE.publisher}`;
const AUDIT = "Audit Scotland, Local government budgets 2026/27";

/**
 * How each indicator reads as a sentence about the council at the bottom of
 * it. Keyed by LGBF code; anything not listed is left out rather than
 * described with a guess.
 */
const WORST_SENTENCE: Record<string, (name: string, here: string, scotland: string) => string> = {
  ENV04b: (n, h, s) =>
    `${n} has the worst-maintained main roads of Scotland's 32 councils: ${h} are flagged as needing repair, against ${s} nationally`,
  ENV01a: (n, h, s) =>
    `${n} has the most expensive bin collection in Scotland at ${h} per property, against a national figure of ${s}`,
  CORP07: (n, h, s) =>
    `${n} collects less of its council tax on time than any other Scottish council, at ${h} against ${s} nationally`,
  CORP06b: (n, h, s) =>
    `${n} has the worst staff sickness rate of Scotland's 32 councils, at ${h} lost per employee against ${s} nationally`,
  ENV06: (n, h, s) =>
    `${n} recycles less household waste than any other Scottish council, at ${h} against ${s} nationally`,
  ENV07b: (n, h, s) =>
    `${n} has the least satisfied residents in Scotland when it comes to street cleaning: ${h} say they are happy with it, against ${s} nationally`,
};

const councilName = (slug: string) =>
  councilAccountabilityRecords.find((r) => r.councilSlug === slug)?.councilName.replace(/ Council$/, "") ??
  slug;

/**
 * Measures where a newer official series has overtaken the benchmarking file.
 *
 * The council pages can still show these, every figure there carries its year
 * and sits in a table of the same vintage. A press line cannot. "Collects less
 * than any other council" is a present-tense claim, and if a reporter lifts it
 * and the council answers with a fresher official number, the damage lands on
 * this site rather than on them.
 *
 * Council tax collection: the Scottish Government published 2025-26 collection
 * statistics on 17 June 2026, with a range of 91.0% to 97.7%. The LGBF series
 * here is 2024/25, so it is a year behind and its bottom figure no longer
 * stands.
 */
const SUPERSEDED: Record<string, string> = {
  CORP07:
    "Scottish Government Council Tax Collection Statistics 2025-26, published 17 June 2026",
};

/** One line per measure, naming the council that comes last on it. */
export function worstInScotlandLines(): string[] {
  const lines: string[] = [];
  for (const [code, sentence] of Object.entries(WORST_SENTENCE)) {
    if (SUPERSEDED[code]) continue;
    let worst: { slug: string; display: string; scotlandDisplay: string; year: string } | null = null;
    for (const [slug, rows] of Object.entries(councilBenchmarks)) {
      const row = rows.find((r) => r.code === code);
      if (!row || row.direction === "depends") continue;
      if (row.rank !== row.of) continue; // last of 32 on this measure
      worst = { slug, display: row.display, scotlandDisplay: row.scotlandDisplay, year: row.year };
    }
    if (!worst) continue;
    lines.push(
      `${sentence(councilName(worst.slug), worst.display, worst.scotlandDisplay)} (${LGBF}, ${worst.year}).`,
    );
  }
  return lines;
}

/** The national budget findings, with the figures pulled from the data. */
export function nationalCouncilLines(): string[] {
  const councilTax = BRIDGING_ACTIONS[0];
  return [
    `${NATIONAL.councilsWithGap} of Scotland's ${NATIONAL.councilsTotal} councils identified a budget gap when setting their 2026/27 budgets, totalling ${NATIONAL.gapTotal}, ${NATIONAL.gapShare} of their combined General Fund revenue budgets. Only ${NATIONAL.surplusCouncil} reported a surplus (${AUDIT}).`,
    `Councils identified that gap despite Scottish Government revenue funding for 2026/27 being ${NATIONAL.revenueChange} in real terms, and the gap has stayed at around the same share of budgets for ${NATIONAL.gapYears} years (${AUDIT}).`,
    `Increasing council tax was the single largest measure councils used to close their 2026/27 budget gaps, raising ${councilTax.amount}, more than the ${BRIDGING_ACTIONS[1].amount} they expected from savings that recur each year (${AUDIT}).`,
    `Every Scottish council raised council tax for 2026/27, by an average of ${COUNCIL_TAX.averageIncrease} and ranging from ${COUNCIL_TAX.lowestIncrease.value} in ${COUNCIL_TAX.lowestIncrease.council} to ${COUNCIL_TAX.highestIncrease.value} in ${COUNCIL_TAX.highestIncrease.council}. It was the second consecutive year of increases, ${COUNCIL_TAX.twoYearAverage} cumulatively (${AUDIT}).`,
    `The local government grant is distributed on need, population, pupil numbers, deprivation and road length, using indicators the Scottish Parliament's own research service describes as "outside of the control of Local Authorities". Past spending is not the basis for allocation, so a council that underspends does not receive less the following year (SPICe briefing SB-1860).`,
  ];
}

/** Measures held back from the press lines, and what replaced them. */
export function supersededNotes(): { measure: string; newer: string }[] {
  const label: Record<string, string> = { CORP07: "Council tax collected on time" };
  return Object.entries(SUPERSEDED).map(([code, newer]) => ({
    measure: label[code] ?? code,
    newer,
  }));
}

/** What a journalist should put under a lifted figure. */
export const CITATION = "Scotland Counted, scotlandcounted.org.uk";

export const COUNCIL_DATA_FILE = "/data/scottish-councils-benchmarks.csv";
export const COUNCIL_SOURCES = [LGBF_SOURCE.url, BUDGET_SOURCE.url];
