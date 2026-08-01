import Link from "next/link";
import {
  minimumWage,
  glasgowRent,
  rentShareOfGross,
  minimumIncomeStandard,
  benefitsComparison as bc,
} from "@/lib/data/livingCosts";

/**
 * What full-time minimum wage actually leaves you with in Glasgow, and the
 * "better off on benefits" question answered with the rules.
 *
 * The second half is the delicate one. The honest finding is that Universal
 * Credit tapers at 55p in the pound, so working always raises total income —
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
  const rentPct = Math.round(rentShareOfGross * 100);
  const leftOver = minimumWage.monthlyGross - glasgowRent.monthly;

  return (
    <section className={className} aria-labelledby="work-does-not-pay">
      <p className="kicker mb-3 text-[var(--action)]">The maths people actually live</p>
      <h2 id="work-does-not-pay" className="display-stat text-[clamp(30px,3.6vw,46px)] max-w-[18ch]">
        Full-time work at the minimum does not cover Glasgow
      </h2>
      <p className="mt-5 max-w-[62ch] text-[18px] leading-[1.6] text-[var(--ink-2)]">
        Waiting tables, cleaning, bar work, care work, shop work. This is what the legal minimum
        adds up to against what it costs to live here.
      </p>

      {/* ---- The squeeze ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Full-time on the legal minimum",
            value: pounds.format(minimumWage.monthlyGross),
            note: `A month before tax · ${pounds.format(minimumWage.annualGross)} a year`,
            tone: "ink",
          },
          {
            label: `Rent on a ${glasgowRent.size} in ${glasgowRent.area}`,
            value: pounds.format(glasgowRent.monthly),
            note: `A month · ${pounds.format(glasgowRent.scotlandMonthly)} across Scotland`,
            tone: "bad",
          },
          {
            label: "Left for everything else",
            value: pounds.format(leftOver),
            note: "Food, energy, travel, clothes — and tax still to come off",
            tone: "bad",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6"
            style={{ boxShadow: "var(--shadow-1)" }}
          >
            <p className="ui text-[14.5px] font-[700] leading-[1.4] text-[var(--ink-2)] min-h-[2.8em]">
              {s.label}
            </p>
            <p
              className="display-stat mt-2 text-[clamp(30px,3.4vw,40px)]"
              style={{ color: s.tone === "bad" ? "var(--bad)" : "var(--ink)" }}
            >
              {s.value}
            </p>
            <p className="mt-2.5 text-[14.5px] leading-[1.45] text-[var(--muted)]">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6">
        <p className="text-[19px] leading-[1.5] font-[640] max-w-[54ch]">
          Rent alone takes {rentPct}% of the wage — before income tax, National Insurance or a
          single bill.
        </p>
        <div
          className="mt-4 flex h-4 overflow-hidden rounded-full bg-[var(--paper-3)]"
          role="img"
          aria-label={`Rent takes ${rentPct} per cent of gross pay. The remaining ${100 - rentPct} per cent covers everything else, before tax.`}
        >
          <span className="h-full bg-[var(--bad)]" style={{ width: `${rentPct}%` }} />
          <span className="h-full bg-[var(--rule-strong)]" style={{ width: `${100 - rentPct}%` }} />
        </div>
        <p className="mt-3 text-[15px] text-[var(--muted)]">
          Rent · everything else. Housing is normally called affordable below 30%.
        </p>
      </div>

      {/* ---- The rigorous version ---- */}
      <div className="mt-9">
        <h3 className="h3 mb-3">Someone has already done this properly</h3>
        <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
          Loughborough University prices up what the public agrees a household needs for a decent
          life — rent, food, energy, travel, a birthday present. Against that benchmark, full-time
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
          No — and the reason is in the rules rather than in anyone&apos;s opinion. Universal
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
              A year, plus help with rent
            </p>
          </div>
          <div className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-5 py-5">
            <p className="ui text-[14.5px] font-[700] opacity-75">
              Working full time on the legal minimum
            </p>
            <p className="display-stat mt-2 text-[30px]">
              {pounds.format(minimumWage.annualGross)}
            </p>
            <p className="mt-2 text-[14.5px] leading-[1.45] opacity-75">
              A year before tax, and Universal Credit can still be paid on top
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.6]">
          <strong>The real problem is not that work pays less. It is that it pays so little
          more.</strong>{" "}
          Above the work allowance you keep {bc.keptPence}p in the pound. Do a full extra day and
          most of it goes back. That is why the effort so often does not feel worth it — and it is
          a decision someone made, not a law of nature.
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.6] opacity-75">
          We do not publish claims about why individuals are out of work. Health assessments are
          decided by the DWP, not by us, and we have no data on anyone&apos;s honesty.
        </p>
        <Link
          href="/take-action"
          className="btn btn-primary mt-6"
        >
          Ask your MP about the taper
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
