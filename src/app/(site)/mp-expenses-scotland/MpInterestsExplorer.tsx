"use client";

import { useState, useMemo } from "react";
import Link from "@/components/IntentLink";
import type { MpInterestRecord } from "@/lib/data/mpInterests";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const moneyExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

type FilterTab =
  | "donations_freebies"
  | "expenses_nonstaff"
  | "expenses_total"
  | "visits"
  | "gifts"
  | "property";

const TABS: { id: FilterTab; label: string; total: string }[] = [
  { id: "expenses_nonstaff", label: "Rent, travel & hotels", total: "£5.21m" },
  { id: "expenses_total", label: "All expenses incl. staff", total: "£18.32m" },
  { id: "donations_freebies", label: "Donations & freebies", total: "£297k" },
  { id: "visits", label: "Funded foreign trips", total: "£77k" },
  { id: "gifts", label: "VIP tickets & gifts", total: "£15k" },
  { id: "property", label: "Property & companies", total: "" },
];

/** Party dot colours. Decorative only: the party name is always printed beside it. */
const PARTY_DOT: Record<string, string> = {
  Labour: "#d6202a",
  "Labour (Co-op)": "#d6202a",
  "Scottish National Party": "#e8b500",
  Conservative: "#0a7ad6",
  "Liberal Democrat": "#f39200",
};

function shortParty(p: string) {
  if (p === "Scottish National Party") return "SNP";
  if (p === "Liberal Democrat") return "Lib Dem";
  return p;
}

function metricFor(r: MpInterestRecord, tab: FilterTab): number {
  switch (tab) {
    case "expenses_nonstaff":
      return r.expenses?.nonStaffSpend ?? 0;
    case "expenses_total":
      return r.expenses?.totalSpend ?? 0;
    case "visits":
      return r.visitsTotal;
    case "gifts":
      return r.giftsTotal;
    case "property":
      return r.properties.length + r.shareholdings.length;
    default:
      return r.totalFinancialValue;
  }
}

function formatMetric(value: number, tab: FilterTab) {
  if (tab === "property") return `${value} ${value === 1 ? "item" : "items"}`;
  return money.format(value);
}

function expenseNotes(r: MpInterestRecord): string[] {
  const e = r.expenses;
  if (!e) return [];
  const notes: string[] = [];
  if (e.secondHomeRent > 0) notes.push(`2nd home rent ${money.format(e.secondHomeRent)}`);
  if (e.secondHomeCouncilTax > 0)
    notes.push(`2nd home council tax ${money.format(e.secondHomeCouncilTax)}`);
  if (e.londonHotels > 0) notes.push(`London hotels ${money.format(e.londonHotels)}`);
  if (e.flights > 0) notes.push(`Flights ${money.format(e.flights)}`);
  if (e.taxis > 0) notes.push(`Taxis ${money.format(e.taxis)}`);
  if (e.dependantTravel > 0) notes.push(`Family travel ${money.format(e.dependantTravel)}`);
  if (e.parking > 0) notes.push(`Parking ${money.format(e.parking)}`);
  return notes;
}

function interestNotes(r: MpInterestRecord): string[] {
  const out: string[] = [];
  for (const d of r.donations) out.push(`${d.donor} (${moneyExact.format(d.value)})`);
  for (const v of r.visits)
    out.push(
      `Trip to ${v.countries.join("/")} paid by ${v.donors.join(", ")} (${moneyExact.format(v.value)})`,
    );
  for (const g of r.gifts) out.push(`${g.donor} (${moneyExact.format(g.value)})`);
  for (const p of r.properties)
    out.push(`Property in ${p.location}${p.rentalIncome ? " (rental income)" : ""}`);
  for (const s of r.shareholdings) out.push(`Shares: ${s.organisation}`);
  for (const f of r.family)
    out.push(`Family (${f.relation}): ${f.personName}, ${f.jobTitle} at ${f.employer}`);
  return out;
}

function PartyTag({ party }: { party: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ background: PARTY_DOT[party] ?? "var(--flat)" }}
      />
      {shortParty(party)}
    </span>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <span
      aria-hidden="true"
      className="mt-1.5 block h-[5px] w-full overflow-hidden rounded-full bg-[var(--paper-3)]"
    >
      <span
        className="block h-full rounded-full bg-[var(--bad)] transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

function Rank({ n }: { n: number }) {
  const top = n <= 3;
  return (
    <span
      className={`tnum inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-1.5 text-[13px] font-[680] ${
        top
          ? "bg-[var(--bad-text)] text-white"
          : "border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)]"
      }`}
    >
      {n}
    </span>
  );
}

