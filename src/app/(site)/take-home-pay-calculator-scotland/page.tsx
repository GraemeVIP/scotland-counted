import { Suspense } from "react";
import Link from "next/link";
import { Page, ContentFrame, PageHeader, InShort, CTA, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { getSources } from "@/lib/data/sources";
import { TAX_DATA, calculate } from "@/lib/tax/engine";
import { minimumWage, minimumWageTakeHome } from "@/lib/data/livingCosts";
import ToolCTA from "@/components/ToolCTA";
import Calculator from "./Calculator";
import Faq from "@/components/Faq";

export const metadata = meta({
  title: "Take-home pay calculator for Scotland",
  description:
    "Work out your take-home pay on Scotland's income tax bands for 2026/27. Enter a salary or an hourly rate, or work backwards from the pay you need.",
  path: "/take-home-pay-calculator-scotland",
  type: "website",
});

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const FAQ = [
  {
    q: "How much is take-home pay on minimum wage in Scotland?",
    a: `At £${minimumWage.hourly} an hour for ${minimumWage.hours} hours a week, gross pay is about ${pounds.format(
      minimumWage.annualGross
    )} a year. After Scottish income tax of about ${pounds.format(
      minimumWageTakeHome.tax
    )} and National Insurance of about ${pounds.format(
      minimumWageTakeHome.ni
    )}, take-home is roughly ${pounds.format(minimumWageTakeHome.annual)} a year, or ${pounds.format(
      minimumWageTakeHome.monthly
    )} a month.`,
  },
  {
    q: "Do Scots pay more income tax?",
    a: "It depends what you earn. Scotland has six income tax bands rather than three, and the crossover is around £30,000. Below roughly that, a Scottish taxpayer pays slightly less than someone on the same salary elsewhere in the UK. Above it, they pay more, and the gap widens as pay rises. The calculator shows your own difference.",
  },
  {
    q: "What are the Scottish income tax rates for 2026/27?",
    a: "After the £12,570 Personal Allowance: starter rate 19% to £16,537, basic rate 20% to £29,526, intermediate rate 21% to £43,662, higher rate 42% to £75,000, advanced rate 45% to £125,140, and top rate 48% above that.",
  },
  {
    q: "Is National Insurance different in Scotland?",
    a: "No. Income tax is set by the Scottish Parliament, but National Insurance is set UK-wide. It is 8% of pay between £12,570 and £50,270, then 2% above that, wherever you live.",
  },
  {
    q: "Can I work out the salary I need for a certain take-home?",
    a: "Yes. Choose 'Know your take-home? Work backwards', enter the amount you need per month or per year, and the calculator solves for the gross salary that produces it — including any pension and student loan you have set.",
  },
  {
    q: "Does it handle student loans and pensions?",
    a: "Yes. Student loan Plans 1, 2, 4 and 5, postgraduate loans, and a postgraduate loan running alongside a numbered plan. Pensions can be a percentage or a fixed amount, taken as net pay, salary sacrifice or relief at source. All are under More options.",
  },
];

/** A few real salaries, so the page answers the question before you type. */
const EXAMPLES = [24_785, 30_000, 40_000, 50_000].map((gross) => {
  const scot = calculate(gross, "scotland");
  const ruk = calculate(gross, "ruk");
  return {
    gross,
    net: scot.net,
    monthly: scot.net / 12,
    diff: scot.tax.total + scot.ni.total - (ruk.tax.total + ruk.ni.total),
  };
});

export default function TakeHomePayCalculator() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Take-home pay calculator", path: "/take-home-pay-calculator-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow={`Scotland · ${TAX_DATA.taxYear} rates`}
          title="Take-home pay calculator"
          lede="Enter what you earn and see what actually reaches your bank account, on Scotland's six income tax bands. Or work backwards from the pay you need to live on."
        />

        <InShort>
          <p>
            <strong>Scotland has its own income tax bands.</strong> Six of them, not the three used
            in the rest of the UK.
          </p>
          <p>
            National Insurance is the same everywhere. It is income tax that differs, and the
            crossover is around £30,000 a year.
          </p>
          <p>Nothing you type is sent anywhere. The sum happens in your browser.</p>
        </InShort>

        <ContentFrame className="pt-10">
          {/* Calculator reads the query string, so it needs a boundary. */}
          <Suspense
            fallback={
              <div className="h-[420px] rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]" />
            }
          >
            <Calculator />
          </Suspense>
        </ContentFrame>

        {/* ---------- What the number means here ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <SectionHead
            eyebrow="The bit other calculators leave out"
            title="A number is not the same as enough"
          />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            Every salary calculator gives you a figure and stops. What matters is whether the figure
            covers rent, council tax, energy and food where you live. On full-time minimum wage in
            Glasgow it does not, and we show the whole household budget rather than asserting it.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-[1000px]">
            {EXAMPLES.map((e) => (
              <div
                key={e.gross}
                className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5"
              >
                <p className="ui text-[14.5px] font-[720] text-[var(--muted)] tnum">
                  {pounds.format(e.gross)} a year
                </p>
                <p className="display-stat mt-1.5 text-[clamp(24px,2.6vw,30px)] tnum">
                  {pounds.format(e.monthly)}
                </p>
                <p className="ui text-[14.5px] text-[var(--muted)]">a month, after tax and NI</p>
                <p className="mt-3 border-t border-[var(--rule)] pt-3 text-[14.5px] leading-[1.5] text-[var(--ink-2)] tnum">
                  {e.diff >= 1
                    ? `${pounds.format(e.diff)} a year more than the rest of the UK`
                    : e.diff <= -1
                      ? `${pounds.format(-e.diff)} a year less than the rest of the UK`
                      : "The same as the rest of the UK"}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-7 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[66ch]">
            The first of those is full-time work at the legal minimum.{" "}
            <Link href="/indicators/pay">
              See what is left of it after rent, council tax, energy and food
            </Link>{" "}
            — and why the average Glasgow pay figure you may have seen is not what a typical worker
            earns.
          </p>
        </ContentFrame>

        <ContentFrame className="pt-16">
          <ToolCTA tool="council-tax" />
        </ContentFrame>

        {/* ---------- FAQ ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <Faq items={FAQ} kicker="Questions" title="What people ask about Scottish tax" />
        </ContentFrame>

        {/* ---------- Sources ---------- */}
        <ContentFrame as="section" className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-6">Where the rates come from</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources(["scottish-tax-2026", "ni-rates-2026", "minimum-wage-2026"]).map((s) => (
              <div key={s.id} className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
                >
                  {s.title}
                </a>
                <p className="ui mt-1.5 mb-1.5 text-[15px] text-[var(--muted)]">{s.publisher}</p>
                {s.used}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.6] text-[var(--muted)]">
            The tax maths behind this page is a single tested module, and it is the same one that
            produces the take-home figures quoted elsewhere on this site — so the calculator and the
            written pages can never disagree.
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Pay is a political choice, not weather"
        body="What is left after tax, rent and bills is decided by people you can write to. Enter your postcode and we find your MP and MSP, then write both emails for you."
        href="/take-action"
        cta="Find my MP and MSP"
        secondaryHref="/what-would-fix-it"
        secondaryCta="See what would help"
      />
    </>
  );
}
