"use client";

import { useState } from "react";
import Link from "@/components/IntentLink";

type PotId = "perks-1yr" | "extras-1yr";

const POTS: {
  id: PotId;
  badge: string;
  label: string;
  amount: number;
  amountDisplay: string;
  sub: string;
  shareClaim: string;
}[] = [
  {
    id: "perks-1yr",
    badge: "Everything · 1 year",
    label: "Second homes, travel, leaflets, PR and papers",
    amount: 6_650_199,
    amountDisplay: "£6,650,199",
    sub: "One year of second homes, hotels, flights, taxis, leaflets, PR firms and papers for Scotland's 186 MPs and MSPs. Staff pay and local office rent are left out.",
    shareClaim:
      "Scotland's 186 MPs and MSPs spent £6.65 million in a single year on second homes, hotels, flights, leaflets, PR firms and papers (leaving out staff wages and local offices). That is more than Glasgow, Edinburgh and Dundee spent on emergency Crisis Grants all year combined (£6.41m).",
  },
  {
    id: "extras-1yr",
    badge: "Extras only · 1 year",
    label: "No flats, no rent, no MP or MSP travel",
    amount: 2_812_948,
    amountDisplay: "£2,812,948",
    sub: "Leave out their flats and their own flights, trains and car miles. This is what is left: leaflets, calendars, PR firms, second home council tax, family trips, staff hotels, taxis and papers.",
    shareClaim:
      "Even leaving out their offices, staff, flats and own travel, Scotland's MPs and MSPs still spent £2.81 million in one year on leaflets, PR firms, second home council tax, family flights, taxis, papers and TV licences: enough for 88 new NHS Scotland nurses or 21,638 emergency Crisis Grants.",
  },
];

type BenchmarkItem = {
  id: string;
  title: string;
  unitCost: number;
  unitLabel: string;
  formatCount: (count: number) => string;
  detail: (count: number, potId: PotId) => string;
  href: string;
  linkLabel: string;
  hot?: boolean;
};

