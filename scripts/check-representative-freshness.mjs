/**
 * Has the world changed since the representative data was taken?
 *
 * The offline half of this lives in src/lib/data/freshness.test.ts and asks
 * whether the snapshot is recent and complete. That catches "nobody has
 * refreshed this". It cannot catch "an MP resigned last Tuesday", because a
 * stale name is still a perfectly valid string.
 *
 * This asks Parliament. It compares every name and party held here against
 * the official APIs and reports the differences.
 *
 * It deliberately does not fix anything.
 *
 * Rewriting a representative automatically means publishing a name because
 * one API call said so, on pages that tell people who to contact about their
 * housing and their benefits. An API can be mid-deploy, partially populated,
 * or returning a by-election winner before the result is formally declared.
 * The scripts that do write this data, data:update:mps and data:update:msps,
 * are run deliberately by a person who can look at what changed. This one
 * only tells that person there is something to look at.
 *
 * Usage:
 *   node scripts/check-representative-freshness.mjs
 *   node scripts/check-representative-freshness.mjs --quiet   only differences
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const quiet = process.argv.includes("--quiet");
const read = (name) => JSON.parse(readFileSync(join(ROOT, "src", "lib", "data", name), "utf8"));

const WARN_DAYS = 30;
const FAIL_DAYS = 90;
const daysOld = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

/**
 * Names differ in punctuation, honorifics and word order between sources more
 * than they differ in substance.
 *
 * The Scottish Parliament API returns "Constance, Angela" while this site
 * stores "Angela Constance". Comparing those literally reported every sitting
 * MSP as missing and every held MSP as unknown, which is the most confident
 * possible way to be completely wrong. Sorting the parts makes word order
 * irrelevant without having to guess which one is the surname.
 */
function normaliseName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(mr|mrs|ms|miss|dr|sir|dame|lord|baroness|rt hon)\b\.?/gi, "")
    .replace(/[^a-z\s]/gi, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

/** Party names are written several ways for the same party. */
function normaliseParty(value) {
  const p = String(value ?? "").toLowerCase();
  if (/scottish national/.test(p)) return "snp";
  if (/labour/.test(p)) return "labour";
  if (/conservative/.test(p)) return "conservative";
  if (/liberal democrat/.test(p)) return "libdem";
  if (/green/.test(p)) return "green";
  if (/reform/.test(p)) return "reform";
  return p.replace(/[^a-z]/g, "");
}

async function getJson(url, label) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
  return response.json();
}

/* ---------------------------------------------------------------- MPs ---- */

async function checkMps() {
  const snapshot = read("mps.json");
  const differences = [];
  const unreachable = [];

  /*
   * Fetched by the member id already stored, not by searching for the seat.
   * A search would answer "who holds this seat now", which is a different
   * question and would silently pass when the person had been replaced. This
   * asks "is the person on record still the member for this seat", which is
   * the question that catches a change.
   */
  for (const mp of snapshot.records) {
    if (!mp.memberId) {
      differences.push({ where: mp.constituency, what: "no member id, cannot be re-checked" });
      continue;
    }
    try {
      const live = await getJson(
        `https://members-api.parliament.uk/api/Members/${mp.memberId}`,
        mp.constituency,
      );
      const v = live?.value ?? {};
      const liveName = v.nameDisplayAs;
      const liveParty = v.latestParty?.name;
      const liveSeat = v.latestHouseMembership?.membershipFrom;
      const stillSitting = v.latestHouseMembership?.membershipEndDate === null;

      if (!stillSitting) {
        differences.push({
          where: mp.constituency,
          what: `${mp.name} is no longer sitting (ended ${v.latestHouseMembership?.membershipEndDate})`,
        });
      }
      if (liveName && normaliseName(liveName) !== normaliseName(mp.name)) {
        differences.push({ where: mp.constituency, what: `name: held "${mp.name}", API says "${liveName}"` });
      }
      if (liveParty && normaliseParty(liveParty) !== normaliseParty(mp.party)) {
        differences.push({ where: mp.constituency, what: `party: held "${mp.party}", API says "${liveParty}"` });
      }
      if (liveSeat && normaliseName(liveSeat) !== normaliseName(mp.constituency)) {
        differences.push({ where: mp.constituency, what: `seat: API says this member now sits for "${liveSeat}"` });
      }
    } catch (error) {
      unreachable.push(`${mp.constituency}: ${error.message}`);
    }
  }

  return { differences, unreachable, count: snapshot.records.length };
}

