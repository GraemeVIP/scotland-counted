#!/usr/bin/env node

/**
 * Refresh the checked-in Holyrood directory from Scottish Parliament Open Data.
 *
 * The public pages and the live postcode lookup both use the resulting snapshot
 * as a no-network fallback. Run this deliberately, review the diff, then commit
 * it. Production builds never call the upstream API.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  buildHolyroodDirectory,
  fetchScottishParliamentData,
  SCOTTISH_PARLIAMENT_SOURCE_URL,
} from "../src/lib/scottishParliament.ts";

const outputUrl = new URL("../src/lib/data/holyrood.json", import.meta.url);
const checkedAt = new Date();

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
    name: record.name,
    party: record.party.trim(),
    email: record.email.trim(),
    officeAddress: record.officeAddress?.replace(/\s*,\s*,/g, ",").trim() ?? null,
    profileUrl: record.profileUrl,
  };
}

const data = await fetchScottishParliamentData();
const directory = buildHolyroodDirectory(data, checkedAt);
const constituencies = directory.constituencies.map((item) => ({
  constituency: item.name,
  constituencySlug: slugify(item.name),
  region: item.region,
  regionSlug: slugify(item.region),
  msp: contact(item.msp),
}));
const regions = directory.regions.map((item) => ({
  region: item.name,
  regionSlug: slugify(item.name),
  msps: item.msps.map(contact),
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
