import {
  glasgowPaySpread,
  glasgowPayMean,
  rtiCrossCheck,
  asheFullTimeUk,
} from "@/lib/data/payDistribution";

/**
 * The spread of pay, and an independent check on it.
 *
 * A lone median invites a fair objection: that it looks nothing like what
 * people around you earn. It usually does not, because half of everyone is
 * below it and a median says nothing about the shape either side. Showing the
 * distribution answers that directly — a quarter of full-time Glasgow
 * residents earn under £30,000, which is exactly the band people recognise
 * from job adverts.
 *
 * The second half answers the next fair question, which is why anyone should
 * believe a 1% sample survey. It is checked against HMRC payroll records
 * covering every employee in the country.
 */

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function PaySpread({ className = "" }: { className?: string }) {
  const top = glasgowPaySpread[glasgowPaySpread.length - 1].annual;

  return (
    <section className={className} aria-labelledby="pay-spread">
      <p className="kicker mb-3 text-[var(--brand)]">The spread, not just the middle</p>
      <h2 id="pay-spread" className="display-stat text-[clamp(26px,3.2vw,40px)] max-w-[22ch]">
        Most full-time jobs here pay a lot less than the average
      </h2>
      <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
        A single middle figure hides the shape of it. Here is the whole range for full-time
        employee jobs held by people living in Glasgow, before tax.
      </p>

      <div className="mt-7 space-y-2.5">
        {glasgowPaySpread.map((p) => (
          <div
            key={p.label}
            className={`grid items-center gap-x-5 gap-y-1 rounded-[var(--r-s)] border px-4 py-3.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] ${
              p.emphasis
                ? "border-[var(--brand)] bg-[var(--brand-wash)]"
                : "border-[var(--rule)] bg-[var(--surface)]"
            }`}
          >
            <p className="ui text-[15.5px] font-[750] text-[var(--ink)]">{p.label}</p>
            <p className="text-[15px] leading-[1.4] text-[var(--ink-2)]">{p.meaning}</p>
            <div className="flex items-baseline gap-3 sm:justify-end">
              <span
                className="display-stat text-[22px] leading-[1.15] tnum"
                style={{ color: p.emphasis ? "var(--brand)" : "var(--ink)" }}
              >
                {pounds.format(p.annual)}
              </span>
              {/* A bar makes the gap between the ends visible, not just stated. */}
              <span
                aria-hidden="true"
                className="hidden h-[6px] w-24 shrink-0 overflow-hidden rounded-full bg-[var(--paper-3)] sm:block"
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.round((p.annual / top) * 100)}%`,
                    background: p.emphasis ? "var(--brand)" : "var(--rule-strong)",
                  }}
                />
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 max-w-[64ch] text-[15.5px] leading-[1.55] text-[var(--muted)]">
        The mean is {pounds.format(glasgowPayMean.annual)}, well above the middle, because high
        earners pull it up. When people say &ldquo;average&rdquo; they usually mean the mean, which
        is why it rarely matches what they see around them. None of these figures include
        part-time work.
      </p>

      {/* ---- Why believe a sample survey ---- */}
      <div className="mt-8 rounded-[var(--r-m)] bg-[var(--deep)] p-6 text-[var(--deep-ink)] sm:p-8">
        <p className="kicker mb-3 text-[var(--action)]">How I know the survey is right</p>
        <h3 className="text-[22px] font-[760] leading-[1.2] max-w-[26ch]">
          Checked against every payslip in the country
        </h3>
        <p className="mt-3.5 max-w-[60ch] text-[16.5px] leading-[1.6] opacity-85">
          The pay survey covers about 1% of jobs, so it is fair to ask why anyone should trust it.
          HMRC publishes a separate figure taken from actual payroll records — not a sample, every
          employee. The two agree once you account for the fact that they count different people.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { ...asheFullTimeUk, name: "Pay survey (1% sample)" },
            { ...rtiCrossCheck, name: "HMRC payroll records (everyone)" },
          ].map((row) => (
            <div
              key={row.name}
              className="rounded-[var(--r-s)] border border-white/15 bg-white/[0.07] px-5 py-5"
            >
              <p className="ui text-[14.5px] font-[700] opacity-75">{row.name}</p>
              <p className="display-stat mt-2 text-[30px]">{pounds.format(row.annual)}</p>
              <p className="mt-2 text-[14.5px] leading-[1.4] opacity-75">{row.scope}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-[62ch] text-[16.5px] leading-[1.6]">
          <strong>The difference between them is part-time work.</strong> Once part-time jobs are
          counted, the middle drops by about {pounds.format(asheFullTimeUk.annual - rtiCrossCheck.annual)} a
          year. That lower figure is much closer to what most people mean by an average wage.
        </p>
      </div>
    </section>
  );
}