/* --------------------------------------------------------------- MSPs ---- */

async function checkMsps() {
  const snapshot = read("holyrood.json");
  const differences = [];
  const unreachable = [];

  let live;
  try {
    live = await getJson(
      "https://data.parliament.scot/api/members",
      "Scottish Parliament members",
    );
  } catch (error) {
    return { differences, unreachable: [`members list: ${error.message}`], count: 0 };
  }

  const current = live.filter((m) => m.IsCurrent === true || m.IsCurrent === 1);
  const byName = new Map(current.map((m) => [normaliseName(m.ParliamentaryName ?? m.PreferredName), m]));

  const held = [
    ...snapshot.constituencies.map((c) => ({ where: c.constituency, msp: c.msp })),
    ...snapshot.regions.flatMap((r) => (r.msps ?? []).map((m) => ({ where: r.region, msp: m }))),
  ];

  for (const { where, msp } of held) {
    if (!msp?.name) continue;
    if (!byName.has(normaliseName(msp.name))) {
      differences.push({ where, what: `${msp.name} is not in the current member list` });
    }
  }

  /*
   * The other direction: a sitting MSP the site does not know about. That is
   * what a by-election win looks like from here.
   */
  const heldNames = new Set(held.map((h) => normaliseName(h.msp?.name)).filter(Boolean));
  const missing = current.filter((m) => !heldNames.has(normaliseName(m.ParliamentaryName ?? m.PreferredName)));
  for (const m of missing.slice(0, 20)) {
    differences.push({
      where: "(not on this site)",
      what: `${m.ParliamentaryName ?? m.PreferredName} is a current MSP with no record here`,
    });
  }

  return { differences, unreachable, count: held.length };
}

/* --------------------------------------------------------------- main ---- */

const mpAge = daysOld(read("mps.json").checkedDate);
const mspAge = daysOld(read("holyrood.json").checkedAt);

console.log("Representative freshness\n");
console.log(`  MPs   snapshot ${mpAge} days old`);
console.log(`  MSPs  snapshot ${mspAge} days old`);
console.log(`  thresholds: warn at ${WARN_DAYS} days, fail at ${FAIL_DAYS}\n`);

const [mps, msps] = await Promise.all([checkMps(), checkMsps()]);

let failed = false;

for (const [label, result] of [["MPs", mps], ["MSPs", msps]]) {
  if (!quiet) console.log(`${label}: checked ${result.count} against the official API`);
  if (result.unreachable.length) {
    console.log(`  ${result.unreachable.length} could not be reached:`);
    for (const line of result.unreachable.slice(0, 5)) console.log(`    ${line}`);
    if (result.unreachable.length > 5) console.log(`    ...and ${result.unreachable.length - 5} more`);
  }
  if (result.differences.length) {
    failed = true;
    console.log(`  ${result.differences.length} difference(s) against the official source:`);
    for (const d of result.differences) console.log(`    ${d.where}: ${d.what}`);
  } else if (!quiet) {
    console.log("  no differences");
  }
  if (!quiet) console.log("");
}

if (Math.max(mpAge, mspAge) > FAIL_DAYS) {
  failed = true;
  console.log(`Snapshot is older than ${FAIL_DAYS} days.`);
} else if (Math.max(mpAge, mspAge) > WARN_DAYS) {
  console.log(`Snapshot is over ${WARN_DAYS} days old. Worth refreshing.`);
}

if (failed) {
  console.log(
    "\nNothing has been changed. Verify each difference against the official\n" +
      "record, then refresh deliberately with:\n" +
      "  npm run data:update:mps\n" +
      "  npm run data:update:msps\n",
  );
  process.exit(1);
}

console.log("Representative data matches the official sources.");
