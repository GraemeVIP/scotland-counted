"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  POSTCODE_SESSION_KEY,
  localAreaLinks,
  representativePagePath,
  type Representative,
  type RepresentativeLookup,
} from "@/lib/representatives";
import type { LocalFacts, ResponsibilitySplit } from "@/lib/localFacts";

/**
 * The homepage postcode box, and what it does with the answer.
 *
 * It used to take the postcode and go straight to the email composer, under a
 * hero promising figures for your area, what your council spends, what you
 * keep from your pay and who decides each of it. The reader was told about
 * four things and shown the fifth. Nothing was broken in a way any test could
 * see: the code was right and the sentence above it was not.
 *
 * The postcode now resolves in place and the local result comes first.
 * Writing to a representative is the last thing offered rather than the only
 * thing delivered, and nothing navigates on the reader's behalf.
 *
 * The postcode goes into a POST body and into component state. It never
 * enters the URL and never enters storage, unless the reader chooses the
 * email step, which needs it to build the letter.
 */
export default function PostcodeStart({
  facts,
  split,
}: {
  facts: Record<string, LocalFacts>;
  split: ResponsibilitySplit;
}) {
  const router = useRouter();
  const inputId = useId();
  const [postcode, setPostcode] = useState("");
  const [lookup, setLookup] = useState<RepresentativeLookup | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  /*
   * Where the answer goes: a slot the homepage puts just below the hero. In
   * the card it stretched the blue hero to twice its height on a desktop,
   * with the headline left floating in the middle. Below the hero it gets
   * the full page width, so it lays out in columns and the hero keeps its
   * shape. Without the slot it falls back to rendering in place. A result
   * only exists after a lookup in the browser, so the server never looks.
   */

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) return;

    setState("loading");
    setError("");
    setLookup(null);

    try {
      const response = await fetch("/api/representatives", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: value }),
      });
      const result = (await response.json()) as RepresentativeLookup | { error?: string };
      if (!response.ok || !("mp" in result)) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "That lookup did not work. Please try again shortly.",
        );
      }
      setLookup(result);
      setState("idle");
    } catch (reason) {
      setState("error");
      setError(reason instanceof Error ? reason.message : "The lookup is unavailable just now.");
    }
  }

  /* Opt-in, and the only thing here that stores the postcode. */
  function openLetterBuilder() {
    if (!lookup) return;
    sessionStorage.setItem(POSTCODE_SESSION_KEY, lookup.postcode);
    router.push("/email-your-mp-and-msp#letter-builder");
  }

  /*
   * Move to the answer once it has actually rendered.
   *
   * This was a requestAnimationFrame inside the submit handler, which focused
   * a node React had not committed yet under load, and the keyboard test
   * failed in WebKit roughly one run in three. An effect keyed on the result
   * runs after commit, which is when there is something to focus.
   */
  useEffect(() => {
    if (!lookup) return;
    const node = resultRef.current;
    node?.focus({ preventScroll: true });
    node?.scrollIntoView({ block: "start", behavior: "smooth" });
    // Some phones drop a smooth scroll that starts while the page is still
    // settling. If the answer is still well down the screen, jump to it.
    const timer = window.setTimeout(() => {
      if (node && node.getBoundingClientRect().top > 300) node.scrollIntoView({ block: "start", behavior: "instant" });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [lookup]);

  const local = lookup ? facts[lookup.council.slug] : undefined;
  const slot = lookup ? document.getElementById(RESULT_SLOT_ID) : null;

  const panel = lookup && (
    <section
      ref={resultRef}
      id={RESULT_ID}
      tabIndex={-1}
      data-testid="local-result"
      aria-labelledby="local-council-name"
      className="scroll-mt-24 text-left outline-none"
    >
      <div className={slot ? "mx-auto max-w-[1232px] px-5 pt-10 sm:px-8 sm:pt-14 lg:px-14" : "mt-7"}>
        <div className="tile p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-[var(--rule)] pb-6">
            <div className="min-w-0">
              <p className="kicker text-[var(--brand)]">Your area</p>
              <h2
                id="local-council-name"
                className="display-stat mt-2 text-[clamp(30px,4vw,48px)] leading-[1.05]"
                data-testid="local-council"
              >
                {lookup.council.name}
              </h2>
            </div>
            <Link href={`/areas/${lookup.council.slug}`} className="btn btn-ghost">
              Everything on {lookup.council.name} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-7 grid gap-x-8 gap-y-9 lg:grid-cols-3">
            {/* The figures the hero promises, in the order it promises them. */}
            <div className="min-w-0">
              <h3 className="ui mb-3 text-[16px] font-[650] text-[var(--ink)]">Your area in figures</h3>
              {local && (
                <div className="grid gap-3">
                  <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4">
                    <p className="display-stat text-[32px] leading-none tnum">{local.childPovertyPct}%</p>
                    <p className="mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                      of children here are in poverty after housing costs, which is{" "}
                      {local.childPovertyCount.toLocaleString("en-GB")} children. Across Scotland it is{" "}
                      {local.scotlandPct}%.
                    </p>
                    <p className="ui mt-2 text-[13.5px] text-[var(--muted)]">End Child Poverty, {local.childPovertyYear}</p>
                  </div>

                  {local.budgetGapM !== undefined && (
                    <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4">
                      <p className="display-stat text-[32px] leading-none tnum">
                        £{Math.abs(local.budgetGapM).toLocaleString("en-GB")}m
                      </p>
                      <p className="mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                        {local.budgetGapM > 0
                          ? "is what your council said it was short for 2026/27, before it set its budget."
                          : "is what your council said it had left over for 2026/27. It was the only one in Scotland."}
                      </p>
                      <p className="ui mt-2 text-[13.5px] text-[var(--muted)]">Audit Scotland, June 2026</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="ui mb-3 text-[16px] font-[650] text-[var(--ink)]">Who represents you</h3>
              <ul className="grid gap-2" data-testid="local-representatives">
                <RepLine label="Your MP at Westminster" representative={lookup.mp} area={lookup.mp.constituency} />
                {lookup.constituencyMsp ? (
                  <RepLine
                    label="Your constituency MSP at Holyrood"
                    representative={lookup.constituencyMsp}
                    area={lookup.holyrood.constituency ?? lookup.constituencyMsp.constituency}
                  />
                ) : (
                  <li className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-3.5 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
                    {lookup.mspUnavailable ?? "Your MSP details could not be read just now."}
                  </li>
                )}
              </ul>

              {lookup.regionalMsps.length > 0 && (
                <details className="mt-3 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)]">
                  <summary className="ui cursor-pointer px-4 py-3 text-[15px] font-[580] text-[var(--ink)]">
                    You also have {lookup.regionalMsps.length} regional MSPs
                    {lookup.holyrood.region ? ` for ${lookup.holyrood.region}` : ""}
                  </summary>
                  <ul className="grid gap-1.5 border-t border-[var(--rule)] px-4 py-3">
                    {lookup.regionalMsps.map((msp) => (
                      <li key={`${msp.name}-${msp.party}`} className="text-[15px] leading-[1.45]">
                        <Link href={representativePagePath(msp)}>{msp.name}</Link>
                        <span className="text-[var(--ink-2)]"> · {msp.party}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <p className="mt-4 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                Of the {split.total} things people most often want changed, {split.uk} are decided at Westminster,{" "}
                {split.scotland} at Holyrood and {split.council} by your council.{" "}
                <Link href="/who-decides">See which is which</Link>.
              </p>
            </div>

            <div className="min-w-0">
              <h3 className="ui mb-3 text-[16px] font-[650] text-[var(--ink)]">The rest of your area</h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  ...localAreaLinks(lookup),
                  {
                    href: `/compare-areas?a=${lookup.council.slug}`,
                    label: `Compare ${lookup.council.name} with anywhere`,
                    blurb: "Pay, homes, crime, health and schools, side by side with any other area.",
                  },
                  {
                    href: "/take-home-pay-calculator-scotland",
                    label: "What you keep from your pay",
                    blurb: "Scottish tax rates, worked out in your browser.",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-3.5 no-underline transition-colors hover:border-[var(--brand)]"
                    >
                      <span className="ui block text-[15.5px] font-[600] leading-[1.35] text-[var(--ink)]">
                        {link.label}
                        <span aria-hidden="true" className="text-[var(--brand)]"> →</span>
                      </span>
                      <span className="mt-1 block text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{link.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Only now, and only if they want it. */}
          <div className="mt-8 rounded-[var(--r-s)] border border-[var(--action)] bg-[var(--action-tint)] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5">
            <p className="text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
              <strong className="text-[var(--ink)]">Want something changed?</strong> I can put your area&rsquo;s figures
              into an email to the right person. You read it before anything is sent.
            </p>
            <button
              type="button"
              onClick={openLetterBuilder}
              data-testid="write-email"
              className="btn btn-primary mt-3 w-full shrink-0 justify-center sm:mt-0 sm:w-auto"
            >
              Write the emails
            </button>
          </div>

          <p className="ui mt-4 text-[13.5px] leading-[1.5] text-[var(--muted)]">
            Representatives from {lookup.holyrood.source.name}
            {lookup.holyrood.source.checkedAt
              ? `, checked ${new Date(lookup.holyrood.source.checkedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
              : ""}
            . Your postcode was not saved.
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="w-full max-w-[620px]">
      <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-[minmax(0,260px)_auto]">
        <label className="sr-only" htmlFor={inputId}>
          Your Scottish postcode
        </label>
        {/*
          No name attribute, on purpose. If the form is sent before the page's
          script has loaded, the browser submits it the old way and would put
          a named field in the address bar (/?postcode=G12+8QQ), where it ends
          up in browser history and analytics. Unnamed, nothing is sent.
        */}
        <input
          id={inputId}
          type="text"
          value={postcode}
          onChange={(event) => {
            setPostcode(event.target.value.toUpperCase());
            if (lookup) setLookup(null);
            if (state === "error") setState("idle");
          }}
          placeholder="Your postcode, e.g. G12 8QQ"
          data-clarity-mask="true"
          autoComplete="postal-code"
          inputMode="text"
          required
          className="ui w-full rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 py-3.5 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors"
        />
        {/*
          "Check my area", not "Find my MP and MSP". The button now names what
          pressing it produces. Readers who want the email tool directly have
          the header CTA, which still says exactly that.
        */}
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn btn-primary justify-center whitespace-nowrap disabled:cursor-wait disabled:opacity-70"
        >
          {state === "loading" ? "Looking it up…" : "Check my area"}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="mt-3 text-[15px] text-[var(--ink-2)] leading-[1.5]">
        Your local figures first. Nothing is sent to anybody unless you ask for it, and I do not
        save your postcode.
      </p>

      <div aria-live="polite">
        {state === "error" && (
          <p role="alert" className="ui mt-4 text-[16px] font-[540] text-[var(--bad-text)]">
            {error}
          </p>
        )}

        {lookup && slot && (
          <p className="ui mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[var(--r-s)] bg-[var(--surface-2)] px-4 py-3 text-[15.5px] text-[var(--ink)]">
            <span aria-hidden="true" className="text-[var(--good-text)]">✓</span>
            <span>
              <strong className="font-[650]">{lookup.council.name}</strong>. Your area is below.
            </span>
            <a href={`#${RESULT_ID}`} className="font-[600]">
              See it <span aria-hidden="true">↓</span>
            </a>
          </p>
        )}
        {lookup && !slot && panel}
      </div>
      {lookup && slot && createPortal(panel, slot)}
    </div>
  );
}

/** The slot the homepage renders just below the hero, and the result's own id. */
export const RESULT_SLOT_ID = "local-result-slot";
const RESULT_ID = "local-result";

function RepLine({
  label,
  representative,
  area,
}: {
  label: string;
  representative: Representative;
  area: string | null;
}) {
  return (
    <li className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-3.5">
      <p className="ui text-[13.5px] font-[580] text-[var(--brand)]">{label}</p>
      <p className="mt-1 text-[16px] leading-[1.4]">
        <Link href={representativePagePath(representative)} className="font-[600]">
          {representative.name}
        </Link>
        <span className="text-[var(--ink-2)]"> · {representative.party}</span>
      </p>
      {area && <p className="text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{area}</p>}
    </li>
  );
}
