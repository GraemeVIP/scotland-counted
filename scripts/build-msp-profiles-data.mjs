import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";

/**
 * Builds src/lib/data/mspInterests.json covering all 129 sitting Session 7 MSPs:
 *   1. Official Holyrood expenses (2024/25, Q1 2025/26 & 4-year totals May 2021 - Jun 2025)
 *      plus top standout receipts with Payee names.
 *   2. Live 2026 Session 7 Register of Interests (deduplicated per person & category).
 *   3. Previous Westminster IPSA record (2022/23 - 2024/25) for former MPs who moved to
 *      Holyrood in May 2026 (such as Patricia Gibson, Alan Brown, David Linden, etc.).
 */

const holyrood = JSON.parse(readFileSync("src/lib/data/holyrood.json", "utf8"));
const transactions = JSON.parse(readFileSync("MSP data/allowances_member_transactions.json", "utf8"));
const roiRaw = JSON.parse(readFileSync("MSP data/register_of_interest.json", "utf8"));

function slugifyName(name) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
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

function readCsv(path) {
  const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return [];
  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const obj = {};
    for (let j = 0; j < headers.length; j++) obj[headers[j]] = cols[j] ?? "";
    rows.push(obj);
  }
  return rows;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function fyForDate(iso) {
  const y = Number(iso.slice(0, 4));
  const mo = Number(iso.slice(5, 7));
  if (mo >= 4) {
    if (y === 2025) return "2025/26 (Q1)";
    return `${y}/${String(y + 1).slice(2)}`;
  }
  return `${y - 1}/${String(y).slice(2)}`;
}

// Collect all 129 sitting MSPs
const allMsps = [];
const byId = new Map();
const byNormName = new Map();

