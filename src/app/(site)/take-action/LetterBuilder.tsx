"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";
import {
  councilExtra,
  SCOTLAND_EXTRA,
  CC_YEARS,
  PAY_YEARS,
} from "@/lib/data/councilExtra";
import {
  POSTCODE_SESSION_KEY,
  type Representative,
  type RepresentativeLookup,
} from "@/lib/representatives";

type RepresentativeRole = "MP" | "MSP";

const ASKS: Array<{
  id: string;
  label: string;
  line: string;
  who: RepresentativeRole;
  localOnly?: string;
}> = [
  {
    id: "lha",
    label: "Restore housing benefit to real local rents",
    line: "restore Local Housing Allowance to at least the 30th percentile of local rents, so that housing support reflects what landlords actually charge",
    who: "MP",
  },
  {
    id: "scp",
    label: "Expand the Scottish Child Payment",
    line: "back a targeted Scottish Child Payment supplement for families with a baby, a disabled member or a single parent — costed at around £310m a year and modelled to lift roughly 10,000 children out of poverty",
    who: "MSP",
  },
  {
    id: "takeup",
    label: "Get the Scottish Child Payment to everyone entitled",
    line: "fund the work needed to reach 100% take-up of the Scottish Child Payment, costed at around £60m a year",
    who: "MSP",
  },
  {
    id: "housing",
    label: "Fund housing at the level assessed as needed",
    line: "close the gap between the £4.1bn currently planned for housing and the £8–9.2bn independently assessed as necessary",
    who: "MSP",
  },
  {
    id: "homelessness",
    label: "Fund Glasgow's homelessness shortfall",
    line: "fund the projected homelessness shortfall of £56m in 2026/27 and £73m in 2027/28, so that a statutory duty stops being breached and public money stops going on hotel rooms",
    who: "MSP",
    localOnly: "glasgow-city",
  },
];

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="figure-num text-[24px] text-[var(--action)]" aria-hidden="true">
        {n}
      </span>
      <span className="ui text-[16px] font-[680] text-[var(--ink)]">{children}</span>
    </div>
  );
}

const inputCls =
  "ui w-full rounded-[var(--r-s)] bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[16px] focus:border-[var(--brand)] outline-none transition-colors";

function normalisePostcode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

function RepresentativeSummary({ representative }: { representative: Representative }) {
  return (
    <div className="border-t border-[var(--rule)] pt-3 first:border-t-0 first:pt-0">
      <p className="ui text-[15px] font-[720] text-[var(--ink)]">
        Your {representative.role}: {representative.name}
      </p>
      <p className="text-[15px] text-[var(--ink-2)] leading-[1.5] mt-1">
        {representative.party} · {representative.constituency}
      </p>
    </div>
  );
}

