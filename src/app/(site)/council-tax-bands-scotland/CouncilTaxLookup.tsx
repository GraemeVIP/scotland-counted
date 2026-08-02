"use client";

import Link from "next/link";
import { useState } from "react";
import {
  chargesFor,
  COUNCIL_TAX_YEAR,
  PREVIOUS_COUNCIL_TAX_YEAR,
  WATER_YEAR,
  type BandCharge,
} from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { bandShares, DWELLINGS_YEAR } from "@/lib/data/dwellings";

/**
 * Postcode to council tax charges.
 *
 * The band itself belongs to the property, not the postcode — only the
 * Scottish Assessors hold that — so this does the half that is actually hard:
 * it finds the council and shows every band's real bill, including the water
 * and waste water charges that appear on the same bill and that almost every
 * online figure leaves out.
 */

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const exact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

type Result = { councilName: string; slug: string; charges: BandCharge[] };

const pct = (n: number) => `${Math.round(n)}%`;
const risePct = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

export default function CouncilTaxLookup() {
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [openBand, setOpenBand] = useState<string | null>(null);

  function show(slug: string, councilName: string) {
    const charges = chargesFor(slug);
    if (!charges) {
      setState("error");
      setMessage("There are no charges listed for that council yet.");
      return;
    }
    setResult({ councilName, slug, charges });
    setState("idle");
  }

  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postcode.trim();
    if (!value) return;
    setState("loading");
    setMessage("");
    setResult(null);
    try {
      const response = await fetch(
        `/api/representatives?postcode=${encodeURIComponent(value)}`,
        { cache: "no-store" }
      );
      const data = (await response.json()) as
        | { council: { name: string; slug: string } }
        | { error?: string };
      if (!response.ok || !("council" in data)) {
        throw new Error("error" in data && data.error ? data.error : "That lookup failed.");
      }
      show(data.council.slug, data.council.name);
    } catch (caught) {
      setState("error");
      setMessage(caught instanceof Error ? caught.message : "That lookup failed.");
    }
  }

  return (
    <div>
      <div className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6">
        <form onSubmit={lookup} className="grid gap-2.5 sm:grid-cols-[minmax(0,320px)_auto] sm:justify-start">
          <label className="sr-only" htmlFor="ct-postcode">
            Your postcode
          </label>
          <input
            id="ct-postcode"
            name="postcode"
            type="text"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value.toUpperCase())}
            placeholder="Your postcode, e.g. G12 8QQ"
            autoComplete="postal-code"
            className="ui min-h-12 w-full rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 text-[16px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--brand)]"
          />
          <button type="submit" disabled={state === "loading"} className="btn btn-primary justify-center whitespace-nowrap">
            {state === "loading" ? "Looking…" : "Show my charges"}
            {state !== "loading" && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <div aria-live="polite">
          {state === "error" && (
            <p className="mt-3 text-[15px] leading-[1.5] text-[var(--bad-text)]">{message}</p>
          )}
        </div>

        <p className="mt-4 text-[14.5px] leading-[1.5] text-[var(--muted)]">
          Or pick your council:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {councils.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => show(c.slug, c.name)}
              className="ui rounded-[var(--r-pill)] border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[14px] font-[620] text-[var(--ink-2)] transition-colors hover:border-[var(--brand)] hover:text-[var(--ink)]"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="h2 mb-2">{result.councilName}</h2>
          <p className="max-w-[62ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
            Every band, with water and waste water included — those are on the same bill and are
            usually missing from figures you find elsewhere.
          </p>

          {(() => {
            const shares = bandShares(result.slug);
            if (!shares) return null;
            const top = [...shares].sort((a, b) => b.share - a.share)[0];
            const lowThree = shares.slice(0, 3).reduce((sum, s) => sum + s.share, 0);
            return (
              <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5 sm:p-6">
                <p className="ui text-[16px] font-[750] mb-1.5">Not sure which band you are?</p>
                <p className="max-w-[62ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                  Most homes here are in the lower bands, so you can usually narrow it to two or
                  three. In {result.councilName},{" "}
                  <strong className="text-[var(--ink)]">{pct(lowThree)} of homes are Band A, B or C</strong>{" "}
                  and the most common single band is <strong className="text-[var(--ink)]">Band {top.band}</strong>.
                </p>

                <div className="mt-5 space-y-2">
                  {shares.map((s) => (
                    <div key={s.band} className="grid grid-cols-[2.5rem_minmax(0,1fr)_3rem] items-center gap-3">
                      <span className="ui text-[14.5px] font-[700] text-[var(--ink-2)]">Band {s.band}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-[var(--paper-3)]">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.max(1, (s.share / Math.max(...shares.map((x) => x.share))) * 100)}%`,
                            background: s.band === top.band ? "var(--brand)" : "var(--rule-strong)",
                          }}
                        />
                      </span>
                      <span className="ui text-right text-[14px] tnum text-[var(--muted)]">{pct(s.share)}</span>
                    </div>
                  ))}
                </div>

                {/* The weakest text on the page was carrying the one link that
                    tells someone how to find their own band. Both fixed. */}
                <p className="mt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
                  Share of homes in each band, {DWELLINGS_YEAR}. For the exact band of one
                  property, look it up free on the{" "}
                  <a href="https://www.saa.gov.uk/" target="_blank" rel="noopener noreferrer">
                    Scottish Assessors
                  </a>{" "}
                  site — they are the only people who hold it.
                </p>
              </div>
            );
          })()}

          <div className="mt-6 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)]">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 border-b border-[var(--rule)] bg-[var(--surface-2)] px-5 py-3">
              <p className="ui text-[14px] font-[750] text-[var(--muted)]">Band</p>
              <p className="ui text-[14px] font-[750] text-[var(--muted)]">Council tax + water</p>
              <p className="ui text-[14px] font-[750] text-[var(--muted)] text-right">A year</p>
            </div>
            {result.charges.map((c) => {
              const open = openBand === c.band;
              return (
                <div key={c.band} className="border-b border-[var(--rule)] last:border-0">
                  <button
                    type="button"
                    onClick={() => setOpenBand(open ? null : c.band)}
                    aria-expanded={open}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 bg-[var(--surface)] px-5 py-4 text-left transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="display-stat w-8 text-[20px] text-[var(--brand)]">{c.band}</span>
                    <span className="ui text-[15px] leading-[1.4] text-[var(--ink-2)]">
                      <span className="block">
                        {pounds.format(c.councilTax)} council tax +{" "}
                        {pounds.format(c.water + c.wasteWater)} water
                      </span>
                      <span className="mt-0.5 block text-[15px] text-[var(--muted)]">
                        Was {exact.format(c.previousCouncilTax)} · up {exact.format(c.councilTaxRise)}
                        {" "}({risePct.format(c.councilTaxRisePct)}%)
                      </span>
                    </span>
                    <span className="display-stat text-[22px] tnum text-[var(--ink)]">
                      {pounds.format(c.total)}
                    </span>
                  </button>
                  {open && (
                    <dl className="grid gap-x-8 gap-y-4 border-t border-[var(--rule)] bg-[var(--paper-2)] px-5 py-4 sm:grid-cols-2 lg:grid-cols-5">
                      {[
                        ["Council tax", c.previousCouncilTax, PREVIOUS_COUNCIL_TAX_YEAR],
                        ["Council tax", c.councilTax, COUNCIL_TAX_YEAR],
                        ["Council-tax rise", c.councilTaxRise, `${risePct.format(c.councilTaxRisePct)}%`],
                        ["Water supply", c.water, WATER_YEAR],
                        ["Waste water", c.wasteWater, WATER_YEAR],
                      ].map(([label, value, year]) => (
                        <div key={`${label}-${year}`}>
                          <dt className="ui text-[15px] font-[700] text-[var(--muted)]">
                            {label as string} · {year as string}
                          </dt>
                          <dd className="text-[17px] font-[680] tnum">{exact.format(value as number)}</dd>
                        </div>
                      ))}
                      <div className="sm:col-span-2 lg:col-span-5">
                        <p className="text-[14.5px] leading-[1.5] text-[var(--ink-2)]">
                          About {exact.format(c.total / 12)} a month, or{" "}
                          {exact.format(c.total / 52)} a week.
                        </p>
                      </div>
                    </dl>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
            <p className="ui text-[15px] font-[720] mb-1.5">Which band is my house?</p>
            <p className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
              The band belongs to the property, not the postcode, and only the Scottish Assessors
              hold it. Look yours up free on the{" "}
              <a href="https://www.saa.gov.uk/" target="_blank" rel="noopener noreferrer">
                Scottish Assessors Association
              </a>{" "}
              site, then find it above. Most flats and smaller homes are Band A to C.
            </p>
            <p className="mt-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              On a low income you may pay less.{" "}
              <strong className="text-[var(--ink)]">Council Tax Reduction</strong> can cut the bill,
              and people who get it can have up to 35% off the water charges too. Single adults
              living alone get 25% off. Apply through your council — it is free.
            </p>
          </div>

          <p className="mt-5 text-[15px] leading-[1.55] text-[var(--muted)]">
            Council tax figures for {PREVIOUS_COUNCIL_TAX_YEAR} and {COUNCIL_TAX_YEAR} are the
            complete official sets for all 32 councils. Water is a separate {WATER_YEAR} charge
            published by Scottish Water.{" "}
            <Link href="/methods">How I source this</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
