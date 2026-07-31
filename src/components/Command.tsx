"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { councils } from "@/lib/data/councils";
import { constituencies } from "@/lib/data/constituencies";
import { indicators } from "@/lib/data/indicators";
import { terms } from "@/lib/data/glossary";

/**
 * The command palette: every page on the site reachable in two
 * keystrokes. Cmd/Ctrl-K or the header search button opens it; typing
 * filters councils, constituencies, indicators, glossary terms and the
 * core pages. Everything is local data — no request leaves the page.
 */

type Item = {
  label: string;
  href: string;
  group: string;
  /** Right-aligned metadata, e.g. the area's latest rate. */
  meta?: string;
  keywords?: string;
};

const CORE: Item[] = [
  { label: "Home", href: "/", group: "Main pages" },
  { label: "Every Scottish council area", href: "/areas", group: "Main pages" },
  { label: "Find the area your MP represents", href: "/constituencies", group: "Main pages" },
  { label: "What changed in Glasgow", href: "/the-numbers", group: "Main pages" },
  { label: "Why poverty is worse in Glasgow", href: "/why-glasgow", group: "Main pages" },
  { label: "What would help cut poverty", href: "/what-would-fix-it", group: "Main pages" },
  { label: "Who decides what", href: "/accountability", group: "Main pages" },
  { label: "Email your MP and MSP", href: "/take-action", group: "Main pages", keywords: "letter mp msp email write" },
  { label: "How the figures were counted", href: "/methods", group: "Check the proof" },
  { label: "Download the data", href: "/data", group: "Check the proof", keywords: "csv download dataset" },
  { label: "Press and reuse", href: "/press", group: "Check the proof", keywords: "media journalist embed png" },
  { label: "What changed", href: "/updates", group: "More", keywords: "changelog rss updates news" },
  { label: "Words explained", href: "/glossary", group: "Check the proof" },
  { label: "About this project", href: "/about", group: "More" },
  { label: "Report or see corrections", href: "/corrections", group: "More" },
  { label: "Get in touch", href: "/contact", group: "More", keywords: "email press error report message" },
];

function buildRegistry(): Item[] {
  return [
    ...CORE,
    ...indicators.map((i) => ({
      label: i.title,
      href: `/indicators/${i.slug}`,
      group: "Glasgow facts",
      keywords: `${i.label} chart data`,
    })),
    ...councils.map((c) => ({
      label: c.name,
      href: `/areas/${c.slug}`,
      group: "Council areas",
      meta: `${c.pcts[9]}%`,
      keywords: "council area child poverty",
    })),
    ...constituencies.map((c) => ({
      label: c.name,
      href: `/constituencies/${c.slug}`,
      group: "Areas represented by an MP",
      meta: `${c.pcts[9]}%`,
      keywords: "constituency mp seat westminster",
    })),
    ...terms.map((t) => ({
      label: t.term,
      href: `/glossary#${t.id}`,
      group: "Glossary",
      keywords: t.def.slice(0, 60),
    })),
  ];
}

function score(item: Item, q: string): number {
  const hay = `${item.label} ${item.keywords ?? ""}`.toLowerCase();
  const label = item.label.toLowerCase();
  if (label.startsWith(q)) return 4;
  if (label.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (label.includes(q)) return 2;
  if (hay.includes(q)) return 1;
  return 0;
}

const GROUP_ORDER = ["Main pages", "Council areas", "Areas represented by an MP", "Glasgow facts", "Glossary", "Check the proof", "More"];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const registry = useMemo(() => buildRegistry(), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      // Resting state answers the most common intent first: where you live.
      const pin = [
        "/areas/glasgow-city",
        "/areas",
        "/constituencies",
        "/take-action",
        "/the-numbers",
        "/glossary",
      ];
      return pin
        .map((href) => registry.find((r) => r.href === href)!)
        .filter(Boolean);
    }
    return registry
      .map((item) => ({ item, s: score(item, query) }))
      .filter((r) => r.s > 0)
      .sort(
        (a, b) =>
          b.s - a.s || GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group)
      )
      .slice(0, 12)
      .map((r) => r.item);
  }, [q, registry]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQ("");
        setActive(0);
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
      setQ("");
      setActive(0);
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      // Focus after the dialog paints.
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function go(item: Item) {
    setOpen(false);
    router.push(item.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-[rgba(13,26,36,0.55)] backdrop-blur-[2px] cursor-default"
        onClick={() => setOpen(false)}
      />
      <div
        className="relative w-full max-w-[640px] rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule-strong)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-3)" }}
      >
        <div className="flex items-center gap-3 px-5 border-b-2 border-[var(--ink)]">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            className="text-[var(--action)] shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Type a place or a topic"
            aria-label="Search"
            className="ui w-full bg-transparent py-4 text-[16.5px] outline-none placeholder:text-[var(--muted)]"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ui text-[15px] text-[var(--muted)] hover:text-[var(--ink)] shrink-0 py-1"
          >
            Close
          </button>
        </div>

        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          className="max-h-[52vh] overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <p className="px-5 py-6 text-[15px] text-[var(--ink-2)]">
              Nothing matches &ldquo;{q}&rdquo;. Try a place name or a term like
              &ldquo;housing costs&rdquo;.
            </p>
          )}
          {results.map((r, i) => {
            const showGroup = i === 0 || results[i - 1].group !== r.group;
            return (
              <div key={r.href + r.label}>
                {showGroup && (
                  <p className="ui text-[15px] font-[680] text-[var(--muted)] px-5 pt-3.5 pb-1.5">
                    {r.group}
                  </p>
                )}
                <button
                  type="button"
                  id={`cmd-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={i === active}
                  onClick={() => go(r)}
                  onMouseEnter={() => setActive(i)}
                  className={`ui flex w-full items-baseline justify-between gap-4 px-5 py-2.5 text-left text-[15px] transition-colors ${
                    i === active
                      ? "bg-[var(--brand-wash)] text-[var(--ink)]"
                      : "text-[var(--ink-2)]"
                  }`}
                >
                  <span className="truncate">
                    {i === active && (
                      <span className="text-[var(--action)] mr-2" aria-hidden="true">
                        →
                      </span>
                    )}
                    {r.label}
                  </span>
                  {r.meta && (
                    <span className="ui tnum text-[15px] text-[var(--muted)] shrink-0">
                      {r.meta}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-5 py-3 border-t border-[var(--rule)] bg-[var(--surface-2)]">
          <span className="ui text-[15px] text-[var(--muted)]">
            Type, then choose from the list
          </span>
          <span className="ui text-[15px] text-[var(--muted)] ml-auto">
            Every page on the site is in here
          </span>
        </div>
      </div>
    </div>
  );
}
