#!/usr/bin/env node
/**
 * Build the all-councils comparison CSV that journalists actually open.
 *
 * One row per council, one column per compared measure, plus the 2026/27
 * budget gap and a Scotland row to compare against. Generated from the same
 * modules the site renders from, so the spreadsheet and the pages can never
 * disagree, regenerate it whenever the benchmarking file is refreshed.
 *
 *   node scripts/build-council-csv.mjs
 *
 * Two naming decisions worth keeping. Years live in the column names, because
 * the road figures are a year fresher than the rest and a stray comparison
 * across years is the easiest mistake to make with a file like this. And the
 * cost-per-pupil rank is named "lowest_spend_first" rather than plain "rank",
 * because spending less on each child is not a league position, naming it
 * "rank" would invite exactly the chart the site refuses to draw.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const { councilAccountabilityRecords } = await import(
  join(root, "src/lib/data/councilAccountability.ts")
);
const { councilBenchmarks, LGBF_SOURCE } = await import(
  join(root, "src/lib/data/councilBenchmarks.ts")
);
const { BUDGET_GAP_2026_27, BUDGET_SOURCE } = await import(
  join(root, "src/lib/data/councilBudgetMechanics.ts")
);

/** Indicator code → column stem. Order sets the column order. */
const MEASURES = [
  { code: "ENV04b", stem: "main_roads_needing_repair_pct" },
  { code: "ENV01a", stem: "bin_collection_cost_per_property_gbp" },
  { code: "CORP07", stem: "council_tax_collected_pct" },
  { code: "CHN01", stem: "cost_per_primary_pupil_gbp", unranked: true },
  { code: "CORP06b", stem: "sick_days_per_employee" },
  { code: "ENV06", stem: "household_waste_recycled_pct" },
  { code: "ENV07b", stem: "street_cleaning_satisfaction_pct" },
];

const yearSuffix = (year) => "_" + year.replace("/", "_").replace(/^(\d{4})_(\d{2})$/, "$1_$2");

// Take the year for each measure from the data rather than hardcoding it.
const sample = councilBenchmarks[Object.keys(councilBenchmarks)[0]];
for (const m of MEASURES) {
  const row = sample.find((r) => r.code === m.code);
  if (!row) throw new Error(`No benchmark row for ${m.code}, has the data file changed?`);
  m.year = row.year;
  m.column = m.stem + yearSuffix(row.year);
  const base = m.stem.replace(/_(pct|gbp|per_employee)$/, "");
  m.rankColumn = m.unranked ? `${base}_rank_lowest_spend_first` : `${base}_rank_best_first`;
  m.scotland = row.scotland;
}

const header = [
  "council",
  "council_code",
  "budget_gap_2026_27_gbp_m",
  ...MEASURES.flatMap((m) => [m.column, m.rankColumn]),
];

const round = (n) => (Number.isFinite(n) ? Math.round(n * 100) / 100 : "");

const rows = [...councilAccountabilityRecords]
  .sort((a, b) => a.councilName.localeCompare(b.councilName))
  .map((record) => {
    const bench = councilBenchmarks[record.councilSlug] ?? [];
    const cells = [record.councilName, record.councilCode, BUDGET_GAP_2026_27[record.councilSlug] ?? ""];
    for (const m of MEASURES) {
      const row = bench.find((r) => r.code === m.code);
      cells.push(row ? round(row.value) : "", row ? row.rank : "");
    }
    return cells;
  });

// Scotland as its own row: the whole point of the file is comparing to it.
rows.push([
  "SCOTLAND (all councils)",
  "S92000003",
  "528.6",
  ...MEASURES.flatMap((m) => [round(m.scotland), ""]),
]);

const escape = (value) => {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n") + "\n";
const out = join(root, "public/data/scottish-councils-benchmarks.csv");
writeFileSync(out, csv, "utf8");

console.log(`Wrote ${out}`);
console.log(`  ${rows.length} rows (${rows.length - 1} councils + Scotland), ${header.length} columns`);
console.log(`  ${Buffer.byteLength(csv, "utf8")} bytes`);
console.log(`  measures: ${MEASURES.map((m) => `${m.code} (${m.year})`).join(", ")}`);
console.log(`  sources: ${LGBF_SOURCE.name}; ${BUDGET_SOURCE.title}`);
