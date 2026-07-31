"use client";

import { useMemo, useState } from "react";
import { councils, COUNCIL_YEARS, SCOTLAND_PCTS } from "@/lib/data/councils";

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

export default function LetterBuilder() {
  const [slug, setSlug] = useState("glasgow-city");
  const [picked, setPicked] = useState<string[]>(["lha", "scp"]);
  const [name, setName] = useState("");
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

    return `Dear [name of your MSP or MP],

I am writing as a constituent in ${council.name} about child poverty in this area.

In ${last}, ${council.pcts[9]}% of children in ${council.name} were living in relative poverty after housing costs. That is ${council.counts[9].toLocaleString("en-GB")} children, and ${direction}. The Scottish figure for the same year was ${SCOTLAND_PCTS[9]}%. These are the End Child Poverty and Loughborough University estimates, drawn from HMRC and DWP administrative data.

I am also aware that all four of the statutory interim child poverty targets set out in the Child Poverty (Scotland) Act 2017 were missed for 2023/24, including persistent poverty at 23% against a target of 8%.

${asks.length ? `I would like to know whether you support the following:\n\n${asks.map((a) => `- That the government should ${a.line}.`).join("\n")}` : ""}

Independent modelling by the Joseph Rowntree Foundation, IPPR Scotland and the Fraser of Allander Institute all reach the same conclusion: income transfers reduce child poverty, and employment programmes alone do not.

Could you tell me:

1. Which of the measures above you support, and what you have done to advance them?
2. What you expect the child poverty rate in ${council.name} to be in five years' time, and on what basis?

I would be grateful for a substantive reply rather than a general statement of concern.

Yours sincerely,
${name || "[your name]"}
[your address, so they can confirm you are a constituent]`;
  }, [council, picked, name, first, last]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  const mailto = `mailto:?subject=${encodeURIComponent(
    `Child poverty in ${council.name}`
  )}&body=${encodeURIComponent(letter)}`;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr] items-start">
      {/* ---------- Controls ---------- */}
      <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-5 sm:p-6 lg:sticky lg:top-[74px]">
        <h2 className="text-[17px] font-[620] mb-4">Build your letter</h2>

        <label className="block mb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-[var(--muted)] block mb-1.5">
            1. Where do you live?
          </span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-[var(--ground)] border border-[var(--baseline)] rounded-[3px] px-3 py-2.5 text-[15px]"
          >
            {councils.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mb-4">
          <legend className="font-mono text-[11px] uppercase tracking-[0.07em] text-[var(--muted)] mb-2">
            2. What are you asking for?
          </legend>
          <div className="space-y-2.5">
            {ASKS.map((a) => (
              <label key={a.id} className="flex gap-2.5 items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={picked.includes(a.id)}
                  onChange={(e) =>
                    setPicked((p) =>
                      e.target.checked ? [...p, a.id] : p.filter((x) => x !== a.id)
                    )
                  }
                  className="mt-1 accent-[var(--glasgow)] w-4 h-4 shrink-0"
                />
                <span className="text-[14.5px] leading-[1.4]">
                  {a.label}
                  <span className="text-[var(--muted)] font-mono text-[11px] block">
                    decided by your {a.who}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block mb-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-[var(--muted)] block mb-1.5">
            3. Your name (optional)
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Left blank if you prefer"
            className="w-full bg-[var(--ground)] border border-[var(--baseline)] rounded-[3px] px-3 py-2.5 text-[15px]"
          />
        </label>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={copy}
            className="flex-1 min-w-[140px] bg-[var(--glasgow)] text-white px-4 py-3 rounded-[3px] font-[580] text-[15px] hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied" : "Copy letter"}
          </button>
          <a
            href={mailto}
            className="flex-1 min-w-[140px] text-center border border-[var(--baseline)] px-4 py-3 rounded-[3px] font-[580] text-[15px] hover:border-[var(--ink)] transition-colors"
          >
            Open in email
          </a>
        </div>

        <p className="mt-4 text-[13.5px] text-[var(--ink-2)] leading-[1.5]">
          Find your representatives at{" "}
          <a
            href="https://www.writetothem.com"
            className="underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
            target="_blank"
            rel="noopener noreferrer"
          >
            writetothem.com
          </a>
          . Nothing you type here is sent anywhere or stored — the letter is built in your browser.
        </p>
      </div>

      {/* ---------- Preview ---------- */}
      <div>
        <div className="flex items-baseline justify-between gap-4 mb-2.5">
          <p className="eyebrow">Your letter</p>
          <p className="font-mono text-[11px] text-[var(--muted)]">
            {letter.split(/\s+/).length} words
          </p>
        </div>
        <pre className="bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-5 sm:p-6 text-[14.5px] leading-[1.6] whitespace-pre-wrap font-sans text-[var(--ink-2)] overflow-x-auto">
          {letter}
        </pre>
      </div>
    </div>
  );
}
