import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Is the representative data still worth trusting?
 *
 * Every page that names an MP or an MSP is a claim about who currently holds
 * a public office and how to reach them. That claim decays on its own: people
 * resign, defect, die and lose by-elections without this repository being
 * touched. Nothing else here notices, because a stale name is still a valid
 * string and every other test passes on it.
 *
 * This is the offline half and it runs in `npm test`. It checks the snapshot
 * says when it was taken, that the date is recent enough to stand behind, and
 * that no record is missing something the site renders. The network half,
 * which compares the names against Parliament's own APIs, is
 * `npm run check:reps:fresh`, because a unit test that fails when somebody
 * else's server is down is a unit test people learn to skip.
 */

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const read = (name: string) =>
  JSON.parse(readFileSync(join(ROOT, "src", "lib", "data", name), "utf8"));

/*
 * Thresholds, and why these numbers.
 *
 * WARN at 30 days: a month is the point where a reader looking at the
 * "Checked" date on the page would reasonably expect it to have been looked
 * at again. Nothing is wrong yet, but nobody has confirmed it either.
 *
 * FAIL at 90 days: a quarter is long enough that a by-election, a defection
 * or a resignation is a realistic possibility rather than bad luck, and the
 * site would be publishing a wrong name with a confident date beside it.
 * That is worse than publishing nothing, because the date does the vouching.
 *
 * These are judgement calls, not measurements, and they are written down here
 * rather than left implicit so they can be argued with.
 */
const WARN_DAYS = 30;
const FAIL_DAYS = 90;

const daysOld = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

const SNAPSHOTS = [
  { file: "mps.json", dateField: "checkedDate", label: "UK Parliament MPs" },
  { file: "holyrood.json", dateField: "checkedAt", label: "Scottish Parliament MSPs" },
];

test("every representative snapshot says when it was taken", () => {
  for (const { file, dateField, label } of SNAPSHOTS) {
    const data = read(file);
    const raw = data[dateField];
    assert.ok(raw, `${label}: ${file} has no ${dateField}`);

    const when = new Date(raw);
    assert.ok(!Number.isNaN(when.getTime()), `${label}: ${dateField} is not a date: ${raw}`);
    assert.ok(when.getTime() <= Date.now() + 86_400_000, `${label}: ${dateField} is in the future`);

    // A snapshot must name where it came from, or it cannot be re-checked.
    assert.ok(data.source, `${label}: no source URL`);
    assert.ok(data.sourceName, `${label}: no source name`);
    assert.match(data.source, /^https:\/\//, `${label}: source is not an https URL`);
  }
});

test("no representative snapshot is older than the threshold it can be defended at", () => {
  const stale: string[] = [];
  const ageing: string[] = [];

  for (const { file, dateField, label } of SNAPSHOTS) {
    const age = daysOld(read(file)[dateField]);
    if (age > FAIL_DAYS) stale.push(`${label}: ${age} days old, limit ${FAIL_DAYS}`);
    else if (age > WARN_DAYS) ageing.push(`${label}: ${age} days`);
  }

  if (ageing.length) {
    // Visible in the run without failing it. Refresh with the update scripts.
    console.warn(`\n  representative data is ageing: ${ageing.join("; ")}\n`);
  }

  assert.deepEqual(
    stale,
    [],
    `\n  Representative data is too old to publish with a date beside it.\n  ` +
      `Refresh with npm run data:update:mps and data:update:msps, then re-run.\n  ` +
      stale.join("\n  "),
  );
});

test("every MP record carries what the site renders about them", () => {
  const data = read("mps.json");
  /*
   * 57 is the number of Scottish Westminster seats. A count that drifts means
   * either a boundary change nobody accounted for or a broken fetch that
   * wrote a partial file, and both should stop the build rather than quietly
   * drop a constituency off the site.
   */
  assert.equal(data.records.length, 57, "expected 57 Scottish Westminster seats");

  const problems: string[] = [];
  const seen = new Set<string>();
  for (const mp of data.records) {
    const where = mp.constituency ?? "(unnamed)";
    for (const field of ["name", "party", "constituency", "constituencySlug", "email"]) {
      if (!mp[field] || String(mp[field]).trim() === "") problems.push(`${where}: no ${field}`);
    }
    if (mp.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mp.email)) {
      problems.push(`${where}: email does not look like one: ${mp.email}`);
    }
    // A placeholder is worse than a blank, because it renders as fact.
    if (/\b(TBC|TBD|unknown|placeholder|example|test)\b/i.test(`${mp.name} ${mp.party}`)) {
      problems.push(`${where}: placeholder text in name or party`);
    }
    if (seen.has(mp.constituencySlug)) problems.push(`${where}: duplicate constituency`);
    seen.add(mp.constituencySlug);
  }
  assert.deepEqual(problems, [], `\n  ${problems.join("\n  ")}`);
});

test("every MSP record carries what the site renders about them", () => {
  const data = read("holyrood.json");
  assert.equal(data.constituencies.length, 73, "expected 73 Holyrood constituencies");
  assert.equal(data.regions.length, 8, "expected 8 Holyrood regions");

  const problems: string[] = [];
  for (const row of data.constituencies) {
    const where = row.constituency ?? "(unnamed)";
    if (!row.constituencySlug) problems.push(`${where}: no slug`);
    if (!row.region) problems.push(`${where}: no region`);
    const msp = row.msp;
    if (!msp) {
      // A vacant seat is real and allowed, but it must be explicit.
      problems.push(`${where}: no MSP and no explicit vacancy`);
      continue;
    }
    for (const field of ["name", "party"]) {
      if (!msp[field] || String(msp[field]).trim() === "") problems.push(`${where}: MSP has no ${field}`);
    }
  }

  for (const region of data.regions) {
    /*
     * Seven regional MSPs per region is how the additional member system
     * works. Anything else means a partial fetch, and the site tells readers
     * they have "one constituency MSP and seven regional MSPs".
     */
    assert.equal(
      region.msps?.length,
      7,
      `${region.region}: expected 7 regional MSPs, found ${region.msps?.length}`,
    );
    for (const msp of region.msps ?? []) {
      if (!msp.name || !msp.party) problems.push(`${region.region}: incomplete regional MSP`);
    }
  }

  assert.deepEqual(problems, [], `\n  ${problems.join("\n  ")}`);
});

test("the date shown to readers is the date the data was actually checked", () => {
  /*
   * The representatives page prints a "Checked" date. If that came from
   * anywhere other than the snapshot, it would be possible to show a fresh
   * date over stale data, which is the specific failure this whole file
   * exists to prevent.
   */
  const source = readFileSync(join(ROOT, "src", "lib", "data", "holyrood.ts"), "utf8");
  assert.match(
    source,
    /HOLYROOD_DATA_CHECKED_AT\s*=\s*snapshot\.checkedAt/,
    "the displayed check date is no longer read from the snapshot",
  );
});
