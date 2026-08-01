#!/usr/bin/env node
/**
 * Does the MP and MSP lookup still work?
 *
 * The MSP half scrapes parliament.scot with a regex, because Holyrood has no
 * public API. That works until Holyrood changes its markup, and when it does
 * the failure is quiet: /api/representatives is deliberately built with
 * Promise.allSettled so a broken MSP scrape cannot take the MP half down with
 * it. Good for the visitor, bad for us — the site keeps working while half of
 * the answer silently disappears.
 *
 * So this asks the live endpoint for real postcodes and fails loudly if the MSP
 * stops coming back. Run it on a schedule; a red build is the alert.
 *
 *   node scripts/check-representatives.mjs [baseUrl]
 *
 * Exits 0 if every postcode returned both an MP and an MSP, 1 otherwise.
 */

const BASE = process.argv[2] || process.env.CHECK_BASE_URL || "http://localhost:3000";

/** Spread across the country, so one closed office does not look like an outage. */
const POSTCODES = [
  { postcode: "G1 1XW", where: "Glasgow" },
  { postcode: "EH1 1YZ", where: "Edinburgh" },
  { postcode: "AB10 1AB", where: "Aberdeen" },
  { postcode: "IV2 3BW", where: "Inverness" },
];

const results = [];

for (const { postcode, where } of POSTCODES) {
  const url = `${BASE}/api/representatives?postcode=${encodeURIComponent(postcode)}`;
  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      results.push({ where, postcode, ok: false, why: `HTTP ${res.status}` });
      continue;
    }
    const data = await res.json();
    const mp = data?.mp?.name;
    const msp = data?.msp?.name;
    results.push({
      where,
      postcode,
      ok: Boolean(mp && msp),
      mp: mp ?? null,
      msp: msp ?? null,
      mspUnavailable: Boolean(data?.mspUnavailable),
      why: !mp ? "no MP returned" : !msp ? "no MSP returned" : null,
    });
  } catch (err) {
    results.push({ where, postcode, ok: false, why: err.message });
  }
}

console.log(`Checked ${BASE}\n`);
for (const r of results) {
  const mark = r.ok ? "PASS" : "FAIL";
  console.log(`  ${mark}  ${r.where.padEnd(10)} ${r.postcode.padEnd(9)} MP: ${r.mp ?? "—"}`);
  console.log(`        ${" ".repeat(20)} MSP: ${r.msp ?? "—"}${r.why ? `  (${r.why})` : ""}`);
}

const failed = results.filter((r) => !r.ok);

if (failed.length > 0) {
  console.error(
    `\n${failed.length} of ${results.length} lookups failed.\n` +
      "If the MP came back but the MSP did not, parliament.scot has almost certainly\n" +
      "changed its markup and the scrape in src/lib/parliament.ts needs updating."
  );
  process.exit(1);
}

console.log(`\nAll ${results.length} lookups returned both an MP and an MSP.`);
