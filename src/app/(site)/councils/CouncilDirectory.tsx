"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Council } from "@/lib/data/councils";

type CouncilDirectoryProps = {
  councils: Council[];
  publishedSlugs: string[];
};

function normalise(value: string) {
  return value.toLocaleLowerCase("en-GB").trim();
}

/** Searchable A–Z list of all 32 Scottish council areas. */
export default function CouncilDirectory({ councils, publishedSlugs }: CouncilDirectoryProps) {
  const [query, setQuery] = useState("");
  const published = useMemo(() => new Set(publishedSlugs), [publishedSlugs]);
  const visibleCouncils = useMemo(() => {
    const needle = normalise(query);
    return councils.filter((council) => {
      if (!needle) return true;
      return normalise(`${council.name} ${council.slug}`).includes(needle);
    });
  }, [councils, query]);

  return (
    <>
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6">
        <label htmlFor="council-search" className="ui block text-[17px] font-[760] text-[var(--ink)]">
          Find your council
        </label>
        <p id="council-search-hint" className="mt-1 text-[15px] leading-[1.5] text-[var(--ink-2)]">
          Start typing a council name, such as Glasgow, Fife or Highland.
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
            id="council-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all councils"
            autoComplete="off"
            aria-describedby="council-search-hint council-search-count"
            aria-controls="council-results"
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
        <p id="council-search-count" className="ui mt-3 text-[15px] text-[var(--muted)]" aria-live="polite">
          {query.trim()
            ? `${visibleCouncils.length} ${visibleCouncils.length === 1 ? "council" : "councils"} found`
            : "Showing all 32 councils in alphabetical order"}
        </p>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-[var(--r-s)] border border-[var(--brand)] bg-[var(--brand-wash)] p-4 sm:p-5">
        <span aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-[var(--brand)]" />
        <p className="text-[15px] leading-[1.5] text-[var(--ink-2)]">
          <strong className="text-[var(--ink)]">Blue border = this council has a full record. </strong>
          It does not mean the council passed or failed. Red only appears when an official
          source says a target was missed. Nothing is marked red on our say-so.
        </p>
      </div>

      {visibleCouncils.length > 0 ? (
        <div id="council-results" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCouncils.map((council) => {
            const hasRecord = published.has(council.slug);
            return (
              <article
                key={council.slug}
                className={`rounded-[var(--r-s)] border bg-[var(--surface)] p-5 ${
                  hasRecord ? "border-[var(--brand)] border-t-[3px]" : "border-[var(--rule)]"
                }`}
              >
                <p className="ui text-[15px] font-[750] text-[var(--muted)]">
                  {hasRecord ? "Detailed council record" : "Local facts available"}
                </p>
                <h3 className="ui mt-2 text-[18px] font-[750] leading-[1.3] text-[var(--ink)]">
                  {council.name}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">
                  {hasRecord
                    ? "What they promised, what happened, and what the watchdogs found."
                    : "Council record coming soon. Local poverty facts are ready now."}
                </p>
                <Link
                  href={hasRecord ? `/councils/${council.slug}` : `/areas/${council.slug}`}
                  className="ui mt-4 inline-block text-[15px] font-[700] text-[var(--brand)]"
                >
                  {hasRecord ? "Read the council record →" : "See the area figures →"}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-7 text-center sm:p-10">
          <h3 className="h3">No council matched those words</h3>
          <p className="mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
            Try the council&apos;s full name, or clear the search to see all 32 areas.
          </p>
          <button type="button" onClick={() => setQuery("")} className="btn btn-ghost mt-5">
            Show all councils
          </button>
        </div>
      )}
    </>
  );
}
