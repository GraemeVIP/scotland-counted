import test from "node:test";
import assert from "node:assert/strict";
import {
  parseRepresentativePostcode,
  representativePagePath,
  representativePostcodeFromRequest,
  type Representative,
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

test("builds the matching public contact page for every representative type", () => {
  const common = {
    name: "Example Person",
    party: "Example Party",
    email: "example@parliament.test",
    profileUrl: "https://example.test/profile",
  };

  assert.equal(
    representativePagePath({
      ...common,
      role: "MP",
      constituency: "Inverness, Skye and West Ross-shire",
    } as Representative),
    "/representatives/mps/inverness-skye-and-west-ross-shire"
  );
  assert.equal(
    representativePagePath({
      ...common,
      role: "MSP",
      representationType: "constituency",
      constituency: "Na h-Eileanan an Iar",
    } as Representative),
    "/representatives/msps/constituencies/na-h-eileanan-an-iar"
  );
  assert.equal(
    representativePagePath({
      ...common,
      role: "MSP",
      representationType: "regional",
      name: "David Smith",
      constituency: "Central Scotland and Lothians West",
    } as Representative),
    "/representatives/msps/regions/central-scotland-and-lothians-west/david-smith"
  );
});
