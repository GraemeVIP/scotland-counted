#!/usr/bin/env node

/**
 * Refresh the crawlable Scottish MP directory from the official UK Parliament
 * Members API. The generated snapshot keeps every representative page complete
 * at build time and avoids making page rendering depend on a third party.
 *
 * Run from the repository root:
 *   node scripts/update-mp-directory.mjs
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const API_ROOT = "https://members-api.parliament.uk/api";
const VOTES_API_ROOT = "https://commonsvotes-api.parliament.uk/data/divisions.json/membervoting";
const SOURCE_FILE = resolve("src/lib/data/constituencies.ts");
const OUTPUT_FILE = resolve("src/lib/data/mps.json");
const PHOTO_DIR = resolve("public/images/representatives/mps");
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

async function fetchRecentVotes(memberId) {
  const url = new URL(VOTES_API_ROOT);
  url.searchParams.set("memberId", memberId);
  url.searchParams.set("startDate", "2024-07-05");
  url.searchParams.set("endDate", new Date().toISOString().slice(0, 10));
  url.searchParams.set("take", "12");
  const rows = await getJson(url);
  if (!Array.isArray(rows)) throw new Error(`Unexpected voting response for member ${memberId}`);

  return rows
    .map((row) => {
      const division = row.PublishedDivision;
      if (!division?.DivisionId || !division.Date || !division.Title) return null;
      return {
        date: division.Date,
        title: String(division.FriendlyTitle || division.Title).trim(),
        vote: row.MemberVotedAye ? "Aye" : row.MemberVotedNo ? "No" : "Did not vote",
        result: `${division.AyeCount ?? 0} Aye, ${division.NoCount ?? 0} No`,
        sourceUrl: `https://commonsvotes-api.parliament.uk/data/division/${division.DivisionId}.json`,
      };
    })
    .filter(Boolean);
}

async function savePortrait(member, constituencySlug) {
  const response = await fetch(`${API_ROOT}/Members/${member.id}/Thumbnail`, {
    headers: { accept: "image/jpeg,image/*", "user-agent": "Scotland Counted data refresh" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Portrait for ${member.nameDisplayAs} returned HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) throw new Error(`Portrait for ${member.nameDisplayAs} was not an image`);
  const fileName = `${constituencySlug}.jpg`;
  await writeFile(resolve(PHOTO_DIR, fileName), Buffer.from(await response.arrayBuffer()));
  return {
    photoUrl: `/images/representatives/mps/${fileName}`,
    photoSourceUrl: `https://members.parliament.uk/member/${member.id}`,
  };
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
  const portrait = await savePortrait(member, constituency.slug);

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
    ...portrait,
    votes: await fetchRecentVotes(member.id),
  };
}

const source = await readFile(SOURCE_FILE, "utf8");
await mkdir(PHOTO_DIR, { recursive: true });
const constituencies = constituencyRecords(source);
if (constituencies.length !== 57) {
  throw new Error(`Expected 57 Scottish constituencies, found ${constituencies.length}`);
}

const records = [];
let cursor = 0;
async function fetchNext() {
  while (cursor < constituencies.length) {
    const constituency = constituencies[cursor++];
    process.stdout.write(`Fetching ${constituency.name}... `);
    const record = await fetchMp(constituency);
    records.push(record);
    console.log(`${record.name} (${record.votes.length} votes)`);
  }
}
await Promise.all(Array.from({ length: 6 }, fetchNext));

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
