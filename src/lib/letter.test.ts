import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildLetter } from "./letter.ts";
import { topicById } from "./data/letterTopics.ts";

const SAMPLE_AREA = {
  name: "Glasgow City",
  pct: 36.1,
  count: 39319,
  firstPct: 27.1,
  firstYear: "2014/15",
  latestYear: "2023/24",
  scotlandPct: 23.0,
};

describe("buildLetter open-question default", () => {
  it("omits policy demands unless includeAsks is explicitly enabled", () => {
    const body = buildLetter({
      area: SAMPLE_AREA,
      role: "MP",
      topics: [topicById("cost-of-living")],
      personal: "My energy bill doubled this winter.",
    });
    assert.ok(body.includes("My energy bill doubled this winter."));
    assert.ok(!body.includes("What I would like changed"));
    assert.ok(!body.includes("Support raising the level of Universal Credit"));
  });

  it("includes deduplicated policy points only when includeAsks is true", () => {
    const body = buildLetter({
      area: SAMPLE_AREA,
      role: "MP",
      topics: [topicById("cost-of-living")],
      includeAsks: true,
    });
    assert.ok(body.includes("What I would like changed"));
    assert.ok(body.includes("Support raising the level of Universal Credit"));
  });
});
