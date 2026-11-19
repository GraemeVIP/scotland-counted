import test from "node:test";
import assert from "node:assert/strict";
import { calculateLbtt } from "./engine.ts";

test("standard residential LBTT matches Revenue Scotland worked thresholds", () => {
  assert.equal(calculateLbtt(145_000, "standard").totalTax, 0);
  assert.equal(calculateLbtt(175_000, "standard").totalTax, 600);
  assert.equal(calculateLbtt(250_000, "standard").totalTax, 2_100);
  assert.equal(calculateLbtt(325_000, "standard").totalTax, 5_850);
  assert.equal(calculateLbtt(400_000, "standard").totalTax, 13_350);
  assert.equal(calculateLbtt(800_000, "standard").totalTax, 54_350);
});

test("first-time buyer relief extends nil band to £175,000 and caps saving at £600", () => {
  const at175 = calculateLbtt(175_000, "first-time");
  assert.equal(at175.totalTax, 0);
  assert.equal(at175.ftbSaving, 600);

  const at250 = calculateLbtt(250_000, "first-time");
  assert.equal(at250.totalTax, 1_500);
  assert.equal(at250.ftbSaving, 600);

  const at400 = calculateLbtt(400_000, "first-time");
  assert.equal(at400.totalTax, 12_750);
  assert.equal(at400.ftbSaving, 600);
});

test("Additional Dwelling Supplement charges 8% on full price at or above £40,000", () => {
  const under40 = calculateLbtt(39_999, "additional");
  assert.equal(under40.adsTax, 0);
  assert.equal(under40.totalTax, 0);

  const at40 = calculateLbtt(40_000, "additional");
  assert.equal(at40.adsTax, 3_200);
  assert.equal(at40.totalTax, 3_200);

  const at200 = calculateLbtt(200_000, "additional");
  assert.equal(at200.baseTax, 1_100);
  assert.equal(at200.adsTax, 16_000);
  assert.equal(at200.totalTax, 17_100);
});

test("handles zero and negative inputs safely", () => {
  assert.equal(calculateLbtt(0).totalTax, 0);
  assert.equal(calculateLbtt(-50_000).totalTax, 0);
  assert.equal(calculateLbtt(Number.NaN).totalTax, 0);
});
