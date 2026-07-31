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
  { label: "Home", href: "/", group: "Pages" },
  { label: "The numbers — six measures", href: "/the-numbers", group: "Pages" },
  { label: "Why Glasgow and not somewhere else", href: "/why-glasgow", group: "Pages" },
  { label: "What would actually fix it", href: "/what-would-fix-it", group: "Pages" },
  { label: "Who decided this — accountability", href: "/accountability", group: "Pages" },
  { label: "Your area — all 32 councils", href: "/areas", group: "Pages" },
  { label: "Constituencies — all 57 seats", href: "/constituencies", group: "Pages" },
  { label: "Take action — write the letter", href: "/take-action", group: "Pages", keywords: "letter mp msp email write" },
  { label: "Methods and sources", href: "/methods", group: "Pages" },
  { label: "Download the data", href: "/data", group: "Pages", keywords: "csv download dataset" },
  { label: "Press and reuse", href: "/press", group: "Pages", keywords: "media journalist embed png" },
  { label: "What changed", href: "/updates", group: "Pages", keywords: "changelog rss updates news" },
  { label: "Plain-English glossary", href: "/glossary", group: "Pages" },
  { label: "About this project", href: "/about", group: "Pages" },
  { label: "Corrections", href: "/corrections", group: "Pages" },
];

function buildRegistry(): Item[] {
  return [
    ...CORE,
    ...indicators.map((i) => ({
      label: i.title,
      href: `/indicators/${i.slug}`,
      group: "Indicators",
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
      group: "Constituencies",
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

const GROUP_ORDER = ["Pages", "Indicators", "Council areas", "Constituencies", "Glossary"];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const registry = useMemo(buildRegistry, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      // A useful resting state: the core pages plus the worst-ranked areas.
      return registry.filter((r) => r.group === "Pages").slice(0, 9);
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

  useEffect(() => setActive(0), [q, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpen() {
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
      setQ("");
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

  let lastGroup = "";

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
        className="relative w-full max-w-[640px] bg-[var(--surface)] border border-[var(--rule-strong)] overflow-hidden"
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
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search areas, constituencies, measures, terms…"
            aria-label="Search"
            className="ui w-full bg-transparent py-4 text-[16.5px] outline-none placeholder:text-[var(--muted)]"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
          />
          <kbd className="datum hidden sm:block text-[10.5px] text-[var(--muted)] border border-[var(--rule)] px-1.5 py-0.5 shrink-0">
            esc
          </kbd>
        </div>

        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          className="max-h-[52vh] overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <p className="px-5 py-6 text-[15px] text-[var(--ink-2)]">
              Nothing matches &ldquo;{q}&rdquo;. Try a council, a constituency, or a term like
              &ldquo;housing costs&rdquo;.
            </p>
          )}
          {results.map((r, i) => {
            const showGroup = r.group !== lastGroup;
            lastGroup = r.group;
            return (
              <div key={r.href + r.label}>
                {showGroup && (
                  <p className="label label-quiet px-5 pt-3 pb-1.5 text-[10px]">{r.group}</p>
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
                    <span className="datum text-[12.5px] text-[var(--muted)] shrink-0">
                      {r.meta}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-[var(--rule)] bg-[var(--surface-2)]">
          <span className="datum text-[10.5px] text-[var(--muted)]">↑↓ choose</span>
          <span className="datum text-[10.5px] text-[var(--muted)]">↵ open</span>
          <span className="datum text-[10.5px] text-[var(--muted)] ml-auto">
            {registry.length} pages indexed
          </span>
        </div>
      </div>
    </div>
  );
}
