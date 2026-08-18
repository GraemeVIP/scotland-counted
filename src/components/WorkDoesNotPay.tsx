import Link from "next/link";
import { ExplainText } from "@/components/Glossary";
import {
  minimumWage,
  minimumWageTakeHome,
  glasgowRent,
  rentShareOfTakeHome,
  minimumIncomeStandard,
  costsThenAndNow,
  councilTax,
  energyMonthly,
  universalCredit,
  benefitsComparison as bc,
} from "@/lib/data/livingCosts";

/**
 * What full-time minimum wage actually leaves you with in Glasgow, and the
 * "better off on benefits" question answered with the rules.
 *
 * The second half is the delicate one. The honest finding is that Universal
 * Credit tapers at 55p in the pound, so working always raises total income, 
 * there is no threshold at which someone is better off refusing a job. We say
 * that plainly, and we do not speculate about anyone's motives or suggest that
 * people claiming for a health condition are doing so dishonestly. The serious
 * version of the complaint survives anyway, and it is more damning: the reward
 * for working is 45p in the pound, which is why it so often does not feel
 * worth it.
 */

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function WorkDoesNotPay({ className = "" }: { className?: string }) {
  const rentPct = Math.round(rentShareOfTakeHome * 100);
  const leftOver =
    minimumWageTakeHome.monthly - glasgowRent.monthly - councilTax.monthly - energyMonthly;

  return (
    <section className={className} aria-labelledby="work-does-not-pay">
      <ExplainText>
      <p className="kicker mb-3 text-[var(--action)]">The maths people actually live</p>
      <h2 id="work-does-not-pay" className="display-stat text-[clamp(30px,3.6vw,46px)] max-w-[18ch]">
        Full-time work at the minimum does not cover Glasgow
      </h2>
      <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.6] text-[var(--ink-2)]">
        Waiting tables, cleaning, bar work, care work, shop work. This is what the legal minimum
        adds up to against what it costs to live here.
      </p>

      {/* ---- The budget, line by line ---- */}
      <div className="mt-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]" style={{ boxShadow: "var(--shadow-2)" }}>
        <div className="border-b border-[var(--rule)] bg-[var(--surface-2)] px-6 py-4">
          <p className="ui text-[15px] font-[750]">
            One adult, working 37.5 hours a week on the legal minimum, renting a one-bedroom flat
            in Glasgow
          </p>
        </div>
        <dl className="divide-y divide-[var(--rule)]">
          {[
            { label: "Take-home pay", sub: `${pounds.format(minimumWage.annualGross)} gross, less ${pounds.format(minimumWageTakeHome.tax)} tax and ${pounds.format(minimumWageTakeHome.ni)} National Insurance`, value: minimumWageTakeHome.monthly, kind: "in" },
            { label: "Universal Credit", sub: "Nothing is payable. With no children and no health condition there is no work allowance, so the 55p taper wipes out the £425 allowance", value: 0, kind: "in" },
            { label: "Rent", sub: `${glasgowRent.area} average, ${glasgowRent.size}`, value: -glasgowRent.monthly, kind: "out" },
            { label: "Council tax and water", sub: `Band A · ${pounds.format(councilTax.councilTax2026)} council tax and ${pounds.format(councilTax.waterCombined)} water a year`, value: -councilTax.monthly, kind: "out" },
            { label: "Gas and electricity", sub: "Ofgem cap for a typical home, from 1 July 2026", value: -energyMonthly, kind: "out" },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 px-6 py-4">
              <div>
                <dt className="ui text-[16.5px] font-[700] text-[var(--ink)]">{row.label}</dt>
                <dd className="mt-1 text-[14.5px] leading-[1.45] text-[var(--muted)]">{row.sub}</dd>
              </div>
              <dd
                className="display-stat text-[22px] tnum"
                style={{ color: row.kind === "out" ? "var(--bad)" : "var(--ink)" }}
              >
                {row.value === 0 ? "£0" : (row.value < 0 ? "−" : "") + pounds.format(Math.abs(row.value))}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 bg-[var(--brand-wash)] px-6 py-5">
            <dt className="ui text-[18px] font-[790]">Left for everything else</dt>
            <dd className="display-stat text-[clamp(28px,3vw,36px)] text-[var(--brand)] tnum">
              {pounds.format(leftOver)}
            </dd>
          </div>
        </dl>
        <p className="border-t border-[var(--rule)] px-6 py-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
          That {pounds.format(leftOver)} covers food, travel, phone, clothes, toiletries, haircuts,
          school things, a birthday, and anything that breaks. Rent alone is {rentPct}% of
          take-home, against the 30% usually called affordable.
        </p>
      </div>

      {/* ---- What the bills have done ---- */}
      <div className="mt-10">
        <h3 className="h3 mb-3">Why it is tighter than it used to be</h3>
        <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
          Wages are only half of it. The other half is what the same bills now cost.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {costsThenAndNow.map((c) => (
            <div
              key={c.what}
              className="rounded-[var(--r-m)] border border-[var(--rule)] border-l-[5px] border-l-[var(--bad)] bg-[var(--surface)] p-6"
            >
              <p className="kicker text-[var(--muted)]">{c.what}</p>
              <p className="display-stat mt-2 text-[clamp(28px,3vw,38px)] text-[var(--bad)]">
                {c.change}
              </p>
              <p className="mt-2 text-[16px] leading-[1.5] font-[620]">{c.against}</p>
              <p className="mt-3 border-t border-[var(--rule)] pt-3 text-[14.5px] leading-[1.5] text-[var(--muted)]">
                <span className="font-[700] text-[var(--ink-2)]">{c.now}</span> · {c.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- The rigorous version ---- */}
      <div className="mt-9">
        <h3 className="h3 mb-3">Someone has already done this properly</h3>
        <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
          Loughborough University prices up what the public agrees a household needs for a decent
          life: rent, food, energy, travel, a birthday present. Against that benchmark, full-time
          work at the legal minimum falls short:
        </p>
        <div className="mt-6 space-y-3">
          {minimumIncomeStandard.map((m) => (
            <div
              key={m.household}
              className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="ui text-[16.5px] font-[700]">{m.household}</p>
                <p className="display-stat text-[26px] text-[var(--bad)] tnum">{m.covers}%</p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--paper-3)]">
                <span
                  className="block h-full rounded-full bg-[var(--bad)]"
                  style={{ width: `${m.covers}%` }}
                />
              </div>
              <p className="mt-2.5 text-[15px] leading-[1.5] text-[var(--ink-2)]">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Better off on benefits? ---- */}
      <div
        className="mt-10 rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-[var(--deep-ink)] sm:p-9"
        style={{ boxShadow: "var(--shadow-2)" }}
      >
        <p className="kicker mb-3 text-[var(--action)]">The question everyone asks</p>
        <h3 className="text-[clamp(24px,2.8vw,34px)] font-[780] leading-[1.18] max-w-[24ch]">
          Are people better off on benefits than working?
        </h3>
        <p className="mt-4 max-w-[62ch] text-[18px] leading-[1.6] opacity-90">
          No, and the reason is in the rules rather than in anyone&apos;s opinion. Universal
          Credit does not stop when you start working. It goes down by{" "}
          <strong>{bc.taperPence}p for every £1 you earn</strong>, so you keep {bc.keptPence}p of
          every pound. Earning more always leaves you with more.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-5 py-5">
            <p className="ui text-[14.5px] font-[700] opacity-75">
              Not working, single, 25 or over, with the highest health element
            </p>
            <p className="display-stat mt-2 text-[30px]">
              {pounds.format(bc.outOfWorkMaxAnnual)}
            </p>
            <p className="mt-2 text-[14.5px] leading-[1.45] opacity-75">
              A year, plus help with rent. Universal Credit is not taxed, so this compares
              like with like.
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-5 py-5">
            <p className="ui text-[14.5px] font-[700] opacity-75">
              Working full time on the legal minimum
            </p>
            <p className="display-stat mt-2 text-[30px]">
              {pounds.format(minimumWageTakeHome.annual)}
            </p>
            <p className="mt-2 text-[14.5px] leading-[1.45] opacity-75">
              A year after tax, and Universal Credit can still be paid on top
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          {universalCredit.scenarios.map((sc) => (
            <div key={sc.who} className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.05] px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <p className="ui text-[16px] font-[720]">{sc.who}</p>
                <p className="display-stat text-[24px] tnum">
                  {pounds.format(sc.award)}<span className="text-[15px] font-[600] opacity-70"> a month</span>
                </p>
              </div>
              <p className="mt-2 text-[15px] leading-[1.5] opacity-80">{sc.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.6]">
          <strong>The real problem is not that work pays less. It is that it pays so little
          more.</strong>{" "}
          Above the work allowance you keep {bc.keptPence}p in the pound. Do a full extra day and
          most of it goes back. That is why the effort so often does not feel worth it, and it is
          a decision someone made, not a law of nature.
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] opacity-75">
          I do not publish claims about why individuals are out of work. Health assessments are
          decided by the DWP, and I have no data on anyone&apos;s honesty.
        </p>
        <Link
          href="/email-your-mp-and-msp"
          className="btn btn-primary mt-6"
        >
          Ask your MP about the taper
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      </ExplainText>
    </section>
  );
}
