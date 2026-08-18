"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/commandRegistry";

/**
 * The command palette: every page on the site reachable in two
 * keystrokes. Cmd/Ctrl-K or the header search button opens it; typing
 * filters councils, constituencies, indicators, glossary terms and the
 * core pages. Everything is local data, no request leaves the page.
 */


/**
 * Punctuation is not a search term.
 *
 * Matching raw strings meant "take home" found nothing, because the label is
 * "Take-home pay calculator" and a hyphen is not a space. That is the most
 * likely thing anyone would type to find that page. The same trap catches
 * "na h eileanan siar", "scotlands" and anything with an apostrophe or an
 * ampersand in it, so everything is flattened to letters, digits and single
 * spaces on both sides of the comparison.
 */
function normalise(s: string) {
  return s
    .toLowerCase()
    // Apostrophes close up rather than splitting, so "Scotland's" becomes
    // "scotlands", which is what people type. Turning it into "scotland s"
    // would match neither spelling.
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function score(item: Item, q: string): number {
  const label = normalise(item.label);
  const hay = `${label} ${normalise(item.keywords ?? "")}`;
  if (label.startsWith(q)) return 4;
  if (label.split(" ").some((w) => w.startsWith(q))) return 3;
  if (label.includes(q)) return 2;
  if (hay.includes(q)) return 1;
  // Every word typed appears somewhere, "glasgow tax", "band c edinburgh".
  const words = q.split(" ").filter(Boolean);
  if (words.length > 1 && words.every((w) => hay.includes(w))) return 1;
  return 0;
}

const GROUP_ORDER = [
  "Main pages",
  "Free tools",
  "Questions",
  "Explainers",
  "Council areas",
  "Council performance",
  "Council tax",
  "Scottish MPs",
  "Scottish MSPs",
  "Areas represented by an MP",
  "Glasgow facts",
  "Glossary",
  "Check the proof",
  "More",
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  /*
   * The index arrives when the palette is first opened, not before.
   *
   * It is every council, constituency, MP, glossary term and FAQ on the site,
   * and this component is mounted in the root layout, so shipping it eagerly
   * charged every visitor on every page for a feature most of them never use.
   * Fetching it on first open costs one small request at the moment somebody
   * has actually asked for search.
   */
  const [registry, setRegistry] = useState<Item[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    let cancelled = false;
    void import("@/lib/commandRegistry").then((mod) => {
      if (!cancelled) setRegistry(mod.buildRegistry());
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo(() => {
    const query = normalise(q);
    if (!query) {
      // Resting state answers the most common intent first: where you live.
      const pin = [
        "/areas/glasgow-city",
        "/areas",
        "/representatives",
        "/email-your-mp-and-msp",
        "/glasgow-poverty-statistics",
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
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (!open || e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
  }, [open]);

  useEffect(() => {
    if (!open) {
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        requestAnimationFrame(() => previous.focus());
      }
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    // Focus after the dialog paints and keep the page behind it still.
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = previousOverflow;
    };
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
        ref={dialogRef}
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
