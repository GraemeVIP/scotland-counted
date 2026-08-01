/**
 * Tax engine tests. Run with `npm test` (node --test, no dependencies).
 *
 * Ported unchanged from the standalone calculator so the port can be proved not
 * to have altered the maths, plus a block at the end pinning the figures this
 * site publishes editorially — if a rate change moves the minimum-wage
 * take-home, these fail before the pages go out with a stale number.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseTaxCode,
  personalAllowance,
  calculate,
  solveGross,
  type Region,
  type TaxCode,
} from "./engine.ts";

const near = (actual: number, expected: number, eps = 0.01) =>
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);

const REGIONS: Region[] = ["ruk", "scotland"];
const code = (c: string) => parseTaxCode(c) as TaxCode;

/* ── Income tax & NI: defaults, both regions ─────────────── */

test("below personal allowance: no tax, no NI", () => {
  for (const region of REGIONS) {
    const r = calculate(10000, region);
    near(r.tax.total, 0);
    near(r.ni.total, 0);
    near(r.net, 10000);
  }
});

test("£30,000 rUK", () => {
  const r = calculate(30000, "ruk");
  near(r.tax.total, 3486);
  near(r.ni.total, 1394.4);
  near(r.net, 25119.6);
});

test("£30,000 Scotland (starter/basic/intermediate)", () => {
  const r = calculate(30000, "scotland");
  near(r.tax.total, 3451.07);
  near(r.net, 25154.53);
});

test("£15,000 Scotland: all starter rate", () => {
  near(calculate(15000, "scotland").tax.total, 461.7);
});

test("£50,270 rUK: UEL boundary", () => {
  const r = calculate(50270, "ruk");
  near(r.tax.total, 7540);
  near(r.ni.total, 3016);
});

test("£60,000 both regions", () => {
  near(calculate(60000, "ruk").tax.total, 11432);
  near(calculate(60000, "ruk").ni.total, 3210.6);
  near(calculate(60000, "scotland").tax.total, 13182.05);
});

test("£110,000 rUK: personal allowance taper", () => {
  const r = calculate(110000, "ruk");
  near(r.tax.allowance, 7570);
  near(r.tax.total, 33432);
  near(r.ni.total, 4210.6);
});

test("£150,000: additional/top rate, PA gone", () => {
  near(calculate(150000, "ruk").tax.total, 53703);
  near(calculate(150000, "scotland").tax.total, 59634.35);
});

test("personal allowance taper endpoints", () => {
  assert.equal(personalAllowance(100000), 12570);
  assert.equal(personalAllowance(125140), 0);
});

test("marginal rate in the £100k trap (62% incl. NI)", () => {
  near(calculate(110000, "ruk").marginalRate, 0.62, 0.001);
});

/* ── Tax code parsing ────────────────────────────────────── */

test("parseTaxCode forms", () => {
  assert.equal((code("1257L") as { allowance: number }).allowance, 12570);
  assert.equal((code("s1100l") as { allowance: number }).allowance, 11000);
  assert.equal((code("1257L W1") as { allowance: number }).allowance, 12570);
  assert.equal((code("0T") as { allowance: number }).allowance, 0);
  assert.equal((code("K497") as { kAmount: number }).kAmount, 4970);
  assert.equal(code("BR").type, "flat");
  assert.equal((code("d0") as { flat: string }).flat, "D0");
  assert.equal(code("NT").type, "NT");
  assert.equal(parseTaxCode("XYZ"), null);
  assert.equal(parseTaxCode("12345L"), null);
  assert.equal(code("").code, "1257L");
});

test("tax codes applied at £30,000 rUK", () => {
  const at = (c: string) => calculate(30000, "ruk", { taxCode: code(c) }).tax.total;
  near(at("1100L"), 3800);
  near(at("K497"), 6994);
  near(at("BR"), 6000);
  near(at("D0"), 12000);
  near(at("0T"), 6000);
  near(at("NT"), 0);
});

test("Scottish flat codes use Scottish rates", () => {
  near(calculate(30000, "scotland", { taxCode: code("D0") }).tax.total, 6300); // 21%
  near(calculate(30000, "scotland", { taxCode: code("D3") }).tax.total, 14400); // 48%
});

test("NT code: no tax but NI still due", () => {
  const r = calculate(30000, "ruk", { taxCode: code("NT") });
  near(r.tax.total, 0);
  near(r.ni.total, 1394.4);
});

/* ── Pension: three treatments ───────────────────────────── */

test("net pay pension: reduces tax, not NI", () => {
  const r = calculate(30000, "ruk", { pension: 1500 });
  near(r.tax.total, 3186);
  near(r.ni.total, 1394.4);
  near(r.net, 23919.6);
  near(r.pensionPot, 1500);
});

