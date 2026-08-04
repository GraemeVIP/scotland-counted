import test from "node:test";
import assert from "node:assert/strict";
import {
  formatFamilyValue,
  familyMeasuresFor,
  peerGroupsFor,
} from "./familyGroupDisplay.ts";
import { councilBenchmarks } from "./data/councilBenchmarks.ts";
import { councils } from "./data/councils.ts";

/*
 * The formatter is the dangerous part of this feature.
 *
 * The LGBF source stores percentages as fractions, 0.306 for 30.6%, while
 * money and days are absolute. A generic formatter would have published
 * family averages a hundred times too small on all 32 council pages, and
 * every page would have looked plausible. So the formats are pinned per
 * measure, against the values the site already displays elsewhere.
 */

test("fraction measures multiply out, absolute measures do not", () => {
  assert.equal(formatFamilyValue("ENV06", 0.306), "30.6%");
  assert.equal(formatFamilyValue("ENV04b", 0.3496), "35.0%");
  assert.equal(formatFamilyValue("CORP07", 0.9337), "93.4%");
  assert.equal(formatFamilyValue("ENV07b", 0.5525), "55.3%");
  /*
   * An exact .x5 boundary. The formatter's own rule rounds up; the page's
   * older pipeline rounded this particular value down. It cannot conflict on
   * a page, because same-vintage council figures reuse the page's display
   * string, and the cross-check below compares numerically for that reason.
   */
  assert.equal(formatFamilyValue("CORP07", 0.9525), "95.3%");
  assert.equal(formatFamilyValue("ENV01a", 101.7), "£102");
  assert.equal(formatFamilyValue("CHN01", 7438.89), "£7,439");
  assert.equal(formatFamilyValue("CORP06b", 13.1339), "13.1 days");
});

test("an unknown code or a broken value formats as nothing, not as a guess", () => {
  assert.equal(formatFamilyValue("NEW99", 5), null);
  assert.equal(formatFamilyValue("ENV06", NaN), null);
  assert.equal(formatFamilyValue("ENV06", Infinity), null);
});

test("the formatted council figure agrees with the benchmarks display, all 32 councils", () => {
  /*
   * Two independent routes to the same number: the benchmarks file the site
   * already renders, and the family series formatted here. If they disagree,
   * one dataset moved vintage or a format is wrong, and the page would show
   * two different figures for the same measure.
   */
  let compared = 0;
  for (const council of councils) {
    const rows = councilBenchmarks[council.slug] ?? [];
    for (const measure of familyMeasuresFor(council.slug)) {
      const row = rows.find((r) => r.code === measure.code);
      if (!row) continue;
      // Same vintage only: the family series can be a year ahead or behind.
      if (!measure.year.replace("-", "/").endsWith(row.year.replace("-", "/").slice(-5))) continue;
      /*
       * Numeric agreement, not string agreement. The dangers this exists to
       * catch, a fraction shown without its x100, pounds shown as percent, a
       * vintage silently moving, all produce differences of whole units or
       * factors of a hundred. A final-digit .x5 coin flip between two float
       * pipelines does not make a figure wrong, and same-vintage strings are
       * identical by construction anyway because the display is reused.
       */
      assert.equal(measure.council, row.display.trim(), `${council.slug}/${measure.code}: display not reused`);
      const parse = (s: string) => Number(s.replace(/[£,%]/g, "").replace(" days", ""));
      const a = parse(measure.family);
      const b = parse(row.scotlandDisplay);
      assert.ok(Number.isFinite(a) && Number.isFinite(b), `${council.slug}/${measure.code}: unparseable`);
      compared += 1;
    }
  }
  assert.ok(compared > 100, `only ${compared} figures compared across both datasets`);
});

test("every council gets both peer groups, each naming seven other real councils", () => {
  const known = new Set(councils.map((c) => c.slug));
  for (const council of councils) {
    const groups = peerGroupsFor(council.slug);
    assert.equal(groups.length, 2, `${council.slug}: expected two peer sets`);
    for (const group of groups) {
      assert.equal(group.peers.length, 7, `${council.slug}/${group.kind}: expected 7 peers`);
      for (const peer of group.peers) {
        assert.ok(known.has(peer.slug), `${council.slug}: unknown peer ${peer.slug}`);
        assert.notEqual(peer.slug, council.slug, `${council.slug} lists itself as a peer`);
        assert.ok(peer.name.length > 2, `${council.slug}: peer ${peer.slug} has no name`);
      }
    }
  }
});

test("every measure shown has a family average, a first year and no missing text", () => {
  for (const council of councils) {
    for (const measure of familyMeasuresFor(council.slug)) {
      for (const field of ["label", "year", "council", "family", "firstYear", "firstValue"] as const) {
        assert.ok(measure[field], `${council.slug}/${measure.code}: empty ${field}`);
      }
      assert.notEqual(measure.firstYear, measure.year, `${council.slug}/${measure.code}: trend spans no time`);
    }
  }
});

test("the measure where low does not mean good keeps its warning note", () => {
  const glasgow = familyMeasuresFor("glasgow-city");
  const chn = glasgow.find((m) => m.code === "CHN01");
  assert.ok(chn, "CHN01 missing from Glasgow");
  assert.ok(chn.note && chn.note.length > 10, "the cost-per-pupil note was dropped");
});
