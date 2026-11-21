#!/usr/bin/env node

/**
 * How often each Scottish MP was needed at Westminster in IPSA's 2025/26 year
 * (1 April 2025 to 31 March 2026), and what is on the public record for that
 * time. Every figure comes from UK Parliament's own open data:
 *
 *   - Commons sitting days: Hansard calendar API
 *   - Votes: Commons Votes API (divisions in the year, and each MP's votes)
 *   - Speaking: Hansard spoken contributions in the Commons (chamber and
 *     Westminster Hall), counted as distinct sitting days
 *   - Written questions tabled: Written Questions API
 *   - Government and opposition posts, committees: Members API
 *   - Hotel nights (MPs who use hotels instead of renting): IPSA 2025/26
 *     individual claims, "Nights" on Accommodation hotel claims
 *
 * Run from the repository root:
 *   node scripts/update-mp-london-record.mjs
 *
 * It reads "IPSA data/ipsa_individual_claims_25_26.csv" when present (that
 * folder is never committed) and downloads the same file from IPSA otherwise.
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const START = "2025-04-01";
const END = "2026-03-31";
const MPS_FILE = resolve("src/lib/data/mps.json");
const OUTPUT_FILE = resolve("src/lib/data/mpLondonRecord.json");
const LOCAL_IPSA = resolve("IPSA data/ipsa_individual_claims_25_26.csv");
const IPSA_INDIV_CLAIMS_URL =
  "https://www.theipsa.org.uk/api/download?type=individualBusinessCosts&year=25_26";
const UA = { accept: "application/json", "user-agent": "Scotland Counted data refresh" };

async function getJson(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(45_000) });
      if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

function overlapsYear(start, end) {
  const s = (start ?? "").slice(0, 10) || "0000-00-00";
  const e = (end ?? "").slice(0, 10) || "9999-12-31";
  return s <= END && e >= START;
}

async function sittingDays() {
  const days = new Set();
  const months = [];
  for (let m = 4; m <= 12; m++) months.push([2025, m]);
  for (let m = 1; m <= 3; m++) months.push([2026, m]);
  for (const [y, m] of months) {
    const items = await getJson(
      `https://hansard-api.parliament.uk/overview/calendar.json?year=${y}&month=${m}&house=Commons`,
    );
    for (const it of items) {
      const d = String(it.ItemDate).slice(0, 10);
      if (d >= START && d <= END) days.add(d);
    }
  }
  return [...days].sort();
}

async function allDivisions() {
  const out = [];
  for (let skip = 0; ; skip += 25) {
    const batch = await getJson(
      `https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.startDate=${START}&queryParameters.endDate=${END}&queryParameters.take=25&queryParameters.skip=${skip}`,
    );
    out.push(...batch);
    if (batch.length < 25) break;
  }
  return out;
}

async function memberVotes(memberId) {
  const ids = new Set();
  for (let skip = 0; ; skip += 25) {
    const batch = await getJson(
      `https://commonsvotes-api.parliament.uk/data/divisions.json/membervoting?queryParameters.memberId=${memberId}&queryParameters.startDate=${START}&queryParameters.endDate=${END}&queryParameters.take=25&queryParameters.skip=${skip}`,
    );
    for (const v of batch) ids.add(v.PublishedDivision?.DivisionId);
    if (batch.length < 25) break;
  }
  return ids.size;
}

async function memberSpeaking(memberId) {
  const days = new Set();
  let total = 0;
  for (let skip = 0; ; skip += 100) {
    const page = await getJson(
      `https://hansard-api.parliament.uk/search/contributions/Spoken.json?queryParameters.memberId=${memberId}&queryParameters.startDate=${START}&queryParameters.endDate=${END}&queryParameters.house=Commons&queryParameters.take=100&queryParameters.skip=${skip}`,
    );
    total = page.TotalResultCount ?? 0;
    const results = page.Results ?? [];
    for (const r of results) days.add(String(r.SittingDate).slice(0, 10));
    if (results.length < 100 || skip + 100 >= total) break;
  }
  return { contributions: total, days: days.size };
}

async function memberWrittenQuestions(memberId) {
  const page = await getJson(
    `https://questions-statements-api.parliament.uk/api/writtenquestions/questions?askingMemberId=${memberId}&tabledWhenFrom=${START}&tabledWhenTo=${END}&take=1`,
  );
  return page.totalResults ?? 0;
}

async function memberSince(memberId) {
  const m = (await getJson(`https://members-api.parliament.uk/api/Members/${memberId}`)).value ?? {};
  return (m.latestHouseMembership?.membershipStartDate ?? "").slice(0, 10) || null;
}

async function memberRoles(memberId) {
  const bio = (await getJson(`https://members-api.parliament.uk/api/Members/${memberId}/Biography`)).value ?? {};
  const pick = (list, kind) =>
    (list ?? [])
      .filter((p) => overlapsYear(p.startDate, p.endDate))
      .map((p) => ({
        kind,
        name: String(p.name ?? "").trim(),
        start: (p.startDate ?? "").slice(0, 10) || null,
        end: (p.endDate ?? "").slice(0, 10) || null,
      }));
  return {
    posts: [
      ...pick(bio.governmentPosts, "government"),
      ...pick(bio.oppositionPosts, "opposition"),
      ...pick(bio.otherPosts, "other"),
    ],
    committees: pick(bio.committeeMemberships, "committee"),
  };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift().map((h) => h.replace(/^﻿/, "").trim());
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

async function hotelNights(memberIds) {
  const text = existsSync(LOCAL_IPSA)
    ? await readFile(LOCAL_IPSA, "utf8")
    : await (await fetch(IPSA_INDIV_CLAIMS_URL, { signal: AbortSignal.timeout(90_000) })).text();
  const byMember = new Map();
  for (const row of parseCsv(text)) {
    const pid = Number(String(row["Parliamentary ID"] ?? "").trim());
    if (!memberIds.has(pid)) continue;
    if (row.Category !== "Accommodation" || !String(row["Cost Type"]).includes("Hotel")) continue;
    const paid = Number(String(row["Amount Paid"]).replace(/[£,]/g, "")) || 0;
    if (paid === 0) continue;
    const rec = byMember.get(pid) ?? { nights: 0, paid: 0 };
    rec.nights += Math.round(Number(row.Nights) || 0);
    rec.paid = Math.round((rec.paid + paid) * 100) / 100;
    byMember.set(pid, rec);
  }
  return byMember;
}

async function inBatches(items, size, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
    process.stdout.write(`  ${Math.min(i + size, items.length)}/${items.length}\r`);
  }
  process.stdout.write("\n");
  return out;
}

const mps = JSON.parse(await readFile(MPS_FILE, "utf8")).records;
const memberIds = new Set(mps.map((m) => m.memberId));

console.log("Commons sitting days...");
const days = await sittingDays();
console.log("All divisions...");
const divisions = await allDivisions();
const averageVoters = divisions.reduce((s, d) => s + d.AyeCount + d.NoCount, 0) / divisions.length;
console.log("Hotel nights from IPSA...");
const hotels = await hotelNights(memberIds);

console.log("Each MP's record...");
const records = await inBatches(mps, 4, async (mp) => {
  const [since, votes, speaking, writtenQuestions, roles] = await Promise.all([
    memberSince(mp.memberId),
    memberVotes(mp.memberId),
    memberSpeaking(mp.memberId),
    memberWrittenQuestions(mp.memberId),
    memberRoles(mp.memberId),
  ]);
  return {
    memberId: mp.memberId,
    name: mp.name,
    constituencySlug: mp.constituencySlug,
    // Start of their current spell as an MP. After START means only part of
    // the year (or none of it) was theirs.
    memberSince: since,
    votes,
    speakingDays: speaking.days,
    spokenContributions: speaking.contributions,
    writtenQuestions,
    posts: roles.posts,
    committees: roles.committees,
    hotelNights: hotels.get(mp.memberId)?.nights ?? 0,
    hotelPaid: hotels.get(mp.memberId)?.paid ?? 0,
  };
});

const output = {
  checkedDate: new Date().toISOString().slice(0, 10),
  year: "2025/26",
  start: START,
  end: END,
  sittingDays: days.length,
  fridaySittings: days.filter((d) => new Date(`${d}T12:00:00Z`).getUTCDay() === 5).length,
  weekendSittings: days.filter((d) => [0, 6].includes(new Date(`${d}T12:00:00Z`).getUTCDay())).length,
  divisions: divisions.length,
  // Share of the 650 seats voting in an average division.
  averageTurnoutPct: Math.round((averageVoters / 650) * 1000) / 10,
  sources: {
    sittingDays: "https://hansard.parliament.uk/",
    votes: "https://votes.parliament.uk/",
    writtenQuestions: "https://questions-statements.parliament.uk/",
    members: "https://members.parliament.uk/",
    ipsa: "https://www.theipsa.org.uk/mp-staffing-business-costs/annual-publications",
  },
  records,
};

await writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Wrote ${records.length} MPs: ${output.sittingDays} sitting days, ${output.divisions} divisions, average turnout ${output.averageTurnoutPct}%`,
);
