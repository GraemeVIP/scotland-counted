import test from "node:test";
import assert from "node:assert/strict";
import { pressPackFor, pressPackText, pressPackCouncils } from "./pressPack.ts";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "./data/councils.ts";
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { gapFor, isReserveOutlier } from "./data/councilBudgetMechanics.ts";

/*
 * The generator writes sentences under this site's name that a journalist may
 * print without checking. So the tests are not "does it produce output", they
 * are "can it produce a claim the data does not support".
 */

test("every council produces a pack, and only real councils do", () => {
  assert.equal(pressPackCouncils().length, 32);
  for (const council of councils) {
    const pack = pressPackFor(council.slug);
    assert.ok(pack, `${council.slug} produced no pack`);
    assert.ok(pack.facts.length >= 3, `${council.slug} has too few facts`);
  }
  assert.equal(pressPackFor("not-a-council"), null);
});

test("no fact is published without a source", () => {
  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    for (const fact of pack.facts) {
      assert.ok(fact.source.trim().length > 0, `${council.slug}: sourceless fact`);
      assert.ok(fact.text.trim().length > 0, `${council.slug}: empty fact`);
      // Every fact reads as a finished sentence, not a fragment.
      assert.match(fact.text.trim(), /[.!?]$/, `${council.slug}: unfinished sentence`);
    }
  }
});

test("the headline figure matches the dataset, for all 32", () => {
  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    const latest = council.pcts[council.pcts.length - 1];
    const count = council.counts[council.counts.length - 1];
    const first = pack.facts[0].text;

    assert.ok(first.includes(`${latest}%`), `${council.slug}: rate not in the first fact`);
    assert.ok(
      first.includes(count.toLocaleString("en-GB")),
      `${council.slug}: count not in the first fact`,
    );
    assert.ok(
      first.includes(`${SCOTLAND_PCTS[SCOTLAND_PCTS.length - 1]}%`),
      `${council.slug}: no national comparison`,
    );
    assert.ok(first.includes(COUNCIL_YEARS[COUNCIL_YEARS.length - 1]), `${council.slug}: no year`);
  }
});

test("the direction of change is read off the data, never assumed", () => {
  for (const council of councils) {
    if (council.change === 0) continue;
    const pack = pressPackFor(council.slug)!;
    const changeFact = pack.facts.find((f) => f.text.includes("percentage points"));
    assert.ok(changeFact, `${council.slug}: no change sentence`);
    const expected = council.change > 0 ? "rose" : "fell";
    const wrong = council.change > 0 ? "fell" : "rose";
    assert.ok(changeFact.text.includes(expected), `${council.slug}: wrong direction`);
    assert.ok(!changeFact.text.includes(wrong), `${council.slug}: both directions`);
  }
});

test("a superlative is only used when the council actually holds that position", () => {
  /*
   * The real risk in a generator like this. "Worst in Scotland" is a ranking
   * claim, and it is only true when the data puts the council last. This walks
   * every pack, finds every superlative, and checks the council holds a rank
   * that justifies it.
   */
  const SUPERLATIVE =
    /\b(worst|best|most expensive|cheapest|highest|lowest|least satisfied|most satisfied|less .* than any other|more .* than any other|only one)\b/i;

  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    const rows = councilBenchmarks[council.slug] ?? [];
    const holdsAnExtreme = rows.some((r) => r.rank === 1 || r.rank === r.of);
    const gap = gapFor(council.slug);
    const isTheSurplus = gap !== undefined && gap < 0;

    for (const fact of pack.facts) {
      if (!SUPERLATIVE.test(fact.text)) continue;
      // National context sentences are about all councils, not this one.
      if (fact.text.startsWith("Every Scottish council")) continue;
      assert.ok(
        holdsAnExtreme || isTheSurplus,
        `${council.slug} claims a superlative while holding no first or last place: ${fact.text}`,
      );
    }
  }
});

test("no hedged ranking language, which is a judgement rather than a figure", () => {
  const HEDGE = /\b(among the (worst|best|highest|lowest)|one of the (worst|best|highest|lowest)|near the bottom|near the top|relatively (high|low)|significantly|dramatically|shockingly|scandalous)\b/i;
  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    for (const fact of pack.facts) {
      assert.ok(!HEDGE.test(fact.text), `${council.slug}: hedged claim: ${fact.text}`);
    }
  }
});

