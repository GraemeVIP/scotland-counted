import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  analyticsCookieNamesFromHeader,
  choiceFromFlags,
  flagsFromChoice,
  shouldRunAnalyticsOnHost,
} from "./consent.ts";

describe("shouldRunAnalyticsOnHost", () => {
  it("allows production hostnames", () => {
    assert.equal(shouldRunAnalyticsOnHost("scotlandcounted.org.uk"), true);
    assert.equal(shouldRunAnalyticsOnHost("www.scotlandcounted.org.uk"), true);
  });

  it("blocks local and preview hostnames", () => {
    assert.equal(shouldRunAnalyticsOnHost("localhost"), false);
    assert.equal(shouldRunAnalyticsOnHost("127.0.0.1"), false);
    assert.equal(shouldRunAnalyticsOnHost("scotland-counted.vercel.app"), false);
    assert.equal(shouldRunAnalyticsOnHost("preview.local"), false);
    assert.equal(shouldRunAnalyticsOnHost(""), false);
  });
});

describe("choiceFromFlags and flagsFromChoice", () => {
  it("maps every toggle combination cleanly", () => {
    assert.equal(choiceFromFlags({ clarity: true, ga4: true }), "accepted");
    assert.equal(choiceFromFlags({ clarity: true, ga4: false }), "clarity-only");
    assert.equal(choiceFromFlags({ clarity: false, ga4: true }), "ga4-only");
    assert.equal(choiceFromFlags({ clarity: false, ga4: false }), "rejected");
    assert.deepEqual(flagsFromChoice("clarity-only"), { clarity: true, ga4: false });
    assert.deepEqual(flagsFromChoice(null), { clarity: false, ga4: false });
  });
});

describe("analyticsCookieNamesFromHeader", () => {
  it("extracts Clarity and GA4 cookies without touching unrelated cookies", () => {
    const header = "theme=dark; _clck=abc%5E2; _clsk=xyz; _ga=GA1.1.123; _ga_5XZC7EX4KP=GS1.1; session=keep";
    assert.deepEqual(analyticsCookieNamesFromHeader(header), [
      "_clck",
      "_clsk",
      "_ga",
      "_ga_5XZC7EX4KP",
    ]);
    assert.deepEqual(
      analyticsCookieNamesFromHeader(header, { clarity: true, ga4: false }),
      ["_clck", "_clsk"],
    );
  });
});
