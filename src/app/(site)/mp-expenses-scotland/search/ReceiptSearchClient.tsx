"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "@/components/IntentLink";

type Chamber = "mp" | "msp";

type MemberMeta = {
  id: number;
  name: string;
  party: string;
  rawParty: string;
  seat: string;
  slug: string;
  profileHref?: string;
  roleType?: "Constituency" | "Regional";
  email: string;
  photo: string | null;
  receiptCount?: number;
};

/**
 * Tuple:
 * MP:  [mpIdx, yearIdx, dateIso, catIdx, typeIdx, shortDesc, details, amountPaid, amountRepaid, nights]
 * MSP: [mspIdx, yearIdx, dateIso, allowIdx, expIdx, payee, details, amountPaid, 0, miles]
 */
type RawRow = [number, number, string, number, number, string, string, number, number, number];

type MspPartyTallyItem = {
  party: string;
  short: string;
  msps: number;
  total: number;
  perMsp: number;
  marchPct: number;
};

type ReceiptsPayload = {
  generatedAt: string;
  years: string[];
  mps: MemberMeta[];
  categories: string[];
  costTypes: string[];
  partyTally2024?: MspPartyTallyItem[];
  rows: RawRow[];
};

type MpPresetId =
  | "all"
  | "second-home"
  | "family"
  | "taxis-parking"
  | "hotels"
  | "tech-furniture"
  | "pr-ads"
  | "hospitality"
  | "repaid";

type MspPresetId =
  | "all"
  | "edinburgh-flat"
  | "hotels"
  | "leaflets-ads"
  | "consultants"
  | "newspapers"
  | "cars-flights"
  | "meals"
  | "cancellations";

type PresetId = MpPresetId | MspPresetId;
type SortId = "highest" | "newest" | "oldest" | "lowest";

const STAFF_TRAVEL = "Staff Travel";

function partyColour(party: string): string {
  const p = party.toLowerCase();
  if (p.includes("national") || p === "snp") return "#f2c200";
  if (p.includes("labour")) return "#e4003b";
  if (p.includes("conservative")) return "#0087dc";
  if (p.includes("green")) return "#02a95b";
  if (p.includes("liberal") || p.includes("lib dem")) return "#faa61a";
  if (p.includes("reform")) return "#12b6cf";
  return "#8a93a3";
}

function PartyDot({ party }: { party: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
      style={{ background: partyColour(party) }}
    />
  );
}

const MP_PRESETS: { id: MpPresetId; label: string; hint: string }[] = [
  { id: "all", label: "All MP receipts", hint: "Every expense claim (not counting staff wages)" },
  {
    id: "second-home",
    label: "Second home bills",
    hint: "Rent, council tax, heating, insurance, drains & broadband",
  },
  { id: "family", label: "Family travel", hint: "Flights, trains & taxis for spouses and children" },
  {
    id: "taxis-parking",
    label: "Taxis & car parking",
    hint: "Cabs and parking fees (the MP's own unless staff travel is switched on)",
  },
  {
    id: "hotels",
    label: "London & European hotels",
    hint: "Overnight hotel stays (the MP's own unless staff travel is switched on)",
  },
  {
    id: "tech-furniture",
    label: "Phones, sofas & refurbs",
    hint: "iPhones, IKEA, DFS, Amazon, furniture & office makeovers",
  },
  {
    id: "pr-ads",
    label: "Annual reports, ads & PR",
    hint: "Annual reports, billboards, speech writers, PR firms & consultants",
  },
  {
    id: "hospitality",
    label: "Dinners, lunches & events",
    hint: "Food, drink, Christmas lunches & hospitality",
  },
  {
    id: "repaid",
    label: "Paid back & duplicate claims",
    hint: "Claims MPs had to pay back to IPSA",
  },
];

const MSP_PRESETS: { id: MspPresetId; label: string; hint: string }[] = [
  { id: "all", label: "All MSP receipts", hint: "Every individual MSP claim (not counting staff wages)" },
  {
    id: "edinburgh-flat",
    label: "Edinburgh flats & council tax",
    hint: "Second home rent and doubled Edinburgh council tax bills",
  },
  {
    id: "hotels",
    label: "Edinburgh & overnight hotels",
    hint: "Hotel nights paid by taxpayers",
  },
  {
    id: "leaflets-ads",
    label: "Leaflets, annual reports & ads",
    hint: "Engagement budget, March leaflet blitz, calendars and football banners",
  },
  {
    id: "consultants",
    label: "Consultants, PR & coaching",
    hint: "Consultancy fees, architects, research reports and media training",
  },
  {
    id: "newspapers",
    label: "Newspapers & TV licences",
    hint: "Newspaper subscriptions, FT, Economist, Spectator and TV licences",
  },
  {
    id: "cars-flights",
    label: "Cars, flights & taxis",
    hint: "Car mileage, car hire, flights and taxi rides",
  },
  {
    id: "meals",
    label: "Meals, catering & hospitality",
    hint: "Evening meals, lunches and event catering",
  },
  {
    id: "cancellations",
    label: "Cancellation fees",
    hint: "Non refundable hotel, rail and taxi cancellation fees billed to taxpayers",
  },
];

/** The first QUICK_WORDS_SHOWN chips show straight away; the rest sit behind "More". */
const QUICK_WORDS_SHOWN = 6;

const MP_QUICK_WORDS: { word: string; note: string }[] = [
  { word: "Yu Energy", note: "£23.4k" },
  { word: "IKEA", note: "£20.0k" },
  { word: "TV licence", note: "£10.8k" },
  { word: "iPhone", note: "£2.7k" },
  { word: "Christmas", note: "£2.5k" },
  { word: "speech", note: "£26.8k" },
  { word: "mobile telephone", note: "£65.5k" },
  { word: "Amazon", note: "£40.6k" },
  { word: "Peach Partners", note: "£35.8k" },
  { word: "annual report", note: "£34.4k" },
  { word: "newspapers", note: "£30.7k" },
  { word: "broadband", note: "£13.2k" },
  { word: "consultant", note: "£10k+" },
  { word: "drain", note: "£1.2k" },
  { word: "DFS", note: "£1.2k" },
  { word: "dinner", note: "£963" },
];

const MSP_QUICK_WORDS: { word: string; note: string }[] = [
  { word: "Council Tax", note: "£161k in 24/25" },
  { word: "Calendar", note: "£37k+" },
  { word: "Financial Times", note: "FT subs" },
  { word: "Cancellation", note: "wasted fees" },
  { word: "Ayr United", note: "£1.2k banner" },
  { word: "Pink Elephant", note: "£3k" },
  { word: "Alliance Print Group", note: "£115.9k" },
  { word: "Craigview Strategies", note: "£19.8k" },
  { word: "Fraser Livingstone", note: "£8.5k" },
  { word: "Trello", note: "£3k" },
  { word: "Economist", note: "subs" },
  { word: "New Statesman", note: "2x £144" },
  { word: "Sodexo", note: "catering" },
  { word: "TV Licen", note: "TV licences" },
];

/**
 * IPSA's cost type labels in plain words, for MP result cards. The original
 * label is still shown in small text. Anything not listed falls back to IPSA's
 * own wording.
 */
