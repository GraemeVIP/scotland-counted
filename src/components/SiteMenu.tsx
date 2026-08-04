"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";
import { SECTIONS, QUICK_AREAS, INVENTORY, MENU_FOOTER_LINKS } from "@/lib/data/navigation";

const SECTION_TONES = {
  local: {
    accent: "var(--brand)",
    wash: "var(--brand-wash)",
  },
  tools: {
    accent: "var(--warn)",
    wash: "color-mix(in srgb, var(--warn) 10%, var(--surface))",
  },
  councils: {
    accent: "var(--brand-deep)",
    wash: "color-mix(in srgb, var(--brand-deep) 10%, var(--surface))",
  },
  change: {
    accent: "var(--action)",
    wash: "var(--action-tint)",
  },
  topics: {
    accent: "var(--glasgow)",
    wash: "var(--glasgow-wash)",
  },
  proof: {
    accent: "var(--good)",
    wash: "color-mix(in srgb, var(--good) 10%, var(--surface))",
  },
} as const;

/**
 * The full menu, shared by the desktop panel and the mobile sheet.
 *
 * The site has 316 pages and the menu used to expose about twenty of them, so
 * the 32 council areas and 57 MP areas, the bulk of what anyone actually
 * wants, could only be reached by landing on a hub page first. The postcode
 * field is therefore in the menu itself: for most people it is the shortest
 * path to the page they came for, and it works without them knowing the name
 * of their council or their MP.
 */