test("the two reserve outliers carry the warning against ranking them", () => {
  for (const council of councils) {
    if (!isReserveOutlier(council.slug)) continue;
    const pack = pressPackFor(council.slug)!;
    assert.ok(
      pack.notes.some((n) => /outlier/i.test(n)),
      `${council.slug}: ranked without the outlier warning`,
    );
  }
});

test("any pack quoting a budget gap carries the comparison caveat", () => {
  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    const quotesGap = pack.facts.some((f) => /budget gap|surplus of/.test(f.text));
    if (!quotesGap) continue;
    assert.ok(
      pack.notes.some((n) => /caution|like-for-like/i.test(n)),
      `${council.slug}: gap quoted with no caveat`,
    );
  }
});

test("the surplus council is described as a surplus, not a gap", () => {
  const surplus = councils.filter((c) => (gapFor(c.slug) ?? 0) < 0);
  assert.equal(surplus.length, 1);
  const pack = pressPackFor(surplus[0].slug)!;
  assert.ok(pack.facts.some((f) => /reported a surplus/.test(f.text)));
  assert.ok(!pack.facts.some((f) => /identified a budget gap of/.test(f.text)));
});

test("the pasteable version keeps every fact and every source with it", () => {
  const pack = pressPackFor("glasgow-city")!;
  const text = pressPackText(pack);
  for (const fact of pack.facts) {
    assert.ok(text.includes(fact.text), "a fact was dropped from the text version");
    assert.ok(text.includes(fact.source), "a source was dropped from the text version");
  }
  for (const note of pack.notes) assert.ok(text.includes(note), "a caveat was dropped");
  assert.ok(text.includes(pack.pageUrl));
  assert.ok(text.includes(pack.dataFile));
  assert.ok(text.includes(pack.citation));
});

test("no em dashes reach a press pack, in any council", () => {
  for (const council of councils) {
    const text = pressPackText(pressPackFor(council.slug)!);
    assert.ok(!text.includes("\u2014"), `${council.slug}: em dash in the press pack`);
  }
});

test("the boilerplate names the site as publisher, not the consultancy", () => {
  const pack = pressPackFor("glasgow-city")!;
  assert.match(pack.boilerplate, /Scotland Counted/);
  assert.ok(
    !/Strathmark/.test(pack.boilerplate),
    "the press boilerplate is crediting the consultancy again",
  );
});

test("no sentence stutters, in any council", () => {
  /*
   * Caught by reading the output rather than by any assertion above: the
   * boilerplate said "Scotland Counted publishes Scotland Counted publishes",
   * because a prefix was added to a string that already carried it. Cheap to
   * check for every repeated phrase and worth doing on text that goes out
   * under the site's name.
   */
  for (const council of councils) {
    const text = pressPackText(pressPackFor(council.slug)!);
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i + 5 < words.length; i++) {
        const phrase = words.slice(i, i + 3).join(" ");
        const rest = words.slice(i + 3).join(" ");
        assert.ok(
          !rest.startsWith(phrase),
          `${council.slug}: repeated phrase "${phrase}" in: ${sentence.slice(0, 120)}`,
        );
      }
    }
  }
});

test("the headline never contradicts the budget figure", () => {
  /*
   * South Lanarkshire reported a surplus and the headline said "budget gap",
   * because the tail was a single fixed string. A headline that contradicts
   * the fact three lines below it is the one thing a press pack cannot do.
   */
  for (const council of councils) {
    const pack = pressPackFor(council.slug)!;
    const gap = gapFor(council.slug);
    if (gap === undefined) {
      assert.ok(!/gap|surplus/i.test(pack.headline), `${council.slug}: budget claim with no figure`);
    } else if (gap < 0) {
      assert.match(pack.headline, /surplus/i, `${council.slug}: surplus headlined as a gap`);
      assert.ok(!/\bgap\b/i.test(pack.headline), `${council.slug}: says gap and surplus`);
    } else {
      assert.match(pack.headline, /gap/i, `${council.slug}: gap not in the headline`);
      assert.ok(!/surplus/i.test(pack.headline), `${council.slug}: gap headlined as a surplus`);
    }
  }
});
