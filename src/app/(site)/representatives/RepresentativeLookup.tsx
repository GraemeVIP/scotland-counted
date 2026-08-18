"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import PortraitLightbox from "@/components/PortraitLightbox";
import {
  POSTCODE_SESSION_KEY,
  localAreaLinks,
  representativePagePath,
  type Representative,
  type RepresentativeLookup as LookupResult,
} from "@/lib/representatives";

function normalisePostcode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

function isDialablePhone(phone: string) {
  return /^\+?[\d\s()\-]+$/.test(phone);
}

function ContactCard({
  representative,
  label,
}: {
  representative: Representative;
  label: string;
}) {
  return (
    <article className="rounded-[var(--r-m)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {representative.photoUrl && (
          <PortraitLightbox
            src={representative.photoUrl}
            alt={`${representative.name}, ${representative.role}`}
            sizes="64px"
            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
          />
        )}
        <div>
          <p className="kicker mb-2 text-[var(--brand)]">{label}</p>
          <h3 className="h3">{representative.name}</h3>
        </div>
      </div>
      <p className="ui mt-2 text-[15.5px] leading-[1.5] text-[var(--ink-2)]">
        {representative.party} · {representative.constituency}
      </p>

      <dl className="mt-5 grid gap-4">
        <div>
          <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Email</dt>
          <dd className="mt-1 break-words text-[16px] leading-[1.5]">
            <a href={`mailto:${representative.email}`}>{representative.email}</a>
          </dd>
        </div>
        {representative.phone && (
          <div>
            <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Phone</dt>
            <dd className="mt-1 text-[16px] leading-[1.5]">
              {isDialablePhone(representative.phone) ? (
                <a href={`tel:${representative.phone.replace(/[^+\d]/g, "")}`}>
                  {representative.phone}
                </a>
              ) : (
                representative.phone
              )}
            </dd>
          </div>
        )}
        {representative.officeAddress && (
          <div>
            <dt className="ui text-[15px] font-[750] text-[var(--ink)]">Public office</dt>
            <dd className="mt-1 text-[16px] leading-[1.55] text-[var(--ink-2)]">
              {representative.officeAddress}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Link
          href={representativePagePath(representative)}
          className="btn btn-ghost justify-center text-center"
        >
          View full details
        </Link>
      </div>
    </article>
  );
}