function PostcodeJump({ onDone, autoFocus = false }: { onDone: () => void; autoFocus?: boolean }) {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;
    sessionStorage.setItem(POSTCODE_SESSION_KEY, value);
    onDone();
    router.push("/find-my-mp-and-msp#letter-builder");
  }

  return (
    <form onSubmit={submit} className="grid gap-2 grid-cols-[minmax(0,1fr)_auto]">
      <label className="sr-only" htmlFor="menu-postcode">
        Your postcode
      </label>
      <input
        ref={ref}
        id="menu-postcode"
        name="postcode"
        type="text"
        value={postcode}
        onChange={(event) => setPostcode(event.target.value.toUpperCase())}
        placeholder="Your postcode"
        data-clarity-mask="true"
        autoComplete="postal-code"
        className="ui w-full min-h-12 rounded-[var(--r-s)] bg-[var(--paper)] border border-[var(--rule-strong)] px-4 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors"
      />
      <button type="submit" className="btn btn-primary justify-center whitespace-nowrap !px-5">
        Go
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

function SectionList({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      {SECTIONS.map((sec) => {
        const tone = SECTION_TONES[sec.tone];

        return (
          <section
            key={sec.title}
            className="overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]"
          >
            <div
              className="border-b border-[var(--rule)] px-4 py-3.5 xl:min-h-[96px]"
              style={{ backgroundColor: tone.wash }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tone.accent }}
                />
                <div>
                  <p className="ui text-[17px] font-[800] leading-[1.25] text-[var(--ink)]">
                    {sec.title}
                  </p>
                  <p className="mt-1 text-[15px] leading-[1.4] text-[var(--ink-2)]">
                    {sec.intro}
                  </p>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-[var(--rule)] px-2 py-1">
              {sec.items.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={onNavigate}
                    className="flex min-h-14 flex-col justify-center rounded-[var(--r-s)] px-2 py-2.5 no-underline transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="ui text-[15.5px] font-[650] text-[var(--ink)]">
                      {n.label}
                    </span>
                    {n.blurb && (
                      <span className="mt-0.5 text-[15px] leading-[1.35] text-[var(--muted)]">
                        {n.blurb}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

/** The shared top block: postcode first, then the places people ask for. */
function FindYourPlace({ onNavigate, autoFocus }: { onNavigate: () => void; autoFocus?: boolean }) {
  return (
    <div className="rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-4 sm:p-5">
      <p className="ui text-[18px] font-[800] text-[var(--ink)]">Go straight to your area</p>
      <p className="mt-1 mb-3.5 text-[15px] leading-[1.45] text-[var(--ink-2)]">
        You do not need to know your council or your MP. I work it out.
      </p>
      <PostcodeJump onDone={onNavigate} autoFocus={autoFocus} />
      <p className="ui mt-4 mb-2.5 text-[15px] font-[760] uppercase tracking-[0.08em] text-[var(--muted)]">
        Or pick a place
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_AREAS.slice(0, 6).map((a) => (
          <Link
            key={a.href}
            href={a.href}
            onClick={onNavigate}
            className="ui rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[15px] font-[620] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--brand)] hover:text-[var(--ink)]"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** The counts, which double as links to each index. */
function Inventory({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-8">
      {INVENTORY.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          onClick={onNavigate}
          className="group no-underline"
        >
          <span className="display-stat block text-[24px] leading-[1.1] text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors">
            {i.count}
          </span>
          <span className="text-[15px] text-[var(--ink-2)]">{i.label}</span>
        </Link>
      ))}
    </div>
  );
}

/** Desktop: a full-width panel under the header. */
export function DesktopMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="browse-panel"
      className="hidden xl:block border-t border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-3)]"
    >
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-9 sm:px-8 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,3.2fr)] lg:px-14 xl:gap-10">
        <FindYourPlace onNavigate={onNavigate} />
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          <SectionList onNavigate={onNavigate} />
        </div>
      </div>
      <div className="border-t border-[var(--rule)] bg-[var(--surface-2)]">
        <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14 py-5 flex flex-wrap items-center justify-between gap-6">
          <Inventory onNavigate={onNavigate} />
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {MENU_FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNavigate}
                className="ui text-[15px] font-[620] text-[var(--ink-2)]"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/browse" onClick={onNavigate} className="ui text-[15.5px] font-[700]">
              See every page on this site →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile: a full-height sheet, not a dropdown list. */
export function MobileMenu({
  onNavigate,
  onClose,
}: {
  onNavigate: () => void;
  onClose: () => void;
}) {
  /*
   * Lock scroll on both roots, not just body. Per spec, overflow on <body>
   * propagates to the viewport, and Chromium honours that. iOS WebKit is
   * exactly where that propagation has historically misbehaved, locking
   * body alone is the classic scroll-lock that fails on iPhones. Setting it
   * on <html> as well is the form that holds everywhere.
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

  // Escape closes, matching the desktop panel.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /*
   * Move focus into the sheet, and put it back when the sheet goes.
   *
   * Without this the sheet covers the whole screen while focus stays on the
   * burger underneath it. Someone using a keyboard or a screen reader opens
   * the menu and is told nothing has happened, then has to tab forward
   * blindly to reach a menu that is already in front of them. On the way out
   * focus would land back at the top of the document rather than where they
   * were, which is the other half of the same problem.
   *
   * The close button is the target because it is the first thing in the
   * sheet and the way out of it.
   */
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => returnTo?.focus?.();
  }, []);

  return (
    /*
     * The sheet owns the whole screen, inset-0, above the header, and
     * carries its own close button.
     *
     * It used to start below the page header and rely on that header for the
     * X. That chain held only if the header stayed pinned and tappable while
     * the page behind was scroll-locked: position: sticky is exactly what iOS
     * does not guarantee under a locked body, and on iPads the header left
     * the viewport with the sheet open, a menu with no way to close it. The
     * close control now lives inside the thing it closes, and no behaviour of
     * the page header can take it away.
     *
     * z-[60]: over the header (50); under the search palette (80).
     */
    <nav
      id="mobile-nav"
      aria-label="Main"
      className="xl:hidden fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[var(--paper)]"
    >
      {/*
        The sheet's own top bar, sticky so the X survives scrolling the menu
        itself. Metrics mirror the page header underneath, same height, same
        gutters, so the X lands exactly where the burger was tapped.
      */}
      <div className="sticky top-0 z-10 border-b border-[var(--rule)] bg-[var(--paper)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-[72px] sm:h-[68px] flex items-center justify-between">
          {/* Inline rather than Chrome's Wordmark: importing it back out of
              Chrome.tsx would make the two files import each other. */}
          <span
            className="ui font-[800] tracking-[-0.04em] leading-none text-[17px] min-[390px]:text-[19px]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Scotland<span className="text-[var(--action)]">Counted</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close the menu"
            className="w-11 h-11 -mr-2 inline-flex items-center justify-center text-[var(--ink)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="space-y-5 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <FindYourPlace onNavigate={onNavigate} />

        <div className="space-y-4">
          <SectionList onNavigate={onNavigate} />
        </div>

        <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
          <p className="ui text-[18px] font-[800] text-[var(--ink)]">What Scotland Counted does</p>
          <p className="mt-2 mb-5 max-w-[42rem] text-[15px] leading-6 text-[var(--ink-2)]">
            See what poverty, pay and living costs look like where you live. Find the people who
            can change things, then send them a ready-written email.
          </p>
          <Inventory onNavigate={onNavigate} />
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            {MENU_FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNavigate}
                className="ui text-[15px] font-[620] text-[var(--ink-2)]"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/browse"
            onClick={onNavigate}
            className="ui mt-4 block text-[15.5px] font-[700]"
          >
            Browse every page →
          </Link>
        </div>
      </div>

      {/* The action stays reachable no matter how far down the sheet you are. */}
      <div className="sticky bottom-0 border-t border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur px-5 py-4">
        <Link
          href="/find-my-mp-and-msp"
          onClick={onNavigate}
          className="btn btn-primary w-full justify-center"
        >
          Email your MP and MSP
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}
