"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/commandRegistry";
import { HUBS, INVESTIGATIONS_HUB, hubColor, type HubId } from "@/lib/data/navigation";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";
import { SectionIcon, SectionTile, type IconName } from "@/components/SectionIcon";

/**
 * Site search: every page on the site reachable in two keystrokes.
 * Cmd/Ctrl-K or the header search button opens it. Typing filters every
 * menu page, council, constituency, MP, MSP, explainer, glossary term and
 * question. The section chips narrow it to one part of the site, and a full
 * postcode offers straight jumps to your representatives and your area.
 * Everything is local data; no request leaves the page except the optional
 * postcode lookup the reader chooses.
 */

/**
 * Punctuation is not a search term.
 *
 * Matching raw strings meant "take home" found nothing, because the label is
 * "Take-home pay calculator" and a hyphen is not a space. The same trap
 * catches "na h eileanan siar", "scotlands" and anything with an apostrophe
 * or an ampersand in it, so everything is flattened to letters, digits and
 * single spaces on both sides of the comparison.
 */
function normalise(s: string) {
  return s
    .toLowerCase()
    // Apostrophes close up rather than splitting, so "Scotland's" becomes
    // "scotlands", which is what people type.
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

const SECTIONS = [...HUBS, INVESTIGATIONS_HUB];

const GROUP_ORDER = [
  "Your postcode",
  "Main pages",
  "Free tools",
  ...SECTIONS.map((hub) => hub.label),
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

/** What people look for most, shown before anything is typed. */
const POPULAR = [
  "/who-is-my-msp",
  "/take-home-pay-calculator-scotland",
  "/council-tax-bands-scotland",
  "/minimum-wage-scotland",
  "/adult-disability-payment",
  "/where-to-apply-scotland",
];

const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

type Result = Item & { action?: "reps" | "area" };

/** The icon and colour a result wears: its section's, or one that suits its kind. */
function look(item: Result): { icon: IconName; color: string } {
  if (item.action === "reps") return { icon: "reps", color: hubColor("reps") };
  if (item.action === "area") return { icon: "area", color: hubColor("area") };
  if (item.section) return { icon: item.section, color: hubColor(item.section) };
  switch (item.group) {
    case "Council areas":
    case "Areas represented by an MP":
    case "Glasgow facts":
      return { icon: "pin", color: hubColor("area") };
    case "Council tax":
    case "Council performance":
      return { icon: "tax", color: hubColor("tax") };
    case "Scottish MPs":
    case "Scottish MSPs":
      return { icon: "person", color: hubColor("reps") };
    case "Glossary":
      return { icon: "book", color: "var(--ink-2)" };
    case "Questions":
      return { icon: "question", color: "var(--ink-2)" };
    case "Free tools":
      return { icon: "tool", color: "var(--brand)" };
    default:
      return { icon: "doc", color: "var(--ink-2)" };
  }
}

/** Bold the parts of a label that match what was typed. */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9£]/gi, ""))
    .filter((w) => w.length >= 2);
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-[3px] bg-transparent font-[680] text-[var(--ink)] underline decoration-[var(--brand)] decoration-2 underline-offset-[3px]">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ui inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[6px] border border-[var(--rule-strong)] bg-[var(--surface)] px-1.5 text-[12px] font-[600] text-[var(--ink-2)] shadow-[0_1px_0_var(--rule-strong)]">
      {children}
    </kbd>
  );
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<HubId | null>(null);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  /*
   * The index arrives when search is first opened, not before.
   *
   * It is every council, constituency, MP, glossary term and FAQ on the site,
   * and this component is mounted in the root layout, so shipping it eagerly
   * charged every visitor on every page for a feature most of them never use.
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

  const postcode = POSTCODE.test(q.trim()) ? q.trim().toUpperCase() : null;

  const results = useMemo<Result[]>(() => {
    const query = normalise(q);
    const pool = scope ? registry.filter((item) => item.section === scope) : registry;
    if (!query) {
      if (scope) return pool;
      return POPULAR.map((href) => registry.find((r) => r.href === href)!)
        .filter(Boolean)
        .map((item) => ({ ...item, group: "Most searched" }));
    }
    const found: Result[] = pool
      .map((item) => ({ item, s: score(item, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group))
      .slice(0, 14)
      // Keep each group together once ranked, so headings do not repeat.
      .sort((a, b) => GROUP_ORDER.indexOf(a.item.group) - GROUP_ORDER.indexOf(b.item.group))
      .map((r) => r.item);
    if (postcode) {
      return [
        { label: `Find your MSPs and MP for ${postcode}`, href: "/who-is-my-msp#postcode-lookup", group: "Your postcode", action: "reps" },
        { label: `See the figures for your area (${postcode})`, href: "/areas", group: "Your postcode", action: "area" },
        ...found,
      ];
    }
    return found;
  }, [q, registry, scope, postcode]);

  function show(nextScope: HubId | null = null) {
    setQ("");
    setScope(nextScope);
    setActive(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQ("");
        setScope(null);
        setActive(0);
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

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
      show();
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

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Focus after the dialog paints and keep the page behind it still.
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function go(item: Result) {
    if (item.action === "reps" && postcode) {
      // The lookup on the page reads the carried postcode and runs it on arrival.
      sessionStorage.setItem(POSTCODE_SESSION_KEY, postcode);
      setOpen(false);
      router.push(item.href);
      return;
    }
    if (item.action === "area" && postcode) {
      setBusy(true);
      try {
        const response = await fetch("/api/representatives", {
          method: "POST",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postcode }),
        });
        const result = (await response.json()) as { council?: { slug?: string } };
        const slug = result.council?.slug;
        setOpen(false);
        router.push(response.ok && slug ? `/areas/${slug}` : "/areas");
      } catch {
        setOpen(false);
        router.push("/areas");
      } finally {
        setBusy(false);
      }
      return;
    }
    setOpen(false);
    router.push(item.href);
  }

  function pickScope(next: HubId | null) {
    setScope(next);
    setActive(0);
    inputRef.current?.focus();
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
      void go(results[active]);
    } else if (e.key === "Backspace" && !q && scope) {
      setScope(null);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const scopeHub = scope ? SECTIONS.find((hub) => hub.id === scope) : undefined;
  const query = q.trim();

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center p-3 sm:px-4 sm:pt-[9vh] no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-[rgba(4,17,47,0.55)] backdrop-blur-[3px]"
        onClick={() => setOpen(false)}
      />
      <div
        ref={dialogRef}
        className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-[720px] flex-col overflow-hidden rounded-[20px] border border-[var(--rule)] bg-[var(--surface)] sm:max-h-[78vh]"
        style={{ boxShadow: "0 40px 80px -28px rgba(2,20,60,0.55), 0 0 0 1px rgba(255,255,255,0.04)" }}
      >
        {/* Search box */}
        <div className="flex items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-5 sm:pt-4">
          <div className="flex min-h-[56px] flex-1 items-center gap-2.5 rounded-[14px] border-2 border-[var(--brand)] bg-[var(--surface)] pl-3.5 pr-2 shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]">
            <SectionIcon name="search" size={19} className="shrink-0 text-[var(--action-text)]" />
            {scopeHub && (
              <button
                type="button"
                onClick={() => pickScope(null)}
                aria-label={`Searching ${scopeHub.label} only. Search everything instead`}
                className="ui inline-flex shrink-0 items-center gap-1.5 rounded-[var(--r-pill)] py-1 pl-2 pr-2.5 text-[13.5px] font-[620] text-[var(--surface)]"
                style={{ background: hubColor(scopeHub.id) }}
              >
                <SectionIcon name={scopeHub.id} size={13} />
                <span className="max-sm:hidden">{scopeHub.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            )}
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder={scopeHub ? `Search ${scopeHub.label}` : "Search a topic, a place or a postcode"}
              aria-label="Search the site"
              className="ui min-w-0 flex-1 bg-transparent py-3 text-[17px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              role="combobox"
              autoComplete="off"
              spellCheck={false}
              aria-expanded="true"
              aria-controls="command-results"
              aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setActive(0);
                  inputRef.current?.focus();
                }}
                aria-label="Clear the search"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="ui inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] sm:w-auto sm:px-1"
          >
            <span className="max-sm:hidden">
              <Kbd>Esc</Kbd>
            </span>
            <svg className="sm:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Section filters */}
        <div className="flex gap-1.5 overflow-x-auto px-3 pt-3 pb-3 sm:flex-wrap sm:px-5 [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => pickScope(null)}
            aria-pressed={scope === null}
            className={`ui inline-flex min-h-9 shrink-0 items-center rounded-[var(--r-pill)] border px-3 text-[13.5px] font-[600] transition-colors ${
              scope === null
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]"
                : "border-[var(--rule)] text-[var(--ink-2)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"
            }`}
          >
            Everything
          </button>
          {SECTIONS.map((hub) => {
            const color = hubColor(hub.id);
            const on = scope === hub.id;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => pickScope(on ? null : hub.id)}
                aria-pressed={on}
                className="ui inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[var(--r-pill)] border px-3 text-[13.5px] font-[600] transition-colors"
                style={
                  on
                    ? { background: color, borderColor: color, color: "var(--surface)" }
                    : {
                        borderColor: `color-mix(in srgb, ${color} 28%, var(--rule))`,
                        background: `color-mix(in srgb, ${color} 7%, var(--surface))`,
                        color: `color-mix(in srgb, ${color} 80%, var(--ink))`,
                      }
                }
              >
                <SectionIcon name={hub.id} size={14} />
                {hub.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          aria-label="Results"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-[var(--rule)] px-2 pt-1 pb-3"
        >
          {registry.length === 0 && <p className="px-4 py-6 text-[15px] text-[var(--muted)]">Loading every page…</p>}
          {registry.length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="ui text-[16px] font-[620] text-[var(--ink)]">
                Nothing matches &ldquo;{query}&rdquo;{scopeHub ? ` in ${scopeHub.label}` : ""}
              </p>
              <p className="mt-1.5 text-[15px] text-[var(--ink-2)]">
                {scopeHub ? (
                  <button type="button" className="ui font-[600] text-[var(--action-text)] underline underline-offset-4" onClick={() => pickScope(null)}>
                    Search everything instead
                  </button>
                ) : (
                  "Try a place name, a payment, or a word like “rent” or “wage”."
                )}
              </p>
            </div>
          )}
          {results.map((r, i) => {
            const showGroup = i === 0 || results[i - 1].group !== r.group;
            const { icon, color } = look(r);
            const on = i === active;
            return (
              <Fragment key={r.href + r.label}>
                {showGroup && (
                  <p role="presentation" className="ui flex items-center gap-2 px-3 pt-3.5 pb-1.5 text-[12.5px] font-[700] uppercase tracking-[0.06em] text-[var(--muted)]">
                    {r.section && SECTIONS.some((hub) => hub.label === r.group) && (
                      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: hubColor(r.section) }} />
                    )}
                    {r.group}
                  </p>
                )}
                <button
                  type="button"
                  id={`cmd-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={on}
                  onClick={() => void go(r)}
                  onMouseMove={() => setActive(i)}
                  disabled={busy && r.action === "area"}
                  className="ui flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left transition-colors"
                  style={on ? { background: `color-mix(in srgb, ${color} 10%, var(--surface))` } : undefined}
                >
                  <SectionTile name={icon} color={color} size={34} solid={on} />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[15.5px] leading-snug text-[var(--ink)]">
                      {busy && r.action === "area" ? "Finding your area…" : <Highlight text={r.label} query={query} />}
                    </span>
                  </span>
                  {r.meta && <span className="ui tnum shrink-0 text-[14px] text-[var(--muted)]">{r.meta}</span>}
                  <span
                    aria-hidden="true"
                    className={`max-sm:hidden shrink-0 transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                  >
                    <Kbd>↵</Kbd>
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-[var(--rule)] bg-[var(--surface-2)] px-5 py-2.5 text-[13.5px] text-[var(--muted)]">
          <span className="ui max-sm:hidden inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="ui max-sm:hidden inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
          <span className="ui ml-auto">
            {query
              ? `${results.length} ${results.length === 1 ? "result" : "results"}`
              : scopeHub
                ? `Every page in ${scopeHub.label}`
                : "Tip: put in a postcode to find your MSP"}
          </span>
        </div>
      </div>
    </div>
  );
}