function normName(n) {
  return n
    .toLowerCase()
    .replace(/^(dr|mr|mrs|ms|sir|dame)\s+/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

for (const c of holyrood.constituencies) {
  const m = c.msp;
  if (byId.has(m.memberId)) continue;
  const rec = {
    memberId: m.memberId,
    name: m.name,
    party: m.party,
    area: c.constituency,
    roleType: "Constituency",
    searchSlug: `c-${c.constituencySlug}`,
    profileHref: `/representatives/msps/constituencies/${c.constituencySlug}`,
  };
  allMsps.push(rec);
  byId.set(m.memberId, rec);
  byNormName.set(normName(m.name), rec);
}
for (const r of holyrood.regions) {
  for (const m of r.msps) {
    if (byId.has(m.memberId)) continue;
    const ps = slugifyName(m.name);
    const rec = {
      memberId: m.memberId,
      name: m.name,
      party: m.party,
      area: r.region,
      roleType: "Regional",
      searchSlug: `r-${r.regionSlug}-${ps}`,
      profileHref: `/representatives/msps/regions/${r.regionSlug}/${ps}`,
    };
    allMsps.push(rec);
    byId.set(m.memberId, rec);
    byNormName.set(normName(m.name), rec);
  }
}

// 1. Group Holyrood transactions per current MSP (May 2021 - Jun 2025)
const txByMsp = new Map();
for (const t of transactions) {
  if (!byId.has(t.MemberId)) continue;
  const cm = (t.ClaimMonth || "").slice(0, 10);
  if (!cm || cm < "2021-05-01") continue;
  if (!txByMsp.has(t.MemberId)) txByMsp.set(t.MemberId, []);
  txByMsp.get(t.MemberId).push(t);
}

// 2. Group & deduplicate Session 7 Register of Interests per MSP
const roiByMsp = new Map();
for (const r of roiRaw) {
  const pid = r?.Person?.ID;
  if (!byId.has(pid)) continue;
  const cat = (r?.Detail?.Name || "").trim();
  const desc = (r?.Detail?.Description || "").replace(/\s+/g, " ").trim();
  if (!desc || /^no registr?able/i.test(desc)) continue;
  if (!roiByMsp.has(pid)) roiByMsp.set(pid, {});
  const bucket = roiByMsp.get(pid);
  if (!bucket[cat]) bucket[cat] = new Set();
  bucket[cat].add(desc);
}

// 3. Cross-match former Scottish Westminster MPs in IPSA CSVs (2022/23 - 2024/25)
// Exclude English/Welsh/NI namesakes (e.g. David Smith MP for North Northumberland).
const EXCLUDED_NAMESAKES = new Set(["david smith"]);
const ipsaFiles = [
  "IPSA data/ipsa_individual_claims_22_23.csv",
  "IPSA data/ipsa_individual_claims_23_24.csv",
  "IPSA data/ipsa_individual_claims_24_25.csv",
];
const ipsaByMsp = new Map();
for (const fn of ipsaFiles) {
  const rows = readCsv(fn);
  for (const r of rows) {
    const nn = normName(r["Name"] || "");
    if (EXCLUDED_NAMESAKES.has(nn)) continue;
    const matched = byNormName.get(nn);
    if (!matched) continue;
    if (!ipsaByMsp.has(matched.memberId)) ipsaByMsp.set(matched.memberId, []);
    ipsaByMsp.get(matched.memberId).push(r);
  }
}

// Build final record map keyed by memberId
const profiles = {};
let returningCount = 0;
let formerMpCount = 0;
let landlordCount = 0;
let activeCouncillorCount = 0;

for (const m of allMsps) {
  const rows = txByMsp.get(m.memberId) || [];
  let holyroodExpenses = null;

  if (rows.length > 0) {
    returningCount++;
    let total2425 = 0;
    let total4Yr = 0;
    let edinburghAcc2425 = 0;
    let councilTax2324 = 0;
    let councilTax2425 = 0;
    let councilTax2526Q1 = 0;
    let hotels2425 = 0;
    let hotels4Yr = 0;
    let engagement2425 = 0;
    let marchEngagement2025 = 0;
    let office2425 = 0;
    let travel2425 = 0;
    let carMiles4Yr = 0;
    let newspapers4Yr = 0;

    const notableCandidates = [];
    const skipForTop = new Set([
      "Rent",
      "Rental Expenditure",
      "Non Domestic Rates",
      "Rent - Service Charges",
      "Utilities",
      "Members Mileage",
      "Staff Mileage",
    ]);

    for (const r of rows) {
      const cm = (r.ClaimMonth || "").slice(0, 10);
      const amt = Number(r.TotalClaimAmount || 0);
      const allow = (r.Allowance || "").trim();
      const exp = (r.Expenditure || "").trim();
      const payee = (r.Payee || "").trim().replace(/^\.\s*/, "").trim();
      const details = (r.SupplementaryInfo || r.TravelDescription || "").replace(/\s+/g, " ").trim();
      const miles = r.NoofMiles && Number(r.NoofMiles) > 0 ? Math.round(Number(r.NoofMiles)) : 0;

      total4Yr += amt;
      if (exp.toLowerCase().includes("hotel")) hotels4Yr += amt;
      if (exp.toLowerCase().includes("mileage") && !exp.toLowerCase().includes("staff")) {
        carMiles4Yr += miles;
      }
      if (exp.toLowerCase().includes("newspaper")) newspapers4Yr += amt;

      if (cm >= "2023-04-01" && cm <= "2024-03-31") {
        if (allow === "Edinburgh Accommodation Provision" && exp.includes("Council Tax")) {
          councilTax2324 += amt;
        }
      } else if (cm >= "2024-04-01" && cm <= "2025-03-31") {
        total2425 += amt;
        if (allow === "Edinburgh Accommodation Provision") {
          edinburghAcc2425 += amt;
          if (exp.includes("Council Tax")) councilTax2425 += amt;
          if (exp.includes("Hotel")) hotels2425 += amt;
        } else if (allow === "Engagement Provision") {
          engagement2425 += amt;
          if (cm.startsWith("2025-03")) marchEngagement2025 += amt;
        } else if (allow === "Office Cost Provision") {
          office2425 += amt;
        } else if (allow === "MSP and MSP staff travel provision") {
          travel2425 += amt;
        }
      } else if (cm >= "2025-04-01") {
        if (allow === "Edinburgh Accommodation Provision" && exp.includes("Council Tax")) {
          councilTax2526Q1 += amt;
        }
      }

      if (!skipForTop.has(exp) && !exp.toLowerCase().includes("staff") && amt >= 50) {
        notableCandidates.push({
          date: cm,
          year: fyForDate(cm),
          allowance: allow,
          expenditure: exp,
          payee,
          details: details || exp,
          amount: round2(amt),
        });
      }
    }

    notableCandidates.sort((a, b) => b.amount - a.amount || b.date.localeCompare(a.date));

    holyroodExpenses = {
      receiptCount: rows.length,
      total2425: round2(total2425),
      total4Yr: round2(total4Yr),
      edinburghAcc2425: round2(edinburghAcc2425),
      councilTax2324: round2(councilTax2324),
      councilTax2425: round2(councilTax2425),
      councilTax2526Q1: round2(councilTax2526Q1),
      hotels2425: round2(hotels2425),
      hotels4Yr: round2(hotels4Yr),
      engagement2425: round2(engagement2425),
      marchEngagement2025: round2(marchEngagement2025),
      office2425: round2(office2425),
      travel2425: round2(travel2425),
      carMiles4Yr: Math.round(carMiles4Yr),
      newspapers4Yr: round2(newspapers4Yr),
      topReceipts: notableCandidates.slice(0, 6),
    };
  }

  // Register of Interests (Session 7)
  const roiBucket = roiByMsp.get(m.memberId) || {};
  const properties = Array.from(roiBucket["Heritable property"] || []);
  const remunerationRaw = Array.from(roiBucket["Remuneration and related undertaking"] || []);
  const shares = Array.from(roiBucket["Interest in shares"] || []);
  const gifts = Array.from(roiBucket["Gifts"] || []);
  const visits = Array.from(roiBucket["Overseas visits"] || []);
  const voluntary = Array.from(roiBucket["Voluntary"] || []);

  // Filter out superseded "I am a Councillor..." if there's an explicit resignation entry for the same role
  const hasCouncillorResignation = remunerationRaw.some(
    (d) => /councillor/i.test(d) && (/^until\b/i.test(d) || /resigned|ceased/i.test(d)),
  );
  const isActiveCouncillor =
    !hasCouncillorResignation &&
    remunerationRaw.some((d) => /councillor/i.test(d) && !/^until\b/i.test(d));

  if (properties.length > 0) landlordCount++;
  if (isActiveCouncillor) activeCouncillorCount++;

  // Previous Westminster IPSA record (for ex-MPs elected to Holyrood in May 2026)
  let formerWestminster = null;
  const ipsaRows = ipsaByMsp.get(m.memberId) || [];
  if (ipsaRows.length > 0) {
    formerMpCount++;
    let totalPaid = 0;
    let nonStaffPaid = 0;
    let flights = 0;
    let hotels = 0;
    let hotelNights = 0;
    let officeRent = 0;
    let advertising = 0;
    let redundancy = 0;
    let constituency = "";
    const standout = [];

    for (const r of ipsaRows) {
      const paid = Number(r["Amount Paid"] || 0);
      const cat = r["Category"] || "";
      const ct = r["Cost Type"] || "";
      const det = (r["Details"] || "").trim();
      const sd = (r["Short Description"] || "").trim();
      if (!constituency && r["Constituency"]) constituency = r["Constituency"].replace(/ (CC|BC)$/, "");

      totalPaid += paid;
      if (ct !== "Payroll" && ct !== "Pooled staffing services" && ct !== "Redundancy") {
        nonStaffPaid += paid;
      }
      if (cat === "MP Travel" && ct === "Air travel") flights += paid;
      if (cat === "Accommodation" && ct.includes("Hotel")) {
        hotels += paid;
        hotelNights += Math.round(Number(r["Nights"] || 0));
      }
      if (cat === "Office Costs" && ct === "Rent") officeRent += paid;
      if (ct.includes("Advertising") || /banner/i.test(det)) advertising += paid;
      if (ct === "Redundancy") redundancy += paid;

      if (
        paid >= 200 &&
        ct !== "Payroll" &&
        ct !== "Rent" &&
        ct !== "Pooled staffing services" &&
        ct !== "Air travel" &&
        !det.toLowerCase().includes("aggregated") &&
        !det.includes("[***]")
      ) {
        standout.push({
          date: r["Date"] || "",
          year: (r["Year"] || "").replace("_", "/"),
          category: cat,
          costType: ct,
          details: det || sd || ct,
          amount: round2(paid),
        });
      }
    }

    standout.sort((a, b) => b.amount - a.amount);
    formerWestminster = {
      formerSeat: constituency,
      claimCount: ipsaRows.length,
      totalPaid: round2(totalPaid),
      nonStaffPaid: round2(nonStaffPaid),
      flights: round2(flights),
      hotels: round2(hotels),
      hotelNights,
      officeRent: round2(officeRent),
      advertisingAndBanners: round2(advertising),
      redundancy: round2(redundancy),
      topReceipts: standout.slice(0, 5),
    };
  }

  profiles[String(m.memberId)] = {
    memberId: m.memberId,
    name: m.name,
    party: m.party,
    area: m.area,
    roleType: m.roleType,
    searchSlug: m.searchSlug,
    holyroodExpenses,
    formerWestminster,
    registerOfInterests: {
      isActiveCouncillor,
      properties,
      remuneration: remunerationRaw,
      shares,
      gifts,
      visits,
      voluntaryCount: voluntary.length,
    },
  };
}

const out = {
  checkedAt: "2026-11-22",
  expensesCoverage: "2021/22 to 2025/26 Q1 (up to June 2025)",
  registerCoverage: "Session 7 (2026)",
  counts: {
    totalMsps: allMsps.length,
    returningWithExpenses: returningCount,
    formerWestminsterMps: formerMpCount,
    landlords: landlordCount,
    activeCouncillors: activeCouncillorCount,
  },
  profiles,
};

writeFileSync("src/lib/data/mspInterests.json", JSON.stringify(out));
console.log("Wrote src/lib/data/mspInterests.json:", out.counts);
console.log(
  "Former Westminster MPs matched to sitting MSPs:",
  Object.values(profiles)
    .filter((p) => p.formerWestminster)
    .map((p) => `${p.name} (${p.formerWestminster.formerSeat}, £${p.formerWestminster.totalPaid.toLocaleString("en-GB")})`),
);
