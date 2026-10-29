"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/components/IntentLink";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";
import {
  councilExtra,
  CC_YEARS,
} from "@/lib/data/councilExtra";
import {
  POSTCODE_SESSION_KEY,
  localAreaLinks,
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
  joinPhrases,
  LETTER_TOPICS,
  rolesForTopics,
  topicsByIds,
} from "@/lib/data/letterTopics";
import { trackEvent } from "@/lib/analytics";

/*
 * The email builder, as one journey down the page.
 *
 * It used to be two columns: a 420px form holding all four steps, beside a
 * preview that stayed an empty box until a postcode was in. On a desktop the
 * form ran three screens long in a narrow strip while the preview sat empty
 * beside it; the topic cards were squeezed to a few words a line. Now each
 * step is a full width card, in order, with a progress bar that ticks off as
 * you go, and the finished emails come last, side by side, where the reader
 * actually needs them.
 */

const inputCls =
  "ui w-full min-h-12 rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule-strong)] px-4 py-3 text-[16px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] outline-none transition-colors";

function normalisePostcode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

function representativeLabel(representative: Representative) {
  if (representative.role === "MSP" && representative.representationType === "constituency") {
    return "constituency MSP";
  }
  if (representative.role === "MSP" && representative.representationType === "regional") {
    return "regional MSP";
  }
  return representative.role;
}

const Tick = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A small picture for each subject, so the list can be scanned rather than read. */
function TopicIcon({ id }: { id: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "cost-of-living":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "housing":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "low-pay":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "council-tax":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" />
        </svg>
      );
    case "child-poverty":
      return (
        <svg {...common}>
          <circle cx="12" cy="6" r="2.6" />
          <path d="M8 21v-5l-2-3 3-3.5h6L18 13l-2 3v5" />
        </svg>
      );
    case "benefits":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2.5" />
          <path d="M3 10h18M16 15h2" />
        </svg>
      );
    case "nhs":
      return (
        <svg {...common}>
          <path d="M12 20s-7.5-4.6-9.2-9.2A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 9.2 4.4C19.5 15.4 12 20 12 20z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9l-4-4L4 16z" />
          <path d="m13.5 6.5 4 4" />
        </svg>
      );
  }
}

/** One numbered step: a full width card with its own heading. */
type StepState = "complete" | "current" | "upcoming";

