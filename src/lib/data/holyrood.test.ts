import assert from "node:assert/strict";
import test from "node:test";
import {
  getHolyroodRegionalMsp,
  getSnapshotHolyroodRepresentatives,
  holyroodConstituencies,
  holyroodRegions,
} from "./holyrood.ts";

test("Holyrood snapshot contains every current geography and a complete regional set", () => {
  assert.equal(holyroodConstituencies.length, 73);
  assert.equal(holyroodRegions.length, 8);
  assert.ok(holyroodRegions.every((region) => region.msps.length === 7));
  assert.equal(new Set(holyroodConstituencies.map((item) => item.constituencySlug)).size, 73);
  assert.equal(new Set(holyroodRegions.map((item) => item.regionSlug)).size, 8);
});

test("every constituency maps to a known region and every record has official contact data", () => {
  const regionSlugs = new Set(holyroodRegions.map((item) => item.regionSlug));

  for (const constituency of holyroodConstituencies) {
    assert.ok(regionSlugs.has(constituency.regionSlug), constituency.constituency);
    assert.match(constituency.msp.email, /@parliament\.scot$/i);
    assert.match(constituency.msp.profileUrl, /^https:\/\/www\.parliament\.scot\/msps\//);
  }

  for (const region of holyroodRegions) {
    for (const msp of region.msps) {
      assert.match(msp.email, /@parliament\.scot$/i);
      assert.match(msp.profileUrl, /^https:\/\/www\.parliament\.scot\/msps\//);
      assert.match(msp.photoUrl, /^\/images\/representatives\/msps\/[^/]+\.jpg$/);
      assert.match(msp.photoSourceUrl, /^https:\/\/www\.parliament\.scot\/msps\//);
      assert.ok(msp.memberId > 0);
      assert.ok(msp.termStart);
      assert.ok(Array.isArray(msp.votes));
    }
  }
});

test("regional MSP records resolve directly by person slug", () => {
  const record = getHolyroodRegionalMsp("west-scotland", "david-smith");
  assert.ok(record);
  assert.equal(record.name, "David Smith");
  assert.equal(record.party, "Reform UK");
  assert.ok(record.votes.length > 0);
  assert.equal(getHolyroodRegionalMsp("west-scotland", "not-a-person"), undefined);
});

test("snapshot fallback returns one local MSP and seven regional MSPs without guessing", () => {
  const result = getSnapshotHolyroodRepresentatives("Glasgow Kelvin and Maryhill", "Glasgow");

  assert.ok(result);
  assert.equal(result.constituencyMsp.name, "Bob Doris");
  assert.equal(result.constituencyMsp.representationType, "constituency");
  assert.equal(result.regionalMsps.length, 7);
  assert.ok(result.regionalMsps.every((msp) => msp.representationType === "regional"));
  assert.equal(
    getSnapshotHolyroodRepresentatives("Glasgow Kelvin and Maryhill", "South Scotland"),
    null,
  );
});

test("the known postcodes.io region label maps exactly without enabling fuzzy guesses", () => {
  const result = getSnapshotHolyroodRepresentatives(
    "Airdrie",
    "Central Scotland and Lothians West",
  );

  assert.ok(result);
  assert.equal(result.constituencyMsp.name, "Neil Gray");
  assert.equal(result.regionalMsps.length, 7);
  assert.ok(
    result.regionalMsps.every(
      (msp) => msp.constituency === "Central Scotland and Lothians West",
    ),
  );
  const publicRegion = holyroodRegions.find(
    (region) => region.region === "Central Scotland and Lothians West",
  );
  assert.ok(publicRegion);
  assert.equal(publicRegion.regionSlug, "central-scotland-and-lothians-west");
  assert.ok(
    holyroodConstituencies
      .filter((item) => item.regionSlug === publicRegion.regionSlug)
      .every((item) => item.region === publicRegion.region),
  );
  assert.equal(
    getSnapshotHolyroodRepresentatives("Airdrie", "Central Scotland Lothians West"),
    null,
  );
});
