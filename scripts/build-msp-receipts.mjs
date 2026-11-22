import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Generates public/data/scottish-msp-receipts.json from the official Scottish
 * Parliament Open Data files in MSP data/ and our checked Session 7 MSP list in
 * src/lib/data/holyrood.json.
 *
 * Tuple format matches scottish-mp-receipts.json:
 *   [mspIdx, yearIdx, dateIso, allowIdx, expIdx, payee, details, amountPaid, 0, miles]
 */

const holyrood = JSON.parse(readFileSync("src/lib/data/holyrood.json", "utf8"));
const transactions = JSON.parse(readFileSync("MSP data/allowances_member_transactions.json", "utf8"));
const membersApi = JSON.parse(readFileSync("MSP data/members.json", "utf8"));
const partiesApi = JSON.parse(readFileSync("MSP data/parties.json", "utf8"));
const memberPartiesApi = JSON.parse(readFileSync("MSP data/member_parties.json", "utf8"));

function slugifyName(name) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortParty(party) {
  if (/national/i.test(party)) return "SNP";
  if (/labour/i.test(party)) return "Scottish Labour";
  if (/conservative/i.test(party)) return "Conservative";
  if (/green/i.test(party)) return "Scottish Greens";
  if (/liberal/i.test(party)) return "Lib Dem";
  if (/reform/i.test(party)) return "Reform UK";
  if (/no party|independent/i.test(party)) return "Independent";
  return party;
}

const mspList = [];
const mspIdxById = new Map();

for (const c of holyrood.constituencies) {
  const m = c.msp;
  if (mspIdxById.has(m.memberId)) continue;
  mspIdxById.set(m.memberId, mspList.length);
  mspList.push({
    id: m.memberId,
    name: m.name,
    party: m.party,
    rawParty: shortParty(m.party),
    seat: c.constituency,
    slug: `c-${c.constituencySlug}`,
    profileHref: `/representatives/msps/constituencies/${c.constituencySlug}`,
    roleType: "Constituency",
    email: m.email,
    photo: m.photoUrl || null,
    receiptCount: 0,
  });
}

for (const r of holyrood.regions) {
  for (const m of r.msps) {
    if (mspIdxById.has(m.memberId)) continue;
    const personSlug = slugifyName(m.name);
    mspIdxById.set(m.memberId, mspList.length);
    mspList.push({
      id: m.memberId,
      name: m.name,
      party: m.party,
      rawParty: shortParty(m.party),
      seat: r.region,
      slug: `r-${r.regionSlug}-${personSlug}`,
      profileHref: `/representatives/msps/regions/${r.regionSlug}/${personSlug}`,
      roleType: "Regional",
      email: m.email,
      photo: m.photoUrl || null,
      receiptCount: 0,
    });
  }
}

const years = ["2021/22", "2022/23", "2023/24", "2024/25", "2025/26 (Q1)"];
const yearToIdx = new Map(years.map((y, i) => [y, i]));

function fyForDate(iso) {
  const y = Number(iso.slice(0, 4));
  const mo = Number(iso.slice(5, 7));
  if (mo >= 4) {
    if (y === 2025) return "2025/26 (Q1)";
    return `${y}/${String(y + 1).slice(2)}`;
  }
  return `${y - 1}/${String(y).slice(2)}`;
}

const categories = [];
const catIdx = new Map();
const costTypes = [];
const ctIdx = new Map();

function intern(arr, map, val) {
  const clean = (val || "Other").trim() || "Other";
  if (!map.has(clean)) {
    map.set(clean, arr.length);
    arr.push(clean);
  }
  return map.get(clean);
}

const rows = [];
for (const t of transactions) {
  const mIdx = mspIdxById.get(t.MemberId);
  if (mIdx === undefined) continue;
  const dateIso = (t.ClaimMonth || "").slice(0, 10);
  if (!dateIso || dateIso < "2021-05-01") continue;
  const fy = fyForDate(dateIso);
  const yIdx = yearToIdx.get(fy);
  if (yIdx === undefined) continue;

  const amount = Math.round(Number(t.TotalClaimAmount || 0) * 100) / 100;
  const allowI = intern(categories, catIdx, t.Allowance);
  const expI = intern(costTypes, ctIdx, t.Expenditure);
  const payee = (t.Payee || "").trim().replace(/^\.\s*/, "").trim();
  const details = (t.SupplementaryInfo || t.TravelDescription || "").trim().replace(/\s+/g, " ");
  const miles = t.NoofMiles && Number(t.NoofMiles) > 0 ? Math.round(Number(t.NoofMiles)) : 0;

  mspList[mIdx].receiptCount += 1;
  rows.push([mIdx, yIdx, dateIso, allowI, expI, payee, details, amount, 0, miles]);
}

// Sort largest claim first (same default order as scottish-mp-receipts.json)
rows.sort((a, b) => b[7] - a[7] || b[2].localeCompare(a[2]));

// Compute full 2024/25 Holyrood Party Tally across all sitting Session 6 MSPs
const memberIdsSet = new Set(membersApi.map((m) => m.PersonID));
const partyNameById = new Map(partiesApi.map((p) => [p.ID, p.PreferredName]));
const party2425 = new Map();
for (const mp of memberPartiesApi) {
  const vf = (mp.ValidFromDate || "1900-01-01").slice(0, 10);
  const vu = (mp.ValidUntilDate || "9999-12-31").slice(0, 10);
  if (vf <= "2025-01-01" && "2025-01-01" <= vu) {
    party2425.set(mp.PersonID, partyNameById.get(mp.PartyID) || "Other");
  }
}

const pMsps = new Map();
const pTotal = new Map();
const pEng = new Map();
const pMarEng = new Map();
for (const t of transactions) {
  if (!memberIdsSet.has(t.MemberId)) continue;
  const cm = (t.ClaimMonth || "").slice(0, 10);
  if (cm < "2024-04-01" || cm > "2025-03-31") continue;
  const p = party2425.get(t.MemberId) || "Other";
  const amt = Number(t.TotalClaimAmount || 0);
  if (!pMsps.has(p)) pMsps.set(p, new Set());
  pMsps.get(p).add(t.MemberId);
  pTotal.set(p, (pTotal.get(p) || 0) + amt);
  if (t.Allowance === "Engagement Provision") {
    pEng.set(p, (pEng.get(p) || 0) + amt);
    if (cm.startsWith("2025-03")) {
      pMarEng.set(p, (pMarEng.get(p) || 0) + amt);
    }
  }
}

const partyTally2024 = Array.from(pMsps.entries())
  .filter(([, set]) => set.size >= 4)
  .map(([p, set]) => {
    const tot = pTotal.get(p) || 0;
    const eng = pEng.get(p) || 0;
    const mar = pMarEng.get(p) || 0;
    return {
      party: p,
      short: shortParty(p),
      msps: set.size,
      total: Math.round(tot),
      perMsp: Math.round(tot / set.size),
      marchPct: eng > 0 ? Math.round((mar / eng) * 1000) / 10 : 0,
    };
  })
  .sort((a, b) => b.perMsp - a.perMsp);

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  years,
  mps: mspList,
  categories,
  costTypes,
  partyTally2024,
  rows,
};

const outPath = "public/data/scottish-msp-receipts.json";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(out));

const withReceipts = mspList.filter((m) => m.receiptCount > 0).length;
console.log(
  `Wrote ${outPath}: ${rows.length} receipts across ${withReceipts} returning MSPs (${mspList.length} total sitting MSPs).`,
);
console.log("Party Tally 2024/25:", partyTally2024);
