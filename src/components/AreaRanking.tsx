import Link from "@/components/IntentLink";
import type { CSSProperties, ReactNode } from "react";
import { COUNCIL_SEARCH_NAMES } from "@/lib/routeMap";
import { compareHref } from "@/components/ComparePromo";

export const areaName = (slug: string) => COUNCIL_SEARCH_NAMES[slug] ?? slug;

export type RankedRow = {
  slug: string;
  rank: number;
  /** The figure the list is ranked on, already formatted. */
  main: string;
  /** Length of the bar under the main figure, 0 to 1. */
  bar: number;
  /** One short value per extra column, already formatted. */
  cells?: ReactNode[];
  /** A short line under the area name, e.g. "Strongest on schools". */
  note?: string;
};

function RankBadge({ rank }: { rank: number }) {
  const top = rank <= 3;
  return (
    <span
      className={`ui grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-[700] tnum ${
        top ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-2)] text-[var(--ink-2)]"
      }`}
    >
      {rank}
    </span>
  );
}

/**
 * Every area in rank order, readable at a glance: a numbered badge, the area,
 * the figure it is ranked on with a bar, then a few supporting figures. On a
 * phone each row becomes a small card with the supporting figures labelled.
 */
export function RankedList({
  rows,
  mainLabel,
  columns = [],
  compareWith,
}: {
  rows: RankedRow[];
  mainLabel: string;
  columns?: string[];
  /** Adds a "Compare" link on each row, against this area. */
  compareWith?: string;
}) {
  const cols = { "--cols": `56px minmax(0,1.3fr) minmax(0,1.1fr) ${columns.map(() => "minmax(0,0.9fr)").join(" ")}` } as CSSProperties;
  return (
    <div className="tile overflow-hidden">
      <div
        className="ui hidden gap-4 border-b border-[var(--rule)] bg-[var(--surface-2)] px-5 py-3 text-[13.5px] font-[600] text-[var(--ink-2)] md:grid md:[grid-template-columns:var(--cols)]"
        style={cols}
      >
        <span>Rank</span>
        <span>Area</span>
        <span>{mainLabel}</span>
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <ol>
        {rows.map((row) => (
          <li
            key={row.slug}
            className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-[var(--rule)] px-5 py-4 last:border-b-0 md:[grid-template-columns:var(--cols)]"
            style={cols}
          >
            <RankBadge rank={row.rank} />
            <div className="min-w-0">
              <Link href={`/areas/${row.slug}`} className="ui text-[17px] font-[650] text-[var(--ink)] no-underline hover:text-[var(--action-text)]">
                {areaName(row.slug)}
              </Link>
              {row.note && <p className="ui mt-0.5 text-[14px] leading-[1.35] text-[var(--ink-2)]">{row.note}</p>}
              {compareWith && compareWith !== row.slug && (
                <Link href={compareHref(row.slug, compareWith)} className="ui mt-0.5 inline-block text-[13.5px]">
                  Compare with {areaName(compareWith)} →
                </Link>
              )}
            </div>
            <div className="col-span-2 min-w-0 md:col-span-1">
              <p className="ui flex items-baseline justify-between gap-3 md:block">
                <span className="text-[13.5px] text-[var(--ink-2)] md:hidden">{mainLabel}</span>
                <span className="tnum text-[19px] font-[700] text-[var(--ink)]">{row.main}</span>
              </p>
              <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                <span className="block h-full rounded-full bg-[var(--brand)]" style={{ width: `${Math.max(3, Math.min(100, row.bar * 100))}%` }} />
              </span>
            </div>
            {row.cells && row.cells.length > 0 && (
              <dl className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2 md:contents">
                {row.cells.map((cell, i) => (
                  <div key={columns[i] ?? i} className="min-w-0">
                    <dt className="ui text-[13px] text-[var(--ink-2)] md:sr-only">{columns[i]}</dt>
                    <dd className="ui m-0 tnum text-[15.5px] text-[var(--ink)]">{cell}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The last updated and figures checked line every ranking page carries. */
export function Freshness({ updated, checked }: { updated: string; checked: string }) {
  return (
    <p className="ui mt-2 text-[14.5px] text-[var(--ink-2)]">
      Last updated <time dateTime={updated}>{formatDate(updated)}</time> · Figures checked{" "}
      <time dateTime={checked}>{formatDate(checked)}</time>
    </p>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

/** Big link tiles to the other rankings and the compare tool. */
export function RankingLinks({ current }: { current?: string }) {
  const links = [
    { href: "/best-place-to-live-in-scotland", title: "Best places to live", body: "All 32 areas ranked on pay, jobs, poverty, crime, health and schools" },
    { href: "/cheapest-place-to-live-in-scotland", title: "Cheapest places to live", body: "House prices, rents and council tax in every area" },
    { href: "/safest-place-to-live-in-scotland", title: "Safest places to live", body: "Recorded crime, violence and break ins in every area" },
    { href: "/glasgow-vs-edinburgh", title: "Glasgow vs Edinburgh", body: "Scotland's two biggest cities, side by side" },
    { href: "/compare-areas", title: "Compare any two areas", body: "Pick two councils, or type two postcodes" },
  ].filter((l) => l.href !== current);
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="tile group flex h-full items-center gap-4 p-5 no-underline">
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-[650] tracking-[-0.01em] text-[var(--ink)] group-hover:text-[var(--action-text)]">{l.title}</span>
              <span className="mt-0.5 block text-[15px] leading-[1.45] text-[var(--ink-2)]">{l.body}</span>
            </span>
            <span aria-hidden="true" className="text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--action-text)]">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