export default function RepresentativeLookup() {
  const router = useRouter();
  const inputId = useId();
  const [postcode, setPostcode] = useState("");
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const lookUp = useCallback(async (raw: string) => {
    const value = raw.trim().toUpperCase();
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
      const result = (await response.json()) as LookupResult | { error?: string };
      if (!response.ok || !("mp" in result)) {
        throw new Error("error" in result && result.error ? result.error : "The lookup failed.");
      }

      setPostcode(result.postcode);
      setLookup(result);
      setState("success");
      trackEvent("representative_lookup_success", { council: result.council.slug });
    } catch (reason) {
      setState("error");
      setError(reason instanceof Error ? reason.message : "The lookup is unavailable just now.");
      trackEvent("representative_lookup_error");
    }
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const field = event.currentTarget.elements.namedItem("postcode") as HTMLInputElement | null;
    void lookUp(field?.value ?? postcode);
  }

  /*
   * A postcode carried from the menu or another page runs on arrival, the
   * same contract the letter builder has always honoured. Consumed once and
   * removed, so it cannot replay on a later visit.
   */
  useEffect(() => {
    const carried = sessionStorage.getItem(POSTCODE_SESSION_KEY);
    if (!carried) return;
    sessionStorage.removeItem(POSTCODE_SESSION_KEY);
    /*
     * A zero timeout, and both rejected alternatives are worth recording.
     * Calling lookUp directly trips the no-sync-setState rule, because its
     * first statement flips the loading state before any await. Scheduling
     * through requestAnimationFrame passes the rule but never fires in a
     * hidden tab, so a reader opening this in the background would have
     * their postcode consumed and see nothing at all. Timers are throttled
     * in hidden tabs, but they do fire. The result header names the
     * postcode, so the untouched input costs nothing.
     */
    const timer = setTimeout(() => void lookUp(carried), 0);
    return () => clearTimeout(timer);
  }, [lookUp]);

  function changePostcode(value: string) {
    setPostcode(value.toUpperCase());
    if (lookup && normalisePostcode(value) !== normalisePostcode(lookup.postcode)) {
      setLookup(null);
      setState("idle");
    }
  }

  function openLetterBuilder() {
    if (!lookup) return;
    sessionStorage.setItem(POSTCODE_SESSION_KEY, lookup.postcode);
    trackEvent("representative_letter_help_selected");
    router.push("/email-your-mp-and-msp#letter-builder");
  }

  return (
    <section
      id="postcode-lookup"
      aria-labelledby="postcode-lookup-title"
      className="mb-10 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-7"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-end">
        <div>
          <p className="kicker mb-2 text-[var(--brand)]">Look them up first</p>
          <h2 id="postcode-lookup-title" className="h2">
            See who represents you
          </h2>
          <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
            This only shows their details. It will not open an email or ask you to send anything.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="sr-only" htmlFor={inputId}>
            Your Scottish postcode
          </label>
          <input
            id={inputId}
            name="postcode"
            type="text"
            value={postcode}
            onChange={(event) => changePostcode(event.target.value)}
            placeholder="Your postcode, e.g. G12 8QQ"
            data-clarity-mask="true"
            autoComplete="postal-code"
            inputMode="text"
            required
            className="ui w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3.5 text-[16px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--brand)]"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="btn btn-primary justify-center whitespace-nowrap disabled:cursor-wait disabled:opacity-70"
          >
            {state === "loading" ? "Looking them up…" : "Show my representatives"}
          </button>
        </form>
      </div>

      <div aria-live="polite">
        {state === "error" && (
          <p role="alert" className="ui mt-5 text-[16px] font-[650] text-[var(--bad-text)]">
            {error}
          </p>
        )}

        {lookup && state === "success" && (
          <div data-clarity-mask="true" className="mt-8 border-t-2 border-[var(--ink)] pt-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="kicker mb-2 text-[var(--brand)]">Found automatically</p>
                <h2 className="h2">Your representatives</h2>
              </div>
              <p className="ui text-[15px] leading-[1.5] text-[var(--ink-2)]">
                {lookup.postcode} · {lookup.council.name}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ContactCard representative={lookup.mp} label="Your MP at Westminster" />
              {lookup.constituencyMsp ? (
                <ContactCard
                  representative={lookup.constituencyMsp}
                  label="Your constituency MSP at Holyrood"
                />
              ) : (
                <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
                  <h3 className="h3">Your MSP details are temporarily unavailable</h3>
                  <p className="mt-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
                    {lookup.mspUnavailable ?? "Please try the postcode again shortly."}
                  </p>
                </div>
              )}
            </div>

            {lookup.regionalMsps.length > 0 && (
              <details className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
                <summary className="ui cursor-pointer list-none px-5 py-4 text-[16px] font-[750] text-[var(--ink)] marker:hidden sm:px-6">
                  See your {lookup.regionalMsps.length} regional MSPs
                  <span aria-hidden="true" className="float-right text-[var(--brand)]">
                    +
                  </span>
                </summary>
                <div className="grid gap-3 border-t border-[var(--rule)] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                  {lookup.regionalMsps.map((msp) => (
                    <article
                      key={`${msp.name}-${msp.constituency}`}
                      className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4"
                    >
                      <div className="flex items-start gap-3">
                        {msp.photoUrl && (
                          <PortraitLightbox
                            src={msp.photoUrl}
                            alt={`${msp.name}, ${msp.party} regional MSP`}
                            sizes="48px"
                            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--r-s)] bg-[var(--surface-2)]"
                          />
                        )}
                        <Link
                          href={representativePagePath(msp)}
                          className="ui text-[16px] font-[750] text-[var(--ink)] no-underline hover:text-[var(--brand)]"
                        >
                          {msp.name}
                        </Link>
                      </div>
                      <p className="mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">{msp.party}</p>
                      <p className="mt-3 break-words text-[15px] leading-[1.45]">
                        <a href={`mailto:${msp.email}`}>{msp.email}</a>
                      </p>
                      <div className="ui mt-3 text-[15px] font-[680]">
                        <Link href={representativePagePath(msp)}>Full details</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            )}

            <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <h3 className="h3">Want help writing to them?</h3>
                <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  I can add your local facts and prepare separate emails for your MP and MSP. You
                  still read and approve everything.
                </p>
              </div>
              <button
                type="button"
                onClick={openLetterBuilder}
                className="btn btn-primary mt-4 w-full shrink-0 justify-center sm:mt-0 sm:w-auto"
              >
                Write the emails for me
              </button>
            </div>

            {/*
              The rest of the local record.
              A postcode used to buy four names and an email button. It is the
              best key this site has into its own data, so it now opens the
              area, the council, the tax bands and the constituency too.
              Every link names a place, never the postcode, so all of them can
              be shared. Outside the clarity-masked block on purpose: these are
              public URLs and there is nothing here to hide.
            */}
            <div className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-6">
              <h3 className="h3">Everything else about your area</h3>
              <p className="mt-2 max-w-[62ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                These pages are public and safe to share. None of them has your postcode in it.
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {localAreaLinks(lookup).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 no-underline transition-colors hover:border-[var(--brand)]"
                    >
                      <span className="ui block text-[16px] font-[750] leading-[1.35] text-[var(--ink)]">
                        {link.label}
                        <span aria-hidden="true" className="text-[var(--brand)]">
                          {" "}
                          →
                        </span>
                      </span>
                      <span className="mt-1 block text-[15px] leading-[1.45] text-[var(--ink-2)]">
                        {link.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
