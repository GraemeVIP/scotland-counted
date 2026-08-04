"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { faqItems, faqSections } from "@/lib/data/faqs";

function matches(item: (typeof faqItems)[number], query: string) {
  const haystack = `${item.q} ${item.a} ${item.keywords ?? ""}`.toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function FaqSearch() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleSections = useMemo(
    () =>
      faqSections
        .filter((section) => topic === "all" || section.id === topic)
        .map((section) => ({
          ...section,
          items: deferredQuery
            ? section.items.filter((item) => matches(item, deferredQuery))
            : section.items,
        }))
        .filter((section) => section.items.length > 0),
    [deferredQuery, topic]
  );

  const visibleCount = visibleSections.reduce((total, section) => total + section.items.length, 0);
  const filtering = Boolean(deferredQuery) || topic !== "all";

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const answer = document.getElementById(id);
    if (answer instanceof HTMLDetailsElement) answer.open = true;
  }, []);

  return (
    <>
      <section aria-labelledby="faq-search-heading">
        <div
          className="rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7"
          style={{ boxShadow: "var(--shadow-2)" }}
        >
          <label
            id="faq-search-heading"
            htmlFor="faq-search"
            className="ui block text-[17px] font-[760] text-[var(--ink)]"
          >
            What do you want to know?
          </label>
          <p className="mt-1 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
            Use ordinary words, try “minimum wage”, “postcode”, “Glasgow” or “who controls benefits”.
          </p>

          <div className="mt-5 flex min-h-14 items-center gap-3 rounded-[var(--r-s)] border-2 border-[var(--ink)] bg-[var(--paper)] px-4 focus-within:border-[var(--brand)]">
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
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all questions"
              autoComplete="off"
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

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter questions by topic">
            <button
              type="button"
              onClick={() => setTopic("all")}
              aria-pressed={topic === "all"}
              className={`ui min-h-11 rounded-full border px-4 py-2 text-[15px] font-[680] transition-colors ${
                topic === "all"
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--rule-strong)] bg-[var(--paper)] text-[var(--ink-2)] hover:border-[var(--brand)]"
              }`}
            >
              All <span className="tnum ml-1 opacity-65">{faqItems.length}</span>
            </button>
            {faqSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setTopic(section.id)}
                aria-pressed={topic === section.id}
                className={`ui min-h-11 rounded-full border px-4 py-2 text-[15px] font-[680] transition-colors ${
                  topic === section.id
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--rule-strong)] bg-[var(--paper)] text-[var(--ink-2)] hover:border-[var(--brand)]"
                }`}
              >
                {section.title} <span className="tnum ml-1 opacity-65">{section.items.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="ui text-[15px] font-[650] text-[var(--ink-2)]" aria-live="polite">
            {filtering
              ? `${visibleCount} ${visibleCount === 1 ? "answer" : "answers"} found`
              : `${faqItems.length} straight answers`}
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
            className="ui text-[15px] font-[700] text-[var(--brand)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-current"
          >
            Search the whole site instead →
          </button>
        </div>
      </section>

      {visibleSections.length > 0 ? (
        <div className="mt-4 divide-y-2 divide-[var(--ink)]">
          {visibleSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 py-10 sm:py-12">
              <div className="grid gap-x-12 gap-y-7 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div>
                  <p className="label mb-3">{section.items.length} answers</p>
                  <h2 className="h2">{section.title}</h2>
                  <p className="mt-3 text-[16px] leading-[1.55] text-[var(--ink-2)]">
                    {section.intro}
                  </p>
                </div>

                <div className="grid content-start gap-3">
                  {section.items.map((item) => (
                    <details
                      key={item.id}
                      id={item.id}
                      open={deferredQuery ? true : undefined}
                      className="group scroll-mt-24 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] open:border-[var(--brand)]"
                    >
                      <summary className="ui flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-[17px] font-[730] leading-[1.4] sm:px-6">
                        <span>{item.q}</span>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[25px] font-[450] leading-none text-[var(--action)] transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="border-t border-[var(--rule)] px-5 py-5 sm:px-6">
                        <p className="max-w-[72ch] text-[16.5px] leading-[1.65] text-[var(--ink-2)]">
                          {item.a}
                        </p>
                        {item.href && item.linkLabel && (
                          <Link
                            href={item.href}
                            className="ui mt-4 inline-flex min-h-11 items-center text-[15px] font-[700] text-[var(--brand)]"
                          >
                            {item.linkLabel} →
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-7 text-center sm:p-10">
          <h2 className="h3">No answer matched those words</h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
            Try fewer words, choose “All”, or search every page on the site.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("all");
              }}
              className="btn btn-ghost"
            >
              Clear the filters
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command"))}
              className="btn btn-primary"
            >
              Search the whole site
            </button>
          </div>
        </div>
      )}
    </>
  );
}
