"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type MspReviewDirectoryEntry = {
  memberId: number;
  slug: string;
  name: string;
  party: string;
  areas: string[];
  ratingValue: number | null;
  reviewCount: number;
};

function normalise(value: string) {
  return value
    .toLocaleLowerCase("en-GB")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function MspReviewDirectory({ entries }: { entries: MspReviewDirectoryEntry[] }) {
  const [query, setQuery] = useState("");
  const visibleEntries = useMemo(() => {
    const terms = normalise(query).split(" ").filter(Boolean);
    if (terms.length === 0) return entries;

    return entries.filter((entry) => {
      const haystack = normalise(`${entry.name} ${entry.party} ${entry.areas.join(" ")} MSP`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [entries, query]);

  return (
    <>
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6">
        <label htmlFor="msp-review-search" className="ui block text-[17px] font-[760] text-[var(--ink)]">
          Find an MSP
        </label>
        <p id="msp-review-search-hint" className="mt-1 text-[15px] leading-[1.5] text-[var(--ink-2)]">
          Search by name, political party, constituency or region.
        </p>
        <div className="mt-4 flex min-h-14 items-center gap-3 rounded-[var(--r-s)] border-2 border-[var(--ink)] bg-[var(--paper)] px-4 focus-within:border-[var(--brand)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            className="shrink-0 text-[var(--brand)]"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <input
            id="msp-review-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="For example, Monica Lennon or Glasgow"
            autoComplete="off"
            aria-describedby="msp-review-search-hint msp-review-search-count"
            aria-controls="msp-review-results"
            className="ui min-w-0 flex-1 bg-transparent py-3 text-[17px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ui min-h-11 shrink-0 px-2 text-[15px] font-[700] text-[var(--brand)]"
            >
              Clear
            </button>
          )}
        </div>
        <p id="msp-review-search-count" className="ui mt-3 text-[15px] text-[var(--muted)]" aria-live="polite">
          {query.trim()
            ? `${visibleEntries.length} ${visibleEntries.length === 1 ? "MSP" : "MSPs"} found`
            : `Showing all ${entries.length} current MSPs in alphabetical order`}
        </p>
      </div>

      {visibleEntries.length > 0 ? (
        <div id="msp-review-results" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEntries.map((entry) => (
            <article key={entry.memberId} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--brand)]">
              <h3 className="ui text-[17px] font-[750] leading-[1.35] text-[var(--ink)]">
                <Link
                  href={`/msp-reviews/${entry.slug}`}
                  className="no-underline hover:text-[var(--brand)]"
                >
                  {entry.name}
                </Link>
              </h3>
              <p className="ui mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                {entry.party} · {entry.areas.join(", ")}
              </p>
              <p className="ui mt-3 text-[15px] font-[700] text-[var(--brand)]">
                {entry.reviewCount > 0 && entry.ratingValue !== null
                  ? `${entry.ratingValue.toFixed(1)} out of 5 · ${entry.reviewCount} ${entry.reviewCount === 1 ? "review" : "reviews"}`
                  : "No approved reviews yet"}
              </p>
              <Link
                href={`/msp-reviews/${entry.slug}`}
                className="ui mt-4 inline-block text-[15px] font-[700] text-[var(--ink)]"
              >
                {entry.reviewCount > 0 ? "Read reviews or add yours →" : "Be the first to review →"}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-7 text-center sm:p-10">
          <h3 className="h3">No current MSP matched those words</h3>
          <p className="mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
            Try a surname, party, constituency or region, or clear the search to see everyone.
          </p>
          <button type="button" onClick={() => setQuery("")} className="btn btn-ghost mt-5">
            Show all MSPs
          </button>
        </div>
      )}
    </>
  );
}
