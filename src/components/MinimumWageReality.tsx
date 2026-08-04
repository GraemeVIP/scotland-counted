import { ExplainText } from "@/components/Glossary";

const legalHourly = 12.71;
const realLivingHourly = 13.45;
const fullTimeHours = 37.5;
const weeks = 52;

const legalWeekly = legalHourly * fullTimeHours;
const legalAnnual = legalWeekly * weeks;
const legalMonthly = legalAnnual / 12;
const realLivingAnnual = realLivingHourly * fullTimeHours * weeks;

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const exactPounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function MinimumWageReality({
  className = "",
  headingLevel = "h3",
}: {
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const Subheading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section
      aria-labelledby="minimum-wage-reality"
      className={`overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] ${className}`}
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      <ExplainText>
      <div className="p-6 sm:p-8 lg:p-9">
        <p className="kicker mb-3 text-[var(--action)]">A wage people actually recognise</p>
        <Heading
          id="minimum-wage-reality"
          className="display-stat max-w-[20ch] text-[clamp(29px,3.5vw,44px)]"
        >
          What full-time minimum wage actually pays
        </Heading>
        <p className="mt-4 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
          Minimum wage is an hourly rate, so there is no single yearly salary. For someone aged 21
          or over, the legal minimum is <strong className="text-[var(--ink)]">£12.71 an hour</strong> from
          1 April 2026. Paid for 37.5 hours every week of the year, that adds up to:
        </p>

        <div className="mt-7 grid gap-px overflow-hidden rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-3">
          {[
            { value: pounds.format(legalWeekly), label: "a week" },
            { value: pounds.format(legalMonthly), label: "a month" },
            { value: pounds.format(legalAnnual), label: "a year" },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--paper)] px-5 py-5 sm:px-6 sm:py-6">
              <p className="figure-num text-[34px] text-[var(--ink)]">{item.value}</p>
              <p className="ui mt-1.5 text-[15px] font-[680] text-[var(--ink-2)]">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="ui mt-4 max-w-[78ch] text-[15px] leading-[1.55] text-[var(--muted)]">
          Calculation: £12.71 × 37.5 paid hours × 52 weeks = {exactPounds.format(legalAnnual)}. Fewer hours, unpaid time
          off or a changing rota means less. Workers aged 18 to 20 can legally be paid £10.85 an
          hour; under-18s and eligible apprentices can be paid £8.
        </p>
      </div>

      <div className="border-t border-[var(--rule)] bg-[var(--paper)] p-6 sm:p-8 lg:p-9">
        <Subheading className="h3 mb-3">Full-time minimum wage can still leave people short</Subheading>
        <div className="max-w-[76ch] space-y-3 text-[16px] leading-[1.6] text-[var(--ink-2)]">
          <p>
            Research on the cost of a basic, decent life found that in 2025 a single adult working
            full time on the legal minimum reached only <strong className="text-[var(--ink)]">76%</strong> of
            the Minimum Income Standard. A lone parent with children aged 3 and 7 reached only{" "}
            <strong className="text-[var(--ink)]">69%</strong>.
          </p>
          <p>
            The independently calculated <strong className="text-[var(--ink)]">real Living Wage is £13.45 an hour</strong>{" "}
            outside London. It is based on living costs and is voluntary. On the same 37.5-hour
            week it is {exactPounds.format(realLivingAnnual)} a year, {" "}
            <strong className="text-[var(--ink)]">{pounds.format(realLivingAnnual - legalAnnual)} more</strong>{" "}
            than today&apos;s legal minimum.
          </p>
        </div>

        <div className="ui mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-[650]">
          <a
            href="https://www.gov.uk/national-minimum-wage-rates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand)] underline underline-offset-3"
          >
            Check the legal rates on GOV.UK ↗
          </a>
          <a
            href="https://www.jrf.org.uk/a-minimum-income-standard-for-the-united-kingdom-in-2025"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand)] underline underline-offset-3"
          >
            Read the minimum-income research ↗
          </a>
          <a
            href="https://www.livingwage.org.uk/faqs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand)] underline underline-offset-3"
          >
            Check the real Living Wage ↗
          </a>
        </div>
      </div>
      </ExplainText>
    </section>
  );
}
