"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type DirectoryEntry = {
  name: string;
  role: "MP" | "MSP";
  party: string;
  area: string;
  label: string;
  href: string;
  photoUrl?: string;
};

function normalise(value: string) {
  return value.toLocaleLowerCase("en-GB").replace(/[^a-z0-9]+/g, " ").trim();
}

export default function RepresentativeDirectorySearch({ entries }: { entries: DirectoryEntry[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const terms = normalise(query).split(" ").filter(Boolean);
    if (terms.length === 0) return [];
    return entries
      .map((entry) => {
        const name = normalise(entry.name);
        const haystack = normalise(`${entry.name} ${entry.party} ${entry.area} ${entry.role}`);
        const score = name === normalise(query) ? 4 : name.startsWith(normalise(query)) ? 3 : terms.every((term) => haystack.includes(term)) ? 2 : 0;
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name, "en-GB"))
      .slice(0, 12)
      .map((item) => item.entry);
  }, [entries, query]);

  return (
    <section aria-labelledby="representative-search-title" className="mb-10 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker mb-2 text-[var(--brand)]">Already know a name?</p>
          <h2 id="representative-search-title" className="h2">Search every MP and MSP</h2>
          <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">Type a name, party or area. Choose a person to see their details, contact information and recorded votes.</p>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">{entries.length} current representatives</p>
      </div>

      <label className="sr-only" htmlFor="representative-directory-search">Search MPs and MSPs</label>
      <input
        id="representative-directory-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type a name, party or area"
        autoComplete="off"
        className="ui mt-6 w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3.5 text-[16px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--brand)]"
      />

      <div aria-live="polite" className="mt-5">
        {!query.trim() && <p className="ui text-[15px] text-[var(--muted)]">Start typing to see matching people.</p>}
        {query.trim() && results.length === 0 && <p className="ui text-[15px] text-[var(--ink-2)]">No current MP or MSP matches “{query}”. Try a surname, party or constituency.</p>}
        {results.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <Link key={entry.href} href={entry.href} className="group flex items-start gap-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-4 no-underline transition-colors hover:border-[var(--rule-strong)]">
                {entry.photoUrl && (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]">
                    <Image src={entry.photoUrl} alt="" fill sizes="56px" className="object-cover object-top" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="ui block text-[16px] font-[750] leading-[1.35] text-[var(--ink)] group-hover:text-[var(--brand)]">{entry.name}</span>
                  <span className="ui mt-1 block text-[15px] leading-[1.4] text-[var(--ink-2)]">{entry.label} · {entry.party}</span>
                  <span className="ui mt-2 block text-[15px] font-[700] text-[var(--brand)]">View details →</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
