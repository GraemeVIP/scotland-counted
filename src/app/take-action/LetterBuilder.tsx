"use client";

import { useMemo, useState } from "react";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";

/**
 * The letter tool. Everything happens in the browser: the letter is
 * assembled from the reader's choices and the published figures for
 * their council area, and nothing they type is sent or stored anywhere.
 * The postcode is used for one thing only — opening WriteToThem's
 * lookup so they can find who represents them.
 */

const ASKS = [
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
  },
];

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="figure-num text-[22px] text-[var(--action)]" aria-hidden="true">
        {n}
      </span>
      <span className="ui text-[12px] uppercase tracking-[0.1em] font-[680] text-[var(--ink)]">
        {children}
      </span>
    </div>
  );
}

const inputCls =
  "ui w-full bg-[var(--paper)] border border-[var(--rule-strong)] px-3.5 py-3 text-[15px] focus:border-[var(--brand)] outline-none transition-colors";

export default function LetterBuilder() {
  const [slug, setSlug] = useState("glasgow-city");
  const [picked, setPicked] = useState<string[]>(["lha", "scp"]);
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [personal, setPersonal] = useState("");
  const [copied, setCopied] = useState(false);

  const council = councils.find((c) => c.slug === slug)!;
  const last = COUNCIL_YEARS[9];
  const first = COUNCIL_YEARS[0];

  const letter = useMemo(() => {
    const asks = ASKS.filter((a) => picked.includes(a.id));
    const direction =
      council.change > 0
        ? `an increase of ${council.change} percentage points since ${first}`
        : `a fall of ${Math.abs(council.change)} percentage points since ${first}`;
    const personalPara = personal.trim()
      ? `\n${personal.trim()}\n`
      : "";

    return `Dear [name of your MSP or MP],

I am writing as a constituent in ${council.name} about child poverty in this area.

In ${last}, ${council.pcts[9]}% of children in ${council.name} were living in relative poverty after housing costs. That is ${council.counts[9].toLocaleString("en-GB")} children, and ${direction}. The Scottish figure for the same year was ${SCOTLAND_PCTS[9]}%. These are the End Child Poverty and Loughborough University estimates, drawn from HMRC and DWP administrative data.

I am also aware that all four of the statutory interim child poverty targets set out in the Child Poverty (Scotland) Act 2017 were missed for 2023/24, including persistent poverty at 23% against a target of 8%.
${personalPara}
${asks.length ? `I would like to know whether you support the following:\n\n${asks.map((a) => `- That the government should ${a.line}.`).join("\n")}\n\n` : ""}Independent modelling by the Joseph Rowntree Foundation, IPPR Scotland and the Fraser of Allander Institute all reach the same conclusion: income transfers reduce child poverty, and employment programmes alone do not.

Could you tell me:

1. Which of the measures above you support, and what you have done to advance them?
2. What you expect the child poverty rate in ${council.name} to be in five years' time, and on what basis?

I would be grateful for a substantive reply rather than a general statement of concern.

Yours sincerely,
${name.trim() || "[your name]"}
[your address, so they can confirm you are a constituent]`;
  }, [council, picked, name, personal, first, last]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 3200);
    } catch {
      setCopied(false);
    }
  }

  const mailto = `mailto:?subject=${encodeURIComponent(
    `Child poverty in ${council.name} — a constituent's question`
  )}&body=${encodeURIComponent(letter)}`;

  const wtt = `https://www.writetothem.com/${
    postcode.trim() ? `?pc=${encodeURIComponent(postcode.trim())}` : ""
  }`;

  return (
    <div className="mt-10 grid gap-7 lg:grid-cols-[400px_1fr] items-start">
      {/* ================= Controls ================= */}
      <div
        className="bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 lg:sticky lg:top-[84px]"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <div className="mb-7">
          <StepLabel n={1}>Where do you live?</StepLabel>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            aria-label="Your council area"
          >
            {councils.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-[13.5px] text-[var(--ink-2)] leading-[1.5] mt-2.5">
            The letter fills in the official figures for {council.name} automatically —{" "}
            <strong className="tnum">{council.pcts[9]}%</strong> of children,{" "}
            <strong className="tnum">{council.counts[9].toLocaleString("en-GB")}</strong> children
            in {last}.
          </p>
        </div>

        <fieldset className="mb-7">
          <legend>
            <StepLabel n={2}>What are you asking for?</StepLabel>
          </legend>
          <div className="space-y-3">
            {ASKS.map((a) => (
              <label key={a.id} className="flex gap-3 items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={picked.includes(a.id)}
                  onChange={(e) =>
                    setPicked((p) =>
                      e.target.checked ? [...p, a.id] : p.filter((x) => x !== a.id)
                    )
                  }
                  className="mt-1 accent-[var(--brand)] w-4 h-4 shrink-0"
                />
                <span className="text-[14.5px] leading-[1.4] group-hover:text-[var(--brand)] transition-colors">
                  {a.label}
                  <span className="ui text-[10.5px] uppercase tracking-[0.08em] font-[620] text-[var(--muted)] block mt-0.5">
                    decided by your {a.who}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-7">
          <StepLabel n={3}>Your details</StepLabel>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              aria-label="Your name, optional"
              className={inputCls}
            />
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Your postcode, e.g. G1 1AA (optional)"
              aria-label="Your postcode, optional — used only to look up your representatives"
              className={inputCls}
              autoComplete="postal-code"
            />
            <textarea
              value={personal}
              onChange={(e) => setPersonal(e.target.value)}
              placeholder="Add one sentence of your own (optional). Personal letters get better replies — a line about your street, your school, your work."
              aria-label="A personal sentence for the letter, optional"
              rows={3}
              className={`${inputCls} resize-y font-serif`}
            />
          </div>
          <p className="text-[12.5px] text-[var(--muted)] leading-[1.5] mt-2.5">
            Nothing you type leaves your browser. The postcode is used once, to open the lookup in
            step 4.
          </p>
        </div>

        <div>
          <StepLabel n={4}>Send it</StepLabel>
          <div className="grid gap-2.5">
            <button
              type="button"
              onClick={copy}
              className="btn btn-primary w-full justify-center"
              aria-live="polite"
            >
              {copied ? "Copied — now paste it into an email" : "Copy the letter"}
            </button>
            <a
              href={wtt}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full justify-center"
            >
              Find who represents you →
            </a>
            <a href={mailto} className="btn btn-ghost w-full justify-center">
              Or open in your email app
            </a>
          </div>
          <p className="text-[12.5px] text-[var(--muted)] leading-[1.5] mt-3">
            The lookup is WriteToThem, run by the charity mySociety. Paste the letter into the
            message box it gives you, add your address, and send.
          </p>
        </div>
      </div>

      {/* ================= The letter ================= */}
      <div>
        <div className="flex items-baseline justify-between gap-4 mb-2.5">
          <p className="label">Your letter — updates as you choose</p>
          <p className="datum text-[11.5px] text-[var(--muted)]">
            {letter.split(/\s+/).length} words
          </p>
        </div>
        <div
          className="bg-[var(--surface)] border border-[var(--rule)] border-t-[3px] border-t-[var(--brand)] p-6 sm:p-10"
          style={{ boxShadow: "var(--shadow-2)" }}
        >
          <pre className="text-[15.5px] leading-[1.7] whitespace-pre-wrap font-serif text-[var(--ink-2)] overflow-x-auto m-0">
            {letter}
          </pre>
        </div>
        <p className="text-[13.5px] text-[var(--ink-2)] leading-[1.55] mt-4 max-w-[64ch]">
          Every figure in the letter is from the published data on this site, so your MSP or MP can
          check it — and so can you: <a href="/areas" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:decoration-[var(--brand)]">your area&apos;s page</a> shows
          the same numbers with their sources.
        </p>
      </div>
    </div>
  );
}
