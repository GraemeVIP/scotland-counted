"use client";

import { useState } from "react";
import { calculateLbtt, LBTT_DATA, type BuyerType } from "@/lib/lbtt/engine";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const PRESETS = [150_000, 200_000, 250_000, 325_000, 400_000, 500_000];

const BUYER_OPTIONS: Array<{ id: BuyerType; label: string; hint: string }> = [
  { id: "standard", label: "Moving home", hint: "0% up to £145,000" },
  { id: "first-time", label: "First-time buyer", hint: "0% up to £175,000 (saves up to £600)" },
  { id: "additional", label: "Second home / buy-to-let", hint: "+8% ADS on full price (£40k+)" },
];

export default function LbttCalculator() {
  const [priceInput, setPriceInput] = useState("250000");
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");

  const parsed = Number(priceInput.replace(/[^0-9.]/g, ""));
  const result = calculateLbtt(Number.isFinite(parsed) ? parsed : 0, buyerType);

  return (
    <section
      className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-8"
      aria-label="LBTT calculator Scotland"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start">
        <div>
          <label htmlFor="lbtt-price" className="ui block text-[15px] font-[600] text-[var(--ink)]">
            Property purchase price (£)
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="lbtt-price"
              type="text"
              inputMode="numeric"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="250000"
              className="ui min-h-12 w-full max-w-[280px] rounded-[var(--r-s)] border border-[var(--rule-strong)] bg-[var(--paper)] px-4 text-[18px] font-[600] tnum text-[var(--ink)] outline-none focus:border-[var(--brand)]"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPriceInput(String(preset))}
                className={`ui cursor-pointer rounded-full border px-3 py-1 text-[13.5px] font-[560] tnum transition-colors ${
                  result.price === preset
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-2)] hover:border-[var(--brand)]"
                }`}
              >
                {money.format(preset)}
              </button>
            ))}
          </div>

          <fieldset className="mt-6">
            <legend className="ui text-[15px] font-[600] text-[var(--ink)]">Buyer type</legend>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              {BUYER_OPTIONS.map((opt) => {
                const active = buyerType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBuyerType(opt.id)}
                    aria-pressed={active}
                    className={`ui cursor-pointer rounded-[var(--r-s)] border-2 p-3.5 text-left transition-colors ${
                      active
                        ? "border-[var(--brand)] bg-[var(--surface-2)]"
                        : "border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--brand)]"
                    }`}
                  >
                    <span className="block text-[15px] font-[620] text-[var(--ink)]">{opt.label}</span>
                    <span className="mt-1 block text-[13px] leading-[1.35] text-[var(--muted)]">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[400px] text-[14.5px]">
              <thead>
                <tr className="border-b border-[var(--rule)] text-left text-[var(--muted)]">
                  <th className="py-2.5 pr-4 font-[560]">Band</th>
                  <th className="py-2.5 px-3 text-right font-[560]">Rate</th>
                  <th className="py-2.5 px-3 text-right font-[560]">Taxable slice</th>
                  <th className="py-2.5 pl-3 text-right font-[560]">Tax due</th>
                </tr>
              </thead>
              <tbody>
                {result.bands.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--rule)]">
                    <td className="py-2.5 pr-4 text-[var(--ink)]">{row.label}</td>
                    <td className="py-2.5 px-3 text-right tnum text-[var(--ink-2)]">{Math.round(row.rate * 100)}%</td>
                    <td className="py-2.5 px-3 text-right tnum text-[var(--ink-2)]">{money.format(row.taxable)}</td>
                    <td className="py-2.5 pl-3 text-right font-[600] tnum text-[var(--ink)]">{money.format(row.tax)}</td>
                  </tr>
                ))}
                {buyerType === "additional" && (
                  <tr className="border-b border-[var(--rule)] bg-[var(--surface-2)]">
                    <td className="py-2.5 pr-4 font-[580] text-[var(--ink)]">
                      Additional Dwelling Supplement (ADS)
                    </td>
                    <td className="py-2.5 px-3 text-right font-[580] tnum">
                      {result.price >= LBTT_DATA.adsThreshold ? "8%" : "0%"}
                    </td>
                    <td className="py-2.5 px-3 text-right tnum">
                      {result.price >= LBTT_DATA.adsThreshold ? money.format(result.price) : "Under £40,000"}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-[620] tnum text-[var(--bad-text)]">
                      {money.format(result.adsTax)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-[var(--deep-ink)]">
          <p className="kicker text-[var(--hero-muted)]">Estimated LBTT to pay</p>
          <p className="display-stat mt-2 text-[clamp(38px,5vw,56px)] tnum text-white">
            {money.format(result.totalTax)}
          </p>
          <p className="mt-2 text-[15px] text-[var(--hero-muted)]">
            Effective tax rate: <strong className="text-white tnum">{(result.effectiveRate * 100).toFixed(2)}%</strong> of{" "}
            {money.format(result.price)}
          </p>

          <dl className="mt-5 space-y-2.5 border-t border-white/15 pt-4 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--hero-muted)]">Standard LBTT</dt>
              <dd className="m-0 font-[600] tnum text-white">{money.format(result.baseTax)}</dd>
            </div>
            {buyerType === "first-time" && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--hero-muted)]">First-time buyer saving</dt>
                <dd className="m-0 font-[600] tnum text-white">{money.format(result.ftbSaving)}</dd>
              </div>
            )}
            {buyerType === "additional" && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--hero-muted)]">ADS supplement (8%)</dt>
                <dd className="m-0 font-[600] tnum text-white">{money.format(result.adsTax)}</dd>
              </div>
            )}
          </dl>

          <p className="mt-5 border-t border-white/15 pt-4 text-[13.5px] leading-[1.5] text-[var(--hero-muted)]">
            Calculated in your browser using Revenue Scotland residential LBTT bands and the 8% ADS rate
            effective from {LBTT_DATA.adsEffectiveFrom}.
          </p>
        </aside>
      </div>
    </section>
  );
}
