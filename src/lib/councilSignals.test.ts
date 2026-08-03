import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { councilAccountabilityRecords } from "./data/councilAccountability.ts";
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { BUDGET_GAP_2026_27, BRIDGING_ACTIONS, NATIONAL, gapFor } from "./data/councilBudgetMechanics.ts";
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

/**
 * Words a tabloid reader should not have to decode. The site is written for
 * someone who reads at around age 8 to 10 — "shortfall" shipped in the budget
 * explainer and had to be pulled, so the list is enforced rather than
 * remembered. Code identifiers are stripped before the check, so `hasSurplus`
 * and `items-baseline` are fine; only words a reader would see count.
 */
const BANNED_WORDS = [
  "shortfall", "outlier", "deprivation", "deprived", "inflation", "allocation",
  "expenditure", "procurement", "mitigat", "statutory", "sustainab", "cumulative",
  "aggregate", "methodolog", "governance", "scrutiny", "utilis", "fiscal",
  "recurring", "per capita", "revenue budget",
];

function assertPlain(where: string, text: string) {
  for (const word of BANNED_WORDS) {
    const found = new RegExp(word, "i").exec(text);
    assert.equal(
      found,
      null,
      `${where}: "${found?.[0]}" is too hard for this site's reader — ${text
        .slice(Math.max(0, (found?.index ?? 0) - 40), (found?.index ?? 0) + 60)
        .replace(/\s+/g, " ")}`,
    );
  }
}

test("the site's own council prose avoids words a tabloid reader would trip on", () => {
  for (const record of councilAccountabilityRecords) {
    assertPlain(`${record.councilSlug} summary`, record.summary);
    assertPlain(`${record.councilSlug} shortVersion`, shortVersion(record));
    for (const card of headlineCards(record)) {
      assertPlain(`${record.councilSlug} card`, `${card.label} ${card.sub} ${card.body}`);
    }
  }
  for (const [slug, rows] of Object.entries(councilBenchmarks)) {
    for (const row of rows) {
      assertPlain(`${slug} ${row.code}`, `${row.label} ${row.plain} ${row.phrase} ${row.note ?? ""}`);
    }
  }
});

test("the council components avoid the same words in their visible copy", () => {
  const files = [
    "src/components/BudgetGapExplainer.tsx",
    "src/components/AccountabilityMethodNote.tsx",
    "src/components/CouncilCompare.tsx",
    "src/app/(site)/councils/page.tsx",
  ];
  // Only what a reader actually sees: JSX text nodes, plus the prose held in
  // string and template literals for the conditional copy. Anything that looks
  // like a Tailwind class or a design token is not prose.
  const isProse = (s: string) =>
    s.split(/\s+/).filter(Boolean).length >= 4 && !/-\[|var\(--|https?:|^[a-z-]+:/.test(s);

  for (const file of files) {
    const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
    const literals: string[] = [];
    let stripped = "";

    // A regex cannot do this: className={`... ${x} ...`} nests backticks inside
    // template holes, and naive pairing silently swallows the real copy. Walk
    // the source instead, collecting literals and blanking them as we go so the
    // JSX text pass afterwards sees only markup.
    for (let i = 0; i < source.length; ) {
      const c = source[i];
      if (c === "/" && source[i + 1] === "/") {
        while (i < source.length && source[i] !== "\n") i++;
        continue;
      }
      if (c === "/" && source[i + 1] === "*") {
        i = source.indexOf("*/", i) + 2;
        continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        let buf = "";
        while (j < source.length && source[j] !== c) {
          if (source[j] === "\\") { buf += source[j + 1]; j += 2; } else buf += source[j++];
        }
        literals.push(buf);
        stripped += " ";
        i = j + 1;
        continue;
      }
      if (c === "`") {
        let j = i + 1;
        let buf = "";
        while (j < source.length && source[j] !== "`") {
          if (source[j] === "\\") { buf += source[j + 1]; j += 2; continue; }
          if (source[j] === "$" && source[j + 1] === "{") {
            let depth = 1;
            j += 2;
            while (j < source.length && depth > 0) {
              if (source[j] === "{") depth++;
              else if (source[j] === "}") depth--;
              j++;
            }
            continue;
          }
          buf += source[j++];
        }
        literals.push(buf);
        stripped += " ";
        i = j + 1;
        continue;
      }
      stripped += c;
      i++;
    }

    const visible = literals.filter(isProse);
    for (const [, node] of stripped.matchAll(/>([^<>{}]+)</g)) {
      if (isProse(node)) visible.push(node);
    }
    assert.ok(visible.length > 3, `${file}: extracted ${visible.length} strings — the matcher is broken`);
    assertPlain(file, visible.join(" • "));
  }
});

test("every number in a council summary traces to sourced material", () => {
  // The summaries lead with the strongest finding, which means they carry the
  // numbers a reader is most likely to repeat. Each one must already appear in
  // the record's own sourced fields or in the national benchmarking file —
  // a lede is a place to put the evidence first, not to introduce new claims.
  const asNumbers = /£?\d[\d,]*(?:\.\d+)?%?/g;
  const strip = (s: string) => s.replace(/[£,%]/g, "");

  for (const record of councilAccountabilityRecords) {
    const rows = councilBenchmarks[record.councilSlug] ?? [];
    const sourced = [
      ...record.auditFindings.flatMap((f) => [f.title, f.finding, f.recommendation ?? ""]),
      ...record.outcomes.flatMap((o) => [o.measure, o.target, o.actual, o.variance ?? ""]),
      ...record.commitments.flatMap((c) => [c.commitment, c.currentEvidence]),
      ...record.budgetContext.flatMap((b) => [b.plainEnglish, String(b.value)]),
      ...record.knownGaps,
      ...rows.flatMap((x) => [x.display, x.scotlandDisplay, String(x.value), String(x.scotland), String(x.of)]),
      String(gapFor(record.councilSlug) ?? ""),
    ].join(" ");

    const known = new Set((sourced.match(asNumbers) ?? []).map(strip));
    for (const n of [...known]) {
      const value = Number(n);
      if (Number.isFinite(value)) {
        known.add(String(Math.round(value)));
        known.add(value.toFixed(1));
      }
    }
    // The distance from the Scotland figure is a derivation the compare card
    // already renders ("£669 less than the Scotland figure"), so a summary may
    // use it too. Scoped to the two numbers of a single row on purpose: allowing
    // differences between any two sourced figures would back almost anything.
    for (const row of rows) {
      const diff = Math.abs(row.value - row.scotland);
      known.add(String(Math.round(diff)));
      known.add(diff.toFixed(1));
    }

    for (const raw of record.summary.match(asNumbers) ?? []) {
      const n = strip(raw);
      if (/^(19|20)\d\d$/.test(n)) continue; // a year is not a claim
      assert.ok(
        known.has(n) || known.has(String(Math.round(Number(n)))),
        `${record.councilSlug}: "${raw}" in the summary is not in any sourced field`,
      );
    }
  }
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