const BENCHMARKS: BenchmarkItem[] = [
  {
    id: "crisis-grants",
    title: "Crisis Grants: emergency cash for food or heating",
    unitCost: 130,
    unitLabel: "£130 Scotland-wide average award (2025/26)",
    formatCount: (n) => `${n.toLocaleString("en-GB")} Crisis Grants`,
    detail: (_n, potId) =>
      potId === "perks-1yr"
        ? "That is how many awards it pays at the £130 average across all 32 councils."
        : "At that average, enough to pay all 15,250 Crisis Grant claims Glasgow turned down last year (£1.98m), with £830,000 left over.",
    href: "/crisis-grant-scotland",
    linkLabel: "Crisis Grant figures →",
    hot: true,
  },
  {
    id: "nhs-nurses",
    title: "New NHS Scotland nurses for a year",
    unitCost: 32_073,
    unitLabel: "£32,073 starting pay for a newly qualified nurse",
    formatCount: (n) => `${n.toLocaleString("en-GB")} NHS nurses`,
    detail: (n) => `Pays a full year's starting salary for ${n.toLocaleString("en-GB")} newly qualified ward nurses.`,
    href: "/average-salary-scotland",
    linkLabel: "Compare Scottish pay →",
    hot: true,
  },
  {
    id: "warm-home",
    title: "Warm Home Discounts for low income homes",
    unitCost: 150,
    unitLabel: "£150 off one home's winter electricity bill",
    formatCount: (n) => `${n.toLocaleString("en-GB")} homes helped`,
    detail: (n) =>
      `Takes £150 off the winter electricity bill for ${n.toLocaleString("en-GB")} pensioners and low income homes.`,
    href: "/warm-home-discount-scotland",
    linkLabel: "Warm Home Discount guide →",
  },
  {
    id: "school-meals",
    title: "Hot school lunches",
    unitCost: 2.6,
    unitLabel: "£2.60 typical council school meal price",
    formatCount: (n) =>
      n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}m school meals` : `${n.toLocaleString("en-GB")} school meals`,
    detail: (n) =>
      `Buys ${n.toLocaleString("en-GB")} hot school lunches for older pupils who do not get free school meals.`,
    href: "/blog/free-school-meals-clothing-grant-scotland",
    linkLabel: "Free school meals in Scotland →",
  },
];

export default function ExpensesWhatItBuys() {
  const [potId, setPotId] = useState<PotId>("perks-1yr");
  const [copied, setCopied] = useState(false);

  const pot = POTS.find((p) => p.id === potId) ?? POTS[0];

  function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const url = "https://scotlandcounted.org.uk/blog/scottish-mp-msp-expenses-what-it-could-buy";
    navigator.clipboard.writeText(`${pot.shareClaim}\n\nFull receipts: ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  }

  return (
    <section
      aria-label="What Scottish politicians' expenses could buy instead"
      className="not-prose my-9 rounded-[var(--r-m)] border-2 border-[var(--ink)] bg-[var(--surface)] p-5 sm:p-7"
      style={{ boxShadow: "var(--shadow-2)" }}
    >
      <div className="border-b border-[var(--rule)] pb-5">
        <p className="ui text-[13px] font-[700] uppercase tracking-[0.07em] text-[var(--bad-text)]">
          Calculator · Tap a pot of money
        </p>
        <h3 className="mt-1 text-[22px] font-[700] leading-[1.2] text-[var(--ink)] sm:text-[26px]">
          What that money could have paid for instead
        </h3>
      </div>

      {/* Step 1: Pot switcher */}
      <div
        role="tablist"
        aria-label="Choose which pot of expenses to convert"
        className="mt-5 grid gap-2.5 sm:grid-cols-2"
      >
        {POTS.map((p) => {
          const active = p.id === pot.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setPotId(p.id)}
              className={`rounded-[var(--r-s)] border px-4 py-3.5 text-left transition-colors ${
                active
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                  : "border-[var(--rule-strong)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--ink)]"
              }`}
            >
              <span
                className={`ui block text-[12.5px] font-[680] uppercase tracking-[0.05em] ${
                  active ? "text-[#f5b53d]" : "text-[var(--muted)]"
                }`}
              >
                {p.badge}
              </span>
              <span className="figure-num tnum mt-1 block text-[26px] leading-none">{p.amountDisplay}</span>
              <span
                className={`ui mt-1 block text-[14px] font-[580] ${
                  active ? "text-[var(--paper)]/85" : "text-[var(--ink-2)]"
                }`}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="ui mt-4 rounded-[var(--r-s)] bg-[var(--surface-2)] px-4 py-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
        {pot.sub}
      </p>

      {/* The four best real Scottish equivalents */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {BENCHMARKS.map((b) => {
          const count = Math.round(pot.amount / b.unitCost);
          return (
            <div
              key={b.id}
              className={`tile flex flex-col justify-between p-5 ${
                b.hot ? "border-t-[3px] border-t-[var(--bad)]" : ""
              }`}
            >
              <div>
                <p
                  className={`figure-num tnum text-[clamp(28px,3.2vw,36px)] leading-none ${
                    b.hot ? "text-[var(--bad-text)]" : "text-[var(--ink)]"
                  }`}
                >
                  {b.formatCount(count)}
                </p>
                <p className="ui mt-1.5 text-[16px] font-[650] leading-[1.35] text-[var(--ink)]">{b.title}</p>
                <p className="ui mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">{b.detail(count, pot.id)}</p>
              </div>
              <div className="mt-3.5 flex flex-col gap-1 border-t border-[var(--rule)] pt-2.5 text-[13.5px]">
                <span className="ui text-[var(--muted)]">{b.unitLabel}</span>
                <Link
                  href={b.href}
                  className="ui font-[620] text-[var(--action-text)] no-underline hover:underline"
                >
                  {b.linkLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={handleCopy} className="btn btn-ghost mt-5 text-[14px]">
        {copied ? "Copied to clipboard" : "Copy this for X or WhatsApp"}
      </button>
    </section>
  );
}
