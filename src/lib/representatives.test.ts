import test from "node:test";
import assert from "node:assert/strict";
import {
  parseRepresentativePostcode,
  representativePostcodeFromRequest,
} from "./representatives.ts";

test("normalises a valid postcode without retaining the raw input", () => {
  assert.deepEqual(parseRepresentativePostcode("  g12   8qq "), {
    compact: "G128QQ",
    formatted: "G12 8QQ",
  });
  assert.equal(parseRepresentativePostcode("Glasgow"), null);
  assert.equal(parseRepresentativePostcode(128), null);
});

test("reads the normal lookup postcode from a POST body", async () => {
  const request = new Request("https://scotlandcounted.org.uk/api/representatives", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postcode: "eh1 1yz" }),
  });

  assert.deepEqual(await representativePostcodeFromRequest(request), {
    compact: "EH11YZ",
    formatted: "EH1 1YZ",
  });
});

test("keeps GET query support and rejects malformed POST JSON", async () => {
  const getRequest = new Request(
    "https://scotlandcounted.org.uk/api/representatives?postcode=AB10%201AB"
  );
  assert.deepEqual(await representativePostcodeFromRequest(getRequest), {
    compact: "AB101AB",
    formatted: "AB10 1AB",
  });

  const badPost = new Request("https://scotlandcounted.org.uk/api/representatives", {
    method: "POST",
    body: "not-json",
  });
  assert.equal(await representativePostcodeFromRequest(badPost), null);
});
