#!/usr/bin/env node

/**
 * Refresh the crawlable Scottish MP directory from the official UK Parliament
 * Members API. The generated snapshot keeps every representative page complete
 * at build time and avoids making page rendering depend on a third party.
 *
 * Run from the repository root:
 *   node scripts/update-mp-directory.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const API_ROOT = "https://members-api.parliament.uk/api";
const SOURCE_FILE = resolve("src/lib/data/constituencies.ts");
const OUTPUT_FILE = resolve("src/lib/data/mps.json");
const CHECKED_DATE = new Date().toISOString().slice(0, 10);

function constituencyRecords(source) {
  const entries = [];
  const pattern = /name:\s*"([^"]+)",[\s\S]*?slug:\s*"([^"]+)",[\s\S]*?code:\s*"([^"]+)"/g;
  for (const match of source.matchAll(pattern)) {
    entries.push({ name: match[1], slug: match[2], code: match[3] });
  }
  return entries;
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

function officeAddress(contact) {
  return [
    contact?.line1,
    contact?.line2,
    contact?.line3,
    contact?.line4,
    contact?.line5,
    contact?.postcode,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : value))
    .filter(Boolean)
    .join(", ");
}

async function fetchMp(constituency) {
  const searchUrl = new URL(`${API_ROOT}/Members/Search`);
  searchUrl.searchParams.set("Location", constituency.name);
  searchUrl.searchParams.set("House", "1");
  searchUrl.searchParams.set("IsCurrentMember", "true");
  searchUrl.searchParams.set("skip", "0");
  searchUrl.searchParams.set("take", "20");

  const search = await getJson(searchUrl);
  const member = search.items
    ?.map((item) => item.value)
    .find(
      (item) =>
        item.latestHouseMembership?.membershipFrom?.toLocaleLowerCase("en-GB") ===
        constituency.name.toLocaleLowerCase("en-GB"),
    );

  if (!member) throw new Error(`No exact current MP match for ${constituency.name}`);

  const contacts = await getJson(`${API_ROOT}/Members/${member.id}/Contact`);
  const values = contacts.value ?? [];
  const constituencyOffice = values.find((contact) => contact.type === "Constituency office");
  const parliamentaryOffice = values.find((contact) => contact.type === "Parliamentary office");
  const emailContact =
    [constituencyOffice, parliamentaryOffice, ...values].find((contact) => contact?.email) ?? null;
  const phoneContact =
    [constituencyOffice, parliamentaryOffice, ...values].find((contact) => contact?.phone) ?? null;
  const addressContact = constituencyOffice ?? parliamentaryOffice ?? null;
  const website = values.find((contact) => contact.type === "Website")?.line1?.trim() ?? null;

  if (!emailContact?.email) throw new Error(`No public email for ${constituency.name}`);

  return {
    constituency: constituency.name.trim(),
    constituencySlug: constituency.slug.trim(),
    constituencyCode: constituency.code.trim(),
    memberId: member.id,
    name: member.nameDisplayAs.trim(),
    party: member.latestParty.name.trim(),
    email: emailContact.email.trim(),
    phone: phoneContact?.phone?.trim() ?? null,
    officeAddress: officeAddress(addressContact).trim() || null,
    website,
    profileUrl: `https://members.parliament.uk/member/${member.id}/contact`,
  };
}

const source = await readFile(SOURCE_FILE, "utf8");
const constituencies = constituencyRecords(source);
if (constituencies.length !== 57) {
  throw new Error(`Expected 57 Scottish constituencies, found ${constituencies.length}`);
}

const records = [];
for (const constituency of constituencies) {
  process.stdout.write(`Fetching ${constituency.name}... `);
  const record = await fetchMp(constituency);
  records.push(record);
  console.log(record.name);
}

records.sort((a, b) => a.constituency.localeCompare(b.constituency, "en-GB"));

await writeFile(
  OUTPUT_FILE,
  `${JSON.stringify(
    {
      checkedDate: CHECKED_DATE,
      source: `${API_ROOT}/Members/Search and /Members/{id}/Contact`,
      sourceName: "UK Parliament Members API",
      records,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`\nWrote ${records.length} current MPs to ${OUTPUT_FILE}`);
