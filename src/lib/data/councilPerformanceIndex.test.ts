import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  councilPerformanceRows,
  headlineMeasureCount,
  evidenceFamilyCount,
  robustnessRunCount,
} from "./councilPerformanceIndex.ts";

test("the council index contains one complete, unique 32-council result", () => {
  assert.equal(councilPerformanceRows.length, 32);
  assert.equal(new Set(councilPerformanceRows.map((row) => row.code)).size, 32);
  assert.equal(new Set(councilPerformanceRows.map((row) => row.slug)).size, 32);
  assert.deepEqual(
    councilPerformanceRows.map((row) => row.overallRank).sort((a, b) => a - b),
    Array.from({ length: 32 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    councilPerformanceRows.map((row) => row.peerRank).sort((a, b) => a - b),
    Array.from({ length: 32 }, (_, index) => index + 1),
  );
});

test("the public headline reconciles to the five published pillar weights", () => {
  for (const row of councilPerformanceRows) {
    const recomputed =
      row.pillars.residentExperience.score * 0.25 +
      row.pillars.serviceOutcomes.score * 0.4 +
      row.pillars.councilManagement.score * 0.2 +
      row.pillars.valueForMoney.score * 0.1 +
      row.pillars.operationalClimate.score * 0.05;
    assert.ok(
      Math.abs(recomputed - row.overallScore) <= 0.08,
      `${row.name}: published ${row.overallScore}, recomputed ${recomputed}`,
    );
  }
});

test("rank uncertainty and coverage stay inside their declared ranges", () => {
  for (const row of councilPerformanceRows) {
    assert.ok(row.coverage > 0 && row.coverage <= 100, `${row.name}: coverage`);
    assert.ok(row.rankLow >= 1 && row.rankLow <= row.medianRank, `${row.name}: low rank`);
    assert.ok(row.rankHigh >= row.medianRank && row.rankHigh <= 32, `${row.name}: high rank`);
    assert.ok(row.winnerProbability >= 0 && row.winnerProbability <= 100, `${row.name}: winner frequency`);
    assert.ok(row.topFiveProbability >= row.winnerProbability, `${row.name}: top-five frequency`);
    assert.ok(row.topTenProbability >= row.topFiveProbability, `${row.name}: top-ten frequency`);
  }
});

test("the reported leaders and model dimensions remain intentional", () => {
  assert.equal(councilPerformanceRows[0].name, "East Renfrewshire");
  assert.equal(councilPerformanceRows.at(-1)?.name, "Dundee City");
  assert.equal(headlineMeasureCount, 53);
  assert.equal(evidenceFamilyCount, 29);
  assert.equal(robustnessRunCount, 10_000);
});

test("the downloadable headline file retains all 32 rows and precision", () => {
  const path = fileURLToPath(
    new URL("../../../public/data/scottish-council-performance-index-2026.csv", import.meta.url),
  );
  const lines = readFileSync(path, "utf8").trim().split("\n");
  assert.equal(lines.length, 33);
  assert.match(lines[0], /overall_score,overall_rank,peer_score,peer_rank/);
  assert.match(lines[1], /East Renfrewshire/);
  assert.match(lines[1], /68\.579623/);

  const [header, ...records] = lines.map((line) => line.split(","));
  const column = Object.fromEntries(header.map((name, index) => [name, index]));
  for (const record of records) {
    const code = record[column.council_code];
    const publicRow = councilPerformanceRows.find((row) => row.code === code);
    assert.ok(publicRow, `${code}: missing from the website data`);
    assert.equal(publicRow.name, record[column.canonical_name]);
    assert.equal(publicRow.overallRank, Number(record[column.overall_rank]));
    assert.equal(publicRow.peerRank, Number(record[column.peer_rank]));
    assert.equal(publicRow.overallScore, Number(Number(record[column.overall_score]).toFixed(1)));
    assert.equal(publicRow.peerScore, Number(Number(record[column.peer_score]).toFixed(1)));
  }
  assert.equal(councilPerformanceRows.filter((row) => row.coverage === 100).length, 24);
});
