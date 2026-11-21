"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "@/components/IntentLink";

type MpMeta = {
  id: number;
  name: string;
  party: string;
  rawParty: string;
  seat: string;
  slug: string;
  email: string;
  photo: string | null;
};

/**
 * Tuple: [mpIdx, yearIdx, dateIso, catIdx, typeIdx, shortDesc, details, amountPaid, amountRepaid, nights]
 */
type RawRow = [number, number, string, number, number, string, string, number, number, number];

type ReceiptsPayload = {
  generatedAt: string;
  years: string[];
  mps: MpMeta[];
  categories: string[];
  costTypes: string[];
  rows: RawRow[];
};

type PresetId =
  | "all"
  | "second-home"
  | "family"
  | "taxis-parking"
  | "hotels"
  | "tech-furniture"
  | "pr-ads"
  | "hospitality"
  | "repaid";

type SortId = "highest" | "newest" | "oldest" | "lowest";

const STAFF_TRAVEL = "Staff Travel";

const PRESETS: { id: PresetId; label: string; hint: string }[] = [
  { id: "all", label: "All receipts", hint: "Every non-payroll IPSA claim line" },
  {
    id: "second-home",
    label: "Second home bills",
    hint: "Rent, council tax, heating, insurance, drains & broadband",
  },
  { id: "family", label: "Family travel", hint: "Flights, trains & taxis for spouses and children" },
  { id: "taxis-parking", label: "Taxis & car parking", hint: "Cabs and parking fees (the MP's own unless staff travel is switched on)" },
  { id: "hotels", label: "London & European hotels", hint: "Overnight hotel stays (the MP's own unless staff travel is switched on)" },
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
    label: "Duplicate & repaid claims",
    hint: "Claims MPs had to pay back to IPSA",
  },
];

const QUICK_SEARCH_WORDS: { word: string; note: string }[] = [
  { word: "Amazon", note: "£40.6k" },
  { word: "IKEA", note: "£20.0k" },
  { word: "speech", note: "£26.8k" },
  { word: "annual report", note: "£31.4k" },
  { word: "carpet", note: "£14.2k" },
  { word: "TV licence", note: "£10.8k" },
  { word: "iPhone", note: "£2.7k" },
  { word: "DFS", note: "£1.2k" },
  { word: "broadband", note: "£13.2k" },
  { word: "drain", note: "£1.2k" },
  { word: "Christmas", note: "£2.5k" },
  { word: "dinner", note: "£963" },
];

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

