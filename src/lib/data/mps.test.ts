import test from "node:test";
import assert from "node:assert/strict";
import snapshot from "./mps.json" with { type: "json" };
import { constituencies } from "./constituencies.ts";

test("MP snapshot covers every Scottish Westminster constituency exactly once", () => {
  assert.equal(snapshot.records.length, 57);
  assert.equal(new Set(snapshot.records.map((mp) => mp.memberId)).size, 57);
  assert.equal(new Set(snapshot.records.map((mp) => mp.constituencySlug)).size, 57);
  assert.deepEqual(
    snapshot.records.map((mp) => mp.constituencySlug).sort(),
    constituencies.map((constituency) => constituency.slug).sort(),
  );
});

test("every MP page has an official identity, source and usable contact route", () => {
  assert.match(snapshot.checkedDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(snapshot.sourceName, "UK Parliament Members API");

  for (const mp of snapshot.records) {
    assert.ok(mp.name, `${mp.constituency} needs a current MP name`);
    assert.ok(mp.party, `${mp.constituency} needs a party`);
    assert.match(mp.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    assert.ok(mp.officeAddress, `${mp.constituency} needs a public postal address`);
    assert.match(mp.photoUrl, /^\/images\/representatives\/mps\/[^/]+\.jpg$/);
    assert.match(mp.photoSourceUrl, /^https:\/\/members\.parliament\.uk\/member\/\d+$/);
    assert.equal(mp.votes?.length, 12);
    assert.equal(mp.profileUrl, `https://members.parliament.uk/member/${mp.memberId}/contact`);
    for (const value of [
      mp.constituency,
      mp.constituencySlug,
      mp.constituencyCode,
      mp.name,
      mp.party,
      mp.email,
      mp.phone,
      mp.officeAddress,
      mp.website,
      mp.profileUrl,
    ]) {
      if (value !== null) assert.equal(value, value.trim(), `${mp.constituency} has whitespace`);
    }
  }
});
