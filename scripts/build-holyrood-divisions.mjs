#!/usr/bin/env node

/**
 * Build the small per-vote summary that MSP profile pages use to explain each
 * Holyrood vote: the official totals, which party put the motion or amendment
 * forward, and how each party's MSPs voted.
 *
 * It only keeps the divisions that appear in the checked-in Holyrood snapshot
 * (src/lib/data/holyrood.json), so run it straight after
 * `npm run data:update:msps` (the package script chains the two).
 *
 * Source: Scottish Parliament Open Data, votes on motions.
 * "Put forward by" comes from the official MSPSharesParty field, which is
 * "Yes" for MSPs in the same party as the member who lodged the motion or
 * amendment. Totals for Yes and No are the official VoteFor and VoteAgainst
 * figures; Abstain and Not Voted are counted from the individual records.
 *
 * Usage: node scripts/build-holyrood-divisions.mjs [--from path/to/votesmotion.json]
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const VOTES_URL = "https://data.parliament.scot/api/votesmotion?year=2026";
const snapshotUrl = new URL("../src/lib/data/holyrood.json", import.meta.url);
const outputUrl = new URL("../src/lib/data/holyroodDivisions.json", import.meta.url);

const fromIndex = process.argv.indexOf("--from");
const fromFile = fromIndex > -1 ? process.argv[fromIndex + 1] : null;

async function loadRows() {
  if (fromFile) return JSON.parse(await readFile(fromFile, "utf8"));
  const response = await fetch(VOTES_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`${VOTES_URL} returned HTTP ${response.status}`);
  return response.json();
}

const snapshot = JSON.parse(await readFile(snapshotUrl, "utf8"));
const members = [
  ...snapshot.constituencies.map((item) => item.msp),
  ...snapshot.regions.flatMap((item) => item.msps),
];
const wanted = new Set(members.flatMap((msp) => msp.votes.map((vote) => vote.reference).filter(Boolean)));

const rows = await loadRows();
if (!Array.isArray(rows)) throw new Error("Scottish Parliament vote response was not a dataset");

const key = (value) => {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "yes") return "yes";
  if (v === "no") return "no";
  if (v === "abstain") return "abstain";
  return "notVoted";
};

const divisions = {};
for (const row of rows) {
  const reference = row?.Motion?.Reference ? String(row.Motion.Reference).trim() : "";
  if (!wanted.has(reference)) continue;
  const party = String(row?.Person?.PartyAbbreviation ?? "Other").trim() || "Other";
  const d = (divisions[reference] ??= {
    reference,
    title: String(row?.Motion?.Title ?? "").trim(),
    date: row?.Time?.Start ?? null,
    result: row?.Detail?.VoteResult ? String(row.Detail.VoteResult).trim() : null,
    yes: Number(row?.Detail?.VoteFor ?? 0),
    no: Number(row?.Detail?.VoteAgainst ?? 0),
    abstain: 0,
    notVoted: 0,
    broughtBy: [],
    parties: {},
  });
  const choice = key(row?.Detail?.VoteMSP);
  if (choice === "abstain") d.abstain += 1;
  if (choice === "notVoted") d.notVoted += 1;
  const p = (d.parties[party] ??= { yes: 0, no: 0, abstain: 0, notVoted: 0 });
  p[choice] += 1;
  if (row?.Detail?.MSPSharesParty === "Yes" && !d.broughtBy.includes(party)) d.broughtBy.push(party);
}

for (const d of Object.values(divisions)) {
  // Only name a party when the official record points to exactly one.
  d.broughtBy = d.broughtBy.length === 1 ? d.broughtBy[0] : null;
}

const missing = [...wanted].filter((reference) => !divisions[reference]);
const output = {
  checkedAt: new Date().toISOString(),
  source: VOTES_URL,
  sourceName: "Scottish Parliament Open Data, votes on motions",
  divisions: Object.fromEntries(Object.entries(divisions).sort(([a], [b]) => a.localeCompare(b))),
};

await writeFile(outputUrl, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${Object.keys(divisions).length} divisions to ${fileURLToPath(outputUrl)}` +
    (missing.length ? ` (not found upstream: ${missing.join(", ")})` : ""),
);