function matchesPreset(
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

export default function ReceiptSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<ReceiptsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [preset, setPreset] = useState<PresetId>(
    (searchParams.get("preset") as PresetId) || "all",
  );
  const [mpSlug, setMpSlug] = useState(searchParams.get("mp") ?? "all");
  const [party, setParty] = useState(searchParams.get("party") ?? "all");
  const [year, setYear] = useState(searchParams.get("year") ?? "all");
  const [sort, setSort] = useState<SortId>((searchParams.get("sort") as SortId) || "highest");
  const [realDescriptionsOnly, setRealDescriptionsOnly] = useState(
    searchParams.get("real") === "1",
  );
  // Staff travel is filed under the MP but is not the MP's own spending, so it
  // stays out of every list, total and ranking unless the reader switches it on.
  const [includeStaff, setIncludeStaff] = useState(searchParams.get("staff") === "1");
  const [minAmount, setMinAmount] = useState<number>(
    Number(searchParams.get("min") || "0") || 0,
  );
  const [limit, setLimit] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [surpriseRow, setSurpriseRow] = useState<RawRow | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/data/scottish-mp-receipts.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ReceiptsPayload) => {
        if (active) setData(json);
      })
      .catch(() => {
        if (active) setError("Could not load the IPSA receipt archive. Please refresh and try again.");
      });
    return () => {
      active = false;
    };
  }, []);

  // Keep URL query string synced so users can share any exact search or filter view
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (preset !== "all") params.set("preset", preset);
    if (mpSlug !== "all") params.set("mp", mpSlug);
    if (party !== "all") params.set("party", party);
    if (year !== "all") params.set("year", year);
    if (sort !== "highest") params.set("sort", sort);
    if (realDescriptionsOnly) params.set("real", "1");
    if (minAmount > 0) params.set("min", String(minAmount));
    if (includeStaff) params.set("staff", "1");
    const qs = params.toString();
    router.replace(qs ? `/mp-expenses-scotland/search?${qs}` : "/mp-expenses-scotland/search", {
      scroll: false,
    });
  }, [query, preset, mpSlug, party, year, sort, realDescriptionsOnly, minAmount, includeStaff, router]);

  const parties = useMemo(() => {
    if (!data) return ["all"];
    return ["all", ...Array.from(new Set(data.mps.map((m) => m.party))).sort()];
  }, [data]);

  const sortedMps = useMemo(() => {
    if (!data) return [];
    return [...data.mps].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [data]);

  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (preset !== "all" ? 1 : 0) +
    (mpSlug !== "all" ? 1 : 0) +
    (party !== "all" ? 1 : 0) +
    (year !== "all" ? 1 : 0) +
    (realDescriptionsOnly ? 1 : 0) +
    (minAmount > 0 ? 1 : 0) +
    (includeStaff ? 1 : 0);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    const out: RawRow[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      const mp = data.mps[row[0]];
      const yr = data.years[row[1]];
      const cat = data.categories[row[3]];
      const ct = data.costTypes[row[4]];

      if (!includeStaff && cat === STAFF_TRAVEL) continue;
      if (mpSlug !== "all" && mp.slug !== mpSlug) continue;
      if (party !== "all" && mp.party !== party) continue;
      if (year !== "all" && yr !== year) continue;
      if (minAmount > 0 && row[7] < minAmount) continue;
      if (realDescriptionsOnly) {
        if (!row[6] || /aggregated/i.test(row[6])) continue;
      }
      if (!matchesPreset(preset, cat, ct, row[5], row[6], row[8])) continue;

      if (tokens.length > 0) {
        const hay =
          `${mp.name} ${mp.seat} ${mp.party} ${yr} ${cat} ${ct} ${row[5]} ${row[6]}`.toLowerCase();
        let allMatch = true;
        for (const tok of tokens) {
          if (!hay.includes(tok)) {
            allMatch = false;
            break;
          }
        }
        if (!allMatch) continue;
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
    return out;
  }, [data, query, preset, mpSlug, party, year, sort, realDescriptionsOnly, minAmount, includeStaff]);

  const summary = useMemo(() => {
    if (!data || filtered.length === 0) {
      return {
        totalPaid: 0,
        totalRepaid: 0,
        topMps: [] as { slug: string; name: string; party: string; total: number; count: number }[],
      };
    }
    let totalPaid = 0;
    let totalRepaid = 0;
    const byMp = new Map<number, { total: number; count: number }>();
    for (const r of filtered) {
      totalPaid += r[7];
      totalRepaid += r[8];
      const cur = byMp.get(r[0]);
      if (cur) {
        cur.total += r[7];
        cur.count += 1;
      } else {
        byMp.set(r[0], { total: r[7], count: 1 });
      }
    }
    const topMps = Array.from(byMp.entries())
      .map(([idx, stats]) => ({
        slug: data.mps[idx].slug,
        name: data.mps[idx].name,
        party: data.mps[idx].rawParty,
        total: stats.total,
        count: stats.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { totalPaid, totalRepaid, topMps };
  }, [data, filtered]);

  function handleSurpriseMe() {
    if (!data) return;
    // Curated pool of real, non-aggregated, non-rent receipts >= £300 with descriptive text
    const candidates = data.rows.filter((r) => {
      const det = r[6];
      const paid = r[7];
      if (paid < 300) return false;
      if (!includeStaff && data.categories[r[3]] === STAFF_TRAVEL) return false;
      if (!det || /aggregated/i.test(det)) return false;
      const ct = data.costTypes[r[4]];
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
    const mp = data.mps[row[0]];
    const yr = data.years[row[1]];
    const cat = data.categories[row[3]];
    const ct = data.costTypes[row[4]];
    const desc = row[6] || row[5] || `${cat} (${ct})`;
    const forWhat = cat === STAFF_TRAVEL ? `their staff's travel, "${desc}"` : `"${desc}"`;
    const text = `${mp.name} MP (${mp.rawParty}, ${mp.seat}) billed taxpayers ${moneyExact.format(
      row[7],
    )} on ${formatDate(row[2])} (${yr}) for ${forWhat} (${cat} - ${ct}). Official IPSA record via https://scotlandcounted.org.uk/mp-expenses-scotland/search?mp=${mp.slug}`;
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

  function resetAll() {
    setQuery("");
    setPreset("all");
    setMpSlug("all");
    setParty("all");
    setYear("all");
    setSort("highest");
    setRealDescriptionsOnly(false);
    setIncludeStaff(false);
    setMinAmount(0);
    setLimit(30);
    setSurpriseRow(null);
  }

  if (error) {
    return (
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 text-[var(--bad-text)]">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-8 text-center">
        <p className="ui text-[16px] font-[600] text-[var(--ink)]">
          Loading 20,879 Scottish MP receipts from IPSA (2022/23 to 2026/27)...
        </p>
        <p className="mt-1 text-[14.5px] text-[var(--muted)]">
          Every line-by-line claim across all 57 Scottish MPs, ready to search instantly.
        </p>
      </div>
    );
  }

  const visibleRows = filtered.slice(0, limit);
  const selectedMpObj = mpSlug !== "all" ? data.mps.find((m) => m.slug === mpSlug) : null;
  const selectedPresetObj = preset !== "all" ? PRESETS.find((p) => p.id === preset) : null;

  function renderReceiptCard(row: RawRow, key: string, highlighted = false) {
    if (!data) return null;
    const mp = data.mps[row[0]];
    const yr = data.years[row[1]];
    const cat = data.categories[row[3]];
    const ct = data.costTypes[row[4]];
    const sd = row[5];
    const det = row[6];
    const paid = row[7];
    const repaid = row[8];
    const nights = row[9];

    const isAggregated = /aggregated/i.test(det);
    const isRedacted = det.includes("[***]");
    const isStaff = cat === STAFF_TRAVEL;
    const displayDesc = det || sd || `${cat}: ${ct}`;

    const subject = `Question about an IPSA expense claim (${moneyExact.format(paid)} on ${formatDate(row[2])})`;
    const body = `Dear ${mp.name},\n\nI am writing to ask about a taxpayer-funded expense claim published in IPSA's ${yr} records:\n\nDate: ${formatDate(
      row[2],
    )}\nCategory: ${cat} (${ct})\nAmount paid: ${moneyExact.format(paid)}\nIPSA description: "${displayDesc}"\n\n${
      isStaff
        ? "IPSA lists this as travel for your staff. Could you explain who travelled, what the trip was for and why it was needed?"
        : "Could you explain what this was for and why taxpayers covered the cost on top of your MP salary?"
    }\n\nYours sincerely,\n[Your name]\n[Your address and postcode]`;
    const mailto = `mailto:${mp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
          {/* Left: MP info */}
          <div className="flex items-start gap-3 min-w-0">
            {mp.photo && (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--rule)] bg-[var(--surface-2)]">
                <Image
                  src={mp.photo}
                  alt={mp.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <Link
                  href={`/representatives/mps/${mp.slug}#donations-and-interests`}
                  className="ui text-[16.5px] font-[650] text-[var(--ink)] no-underline hover:underline"
                >
                  {mp.name}
                </Link>
                <span className="ui text-[13px] text-[var(--muted)]">
                  {mp.rawParty} · {mp.seat}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px]">
                <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[600] text-[var(--ink-2)]">
                  {yr}
                </span>
                <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[560] text-[var(--ink-2)]">
                  {cat} · {ct}
                </span>
                {isStaff && (
                  <span className="ui rounded-full bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] px-2.5 py-0.5 font-[640] text-[var(--ink)]">
                    Staff travel, not the MP&apos;s own
                  </span>
                )}
                {nights > 0 && (
                  <span className="ui rounded-full border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-0.5 font-[560] text-[var(--bad-text)]">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                )}
                {isRedacted && (
                  <span className="ui rounded-full bg-[color-mix(in_srgb,var(--warn)_18%,transparent)] px-2.5 py-0.5 font-[600] text-[var(--ink)]">
                    Supplier redacted by IPSA
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
                Repaid: {moneyExact.format(repaid)}
              </span>
            )}
            <span className="ui mt-1 text-[13px] text-[var(--muted)]">{formatDate(row[2])}</span>
          </div>
        </div>

        {/* Receipt quote box */}
        <div className="mt-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-3.5 py-2.5">
          <p className="ui text-[11.5px] font-[640] uppercase tracking-[0.05em] text-[var(--muted)] mb-1">
            IPSA official receipt wording
          </p>
          <p className="font-mono text-[13.5px] leading-[1.5] text-[var(--ink)] break-words">
            &ldquo;{displayDesc}&rdquo;
          </p>
          {sd && det && sd.toLowerCase() !== det.toLowerCase() && (
            <p className="mt-1 text-[12.5px] text-[var(--muted)]">Sub-type: {sd}</p>
          )}
          {isAggregated && (
            <p className="mt-1 text-[12.5px] text-[var(--ink-2)]">
              Note: IPSA rolled multiple individual receipts into one yearly total here, hiding who
              was paid.
            </p>
          )}
        </div>

        {/* Action bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13.5px]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopyReceipt(row, key)}
              className="ui font-[600] text-[var(--action-text)] hover:underline cursor-pointer"
            >
              {copiedId === key ? "Copied receipt to clipboard ✓" : "Copy receipt for X / WhatsApp"}
            </button>
            <a href={mailto} className="ui font-[600] text-[var(--ink)] hover:underline">
              Ask {mp.name.replace(/^Mr |^Dr /, "")} about this →
            </a>
          </div>
          <div className="flex items-center gap-3">
            {mpSlug !== mp.slug && (
              <button
                type="button"
                onClick={() => {
                  setMpSlug(mp.slug);
                  setLimit(30);
                  setSurpriseRow(null);
                }}
                className="ui text-[var(--action-text)] hover:underline cursor-pointer"
              >
                Filter to {mp.name.replace(/^Mr |^Dr /, "")}
              </button>
            )}
            <Link
              href={`/representatives/mps/${mp.slug}#donations-and-interests`}
              className="ui text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Full MP profile →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search + Preset Panel */}
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="receipt-search-input"
              className="ui block text-[15px] font-[640] text-[var(--ink)] mb-1.5"
            >
              Search all {data.rows.length.toLocaleString("en-GB")} Scottish MP expense receipts
              (2022/23 to 2026/27)
            </label>
            <div className="relative">
              <input
                id="receipt-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(30);
                  setSurpriseRow(null);
                }}
                placeholder="Try: Amazon, IKEA, speech, iPhone, carpet, DFS, drain, Christmas, taxi..."
                className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] pl-4 pr-20 py-3 text-[16.5px] text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setLimit(30);
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
            className="btn btn-primary shrink-0 justify-center text-center py-3 px-5"
          >
            Surprise me: random receipt
          </button>
        </div>

        {/* One-click keyword tags with live totals */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="ui text-[13px] font-[600] text-[var(--muted)] mr-1">
            Eye-opening searches:
          </span>
          {QUICK_SEARCH_WORDS.map(({ word, note }) => {
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
                  setLimit(30);
                  setSurpriseRow(null);
                }}
                className={`ui rounded-full px-2.5 py-1 text-[13px] font-[580] transition-colors cursor-pointer ${
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
        </div>

        {/* Category Preset Chips (toggleable!) */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--rule)] pt-4">
          {PRESETS.map((p) => {
            const isActive = preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                title={p.hint}
                onClick={() => {
                  // Clicking an active preset toggles it back to "all"
                  setPreset(isActive && p.id !== "all" ? "all" : p.id);
                  setLimit(30);
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
              htmlFor="receipt-mp"
              className="ui block text-[13px] font-[600] text-[var(--muted)] mb-1"
            >
              Filter by MP
            </label>
            <select
              id="receipt-mp"
              value={mpSlug}
              onChange={(e) => {
                setMpSlug(e.target.value);
                setLimit(30);
                setSurpriseRow(null);
              }}
              className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
            >
              <option value="all">All 57 Scottish MPs</option>
              {sortedMps.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.seat})
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
                setLimit(30);
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
              IPSA financial year
            </label>
            <select
              id="receipt-year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setLimit(30);
                setSurpriseRow(null);
              }}
              className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 text-[14.5px] text-[var(--ink)]"
            >
              <option value="all">All 5 years (2022 to 2027)</option>
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
                setLimit(30);
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
                setLimit(30);
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

        {/* Toggle for hiding IPSA aggregated noise */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3.5">
          <label className="ui inline-flex items-center gap-2 text-[14px] font-[560] text-[var(--ink-2)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={realDescriptionsOnly}
              onChange={(e) => {
                setRealDescriptionsOnly(e.target.checked);
                setLimit(30);
              }}
              className="h-4 w-4 rounded border-[var(--rule-strong)] accent-[var(--brand)]"
            />
            Hide IPSA&apos;s lumped &ldquo;Aggregated&rdquo; totals (show real itemised receipts
            only)
          </label>
          <label className="ui inline-flex items-center gap-2 text-[14px] font-[560] text-[var(--ink-2)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeStaff}
              onChange={(e) => {
                setIncludeStaff(e.target.checked);
                setLimit(30);
              }}
              className="h-4 w-4 rounded border-[var(--rule-strong)] accent-[var(--brand)]"
            />
            Include travel by the MP&apos;s staff (hotels, trains and taxis for their team, not the MP)
          </label>

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

        {/* Active Filter Pills Strip (one click to remove any single filter!) */}
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
            {selectedMpObj && (
              <button
                type="button"
                onClick={() => setMpSlug("all")}
                className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
              >
                MP: {selectedMpObj.name} <span aria-hidden="true">×</span>
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
                Including staff travel <span aria-hidden="true">×</span>
              </button>
            )}
            {realDescriptionsOnly && (
              <button
                type="button"
                onClick={() => setRealDescriptionsOnly(false)}
                className="ui inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-[13px] font-[580] text-[var(--paper)] cursor-pointer"
              >
                Itemised only <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Surprise Spotlight */}
      {surpriseRow && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="kicker text-[var(--bad-text)]">Random real IPSA receipt</p>
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

      {/* Live Running Tally + Instant Mini-Leaderboard for the current search */}
      <div className="rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface-2)] p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="ui text-[16px] text-[var(--ink)]">
            <strong>{filtered.length.toLocaleString("en-GB")}</strong>{" "}
            {filtered.length === 1 ? "receipt" : "receipts"} found ·{" "}
            <strong className="text-[var(--bad-text)] tnum">
              {moneyWhole.format(summary.totalPaid)}
            </strong>{" "}
            paid by taxpayers
            {summary.totalRepaid > 0 && (
              <>
                {" "}
                (
                <strong className="text-[var(--good-text)] tnum">
                  {moneyWhole.format(summary.totalRepaid)}
                </strong>{" "}
                repaid)
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyShareUrl}
            className="btn btn-ghost py-1.5 px-3.5 text-[13.5px] font-[600]"
          >
            {copiedUrl ? "Search link copied ✓" : "Copy link to this search"}
          </button>
        </div>

        {/* Mini Leaderboard of Top 5 MPs for THIS exact search/filter */}
        {mpSlug === "all" && summary.topMps.length > 1 && (
          <div className="border-t border-[var(--rule)] pt-3">
            <p className="ui text-[12px] font-[640] uppercase tracking-[0.05em] text-[var(--muted)] mb-2">
              Biggest claimants in this view (click any MP to zoom in)
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {summary.topMps.map((m, i) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => {
                    setMpSlug(m.slug);
                    setLimit(30);
                  }}
                  className="text-left rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-3 py-2 hover:border-[var(--ink)] transition-colors cursor-pointer"
                >
                  <p className="ui text-[13px] font-[640] text-[var(--ink)] truncate">
                    {i + 1}. {m.name}
                  </p>
                  <p className="ui text-[12px] text-[var(--muted)] truncate">{m.party}</p>
                  <p className="figure-num tnum mt-1 text-[16px] text-[var(--bad-text)]">
                    {moneyWhole.format(m.total)}{" "}
                    <span className="ui text-[11.5px] font-[500] text-[var(--muted)]">
                      ({m.count} {m.count === 1 ? "claim" : "claims"})
                    </span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results List */}
      {visibleRows.length === 0 ? (
        <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-8 text-center">
          <p className="ui text-[17px] font-[620] text-[var(--ink)]">
            No receipts matched that exact combination of filters.
          </p>
          <p className="mt-1 text-[15px] text-[var(--ink-2)]">
            Click any dark filter pill above to remove it, or clear all filters to see all 20,879
            receipts.
          </p>
          <button type="button" onClick={resetAll} className="btn btn-primary mt-4">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRows.map((row, idx) =>
            renderReceiptCard(row, `${row[0]}-${row[1]}-${row[2]}-${row[7]}-${idx}`),
          )}

          {filtered.length > limit && (
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setLimit((prev) => prev + 30)}
                className="btn btn-ghost py-2.5 px-6 text-[15px] font-[600]"
              >
                Load 30 more receipts ({(filtered.length - limit).toLocaleString("en-GB")} left) ↓
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
