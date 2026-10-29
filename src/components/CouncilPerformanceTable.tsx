"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  councilPerformanceRows,
  type CouncilPerformanceRow,
} from "@/lib/data/councilPerformanceIndex";

type View = "national" | "peer" | "residents";

const VIEWS: { id: View; label: string; short: string }[] = [
  { id: "national", label: "All councils", short: "All" },
  { id: "peer", label: "Like-for-like", short: "Like-for-like" },
  { id: "residents", label: "What residents said", short: "Residents" },
];

function rankFor(row: CouncilPerformanceRow, view: View) {
  if (view === "peer") return row.peerRank;
  if (view === "residents") return row.residentVerdict.rank;
  return row.overallRank;
}

function valueFor(row: CouncilPerformanceRow, view: View) {
  if (view === "peer") return row.peerScore;
  if (view === "residents") return row.residentVerdict.average;
  return row.overallScore;
}

function rankMovement(row: CouncilPerformanceRow) {
  return row.overallRank - row.peerRank;
}

function movementLabel(row: CouncilPerformanceRow) {
  const movement = rankMovement(row);
  if (movement > 0) return `up ${movement}`;
  if (movement < 0) return `down ${Math.abs(movement)}`;
  return "no change";
}

function detailFor(row: CouncilPerformanceRow, view: View) {
  if (view === "peer") {
    return `${movementLabel(row)} from national rank`;
  }
  if (view === "residents") {
    return `survey base ${row.residentVerdict.base.toLocaleString("en-GB")}`;
  }
  return `usually ranks ${row.rankLow}–${row.rankHigh}`;
}

function viewExplanation(view: View) {
  if (view === "peer") {
    return "We ran the same test again, but only against councils facing similar levels of poverty, population and rural challenges. This is the fairer like-for-like view.";
  }
  if (view === "residents") {
    return "This comes from five questions in the 2024 Scottish Household Survey. People were asked about service quality, value, influence, action and respectful treatment. Small gaps may be down to chance.";
  }
  return "Our main ranking of all 32 councils. It combines what residents said, service results, how the council is run, value for money and the council's own emissions.";
}

export default function CouncilPerformanceTable() {
  const [view, setView] = useState<View>("national");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();

  const sorted = useMemo(() => {
    const normalised = query.trim().toLocaleLowerCase("en-GB");
    return [...councilPerformanceRows]
      .filter((row) => !normalised || row.name.toLocaleLowerCase("en-GB").includes(normalised))
      .sort((a, b) => rankFor(a, view) - rankFor(b, view) || a.name.localeCompare(b.name));
  }, [query, view]);

  const visible = query.trim() || expanded ? sorted : sorted.slice(0, 10);
  const valueHeading = view === "residents" ? "Survey average" : "Score";

  return (
    <section className="not-prose my-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
      <div className="border-b border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-7">
        <p className="ui text-[15px] font-[620] text-[var(--brand)]">Explore all 32 councils</p>
        <h3 className="mt-1 text-[26px] font-[620] leading-[1.2] tracking-[-0.02em]">
          See how the list changes
        </h3>
        <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
          {viewExplanation(view)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose ranking view">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setView(item.id);
                setExpanded(false);
              }}
              aria-pressed={view === item.id}
              className={`ui rounded-full border px-4 py-2.5 text-[15px] font-[580] transition-colors ${
                view === item.id
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--rule-strong)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
              }`}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 max-w-[420px]">
          <label htmlFor={searchId} className="ui block text-[15px] font-[580] text-[var(--ink)]">
            Find your council
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Start typing a council name"
            className="mt-2 w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-wash)]"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-6 text-[16px] text-[var(--ink-2)]">No council matches that search.</p>
      ) : (
        <>
          <ol className="divide-y divide-[var(--rule)] sm:hidden">
            {visible.map((row) => {
              const rank = rankFor(row, view);
              const value = valueFor(row, view);
              return (
                <li key={row.code} className={rank <= 3 ? "bg-[var(--brand-wash)]" : undefined}>
                  <Link href={`/councils/${row.slug}`} className="block p-4 no-underline active:bg-[var(--surface-2)]">
                    <div className="flex items-start gap-3">
                      <span className="ui tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] text-[15px] font-[620]">
                        {rank}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-[600] leading-[1.35] text-[var(--ink)]">{row.name}</span>
                        <span className="ui mt-1 block text-[15px] leading-[1.45] text-[var(--muted)]">{detailFor(row, view)}</span>
                      </span>
                      <span className="tnum shrink-0 text-right">
                        <span className="block text-[21px] font-[620] leading-none text-[var(--ink)]">{value.toFixed(1)}{view === "residents" ? "%" : ""}</span>
                        <span className="ui mt-1 block text-[15px] text-[var(--muted)]">{view === "residents" ? "average" : "score"}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[700px] border-collapse text-[15px]">
              <thead>
                <tr className="bg-[var(--surface-2)] text-left">
                  <th className="border-b-2 border-[var(--ink)] px-5 py-3 font-[600]">#</th>
                  <th className="border-b-2 border-[var(--ink)] px-3 py-3 font-[600]">Council</th>
                  <th className="border-b-2 border-[var(--ink)] px-3 py-3 text-right font-[600]">{valueHeading}</th>
                  <th className="border-b-2 border-[var(--ink)] px-5 py-3 text-right font-[600]">What to know</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => {
                  const rank = rankFor(row, view);
                  const value = valueFor(row, view);
                  return (
                    <tr key={row.code} className={rank <= 3 ? "bg-[var(--brand-wash)]" : "hover:bg-[var(--surface-2)]"}>
                      <td className="tnum border-b border-[var(--rule)] px-5 py-3 text-[var(--muted)]">{rank}</td>
                      <td className="border-b border-[var(--rule)] px-3 py-3">
                        <Link href={`/councils/${row.slug}`} className="font-[560] text-[var(--ink)] hover:text-[var(--brand)]">
                          {row.name}
                        </Link>
                      </td>
                      <td className="tnum border-b border-[var(--rule)] px-3 py-3 text-right text-[17px] font-[620]">
                        {value.toFixed(1)}{view === "residents" ? "%" : ""}
                      </td>
                      <td className="ui border-b border-[var(--rule)] px-5 py-3 text-right text-[15px] text-[var(--ink-2)]">
                        {detailFor(row, view)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!query.trim() && sorted.length > 10 && (
        <div className="border-t border-[var(--rule)] p-4 text-center">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="btn btn-secondary"
          >
            {expanded ? "Show the top 10" : "Show all 32 councils"}
          </button>
        </div>
      )}

      <p className="border-t border-[var(--rule)] px-5 py-4 text-[15px] leading-[1.55] text-[var(--muted)] sm:px-7">
        The scores compare councils with each other. They are not percentages, pass marks or official grades. The usual rank range shows where each council landed in the middle 90% of 10,000 reruns. The survey base is the number of people who answered locally.
      </p>
    </section>
  );
}
