import test from "node:test";
import assert from "node:assert/strict";
import { lookupPostcodeArea } from "./postcode.ts";

test("retains both Holyrood geographies from the Scottish postcode directory", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        result: {
          postcode: "G12 8QQ",
          uk_parliamentary_constituency: "Glasgow North",
          scottish_parliamentary_constituency: "Glasgow Kelvin and Maryhill",
          scottish_parliamentary_region: "Glasgow",
          codes: { council_area: "S12000049" },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  assert.deepEqual(await lookupPostcodeArea("G128QQ"), {
    ok: true,
    area: {
      postcode: "G12 8QQ",
      councilCode: "S12000049",
      constituency: "Glasgow North",
      scottishParliamentConstituency: "Glasgow Kelvin and Maryhill",
      scottishParliamentRegion: "Glasgow",
    },
  });
});

test("uses the official Parliament finder for a live postcode missing from SPD", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const responses = [
    new Response(null, { status: 404 }),
    new Response(
      JSON.stringify({
        result: {
          postcode: "PA75 6NU",
          country: "Scotland",
          parliamentary_constituency_2024: "Argyll, Bute and South Lochaber",
          parliamentary_constituency: "Argyll and Bute",
          codes: { admin_district: "S12000035" },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ),
    new Response(
      `
        <h3>Constituency MSP</h3>
        <p>MSP for Argyll and Bute (Constituency)</p>
        <h3>Regional MSPs</h3>
        ${"<p>MSP for Highlands and Islands (Region)</p>".repeat(7)}
      `,
      { status: 200, headers: { "Content-Type": "text/html" } },
    ),
  ];
  globalThis.fetch = async () => responses.shift() as Response;

  assert.deepEqual(await lookupPostcodeArea("PA756NU"), {
    ok: true,
    area: {
      postcode: "PA75 6NU",
      councilCode: "S12000035",
      constituency: "Argyll, Bute and South Lochaber",
      scottishParliamentConstituency: "Argyll and Bute",
      scottishParliamentRegion: "Highlands and Islands",
    },
  });
});

test("does not invent Holyrood areas when the official fallback is ambiguous", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const responses = [
    new Response(null, { status: 404 }),
    new Response(
      JSON.stringify({
        result: {
          postcode: "PA75 6NU",
          country: "Scotland",
          parliamentary_constituency_2024: "Argyll, Bute and South Lochaber",
          codes: { admin_district: "S12000035" },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
    new Response("<p>The finder could not return one clear area.</p>", { status: 200 }),
  ];
  globalThis.fetch = async () => responses.shift() as Response;

  const result = await lookupPostcodeArea("PA756NU");
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.area.scottishParliamentConstituency, null);
  assert.equal(result.area.scottishParliamentRegion, null);
});
