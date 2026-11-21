#!/usr/bin/env node

/**
 * Compile all available IPSA individualBusinessCosts CSV files in `IPSA data/`
 * into a compact static JSON dataset in `public/data/scottish-mp-receipts.json`
 * for the interactive Scottish MP Receipt Search tool (/mp-expenses-scotland/search).
 *
 * Run from repository root:
 *   node scripts/build-mp-receipts-index.mjs
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const MPS_FILE = resolve("src/lib/data/mps.json");
const IPSA_DIR = resolve("IPSA data");
const OUT_FILE = resolve("public/data/scottish-mp-receipts.json");

const CSV_FILES = [
  { file: "ipsa_individual_claims_22_23.csv", year: "2022/23" },
  { file: "ipsa_individual_claims_23_24.csv", year: "2023/24" },
  { file: "ipsa_individual_claims_24_25.csv", year: "2024/25" },
  { file: "ipsa_individual_claims_25_26.csv", year: "2025/26" },
  { file: "ipsa_individual_claims_26_27.csv", year: "2026/27" },
];

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseGbp(raw) {
  if (!raw) return 0;
  const n = Number(String(raw).replace(/[£,\s]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function normaliseDate(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  // DD/MM/YYYY -> YYYY-MM-DD
  const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  return s.slice(0, 10);
}

function cleanText(raw) {
  return String(raw ?? "")
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

const mpsSnapshot = JSON.parse(await readFile(MPS_FILE, "utf8"));
const mpRecords = mpsSnapshot.records ?? [];

// Build compact lookup table of MPs so each receipt row only stores an integer mpIndex (0..56)
const mpsList = mpRecords.map((m) => ({
  id: m.memberId,
  name: m.name,
  party: m.party.includes("Labour") ? "Scottish Labour" : m.party,
  rawParty: m.party,
  seat: m.constituency,
  slug: m.constituencySlug,
  email: m.email,
  photo: m.photoUrl ?? null,
}));

const pidToIndex = new Map(mpsList.map((m, i) => [m.id, i]));

const categories = [];
const catToIndex = new Map();
function internCat(val) {
  const k = val || "Other";
  if (!catToIndex.has(k)) {
    catToIndex.set(k, categories.length);
    categories.push(k);
  }
  return catToIndex.get(k);
}

const costTypes = [];
const typeToIndex = new Map();
function internType(val) {
  const k = val || "Other";
  if (!typeToIndex.has(k)) {
    typeToIndex.set(k, costTypes.length);
    costTypes.push(k);
  }
  return typeToIndex.get(k);
}

const yearsList = CSV_FILES.map((f) => f.year);

/**
 * Compact tuple per receipt row:
 * [mpIdx, yearIdx, dateIso, catIdx, typeIdx, shortDesc, details, amountPaid, amountRepaid, nights]
 */
const rows = [];

for (let yearIdx = 0; yearIdx < CSV_FILES.length; yearIdx++) {
  const { file, year } = CSV_FILES[yearIdx];
  const fullPath = join(IPSA_DIR, file);
  if (!existsSync(fullPath)) {
    console.warn(`Skipping missing file: ${fullPath}`);
    continue;
  }

  const raw = await readFile(fullPath, "utf8");
  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) continue;

  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^\uFEFF+/, "").trim());
  const idxPid = headers.indexOf("Parliamentary ID");
  const idxDate = headers.indexOf("Date");
  const idxCat = headers.indexOf("Category");
  const idxType = headers.indexOf("Cost Type");
  const idxShort = headers.indexOf("Short Description");
  const idxDetails = headers.indexOf("Details");
  const idxNights = headers.indexOf("Nights");
  const idxPaid = headers.indexOf("Amount Paid");
  const idxRepaid = headers.indexOf("Amount Repaid");

  let countForYear = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = parseCsvLine(line);
    const pid = Number(String(cols[idxPid] ?? "").trim());
    const mpIdx = pidToIndex.get(pid);
    if (mpIdx === undefined) continue;

    const paid = parseGbp(cols[idxPaid]);
    const repaid = parseGbp(cols[idxRepaid]);
    if (paid === 0 && repaid === 0) continue;

    const cat = cleanText(cols[idxCat]);
    const ct = cleanText(cols[idxType]);
    // Skip the single bulk annual staffing payroll line so search focuses on actual expense receipts
    if (cat === "Staffing" && ct === "Payroll") continue;

    const dateIso = normaliseDate(cols[idxDate]);
    const shortDesc = cleanText(cols[idxShort]);
    const details = cleanText(cols[idxDetails]);
    const nights = Number.parseInt(String(cols[idxNights] ?? "0"), 10) || 0;

    rows.push([
      mpIdx,
      yearIdx,
      dateIso,
      internCat(cat),
      internType(ct),
      shortDesc,
      details,
      paid,
      repaid,
      nights,
    ]);
    countForYear++;
  }
  console.log(`${year}: ${countForYear.toLocaleString("en-GB")} Scottish MP receipt lines`);
}

// Sort by amount paid descending by default so biggest claims are immediately ready
rows.sort((a, b) => b[7] - a[7] || (b[2] || "").localeCompare(a[2] || ""));

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  years: yearsList,
  mps: mpsList,
  categories,
  costTypes,
  rows,
};

await mkdir(resolve("public/data"), { recursive: true });
const json = JSON.stringify(payload);
await writeFile(OUT_FILE, json, "utf8");
console.log(
  `\nWrote ${rows.length.toLocaleString("en-GB")} receipt rows across ${yearsList.length} years to ${OUT_FILE} (${(json.length / 1024).toFixed(0)} KB raw JSON)`,
);
