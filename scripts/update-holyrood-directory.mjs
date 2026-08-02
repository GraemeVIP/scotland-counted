#!/usr/bin/env node

/**
 * Refresh the checked-in Holyrood directory from Scottish Parliament Open Data.
 *
 * The public pages and the live postcode lookup both use the resulting snapshot
 * as a no-network fallback. Run this deliberately, review the diff, then commit
 * it. Production builds never call the upstream API.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  buildHolyroodDirectory,
  fetchScottishParliamentData,
  SCOTTISH_PARLIAMENT_SOURCE_URL,
} from "../src/lib/scottishParliament.ts";

const outputUrl = new URL("../src/lib/data/holyrood.json", import.meta.url);
const portraitDir = new URL("../public/images/representatives/msps/", import.meta.url);
const checkedAt = new Date();
const VOTES_URL = "https://data.parliament.scot/api/votesmotion?year=2026";

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function contact(record) {
  return {
    memberId: record.memberId,
    name: record.name,
    party: record.party.trim(),
    email: record.email.trim(),
    officeAddress: record.officeAddress?.replace(/\s*,\s*,/g, ",").trim() ?? null,
    profileUrl: record.profileUrl,
    photoUrl: record.photoUrl,
    photoSourceUrl: record.photoSourceUrl,
    termStart: record.termStart,
    committeeRoles: record.committeeRoles ?? [],
    governmentRoles: record.governmentRoles ?? [],
    partyRoles: record.partyRoles ?? [],
    votes: record.votes ?? [],
  };
}

async function fetchOfficialPortrait(record) {
  const page = await fetch(record.profileUrl, {
    headers: { accept: "text/html", "user-agent": "Scotland Counted data refresh" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!page.ok) throw new Error(`${record.profileUrl} returned HTTP ${page.status}`);
  const html = await page.text();
  const match = html.match(/background-image:\s*url\(['"]([^'"]*\/-\/media\/images\/msps\/[^'"]+)['"]\)/i);
  const portraitUrl = match
    ? new URL(match[1].replace(/&amp;/g, "&"), record.profileUrl)
    : record.photoSourceUrl?.startsWith("http")
      ? new URL(record.photoSourceUrl)
      : null;
  if (!portraitUrl) throw new Error(`No official portrait found for ${record.name}`);

  const image = await fetch(portraitUrl, {
    headers: { accept: "image/avif,image/webp,image/jpeg,image/*", "user-agent": "Scotland Counted data refresh" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!image.ok) throw new Error(`${portraitUrl} returned HTTP ${image.status}`);
  const contentType = image.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) throw new Error(`Portrait for ${record.name} was not an image`);
  const fileName = `${slugify(record.name)}.jpg`;
  await writeFile(new URL(fileName, portraitDir), Buffer.from(await image.arrayBuffer()));
  return {
    photoUrl: `/images/representatives/msps/${fileName}`,
    photoSourceUrl: record.profileUrl,
  };
}

async function fetchVotes() {
  const response = await fetch(VOTES_URL, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`${VOTES_URL} returned HTTP ${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error("Scottish Parliament vote response was not a dataset");

  const byMember = new Map();
  for (const row of rows) {
    const personId = row?.Person?.ID;
    const date = row?.Time?.Start;
    const title = row?.Motion?.Title;
    if (!Number.isInteger(personId) || !date || !title) continue;
    const record = {
      date,
      title: String(title).trim(),
      vote: String(row?.Detail?.VoteMSP ?? "No vote recorded").trim(),
      result: row?.Detail?.VoteResult ? String(row.Detail.VoteResult).trim() : undefined,
      reference: row?.Motion?.Reference ? String(row.Motion.Reference).trim() : undefined,
      sourceUrl: VOTES_URL,
    };
    const current = byMember.get(personId) ?? [];
    current.push(record);
    byMember.set(personId, current);
  }
  for (const [personId, records] of byMember) {
    byMember.set(
      personId,
      records
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, 12),
    );
  }
  return byMember;
}

async function mapWithConcurrency(items, worker, concurrency = 6) {
  const results = [];
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const data = await fetchScottishParliamentData();
const directory = buildHolyroodDirectory(data, checkedAt);
await mkdir(portraitDir, { recursive: true });
const allMembers = Array.from(
  new Map(
    [...directory.constituencies.map((item) => item.msp), ...directory.regions.flatMap((item) => item.msps)]
      .map((record) => [record.memberId, record]),
  ).values(),
);
const voteRecords = await fetchVotes();
const portraitRecords = await mapWithConcurrency(allMembers, async (record, index) => {
  process.stdout.write(`Portrait ${index + 1}/${allMembers.length}: ${record.name}... `);
  const portrait = await fetchOfficialPortrait(record);
  console.log("ok");
  return [record.memberId, { ...record, ...portrait, votes: voteRecords.get(record.memberId) ?? [] }];
});
const hydrated = new Map(portraitRecords);
const constituencies = directory.constituencies.map((item) => ({
  constituency: item.name,
  constituencySlug: slugify(item.name),
  region: item.region,
  regionSlug: slugify(item.region),
  msp: contact(hydrated.get(item.msp.memberId)),
}));
const regions = directory.regions.map((item) => ({
  region: item.name,
  regionSlug: slugify(item.name),
  msps: item.msps.map((msp) => contact(hydrated.get(msp.memberId))),
}));

if (constituencies.length !== 73) {
  throw new Error(`Expected 73 current Holyrood constituencies, got ${constituencies.length}`);
}
if (regions.length !== 8 || regions.some((region) => region.msps.length !== 7)) {
  throw new Error("Expected eight current Holyrood regions with seven regional MSPs each");
}

const snapshot = {
  checkedAt: checkedAt.toISOString(),
  source: SCOTTISH_PARLIAMENT_SOURCE_URL,
  sourceName: "Scottish Parliament Open Data",
  constituencies,
  regions,
};

await writeFile(outputUrl, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${constituencies.length} constituencies and ${regions.length} regions to ${fileURLToPath(outputUrl)}`,
);
