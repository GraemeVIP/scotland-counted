"use client";

import { BrandLogo } from "@/components/BrandLogo";
import Link from "@/components/IntentLink";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";
import { BANK_HOLIDAY_PAYMENT_DATES } from "@/lib/data/benefits";
import { COUNCIL_SEARCH_NAMES, councilTaxPath } from "@/lib/routeMap";
import {
  ABOUT,
  EVIDENCE,
  EXPLAINERS,
  HUBS,
  hubColor,
  hubForPath,
  type Hub,
  type HubFeature,
  type HubId,
} from "@/lib/data/navigation";

/**
 * The menus.
 *
 * Desktop: each section in the header opens its own short panel, one at a
 * time, instead of one panel holding everything. The old panel was 928px tall
 * at 1440 wide with a sentence under every link, and its last two sections
 * sat below the fold.
 *
 * Phone: search first, then the six sections, opening one at a time. Closed,
 * it fits on one screen; the old sheet was 4,049px long.
 */

const COUNCILS = Object.entries(COUNCIL_SEARCH_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

const inputClass =
  "ui w-full min-h-12 rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Thursday 24 December 2026" as a local date. Parsed by hand: Safari rejects that string. */
function parseLongDate(text: string) {
  const [, day, month, year] = text.match(/(\d{1,2}) (\w+) (\d{4})$/) ?? [];
  return new Date(Number(year), MONTHS.indexOf(month), Number(day)).getTime();
}

/** The next payment that moves for a bank holiday, from today. */
function nextEarlyPayment(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return BANK_HOLIDAY_PAYMENT_DATES.find(({ due }) => parseLongDate(due) >= today);
}

function FeatureForm({ feature, onNavigate }: { feature: HubFeature; onNavigate: () => void }) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const v = value.trim();
    if (feature.kind === "salary") {
      const amount = v.replace(/[^0-9.]/g, "");
      onNavigate();
      router.push(amount ? `${feature.href}?s=${encodeURIComponent(amount)}` : feature.href);
      return;
    }
    if (feature.kind === "council") {
      if (!v) return;
      onNavigate();
      router.push(councilTaxPath(v));
      return;
    }
    const postcode = v.toUpperCase();
    if (!postcode) return;
    if (feature.kind === "postcode-reps") {
      // The lookup on the page reads the carried postcode and runs it on arrival.
      sessionStorage.setItem(POSTCODE_SESSION_KEY, postcode);
      onNavigate();
      router.push(`${feature.href}#postcode-lookup`);
      return;
    }
    // postcode-area: resolve the council here, then open its area page.
    setState("loading");
    try {
      const response = await fetch("/api/representatives", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode }),
      });
      const result = (await response.json()) as { council?: { slug?: string } };
      const slug = result.council?.slug;
      if (!response.ok || !slug) throw new Error("not found");
      onNavigate();
      router.push(`/areas/${slug}`);
    } catch {
      setState("error");
    }
  }

  if (feature.kind === "council") {
    return (
      <form onSubmit={submit} className="mt-1 grid gap-2">
        <label htmlFor={id} className="ui text-[14px] font-[600] text-[var(--ink-2)]">
          Your council
        </label>
        <select id={id} value={value} onChange={(e) => setValue(e.target.value)} className={inputClass}>
          <option value="">Choose your council</option>
          {COUNCILS.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary justify-center">
          {feature.cta} <span aria-hidden="true">→</span>
        </button>
      </form>
    );
  }

  const salary = feature.kind === "salary";
  return (
    <form onSubmit={submit} className="mt-1 grid gap-2">
      <label htmlFor={id} className="ui text-[14px] font-[600] text-[var(--ink-2)]">
        {salary ? "Your yearly salary" : "Your postcode"}
      </label>
      <input
        id={id}
        type="text"
        inputMode={salary ? "numeric" : "text"}
        autoComplete={salary ? "off" : "postal-code"}
        data-clarity-mask={salary ? undefined : "true"}
        value={value}
        onChange={(e) => setValue(salary ? e.target.value : e.target.value.toUpperCase())}
        placeholder={salary ? "£30,000" : feature.kind === "postcode-reps" ? "e.g. EH1 1RE" : "e.g. G12 8QQ"}
        className={inputClass}
      />
      <button type="submit" className="btn btn-primary justify-center" disabled={state === "loading"}>
        {state === "loading" ? "Finding your area" : feature.cta} <span aria-hidden="true">→</span>
      </button>
      {state === "error" && (
        <p role="alert" className="text-[14.5px] leading-[1.45] text-[var(--bad-text)]">
          That postcode did not work. Check it, or{" "}
          <Link href="/areas" onClick={onNavigate}>
            pick your area from the list
          </Link>
          .
        </p>
      )}
    </form>
  );
}

