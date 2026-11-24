import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, HeaderFacts, SectionHead, CTA } from "@/components/Blocks";
import EditorialImage from "@/components/EditorialImage";
import SharePage from "@/components/SharePage";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import { GuideTable } from "@/components/GuideTable";
import { JsonLd, faqJsonLd, imageJsonLd, meta } from "@/lib/seo";
import { calculate, TAX_DATA } from "@/lib/tax/engine";
import { getSources } from "@/lib/data/sources";
import { salaryPath } from "@/lib/routeMap";
import Breadcrumbs from "@/components/Breadcrumbs";

const HERO_IMAGE = {
  src: "/images/editorial/tax-bands-scotland-2026-27.webp",
  alt: "Notebook, pound coins and paper by a Scottish window for 2026/27 tax bands",
  caption:
    "Scotland uses six income tax bands from 19% to 48%, with higher rates starting at £43,663.",
  width: 1200,
  height: 800,
};

export const metadata = meta({
  title: "Tax Bands Scotland 2026/27: Scottish Income Tax Rates",
  description:
    "Scottish income tax bands for 2026/27: six rates from 19% to 48%, exact thresholds, how much more or less you pay than England, and your take home pay.",
  path: "/tax-bands-scotland",
  type: "website",
});

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const BAND_TABLE_ROWS = [
  ["Personal Allowance", "Up to £12,570", "0%", "Tax free for income up to £100,000"],
  ["Starter rate", "£12,571 to £16,537", "19%", "Lower than England's 20% basic rate"],
  ["Basic rate", "£16,538 to £29,526", "20%", "Same as England's basic rate"],
  ["Intermediate rate", "£29,527 to £43,662", "21%", "1p more per pound than England"],
  ["Higher rate", "£43,663 to £75,000", "42%", "Starts £6,608 earlier than England's 40% band"],
  ["Advanced rate", "£75,001 to £125,140", "45%", "Starts £50,140 earlier than England's 45% band"],
  ["Top rate", "Over £125,140", "48%", "3p more per pound than England's 45% top rate"],
];

const COMPARE_SALARIES = [20_000, 25_000, 30_000, 35_000, 40_000, 50_000, 60_000, 75_000, 100_000, 125_000];

const FAQ = [
  {
    q: "How many income tax bands does Scotland have in 2026/27?",
    a: "Scotland has six income tax bands above the £12,570 Personal Allowance: Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%) and Top (48%). England, Wales and Northern Ireland have three bands: 20%, 40% and 45%.",
  },
  {
    q: "At what salary do you pay more income tax in Scotland than England?",
    a: "The crossover point is around £30,000 a year. Below roughly £30,000, Scottish taxpayers pay slightly less income tax because of the 19% starter rate. Above £30,000, Scottish earners pay more, and the gap grows sharply once pay crosses £43,662 into the 42% higher rate.",
  },
  {
    q: "Do I pay 42% tax on my whole salary if I earn over £43,662 in Scotland?",
    a: "No. Scottish income tax is progressive, so you only pay 42% on the slice of income between £43,663 and £75,000. Everything below £43,662 is still taxed at 0%, 19%, 20% and 21%.",
  },
  {
    q: "What does the S at the start of my Scottish tax code mean?",
    a: "The S prefix (for example S1257L) tells your employer or pension provider that HMRC treats you as a Scottish taxpayer, so Scottish income tax bands apply to your wages and pension.",
  },
  {
    q: "Are National Insurance or savings tax different in Scotland?",
    a: "No. Scottish tax bands apply only to non-savings, non-dividend income such as wages, pensions and self-employed profits. National Insurance, dividend tax and savings interest rates are set by Westminster and are identical across the UK.",
  },
];

