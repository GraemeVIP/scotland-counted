import test from "node:test";
import assert from "node:assert/strict";
import {
  BAND_LETTERS,
  chargesFor,
  councilTaxByBand,
  councilTaxByBand2025,
  councilTaxChangeFor,
  waterCharges2026,
} from "./councilTax.ts";

test("both published council-tax years cover the same 32 councils and eight bands", () => {
  assert.equal(Object.keys(councilTaxByBand2025).length, 32);
  assert.deepEqual(Object.keys(councilTaxByBand).sort(), Object.keys(councilTaxByBand2025).sort());

  for (const slug of Object.keys(councilTaxByBand)) {
    assert.deepEqual(Object.keys(councilTaxByBand[slug]), [...BAND_LETTERS]);
    assert.deepEqual(Object.keys(councilTaxByBand2025[slug]), [...BAND_LETTERS]);
  }
});

test("the change helper compares council tax only", () => {
  const change = councilTaxChangeFor("glasgow-city", "D");
  assert.ok(change);
  assert.equal(change.previous, 1611);
  assert.equal(change.current, 1706);
  assert.equal(change.cash, 95);
  assert.equal(change.percent, (change.cash / change.previous) * 100);

  const bandD = chargesFor("glasgow-city")?.[3];
  assert.ok(bandD);
  assert.equal(
    bandD.total,
    change.current + waterCharges2026.D.water + waterCharges2026.D.wasteWater,
  );
});

test("all 256 published 2026-27 council-tax figures increased from 2025-26", () => {
  for (const slug of Object.keys(councilTaxByBand)) {
    for (const band of BAND_LETTERS) {
      const change = councilTaxChangeFor(slug, band);
      assert.ok(change);
      assert.ok(change.cash > 0, `${slug} Band ${band} should have a positive cash rise`);
      assert.ok(change.percent > 0, `${slug} Band ${band} should have a positive percentage rise`);
    }
  }
});