function Feature({ hub, onNavigate }: { hub: Hub; onNavigate: () => void }) {
  const { feature } = hub;
  const color = hubColor(hub.id);
  const next = feature.kind === "payment-dates" ? nextEarlyPayment() : undefined;
  return (
    <div
      className="flex flex-col gap-2.5 rounded-[var(--r-m)] p-5"
      style={{ background: `color-mix(in srgb, ${color} 9%, var(--surface))` }}
    >
      <p className="kicker" style={{ color }}>
        {feature.kicker}
      </p>
      <p className="text-[20px] font-[600] leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
        {next ? `Paid early on ${next.paid.replace(/ \d{4}$/, "")}` : feature.title}
      </p>
      <p className="text-[15px] leading-[1.5] text-[var(--ink-2)]">
        {next ? `Due ${next.due.replace(/ \d{4}$/, "")}. ${feature.text}` : feature.text}
      </p>
      {feature.kind === "link" || feature.kind === "payment-dates" ? (
        <Link href={feature.href} onClick={onNavigate} className="btn btn-primary mt-1 self-start">
          {feature.cta} <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <FeatureForm feature={feature} onNavigate={onNavigate} />
      )}
    </div>
  );
}

/** Desktop: the panel for one section, under the header bar. */
export function HubPanel({ hubId, onNavigate }: { hubId: HubId; onNavigate: () => void }) {
  const hub = HUBS.find((h) => h.id === hubId)!;
  const color = hubColor(hub.id);
  return (
    <div
      id="hub-panel"
      role="region"
      aria-label={`${hub.label} menu`}
      className="hidden xl:flex flex-col max-h-[calc(100dvh-var(--header-h)-24px)] max-w-[1320px] mx-auto mt-2.5 overflow-hidden rounded-[var(--r-l)] border border-[var(--rule)] bg-[var(--surface)] shadow-[0_30px_60px_-24px_rgba(2,20,60,0.45)]"
    >
      <div className="flex items-center gap-3.5 border-b border-[var(--rule)] px-7 py-4">
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
        <p className="ui text-[18px] font-[620]" style={{ color }}>
          {hub.label}
        </p>
        <p className="text-[15px] text-[var(--ink-2)]">{hub.intro}</p>
        <Link href={hub.href} onClick={onNavigate} className="ui ml-auto whitespace-nowrap text-[15px] font-[600]">
          All of {hub.label} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-[300px_repeat(3,minmax(0,1fr))] gap-8 px-7 py-6">
          <Feature hub={hub} onNavigate={onNavigate} />
          {hub.groups.map((group) => (
            <div key={group.heading} className="min-w-0">
              <p className="kicker mb-2 text-[var(--muted)]">{group.heading}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href} className="border-b border-[var(--rule)] last:border-b-0">
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="ui flex items-center justify-between gap-3 py-2.5 text-[15.5px] font-[520] text-[var(--ink)] no-underline hover:text-[var(--action-text)]"
                    >
                      <span>{item.label}</span>
                      {item.tag && (
                        <span
                          className="shrink-0 rounded-[var(--r-pill)] px-2 py-0.5 text-[12.5px] font-[600]"
                          style={{ color, background: `color-mix(in srgb, ${color} 10%, var(--surface))` }}
                        >
                          {item.tag}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--rule)] bg-[var(--surface-2)] px-7 py-3.5">
        <p className="ui text-[14.5px] font-[600] text-[var(--ink-2)]">Most searched:</p>
        {hub.top.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="ui rounded-[var(--r-pill)] border border-[var(--rule)] bg-[var(--surface)] px-3 py-1.5 text-[14.5px] font-[520] text-[var(--ink)] no-underline hover:border-[var(--brand)]"
          >
            {item.label}
          </Link>
        ))}
        <Link href="/browse" onClick={onNavigate} className="ui ml-auto text-[14.5px] font-[600] text-[var(--ink-2)]">
          Every page on the site <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/** Phone and tablet: a full height sheet with the sections as an accordion. */
export function MobileMenu({
  pathname,
  onNavigate,
  onClose,
}: {
  pathname: string;
  onNavigate: () => void;
  onClose: () => void;
}) {
  // Opens on the section you are already in, so the way onward is right there.
  const [open, setOpen] = useState<HubId | null>(() => hubForPath(pathname));

  /*
   * Lock scroll on both roots, not just body. iOS WebKit is where body only
   * scroll locks have historically failed; setting it on <html> as well holds
   * everywhere.
   */
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevRoot = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevRoot;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Focus moves into the sheet on open and back to the burger on close. */
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => returnTo?.focus?.();
  }, []);

  function openSearch() {
    onClose();
    window.dispatchEvent(new CustomEvent("open-command"));
  }

  return (
    /*
     * The sheet owns the whole screen, above the header, and carries its own
     * close button, so no behaviour of the page header under a scroll lock
     * can leave it without a way out. z-[60]: over the header (50), under the
     * search palette (80).
     */
    <nav
      id="mobile-nav"
      aria-label="Main"
      className="xl:hidden fixed inset-0 z-[60] flex flex-col bg-[var(--paper)]"
    >
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between bg-[var(--deep)] px-4 sm:px-8">
        <Link href="/" onClick={onNavigate} aria-label="Scotland Counted home">
          <BrandLogo tone="on-dark" height={26} />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close the menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--r-pill)] border border-white/25 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-[640px] space-y-3.5">
          <button
            type="button"
            onClick={openSearch}
            className="ui flex min-h-[52px] w-full items-center gap-3 rounded-[var(--r-m)] border border-[var(--rule-strong)] bg-[var(--surface)] px-4 text-left text-[16px] text-[var(--muted)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            Search, or put in your postcode
          </button>

          <div className="overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
            {HUBS.map((hub) => {
              const isOpen = open === hub.id;
              const color = hubColor(hub.id);
              const count = hub.groups.reduce((n, g) => n + g.items.length, 0);
              const panelId = `mobile-hub-${hub.id}`;
              return (
                <div key={hub.id} className="border-b border-[var(--rule)]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : hub.id)}
                    className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-[var(--ink)]"
                    style={isOpen ? { background: `color-mix(in srgb, ${color} 8%, var(--surface))` } : undefined}
                  >
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
                    <span className="ui flex-1 text-[17px] font-[600]">{hub.label}</span>
                    <span className="ui text-[14px] text-[var(--muted)]">{count} pages</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m5 8 7 7 7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      className="px-4 pt-1 pb-4 pl-[38px]"
                      style={{ background: `color-mix(in srgb, ${color} 5%, var(--surface))` }}
                    >
                      {hub.groups.map((group) => (
                        <div key={group.heading}>
                          <p className="kicker mt-3.5 mb-1" style={{ color }}>
                            {group.heading}
                          </p>
                          <ul>
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={onNavigate}
                                  className="ui block border-b border-[var(--rule)] py-2.5 text-[16px] font-[500] text-[var(--ink)] no-underline"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link href={hub.href} onClick={onNavigate} className="ui mt-3 inline-block text-[15.5px] font-[600]">
                        All of {hub.label} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href={EXPLAINERS.href}
              onClick={onNavigate}
              className="ui flex min-h-14 items-center gap-3 px-4 text-[17px] font-[600] text-[var(--ink)] no-underline"
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--ink)]" />
              Explainers and investigations
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 px-1 pt-1">
            {[ABOUT[0], EVIDENCE[1], ABOUT[1]].map((item) => (
              <Link key={item.href} href={item.href} onClick={onNavigate} className="ui text-[15px] text-[var(--ink-2)]">
                {item.label}
              </Link>
            ))}
            <Link href="/browse" onClick={onNavigate} className="ui text-[15px] font-[600]">
              Every page
            </Link>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[var(--rule)] bg-[var(--surface)] px-4 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] sm:px-8">
        <Link href="/email-your-mp-and-msp" onClick={onNavigate} className="btn btn-primary mx-auto flex w-full max-w-[640px] justify-center">
          Email your MP or MSP <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