const PLAIN_COST_TYPE: Record<string, string> = {
  "Bought-in services": "Paid an outside firm",
  "Advertising and contact cards": "Leaflets and adverts",
  Utilities: "Power and water bills",
  "Stationery & printing": "Paper and printing",
  "Landline phone & internet - rental & usage": "Phone and internet bills",
  "Landline phone & internet - installation & equipment purchase": "Phone and internet set up",
  "Venue hire, meetings & surgeries": "Room hire for meetings",
  "Equipment - purchase": "Bought office kit",
  "Equipment - hire": "Hired office kit",
  "Cleaning services": "Cleaning",
  "Software & applications": "Software",
  "Newspapers, journals, magazines": "Papers and magazines",
  "Mobile telephone - contract & usage": "Mobile phone bill",
  "Mobile telephone - equipment purchase": "Bought a mobile phone",
  "Maintenance, Redecorations & Repairs": "Repairs and decorating",
  "Council tax": "Council tax",
  "Hotel - London": "London hotel",
  "Hotel - UK Not London": "Hotel outside London",
  "Hotel - European": "Hotel in Europe",
  "Hotel - Direct Supply": "Hotel",
  "Hotel - late night": "Late night hotel",
  Rail: "Train tickets",
  "Air travel": "Flights",
  "Postage & couriers": "Postage",
  "Waste disposal, confidential waste & rubbish collection": "Rubbish collection",
  Subsistence: "Food while travelling",
  "Mileage - car": "Car mileage",
  "Other public transport": "Bus, tube or ferry",
  Hospitality: "Food and drink for guests",
  "Website hosting and design": "Website",
  Taxi: "Taxis",
  "Pooled staffing services": "Shared staff service",
  "Pooled Staffing Services": "Shared staff service",
  "Service charge & ground Rent": "Service charge and ground rent",
  "Training - staff": "Staff training",
  "Training - MP": "MP training",
  "Insurance - buildings": "Building insurance",
  "Insurance - contents": "Contents insurance",
  "Business rates": "Business rates (tax on the office)",
  "Working From Home Allowance": "Working from home",
  "Vehicle hire cost": "Car hire",
  Removals: "Moving costs",
  "Moving Fees": "Moving costs",
  "Translation services - other languages": "Translation",
  "Recruitment Services &Costs": "Hiring staff",
  "Congestion charge & toll": "Tolls",
  "Rail Booking Fee": "Train booking fee",
  Payroll: "Staff pay",
};

function plainMpLabel(cat: string, ct: string): string | null {
  if (ct === "Rent") return cat === "Accommodation" ? "Second home rent" : "Office rent";
  const base = PLAIN_COST_TYPE[ct];
  if (!base) return null;
  if (cat === "Accommodation") {
    return `Second home: ${base.toLowerCase()}`;
  }
  if (cat === "Dependant Travel") return `Family travel: ${base.toLowerCase()}`;
  if (cat === "Staff Travel") return `Staff travel: ${base.toLowerCase()}`;
  return base;
}

const moneyExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const moneyWhole = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatDate(iso: string) {
  if (!iso) return "Date not listed";
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isMspStaffCost(cat: string, ct: string): boolean {
  const lower = ct.toLowerCase();
  if (lower.includes("staff")) return true;
  if (cat === "Staff Travel Provision") return true;
  return false;
}

function matchesMpPreset(
  preset: PresetId,
  cat: string,
  ct: string,
  sd: string,
  det: string,
  repaid: number,
): boolean {
  if (preset === "all") return true;
  if (preset === "second-home") {
    return cat === "Accommodation" && !ct.toLowerCase().includes("hotel");
  }
  if (preset === "family") {
    return cat === "Dependant Travel";
  }
  if (preset === "taxis-parking") {
    return ct === "Taxi" || ct === "Parking";
  }
  if (preset === "hotels") {
    return ct.toLowerCase().includes("hotel");
  }
  if (preset === "tech-furniture") {
    return (
      ct.includes("Equipment") ||
      ct.includes("Mobile telephone - equipment") ||
      ct.includes("Maintenance, Redecorations") ||
      /iphone|ipad|apple|ikea|dfs|amazon|furniture|carpet|refurb/i.test(`${sd} ${det}`)
    );
  }
  if (preset === "pr-ads") {
    return (
      ct.includes("Advertising") ||
      ct.includes("Bought-in services") ||
      ct.includes("Website") ||
      /comms|media|annual report|billboard|consult|speech|pr /i.test(`${sd} ${det}`)
    );
  }
  if (preset === "hospitality") {
    return (
      ct === "Hospitality" ||
      ct === "Subsistence" ||
      /christmas|dinner|lunch|catering|hospitality/i.test(`${sd} ${det}`)
    );
  }
  if (preset === "repaid") {
    return repaid > 0 || /repay|duplicate|overspend/i.test(det);
  }
  return true;
}

function matchesMspPreset(
  preset: PresetId,
  cat: string,
  ct: string,
  payee: string,
  det: string,
): boolean {
  if (preset === "all") return true;
  const blob = `${ct} ${payee} ${det}`.toLowerCase();
  if (preset === "edinburgh-flat") {
    return cat === "Edinburgh Accommodation Provision" && !ct.toLowerCase().includes("hotel");
  }
  if (preset === "hotels") {
    return ct.toLowerCase().includes("hotel") || ct.toLowerCase().includes("overnight");
  }
  if (preset === "leaflets-ads") {
    return (
      cat === "Engagement Provision" ||
      ct === "Advertising" ||
      ct === "Printing and/or Photocopying" ||
      ct === "Mailing Costs"
    );
  }
  if (preset === "consultants") {
    return (
      ct.includes("Professional") ||
      ct.includes("Consultancy") ||
      ct.includes("Training") ||
      /consult|pink elephant|architect|coaching|photography|feasibility|briefing/i.test(blob)
    );
  }
  if (preset === "newspapers") {
    return (
      ct.includes("Newspaper") ||
      ct === "Licences" ||
      /tv licen|financial times|economist|spectator|statesman|trello/i.test(blob)
    );
  }
  if (preset === "cars-flights") {
    return (
      ct.includes("Mileage") ||
      ct.includes("Air") ||
      ct.includes("Taxi") ||
      ct.includes("Car Hire") ||
      ct.includes("Car parking")
    );
  }
  if (preset === "meals") {
    return (
      ct === "Evening Meal" ||
      ct === "Business Meeting" ||
      /catering|lunch|dinner|sodexo|refreshment/i.test(blob)
    );
  }
  if (preset === "cancellations") {
    return /cancel|non-refundable|non refundable/i.test(blob);
  }
  return true;
}

export default function ReceiptSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [chamber, setChamber] = useState<Chamber>(
    searchParams.get("who") === "msp" ? "msp" : "mp",
  );
  const [mpData, setMpData] = useState<ReceiptsPayload | null>(null);
  const [mspData, setMspData] = useState<ReceiptsPayload | null>(null);
  const [mpError, setMpError] = useState<string | null>(null);
  const [mspError, setMspError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [preset, setPreset] = useState<PresetId>(
    (searchParams.get("preset") as PresetId) || "all",
  );
  const [memberSlug, setMemberSlug] = useState(
    searchParams.get("msp") ?? searchParams.get("mp") ?? "all",
  );
  const [party, setParty] = useState(searchParams.get("party") ?? "all");
  const [year, setYear] = useState(searchParams.get("year") ?? "all");
  const [sort, setSort] = useState<SortId>((searchParams.get("sort") as SortId) || "highest");
  const [includeLumped, setIncludeLumped] = useState(searchParams.get("lumped") === "1");
  const [includeStaff, setIncludeStaff] = useState(searchParams.get("staff") === "1");
  const [minAmount, setMinAmount] = useState<number>(
    Number(searchParams.get("min") || "0") || 0,
  );
  const [perPage, setPerPage] = useState<number>(() => {
    const v = Number(searchParams.get("per") || "10");
    return [10, 25, 50, 100].includes(v) ? v : 10;
  });
  const [page, setPage] = useState<number>(() => {
    const v = Number(searchParams.get("page") || "1");
    return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
  });
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedViral, setCopiedViral] = useState(false);
  const [surpriseRow, setSurpriseRow] = useState<RawRow | null>(null);
  // "More filters" starts closed, unless the link already sets a filter.
  const [showFilters, setShowFilters] = useState<boolean>(() =>
    ["preset", "mp", "msp", "party", "year", "min", "lumped", "staff", "sort"].some((k) =>
      searchParams.has(k),
    ),
  );
  const [showAllChips, setShowAllChips] = useState(false);

  // Postcode finder directly inside the Receipt Finder
  const [postcode, setPostcode] = useState("");
  const [pcState, setPcState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [pcError, setPcError] = useState("");
  const [pcMatched, setPcMatched] = useState<MemberMeta | null>(null);
  const [pcRegionals, setPcRegionals] = useState<MemberMeta[]>([]);

  // Lazy load active chamber's JSON dataset
  useEffect(() => {
    let active = true;
    if (chamber === "mp" && !mpData && !mpError) {
      fetch("/data/scottish-mp-receipts.json")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json: ReceiptsPayload) => {
          if (active) setMpData(json);
        })
        .catch(() => {
          if (active)
            setMpError("Could not load the Westminster MP receipt archive. Please refresh and try again.");
        });
    } else if (chamber === "msp" && !mspData && !mspError) {
      fetch("/data/scottish-msp-receipts.json")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json: ReceiptsPayload) => {
          if (active) setMspData(json);
        })
        .catch(() => {
          if (active)
            setMspError("Could not load the Holyrood MSP receipt archive. Please refresh and try again.");
        });
    }
    return () => {
      active = false;
    };
  }, [chamber, mpData, mspData, mpError, mspError]);

  const data = chamber === "mp" ? mpData : mspData;
  const error = chamber === "mp" ? mpError : mspError;
  const isMsp = chamber === "msp";

  function switchChamber(next: Chamber) {
    if (next === chamber) return;
    setChamber(next);
    setQuery("");
    setPreset("all");
    setMemberSlug("all");
    setParty("all");
    setYear("all");
    setSort("highest");
    setIncludeLumped(false);
    setIncludeStaff(false);
    setMinAmount(0);
    setPage(1);
    setSurpriseRow(null);
    setPcMatched(null);
    setPcRegionals([]);
    setPcState("idle");
    setPcError("");
  }

  // Keep URL query string synced so users can share any exact search or filter view
  useEffect(() => {
    const params = new URLSearchParams();
    if (chamber === "msp") params.set("who", "msp");
    if (query.trim()) params.set("q", query.trim());
    if (preset !== "all") params.set("preset", preset);
    if (memberSlug !== "all") params.set(chamber === "msp" ? "msp" : "mp", memberSlug);
    if (party !== "all") params.set("party", party);
    if (year !== "all") params.set("year", year);
    if (sort !== "highest") params.set("sort", sort);
    if (includeLumped && chamber === "mp") params.set("lumped", "1");
    if (minAmount > 0) params.set("min", String(minAmount));
    if (includeStaff) params.set("staff", "1");
    if (perPage !== 10) params.set("per", String(perPage));
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/mp-expenses-scotland/search?${qs}` : "/mp-expenses-scotland/search", {
      scroll: false,
    });
  }, [
    chamber,
    query,
    preset,
    memberSlug,
    party,
    year,
    sort,
    includeLumped,
    minAmount,
    includeStaff,
    perPage,
    page,
    router,
  ]);

  const parties = useMemo(() => {
    if (!data) return ["all"];
    return ["all", ...Array.from(new Set(data.mps.map((m) => m.party))).sort()];
  }, [data]);

  const sortedMembers = useMemo(() => {
    if (!data) return [];
    return [...data.mps].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [data]);

  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (preset !== "all" ? 1 : 0) +
    (memberSlug !== "all" ? 1 : 0) +
    (party !== "all" ? 1 : 0) +
    (year !== "all" ? 1 : 0) +
    (!isMsp && includeLumped ? 1 : 0) +
    (minAmount > 0 ? 1 : 0) +
    (includeStaff ? 1 : 0);

  const presetNeedsLumped =
    !isMsp &&
    (preset === "second-home" ||
      preset === "family" ||
      preset === "taxis-parking" ||
      preset === "hotels");

  // Also counts the bills that match every other filter but are hidden by the
  // two default switches (staff trips, lumped totals), so the page can say so.
  const filteredResult = useMemo(() => {
    if (!data) return { rows: [] as RawRow[], hiddenStaff: 0, hiddenLumped: 0 };
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const out: RawRow[] = [];
    let hiddenStaff = 0;
    let hiddenLumped = 0;

    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      const member = data.mps[row[0]];
      const yr = data.years[row[1]];
      const cat = data.categories[row[3]];
      const ct = data.costTypes[row[4]];

      const hideAsStaff =
        !includeStaff && (isMsp ? isMspStaffCost(cat, ct) : cat === STAFF_TRAVEL);

      if (memberSlug !== "all" && member.slug !== memberSlug) continue;
      if (party !== "all" && member.party !== party) continue;
      if (year !== "all" && yr !== year) continue;
      if (minAmount > 0 && row[7] < minAmount) continue;

      const hideAsLumped =
        !isMsp &&
        !includeLumped &&
        !presetNeedsLumped &&
        (!row[6] ||
          /aggregated/i.test(row[6]) ||
          ct.toLowerCase().includes("pooled staffing") ||
          ct === "Payroll");

      if (isMsp) {
        if (!matchesMspPreset(preset, cat, ct, row[5], row[6])) continue;
      } else {
        if (!matchesMpPreset(preset, cat, ct, row[5], row[6], row[8])) continue;
      }

      if (tokens.length > 0) {
        const hay =
          `${member.name} ${member.seat} ${member.party} ${member.rawParty} ${yr} ${cat} ${ct} ${row[5]} ${row[6]}`.toLowerCase();
        let allMatch = true;
        for (const tok of tokens) {
          if (!hay.includes(tok)) {
            allMatch = false;
            break;
          }
        }
        if (!allMatch) continue;
      }

      if (hideAsStaff) {
        hiddenStaff++;
        continue;
      }
      if (hideAsLumped) {
        hiddenLumped++;
        continue;
      }

      out.push(row);
    }

    if (sort === "newest") {
      out.sort((a, b) => (b[2] || "").localeCompare(a[2] || "") || b[7] - a[7]);
    } else if (sort === "oldest") {
      out.sort((a, b) => (a[2] || "").localeCompare(b[2] || "") || b[7] - a[7]);
    } else if (sort === "lowest") {
      out.sort((a, b) => a[7] - b[7]);
    }
    return { rows: out, hiddenStaff, hiddenLumped };
  }, [
    data,
    isMsp,
    query,
    preset,
    memberSlug,
    party,
    year,
    sort,
    includeLumped,
    presetNeedsLumped,
    minAmount,
    includeStaff,
  ]);

  const filtered = filteredResult.rows;
  const hiddenCount = filteredResult.hiddenStaff + filteredResult.hiddenLumped;
  // Plain time span for the totals: one year, or the whole range of the data.
  const spanText = !data
    ? ""
    : year !== "all"
      ? `in ${year}`
      : `${data.years[0]} to ${data.years[data.years.length - 1]}`;

  const summary = useMemo(() => {
    if (!data || filtered.length === 0) {
      return {
        totalPaid: 0,
        totalRepaid: 0,
        topMembers: [] as {
          slug: string;
          name: string;
          party: string;
          total: number;
          count: number;
        }[],
      };
    }
    let totalPaid = 0;
    let totalRepaid = 0;
    const byMember = new Map<number, { total: number; count: number }>();
    for (const r of filtered) {
      totalPaid += r[7];
      totalRepaid += r[8];
      const cur = byMember.get(r[0]);
      if (cur) {
        cur.total += r[7];
        cur.count += 1;
      } else {
        byMember.set(r[0], { total: r[7], count: 1 });
      }
    }
    const topMembers = Array.from(byMember.entries())
      .map(([idx, stats]) => ({
        slug: data.mps[idx].slug,
        name: data.mps[idx].name,
        party: data.mps[idx].rawParty,
        total: stats.total,
        count: stats.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { totalPaid, totalRepaid, topMembers };
  }, [data, filtered]);

  function handleSurpriseMe() {
    if (!data) return;
    const candidates = data.rows.filter((r) => {
      const det = r[6];
      const paid = r[7];
      const cat = data.categories[r[3]];
      const ct = data.costTypes[r[4]];
      if (paid < (isMsp ? 200 : 300)) return false;
      if (isMsp) {
        if (!includeStaff && isMspStaffCost(cat, ct)) return false;
        if (
          ct === "Rent" ||
          ct === "Rental Expenditure" ||
          ct === "Non Domestic Rates" ||
          ct === "Rent - Service Charges" ||
          ct === "Utilities"
        )
          return false;
        return Boolean(det || r[5]);
      }
      if (!includeStaff && cat === STAFF_TRAVEL) return false;
      if (!det || /aggregated/i.test(det)) return false;
      if (
        ct === "Rent" ||
        ct === "Pooled staffing services" ||
        ct === "Business rates" ||
        ct === "Service charge & ground Rent"
      )
        return false;
      return true;
    });
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setSurpriseRow(pick);
  }

  function handleCopyReceipt(row: RawRow, key: string) {
    if (!data) return;
    const m = data.mps[row[0]];
    const yr = data.years[row[1]];
    const cat = data.categories[row[3]];
    const ct = data.costTypes[row[4]];
    const desc = row[6] || row[5] || `${cat} (${ct})`;

    let text: string;
    if (isMsp) {
      const paidTo = row[5] ? ` (paid to ${row[5]})` : "";
      text = `${m.name} MSP (${m.rawParty}, ${m.seat}) billed Scottish taxpayers ${moneyExact.format(
        row[7],
      )} on ${formatDate(row[2])} (${yr}) for "${desc}"${paidTo} (${cat} / ${ct}). Official Scottish Parliament record via https://scotlandcounted.org.uk/mp-expenses-scotland/search?who=msp&msp=${m.slug}`;
    } else {
      const forWhat = cat === STAFF_TRAVEL ? `their staff's travel, "${desc}"` : `"${desc}"`;
      text = `${m.name} MP (${m.rawParty}, ${m.seat}) billed taxpayers ${moneyExact.format(
        row[7],
      )} on ${formatDate(row[2])} (${yr}) for ${forWhat} (${cat} / ${ct}). Official IPSA record via https://scotlandcounted.org.uk/mp-expenses-scotland/search?mp=${m.slug}`;
    }

    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(key);
      window.setTimeout(() => setCopiedId((prev) => (prev === key ? null : prev)), 2200);
    });
  }

  function handleCopyShareUrl() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2200);
    });
  }

  function handleCopyViralSummary() {
    const text = isMsp
      ? [
          "What Scottish MSPs billed taxpayers at Holyrood (official Scottish Parliament records):",
          "• £161,374 for Edinburgh second home council tax in 2024/25 (+122% in one year after MSPs passed the 100% second home council tax hike)",
          "• Scottish Greens spent more per MSP (£35,974) than Conservatives (£35,677), SNP (£35,364) and Labour (£31,906), and blew 77.8% of their leaflet budget in March alone",
          "• £127,627 on newspapers and magazines in 4 years (Kate Forbes £7,707, Murdo Fraser £5,762, Lorna Slater £3,430 including two £144 New Statesman entries 3 days apart)",
          "• £19,800 paid by two Scottish Labour MSPs to ex Labour General Secretary Brian Roy's consultancy firm",
          "• £36,953 for multi millionaire Tory Alexander Burnett's calendars",
          "• £3,000 for 1-to-1 media coaching (Lorna Slater) and £100,949 on hotels across just 7 Green MSPs",
          "Search all 50,067 Scottish MSP receipts yourself: https://scotlandcounted.org.uk/mp-expenses-scotland/search?who=msp",
        ].join("\n")
      : [
          "What Scotland's 57 MPs billed taxpayers on top of their £98,599 salary (official IPSA records, 2022 to 2026):",
          "• £23,437 paid to Yu Energy for electricity in ONE day (Lillian Jones, Kilmarnock: #1 biggest MP electricity payout in the entire UK)",
          "• £10,000 for an unnamed 'Policy and Office set up consultant' (Melanie Ward, plus £7,000 paid back)",
          "• £10,754 on TV licences across 29 MPs (4 in 12 months by Gregor Poynton; 2 in 9 months by Dr Zubir Ahmed)",
          "• £37,359 for 295 nights in London hotels in one year (Dr Zubir Ahmed)",
          "• £24,530 on mobile phone bills (Brendan O'Hara, peaking at £909 in one month)",
          "• £35,792 to PR firm Peach Partners (John Lamont) & £3,090 for 5G broadband setup (Chris Law)",
          "Search all 20,879 Scottish MP receipts yourself: https://scotlandcounted.org.uk/mp-expenses-scotland/search",
        ].join("\n");
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedViral(true);
      window.setTimeout(() => setCopiedViral(false), 2400);
    });
  }

  async function handlePostcodeLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const cleaned = postcode.trim().toUpperCase();
    if (!cleaned) return;
    setPcState("loading");
    setPcError("");
    setPcMatched(null);
    setPcRegionals([]);
    try {
      const res = await fetch("/api/representatives", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: cleaned }),
      });
      const json = (await res.json()) as {
        mp?: { memberId?: number; name?: string; constituency?: string };
        constituencyMsp?: { memberId?: number; name?: string; constituency?: string };
        regionalMsps?: { memberId?: number; name?: string }[];
        error?: string;
      };

      if (isMsp) {
        if (!res.ok || !json.constituencyMsp) {
          throw new Error(json.error || "Could not match that Scottish postcode to Holyrood MSPs.");
        }
        const matched =
          data.mps.find((m) => m.id === json.constituencyMsp?.memberId) ||
          data.mps.find(
            (m) =>
              json.constituencyMsp?.name &&
              m.name.toLowerCase() === json.constituencyMsp.name.toLowerCase(),
          );
        const regionals = (json.regionalMsps || [])
          .map((rm) => data.mps.find((m) => m.id === rm.memberId))
          .filter((x): x is MemberMeta => Boolean(x));

        if (!matched) {
          setPcError("That postcode is outside Scotland. Holyrood MSPs represent Scottish seats only.");
          setPcState("error");
          return;
        }
        setPcMatched(matched);
        setPcRegionals(regionals);
        setPcState("found");
        setMemberSlug(matched.slug);
      } else {
        if (!res.ok || !json.mp) {
          throw new Error(json.error || "Could not find that postcode.");
        }
        const matched =
          data.mps.find((m) => m.id === json.mp?.memberId) ||
          data.mps.find(
            (m) =>
              json.mp?.constituency &&
              m.seat.toLowerCase() === json.mp.constituency.toLowerCase(),
          );
        if (!matched) {
          setPcError("That postcode is outside Scotland. This tool covers Scotland's 57 MPs.");
          setPcState("error");
          return;
        }
        setPcMatched(matched);
        setPcState("found");
        setMemberSlug(matched.slug);
      }

      setParty("all");
      setQuery("");
      setPreset("all");
      setYear("all");
      setMinAmount(0);
      setPage(1);
      setSurpriseRow(null);
    } catch (err) {
      setPcError(err instanceof Error ? err.message : "Postcode search is unavailable right now.");
      setPcState("error");
    }
  }

  const mpPartyAverages2025 = useMemo(() => {
    if (isMsp || !mpData) return [];
    const yr25 = mpData.years.indexOf("2025/26");
    if (yr25 === -1) return [];
    const counts = new Map<string, number>();
    const totals = new Map<string, number>();
    for (const m of mpData.mps) {
      counts.set(m.party, (counts.get(m.party) || 0) + 1);
    }
    for (const r of mpData.rows) {
      if (r[1] !== yr25) continue;
      if (!includeStaff && mpData.categories[r[3]] === STAFF_TRAVEL) continue;
      const p = mpData.mps[r[0]].party;
      totals.set(p, (totals.get(p) || 0) + r[7]);
    }
    return Array.from(counts.entries())
      .map(([p, n]) => ({
        party: p,
        short:
          p === "Scottish National Party"
            ? "SNP"
            : p === "Scottish Labour"
              ? "Labour"
              : p === "Liberal Democrat"
                ? "Lib Dems"
                : "Conservatives",
        mps: n,
        total: totals.get(p) || 0,
        perMp: Math.round((totals.get(p) || 0) / n),
      }))
      .sort((a, b) => b.perMp - a.perMp);
  }, [isMsp, mpData, includeStaff]);

  function resetAll() {
    setQuery("");
    setPreset("all");
    setMemberSlug("all");
    setParty("all");
    setYear("all");
    setSort("highest");
    setIncludeLumped(false);
    setIncludeStaff(false);
    setMinAmount(0);
    setPage(1);
    setSurpriseRow(null);
    setPcMatched(null);
    setPcRegionals([]);
    setPcState("idle");
    setPcError("");
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const endIdx = Math.min(startIdx + perPage, filtered.length);
  const visibleRows = filtered.slice(startIdx, endIdx);

  function goToPage(nextPage: number) {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setPage(clamped);
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  const activePresets = isMsp ? MSP_PRESETS : MP_PRESETS;
  const activeQuickWords = isMsp ? MSP_QUICK_WORDS : MP_QUICK_WORDS;
  const visibleQuickWords = showAllChips
    ? activeQuickWords
    : activeQuickWords.filter(
        (w, i) => i < QUICK_WORDS_SHOWN || query.trim().toLowerCase() === w.word.toLowerCase(),
      );
  const selectedMemberObj =
    data && memberSlug !== "all" ? data.mps.find((m) => m.slug === memberSlug) ?? null : null;
  const selectedPresetObj =
    preset !== "all" ? activePresets.find((p) => p.id === preset) ?? null : null;

  function renderReceiptCard(row: RawRow, key: string, highlighted = false) {
    if (!data) return null;
    const m = data.mps[row[0]];
    const yr = data.years[row[1]];
    const cat = data.categories[row[3]];
    const ct = data.costTypes[row[4]];
    const sdOrPayee = row[5];
    const det = row[6];
    const paid = row[7];
    const repaid = row[8];
    const nightsOrMiles = row[9];

    const isAggregated = !isMsp && /aggregated/i.test(det);
    const isRedacted = !isMsp && det.includes("[***]");
    const isStaff = isMsp ? isMspStaffCost(cat, ct) : cat === STAFF_TRAVEL;
    const displayDesc = det || sdOrPayee || `${cat}: ${ct}`;
    const plain = isMsp ? null : plainMpLabel(cat, ct);
    const shortName = m.name.replace(/^Mr |^Dr /, "");
    const profileHref = isMsp
      ? m.profileHref || "/representatives/msps"
      : `/representatives/mps/${m.slug}#donations-and-interests`;

    const subject = isMsp
      ? `Question about a Scottish Parliament expense claim (${moneyExact.format(paid)} on ${formatDate(row[2])})`
      : `Question about an IPSA expense claim (${moneyExact.format(paid)} on ${formatDate(row[2])})`;
    const body = isMsp
      ? `Dear ${m.name},\n\nI am writing to ask about a taxpayer funded expense claim published in the Scottish Parliament's ${yr} records:\n\nDate: ${formatDate(
          row[2],
        )}\nAllowance: ${cat} (${ct})${sdOrPayee ? `\nPaid to: ${sdOrPayee}` : ""}\nAmount paid: ${moneyExact.format(
          paid,
        )}\nPublished description: "${displayDesc}"\n\nCould you explain what this was for and why Scottish taxpayers picked up the bill on top of your MSP salary?\n\nYours sincerely,\n[Your name]\n[Your address and postcode]`
      : `Dear ${m.name},\n\nI am writing to ask about a taxpayer funded expense claim published in IPSA's ${yr} records:\n\nDate: ${formatDate(
          row[2],
        )}\nCategory: ${cat} (${ct})\nAmount paid: ${moneyExact.format(paid)}\nIPSA description: "${displayDesc}"\n\n${
          isStaff
            ? "IPSA lists this as travel for your staff. Could you explain who travelled, what the trip was for and why it was needed?"
            : "Could you explain what this was for and why taxpayers covered the cost on top of your MP salary?"
        }\n\nYours sincerely,\n[Your name]\n[Your address and postcode]`;
    const mailto = `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return (
      <article
        key={key}
        className={`rounded-[var(--r-m)] border p-4 sm:p-5 transition-colors ${
          highlighted
            ? "border-2 border-[var(--bad-text)] bg-[var(--surface)] shadow-sm"
            : "border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--rule-strong)]"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: MP / MSP info */}
          <div className="flex items-start gap-3 min-w-0">
            {m.photo && (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--rule)] bg-[var(--surface-2)]">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <Link
                  href={profileHref}
                  className="ui text-[16.5px] font-[650] text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-[var(--action)]"
                >
                  {m.name}
                </Link>
                <span className="ui inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                  <PartyDot party={m.party} />
                  {m.rawParty} · {m.seat}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px]">
                <span className="ui rounded-full bg-[var(--action-tint)] px-2.5 py-0.5 font-[640] text-[var(--action-text)]">
                  {isMsp ? "Holyrood MSP" : "Westminster MP"}
                </span>
                <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[600] text-[var(--ink-2)]">
                  {yr}
                </span>
                {plain ? (
                  <span className="ui inline-flex flex-wrap items-baseline gap-x-1.5 rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5">
                    <span className="text-[13.5px] font-[640] text-[var(--ink)]">{plain}</span>
                    <span className="text-[11.5px] text-[var(--muted)]">
                      IPSA: {cat} · {ct}
                    </span>
                  </span>
                ) : (
                  <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[560] text-[var(--ink-2)]">
                    {cat} · {ct}
                  </span>
                )}
                {isStaff && (
                  <span className="ui rounded-full bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] px-2.5 py-0.5 font-[640] text-[var(--ink)]">
                    {isMsp ? "Staff cost, not the MSP's own" : "Staff travel, not the MP's own"}
                  </span>
                )}
                {nightsOrMiles > 0 && (
                  <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[560] text-[var(--bad-text)]">
                    {isMsp
                      ? `${nightsOrMiles.toLocaleString("en-GB")} miles`
                      : `${nightsOrMiles} ${nightsOrMiles === 1 ? "night" : "nights"}`}
                  </span>
                )}
                {isRedacted && (
                  <span className="ui rounded-full bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] px-2.5 py-0.5 font-[600] text-[var(--ink)]">
                    Company name blanked out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Amount & date */}
          <div className="flex items-baseline justify-between sm:flex-col sm:items-end shrink-0 border-t border-[var(--rule)] pt-2 sm:border-t-0 sm:pt-0">
            <span className="figure-num tnum text-[24px] sm:text-[26px] leading-none text-[var(--bad-text)]">
              {paid > 0 ? moneyExact.format(paid) : "£0.00"}
            </span>
            {repaid > 0 && (
              <span className="ui mt-1 text-[12.5px] font-[620] text-[var(--good-text)]">
                Paid back: {moneyExact.format(repaid)}
              </span>
            )}
            <span className="ui mt-1 text-[13px] text-[var(--muted)]">{formatDate(row[2])}</span>
          </div>
        </div>

        {/* Printed receipt quote box */}
        <div className="mt-3 rounded-[var(--r-s)] border border-dashed border-[var(--rule-strong)] bg-[var(--surface-2)] px-3.5 py-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <p className="ui text-[11.5px] font-[640] uppercase tracking-[0.06em] text-[var(--muted)]">
              {isAggregated ? "Lumped yearly total (details hidden)" : "What the receipt says"}
            </p>
            {isMsp && sdOrPayee && (
              <p className="ui text-[12.5px] font-[620] text-[var(--ink)]">
                Paid to: <span className="text-[var(--action-text)]">{sdOrPayee}</span>
              </p>
            )}
          </div>
          <p className="font-mono text-[13.5px] leading-[1.5] text-[var(--ink)] break-words">
            {isAggregated
              ? `Yearly total for ${ct.toLowerCase()} in ${yr} (IPSA lumped multiple bills together and hid who was paid).`
              : `"${displayDesc}"`}
          </p>
          {!isMsp && sdOrPayee && det && !isAggregated && sdOrPayee.toLowerCase() !== det.toLowerCase() && (
            <p className="mt-1 text-[12.5px] text-[var(--muted)]">Type: {sdOrPayee}</p>
          )}
        </div>

        {/* Action bar: two clear actions, the rest under "More" */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14.5px]">
          <a href={mailto} className="ui font-[640] text-[var(--action-text)] hover:underline">
            Ask {shortName} about this →
          </a>
          <button
            type="button"
            onClick={() => handleCopyReceipt(row, key)}
            className="ui font-[600] text-[var(--ink)] hover:underline cursor-pointer"
          >
            {copiedId === key ? "Copied ✓" : "Copy to share"}
          </button>
          {memberSlug !== m.slug && (
            <details className="ui relative text-[14px] text-[var(--muted)]">
              <summary className="cursor-pointer list-none hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                More ▾
              </summary>
              <button
                type="button"
                onClick={() => {
                  setMemberSlug(m.slug);
                  setPage(1);
                  setSurpriseRow(null);
                }}
                className="ui mt-1.5 block text-left font-[600] text-[var(--action-text)] hover:underline cursor-pointer"
              >
                Show only {shortName}&apos;s bills
              </button>
            </details>
          )}
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-5">
      {/* SEARCH FIRST: compact MP / MSP switch, search box, Surprise me */}
      <div className="rounded-[var(--r-m)] border-2 border-[var(--brand)] bg-[var(--surface)] p-4 sm:p-5">
        <div
          role="tablist"
          aria-label="Choose Westminster MPs or Holyrood MSPs"
          className="grid grid-cols-2 gap-2"
        >
          {(
            [
              { id: "mp" as Chamber, label: "Westminster MPs", sub: "57 MPs · 20,879 bills" },
              { id: "msp" as Chamber, label: "Holyrood MSPs", sub: "129 MSPs · 50,067 bills" },
            ]
          ).map((c) => {
            const on = chamber === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => switchChamber(c.id)}
                className={`flex flex-col items-start rounded-[var(--r-s)] border-2 px-3 py-2 text-left transition-colors cursor-pointer ${
                  on
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--rule-strong)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
              >
                <span className="ui text-[15.5px] font-[700]">{c.label}</span>
                <span className={`ui text-[13px] ${on ? "text-white/90" : "text-[var(--muted)]"}`}>{c.sub}</span>
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mt-4 text-[var(--bad-text)]">{error}</p>
        ) : !data ? (
          <p className="ui mt-4 text-[16px] font-[600] text-[var(--ink)]">
            {isMsp ? "Loading 50,067 MSP bills..." : "Loading 20,879 MP bills..."}
          </p>
        ) : (
          <div className="mt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="receipt-search-input"
                  className="ui block text-[15px] font-[640] text-[var(--ink)] mb-1.5"
                >
                  {isMsp
                    ? `Search ${data.rows.length.toLocaleString("en-GB")} MSP bills (2021 to 2025)`
                    : `Search ${data.rows.length.toLocaleString("en-GB")} MP bills (2022 to 2027)`}
                </label>
                <div className="relative">
                  <input
                    id="receipt-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                      setSurpriseRow(null);
                    }}
                    placeholder={
                      isMsp ? "Try Calendar or Economist" : "Try IKEA or taxi"
                    }
                    className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] pl-4 pr-20 py-3 text-[16.5px] text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setPage(1);
                      }}
                      aria-label="Clear search text"
                      className="ui absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-1 text-[12.5px] font-[620] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)] cursor-pointer"
                    >
                      Clear ×
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="btn btn-ghost shrink-0 self-start !py-2 !px-4 !text-[14px] sm:self-end"
              >
                Surprise me
              </button>
            </div>

            {/* One-click keyword tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="ui text-[13px] font-[600] text-[var(--muted)] mr-1">
                Try:
              </span>
              {visibleQuickWords.map(({ word, note }) => {
                const isActive = query.trim().toLowerCase() === word.toLowerCase();
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setQuery("");
                      } else {
                        setQuery(word);
                        setPreset("all");
                      }
                      setPage(1);
                      setSurpriseRow(null);
                    }}
                    className={`ui rounded-full px-3 py-1.5 text-[14px] font-[600] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--brand)] text-white border border-[var(--brand)]"
                        : "border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {word}{" "}
                    <span className={isActive ? "opacity-90" : "text-[var(--muted)]"}>({note})</span>
                    {isActive && " ×"}
                  </button>
                );
              })}
              {activeQuickWords.length > QUICK_WORDS_SHOWN && (
                <button
                  type="button"
                  onClick={() => setShowAllChips((v) => !v)}
                  aria-expanded={showAllChips}
                  className="ui rounded-full px-3 py-1.5 text-[14px] font-[640] text-[var(--action-text)] hover:underline cursor-pointer"
                >
                  {showAllChips ? "Fewer" : `More (${activeQuickWords.length - QUICK_WORDS_SHOWN})`}
                </button>
              )}
            </div>

            {/* More filters: closed unless a filter is already on */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                aria-controls="receipt-more-filters"
                className="ui inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-strong)] bg-[var(--surface-2)] px-3.5 py-1.5 text-[14px] font-[640] text-[var(--ink)] hover:border-[var(--ink)] cursor-pointer"
              >
                {showFilters ? "Hide filters" : "More filters"}
                <span aria-hidden="true">{showFilters ? "▴" : "▾"}</span>
              </button>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="ui rounded-full border border-[var(--bad-text)] bg-[color-mix(in_srgb,var(--bad)_10%,transparent)] px-3.5 py-1 text-[13.5px] font-[640] text-[var(--bad-text)] hover:bg-[color-mix(in_srgb,var(--bad)_18%,transparent)] cursor-pointer"
                >
                  Clear all filters ({activeFilterCount}) ×
                </button>
              )}
            </div>

            {showFilters && (
              <div id="receipt-more-filters" className="mt-3 border-t border-[var(--rule)] pt-3">
            {/* Category Preset Chips */}
            <div className="flex flex-wrap gap-2">
              {activePresets.map((p) => {
                const isActive = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    title={p.hint}
                    onClick={() => {
                      setPreset(isActive && p.id !== "all" ? "all" : p.id);
                      setPage(1);
                      setSurpriseRow(null);
                    }}
                    className={`ui rounded-full px-3.5 py-1.5 text-[14px] font-[580] transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                    }`}
                  >
                    {p.label}
                    {isActive && p.id !== "all" && " ×"}
                  </button>
                );
              })}
            </div>

            {/* Filter Dropdowns */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="receipt-member"
                  className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
                >
                  {isMsp ? "Filter by MSP" : "Filter by MP"}
                </label>
                <select
                  id="receipt-member"
                  value={memberSlug}
                  onChange={(e) => {
                    setMemberSlug(e.target.value);
                    setPage(1);
                    setSurpriseRow(null);
                  }}
                  className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
                >
                  <option value="all">
                    {isMsp ? "All 129 Scottish MSPs" : "All 57 Scottish MPs"}
                  </option>
                  {sortedMembers.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.name} ({m.seat})
                      {isMsp && (m.receiptCount || 0) === 0 ? " [new 2026]" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="receipt-party"
                  className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
                >
                  Filter by party
                </label>
                <select
                  id="receipt-party"
                  value={party}
                  onChange={(e) => {
                    setParty(e.target.value);
                    setPage(1);
                    setSurpriseRow(null);
                  }}
                  className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
                >
                  {parties.map((p) => (
                    <option key={p} value={p}>
                      {p === "all" ? "All parties" : p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="receipt-year"
                  className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
                >
                  Expenses year
                </label>
                <select
                  id="receipt-year"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                    setSurpriseRow(null);
                  }}
                  className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
                >
                  <option value="all">
                    {isMsp ? "All years (2021 to 2025)" : "All 5 years (2022 to 2027)"}
                  </option>
                  {[...data.years].reverse().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="receipt-min"
                  className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
                >
                  Minimum claim size
                </label>
                <select
                  id="receipt-min"
                  value={minAmount}
                  onChange={(e) => {
                    setMinAmount(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
                >
                  <option value={0}>Any amount</option>
                  <option value={100}>£100+</option>
                  <option value={500}>£500+</option>
                  <option value={1000}>£1,000+</option>
                  <option value={5000}>£5,000+</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="receipt-sort"
                  className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
                >
                  Sort order
                </label>
                <select
                  id="receipt-sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortId);
                    setPage(1);
                  }}
                  className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
                >
                  <option value="highest">Biggest claim first</option>
                  <option value="newest">Newest claim first</option>
                  <option value="oldest">Oldest claim first</option>
                  <option value="lowest">Smallest claim first</option>
                </select>
              </div>
            </div>

                <div className="mt-4 flex flex-col gap-2.5">
              {!isMsp && (
                <label className="ui inline-flex items-center gap-2 text-[14px] font-[560] text-[var(--ink-2)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLumped}
                    onChange={(e) => {
                      setIncludeLumped(e.target.checked);
                      setPage(1);
                    }}
                    className="h-4 w-4 rounded border-[var(--rule-strong)] accent-[var(--brand)]"
                  />
                  Show yearly totals too (IPSA adds up some bills into one sum a year)
                </label>
              )}
              <label className="ui inline-flex items-center gap-2 text-[14px] font-[560] text-[var(--ink-2)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeStaff}
                  onChange={(e) => {
                    setIncludeStaff(e.target.checked);
                    setPage(1);
                  }}
                  className="h-4 w-4 rounded border-[var(--rule-strong)] accent-[var(--brand)]"
                />
                {isMsp
                  ? "Show staff costs too (trips and costs for the MSP's team)"
                  : "Show staff travel too (trips by the MP's team, not the MP)"}
              </label>
                </div>
            {/* Party Tally Strip (MPs 2025/26 OR MSPs 2024/25) */}
            {!isMsp && mpPartyAverages2025.length > 0 && (
              <div className="mt-5 border-t border-[var(--rule)] pt-4">
                <p className="ui text-[15px] font-[680] text-[var(--ink)]">
                  Average bills per MP in 2025/26, by party
                </p>
                <p className="ui mt-1 mb-2.5 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">
                  2025/26 receipts per current MP, not counting staff wages or staff trips (unless
                  you tick the staff box). Bought-in help from outside firms is included. The
                  rankings page&apos;s averages are higher because they include staff trips and only
                  count MPs who sat all year. Tap a party to see its bills.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {mpPartyAverages2025.map((p) => {
                    const isActive = party === p.party && year === "2025/26";
                    return (
                      <button
                        key={p.party}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setParty("all");
                            setYear("all");
                          } else {
                            setParty(p.party);
                            setYear("2025/26");
                            setMemberSlug("all");
                          }
                          setPage(1);
                          setSurpriseRow(null);
                        }}
                        className={`rounded-[var(--r-s)] border px-3 py-2 text-left transition-colors cursor-pointer ${
                          isActive
                            ? "border-[var(--brand)] bg-[var(--brand-wash)]"
                            : "border-[var(--rule)] bg-[var(--surface-2)] hover:border-[var(--ink)]"
                        }`}
                      >
                        <span className="ui flex items-center gap-1.5 text-[12.5px] font-[640] text-[var(--ink-2)]">
                          <PartyDot party={p.party} />
                          {p.short} ({p.mps} MPs)
                        </span>
                        <span className="figure-num tnum block text-[20px] leading-[1.15] text-[var(--bad-text)] mt-0.5">
                          {moneyWhole.format(p.perMp)}
                          <span className="ui text-[12px] font-[560] text-[var(--muted)]">/MP</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {isMsp && data.partyTally2024 && data.partyTally2024.length > 0 && (
              <div className="mt-5 border-t border-[var(--rule)] pt-4">
                <p className="ui text-[15px] font-[680] text-[var(--ink)]">
                  Average bills per MSP in 2024/25, by party
                </p>
                <p className="ui mt-1 mb-2.5 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">
                  2024/25 only, not counting staff wages. Tap a party to see its bills.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {data.partyTally2024.map((p) => {
                    const isActive = party === p.party && year === "2024/25";
                    return (
                      <button
                        key={p.party}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setParty("all");
                            setYear("all");
                          } else {
                            setParty(p.party);
                            setYear("2024/25");
                            setMemberSlug("all");
                          }
                          setPage(1);
                          setSurpriseRow(null);
                        }}
                        className={`rounded-[var(--r-s)] border px-3 py-2 text-left transition-colors cursor-pointer ${
                          isActive
                            ? "border-[var(--brand)] bg-[var(--brand-wash)]"
                            : "border-[var(--rule)] bg-[var(--surface-2)] hover:border-[var(--ink)]"
                        }`}
                      >
                        <span className="ui flex items-center gap-1.5 text-[12.5px] font-[640] text-[var(--ink-2)] truncate">
                          <PartyDot party={p.party} />
                          {p.short} ({p.msps})
                        </span>
                        <span className="figure-num tnum block text-[20px] leading-[1.15] text-[var(--bad-text)] mt-0.5">
                          {moneyWhole.format(p.perMsp)}
                          <span className="ui text-[12px] font-[560] text-[var(--muted)]">/MSP</span>
                        </span>
                        <span className="ui block text-[11.5px] text-[var(--muted)] mt-0.5">
                          {p.marchPct}% of leaflets in March
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
              </div>
            )}

            {/* Active Filter Pills Strip */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[var(--r-s)] bg-[var(--surface-2)] px-3.5 py-2.5">
                <span className="ui text-[12.5px] font-[640] uppercase tracking-[0.04em] text-[var(--muted)]">
                  Active filters:
                </span>
                {query.trim() && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Search: &ldquo;{query.trim()}&rdquo; <span aria-hidden="true">×</span>
                  </button>
                )}
                {selectedPresetObj && (
                  <button
                    type="button"
                    onClick={() => setPreset("all")}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Category: {selectedPresetObj.label} <span aria-hidden="true">×</span>
                  </button>
                )}
                {selectedMemberObj && (
                  <button
                    type="button"
                    onClick={() => setMemberSlug("all")}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    {isMsp ? "MSP" : "MP"}: {selectedMemberObj.name}{" "}
                    <span aria-hidden="true">×</span>
                  </button>
                )}
                {party !== "all" && (
                  <button
                    type="button"
                    onClick={() => setParty("all")}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Party: {party} <span aria-hidden="true">×</span>
                  </button>
                )}
                {year !== "all" && (
                  <button
                    type="button"
                    onClick={() => setYear("all")}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Year: {year} <span aria-hidden="true">×</span>
                  </button>
                )}
                {minAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => setMinAmount(0)}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    £{minAmount.toLocaleString("en-GB")}+ <span aria-hidden="true">×</span>
                  </button>
                )}
                {includeStaff && (
                  <button
                    type="button"
                    onClick={() => setIncludeStaff(false)}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Including staff costs <span aria-hidden="true">×</span>
                  </button>
                )}
                {!isMsp && includeLumped && (
                  <button
                    type="button"
                    onClick={() => setIncludeLumped(false)}
                    className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
                  >
                    Including lumped yearly totals <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {data && !error && (
        <>
          {/* Surprise Spotlight */}
          {surpriseRow && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="kicker text-[var(--bad-text)]">
                  {isMsp ? "Random real Holyrood MSP receipt" : "Random real Westminster MP receipt"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    className="ui text-[14px] font-[620] text-[var(--action-text)] hover:underline cursor-pointer"
                  >
                    Spin another one →
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurpriseRow(null)}
                    className="ui text-[13.5px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
              </div>
              {renderReceiptCard(surpriseRow, "surprise-card", true)}
            </div>
          )}

          {/* Postcode lookup */}
          <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5">
              <form onSubmit={handlePostcodeLookup} className="flex-1">
                <label
                  htmlFor="finder-postcode-input"
                  className="ui block text-[14.5px] font-[700] text-[var(--ink)] mb-1.5"
                >
                  {isMsp
                    ? "Your 8 MSPs' bills, by postcode"
                    : "Your MP's bills, by postcode"}
                </label>
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="finder-postcode-input"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. G52 1AB"
                    autoComplete="postal-code"
                    className="w-full min-w-0 rounded-full border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-2.5 text-[16px] uppercase text-[var(--ink)] placeholder:normal-case placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none sm:max-w-[260px]"
                  />
                  <button
                    type="submit"
                    disabled={pcState === "loading"}
                    className="btn btn-primary shrink-0 justify-center !py-2.5 !px-5 !text-[14.5px]"
                  >
                    {pcState === "loading" ? "Finding..." : "Show bills"}
                  </button>
                </div>
                {pcState === "error" && (
                  <p className="ui mt-2 text-[14px] font-[560] text-[var(--bad-text)]" role="alert">
                    {pcError}
                  </p>
                )}
                {pcState === "found" && pcMatched && (
                  <div className="mt-2.5 space-y-2" aria-live="polite">
                    <p className="ui text-[14.5px] text-[var(--ink)]">
                      Locked onto <strong>{pcMatched.name}</strong> ({pcMatched.rawParty},{" "}
                      {pcMatched.seat}).{" "}
                      <Link
                        href={
                          isMsp
                            ? pcMatched.profileHref || "/representatives/msps"
                            : `/representatives/mps/${pcMatched.slug}#donations-and-interests`
                        }
                        className="font-[640] text-[var(--brand)]"
                      >
                        Open full {isMsp ? "MSP" : "MP"} profile →
                      </Link>
                    </p>
                    {isMsp && pcRegionals.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="ui text-[12.5px] font-[640] text-[var(--muted)] mr-1">
                          Your 7 regional MSPs:
                        </span>
                        {pcRegionals.map((rm) => {
                          const active = memberSlug === rm.slug;
                          return (
                            <button
                              key={rm.slug}
                              type="button"
                              onClick={() => {
                                setMemberSlug(rm.slug);
                                setPage(1);
                              }}
                              className={`ui inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-[600] cursor-pointer transition-colors ${
                                active
                                  ? "bg-[var(--ink)] text-[var(--paper)]"
                                  : "border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                              }`}
                            >
                              <PartyDot party={rm.party} />
                              {rm.name}
                              {(rm.receiptCount || 0) === 0 && " (new 2026)"}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </form>
          </div>

          {/* Live Running Tally + Mini Leaderboard */}
          <div
            ref={resultsTopRef}
            className="scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface-2)] p-4 sm:p-5 space-y-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="ui text-[16px] text-[var(--ink)]">
                {filtered.length > 0 ? (
                  <>
                    Showing{" "}
                    <strong className="tnum">
                      {(startIdx + 1).toLocaleString("en-GB")} to {endIdx.toLocaleString("en-GB")}
                    </strong>{" "}
                    of <strong className="tnum">{filtered.length.toLocaleString("en-GB")}</strong>{" "}
                    {isMsp ? "MSP" : "MP"} {filtered.length === 1 ? "bill" : "bills"} ·{" "}
                  </>
                ) : (
                  <>No {isMsp ? "MSP" : "MP"} bills found · </>
                )}
                <strong className="text-[var(--bad-text)] tnum">
                  {moneyWhole.format(summary.totalPaid)}
                </strong>{" "}
                paid by taxpayers, {spanText}
                {summary.totalRepaid > 0 && (
                  <>
                    {" "}
                    (
                    <strong className="text-[var(--good-text)] tnum">
                      {moneyWhole.format(summary.totalRepaid)}
                    </strong>{" "}
                    paid back)
                  </>
                )}
                {hiddenCount > 0 && (
                  <span className="mt-1 block text-[14px] text-[var(--ink-2)]">
                    {hiddenCount.toLocaleString("en-GB")} more{" "}
                    {filteredResult.hiddenStaff > 0 && filteredResult.hiddenLumped > 0
                      ? "are lumped totals or staff trips"
                      : filteredResult.hiddenStaff > 0
                        ? isMsp
                          ? "are staff costs"
                          : "are staff trips"
                        : "are lumped totals"}{" "}
                    (not in the total above). Tick the boxes in More filters to add them.
                  </span>
                )}
                <span className="mt-1 block text-[14px] text-[var(--ink-2)]">
                  {isMsp
                    ? "The Scottish Parliament paid every bill here under its rules. Nobody broke them."
                    : "IPSA paid every bill here under its rules. Nobody broke them."}
                </span>
              </div>
            </div>

            {/* Mini Leaderboard of Top 5 MPs/MSPs */}
            {memberSlug === "all" && summary.topMembers.length > 1 && (
              <div className="border-t border-[var(--rule)] pt-3">
                <p className="ui text-[14px] font-[640] text-[var(--ink-2)] mb-2">
                  Biggest claimants, {spanText}, with these filters (tap one to see only their bills)
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {summary.topMembers.map((m, i) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => {
                        setMemberSlug(m.slug);
                        setPage(1);
                      }}
                      className={`${i >= 3 ? "hidden sm:flex" : "flex"} items-center justify-between gap-3 text-left rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 hover:border-[var(--ink)] transition-colors cursor-pointer sm:flex-col sm:items-start sm:justify-start sm:gap-0`}
                    >
                      <span className="min-w-0">
                        <span className="ui flex items-center gap-1.5 text-[14px] font-[640] text-[var(--ink)] truncate">
                          <PartyDot party={m.party} />
                          {i + 1}. {m.name}
                        </span>
                        <span className="ui hidden text-[13px] text-[var(--muted)] truncate sm:block">{m.party}</span>
                      </span>
                      <span className="figure-num tnum shrink-0 text-right text-[16px] text-[var(--bad-text)] sm:mt-1 sm:text-left">
                        {moneyWhole.format(m.total)}{" "}
                        <span className="ui block text-[13.5px] font-[560] text-[var(--ink-2)] sm:inline">
                          ({m.count} {m.count === 1 ? "claim" : "claims"})
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results List */}
          {visibleRows.length === 0 ? (
            <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-8 text-center">
              {isMsp && selectedMemberObj && (selectedMemberObj.receiptCount || 0) === 0 ? (
                <>
                  <p className="ui text-[17px] font-[640] text-[var(--ink)]">
                    {selectedMemberObj.name} was newly elected in May 2026
                  </p>
                  <p className="mt-1.5 max-w-[56ch] mx-auto text-[15px] text-[var(--ink-2)]">
                    The Scottish Parliament has not published expense claims for the new May 2026
                    intake yet. You can still inspect their live 2026 Register of Interests
                    (properties, outside jobs, shares and gifts) on their profile page.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <Link
                      href={selectedMemberObj.profileHref || "/representatives/msps"}
                      className="btn btn-primary"
                    >
                      Open {selectedMemberObj.name}&apos;s profile →
                    </Link>
                    <button type="button" onClick={resetAll} className="btn btn-ghost">
                      Show all MSP receipts
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="ui text-[17px] font-[620] text-[var(--ink)]">
                    No {isMsp ? "MSP" : "MP"} receipts matched that exact combination of filters.
                  </p>
                  <p className="mt-1 text-[15px] text-[var(--ink-2)]">
                    Click any dark filter pill above to remove it, or clear all filters to see all{" "}
                    {data.rows.length.toLocaleString("en-GB")} receipts.
                  </p>
                  <button type="button" onClick={resetAll} className="btn btn-primary mt-4">
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleRows.map((row, idx) =>
                renderReceiptCard(row, `${chamber}-${row[0]}-${row[1]}-${row[2]}-${row[7]}-${idx}`),
              )}

              {totalPages > 1 && (
                <nav
                  aria-label="Receipt pages"
                  className="mt-4 flex flex-col items-center gap-3 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-4 sm:flex-row sm:justify-between"
                >
                  <p className="ui text-[13.5px] text-[var(--muted)]">
                    Showing <strong>{(startIdx + 1).toLocaleString("en-GB")}</strong> to{" "}
                    <strong>{endIdx.toLocaleString("en-GB")}</strong> of{" "}
                    <strong>{filtered.length.toLocaleString("en-GB")}</strong> receipts
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => goToPage(safePage - 1)}
                      className="ui rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-1.5 text-[14px] font-[600] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ← Prev
                    </button>

                    {getPageNumbers(safePage, totalPages).map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className="ui px-1.5 text-[14px] text-[var(--muted)]"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          aria-current={item === safePage ? "page" : undefined}
                          onClick={() => goToPage(item)}
                          className={`ui min-w-[36px] rounded-[var(--r-s)] px-2.5 py-1.5 text-[14px] font-[620] transition-colors cursor-pointer ${
                            item === safePage
                              ? "bg-[var(--ink)] text-[var(--paper)]"
                              : "border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                          }`}
                        >
                          {item.toLocaleString("en-GB")}
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => goToPage(safePage + 1)}
                      className="ui rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-1.5 text-[14px] font-[600] text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </nav>
              )}
            </div>
          )}

          {/* Share and page size, under the results */}
          <div className="flex flex-wrap items-center gap-2.5 [&>*]:shrink-0">
                <div className="inline-flex items-center gap-1.5">
                  <label
                    htmlFor="receipts-per-page"
                    className="ui text-[13px] font-[600] text-[var(--muted)]"
                  >
                    Per page:
                  </label>
                  <select
                    id="receipts-per-page"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="ui rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-2.5 py-1.5 text-[13.5px] font-[600] text-[var(--ink)]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="btn btn-ghost py-1.5 px-3.5 text-[13.5px] font-[600]"
                >
                  {copiedUrl ? "Search link copied ✓" : "Copy link to this search"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyViralSummary}
                  className="btn btn-ghost py-1.5 px-3.5 text-[13.5px] font-[600]"
                >
                  {copiedViral ? "Copied top stats ✓" : "Copy top stats to share"}
                </button>
          </div>
        </>
      )}
    </div>
  );
}