export default function LetterBuilder() {
  const [slug, setSlug] = useState("glasgow-city");
  const [picked, setPicked] = useState<string[]>(["lha", "scp"]);
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [personal, setPersonal] = useState("");
  const [lookup, setLookup] = useState<RepresentativeLookup | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [lookupError, setLookupError] = useState("");
  const [copied, setCopied] = useState<RepresentativeRole | null>(null);

  const council = councils.find((item) => item.slug === slug)!;
  const last = COUNCIL_YEARS[9];
  const first = COUNCIL_YEARS[0];
  const availableAsks = useMemo(
    () => ASKS.filter((ask) => !ask.localOnly || ask.localOnly === council.slug),
    [council.slug]
  );

  function makeLetter(role: RepresentativeRole, representative?: Representative) {
    const asks = availableAsks.filter((ask) => ask.who === role && picked.includes(ask.id));
    const localEvidence = councilExtra[council.slug];
    const claimant = localEvidence?.cc[CC_YEARS.length - 1];
    const scotlandClaimant = SCOTLAND_EXTRA.cc[CC_YEARS.length - 1];
    const pay = localEvidence?.pay[PAY_YEARS.length - 1];
    const scotlandPay = SCOTLAND_EXTRA.pay[PAY_YEARS.length - 1];
    const direction =
      council.change > 0
        ? `an increase of ${council.change} percentage points since ${first}`
        : `a fall of ${Math.abs(council.change)} percentage points since ${first}`;
    const personalPara = personal.trim() ? `\n${personal.trim()}\n` : "";
    const signoffPostcode = lookup?.postcode ?? postcode.trim().toUpperCase();

    const labourMarketParagraph =
      typeof claimant === "number" && typeof pay === "number"
        ? `\nThe wider local evidence matters too. In January ${CC_YEARS[CC_YEARS.length - 1]}, ${claimant.toFixed(1)}% of working-age residents in ${council.name} were claiming out-of-work benefits, compared with ${scotlandClaimant.toFixed(1)}% across Scotland. In ${PAY_YEARS[PAY_YEARS.length - 1]}, median gross weekly pay for full-time workers living in the area was £${pay.toFixed(2)}, compared with £${scotlandPay.toFixed(2)} across Scotland. Neither measure defines poverty on its own, but together they show why work, pay, housing costs and social security have to be considered together.\n`
        : "";

    return `Dear ${representative?.name ?? `your ${role}`},

I am writing as a constituent in ${council.name} about poverty, work and living standards in this area.

In ${last}, ${council.pcts[9]}% of children in ${council.name} were living in relative poverty after housing costs. That is ${council.counts[9].toLocaleString("en-GB")} children, and ${direction}. The Scottish figure for the same year was ${SCOTLAND_PCTS[9]}%. These are the End Child Poverty and Loughborough University estimates, drawn from HMRC and DWP administrative data.
${labourMarketParagraph}

I am also aware that all four of the statutory interim child poverty targets set out in the Child Poverty (Scotland) Act 2017 were missed for 2023/24, including persistent poverty at 23% against a target of 8%.
${personalPara}
I would like to know whether you support the following:

${asks.map((ask) => `- That the government should ${ask.line}.`).join("\n")}

Independent modelling by the Joseph Rowntree Foundation, IPPR Scotland and the Fraser of Allander Institute all reach the same conclusion: income transfers reduce child poverty, and employment programmes alone do not.

Could you tell me:

1. Which of the measures above you support, and what you have done to advance them?
2. What you expect the child poverty rate in ${council.name} to be in five years' time, and on what basis?

I would be grateful for a substantive reply rather than a general statement of concern.

Yours sincerely,
${name.trim() || "[your name]"}
[your street address]
${signoffPostcode || "[your postcode]"}`;
  }

  const drafts = useMemo(() => {
    if (!lookup) return [];

    return ([lookup.mp, lookup.msp] as Representative[])
      .filter((representative) =>
        availableAsks.some((ask) => ask.who === representative.role && picked.includes(ask.id))
      )
      .map((representative) => ({
        representative,
        letter: makeLetter(representative.role, representative),
      }));
    // makeLetter is intentionally local: all of its reactive inputs are listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookup, picked, council, first, last, name, personal, postcode, availableAsks]);

  const findRepresentativesFor = useCallback(async (value: string) => {
    setLookupState("loading");
    setLookupError("");
    setLookup(null);

    try {
      const response = await fetch(`/api/representatives?postcode=${encodeURIComponent(value)}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as RepresentativeLookup | { error?: string };
      if (!response.ok || !("mp" in result)) {
        throw new Error("error" in result && result.error ? result.error : "The lookup failed.");
      }

      setLookup(result);
      setSlug(result.council.slug);
      setPostcode(result.postcode);
      setLookupState("success");
    } catch (error) {
      setLookupState("error");
      setLookupError(
        error instanceof Error ? error.message : "The representative lookup is unavailable."
      );
    }
  }, []);

  useEffect(() => {
    const carriedPostcode = sessionStorage.getItem(POSTCODE_SESSION_KEY);
    if (!carriedPostcode) return;

    const timer = window.setTimeout(() => {
      sessionStorage.removeItem(POSTCODE_SESSION_KEY);
      setPostcode(carriedPostcode);
      void findRepresentativesFor(carriedPostcode);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [findRepresentativesFor]);

  function findRepresentatives(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void findRepresentativesFor(postcode);
  }

  function changePostcode(value: string) {
    setPostcode(value.toUpperCase());
    if (lookup && normalisePostcode(value) !== normalisePostcode(lookup.postcode)) {
      setLookup(null);
      setLookupState("idle");
    }
  }

  async function copyDraft(role: RepresentativeRole, letter: string) {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(role);
      setTimeout(() => setCopied(null), 3200);
    } catch {
      setCopied(null);
    }
  }

  function mailtoFor(representative: Representative, letter: string) {
    const subject = `Poverty and living standards in ${council.name} — a constituent's question`;
    return `mailto:${representative.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(letter)}`;
  }

  return (
    <div id="letter-builder" className="mt-10 grid gap-7 lg:grid-cols-[420px_1fr] items-start scroll-mt-24">
      <div
        className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 lg:sticky lg:top-[84px]"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="mb-8">
          <StepLabel n={1}>Enter your postcode</StepLabel>
          <form onSubmit={findRepresentatives} className="grid gap-2.5">
            <input
              type="text"
              value={postcode}
              onChange={(event) => changePostcode(event.target.value)}
              placeholder="Postcode, e.g. G12 8QQ"
              aria-label="Your postcode"
              className={inputCls}
              autoComplete="postal-code"
              inputMode="text"
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={lookupState === "loading"}
            >
              {lookupState === "loading" ? "Finding them…" : "Find my MP and MSP"}
            </button>
          </form>

          <div className="mt-3" aria-live="polite">
            {lookupState === "error" && (
              <p className="text-[15px] text-[var(--bad)] leading-[1.5]">{lookupError}</p>
            )}
            {lookup && (
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 space-y-3">
                <p className="ui text-[15px] font-[720] text-[var(--good)]">
                  Found automatically for {lookup.postcode}
                </p>
                <RepresentativeSummary representative={lookup.mp} />
                <RepresentativeSummary representative={lookup.msp} />
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.5] border-t border-[var(--rule)] pt-3">
                  Using the official figures for {lookup.council.name}: {council.pcts[9]}% of
                  children, or {council.counts[9].toLocaleString("en-GB")}, in {last}.
                </p>
              </div>
            )}
          </div>

          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            Your postcode is used only to retrieve your area, MP and constituency MSP. This site
            does not store it.
          </p>
        </div>

        <fieldset className="mb-8">
          <legend>
            <StepLabel n={2}>What are you asking for?</StepLabel>
          </legend>
          <div className="space-y-3">
            {availableAsks.map((ask) => (
              <label key={ask.id} className="flex gap-3 items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={picked.includes(ask.id)}
                  onChange={(event) =>
                    setPicked((current) =>
                      event.target.checked
                        ? [...current, ask.id]
                        : current.filter((id) => id !== ask.id)
                    )
                  }
                  className="mt-1 accent-[var(--brand)] w-4 h-4 shrink-0"
                />
                <span className="text-[15px] leading-[1.45] group-hover:text-[var(--brand)] transition-colors">
                  {ask.label}
                  <span className="ui text-[15px] font-[620] text-[var(--muted)] block mt-1">
                    Routed to your {ask.who} automatically
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-8">
          <StepLabel n={3}>Make it yours</StepLabel>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name (optional)"
              aria-label="Your name, optional"
              className={inputCls}
              autoComplete="name"
            />
            <textarea
              value={personal}
              onChange={(event) => setPersonal(event.target.value)}
              placeholder="Add one personal sentence (optional). A line about your street, school or work can make the email harder to answer with a template."
              aria-label="A personal sentence for the email, optional"
              rows={4}
              className={`${inputCls} resize-y font-serif`}
            />
          </div>
          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            Your name and personal sentence never leave this page. They go straight into the draft
            opened by your own email app.
          </p>
        </div>

        <div>
          <StepLabel n={4}>Open and send</StepLabel>
          {!lookup ? (
            <p className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 text-[15px] text-[var(--ink-2)] leading-[1.5]">
              Enter your postcode above. We will address the email and send each request to the
              representative who can act on it.
            </p>
          ) : drafts.length === 0 ? (
            <p className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 text-[15px] text-[var(--ink-2)] leading-[1.5]">
              Choose at least one action above and the right email will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
                {drafts.length === 2
                  ? "Two emails are ready. Send both: each contains only the decisions that person can act on."
                  : "Your email is addressed to the person who can act on what you selected."}
              </p>
              {drafts.map(({ representative, letter }, index) => (
                <div
                  key={representative.role}
                  className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4"
                >
                  <p className="ui text-[15px] font-[720] text-[var(--action)]">
                    {drafts.length === 2 ? `Email ${index + 1} of 2 · ` : "Email · "}
                    your {representative.role}
                  </p>
                  <p className="text-[18px] font-[680] mt-1">{representative.name}</p>
                  <p className="text-[15px] text-[var(--ink-2)] leading-[1.45] mt-1">
                    {representative.party} · {representative.constituency}
                  </p>
                  <a
                    href={`mailto:${representative.email}`}
                    className="text-[15px] break-all inline-block mt-2"
                  >
                    {representative.email}
                  </a>
                  {representative.phone && (
                    <p className="text-[15px] text-[var(--ink-2)] mt-1">
                      {representative.phone}
                    </p>
                  )}
                  <div className="grid gap-2.5 mt-4">
                    <a
                      href={mailtoFor(representative, letter)}
                      className="btn btn-primary w-full justify-center text-center"
                      aria-label={`Open ready-to-send email to ${representative.name}, your ${representative.role}`}
                    >
                      Open ready-to-send email
                    </a>
                    <button
                      type="button"
                      onClick={() => copyDraft(representative.role, letter)}
                      className="btn btn-ghost w-full justify-center"
                      aria-live="polite"
                    >
                      {copied === representative.role ? "Copied" : "Copy this email instead"}
                    </button>
                  </div>
                  <a
                    href={representative.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui text-[15px] inline-block mt-3"
                  >
                    Check official profile →
                  </a>
                </div>
              ))}
              <p className="text-[15px] text-[var(--muted)] leading-[1.5]">
                Your email app opens with the recipient, subject and message filled in. Add your
                street address if it is not already in your email signature, review, then send.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="label">Your email{drafts.length === 2 ? "s" : ""}</p>
          {drafts.length > 0 && (
            <p className="ui tnum text-[15px] text-[var(--muted)]">
              {drafts.length} ready
            </p>
          )}
        </div>

        {drafts.length === 0 ? (
          <div
            className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] p-7 sm:p-10"
            style={{ boxShadow: "var(--shadow-2)" }}
          >
            <p className="text-[20px] font-[680]">Your addressed email will appear here</p>
            <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] mt-3 max-w-[58ch]">
              Enter your postcode and the site will find the right people, use your council&apos;s
              official figures and address each draft for you.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {drafts.map(({ representative, letter }) => (
              <article
                key={representative.role}
                className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] p-6 sm:p-10"
                style={{ boxShadow: "var(--shadow-2)" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--rule)] pb-4 mb-5">
                  <div>
                    <p className="ui text-[15px] font-[720] text-[var(--action)]">
                      To your {representative.role}
                    </p>
                    <h2 className="text-[22px] font-[700] mt-1">{representative.name}</h2>
                  </div>
                  <p className="ui tnum text-[15px] text-[var(--muted)]">
                    {letter.split(/\s+/).length} words
                  </p>
                </div>
                <pre className="text-[16px] leading-[1.7] whitespace-pre-wrap font-serif text-[var(--ink-2)] overflow-x-auto m-0">
                  {letter}
                </pre>
              </article>
            ))}
          </div>
        )}

        <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mt-4 max-w-[64ch]">
          Every figure in the email is from the published data on this site, so your representative
          can check it — and so can you: <Link href="/areas">your area&apos;s page</Link> shows the
          same numbers with their sources.
        </p>
      </div>
    </div>
  );
}
