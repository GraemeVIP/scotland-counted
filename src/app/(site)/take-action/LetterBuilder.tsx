"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";
import {
  councilExtra,
  CC_YEARS,
  PAY_YEARS,
} from "@/lib/data/councilExtra";
import {
  POSTCODE_SESSION_KEY,
  type Representative,
  type RepresentativeLookup,
} from "@/lib/representatives";
import { asOneIn } from "@/lib/plain-language";

type RepresentativeRole = "MP" | "MSP";

const ASKS: Array<{
  line: string;
  who: RepresentativeRole;
  localOnly?: string;
}> = [
  {
    line: "Make sure help with private rent keeps up with real rents in this area.",
    who: "MP",
  },
  {
    line: "Increase the Scottish Child Payment for the families most likely to be poor.",
    who: "MSP",
  },
  {
    line: "Make sure every family entitled to the Scottish Child Payment actually gets it.",
    who: "MSP",
  },
  {
    line: "Fund enough affordable homes to meet the level experts say Scotland needs.",
    who: "MSP",
  },
  {
    line: "Close Glasgow's homelessness funding gap so families are not left in hotels and B&Bs.",
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
    const asks = availableAsks.filter((ask) => ask.who === role);
    const localEvidence = councilExtra[council.slug];
    const claimant = localEvidence?.cc[CC_YEARS.length - 1];
    const pay = localEvidence?.pay[PAY_YEARS.length - 1];
    const direction = council.change > 0 ? "It has got worse." : "It has improved.";
    const personalPara = personal.trim() ? `\n${personal.trim()}\n` : "";
    const signoffPostcode = lookup?.postcode ?? postcode.trim().toUpperCase();

    const localWorkLine =
      typeof claimant === "number" && typeof pay === "number"
        ? `The wider local figures show ${claimant.toFixed(1)}% of working-age people needed out-of-work benefits in January ${CC_YEARS[CC_YEARS.length - 1]}. A typical full-time worker living here earned £${pay.toFixed(0)} a week before tax in ${PAY_YEARS[PAY_YEARS.length - 1]}.\n\n`
        : "";

    return `Dear ${representative?.name ?? `your ${role}`},

I live in ${council.name}, and I am writing about poverty in our area.

${asOneIn(council.pcts[9])} children here are growing up in poverty. The exact figure is ${council.pcts[9]}%, or ${council.counts[9].toLocaleString("en-GB")} children. It was ${council.pcts[0]}% in ${first}. ${direction}

${localWorkLine}The figures come from End Child Poverty and Loughborough University, using HMRC and DWP records. The Scottish figure for the same year was ${SCOTLAND_PCTS[9]}%.
${personalPara}
As my ${role}, please tell me if you will support these steps:

${asks.map((ask) => `- ${ask.line}`).join("\n")}

Please also tell me:

1. What have you done on these issues so far?
2. What do you expect the child-poverty figure in ${council.name} to be in five years?

I would be grateful for a clear reply to both questions.

Yours sincerely,
${name.trim() || "[your name]"}
[your street address]
${signoffPostcode || "[your postcode]"}`;
  }

  const drafts = useMemo(() => {
    if (!lookup) return [];

    return ([lookup.mp, lookup.msp] as Representative[]).map((representative) => ({
      representative,
      letter: makeLetter(representative.role, representative),
    }));
    // makeLetter is intentionally local: all of its reactive inputs are listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookup, council, first, last, name, personal, postcode, availableAsks]);

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
    const field = event.currentTarget.elements.namedItem("postcode") as HTMLInputElement | null;
    const value = field?.value ?? postcode;
    setPostcode(value.toUpperCase());
    void findRepresentativesFor(value);
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
    const subject = `Poverty in ${council.name} — what will you do?`;
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
              name="postcode"
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
                  Using the official figures for {lookup.council.name}: {asOneIn(council.pcts[9])}
                  children, exactly {council.pcts[9]}% or {council.counts[9].toLocaleString("en-GB")} children.
                </p>
              </div>
            )}
          </div>

          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            We use your postcode only to find your area, MP and MSP. We do not save it.
          </p>
        </div>

        <div className="mb-8">
          <StepLabel n={2}>Add your name if you want</StepLabel>
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
              placeholder="Optional: add one sentence about your street, family, work or bills."
              aria-label="A personal sentence for the email, optional"
              rows={4}
              className={`${inputCls} resize-y`}
            />
          </div>
          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            This is optional. Anything you add goes only into the draft opened by your email app.
          </p>
        </div>

        <div>
          <StepLabel n={3}>Open and send</StepLabel>
          {!lookup ? (
            <p className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 text-[15px] text-[var(--ink-2)] leading-[1.5]">
              Enter your postcode above. We will find both people and prepare both emails. You do
              not need to choose who should receive which request.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
                <strong>Two emails are ready.</strong> One goes to your MP and one to your MSP.
                Each asks only for changes that person can act on.
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
                      Open email to {representative.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyDraft(representative.role, letter)}
                      className="btn btn-ghost w-full justify-center"
                      aria-live="polite"
                    >
                      {copied === representative.role ? "Copied" : "Copy email instead"}
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
                Your email app opens with everything filled in. Read it, add your street address
                if needed, then press send when you are happy.
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
            <p className="text-[20px] font-[720]">Your two addressed emails will appear here</p>
            <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] mt-3 max-w-[58ch]">
              Enter your postcode. We find your MP and MSP, use your area&apos;s official figures and
              write one email for each person automatically.
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
                <pre className="text-[16px] leading-[1.65] whitespace-pre-wrap font-sans text-[var(--ink-2)] overflow-x-auto m-0">
                  {letter}
                </pre>
              </article>
            ))}
          </div>
        )}

        <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mt-4 max-w-[64ch]">
          Every figure in the email is published on this site. You and your representative can
          check it on <Link href="/areas">your area&apos;s page</Link>, alongside the source.
        </p>
      </div>
    </div>
  );
}
