"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";
import {
  councilExtra,
  CC_YEARS,
} from "@/lib/data/councilExtra";
import {
  POSTCODE_SESSION_KEY,
  type Representative,
  type RepresentativeLookup,
} from "@/lib/representatives";
import { asOneIn } from "@/lib/plain-language";
import {
  buildLetter,
  letterSubject,
  topicsForRole,
  type LetterArea,
  type RepresentativeRole,
} from "@/lib/letter";
import {
  DEFAULT_TOPIC_IDS,
  joinPhrases,
  LETTER_TOPICS,
  rolesForTopics,
  topicsByIds,
} from "@/lib/data/letterTopics";

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
  const [topicIds, setTopicIds] = useState<string[]>(DEFAULT_TOPIC_IDS);
  const [lookup, setLookup] = useState<RepresentativeLookup | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [lookupError, setLookupError] = useState("");
  const [copied, setCopied] = useState<RepresentativeRole | null>(null);

  const council = councils.find((item) => item.slug === slug)!;
  const first = COUNCIL_YEARS[0];

  /** The area this letter argues from, in the shape the shared writer expects. */
  const area = useMemo<LetterArea>(() => {
    const localEvidence = councilExtra[council.slug];
    const claimant = localEvidence?.cc[CC_YEARS.length - 1];

    return {
      name: council.name,
      pct: council.pcts[9],
      count: council.counts[9],
      firstPct: council.pcts[0],
      firstYear: first,
      scotlandPct: SCOTLAND_PCTS[9],
      evidenceLine:
        typeof claimant === "number"
          ? `The wider local figures show ${claimant.toFixed(1)}% of working-age people needed out-of-work benefits in January ${CC_YEARS[CC_YEARS.length - 1]}.`
          : undefined,
    };
  }, [council, first]);

  const topics = useMemo(() => topicsByIds(topicIds), [topicIds]);

  const promptText =
    topics.length === 1
      ? topics[0].prompt
      : "Tell them what has happened to you, in your own words. If these things are connected, say so — that is usually the part that matters most.";

  const toggleTopic = useCallback((id: string) => {
    setTopicIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }, []);

  const drafts = useMemo(() => {
    if (!lookup) return [];
    // Only write to the people who can act on at least one thing ticked.
    // Sending an NHS-only letter to an MP wastes the reader's time and the
    // office's — but if anything else ticked is reserved, the MP still gets one.
    const wanted = rolesForTopics(topics);

    return [lookup.mp, lookup.msp]
      .filter((r): r is Representative => r !== null && wanted.includes(r.role))
      .map((representative) => ({
        representative,
        letter: buildLetter({
          area,
          role: representative.role,
          representative,
          senderName: name,
          personal,
          postcode: lookup.postcode ?? postcode,
          councilSlug: council.slug,
          topics,
        }),
      }));
  }, [lookup, area, council.slug, name, personal, postcode, topics]);

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
    // The subject has to describe this email, not the whole selection. Tick
    // three things where only two are reserved and the MP's subject would
    // otherwise announce a third that is not in the message.
    const theirs = topicsForRole(topics, representative.role);
    return `mailto:${representative.email}?subject=${encodeURIComponent(letterSubject(area, theirs))}&body=${encodeURIComponent(letter)}`;
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
              data-clarity-mask="true"
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
              <p className="text-[15px] text-[var(--bad-text)] leading-[1.5]">{lookupError}</p>
            )}
            {lookup && (
              <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 space-y-3">
                <p className="ui text-[15px] font-[720] text-[var(--good-text)]">
                  Found automatically for {lookup.postcode}
                </p>
                <RepresentativeSummary representative={lookup.mp} />
                {lookup.msp ? (
                  <RepresentativeSummary representative={lookup.msp} />
                ) : (
                  <p className="text-[15px] text-[var(--warn-text)] leading-[1.5] border-t border-[var(--rule)] pt-3">
                    {lookup.mspUnavailable ?? "We could not find your MSP just now."}
                  </p>
                )}
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.5] border-t border-[var(--rule)] pt-3">
                  Using the official figures for {lookup.council.name}: {asOneIn(council.pcts[9])}{" "}
                  children, exactly {council.pcts[9]}% or {council.counts[9].toLocaleString("en-GB")} children.
                </p>
              </div>
            )}
          </div>

          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            We use your postcode only to find your area, MP and MSP. We do not save it.
          </p>
        </div>

        <fieldset className="mb-8">
          <legend className="contents">
            <StepLabel n={2}>What do you want them to act on?</StepLabel>
          </legend>
          <p className="text-[15px] leading-[1.55] text-[var(--ink-2)] -mt-1 mb-3">
            Choose one or more. There is no wrong answer, and you can tick things that feel
            unrelated — they often are not.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {LETTER_TOPICS.map((t) => {
              const on = topicIds.includes(t.id);
              return (
                <label
                  key={t.id}
                  className={`group flex gap-3 cursor-pointer rounded-[var(--r-s)] border px-3.5 py-3 transition-colors ${
                    on
                      ? "border-[var(--brand)] bg-[var(--surface-2)]"
                      : "border-[var(--rule-strong)] bg-[var(--paper)] hover:border-[var(--muted)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleTopic(t.id)}
                    className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[var(--brand)]"
                  />
                  <span>
                    <span className="ui block text-[15.5px] font-[680] leading-[1.35] text-[var(--ink)]">
                      {t.label}
                    </span>
                    <span className="block text-[14.5px] leading-[1.45] text-[var(--ink-2)] mt-0.5">
                      {t.blurb}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {topics.length === 0 ? (
            <p className="mt-3 rounded-[var(--r-s)] border-l-[3px] border-[var(--warn)] bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Tick at least one thing above and we will work out who can act on it.
            </p>
          ) : (
            /*
             * Who each email goes to, and why. This is the part almost nobody
             * knows, and with several subjects ticked it is the part doing the
             * real work — the reader never has to sort reserved from devolved.
             */
            <div className="mt-3 space-y-2">
              {(["MP", "MSP"] as const).map((role) => {
                const theirs = topicsForRole(topics, role);
                if (!theirs.length) return null;
                return (
                  <div
                    key={role}
                    className="rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface-2)] px-4 py-3"
                  >
                    <p className="ui text-[14px] font-[750] text-[var(--brand)] mb-1">
                      Your {role} gets: {joinPhrases(theirs.map((t) => t.phrase))}
                    </p>
                    <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                      {theirs[0].whyWho}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </fieldset>

        <div className="mb-8">
          <StepLabel n={3}>Add your own words</StepLabel>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name (optional)"
              data-clarity-mask="true"
              aria-label="Your name, optional"
              className={inputCls}
              autoComplete="name"
            />
            <textarea
              value={personal}
              onChange={(event) => setPersonal(event.target.value)}
              placeholder={promptText}
              data-clarity-mask="true"
              aria-label="What you want to tell them, optional"
              rows={6}
              className={`${inputCls} resize-y`}
            />
          </div>
          <p className="text-[15px] text-[var(--muted)] leading-[1.5] mt-3">
            Optional, but it is the part only you can write, and it goes in first — before
            any of the policy asks. Nothing is sent to us and nothing is saved.
          </p>
        </div>

        <div>
          <StepLabel n={4}>Open and send</StepLabel>
          {!lookup ? (
            <p className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--paper)] p-4 text-[15px] text-[var(--ink-2)] leading-[1.5]">
              Enter your postcode above. We will find both people and prepare both emails. You do
              not need to choose who should receive which request.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
                {drafts.length === 2 ? (
                  <>
                    <strong>Two emails are ready.</strong> One goes to your MP in London and one
                    to your MSP in Edinburgh. Each one only asks for things that person can
                    actually do.
                  </>
                ) : (
                  <>
                    <strong>Your email is ready.</strong> It goes to your{" "}
                    {drafts[0]?.representative.role ?? "MP"}, because that is who can act on this.
                  </>
                )}
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