/** One numbered step: a full width card with its own heading. The current step is outlined. */
function StepCard({
  n,
  id,
  title,
  state,
  optional,
  children,
}: {
  n: number;
  id: string;
  title: string;
  state: StepState;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`tile scroll-mt-44 p-5 transition-[border-color,box-shadow] sm:p-8 ${
        state === "current" ? "!border-[var(--brand)] ring-2 ring-[var(--brand)]/15" : ""
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className={`ui grid h-10 w-10 shrink-0 place-items-center rounded-full text-[17px] font-[700] ${
            state === "complete"
              ? "bg-[var(--good)] text-white"
              : state === "current"
                ? "bg-[var(--brand)] text-white"
                : "border-2 border-[var(--rule-strong)] text-[var(--muted)]"
          }`}
          aria-hidden="true"
        >
          {state === "complete" ? <Tick size={18} /> : n}
        </span>
        <h2 id={`${id}-title`} className="display-stat text-[clamp(22px,2.4vw,28px)] leading-[1.15]">
          <span className="sr-only">Step {n}: </span>
          {title}
        </h2>
        {optional && (
          <span className="ui rounded-full border border-[var(--rule-strong)] px-2.5 py-0.5 text-[13px] font-[600] text-[var(--ink-2)]">
            Optional
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function PersonCard({ representative, heading }: { representative: Representative; heading: string }) {
  return (
    <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 sm:p-5">
      <p className="ui text-[14px] font-[600] text-[var(--brand)]">{heading}</p>
      <p className="mt-1 text-[19px] font-[650] leading-[1.25] text-[var(--ink)]">{representative.name}</p>
      <p className="mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">
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
  // Nothing ticked to start with. A preselected subject lit step 2 before the
  // reader had done anything, and wrote an email they had not asked for.
  const [topicIds, setTopicIds] = useState<string[]>([]);
  /** The reader pressed Next on the optional step 3, or skipped it. */
  const [movedOn, setMovedOn] = useState(false);
  /** An email was opened or copied: the journey is finished. */
  const [finished, setFinished] = useState(false);
  const [lookup, setLookup] = useState<RepresentativeLookup | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [lookupError, setLookupError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const ids = useId();
  const postcodeRef = useRef<HTMLInputElement>(null);

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
      latestYear: COUNCIL_YEARS[9],
      scotlandPct: SCOTLAND_PCTS[9],
      evidenceLine:
        typeof claimant === "number"
          ? `The wider local figures show ${claimant.toFixed(1)}% of working age people needed out of work benefits in January ${CC_YEARS[CC_YEARS.length - 1]}.`
          : undefined,
    };
  }, [council, first]);

  const topics = useMemo(() => topicsByIds(topicIds), [topicIds]);

  const promptText =
    topics.length === 1
      ? topics[0].prompt
      : "Tell them what has happened to you, in your own words. If these things are connected, say so. That is usually the part that matters most.";

  const toggleTopic = useCallback((id: string) => {
    setTopicIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  }, []);

  const drafts = useMemo(() => {
    if (!lookup) return [];
    // Only write to the people who can act on at least one thing ticked.
    // Sending an NHS-only letter to an MP wastes the reader's time and the
    // office's, but if anything else ticked is reserved, the MP still gets one.
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

  const regionalDrafts = useMemo(() => {
    if (!lookup) return [];
    const canAct = rolesForTopics(topics).includes("MSP");

    return lookup.regionalMsps.map((representative) => ({
      representative,
      letter: canAct
        ? buildLetter({
            area,
            role: "MSP",
            representative,
            senderName: name,
            personal,
            postcode: lookup.postcode ?? postcode,
            councilSlug: council.slug,
            topics,
          })
        : null,
    }));
  }, [lookup, area, council.slug, name, personal, postcode, topics]);

  const findRepresentativesFor = useCallback(async (value: string) => {
    setLookupState("loading");
    setLookupError("");
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
        throw new Error("error" in result && result.error ? result.error : "The lookup failed.");
      }

      setLookup(result);
      setSlug(result.council.slug);
      setPostcode(result.postcode);
      setLookupState("success");
      trackEvent("postcode_lookup_success", { council: result.council.slug });
    } catch (error) {
      setLookupState("error");
      setLookupError(
        error instanceof Error ? error.message : "The representative lookup is unavailable."
      );
      trackEvent("postcode_lookup_error");
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
    // Read the box itself as well as state, so anything typed before the
    // script loaded still counts.
    const value = (postcodeRef.current?.value || postcode).trim();
    if (!value) return;
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
      setCopied(`letter-${role}`);
      setFinished(true);
      trackEvent("letter_copied", { role, topic_count: topics.length });
      setTimeout(() => setCopied(null), 3200);
    } catch {
      setCopied(null);
    }
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
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

  function openDraft(
    representative: Representative,
    letter: string,
    trackingRole: RepresentativeRole | "regional_msp" = representative.role,
  ) {
    trackEvent("mailto_opened", {
      role: trackingRole,
      topic_count: topics.length,
    });
    setFinished(true);
    window.location.assign(mailtoFor(representative, letter));
  }

  function goToPostcode() {
    document.getElementById("lb-step-postcode")?.scrollIntoView({ block: "start", behavior: "smooth" });
    document.getElementById(`${ids}-postcode`)?.focus({ preventScroll: true });
  }

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  /*
   * A flow, not a checklist. Each step is complete only when the one before
   * it is, so the bar fills from the left in order, and the current step is
   * the first one that is not yet complete. Step 3 is optional: writing in
   * it, pressing Next, or going on to open or copy an email all finish it.
   */
  const s1 = !!lookup;
  const s2 = s1 && topics.length > 0;
  const s4 = s2 && drafts.length > 0 && finished;
  const s3 = s2 && (personal.trim().length > 0 || movedOn || s4);
  const complete = [s1, s2, s3, s4];
  const current = complete.findIndex((c) => !c); // -1 once everything is done
  const stageOf = (i: number): StepState => (complete[i] ? "complete" : i === current ? "current" : "upcoming");

  const steps = [
    { id: "lb-step-postcode", label: "Your postcode" },
    { id: "lb-step-topics", label: "What it is about" },
    { id: "lb-step-words", label: "Your own words" },
    { id: "lb-step-send", label: "Read and send" },
  ];

  /* Who gets what. The part almost nobody knows, so it is spelled out. */
  const routing = (["MP", "MSP"] as const)
    .map((role) => ({ role, theirs: topicsForRole(topics, role) }))
    .filter((r) => r.theirs.length > 0);
  const reasons = topics.filter((t, i, all) => all.findIndex((x) => x.whyWho === t.whyWho) === i);

  return (
    <div id="letter-builder" className="mt-10 scroll-mt-24">
      {/* Progress: where you are in the flow, and a way to jump back to any step. It stays in view. */}
      <nav
        aria-label="Steps"
        className="sticky top-[calc(var(--header-h)+16px)] z-20 rounded-[var(--r-m)] border border-[var(--rule)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-3 shadow-[var(--shadow-1)] backdrop-blur sm:px-5"
      >
        <ol className="grid grid-cols-4 gap-2 sm:gap-3">
          {steps.map((step, i) => {
            const state = stageOf(i);
            return (
              <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  className="group block no-underline"
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`Step ${i + 1}: ${step.label}${state === "complete" ? ", done" : state === "current" ? ", you are here" : ""}`}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-colors ${
                      state === "complete" ? "bg-[var(--good)]" : state === "current" ? "bg-[var(--brand)]" : "bg-[var(--rule)]"
                    }`}
                  />
                  <span
                    className={`ui mt-2 flex items-center gap-1.5 text-[13.5px] leading-[1.25] ${
                      state === "upcoming" ? "font-[500] text-[var(--muted)]" : "font-[650] text-[var(--ink)]"
                    } group-hover:text-[var(--action-text)]`}
                  >
                    {state === "complete" ? (
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--good)] text-white">
                        <Tick size={12} />
                      </span>
                    ) : (
                      <span
                        className={`tnum grid h-5 w-5 shrink-0 place-items-center rounded-full text-[12px] font-[700] ${
                          state === "current" ? "bg-[var(--brand)] text-white" : "border border-[var(--rule-strong)] text-[var(--muted)]"
                        }`}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span className="max-sm:sr-only">{step.label}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="ui mt-2 text-[14px] font-[600] text-[var(--ink)] sm:hidden" aria-hidden="true">
          {current === -1 ? "All done" : `Step ${current + 1} of 4: ${steps[current].label}`}
        </p>
      </nav>

      <div className="mt-6 grid gap-5">
        {/* ---------- 1. Postcode ---------- */}
        <StepCard n={1} id="lb-step-postcode" title="Where do you live?" state={stageOf(0)}>
          <form onSubmit={findRepresentatives} className="grid gap-3 sm:grid-cols-[minmax(0,320px)_auto] sm:items-end sm:justify-start">
            <div>
              <label htmlFor={`${ids}-postcode`} className="ui mb-1.5 block text-[15px] font-[600] text-[var(--ink)]">
                Your postcode
              </label>
              {/*
                No name attribute, on purpose: sent before the script loads, a
                named field would land in the address bar, and from there in
                browser history and analytics.
              */}
              <input
                ref={postcodeRef}
                id={`${ids}-postcode`}
                type="text"
                value={postcode}
                onChange={(event) => changePostcode(event.target.value)}
                placeholder="e.g. G12 8QQ"
                data-clarity-mask="true"
                className={inputCls}
                autoComplete="postal-code"
                inputMode="text"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary min-h-12 justify-center"
              disabled={lookupState === "loading"}
            >
              {lookupState === "loading" ? "Finding them…" : "Find my MP and MSP"}
            </button>
          </form>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
            I use your postcode to find your representatives, then add it to your email so their office knows you live
            there. I do not save it and nothing is sent until you press send yourself.
          </p>

          <div aria-live="polite">
            {lookupState === "error" && (
              <p role="alert" className="ui mt-4 text-[16px] font-[540] leading-[1.5] text-[var(--bad-text)]">
                {lookupError}
              </p>
            )}
            {lookup && (
              <div data-clarity-mask="true" className="mt-6 border-t border-[var(--rule)] pt-6">
                <p className="ui flex items-center gap-2 text-[16px] font-[650] text-[var(--good-text)]">
                  <Tick /> Found for {lookup.postcode}, in {lookup.council.name}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <PersonCard representative={lookup.mp} heading="Your MP, in London" />
                  {lookup.msp ? (
                    <PersonCard representative={lookup.msp} heading="Your constituency MSP, in Edinburgh" />
                  ) : (
                    <p className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 text-[15px] leading-[1.5] text-[var(--warn-text)]">
                      {lookup.mspUnavailable ?? "I could not find your MSP just now."}
                    </p>
                  )}
                </div>

                {lookup.regionalMsps.length > 0 && (
                  <details className="group mt-3 rounded-[var(--r-m)] border border-[var(--rule)]">
                    <summary className="ui flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 text-[15px] font-[600] text-[var(--ink)] marker:content-none">
                      <span>
                        You also have {lookup.regionalMsps.length} regional MSP
                        {lookup.regionalMsps.length === 1 ? "" : "s"}
                        {lookup.holyrood.region ? ` for ${lookup.holyrood.region}` : ""}
                      </span>
                      <span aria-hidden="true" className="text-[20px] leading-none text-[var(--brand)] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--rule)] px-4 pb-2 pt-3">
                      <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                        They also represent you, across the wider {lookup.holyrood.region ?? "Scottish Parliament"} region.
                        You can write to any of them, but you do not need to: the ready written email goes to your
                        constituency MSP.
                      </p>
                      <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                        {regionalDrafts.map(({ representative, letter }) => (
                          <li key={`${representative.name}-${representative.email}`} className="border-t border-[var(--rule)] py-3">
                            <p className="ui text-[15px] font-[600] text-[var(--ink)]">{representative.name}</p>
                            <p className="mt-0.5 text-[15px] leading-[1.45] text-[var(--ink-2)]">{representative.party}</p>
                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                              {letter && (
                                <button
                                  type="button"
                                  onClick={() => openDraft(representative, letter, "regional_msp")}
                                  className="text-[15px] font-[560] text-[var(--action-text)] underline underline-offset-[3px]"
                                >
                                  Open ready written email
                                </button>
                              )}
                              <a href={representative.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[15px]">
                                Official profile
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                )}

                <p className="mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                  Your emails use the official figures for {lookup.council.name}: {asOneIn(council.pcts[9])} children
                  growing up in poverty, exactly {council.pcts[9]}% or {council.counts[9].toLocaleString("en-GB")}{" "}
                  children.
                </p>
                <button type="button" onClick={() => goTo("lb-step-topics")} className="btn btn-primary mt-5">
                  Next: what it is about <span aria-hidden="true">↓</span>
                </button>
              </div>
            )}
          </div>
        </StepCard>

        {/* ---------- 2. Topics ---------- */}
        <StepCard n={2} id="lb-step-topics" title="What do you want them to act on?" state={stageOf(1)}>
          <fieldset>
            <legend className="mb-4 max-w-[64ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
              Pick one or more. There is no wrong answer, and things that feel unrelated often are not.
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {LETTER_TOPICS.map((t) => {
                const on = topicIds.includes(t.id);
                return (
                  <label
                    key={t.id}
                    className={`group relative flex cursor-pointer gap-3.5 rounded-[var(--r-m)] border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--brand)] ${
                      on
                        ? "border-[var(--brand)] bg-[var(--brand-wash)]"
                        : "border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--rule-strong)]"
                    }`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggleTopic(t.id)} className="sr-only" />
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] ${
                        on ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-2)] text-[var(--brand)]"
                      }`}
                    >
                      <TopicIcon id={t.id} />
                    </span>
                    <span className="min-w-0 flex-1 pr-7">
                      <span className="ui block text-[16.5px] font-[650] leading-[1.3] text-[var(--ink)]">{t.label}</span>
                      <span className="mt-1 block text-[15px] leading-[1.45] text-[var(--ink-2)]">{t.blurb}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute right-3.5 top-3.5 grid h-6 w-6 place-items-center rounded-full border-2 ${
                        on ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--rule-strong)] text-transparent"
                      }`}
                    >
                      <Tick size={13} />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {topics.length === 0 ? (
            <p className="mt-4 rounded-[var(--r-s)] border-l-[3px] border-[var(--warn)] bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Tick at least one thing above and I will work out who can act on it.
            </p>
          ) : (
            <div className="mt-5 rounded-[var(--r-m)] bg-[var(--surface-2)] p-4 sm:p-5">
              <p className="ui text-[15px] font-[650] text-[var(--ink)]">Who gets asked about what</p>
              <ul className={`mt-3 grid gap-3 ${routing.length === 2 ? "md:grid-cols-2" : ""}`}>
                {routing.map(({ role, theirs }) => (
                  <li key={role} className="rounded-[var(--r-s)] border-l-[3px] border-[var(--brand)] bg-[var(--surface)] px-4 py-3">
                    <p className="ui text-[13.5px] font-[600] text-[var(--brand)]">
                      {role === "MP" ? "Your MP, in London" : "Your MSP, in Edinburgh"}
                    </p>
                    <p className="mt-1 text-[16px] font-[600] leading-[1.4] text-[var(--ink)]">
                      {joinPhrases(theirs.map((t) => t.phrase)).replace(/^./, (c) => c.toUpperCase())}
                    </p>
                  </li>
                ))}
              </ul>
              <details className="mt-3">
                <summary className="ui cursor-pointer text-[15px] font-[600] text-[var(--action-text)]">Why is it split like this?</summary>
                <ul className="mt-2 grid gap-2 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                  {reasons.map((t) => (
                    <li key={t.id}>
                      <strong className="text-[var(--ink)]">{t.label}:</strong> {t.whyWho}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
          {topics.length > 0 && (
            <button type="button" onClick={() => goTo("lb-step-words")} className="btn btn-primary mt-5">
              Next: your own words <span aria-hidden="true">↓</span>
            </button>
          )}
        </StepCard>

        {/* ---------- 3. Your words ---------- */}
        <StepCard n={3} id="lb-step-words" title="Add your own words" optional state={stageOf(2)}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <label htmlFor={`${ids}-name`} className="ui mb-1.5 block text-[15px] font-[600] text-[var(--ink)]">
                Your name
              </label>
              <input
                id={`${ids}-name`}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="So they know who it is from"
                data-clarity-mask="true"
                className={inputCls}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor={`${ids}-message`} className="ui mb-1.5 block text-[15px] font-[600] text-[var(--ink)]">
                Why this matters to you
              </label>
              <textarea
                id={`${ids}-message`}
                value={personal}
                onChange={(event) => setPersonal(event.target.value)}
                placeholder={promptText}
                data-clarity-mask="true"
                rows={5}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
            It is the part only you can write, and it goes first, before any of the asks. A sentence or two is plenty.
            Nothing you type is sent to me or saved.
          </p>
          <button
            type="button"
            onClick={() => {
              setMovedOn(true);
              goTo("lb-step-send");
            }}
            className="btn btn-primary mt-5"
          >
            {personal.trim() ? "Next: read and send" : "Skip this: read and send"} <span aria-hidden="true">↓</span>
          </button>
        </StepCard>

        {/* ---------- 4. Read and send ---------- */}
        <StepCard n={4} id="lb-step-send" title="Read and send" state={stageOf(3)}>
          {!lookup ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--r-m)] bg-[var(--surface-2)] p-5">
              <p className="max-w-[56ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
                Your emails appear here once I know your postcode. I write one to your MP and one to your constituency
                MSP, and each only asks for what that person can do.
              </p>
              <button type="button" onClick={goToPostcode} className="btn btn-primary">
                Enter your postcode <span aria-hidden="true">↑</span>
              </button>
            </div>
          ) : drafts.length === 0 ? (
            <div className="rounded-[var(--r-s)] border-l-[3px] border-[var(--warn)] bg-[var(--surface-2)] px-4 py-3">
              <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                {topics.length === 0 ? (
                  <>
                    <strong>No email is ready yet.</strong> Tick at least one subject in step 2 and I will work out who
                    can act on it.
                  </>
                ) : (
                  <>
                    <strong>I could not prepare this email just now.</strong> Your representative details are incomplete.
                    Try the postcode again in a moment, or use the official profile links to contact them directly.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div data-clarity-mask="true">
              <p className="max-w-[70ch] text-[16px] leading-[1.55] text-[var(--ink-2)]">
                {drafts.length === 2 ? (
                  <>
                    <strong className="text-[var(--ink)]">Two emails are ready.</strong> One to your MP in London and one
                    to your constituency MSP in Edinburgh. Read them, change anything you like, then open each in your
                    email app and press send.
                  </>
                ) : (
                  <>
                    <strong className="text-[var(--ink)]">Your email is ready.</strong> It goes to your{" "}
                    {drafts[0] ? representativeLabel(drafts[0].representative) : "MP"}, because that is who can act on
                    this.
                  </>
                )}
              </p>

              <div className={`mt-5 grid gap-5 ${drafts.length === 2 ? "lg:grid-cols-2" : ""}`}>
                {drafts.map(({ representative, letter }, index) => {
                  const subject = letterSubject(area, topicsForRole(topics, representative.role));
                  return (
                    <article
                      key={representative.role}
                      aria-labelledby={`${ids}-to-${representative.role}`}
                      className="flex min-w-0 flex-col rounded-[var(--r-m)] border border-[var(--rule)] border-t-[4px] border-t-[var(--brand)] bg-[var(--surface)] p-5"
                    >
                      <p className="ui text-[13.5px] font-[600] text-[var(--brand)]">
                        {drafts.length === 2 ? `Email ${index + 1} of 2 · ` : ""}To your {representativeLabel(representative)}
                      </p>
                      <h3 id={`${ids}-to-${representative.role}`} className="mt-1 text-[21px] font-[650] leading-[1.2]">
                        {representative.name}
                      </h3>
                      <p className="mt-1 text-[15px] leading-[1.45] text-[var(--ink-2)]">
                        {representative.party} · {representative.constituency}
                      </p>

                      <dl className="mt-4 grid gap-2 border-y border-[var(--rule)] py-3 text-[15px]">
                        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                          <dt className="ui w-[64px] shrink-0 text-[var(--muted)]">To</dt>
                          <dd className="m-0 min-w-0 flex-1 break-all">
                            {representative.email}{" "}
                            <button
                              type="button"
                              onClick={() => copyText(`address-${representative.role}`, representative.email)}
                              className="ui ml-1 text-[14px] font-[600] text-[var(--action-text)] underline underline-offset-[3px]"
                            >
                              {copied === `address-${representative.role}` ? "Copied" : "Copy address"}
                            </button>
                          </dd>
                        </div>
                        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                          <dt className="ui w-[64px] shrink-0 text-[var(--muted)]">Subject</dt>
                          <dd className="m-0 min-w-0 flex-1 font-[600] text-[var(--ink)]">{subject}</dd>
                        </div>
                      </dl>

                      <div
                        role="region"
                        aria-label={`The email to ${representative.name}`}
                        tabIndex={0}
                        className="mt-3 max-h-[380px] overflow-y-auto rounded-[var(--r-s)] bg-[var(--surface-2)] p-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                      >
                        <pre className="m-0 whitespace-pre-wrap font-sans text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                          {letter}
                        </pre>
                      </div>
                      <p className="ui mt-2 text-[13.5px] text-[var(--muted)]">
                        {letter.split(/\s+/).length} words · scroll to read it all
                      </p>

                      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => openDraft(representative, letter)}
                          className="btn btn-primary justify-center text-center"
                          aria-label={`Open ready to send email to ${representative.name}, your ${representativeLabel(representative)}`}
                        >
                          Open in your email app
                        </button>
                        <button
                          type="button"
                          onClick={() => copyDraft(representative.role, letter)}
                          className="btn btn-ghost justify-center"
                          aria-live="polite"
                        >
                          {copied === `letter-${representative.role}` ? "Copied" : "Copy the email"}
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14.5px] text-[var(--ink-2)]">
                        <a href={representative.profileUrl} target="_blank" rel="noopener noreferrer">
                          Official profile →
                        </a>
                        {representative.phone && <span>{representative.phone}</span>}
                      </div>
                      {representative.officeAddress && (
                        <p className="mt-1 text-[14.5px] leading-[1.5] text-[var(--ink-2)]">{representative.officeAddress}</p>
                      )}
                    </article>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-2 rounded-[var(--r-m)] bg-[var(--surface-2)] p-4 text-[15px] leading-[1.55] text-[var(--ink-2)] sm:p-5">
                <p>
                  <strong className="text-[var(--ink)]">Using Gmail or Outlook in a browser?</strong> The button opens
                  your computer&apos;s email app, which might not be the one you use. Press <em>Copy the email</em> and{" "}
                  <em>Copy address</em> instead, then paste them into a new message.
                </p>
                <p>Add your street address at the bottom if you like. Offices often ask for it to confirm you live there.</p>
              </div>
            </div>
          )}
        </StepCard>
      </div>

      <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.55] text-[var(--ink-2)]">
        Every figure in the email is published on this site. You and your representative can check it on{" "}
        {/*
          Resolved, not the hub. The reader has already told us where they
          live, so sending them to a list of 32 areas to find it again is
          asking them to do work we have already done.
        */}
        <Link href={lookup ? `/areas/${lookup.council.slug}` : "/areas"}>your area&apos;s page</Link>, alongside the
        source.
      </p>

      {/*
        The rest of the local record, once the postcode has resolved.
        Every href names a council or a constituency, so all of them are
        safe to bookmark or send on. None of them carries the postcode.
      */}
      {lookup && (
        <div className="tile mt-6 p-5 sm:p-8">
          <h2 className="display-stat text-[clamp(22px,2.4vw,28px)]">While you are here</h2>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            The figures behind your email, and the rest of what is on the record for your area. These pages are public
            and safe to share.
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {localAreaLinks(lookup).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block h-full rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] p-4 no-underline transition-colors hover:border-[var(--brand)]"
                >
                  <span className="ui block text-[16px] font-[600] leading-[1.35] text-[var(--ink)]">
                    {link.label}
                    <span aria-hidden="true" className="text-[var(--brand)]">
                      {" "}
                      →
                    </span>
                  </span>
                  <span className="mt-1 block text-[15px] leading-[1.45] text-[var(--ink-2)]">{link.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