export default function MpInterestsExplorer({ records }: { records: MpInterestRecord[] }) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState<string>("all");
  const [tab, setTab] = useState<FilterTab>("expenses_nonstaff");
  const [showAll, setShowAll] = useState(false);

  const parties = useMemo(() => {
    const s = new Set(records.map((r) => r.party));
    return ["all", ...Array.from(s).sort()];
  }, [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records
      .filter((r) => {
        if (party !== "all" && r.party !== party) return false;
        if (tab === "visits" && r.visitsTotal === 0) return false;
        if (tab === "gifts" && r.giftsTotal === 0) return false;
        if (tab === "property" && r.properties.length === 0 && r.shareholdings.length === 0)
          return false;
        if (!q) return true;
        const haystack = [
          r.name,
          r.constituency,
          r.party,
          ...r.donations.map((d) => `${d.donor} ${d.description}`),
          ...r.visits.map((v) => `${v.countries.join(" ")} ${v.donors.join(" ")} ${v.purpose}`),
          ...r.gifts.map((g) => `${g.donor} ${g.description}`),
          ...r.properties.map((p) => `${p.location} ${p.country} ${p.description ?? ""}`),
          ...r.shareholdings.map((s) => `${s.organisation} ${s.description ?? ""}`),
          ...r.family.map((f) => `${f.personName} ${f.employer} ${f.jobTitle}`),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort(
        (a, b) =>
          metricFor(b, tab) - metricFor(a, tab) ||
          (b.expenses?.nonStaffSpend ?? 0) - (a.expenses?.nonStaffSpend ?? 0) ||
          a.name.localeCompare(b.name),
      );
  }, [records, query, party, tab]);

  const isExpensesMode = tab === "expenses_nonstaff" || tab === "expenses_total";
  const isSearching = query.trim().length > 0 || party !== "all";
  const visibleRows = isSearching || showAll ? filtered : filtered.slice(0, 10);
  const max = filtered.reduce((m, r) => Math.max(m, metricFor(r, tab)), 0);
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="tile overflow-hidden">
      {/* Controls */}
      <div className="border-b border-[var(--rule)] bg-[var(--surface-2)] p-4 sm:p-6">
        <div
          role="tablist"
          aria-label="Choose what to rank Scottish MPs by"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`ui inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[14.5px] font-[600] transition-colors ${
                  active
                    ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                    : "border border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
                {item.total && (
                  <span
                    className={`tnum text-[12.5px] font-[560] ${
                      active ? "opacity-75" : "text-[var(--muted)]"
                    }`}
                  >
                    {item.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <label htmlFor="mp-interests-search" className="sr-only">
              Search by MP, constituency, donor, company or country visited
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="mp-interests-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an MP, town, donor or country (try Qatar or Silverstone)"
              className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] py-2.5 pl-11 pr-4 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)]"
            />
          </div>
          <div>
            <label htmlFor="mp-interests-party" className="sr-only">
              Filter by party
            </label>
            <select
              id="mp-interests-party"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-2.5 text-[16px] text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-wash)]"
            >
              {parties.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All parties (57 MPs)" : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="ui mt-3.5 text-[14px] text-[var(--muted)]" aria-live="polite">
          Ranked by <strong className="text-[var(--ink)]">{activeTab.label.toLowerCase()}</strong>.
          Showing <strong className="text-[var(--ink)] tnum">{visibleRows.length}</strong> of{" "}
          <strong className="text-[var(--ink)] tnum">{filtered.length}</strong> MPs. Tap a name for
          their full receipts.
        </p>
      </div>

      {filtered.length === 0 && (
        <p className="ui px-6 py-10 text-center text-[15.5px] text-[var(--ink-2)]">
          No Scottish MP matches that search. Try a surname, a town or a country.
        </p>
      )}

      {/* Phone: one card per MP */}
      <ol className="divide-y divide-[var(--rule)] md:hidden">
        {visibleRows.map((r, idx) => {
          const value = metricFor(r, tab);
          const notes = isExpensesMode ? expenseNotes(r) : interestNotes(r);
          return (
            <li key={r.memberId} className="px-4 py-4">
              <div className="flex items-start gap-3">
                <Rank n={idx + 1} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={`/representatives/mps/${r.constituencySlug}#donations-and-interests`}
                      className="ui text-[16px] font-[640] leading-[1.3] text-[var(--ink)] no-underline hover:underline"
                    >
                      {r.name}
                    </Link>
                    <span className="figure-num tnum shrink-0 text-[19px] text-[var(--bad-text)]">
                      {isExpensesMode && !r.expenses ? "New MP" : formatMetric(value, tab)}
                    </span>
                  </div>
                  <p className="ui mt-0.5 text-[13px] text-[var(--muted)]">
                    <PartyTag party={r.party} /> · {r.constituency}
                  </p>
                  <Bar value={value} max={max} />
                  <p className="mt-2 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">
                    {notes.length > 0
                      ? notes.slice(0, 3).join(" · ") +
                        (notes.length > 3 ? ` · +${notes.length - 3} more` : "")
                      : isExpensesMode
                        ? "Elected at a June 2026 by-election, so not in the 2025/26 IPSA year."
                        : "Nothing declared in these categories."}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Tablet and desktop: full table */}
      <div className="hidden md:block">
        {isExpensesMode ? (
          <table className="w-full border-collapse text-[14.5px]">
            <thead>
              <tr className="ui border-b border-[var(--rule-strong)] text-left text-[12.5px] font-[620] uppercase tracking-[0.04em] text-[var(--muted)]">
                <th className="py-3 pl-6 pr-3 font-[620]">MP</th>
                <th className="px-3 py-3 text-right font-[620]">Second home</th>
                <th className="px-3 py-3 text-right font-[620]">Travel & hotels</th>
                <th className="px-3 py-3 text-right font-[620]">Office</th>
                <th className="w-[190px] px-3 py-3 text-right font-[620]">
                  {tab === "expenses_total" ? "Total incl. staff" : "Non-staff total"}
                </th>
                <th className="py-3 pl-3 pr-6 font-[620]">What stands out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {visibleRows.map((r, idx) => {
                const e = r.expenses;
                const notes = expenseNotes(r);
                const value = metricFor(r, tab);
                return (
                  <tr
                    key={r.memberId}
                    className="align-top transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="flex items-start gap-3">
                        <Rank n={idx + 1} />
                        <div className="min-w-0">
                          <Link
                            href={`/representatives/mps/${r.constituencySlug}#donations-and-interests`}
                            className="ui font-[640] text-[var(--ink)] no-underline hover:underline"
                          >
                            {r.name}
                          </Link>
                          <span className="ui block text-[13px] text-[var(--muted)]">
                            <PartyTag party={r.party} /> · {r.constituency}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {e ? money.format(e.accommodationSpend) : "–"}
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {e ? money.format(e.travelSpend) : "–"}
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {e ? money.format(e.officeSpend) : "–"}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="tnum font-[680] text-[var(--bad-text)]">
                        {e ? money.format(value) : "New MP"}
                      </span>
                      <Bar value={value} max={max} />
                    </td>
                    <td className="max-w-[300px] py-3.5 pl-3 pr-6 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">
                      {notes.length > 0 ? (
                        notes.slice(0, 3).join(" · ")
                      ) : (
                        <span className="text-[var(--muted)]">
                          Elected at a June 2026 by-election (not in the 2025/26 IPSA year)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse text-[14.5px]">
            <thead>
              <tr className="ui border-b border-[var(--rule-strong)] text-left text-[12.5px] font-[620] uppercase tracking-[0.04em] text-[var(--muted)]">
                <th className="py-3 pl-6 pr-3 font-[620]">MP</th>
                <th className="px-3 py-3 text-right font-[620]">Donations</th>
                <th className="px-3 py-3 text-right font-[620]">Foreign trips</th>
                <th className="px-3 py-3 text-right font-[620]">Gifts</th>
                <th className="w-[170px] px-3 py-3 text-right font-[620]">
                  {tab === "property" ? "Items declared" : activeTab.label}
                </th>
                <th className="py-3 pl-3 pr-6 font-[620]">Named donors, trips & interests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {visibleRows.map((r, idx) => {
                const notes = interestNotes(r);
                const value = metricFor(r, tab);
                return (
                  <tr
                    key={r.memberId}
                    className="align-top transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="flex items-start gap-3">
                        <Rank n={idx + 1} />
                        <div className="min-w-0">
                          <Link
                            href={`/representatives/mps/${r.constituencySlug}#donations-and-interests`}
                            className="ui font-[640] text-[var(--ink)] no-underline hover:underline"
                          >
                            {r.name}
                          </Link>
                          <span className="ui block text-[13px] text-[var(--muted)]">
                            <PartyTag party={r.party} /> · {r.constituency}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {money.format(r.donationsTotal)}
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {money.format(r.visitsTotal)}
                    </td>
                    <td className="tnum px-3 py-3.5 text-right text-[var(--ink-2)]">
                      {money.format(r.giftsTotal)}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="tnum font-[680] text-[var(--bad-text)]">
                        {formatMetric(value, tab)}
                      </span>
                      <Bar value={value} max={max} />
                    </td>
                    <td className="max-w-[320px] py-3.5 pl-3 pr-6 text-[13.5px] leading-[1.45] text-[var(--ink-2)]">
                      {notes.length > 0 ? (
                        notes.slice(0, 3).join(" · ") +
                        (notes.length > 3 ? ` · +${notes.length - 3} more` : "")
                      ) : (
                        <span className="text-[var(--muted)]">
                          No private donations, trips, gifts or property declared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!isSearching && filtered.length > 10 && (
        <div className="flex justify-center border-t border-[var(--rule)] bg-[var(--surface-2)] px-4 py-4">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
            className="btn btn-ghost text-[15px] font-[600]"
          >
            {showAll ? "Show the top 10 only ↑" : `Show all ${filtered.length} MPs ↓`}
          </button>
        </div>
      )}
    </div>
  );
}
