#!/usr/bin/env node

/**
 * Refresh the Scottish MP Register of Financial Interests AND IPSA 2025/26
 * Expenses snapshot from the official UK Parliament Register of Interests API
 * and IPSA (Independent Parliamentary Standards Authority) annual CSVs.
 *
 * Run from the repository root:
 *   node scripts/update-mp-interests.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const INTERESTS_API_ROOT = "https://interests-api.parliament.uk/api/v1/Interests";
const IPSA_TOTAL_SPEND_URL = "https://www.theipsa.org.uk/api/download?type=totalSpend&year=25_26";
const IPSA_INDIV_CLAIMS_URL =
  "https://www.theipsa.org.uk/api/download?type=individualBusinessCosts&year=25_26";
const MPS_FILE = resolve("src/lib/data/mps.json");
const OUTPUT_FILE = resolve("src/lib/data/mpInterests.json");
const CHECKED_DATE = new Date().toISOString().slice(0, 10);

function cleanText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGbp(value) {
  if (!value) return 0;
  const cleaned = String(value).replace(/£/g, "").replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0;
}

function parseCsv(text) {
  const clean = text.replace(/^\uFEFF+/, "");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
      if (ch === "\r") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.replace(/^\uFEFF+/, "").trim());
  return rows.slice(1).map((cols) => {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = cols[i] ?? "";
    }
    return obj;
  });
}

function getField(item, name) {
  for (const field of item.fields ?? []) {
    if (field.name === name) {
      return field.value !== null && field.value !== undefined ? field.value : field.values;
    }
  }
  return null;
}

async function fetchMemberInterests(memberId) {
  let skip = 0;
  const items = [];
  while (true) {
    const url = `${INTERESTS_API_ROOT}/?MemberId=${memberId}&Skip=${skip}&Take=50`;
    const response = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "Scotland Counted data refresh" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
    const payload = await response.json();
    const batch = (payload.items ?? []).map((entry) => entry.value ?? entry);
    items.push(...batch);
    const total = payload.totalResults ?? 0;
    if (items.length >= total || batch.length === 0) break;
    skip += batch.length;
  }
  return items;
}

async function fetchIpsaData(memberIds) {
  console.log("Fetching IPSA 2025/26 totalSpend CSV...");
  const totRes = await fetch(IPSA_TOTAL_SPEND_URL, {
    headers: { "user-agent": "Scotland Counted data refresh" },
    signal: AbortSignal.timeout(40_000),
  });
  if (!totRes.ok) throw new Error(`IPSA totalSpend returned HTTP ${totRes.status}`);
  const totRows = parseCsv(await totRes.text());

  console.log("Fetching IPSA 2025/26 individualBusinessCosts CSV...");
  const indRes = await fetch(IPSA_INDIV_CLAIMS_URL, {
    headers: { "user-agent": "Scotland Counted data refresh" },
    signal: AbortSignal.timeout(60_000),
  });
  if (!indRes.ok) throw new Error(`IPSA individualBusinessCosts returned HTTP ${indRes.status}`);
  const indRows = parseCsv(await indRes.text());

  const byMember = new Map();

  for (const row of totRows) {
    const pid = Number(String(row.pID ?? "").trim());
    if (!memberIds.has(pid)) continue;
    const officeSpend = parseGbp(row["Office spend"]);
    const staffingSpend = parseGbp(row["Staffing spend"]);
    const accommodationSpend = parseGbp(row["Accommodation spend"]);
    const travelSpend = parseGbp(row["Travel and subsistence (uncapped)"]);
    const otherSpend = parseGbp(row["Other costs (uncapped)"]);
    const totalSpend =
      Math.round(
        (officeSpend + staffingSpend + accommodationSpend + travelSpend + otherSpend) * 100,
      ) / 100;
    const nonStaffSpend =
      Math.round((officeSpend + accommodationSpend + travelSpend + otherSpend) * 100) / 100;

    byMember.set(pid, {
      year: "2025/26",
      totalSpend,
      nonStaffSpend,
      staffingSpend,
      officeSpend,
      accommodationSpend,
      travelSpend,
      otherSpend,
      secondHomeRent: 0,
      secondHomeCouncilTax: 0,
      secondHomeUtilities: 0,
      londonHotels: 0,
      flights: 0,
      rail: 0,
      taxis: 0,
      dependantTravel: 0,
      parking: 0,
    });
  }

  for (const row of indRows) {
    const pid = Number(String(row["Parliamentary ID"] ?? "").trim());
    if (!byMember.has(pid)) continue;
    const rec = byMember.get(pid);
    const cat = String(row.Category ?? "").trim();
    const costType = String(row["Cost Type"] ?? "").trim();
    const paid = parseGbp(row["Amount Paid"]);
    if (paid === 0) continue;

    if (cat === "Accommodation" && costType === "Rent") {
      rec.secondHomeRent = Math.round((rec.secondHomeRent + paid) * 100) / 100;
    } else if (cat === "Accommodation" && costType === "Council tax") {
      rec.secondHomeCouncilTax = Math.round((rec.secondHomeCouncilTax + paid) * 100) / 100;
    } else if (cat === "Accommodation" && costType === "Utilities") {
      rec.secondHomeUtilities = Math.round((rec.secondHomeUtilities + paid) * 100) / 100;
    } else if (costType.includes("Hotel - London")) {
      rec.londonHotels = Math.round((rec.londonHotels + paid) * 100) / 100;
    } else if (cat === "MP Travel" && costType === "Air travel") {
      rec.flights = Math.round((rec.flights + paid) * 100) / 100;
    } else if (cat === "MP Travel" && costType === "Rail") {
      rec.rail = Math.round((rec.rail + paid) * 100) / 100;
    } else if (costType === "Taxi") {
      rec.taxis = Math.round((rec.taxis + paid) * 100) / 100;
    } else if (cat === "Dependant Travel") {
      rec.dependantTravel = Math.round((rec.dependantTravel + paid) * 100) / 100;
    } else if (cat === "MP Travel" && costType === "Parking") {
      rec.parking = Math.round((rec.parking + paid) * 100) / 100;
    }
  }

  return byMember;
}

function parseMpInterests(mp, rawItems, expenses) {
  const record = {
    memberId: mp.memberId,
    name: mp.name,
    party: mp.party,
    constituency: mp.constituency,
    constituencySlug: mp.constituencySlug,
    registerUrl: `https://members.parliament.uk/member/${mp.memberId}/registeredinterests`,
    ipsaUrl: "https://www.theipsa.org.uk/mp-staffing-business-costs/your-mp",
    donationsTotal: 0,
    giftsTotal: 0,
    visitsTotal: 0,
    earningsTotal: 0,
    totalFinancialValue: 0,
    expenses: expenses ?? null,
    donations: [],
    gifts: [],
    visits: [],
    earnings: [],
    properties: [],
    shareholdings: [],
    family: [],
    miscellaneousCount: 0,
  };

  for (const item of rawItems) {
    const category = item?.category?.name ?? "";
    const id = item?.id ?? 0;
    const registeredDate = item?.registeredDate ?? item?.publishedDate ?? null;

    if (category.includes("Donations")) {
      const value = Number(getField(item, "Value") ?? 0);
      const donor = cleanText(getField(item, "DonorName") ?? item.summary);
      const donorStatus = cleanText(getField(item, "DonorStatus") ?? "Donor");
      const description = cleanText(
        getField(item, "PaymentDescription") ?? getField(item, "DonationSource"),
      );
      const date =
        getField(item, "AcceptedDate") ?? getField(item, "ReceivedDate") ?? registeredDate;
      const address = cleanText(getField(item, "DonorPublicAddress")) || null;
      const companyNumber = cleanText(getField(item, "DonorCompanyIdentifier")) || null;

      record.donations.push({
        id,
        donor,
        donorStatus,
        value: Math.round(value * 100) / 100,
        date,
        description,
        address,
        companyNumber,
      });
      record.donationsTotal = Math.round((record.donationsTotal + value) * 100) / 100;
    } else if (category.includes("Gifts")) {
      const value = Number(getField(item, "Value") ?? 0);
      const donor = cleanText(getField(item, "DonorName") ?? item.summary);
      const donorStatus = cleanText(getField(item, "DonorStatus") ?? "Donor");
      const description = cleanText(getField(item, "PaymentDescription"));
      const date =
        getField(item, "AcceptedDate") ?? getField(item, "ReceivedDate") ?? registeredDate;
      const address = cleanText(getField(item, "DonorPublicAddress")) || null;
      const companyNumber = cleanText(getField(item, "DonorCompanyIdentifier")) || null;

      record.gifts.push({
        id,
        donor,
        donorStatus,
        value: Math.round(value * 100) / 100,
        date,
        description,
        address,
        companyNumber,
      });
      record.giftsTotal = Math.round((record.giftsTotal + value) * 100) / 100;
    } else if (category.includes("Visits")) {
      const locs = getField(item, "VisitLocations") ?? [];
      const countries = [];
      const destinations = [];
      for (const group of locs) {
        const map = Object.fromEntries((group ?? []).map((sub) => [sub.name, sub.value]));
        if (map.Country) countries.push(cleanText(map.Country));
        if (map.Destination) destinations.push(cleanText(map.Destination));
      }
      const donorGroups = getField(item, "Donors") ?? [];
      const donors = [];
      const paymentDescriptions = [];
      let value = 0;
      for (const group of donorGroups) {
        const map = Object.fromEntries((group ?? []).map((sub) => [sub.name, sub.value]));
        if (map.Name) donors.push(cleanText(map.Name));
        if (map.PaymentDescription) paymentDescriptions.push(cleanText(map.PaymentDescription));
        const numeric = Number(map.Value ?? 0);
        if (Number.isFinite(numeric)) value += numeric;
      }

      record.visits.push({
        id,
        countries,
        destinations: destinations.filter(Boolean),
        donors,
        value: Math.round(value * 100) / 100,
        startDate: getField(item, "StartDate") ?? null,
        endDate: getField(item, "EndDate") ?? null,
        purpose: cleanText(getField(item, "Purpose")),
        paymentDetails: paymentDescriptions.filter(Boolean).join("; ") || null,
        appg: cleanText(getField(item, "Appg")) || null,
      });
      record.visitsTotal = Math.round((record.visitsTotal + value) * 100) / 100;
    } else if (category.includes("Employment")) {
      const value = Number(getField(item, "Value") ?? 0);
      const role = cleanText(getField(item, "JobTitle") ?? item.summary);
      const payer = cleanText(getField(item, "PayerName")) || null;
      const regularity = cleanText(getField(item, "RegularityOfPayment")) || null;
      const hoursRaw = getField(item, "HoursWorked");
      const hours = hoursRaw !== null && hoursRaw !== undefined ? Number(hoursRaw) : null;
      const description =
        cleanText(getField(item, "PaymentDescription") ?? getField(item, "HoursDetails")) || null;

      record.earnings.push({
        id,
        role,
        payer,
        value: Math.round(value * 100) / 100,
        regularity,
        hours: Number.isFinite(hours) ? hours : null,
        description,
      });
      record.earningsTotal = Math.round((record.earningsTotal + value) * 100) / 100;
    } else if (category.includes("Land and property")) {
      record.properties.push({
        id,
        location: cleanText(getField(item, "Location")),
        country: cleanText(getField(item, "Country") ?? "United Kingdom"),
        type: cleanText(
          getField(item, "PropertyType") ?? getField(item, "LandUse") ?? "Property",
        ),
        description: cleanText(getField(item, "PropertyDescription")) || null,
        rentalIncome: Boolean(getField(item, "RegistrableRentalIncome")),
        ownerDetails: cleanText(getField(item, "PropertyOwnerDetails")) || null,
      });
    } else if (category.includes("Shareholdings")) {
      record.shareholdings.push({
        id,
        organisation: cleanText(getField(item, "OrganisationName") ?? item.summary),
        description: cleanText(getField(item, "OrganisationDescription")) || null,
        threshold: cleanText(getField(item, "ShareholdingThreshold")) || null,
      });
    } else if (category.includes("Family")) {
      const kind = category.toLowerCase().includes("lobbying") ? "lobbying" : "employed";
      record.family.push({
        id,
        kind,
        personName: cleanText(getField(item, "PersonName")),
        relation: cleanText(getField(item, "FamilyRelationType")),
        jobTitle: cleanText(getField(item, "JobTitle")),
        employer:
          cleanText(getField(item, "Employer")) || "MP's parliamentary office (IPSA)",
      });
    } else {
      record.miscellaneousCount += 1;
    }
  }

  record.totalFinancialValue =
    Math.round((record.donationsTotal + record.giftsTotal + record.visitsTotal) * 100) / 100;

  return record;
}

const mpsSnapshot = JSON.parse(await readFile(MPS_FILE, "utf8"));
const mps = mpsSnapshot.records ?? [];
if (mps.length !== 57) {
  throw new Error(`Expected 57 Scottish MPs in ${MPS_FILE}, found ${mps.length}`);
}

const memberIds = new Set(mps.map((m) => m.memberId));
const ipsaByMember = await fetchIpsaData(memberIds);

const records = [];
for (let i = 0; i < mps.length; i++) {
  const mp = mps[i];
  process.stdout.write(`Fetching interests ${i + 1}/${mps.length}: ${mp.name}... `);
  const rawItems = await fetchMemberInterests(mp.memberId);
  const parsed = parseMpInterests(mp, rawItems, ipsaByMember.get(mp.memberId));
  records.push(parsed);
  console.log(
    `Interests: £${parsed.totalFinancialValue.toLocaleString("en-GB")} | Expenses: £${(
      parsed.expenses?.totalSpend ?? 0
    ).toLocaleString("en-GB")}`,
  );
}

records.sort(
  (a, b) =>
    b.totalFinancialValue - a.totalFinancialValue ||
    (b.expenses?.totalSpend ?? 0) - (a.expenses?.totalSpend ?? 0) ||
    a.name.localeCompare(b.name, "en-GB"),
);

const snapshot = {
  checkedDate: CHECKED_DATE,
  source: `${INTERESTS_API_ROOT}/?MemberId={memberId} & ${IPSA_TOTAL_SPEND_URL}`,
  sourceName:
    "UK Parliament Register of Members' Financial Interests API & IPSA Annual Publications (2025/26)",
  records,
};

await writeFile(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`\nWrote ${records.length} Scottish MP interest & expense records to ${OUTPUT_FILE}`);
