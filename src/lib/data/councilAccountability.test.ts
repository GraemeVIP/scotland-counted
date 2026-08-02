import assert from "node:assert/strict";
import test from "node:test";
import {
  councilAccountabilityRecords,
  getCouncilAccountability,
  glasgowCityAccountability,
} from "./councilAccountability.ts";

test("the Glasgow prototype has a complete accountability shape", () => {
  assert.equal(councilAccountabilityRecords.length, 1);
  assert.equal(getCouncilAccountability("glasgow-city"), glasgowCityAccountability);
  assert.equal(getCouncilAccountability("not-a-council"), undefined);
  assert.ok(glasgowCityAccountability.budgetContext.length >= 2);
  assert.ok(glasgowCityAccountability.outcomes.length >= 3);
  assert.ok(glasgowCityAccountability.auditFindings.length >= 2);
  assert.ok(glasgowCityAccountability.commitments.length >= 2);
  assert.ok(glasgowCityAccountability.knownGaps.length > 0);
});

test("every published accountability claim points to an official source", () => {
  const sourceIds = new Set(glasgowCityAccountability.sources.map((source) => source.id));
  assert.ok(glasgowCityAccountability.sources.every((source) => /^https:\/\//.test(source.url)));
  assert.ok(
    glasgowCityAccountability.sources.every((source) =>
      ["council", "government", "regulator", "audit"].includes(source.kind),
    ),
  );

  const linkedIds = [
    ...glasgowCityAccountability.budgetContext.flatMap((item) => item.sourceIds),
    ...glasgowCityAccountability.outcomes.flatMap((item) => item.sourceIds),
    ...glasgowCityAccountability.auditFindings.flatMap((item) => item.sourceIds),
    ...glasgowCityAccountability.commitments.flatMap((item) => item.sourceIds),
  ];
  assert.ok(linkedIds.length > 0);
  assert.ok(linkedIds.every((id) => sourceIds.has(id)));
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

