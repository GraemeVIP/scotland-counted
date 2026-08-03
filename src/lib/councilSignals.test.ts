import { test } from "node:test";
import assert from "node:assert/strict";
import { councilAccountabilityRecords } from "./data/councilAccountability.ts";
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { BUDGET_GAP_2026_27, BRIDGING_ACTIONS, NATIONAL } from "./data/councilBudgetMechanics.ts";
import { benchmarkTally, headlineCards, shortVersion } from "./councilSignals.ts";

test("spending less on each primary pupil is never scored as a win", () => {
  // The bug this locks out: CHN01 was ranked lowest-spend-first, so a council
  // spending less on each child ranked near 1 and rendered green.
  for (const [slug, rows] of Object.entries(councilBenchmarks)) {
    const pupil = rows.find((row) => row.code === "CHN01");
    assert.ok(pupil, `${slug} has no cost-per-pupil row`);
    assert.equal(pupil.direction, "depends", `${slug} scores cost per pupil`);
    assert.ok(pupil.note && pupil.note.length > 0, `${slug} has no note explaining it`);
  }
});

test("a rank phrase never contradicts the Scotland comparison beside it", () => {
  // A council recycling above the Scotland figure was labelled "16th worst in
  // Scotland" on the same card that said it was 3.6 points better. Both true,
  // read together as nonsense.
  for (const [slug, rows] of Object.entries(councilBenchmarks)) {
    for (const row of rows) {
      if (row.direction === "depends") continue;
      const better = row.direction === "lower" ? row.value < row.scotland : row.value > row.scotland;
      const claimsBad = /worst|highest/.test(row.phrase);
      const claimsGood = /best|lowest/.test(row.phrase);
      assert.ok(claimsBad || claimsGood, `${slug} ${row.code}: unparseable phrase "${row.phrase}"`);
      assert.equal(
        better,
        claimsGood,
        `${slug} ${row.code}: "${row.phrase}" but ${row.display} vs Scotland ${row.scotlandDisplay}`,
      );
    }
  }
});

test("unscored measures are excluded from the worse-than-average tally", () => {
  for (const slug of Object.keys(councilBenchmarks)) {
    const tally = benchmarkTally(slug);
    const scoredRows = councilBenchmarks[slug].filter((row) => row.direction !== "depends");
    assert.equal(tally.scored, scoredRows.length, slug);
    assert.equal(tally.worse + tally.better, tally.scored, slug);
  }
});

test("the budget gap table covers every council and keeps the sign", () => {
  assert.equal(Object.keys(BUDGET_GAP_2026_27).length, 32);
  for (const record of councilAccountabilityRecords) {
    assert.ok(
      record.councilSlug in BUDGET_GAP_2026_27,
      `${record.councilSlug} is missing from the gap table`,
    );
  }
  // Audit Scotland Exhibit 5: South Lanarkshire was the one council that
  // reported a surplus. If that flips sign the headline claim goes wrong.
  const surpluses = Object.entries(BUDGET_GAP_2026_27).filter(([, gap]) => gap < 0);
  assert.equal(surpluses.length, NATIONAL.councilsWithSurplus);
  assert.equal(surpluses[0][0], "south-lanarkshire");
  assert.equal(
    Object.values(BUDGET_GAP_2026_27).filter((gap) => gap > 0).length,
    NATIONAL.councilsWithGap,
  );
});

test("council tax is named as the single biggest way the gap was closed", () => {
  // The claim in the explainer is that council tax was the largest action.
  // If a future bulletin changes that, this fails rather than shipping a lie.
  const biggest = [...BRIDGING_ACTIONS].sort((a, b) => b.share - a.share)[0];
  assert.equal(biggest, BRIDGING_ACTIONS[0]);
  assert.match(biggest.action, /council tax/i);
});

test("every council gets three headline numbers, none of them blank", () => {
  for (const record of councilAccountabilityRecords) {
    const cards = headlineCards(record);
    assert.equal(cards.length, 3, record.councilSlug);
    for (const card of cards) {
      assert.notEqual(card.value, "—", `${record.councilSlug}: ${card.label} is an em dash`);
      assert.ok(card.body.length > 20, `${record.councilSlug}: ${card.label} has no body`);
    }
  }
});

test("the surplus council is not described as needing more money", () => {
  const record = councilAccountabilityRecords.find((r) => r.councilSlug === "south-lanarkshire");
  assert.ok(record);
  const text = shortVersion(record) + " " + headlineCards(record)[0].body;
  assert.match(text, /to spare|did not ask for more/i);
  assert.doesNotMatch(headlineCards(record)[0].label, /needed/i);
});

test("plain English: no sentence in the summaries runs long", () => {
  // The site targets a reading age of 11. Long sentences are the single
  // biggest thing that pushes it up, so they fail here rather than ship.
  for (const record of councilAccountabilityRecords) {
    for (const [name, text] of [
      ["summary", record.summary],
      ["shortVersion", shortVersion(record)],
    ] as const) {
      for (const sentence of text.split(/(?<=[.!?])\s+/)) {
        const words = sentence.split(/\s+/).filter(Boolean);
        assert.ok(
          words.length <= 28,
          `${record.councilSlug} ${name}: ${words.length}-word sentence: "${sentence}"`,
        );
      }
    }
  }
});
