import Link from "next/link";
import { Page, PageHeader, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import CouncilTaxLookup from "./CouncilTaxLookup";
import WaterCharge from "@/components/WaterCharge";
import ToolCTA from "@/components/ToolCTA";
import {
  councilTaxByBand,
  chargesFor,
  COUNCIL_TAX_YEAR,
  PREVIOUS_COUNCIL_TAX_YEAR,
  WATER_YEAR,
} from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";
import Faq from "@/components/Faq";

export const metadata = meta({
  title: "Council Tax Bands Scotland 2026/27 | Prices A-H",
  description:
    "Check 2026/27 council tax bands in every Scottish council. Compare Band A to H yearly and monthly prices with water and waste-water charges included.",
  path: "/council-tax-bands-scotland",
  type: "website",
});

const BASE_FAQ = [
  {
    q: "How do I find out my council tax band?",
    a: "Your band belongs to the property, not the postcode, and only the Scottish Assessors hold it. You can look it up free on the Scottish Assessors Association website. Most flats and smaller homes in Scotland are Band A to C.",
  },
  {
    q: "Does council tax include water charges in Scotland?",
    a: "Yes. Water and waste water charges are set by Scottish Water but collected on your council tax bill. They are a large part of it, £434.88 a year at Band A, and most figures published online leave them out.",
  },
  {
    q: "Can I pay less council tax?",
    a: "Possibly. Council Tax Reduction cuts the bill for people on a low income, and anyone receiving it can get up to 35% off the water charges as well. An adult living alone gets a 25% single person discount. Both are applied for through your council and both are free to apply for.",
  },
  {
    q: "Why is council tax different in each council area?",
    a: "Each of Scotland's 32 councils sets its own Band D rate, and every other band is a fixed proportion of it. Band A is two thirds of Band D; Band H is about two and a half times it. So the same size of home costs different amounts in different council areas.",
  },
  {
    q: "What months are free of council tax?",
    a: "Most Scottish councils spread the bill over 10 instalments from April to January, so February and March have no payment. That is not a discount, the same total is collected in ten payments rather than twelve. You can usually ask your council to spread it over 12 months instead, which makes each payment smaller.",
  },
  {
    q: "How is council tax calculated?",
    a: "Two things decide it. Your property has a band from A to H, set by the Scottish Assessors from what it was worth in April 1991. Your council then sets a Band D rate each year, and every other band is a fixed fraction of that: Band A is 240/360 of Band D, Band C is 320/360, Band H is 882/360.",
  },
];

export default function CouncilTaxPage() {
  const withData = councils.filter((c) => councilTaxByBand[c.slug]);
  const bandDRises = withData
    .map((c) => ({ name: c.name, slug: c.slug, ...chargesFor(c.slug)![3] }))
    .sort((a, b) => b.councilTaxRisePct - a.councilTaxRisePct);
  const bandATotals = withData
    .map((c) => chargesFor(c.slug)![0].total)
    .sort((a, b) => a - b);
  const bandDTotals = bandDRises.map((c) => c.total).sort((a, b) => a - b);
  const largestRise = bandDRises[0];
  const smallestRise = bandDRises[bandDRises.length - 1];
  const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
  const exact = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  });
  const faq = [
    ...BASE_FAQ,
    {
      q: "How much is council tax a month in Scotland?",
      a: `It depends on your band and council. Including water, Band A runs from ${exact.format(bandATotals[0] / 12)} to ${exact.format(bandATotals[bandATotals.length - 1] / 12)} a month across Scotland. Band D runs from ${exact.format(bandDTotals[0] / 12)} to ${exact.format(bandDTotals[bandDTotals.length - 1] / 12)}. The postcode lookup gives your council's exact figures.`,
    },
    {
      q: "How much did council tax rise in Scotland in 2026/27?",
      a: `There is no single Scottish rise because each council sets its own rate. Band D council tax rose in all 32 areas, from ${percent.format(smallestRise.councilTaxRisePct)}% in ${smallestRise.name} to ${percent.format(largestRise.councilTaxRisePct)}% in ${largestRise.name}. Those percentages exclude Scottish Water, which sets its own separate charges.`,
    },
  ];
  const cited = getSources(["council-tax-scotland", "scottish-water-2026"]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Council tax bands", path: "/council-tax-bands-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow="Scotland · all 32 councils · bands A to H"
          title="Council tax bands in Scotland: 2026/27 prices"
          lede="Enter your postcode and see what every band costs where you live, with water and waste water included, which most figures leave out. Scotland only: the bands and rates here do not apply in England or Wales."
        />

        <div className="mt-2 mb-9">
          <InShort>
            <p>
              Council tax is worked out from a <strong>band</strong>, which depends on your
              property, and a <strong>rate</strong>, which your council sets.
            </p>
            <p>
              Your bill also includes <strong>water and waste water</strong>. That is Scottish
              Water&apos;s charge, not the council&apos;s, but it arrives on the same bill, and at
              Band A it is £434.88 a year on its own.
            </p>
            <p>On a low income you may pay a lot less. I explain how below.</p>
          </InShort>
          <p className="mt-4 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            Need the rules as well as the price? Read the{" "}
            <Link href="/blog/how-council-tax-works-scotland">
              plain-English guide to bands, discounts, reductions, appeals and arrears
            </Link>.
          </p>
        </div>

        <WaterCharge className="mb-10" />

        <CouncilTaxLookup />

        <section className="pt-14" id="council-tax-rises">
          <p className="kicker mb-2 text-[var(--action)]">What changed this year</p>
          <h2 className="h2 mb-3">Where Band D council tax rose most</h2>
          <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
            All 32 councils increased their council tax for 2026/27. At Band D, the rise runs from{" "}
            <strong className="text-[var(--ink)]">
              {percent.format(smallestRise.councilTaxRisePct)}% in {smallestRise.name}
            </strong>{" "}
            to{" "}
            <strong className="text-[var(--ink)]">
              {percent.format(largestRise.councilTaxRisePct)}% in {largestRise.name}
            </strong>.
          </p>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
            This comparison is <strong className="text-[var(--ink)]">council tax only</strong>:
            it compares {PREVIOUS_COUNCIL_TAX_YEAR} with {COUNCIL_TAX_YEAR}. Scottish Water sets
            its own charges, so water is not included in any council rise shown below. These are
            the ten largest rises; the article underneath lists all 32.
          </p>
          <div className="mt-6 grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]">
            {bandDRises.slice(0, 10).map((c, i) => (
              <Link
                key={c.slug}
                href={`/council-tax-bands-scotland/${c.slug}#band-d`}
                className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 no-underline transition-colors hover:border-[var(--brand)]"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="ui text-[15px] font-[640] leading-[1.25] text-[var(--ink-2)] group-hover:text-[var(--ink)]">
                    <span className="tnum text-[var(--muted)]">{i + 1}.</span> {c.name}
                  </span>
                  <span className="display-stat shrink-0 text-[17px] tnum text-[var(--action)]">
                    +{exact.format(c.councilTaxRise)}
                  </span>
                </span>
                <span className="mt-1.5 block text-[15px] leading-[1.4] text-[var(--muted)]">
                  {exact.format(c.previousCouncilTax)} → {exact.format(c.councilTax)} ·{" "}
                  {percent.format(c.councilTaxRisePct)}%
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-[16px] leading-[1.6] text-[var(--ink-2)]">
            <Link href="/blog/council-tax-rises-scotland-2026-27">
              Read the plain-English breakdown of Scotland&apos;s 2026/27 council tax rises
            </Link>.
          </p>
        </section>

        <ToolCTA tool="take-home" className="mt-14" />

        <Faq items={faq} className="pt-14" />

        <section className="pt-12">
          <h2 className="label mb-4">Where these figures come from</h2>
          <ul className="max-w-[760px] space-y-2.5">
            {cited.map((s) => (
              <li key={s.id} className="text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>{" "}
, {s.publisher}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[720px] text-[15px] leading-[1.55] text-[var(--muted)]">
            Council tax figures for {PREVIOUS_COUNCIL_TAX_YEAR} and {COUNCIL_TAX_YEAR} are the
            complete official sets for all 32 councils. Water and waste water are separate{" "}
            {WATER_YEAR} charges published by Scottish Water.
          </p>
        </section>
      </Page>
    </>
  );
}
