"use client";

import { useMemo, useState } from "react";
import Link from "@/components/IntentLink";
import { schoolTaxiCouncils, schoolTaxiSummary, type CouncilTaxiRow } from "@/lib/data/schoolTaxis";

type SortKey = "total" | "perPupil" | "nonSchool" | "asnPct" | "name";

const fmtMoney = (n: number | null) => {
  if (n === null) return "Not disclosed";
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`;
  return `£${Math.round(n).toLocaleString("en-GB")}`;
};

const fmtExactMoney = (n: number | null) => {
  if (n === null) return "Not disclosed";
  return `£${Math.round(n).toLocaleString("en-GB")}`;
};

const fmtPerPupil = (n: number | null) => {
  if (n === null) return "n/a";
  return n < 10 ? `£${n.toFixed(2)}` : `£${Math.round(n).toLocaleString("en-GB")}`;
};

export default function SchoolTaxiExplorer() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [selectedSlug, setSelectedSlug] = useState<string>("north-lanarkshire");

  const selected: CouncilTaxiRow = useMemo(
    () => schoolTaxiCouncils.find((c) => c.slug === selectedSlug) ?? schoolTaxiCouncils[0],
    [selectedSlug]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? schoolTaxiCouncils.filter(
          (c) =>
            c.council.toLowerCase().includes(q) ||
            c.region.toLowerCase().includes(q) ||
            c.status.toLowerCase().includes(q)
        )
      : [...schoolTaxiCouncils];

    return list.sort((a, b) => {
      if (sortBy === "name") return a.council.localeCompare(b.council);
      if (sortBy === "asnPct") return b.asnSharePct - a.asnSharePct;
      if (sortBy === "perPupil") return (b.perPupilGbp ?? -1) - (a.perPupilGbp ?? -1);
      if (sortBy === "nonSchool") return (b.nonSchoolGbp ?? -1) - (a.nonSchoolGbp ?? -1);
      return (b.allTaxiGbp ?? -1) - (a.allTaxiGbp ?? -1);
    });
  }, [query, sortBy]);

  return (
    <section
      id="council-checker"
      aria-label="Check your council's taxi bill"
      className="not-prose my-9 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7"
    >
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[14px] font-[620] uppercase tracking-[0.04em] text-[var(--brand)]">
          All 32 Scottish councils · 2024/25
        </p>
        <h3 className="mt-1 text-[23px] font-[640] leading-[1.25] text-[var(--ink)]">
          Check your council&apos;s taxi bill
        </h3>
        <p className="mt-1.5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
          Pick any council below to see its full taxi bill, school run cost per pupil, and how many Band D homes it takes to pay for it.
        </p>
      </div>

      {/* Spotlight card */}
      <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <label htmlFor="taxi-council-select" className="sr-only">
              Choose a Scottish council
            </label>
            <select
              id="taxi-council-select"
              value={selected.slug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-2 text-[16px] font-[620] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              {[...schoolTaxiCouncils]
                .sort((a, b) => a.council.localeCompare(b.council))
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.council}
                  </option>
                ))}
            </select>
            <p className="mt-1.5 text-[14px] text-[var(--ink-2)]">
              {selected.status === "School split published"
                ? `Rank #${selected.rankTotalSpend} of 27 for total bill · Rank #${selected.rankPerPupil} of 25 per pupil`
                : selected.status === "Total only"
                  ? `Rank #${selected.rankTotalSpend} of 27 for total bill · No school run split published`
                  : `Disclosure status: ${selected.status}`}
            </p>
          </div>
          <Link
            href={`/councils/${selected.slug}`}
            className="text-[14.5px] font-[600] text-[var(--brand)] underline underline-offset-4 hover:text-[var(--ink)]"
          >
            View {selected.council} council page →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-3">
            <p className="text-[12.5px] font-[600] uppercase tracking-[0.03em] text-[var(--ink-2)]">
              Total taxi bill
            </p>
            <p className="tnum mt-1 text-[22px] font-[680] text-[var(--ink)]">
              {fmtMoney(selected.allTaxiGbp)}
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-3">
            <p className="text-[12.5px] font-[600] uppercase tracking-[0.03em] text-[var(--ink-2)]">
              School runs
            </p>
            <p className="tnum mt-1 text-[22px] font-[680] text-[var(--action-text)]">
              {selected.schoolTaxiGbp !== null ? fmtMoney(selected.schoolTaxiGbp) : "Not split"}
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-3">
            <p className="text-[12.5px] font-[600] uppercase tracking-[0.03em] text-[var(--ink-2)]">
              Per pupil on roll
            </p>
            <p className="tnum mt-1 text-[22px] font-[680] text-[var(--ink)]">
              {fmtPerPupil(selected.perPupilGbp)}
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-3">
            <p className="text-[12.5px] font-[600] uppercase tracking-[0.03em] text-[var(--ink-2)]">
              Band D homes
            </p>
            <p className="tnum mt-1 text-[22px] font-[680] text-[var(--ink)]">
              {selected.bandDHomesAll !== null
                ? selected.bandDHomesAll.toLocaleString("en-GB")
                : "n/a"}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[14.5px] leading-[1.55] text-[var(--ink-2)]">
          {selected.allTaxiGbp !== null && selected.schoolTaxiGbp !== null ? (
            <>
              <strong>{selected.council}</strong> has{" "}
              {selected.pupils.toLocaleString("en-GB")} pupils on the roll (
              {selected.asnSharePct}% with additional support needs). Non-school
              taxis came to <strong>{fmtExactMoney(selected.nonSchoolGbp)}</strong>.
              Its full taxi bill equals the Band D council tax of{" "}
              <strong>{selected.bandDHomesAll?.toLocaleString("en-GB")} homes</strong>.
              {selected.note ? ` ${selected.note}` : ""}
            </>
          ) : (
            <>
              <strong>{selected.council}</strong> has{" "}
              {selected.pupils.toLocaleString("en-GB")} pupils on the roll (
              {selected.asnSharePct}% with additional support needs).{" "}
              {selected.note ?? "Full school run taxi figures were not published."}
            </>
          )}
        </p>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label htmlFor="taxi-search" className="sr-only">
            Filter councils by name
          </label>
          <input
            id="taxi-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by council name..."
            className="w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3.5 py-2 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-2)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] sm:max-w-[260px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sort councils by">
          {(
            [
              ["total", "Total bill"],
              ["perPupil", "Per pupil"],
              ["nonSchool", "Non-school"],
              ["asnPct", "ASN share"],
              ["name", "A–Z"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSortBy(key)}
              aria-pressed={sortBy === key}
              className={`rounded-full px-3 py-1.5 text-[13.5px] font-[600] transition ${
                sortBy === key
                  ? "bg-[var(--ink)] text-[var(--surface)]"
                  : "border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--ink-2)] hover:text-[var(--ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Full 32-council league table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-[14.5px] leading-[1.45] tnum">
          <thead>
            <tr className="border-b-2 border-[var(--ink)] text-left text-[13px] font-[650] text-[var(--ink)]">
              <th scope="col" className="py-2 pr-3">Council</th>
              <th scope="col" className="py-2 px-2 text-right">Total taxis</th>
              <th scope="col" className="py-2 px-2 text-right">School runs</th>
              <th scope="col" className="py-2 px-2 text-right">Non-school</th>
              <th scope="col" className="py-2 px-2 text-right">Per pupil</th>
              <th scope="col" className="py-2 pl-2 text-right">ASN %</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const isSelected = row.slug === selected.slug;
              const missing = row.allTaxiGbp === null;
              return (
                <tr
                  key={row.slug}
                  onClick={() => setSelectedSlug(row.slug)}
                  className={`cursor-pointer border-b border-[var(--rule)] transition ${
                    isSelected
                      ? "bg-[var(--surface-2)] font-[620]"
                      : "hover:bg-[var(--surface-2)]/60"
                  }`}
                >
                  <td className="py-2.5 pr-3 text-[var(--ink)]">
                    <span className="font-[600]">{row.council}</span>
                    {missing && (
                      <span className="ml-2 inline-block rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[11.5px] font-[600] text-[var(--action-text)]">
                        {row.status}
                      </span>
                    )}
                    {row.status === "Total only" && (
                      <span className="ml-2 inline-block rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[11.5px] font-[600] text-[var(--ink-2)]">
                        No school split
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[var(--ink)]">
                    {fmtMoney(row.allTaxiGbp)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[var(--ink-2)]">
                    {row.schoolTaxiGbp !== null ? fmtMoney(row.schoolTaxiGbp) : "n/a"}
                  </td>
                  <td className="py-2.5 px-2 text-right text-[var(--ink-2)]">
                    {row.nonSchoolGbp !== null ? fmtExactMoney(row.nonSchoolGbp) : "n/a"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-[620] text-[var(--ink)]">
                    {fmtPerPupil(row.perPupilGbp)}
                  </td>
                  <td className="py-2.5 pl-2 text-right text-[var(--ink-2)]">
                    {row.asnSharePct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13.5px] leading-[1.5] text-[var(--ink-2)]">
        Click any row to inspect that council above. Figures are 2024/25 FOI returns combined with the September 2024 Scottish Government pupil census.{" "}
        <a
          href={schoolTaxiSummary.csvUrl}
          download
          className="font-[600] text-[var(--brand)] underline underline-offset-4"
        >
          Download all 32 councils (CSV)
        </a>
        .
      </p>
    </section>
  );
}
