import assert from "node:assert/strict";
import test from "node:test";
import {
  councilAccountabilityRecords,
  getCouncilAccountability,
  glasgowCityAccountability,
} from "./councilAccountability.ts";
import { councils } from "./councils.ts";

test("all 32 Scottish councils have an accountability record", () => {
  assert.equal(councilAccountabilityRecords.length, councils.length);
  assert.equal(new Set(councilAccountabilityRecords.map((record) => record.councilSlug)).size, councils.length);
  assert.deepEqual(
    new Set(councilAccountabilityRecords.map((record) => record.councilSlug)),
    new Set(councils.map((council) => council.slug)),
  );
});

test("the Glasgow record has a complete accountability shape", () => {
  assert.equal(getCouncilAccountability("glasgow-city"), glasgowCityAccountability);
  assert.equal(getCouncilAccountability("not-a-council"), undefined);
  assert.ok(glasgowCityAccountability.budgetContext.length >= 2);
  assert.ok(glasgowCityAccountability.outcomes.length >= 3);
  assert.ok(glasgowCityAccountability.auditFindings.length >= 2);
  assert.ok(glasgowCityAccountability.commitments.length >= 2);
  assert.ok(glasgowCityAccountability.knownGaps.length > 0);
});

test("every published accountability claim points to an official source", () => {
  for (const record of councilAccountabilityRecords) {
    const sourceIds = new Set(record.sources.map((source) => source.id));
    assert.ok(record.sources.length > 0, record.councilSlug);
    assert.ok(record.sources.every((source) => /^https:\/\//.test(source.url)), record.councilSlug);
    assert.ok(
      record.sources.every((source) => ["council", "government", "regulator", "audit"].includes(source.kind)),
      record.councilSlug,
    );

    const linkedIds = [
      ...record.budgetContext.flatMap((item) => item.sourceIds),
      ...record.outcomes.flatMap((item) => item.sourceIds),
      ...record.auditFindings.flatMap((item) => item.sourceIds),
      ...record.commitments.flatMap((item) => item.sourceIds),
    ];
    assert.ok(linkedIds.length > 0, record.councilSlug);
    assert.ok(linkedIds.every((id) => sourceIds.has(id)), record.councilSlug);
  }
});

test("missed performance records keep their target and actual separate", () => {
  const missed = glasgowCityAccountability.outcomes.filter((item) => item.status === "missed");
  assert.ok(missed.length >= 3);
  assert.ok(missed.every((item) => item.target && item.actual && item.target !== item.actual));

  const accommodation = glasgowCityAccountability.outcomes.find(
    (item) => item.id === "temporary-accommodation-duty",
  );
  assert.ok(accommodation);
  assert.match(accommodation.comparisonNote ?? "", /percentage|denominator/i);
});

test("unknown commitment outcomes are explicitly labelled for later checking", () => {
  const unverified = glasgowCityAccountability.commitments.filter(
    (item) => item.status === "not-verified",
  );
  assert.ok(unverified.length >= 1);
  assert.ok(unverified.every((item) => /need|not|does not claim|whether/i.test(item.currentEvidence)));
});
