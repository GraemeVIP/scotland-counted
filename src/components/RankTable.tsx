"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

/**
 * The ranked league table used for councils and constituencies.
 * Click a column header to re-sort; the default order is the rank by
 * latest rate, which is also what the rank number always refers to.
 */

export type RankRow = {
  rank: number;
  name: string;
  href: string;
  latest: number;
  first: number;
  change: number;
  children: number;
  highlight?: boolean;
};

type SortKey = "rank" | "name" | "latest" | "first" | "change" | "children";

const COLS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "rank", label: "#", numeric: true },
  { key: "name", label: "", numeric: false },
  { key: "latest", label: "", numeric: true },
  { key: "first", label: "", numeric: true },
  { key: "change", label: "10-year change", numeric: true },
  { key: "children", label: "Children", numeric: true },
];

export default function RankTable({
  rows,
  nameLabel,
  latestLabel,
  firstLabel,
  collapsedRows,
  showAllLabel,
  showLessLabel = "Show the top 10 only",
}: {
  rows: RankRow[];
  nameLabel: string;
  latestLabel: string;
  firstLabel: string;
  collapsedRows?: number;
  showAllLabel?: string;
  showLessLabel?: string;
}) {
  const [key, setKey] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const rowsId = useId();

  const labels: Record<SortKey, string> = {
    rank: "#",
    name: nameLabel,
    latest: latestLabel,
    first: firstLabel,
    change: "10-year change",
    children: "Children",
  };

  /** Phone sorts, in plain words. */
  const MOBILE_SORTS: { id: string; label: string; key: SortKey; asc: boolean }[] = [
    { id: "worst", label: "Highest rate", key: "rank", asc: true },
    { id: "rise", label: "Biggest rise", key: "change", asc: false },
    { id: "az", label: "A to Z", key: "name", asc: true },
  ];
  const activeMobile =
    MOBILE_SORTS.find((m) => m.key === key && m.asc === asc)?.id ?? null;

  const sorted = useMemo(() => {
    const r = [...rows].sort((a, b) => {
      if (key === "name") return a.name.localeCompare(b.name);
      return (a[key] as number) - (b[key] as number);
    });
    return asc ? r : r.reverse();
  }, [rows, key, asc]);
  const canCollapse = collapsedRows !== undefined && rows.length > collapsedRows;
  const visibleRows = canCollapse && !expanded ? sorted.slice(0, collapsedRows) : sorted;

  function toggle(k: SortKey) {
    if (k === key) setAsc((a) => !a);
    else {
      setKey(k);
      // Rates and change read most naturally worst-first.
      setAsc(k === "name" || k === "rank");
    }
  }

  return (
    <div>
      <div id={rowsId}>
      {/* ---------- Phone: a list you can actually read ---------- */}
      <div className="sm:hidden">
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Sort the list">
          {MOBILE_SORTS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setKey(m.key);
                setAsc(m.asc);
              }}
              aria-pressed={activeMobile === m.id}
              className={`ui rounded-full px-4 py-2 text-[15px] font-[640] border transition-colors ${
                activeMobile === m.id
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                  : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--rule-strong)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <ol className="border-t border-[var(--rule)]">
          {visibleRows.map((r) => (
            <li
              key={r.href}
              className={r.highlight ? "bg-[var(--glasgow-wash)]" : undefined}
            >
              <Link
                href={r.href}
                className="flex items-center gap-3 py-3.5 px-2 border-b border-[var(--rule)] active:bg-[var(--surface-2)]"
              >
                <span className="ui text-[15px] text-[var(--muted)] tnum w-[2ch] shrink-0 text-right">
                  {r.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`ui block text-[15.5px] leading-[1.3] ${
                      r.highlight ? "font-[680]" : "font-[540]"
                    }`}
                  >
                    {r.name}
                  </span>
                  <span className="ui block text-[15px] text-[var(--muted)] mt-1 leading-[1.45]">
                    Ten years ago: {r.first}% · {r.children.toLocaleString("en-GB")} children now
                  </span>
                </span>
                <span className="figure-num text-[21px] tnum shrink-0">{r.latest}%</span>
                <span aria-hidden="true" className="text-[var(--muted)] shrink-0">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- Wider screens: the full table ---------- */}
      <div className="hidden sm:block overflow-x-auto">
      <table className="w-full border-collapse text-[15px]">
        <thead>
          <tr>
            {COLS.map((c) => {
              const active = key === c.key;
              return (
                <th
                  key={c.key}
                  aria-sort={active ? (asc ? "ascending" : "descending") : undefined}
                  className={`p-0 border-b-2 border-[var(--ink)] ${
                    c.numeric && c.key !== "rank" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className={`ui w-full text-[15px] font-[680] pr-4 pt-1 pb-2.5 whitespace-nowrap transition-colors ${
                      c.numeric && c.key !== "rank" ? "text-right" : "text-left"
                    } ${active ? "text-[var(--brand)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
                  >
                    {labels[c.key]}
                    <span aria-hidden="true" className="inline-block w-[1.1em]">
                      {active ? (asc ? " ▲" : " ▼") : ""}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((r) => (
            <tr
              key={r.href}
              className={
                r.highlight
                  ? "bg-[var(--glasgow-wash)] hover:bg-[var(--surface-2)] transition-colors"
                  : "hover:bg-[var(--surface-2)] transition-colors"
              }
            >
              <td className="pr-4 py-2.5 border-b border-[var(--rule)] tnum text-[var(--muted)]">
                {r.rank}
              </td>
              <td className="pr-4 py-2.5 border-b border-[var(--rule)]">
                <Link
                  href={r.href}
                  className={`hover:text-[var(--brand)] ${r.highlight ? "font-[640]" : ""}`}
                >
                  {r.name}
                </Link>
              </td>
              <td className="pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum font-[600]">
                {r.latest}%
              </td>
              <td className="pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum text-[var(--ink-2)]">
                {r.first}%
              </td>
              <td
                className={`pr-4 py-2.5 border-b border-[var(--rule)] text-right tnum ${
                  r.change > 0 ? "text-[var(--bad)]" : "text-[var(--good)]"
                }`}
              >
                {r.change > 0 ? "+" : ""}
                {r.change} points
              </td>
              <td className="py-2.5 border-b border-[var(--rule)] text-right tnum text-[var(--ink-2)]">
                {r.children.toLocaleString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>

      {canCollapse && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls={rowsId}
            className="btn btn-ghost justify-center"
          >
            {expanded ? showLessLabel : (showAllLabel ?? `See all ${rows.length} areas`)}
            <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
