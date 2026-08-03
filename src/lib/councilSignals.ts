/**
 * The three numbers that head every council page.
 *
 * These have to work for all 32 councils, not just the ones with a rich
 * record. The old headline read "Goals missed: —" for any council whose
 * record has no service outcomes yet, which wasted the most prominent slot on
 * the page and told the reader nothing.
 *
 * Everything here is derived from data that exists for every council: the
 * national budget bulletin, the national benchmarking file, and the audit
 * findings already in the record. Nothing is invented and nothing is scored
 * where the source will not support a score.
 */

// Relative, not aliased: this module is covered by `node --test`, which does
// not resolve the "@/" path alias.
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { gapFor } from "./data/councilBudgetMechanics.ts";
import type { CouncilAccountabilityRecord } from "./data/councilAccountability.ts";

export type BenchmarkTally = {
  /** Measures where this council is worse than the Scotland figure. */
  worse: number;
  /** Measures where it is better. */
  better: number;
  /** Measures that carry a score at all — excludes "depends" indicators. */
  scored: number;
};

/**
 * How this council sits against the Scotland figure, measure by measure.
 *
 * Indicators marked "depends" are left out of the count entirely. Cost per
 * primary pupil is the reason: a council spending less on each child is not
 * doing better or worse, so folding it into a win/lose tally would smuggle a
 * judgement into a headline number.
 */
export function benchmarkTally(slug: string): BenchmarkTally {
  const rows = councilBenchmarks[slug] ?? [];
  let worse = 0;
  let better = 0;
  for (const row of rows) {
    if (row.direction === "depends") continue;
    const isWorse =
      row.direction === "lower" ? row.value > row.scotland : row.value < row.scotland;
    if (isWorse) worse += 1;
    else better += 1;
  }
  return { worse, better, scored: worse + better };
}

/**
 * The "what this means" paragraph, built from the same signals as the
 * headline cards.
 *
 * The version this replaced opened with "X Council has money coming in",
 * which is true of every council that has ever existed and tells a reader
 * nothing. Each sentence here carries a number the reader could repeat.
 */
export function shortVersion(record: CouncilAccountabilityRecord): string {
  const gap = gapFor(record.councilSlug);
  const tally = benchmarkTally(record.councilSlug);
  const open = openFindingCount(record);
  const shortName = record.councilName.replace(/ Council$/, "");
  const lines: string[] = [];

  if (gap !== undefined && gap > 0) {
    lines.push(
      `${shortName} said it needed £${gap.toLocaleString("en-GB")}m more than it expected to get this year. Nearly every council in Scotland said the same thing.`,
    );
  } else if (gap !== undefined && gap < 0) {
    lines.push(
      `${shortName} set its budget with £${Math.abs(gap).toLocaleString("en-GB")}m to spare. It was the only council in Scotland that did not ask for more.`,
    );
  }

  if (tally.scored > 0) {
    lines.push(
      tally.worse > 0
        ? `On the measures every council reports the same way, it is worse than the Scottish average on ${tally.worse} of ${tally.scored}.`
        : `On the measures every council reports the same way, it is better than the Scottish average on all ${tally.scored}.`,
    );
  }

  const missedGoals = record.outcomes.filter((outcome) => outcome.status === "missed").length;
  if (missedGoals > 0) {
    lines.push(
      `It missed ${missedGoals} of its own service goal${missedGoals === 1 ? "" : "s"}.`,
    );
  }

  if (open > 0) {
    lines.push(
      `Independent auditors have ${open} warning${open === 1 ? "" : "s"} about it that ${open === 1 ? "is" : "are"} still open.`,
    );
  }

  lines.push("Every figure below links to the official paper it came from.");
  return lines.join(" ");
}

/** Audit and regulator findings that have not been closed off. */
export function openFindingCount(record: CouncilAccountabilityRecord): number {
  return record.auditFindings.filter(
    (finding) => finding.status === "open" || finding.status === "in-progress",
  ).length;
}

export type HeadlineCard = {
  label: string;
  value: string;
  sub: string;
  body: string;
  accent: string;
};

/**
 * The three cards, in the order a reader should meet them: what the council
 * said it needed, how it measures up, and what the auditors are still waiting
 * on.
 */
export function headlineCards(record: CouncilAccountabilityRecord): HeadlineCard[] {
  const gap = gapFor(record.councilSlug);
  const tally = benchmarkTally(record.councilSlug);
  const open = openFindingCount(record);
  const shortName = record.councilName.replace(/ Council$/, "");

  const surplus = gap !== undefined && gap < 0;
  const moneyValue = gap === undefined ? "—" : `£${Math.abs(gap).toLocaleString("en-GB")}m`;

  return [
    {
      label: surplus ? "Money it had spare" : "Extra money it said it needed",
      value: moneyValue,
      sub: surplus ? "when the budget was set" : "to pay for planned services",
      body: surplus
        ? `${shortName} was the only council in Scotland that did not ask for more. It set its budget with money to spare.`
        : gap === undefined
          ? "No budget gap has been published for this council yet."
          : `Nearly every council says this every year. It is a plan, not money missing from the bank. The law says the budget must balance, so it always gets closed — usually partly by your council tax.`,
      accent: surplus ? "var(--good)" : "var(--action)",
    },
    {
      label: "Worse than the Scotland average",
      value: tally.scored > 0 ? `${tally.worse} of ${tally.scored}` : "—",
      sub: tally.scored > 0 ? "measures compared" : "no measures compared yet",
      body:
        tally.scored > 0
          ? `Every council reports these the same way, so it is a fair comparison. The other ${tally.better} ${tally.better === 1 ? "is" : "are"} better than average.`
          : "No national comparison figures have been matched to this council yet.",
      accent: "var(--brand)",
    },
    {
      label: "Watchdog warnings still open",
      value: String(open),
      sub: open === 1 ? "not signed off" : "not signed off",
      body:
        open > 0
          ? "Independent auditors raised these and they are not closed yet. They do not work for the council."
          : "No open audit finding is recorded here yet. That is not the same as a clean bill of health.",
      accent: "var(--good)",
    },
  ];
}
