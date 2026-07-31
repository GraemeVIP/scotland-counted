"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  { key: "change", label: "Change", numeric: true },
  { key: "children", label: "Children", numeric: true },
];

export default function RankTable({
  rows,
  nameLabel,
  latestLabel,
  firstLabel,
}: {
  rows: RankRow[];
  nameLabel: string;
  latestLabel: string;
  firstLabel: string;
}) {
  const [key, setKey] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);

  const labels: Record<SortKey, string> = {
    rank: "#",
    name: nameLabel,
    latest: latestLabel,
    first: firstLabel,
    change: "Change",
    children: "Children",
  };

  const sorted = useMemo(() => {
    const r = [...rows].sort((a, b) => {
      if (key === "name") return a.name.localeCompare(b.name);
      return (a[key] as number) - (b[key] as number);
    });
    return asc ? r : r.reverse();
  }, [rows, key, asc]);

  function toggle(k: SortKey) {
    if (k === key) setAsc((a) => !a);
    else {
      setKey(k);
      // Rates and change read most naturally worst-first.
      setAsc(k === "name" || k === "rank");
    }
  }

  return (
    <div className="overflow-x-auto">
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
                    className={`ui w-full text-[10.5px] uppercase tracking-[0.1em] font-[680] pr-4 pt-1 pb-2.5 whitespace-nowrap transition-colors ${
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
          {sorted.map((r) => (
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
                {r.change}
              </td>
              <td className="py-2.5 border-b border-[var(--rule)] text-right tnum text-[var(--ink-2)]">
                {r.children.toLocaleString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