export default function TaxBandsScotlandPage() {
  const sources = getSources(["scottish-tax-2026", "ni-rates-2026"]);
  const comparisons = COMPARE_SALARIES.map((gross) => {
    const scot = calculate(gross, "scotland");
    const ruk = calculate(gross, "ruk");
    const diff = scot.tax.total - ruk.tax.total;
    return { gross, scotTax: scot.tax.total, rukTax: ruk.tax.total, diff, scotNet: scot.net };
  });
  /** Three rows of the comparison table below, for the page header. */
  const headerFacts = comparisons
    .filter((row) => [25_000, 50_000, 100_000].includes(row.gross))
    .map((row) => ({
      value: pounds.format(Math.abs(row.diff)),
      label: `${row.diff < 0 ? "less" : "more"} income tax than England on ${pounds.format(row.gross)} a year`,
    }));

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Your money", path: "/money" },
          { name: "Tax bands Scotland", path: "/tax-bands-scotland" },
        ]} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={imageJsonLd({
          src: HERO_IMAGE.src,
          alt: HERO_IMAGE.alt,
          title: "Tax bands Scotland 2026/27",
          width: HERO_IMAGE.width,
          height: HERO_IMAGE.height,
        })}
      />

      <Page>
        <PageHeader
          eyebrow={`Scotland · ${TAX_DATA.taxYear} rates`}
          title="Tax bands Scotland 2026/27: Scottish income tax rates"
          lede="Scotland has six income tax bands instead of the three used in England, Wales and Northern Ireland. Here are the exact 2026/27 thresholds, what you pay at each salary, and where the crossover with England sits."
          panel={<HeaderFacts label="Scotland compared with England" items={headerFacts} />}
        >
          <SharePage
            title="Tax bands Scotland 2026/27 vs England"
            text="All six 2026/27 Scottish income tax bands (19% to 48%) and how much more or less you pay than England at every salary."
            path="/tax-bands-scotland"
            label="Share Scottish tax bands"
            className="mt-4"
          />
        </PageHeader>

        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Scottish income tax bands 2026/27",
              value: "19% to 48%",
              unit: "across 6 bands",
              detail:
                "After the £12,570 Personal Allowance, Scottish rates start at 19% and step up to 42% at £43,663, 45% at £75,001 and 48% over £125,140. National Insurance is the same across the UK.",
              rows: [
                { label: "Personal Allowance", value: "Up to £12,570 (0%)" },
                { label: "Starter to Intermediate", value: "19%, 20% and 21%" },
                { label: "Higher rate starts", value: "£43,663 (42%)" },
                { label: "England crossover", value: "Around £30,000 a year" },
              ],
              asOf: `Tax year ${TAX_DATA.taxYear}, from 6 April 2026`,
              source: {
                publisher: "Scottish Government",
                url: sources[0]?.url ?? "https://www.gov.scot/policies/taxes/income-tax/",
              },
              nextStep: {
                label: "Calculate your exact take home pay",
                href: "/take-home-pay-calculator-scotland",
              },
            }}
          />
          <EditorialImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            caption={HERO_IMAGE.caption}
            aspect="wide"
            loading="eager"
            className="mt-10"
          />
        </ContentFrame>

        <ContentFrame as="section" className="pt-14">
          <SectionHead
            eyebrow="2026/27 thresholds"
            title="All six Scottish income tax bands"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            You only pay each rate on the slice of income inside that band, never on your full salary.
            These rates apply to wages, pensions and self-employed profits if HMRC marks you as a
            Scottish taxpayer (a tax code starting with <strong>S</strong>, such as S1257L). Next
            year&apos;s 2027/28 thresholds will be set in the{" "}
            <Link href="/scottish-budget-2027-28">
              Scottish Budget on Thursday 3 December 2026
            </Link>
            .
          </p>
          <div className="mt-6">
            <GuideTable
              kicker="Income tax · 2026/27"
              title="Scottish income tax bands and rates"
              columns={["Band", "Annual taxable pay", "Rate", "Compared with England"]}
              align={["left", "left", "right", "left"]}
              rows={BAND_TABLE_ROWS}
              caption="Assumes the standard £12,570 Personal Allowance. Above £100,000, the Personal Allowance drops by £1 for every £2 earned until it reaches £0 at £125,140."
            />
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Scotland vs England"
            title="How much more or less income tax you pay in Scotland"
          />
          <p className="mt-4 max-w-[66ch] text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            Every figure below is worked out with the same tested tax engine as our{" "}
            <Link href="/take-home-pay-calculator-scotland">Scottish take home pay calculator</Link>.
            Click any salary for the full monthly, weekly and pension breakdown, or browse all 25
            salaries from £15,000 to £150,000 in the{" "}
            <Link href="/take-home-pay-calculator-scotland#all-salaries">Scotland salary after tax table</Link>.
          </p>

          <div className="tile mt-6 overflow-x-auto">
            <table className="w-full min-w-[580px] text-[15.5px]">
              <thead>
                <tr className="text-left">
                  {["Salary", "Scottish income tax", "England income tax", "Scottish difference", "Take home (Scotland)"].map(
                    (head) => (
                      <th key={head} className="kicker px-5 py-4 font-[500] text-[var(--muted)]">
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.gross} className="border-t border-[var(--rule)]">
                    <td className="px-5 py-3.5 font-[580] tnum">
                      {row.gross === 125_000 ? (
                        pounds.format(row.gross)
                      ) : (
                        <Link href={salaryPath(row.gross)} className="text-[var(--action-text)]">
                          {pounds.format(row.gross)}
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-3.5 tnum">{pounds.format(row.scotTax)}</td>
                    <td className="px-5 py-3.5 tnum">{pounds.format(row.rukTax)}</td>
                    <td
                      className={`px-5 py-3.5 font-[580] tnum ${
                        row.diff <= 0 ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"
                      }`}
                    >
                      {row.diff < 0
                        ? `${pounds.format(-row.diff)} less`
                        : row.diff > 0
                          ? `+${pounds.format(row.diff)} more`
                          : "Same"}
                    </td>
                    <td className="px-5 py-3.5 tnum">{pounds.format(row.scotNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <SectionHead
            eyebrow="Watch out for this"
            title="The £100,000 Personal Allowance trap in Scotland"
          />
          <div className="mt-5 max-w-[66ch] space-y-4 text-[17.5px] leading-[1.6] text-[var(--ink-2)]">
            <p>
              Across the whole UK, once adjusted net income passes £100,000 you lose £1 of your
              £12,570 Personal Allowance for every £2 earned above £100,000. By £125,140 your
              Personal Allowance is gone.
            </p>
            <p>
              Because Scotland charges the 45% advanced rate in that bracket rather than England&apos;s
              40% rate, losing the Personal Allowance creates an effective marginal income tax rate of
              67.5% on earnings between £100,000 and £125,140 (69.5% including 2% National Insurance).
              Workplace pension contributions reduce adjusted net income and can recover that allowance.
            </p>
          </div>
        </ContentFrame>

        <ContentFrame as="section" className="pt-16">
          <Faq items={FAQ} kicker="Questions" title="Common questions about Scottish tax bands" />
        </ContentFrame>

        <ContentFrame as="section" className="mt-16 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-4">Official sources</p>
          <ul className="space-y-2.5 text-[15.5px] text-[var(--ink-2)]">
            {sources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-[580] text-[var(--ink)]">
                  {s.title}
                </a>
                , {s.publisher}
              </li>
            ))}
          </ul>
        </ContentFrame>
      </Page>

      <CTA
        title="See what actually lands in your bank account"
        body="Enter your exact salary or hourly wage, add your pension and student loan, and compare Scotland with the rest of the UK."
        href="/take-home-pay-calculator-scotland"
        cta="Open take home pay calculator"
        secondaryHref="/take-home-pay-calculator-scotland#all-salaries"
        secondaryCta="Browse all 25 salaries"
      />
    </>
  );
}
