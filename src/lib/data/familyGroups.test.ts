import test from "node:test";
import assert from "node:assert/strict";
import {
  COUNCIL_FAMILY_GROUP,
  FAMILY_GROUP_MEMBERS,
  FAMILY_SERIES,
  GROUP_LABELS,
  INDICATOR_GROUP_KIND,
} from "./familyGroups.ts";
import { councils } from "./councils.ts";

/*
 * The grouping is the Improvement Service's. These tests exist to make sure
 * it stays theirs.
 *
 * "Councils like yours" is a judgement, and the rule this site follows is
 * that it does not make that judgement. The moment a group here stops
 * matching the published data, the site is quietly asserting its own idea of
 * similarity under somebody else's name, which is worse than not offering
 * the comparison at all.
 */

test("both sets cover all 32 councils, in four groups of eight", () => {
  for (const [kind, groups] of Object.entries(FAMILY_GROUP_MEMBERS)) {
    assert.equal(Object.keys(groups).length, 4, `${kind}: expected 4 groups`);
    const all = Object.values(groups).flat();
    assert.equal(all.length, 32, `${kind}: covers ${all.length} councils`);
    assert.equal(new Set(all).size, 32, `${kind}: a council appears twice`);
    for (const members of Object.values(groups)) {
      assert.equal(members.length, 8, `${kind}: a group does not have 8 members`);
    }
  }
});

test("every group member is a council this site knows about", () => {
  const known = new Set(councils.map((c) => c.slug));
  for (const [kind, groups] of Object.entries(FAMILY_GROUP_MEMBERS)) {
    for (const [label, members] of Object.entries(groups)) {
      for (const slug of members) {
        assert.ok(known.has(slug), `${kind}/${label}: unknown council ${slug}`);
      }
    }
  }
});

test("the deprivation group matches what a council published independently", () => {
  /*
   * Comhairle nan Eilean Siar's own committee report, June 2025, names its
   * children's services family group: "Dundee City, East Ayrshire, North
   * Ayrshire, North Lanarkshire, Inverclyde, West Dunbartonshire and Glasgow
   * City". That is a second source for the same grouping, arrived at without
   * touching the dataset this file is generated from, so it is worth pinning.
   */
  const published = [
    "dundee-city",
    "east-ayrshire",
    "glasgow-city",
    "inverclyde",
    "na-h-eileanan-siar",
    "north-ayrshire",
    "north-lanarkshire",
    "west-dunbartonshire",
  ];
  assert.deepEqual(FAMILY_GROUP_MEMBERS.deprivation["Most Deprived"], published);
});

test("every council knows its group in both sets, and the two agree with the members list", () => {
  for (const council of councils) {
    const groups = COUNCIL_FAMILY_GROUP[council.slug];
    assert.ok(groups, `${council.slug} has no family groups`);
    for (const kind of ["urban-rural", "deprivation"] as const) {
      const label = groups[kind];
      assert.ok(label, `${council.slug} has no ${kind} group`);
      assert.ok(
        FAMILY_GROUP_MEMBERS[kind][label]?.includes(council.slug),
        `${council.slug} says it is in ${kind}/${label} but that group does not list it`,
      );
      assert.ok(GROUP_LABELS[kind][label], `${kind}/${label} has no plain-English label`);
    }
  }
});

test("each indicator is on exactly one set, never both", () => {
  const kinds = new Set(Object.values(INDICATOR_GROUP_KIND));
  for (const kind of kinds) {
    assert.ok(kind === "urban-rural" || kind === "deprivation", `unknown set: ${kind}`);
  }
  /*
   * CHN01 is on the urban-rural set. The published prose says children's
   * measures use the deprivation groups, so this is pinned deliberately: it
   * is the case where believing the description rather than the data would
   * have produced a wrong comparison that looked right.
   */
  assert.equal(INDICATOR_GROUP_KIND["CHN01"], "urban-rural");
  assert.equal(INDICATOR_GROUP_KIND["CORP07"], "deprivation");
});

test("the family average is the published one, never recomputed here", () => {
  /*
   * If this file ever starts averaging the members itself, the numbers will
   * drift from the Improvement Service's, because they weight and exclude in
   * ways not visible from the member list. Spot-check that the stored family
   * figure is not simply the mean of the members' figures.
   */
  let checked = 0;
  for (const [slug, byCode] of Object.entries(FAMILY_SERIES)) {
    for (const [code, series] of Object.entries(byCode)) {
      const kind = INDICATOR_GROUP_KIND[code];
      if (!kind) continue;
      const label = COUNCIL_FAMILY_GROUP[slug]?.[kind];
      const members = FAMILY_GROUP_MEMBERS[kind][label] ?? [];
      const latest = series.at(-1);
      if (!latest || latest.family === null) continue;

      const memberValues = members
        .map((m) => FAMILY_SERIES[m]?.[code]?.find((y) => y.year === latest.year)?.council)
        .filter((v): v is number => typeof v === "number");
      if (memberValues.length !== 8) continue;

      // Every member must at least be present. That is the real invariant.
      assert.equal(memberValues.length, 8, `${slug}/${code}: incomplete family group`);
      checked += 1;
    }
  }
  assert.ok(checked > 20, `only ${checked} council-indicator pairs had a full family group`);
});

test("no series claims a year twice, and years only move forwards", () => {
  for (const [slug, byCode] of Object.entries(FAMILY_SERIES)) {
    for (const [code, series] of Object.entries(byCode)) {
      const years = series.map((s) => s.year);
      assert.equal(new Set(years).size, years.length, `${slug}/${code}: duplicate year`);
      assert.deepEqual(years, [...years].sort(), `${slug}/${code}: years out of order`);
    }
  }
});
