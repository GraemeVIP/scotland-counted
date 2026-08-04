"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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
  const resultRef = useRef<HTMLDivElement>(null);

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
    router.push("/find-my-mp-and-msp#letter-builder");
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
    resultRef.current?.focus();
    resultRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [lookup]);

  const local = lookup ? facts[lookup.council.slug] : undefined;

  return (
    <div className="w-full max-w-[620px]">
      <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-[minmax(0,260px)_auto]">
        <label className="sr-only" htmlFor={inputId}>
          Your Scottish postcode
        </label>
        <input
          id={inputId}
          name="postcode"
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
          <p role="alert" className="ui mt-4 text-[16px] font-[650] text-[var(--bad-text)]">
            {error}
          </p>
        )}

        {lookup && (
          <div
            ref={resultRef}
            tabIndex={-1}
            data-testid="local-result"
            className="mt-7 scroll-mt-24 rounded-[var(--r-m)] border-2 border-[var(--ink)] bg-[var(--surface)] p-5 text-left sm:p-6"
          >
            <p className="kicker mb-2 text-[var(--brand)]">Your area</p>
            <h2 className="h3" data-testid="local-council">
              {lookup.council.name}
            </h2>

            {/* The figures the hero promises, in the order it promises them. */}
            {local && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4">
                  <p className="display-stat text-[30px] leading-none tnum">
                    {local.childPovertyPct}%
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                    of children here are in poverty after housing costs, which is{" "}
                    {local.childPovertyCount.toLocaleString("en-GB")} children. Across Scotland it
                    is {local.scotlandPct}%.
                  </p>
                  <p className="ui mt-2 text-[13.5px] text-[var(--muted)]">
                    End Child Poverty, {local.childPovertyYear}
                  </p>
                </div>

                {local.budgetGapM !== undefined && (
                  <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4">
                    <p className="display-stat text-[30px] leading-none tnum">
                      £{Math.abs(local.budgetGapM).toLocaleString("en-GB")}m
                    </p>
                    <p className="mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                      {local.budgetGapM > 0
                        ? "is what your council said it was short for 2026/27, before it set its budget."
                        : "is what your council said it had left over for 2026/27. It was the only one in Scotland."}
                    </p>
                    <p className="ui mt-2 text-[13.5px] text-[var(--muted)]">
                      Audit Scotland, June 2026
                    </p>
                  </div>
                )}
              </div>
            )}

            <h3 className="ui mt-6 mb-2 text-[15px] font-[750] text-[var(--ink)]">
              Who represents you
            </h3>
            <ul className="grid gap-2" data-testid="local-representatives">
              <RepLine
                label="Your MP at Westminster"
                representative={lookup.mp}
                area={lookup.mp.constituency}
              />
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
                <summary className="ui cursor-pointer px-4 py-3 text-[15px] font-[700] text-[var(--ink)]">
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

            <p className="mt-5 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              Of the {split.total} things people most often want changed, {split.uk} are decided at
              Westminster, {split.scotland} at Holyrood and {split.council} by your council.{" "}
              <Link href="/who-decides">See which is which</Link>.
            </p>

            <h3 className="ui mt-6 mb-2 text-[15px] font-[750] text-[var(--ink)]">
              The rest of your area
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {localAreaLinks(lookup).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-3.5 no-underline transition-colors hover:border-[var(--brand)]"
                  >
                    <span className="ui block text-[15.5px] font-[720] leading-[1.35] text-[var(--ink)]">
                      {link.label}
                      <span aria-hidden="true" className="text-[var(--brand)]"> →</span>
                    </span>
                    <span className="mt-1 block text-[14.5px] leading-[1.4] text-[var(--ink-2)]">
                      {link.blurb}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/take-home-pay-calculator-scotland"
                  className="block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-3.5 no-underline transition-colors hover:border-[var(--brand)]"
                >
                  <span className="ui block text-[15.5px] font-[720] leading-[1.35] text-[var(--ink)]">
                    What you keep from your pay
                    <span aria-hidden="true" className="text-[var(--brand)]"> →</span>
                  </span>
                  <span className="mt-1 block text-[14.5px] leading-[1.4] text-[var(--ink-2)]">
                    Scottish tax rates, worked out in your browser.
                  </span>
                </Link>
              </li>
            </ul>

            {/* Only now, and only if they want it. */}
            <div className="mt-6 rounded-[var(--r-s)] border border-[var(--action)] bg-[var(--action-tint)] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <p className="text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
                <strong className="text-[var(--ink)]">Want something changed?</strong> I can put
                your area&rsquo;s figures into an email to the right person. You read it before
                anything is sent.
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
        )}
      </div>
    </div>
  );
}

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
      <p className="ui text-[13.5px] font-[700] text-[var(--brand)]">{label}</p>
      <p className="mt-1 text-[16px] leading-[1.4]">
        <Link href={representativePagePath(representative)} className="font-[720]">
          {representative.name}
        </Link>
        <span className="text-[var(--ink-2)]"> · {representative.party}</span>
      </p>
      {area && <p className="text-[14.5px] leading-[1.4] text-[var(--ink-2)]">{area}</p>}
    </li>
  );
}
