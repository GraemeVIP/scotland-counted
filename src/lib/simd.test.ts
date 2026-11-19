import test from "node:test";
import assert from "node:assert/strict";
import { simdFromRank, SIMD_TOTAL_DATA_ZONES } from "./simd.ts";

test("SIMD decile and quintile boundaries match 6,976 Scottish data zones", () => {
  const most = simdFromRank(1);
  assert.equal(most?.decile, 1);
  assert.equal(most?.quintile, 1);

  const mid = simdFromRank(4011);
  assert.equal(mid?.decile, 6);
  assert.equal(mid?.quintile, 3);

  const least = simdFromRank(SIMD_TOTAL_DATA_ZONES);
  assert.equal(least?.decile, 10);
  assert.equal(least?.quintile, 5);
});

test("rejects invalid SIMD ranks", () => {
  assert.equal(simdFromRank(0), null);
  assert.equal(simdFromRank(-5), null);
  assert.equal(simdFromRank(7000), null);
  assert.equal(simdFromRank(Number.NaN), null);
});
