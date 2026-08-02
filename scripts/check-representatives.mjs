#!/usr/bin/env node
/**
 * Does the MP and MSP lookup still work?
 *
 * The lookup joins postcodes.io geography to the official UK Parliament and
 * Scottish Parliament data. The two halves fail independently, so this catches
 * a partial result before a visitor is left without their Holyrood contacts.
 *
 * So this asks the live endpoint for real postcodes and fails loudly if the MSP
 * stops coming back. Run it on a schedule; a red build is the alert.
 *
 *   node scripts/check-representatives.mjs [baseUrl]
 *
 * Exits 0 if every postcode returned one MP, one constituency MSP and exactly
 * seven regional MSPs, 1 otherwise.
 */

const BASE = process.argv[2] || process.env.CHECK_BASE_URL || "http://localhost:3000";

/** Spread across the country, so one closed office does not look like an outage. */
const POSTCODES = [
  { postcode: "G1 1XW", where: "Glasgow" },
  { postcode: "EH1 1YZ", where: "Edinburgh" },
  { postcode: "AB10 1AB", where: "Aberdeen" },
  { postcode: "IV2 3BW", where: "Inverness" },
  // Valid in ONSPD but absent from SPD: exercises the official Parliament
  // postcode-finder fallback rather than only the easy postcode path.
  { postcode: "PA75 6NU", where: "Mull" },
];

const results = [];

for (const { postcode, where } of POSTCODES) {
  const url = `${BASE}/api/representatives`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({ postcode }),
    });
    if (!res.ok) {
      results.push({ where, postcode, ok: false, why: `HTTP ${res.status}` });
      continue;
    }
    const data = await res.json();
    const mp = data?.mp?.name;
    const msp = data?.constituencyMsp?.name;
    const regionalMsps = Array.isArray(data?.regionalMsps) ? data.regionalMsps : [];
    results.push({
      where,
      postcode,
      ok: Boolean(mp && msp && regionalMsps.length === 7),
      mp: mp ?? null,
      msp: msp ?? null,
      region: data?.holyrood?.region ?? null,
      regionalCount: regionalMsps.length,
      mspUnavailable: Boolean(data?.mspUnavailable),
      why: !mp
        ? "no MP returned"
        : !msp
          ? "no constituency MSP returned"
          : regionalMsps.length !== 7
            ? `${regionalMsps.length} regional MSPs returned instead of 7`
            : null,
    });
  } catch (err) {
    results.push({ where, postcode, ok: false, why: err.message });
  }
}

console.log(`Checked ${BASE}\n`);
for (const r of results) {
  const mark = r.ok ? "PASS" : "FAIL";
  console.log(`  ${mark}  ${r.where.padEnd(10)} ${r.postcode.padEnd(9)} MP: ${r.mp ?? "—"}`);
  console.log(`        ${" ".repeat(20)} Constituency MSP: ${r.msp ?? "—"}`);
  console.log(
    `        ${" ".repeat(20)} Regional MSPs: ${r.regionalCount ?? 0}${r.region ? ` (${r.region})` : ""}${r.why ? `  (${r.why})` : ""}`
  );
}

const failed = results.filter((r) => !r.ok);

if (failed.length > 0) {
  console.error(
    `\n${failed.length} of ${results.length} lookups failed.\n` +
      "Check the postcode geography and the official Parliament data responses."
  );
  process.exit(1);
}

console.log(`\nAll ${results.length} lookups returned one MP and all eight MSPs.`);
