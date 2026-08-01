"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { POSTCODE_SESSION_KEY } from "@/lib/representatives";
import { SECTIONS, QUICK_AREAS, INVENTORY, MENU_FOOTER_LINKS } from "@/lib/data/navigation";

/**
 * The full menu, shared by the desktop panel and the mobile sheet.
 *
 * The site has 316 pages and the menu used to expose about twenty of them, so
 * the 32 council areas and 57 MP areas — the bulk of what anyone actually
 * wants — could only be reached by landing on a hub page first. The postcode
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
    router.push("/take-action#letter-builder");
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
      {SECTIONS.map((sec) => (
        <div key={sec.title}>
          <p className="kicker text-[var(--muted)] mb-3">{sec.title}</p>
          <ul className="space-y-1">
            {sec.items.map((n) => (
              <li key={n.href}>
                {/*
                  A featured item is lit by its tint and its dot, never by
                  colouring the label. --action on paper is about 3:1 and these
                  labels are 15.5px, which needs 4.5:1 — so the text stays
                  --ink and the colour lives in the parts that carry no
                  meaning. The dot is aria-hidden for the same reason: a screen
                  reader gets the link, not the decoration.
                */}
                <Link
                  href={n.href}
                  onClick={onNavigate}
                  className={`group -mx-2 flex min-h-11 flex-col justify-center rounded-[var(--r-s)] px-2 py-1.5 no-underline transition-colors ${
                    n.featured
                      ? "bg-[var(--action-tint)] hover:bg-[var(--surface-2)]"
                      : "hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span
                    className={`ui text-[15.5px] text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors ${
                      n.featured ? "font-[750]" : "font-[650]"
                    }`}
                  >
                    {n.featured && (
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-[var(--action)] align-middle"
                      />
                    )}
                    {n.label}
                  </span>
                  {n.blurb && (
                    <span className="text-[13.5px] leading-[1.35] text-[var(--muted)] mt-0.5">
                      {n.blurb}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

/** The shared top block: postcode first, then the places people ask for. */
function FindYourPlace({ onNavigate, autoFocus }: { onNavigate: () => void; autoFocus?: boolean }) {
  return (
    <div className="rounded-[var(--r-m)] bg-[var(--surface-2)] border border-[var(--rule)] p-4 sm:p-5">
      <p className="ui text-[16px] font-[750] text-[var(--ink)]">Go straight to your area</p>
      <p className="text-[14.5px] leading-[1.45] text-[var(--ink-2)] mt-1 mb-3.5">
        You do not need to know your council or your MP. I work it out.
      </p>
      <PostcodeJump onDone={onNavigate} autoFocus={autoFocus} />
      <p className="kicker text-[var(--muted)] mt-4 mb-2.5">Or pick a place</p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_AREAS.slice(0, 6).map((a) => (
          <Link
            key={a.href}
            href={a.href}
            onClick={onNavigate}
            className="ui rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[14px] font-[620] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--brand)] hover:text-[var(--ink)]"
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
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
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
          <span className="text-[13.5px] text-[var(--ink-2)]">{i.label}</span>
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
      className="hidden lg:block border-t border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-3)]"
    >
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14 py-9 grid gap-8 xl:gap-12 lg:grid-cols-[minmax(250px,0.9fr)_minmax(0,2.1fr)]">
        <FindYourPlace onNavigate={onNavigate} />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
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
export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  // The sheet owns the screen while it is open, so the page behind must not scroll.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <nav
      id="mobile-nav"
      aria-label="Main"
      className="lg:hidden fixed inset-x-0 top-[72px] sm:top-[68px] bottom-0 z-40 overflow-y-auto overscroll-contain border-t border-[var(--rule)] bg-[var(--paper)]"
    >
      <div className="px-5 py-5 space-y-7">
        <FindYourPlace onNavigate={onNavigate} />

        <div className="space-y-7">
          <SectionList onNavigate={onNavigate} />
        </div>

        <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
          <p className="kicker text-[var(--muted)] mb-4">What is in here</p>
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
            See every page on this site →
          </Link>
        </div>
      </div>

      {/* The action stays reachable no matter how far down the sheet you are. */}
      <div className="sticky bottom-0 border-t border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur px-5 py-4">
        <Link
          href="/take-action"
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
