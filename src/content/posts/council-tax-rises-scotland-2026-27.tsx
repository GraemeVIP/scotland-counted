import Link from "next/link";
import { Prose, Lead, P, H2, Aside, PostCTA } from "@/components/Prose";
import {
  chargesFor,
  COUNCIL_TAX_YEAR,
  PREVIOUS_COUNCIL_TAX_YEAR,
} from "@/lib/data/councilTax";
import { councils } from "@/lib/data/councils";

const exact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

export default function Post() {
  const rows = councils
    .map((council) => {
      const bandD = chargesFor(council.slug)?.[3];
      return bandD ? { ...bandD, name: council.name, slug: council.slug } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.councilTaxRisePct - a.councilTaxRisePct);

  const largest = rows[0];
  const smallest = rows[rows.length - 1];

  return (
    <Prose>
      <Lead>
        All {rows.length} Scottish councils increased council tax in 2026/27. The Band D rise
        ranges from {percent.format(smallest.councilTaxRisePct)}% in {smallest.name} to{" "}
        {percent.format(largest.councilTaxRisePct)}% in {largest.name}. There is no single rate
        for the whole country because each council sets its own charge.
      </Lead>

      <H2 id="short-answer">The short answer</H2>
      <P>
        In {largest.name}, Band D council tax went from{" "}
        {exact.format(largest.previousCouncilTax)} to {exact.format(largest.councilTax)}. That is{" "}
        {exact.format(largest.councilTaxRise)} more a year, the largest percentage rise at{" "}
        {percent.format(largest.councilTaxRisePct)}%.
      </P>
      <P>
        The smallest percentage rise was in {smallest.name}:{" "}
        {exact.format(smallest.previousCouncilTax)} to {exact.format(smallest.councilTax)}, an
        increase of {exact.format(smallest.councilTaxRise)} or{" "}
        {percent.format(smallest.councilTaxRisePct)}%.
      </P>
      <Aside title="These are council-tax rises, not whole-bill rises">
        <p>
          Scottish Water also changed its charges for 2026/27. That money is collected on the
          same bill, but the council does not set it. Every comparison below excludes water so
          the council figure is not made to look larger than it is.
        </p>
      </Aside>

      <H2 id="all-councils">Every Scottish council compared</H2>
      <P>
        Band D is used because it is the standard council-tax comparison. Every other band is a
        fixed proportion of Band D, so the percentage rise is almost identical across Bands A to
        H. Tiny differences can appear because bills are rounded to the nearest penny.
      </P>

      <div className="not-prose my-7 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
          <p className="ui text-[15px] font-[750] text-[var(--muted)]">Band D council tax</p>
          <p className="ui text-right text-[15px] font-[750] text-[var(--muted)]">Annual rise</p>
        </div>
        {rows.map((row, index) => (
          <Link
            key={row.slug}
            href={`/council-tax-bands-scotland/${row.slug}#band-d`}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[var(--rule)] bg-[var(--surface)] px-5 py-4 text-[var(--ink)] no-underline transition-colors last:border-0 hover:bg-[var(--surface-2)]"
          >
            <span>
              <span className="ui block text-[16px] font-[700]">
                <span className="mr-2 tnum text-[var(--muted)]">{index + 1}.</span>
                {row.name}
              </span>
              <span className="mt-1 block text-[15px] leading-[1.45] text-[var(--muted)]">
                {PREVIOUS_COUNCIL_TAX_YEAR}: {exact.format(row.previousCouncilTax)} →{" "}
                {COUNCIL_TAX_YEAR}: {exact.format(row.councilTax)}
              </span>
            </span>
            <span className="text-right">
              <span className="display-stat block text-[20px] tnum text-[var(--action)]">
                +{exact.format(row.councilTaxRise)}
              </span>
              <span className="mt-1 block text-[15px] tnum text-[var(--muted)]">
                {percent.format(row.councilTaxRisePct)}%
              </span>
            </span>
          </Link>
        ))}
      </div>

      <H2 id="what-it-means">What the percentages mean</H2>
      <P>
        The percentage tells you how much the same council-tax band changed between the two
        published years. The cash figure often makes the effect easier to understand: it is the
        extra council tax due over a full year before any discount or Council Tax Reduction is
        applied.
      </P>
      <P>
        It is not an estimate based on a council announcement. Both sides of the comparison come
        from the Scottish Government&apos;s national council-tax-by-band workbooks, using the
        amounts reported by the 32 local authorities.
      </P>

      <H2 id="water">Why Scottish Water is separate</H2>
      <P>
        Most households see council tax, water and waste water on one document. The council
        collects all three, but Scottish Water sets the water charges. Adding a water increase to
        a council&apos;s increase would blame the council for a price it did not choose.
      </P>
      <P>
        The <Link href="/council-tax-bands-scotland">council tax checker</Link> therefore shows
        both views: the council-tax rise on its own, then the current council tax and current
        Scottish Water charges combined into the amount that appears on the bill.
      </P>

      <H2 id="check-your-bill">Check your own band and council</H2>
      <P>
        A national ranking cannot tell you your bill. Your council area sets the rate and your
        property&apos;s band sets the share of that rate. Enter your postcode to find the council,
        then choose the band shown on your bill or on the Scottish Assessors website.
      </P>

      <PostCTA
        title="See last year, this year and the full bill"
        body="Enter your postcode to find the right council. Every band shows the old council tax, the new council tax, the cash and percentage rise, and Scottish Water separately."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
