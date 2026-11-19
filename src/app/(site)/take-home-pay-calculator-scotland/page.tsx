import { Suspense } from "react";
import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, InShort, CTA, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { getSources } from "@/lib/data/sources";
import { TAX_DATA, calculate } from "@/lib/tax/engine";
import { minimumWage, minimumWageTakeHome } from "@/lib/data/livingCosts";
import ToolCTA from "@/components/ToolCTA";
import SharePage from "@/components/SharePage";
import Calculator from "./Calculator";
import Faq from "@/components/Faq";
import { ExplainText } from "@/components/Glossary";
import { SALARIES, salaryPath } from "@/lib/routeMap";

export const metadata = meta({
  title: "Take Home Pay Calculator Scotland 2026/27: Salary & Tax",
  description:
    "Calculate take home pay with Scotland's six 2026/27 income tax bands. Enter a salary or hourly wage, compare against England, and include pension or student loan.",
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
    q: "How much is take home pay on minimum wage in Scotland?",
    a: `At £${minimumWage.hourly} an hour for ${minimumWage.hours} hours a week, gross pay is about ${pounds.format(
      minimumWage.annualGross
    )} a year. After Scottish income tax of about ${pounds.format(
      minimumWageTakeHome.tax
    )} and National Insurance of about ${pounds.format(
      minimumWageTakeHome.ni
    )}, take home is roughly ${pounds.format(minimumWageTakeHome.annual)} a year, or ${pounds.format(
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
    a: "No. Income tax is set by the Scottish Parliament, but National Insurance is set UK wide. It is 8% of pay between £12,570 and £50,270, then 2% above that, wherever you live.",
  },
  {
    q: "Can I work out the salary I need for a certain take home?",
    a: "Yes. Choose 'Know your take home? Work backwards', enter the amount you need per month or per year, and the calculator solves for the gross salary that produces it, including any pension and student loan you have set.",
  },
  {
    q: "Does it handle student loans and pensions?",
    a: "Yes. Student loan Plans 1, 2, 4 and 5, postgraduate loans, and a postgraduate loan running alongside a numbered plan. Net pay and salary sacrifice pensions can be a percentage or a fixed amount under More options. Relief at source pensions and emergency W1/M1/X tax codes are not supported, because their extra relief or pay period rules need a different calculation.",
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
          { name: "Take home pay calculator", path: "/take-home-pay-calculator-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow={`Scotland · ${TAX_DATA.taxYear} rates`}
          title="Take home pay calculator Scotland 2026/27"
          lede="Enter what you earn and see what actually reaches your bank account, on Scotland's six income tax bands. Or work backwards from the pay you need to live on."
        >
          <SharePage
            title="Scottish take home pay calculator 2026/27"
            text="Work out your take home pay on Scotland's six 2026/27 income tax bands and compare with England."
            path="/take-home-pay-calculator-scotland"
            label="Share this calculator"
            className="mt-4"
          />
        </PageHeader>

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
            covers rent, council tax, energy and food where you live. On full time minimum wage in
            Glasgow it does not, and I show the whole household budget rather than asserting it.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-[1000px]">
            {EXAMPLES.map((e) => {
              const href = SALARIES.includes(e.gross) ? salaryPath(e.gross) : "/minimum-wage-scotland";
              return (
                <Link
                  key={e.gross}
                  href={href}
                  className="block rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] px-5 py-5 no-underline transition-colors hover:border-[var(--brand)]"
                >
                  <p className="ui text-[14.5px] font-[600] text-[var(--muted)] tnum">
                    {pounds.format(e.gross)} a year
                  </p>
                  <p className="display-stat mt-1.5 text-[clamp(24px,2.6vw,30px)] text-[var(--ink)] tnum">
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
                  <p className="ui mt-2.5 text-[14px] font-[600] text-[var(--brand)]">
                    Full breakdown <span aria-hidden="true">→</span>
                  </p>
                </Link>
              );
            })}
          </div>

          <div id="all-salaries" className="mt-12 max-w-[1000px]">
            <h3 className="h3 mb-2">Salary after tax in Scotland ({TAX_DATA.taxYear}): £15,000 to £150,000</h3>
            <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
              Every common Scottish salary on a standard S1257L tax code, with no pension or student loan.
              Click any salary for the full band-by-band breakdown, or check{" "}
              <Link href="/tax-bands-scotland">all six Scottish income tax bands for 2026/27</Link>.
            </p>
            <div className="tile mt-5 overflow-x-auto">
              <table className="w-full min-w-[600px] text-[15px]">
                <thead>
                  <tr className="text-left">
                    {["Salary", "Take home / year", "Take home / month", "Income tax", "NI", "vs England"].map(
                      (head) => (
                        <th key={head} className="kicker px-4 py-3.5 font-[500] text-[var(--muted)]">
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {SALARIES.map((amount) => {
                    const scot = calculate(amount, "scotland");
                    const ruk = calculate(amount, "ruk");
                    const diff = Math.round(scot.net - ruk.net);
                    return (
                      <tr key={amount} className="border-t border-[var(--rule)]">
                        <td className="px-4 py-3 font-[600] tnum">
                          <Link href={salaryPath(amount)} className="text-[var(--action-text)]">
                            {pounds.format(amount)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-[580] tnum">{pounds.format(scot.net)}</td>
                        <td className="px-4 py-3 tnum">{pounds.format(scot.net / 12)}</td>
                        <td className="px-4 py-3 tnum">{pounds.format(scot.tax.total)}</td>
                        <td className="px-4 py-3 tnum">{pounds.format(scot.ni.total)}</td>
                        <td
                          className={`px-4 py-3 font-[560] tnum ${
                            diff >= 0 ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"
                          }`}
                        >
                          {diff > 0 ? `+${pounds.format(diff)}` : diff < 0 ? `-${pounds.format(-diff)}` : "Same"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-7 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[66ch]">
            The first of those is full time work at the legal minimum.{" "}
            <Link href="/indicators/glasgow-full-time-pay">
              See what is left of it after rent, council tax, energy and food
            </Link>{" "}
, and why the average Glasgow pay figure you may have seen is not what a typical worker
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
                <ExplainText>{s.used}</ExplainText>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.6] text-[var(--muted)]">
            The tax maths behind this page is a single tested module, and it is the same one that
            produces the take home figures quoted elsewhere on this site, so the calculator and the
            written pages can never disagree.
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Pay is a political choice, not weather"
        body="What is left after tax, rent and bills is decided by people you can write to. Enter your postcode and I find your MP and MSP, then write both emails for you."
        href="/email-your-mp-and-msp"
        cta="Find my MP and MSP"
        secondaryHref="/solutions-to-poverty-in-scotland"
        secondaryCta="See what would help"
      />
    </>
  );
}
