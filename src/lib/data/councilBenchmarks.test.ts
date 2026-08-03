import { test } from "node:test";
import assert from "node:assert/strict";
import { councilBenchmarks } from "./councilBenchmarks.ts";

test("every council has the full set of benchmark rows", () => {
  const slugs = Object.keys(councilBenchmarks);
  assert.equal(slugs.length, 32);
  for (const slug of slugs) {
    assert.equal(councilBenchmarks[slug].length, 7, slug);
  }
});

test("ranks are sane and each indicator covers all 32 councils", () => {
  const byCode = new Map<string, number[]>();
  for (const rows of Object.values(councilBenchmarks)) {
    for (const row of rows) {
      assert.ok(row.rank >= 1 && row.rank <= row.of, `${row.code} rank ${row.rank}`);
      assert.equal(row.of, 32);
      assert.ok(Number.isFinite(row.value));
      assert.ok(row.display.length > 0 && row.phrase.length > 0);
      byCode.set(row.code, [...(byCode.get(row.code) ?? []), row.rank]);
    }
  }
  for (const [code, ranks] of byCode) {
    assert.equal(ranks.length, 32, code);
    assert.ok(ranks.includes(1), `${code} has no rank 1`);
  }
});

test("share-type values are percentages, not fractions", () => {
  for (const rows of Object.values(councilBenchmarks)) {
    for (const row of rows) {
      if (row.display.endsWith("%")) {
        assert.ok(row.value > 1.5, `${row.code} ${row.value} looks like an unconverted fraction`);
      }
    }
  }
});