test("salary sacrifice: reduces tax AND NI (and student loan)", () => {
  const r = calculate(35000, "ruk", { pension: 1750, pensionType: "sac" });
  near(r.tax.total, 4136);
  near(r.ni.total, 1654.4); // £140 NI saved vs net pay
  near(r.net, 27459.6);
  const withLoan = calculate(35000, "ruk", {
    pension: 1750,
    pensionType: "sac",
    studentPlan: "2",
  });
  near(withLoan.sl.total, 347.85); // 9% of (33,250 − 29,385)
});

test("relief at source: full tax/NI, pot grossed up 25%", () => {
  const r = calculate(35000, "ruk", { pension: 1750, pensionType: "ras" });
  near(r.tax.total, 4486);
  near(r.ni.total, 1794.4);
  near(r.net, 26969.6);
  near(r.pensionPot, 2187.5);
});

test("pension restores personal allowance above £100k", () => {
  const r = calculate(110000, "ruk", { pension: 11000 });
  near(r.tax.allowance, 12570);
  near(r.tax.total, 27032);
  near(r.net, 67757.4);
});

test("pension capped at gross", () => {
  const r = calculate(30000, "ruk", { pension: 50000 });
  near(r.pension, 30000);
  near(r.tax.total, 0);
});

/* ── Student loans (2026/27 thresholds) ──────────────────── */

test("Plan 2 at £35,000: 9% over £29,385", () => {
  const r = calculate(35000, "ruk", { studentPlan: "2" });
  near(r.sl.total, 505.35);
  near(r.net, 35000 - 4486 - 1794.4 - 505.35);
});

test("Plan 1 at £40,000: 9% over £26,900", () => {
  near(calculate(40000, "ruk", { studentPlan: "1" }).sl.total, 1179);
});

test("Plan 4 at £40,000: 9% over £33,795", () => {
  near(calculate(40000, "ruk", { studentPlan: "4" }).sl.total, 558.45);
});

test("Plan 5 + postgrad concurrently at £30,000", () => {
  const r = calculate(30000, "ruk", { studentPlan: "5", pgl: true });
  near(r.sl.total, 450 + 540); // 9% over 25k + 6% over 21k
  assert.equal(r.sl.rows.length, 2);
});

test("postgrad alone at £30,000: 6% over £21,000", () => {
  near(calculate(30000, "ruk", { studentPlan: "pg" }).sl.total, 540);
});

test("below threshold: no repayment", () => {
  near(calculate(25000, "ruk", { studentPlan: "2" }).sl.total, 0);
});

test("student loan included in effective rate and marginal", () => {
  const r = calculate(35000, "ruk", { studentPlan: "2" });
  near(r.effectiveRate, (4486 + 1794.4 + 505.35) / 35000, 0.0001);
  near(r.marginalRate, 0.37, 0.001); // 20 + 8 + 9
});

/* ── Reverse solver ──────────────────────────────────────── */

test("solveGross round-trips a plain salary", () => {
  near(solveGross(25119.6, "ruk") as number, 30000, 0.05);
});

test("solveGross with %-pension and student loan", () => {
  const optsFor = (g: number) => ({ pension: g * 0.05, studentPlan: "2" as const });
  const target = calculate(42000, "ruk", optsFor(42000)).net;
  near(solveGross(target, "ruk", optsFor) as number, 42000, 0.05);
});

test("solveGross through the £100k trap", () => {
  const target = calculate(115000, "ruk").net;
  near(solveGross(target, "ruk") as number, 115000, 0.05);
});

test("solveGross returns null when unreachable", () => {
  assert.equal(
    solveGross(30000, "ruk", (g) => ({ pension: g })),
    null
  );
  assert.equal(solveGross(0, "ruk"), null);
});

/* ── Sanity: bands sum to totals ─────────────────────────── */

test("band amounts sum to income tax total", () => {
  for (const region of REGIONS) {
    for (const gross of [20000, 45000, 80000, 120000, 200000]) {
      const r = calculate(gross, region);
      const sum = r.tax.bands.reduce((s, b) => s + b.tax, 0);
      near(sum, r.tax.total, 0.001);
    }
  }
});

/* ── The figures this site publishes ─────────────────────── */

test("minimum wage take-home matches what the site states", () => {
  // £12.71 × 37.5 hours × 52 weeks — the basis used across the site.
  const gross = 12.71 * 37.5 * 52;
  near(gross, 24784.5);
  const r = calculate(gross, "scotland");
  near(r.tax.total, 2403.23);
  near(r.ni.total, 977.16);
  near(r.net, 21404.11);
  near(r.net / 12, 1783.68);
});
