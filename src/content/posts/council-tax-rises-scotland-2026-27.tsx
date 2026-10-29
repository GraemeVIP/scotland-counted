import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import {
  BAND_LETTERS,
  chargesFor,
  councilTaxChangeFor,
  COUNCIL_TAX_YEAR,
  PREVIOUS_COUNCIL_TAX_YEAR,
} from "@/lib/data/councilTax";
import {
  COUNCIL_TAX_REDUCTION,
  SINGLE_PERSON_DISCOUNT,
  WATER_CHARGES_REDUCTION,
} from "@/lib/data/councilTaxHelp";
import { councils } from "@/lib/data/councils";
import { COUNCIL_SEARCH_NAMES, councilTaxBandPath, councilTaxPath } from "@/lib/routeMap";

const exact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const listNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];

/** The smallest and largest cash rise in each band, across every council. */
function bandRanges() {
  return BAND_LETTERS.map((band) => {
    const changes = councils
      .map((council) => {
        const change = councilTaxChangeFor(council.slug, band);
        return change ? { slug: council.slug, cash: change.cash } : null;
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => a.cash - b.cash);
    return { band, smallest: changes[0], largest: changes[changes.length - 1] };
  });
}

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
  const shown = (pct: number) => percent.format(pct);
  const topNames = rows.filter((row) => shown(row.councilTaxRisePct) === shown(largest.councilTaxRisePct)).map((row) => row.name);
  const bottomNames = rows.filter((row) => shown(row.councilTaxRisePct) === shown(smallest.councilTaxRisePct)).map((row) => row.name);
  const middlePct = median(rows.map((row) => row.councilTaxRisePct));
  const middleCash = median(rows.map((row) => row.councilTaxRise));
  const ranges = bandRanges();

  return (
    <Prose>
      <Lead>
        All {rows.length} Scottish councils increased council tax in 2026/27. The Band D rise
        ranges from {shown(smallest.councilTaxRisePct)}% in {listNames(bottomNames)} to{" "}
        {shown(largest.councilTaxRisePct)}% in {listNames(topNames)}, and half the councils raised
        Band D by more than {shown(middlePct)}%, about £{Math.round(middleCash)} a year. There is no
        single rate for the whole country because each council sets its own charge.
      </Lead>

      <H2 id="short-answer">Council tax increase Scotland 2026: the short answer</H2>
      <P>
        In {largest.name}, Band D council tax went from{" "}
        {exact.format(largest.previousCouncilTax)} to {exact.format(largest.councilTax)}. That is{" "}
        {exact.format(largest.councilTaxRise)} more a year,{" "}
        {topNames.length > 1 ? "the joint largest" : "the largest"} percentage rise at{" "}
        {percent.format(largest.councilTaxRisePct)}%.
      </P>
      <P>
        The smallest percentage rise was in {smallest.name}:{" "}
        {exact.format(smallest.previousCouncilTax)} to {exact.format(smallest.councilTax)}, an
        increase of {exact.format(smallest.councilTaxRise)} or{" "}
        {percent.format(smallest.councilTaxRisePct)}%.
      </P>
      <Aside title="These are council tax rises, not whole bill rises">
        <p>
          Scottish Water also changed its charges for 2026/27. That money is collected on the
          same bill, but the council does not set it. Every comparison below excludes water so
          the council figure is not made to look larger than it is.
        </p>
      </Aside>

      <H2 id="all-councils">Every Scottish council compared</H2>
      <P>
        Band D is used because it is the standard council tax comparison. Every other band is a
        fixed proportion of Band D, so the percentage rise is almost identical across Bands A to
        H. Tiny differences can appear because bills are rounded to the nearest penny.
      </P>

      <div className="not-prose my-7 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
          <p className="ui text-[15px] font-[600] text-[var(--muted)]">Band D council tax</p>
          <p className="ui text-right text-[15px] font-[600] text-[var(--muted)]">Annual rise</p>
        </div>
        {rows.map((row, index) => (
          <Link
            key={row.slug}
            href={`${councilTaxPath(row.slug)}#band-d`}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-b border-[var(--rule)] bg-[var(--surface)] px-5 py-4 text-[var(--ink)] no-underline transition-colors last:border-0 hover:bg-[var(--surface-2)]"
          >
            <span>
              <span className="ui block text-[16px] font-[580]">
                <span className="mr-2 tnum text-[var(--muted)]">{index + 1}.</span>
                {row.name}
              </span>
              <span className="mt-1 block text-[15px] leading-[1.45] text-[var(--muted)]">
                {PREVIOUS_COUNCIL_TAX_YEAR}: {exact.format(row.previousCouncilTax)} →{" "}
                {COUNCIL_TAX_YEAR}: {exact.format(row.councilTax)}
              </span>
            </span>
            <span className="text-right">
              <span className="display-stat block text-[20px] tnum text-[var(--action-text)]">
                +{exact.format(row.councilTaxRise)}
              </span>
              <span className="mt-1 block text-[15px] tnum text-[var(--muted)]">
                {percent.format(row.councilTaxRisePct)}%
              </span>
            </span>
          </Link>
        ))}
      </div>

      <H2 id="by-band">Council tax rises in Scotland by band</H2>
      <P>
        The percentage rise is the same in every band of a council, but the cash rise is not. A
        Band A home pays two thirds of the Band D charge, so its rise is two thirds as big. Larger
        homes in higher bands see the biggest cash increases.
      </P>
      <GuideTable
        kicker={`${PREVIOUS_COUNCIL_TAX_YEAR} to ${COUNCIL_TAX_YEAR}`}
        title="The smallest and largest cash rise in each band"
        columns={["Band", "Smallest rise", "Largest rise", "Largest, a month"]}
        align={["left", "left", "left", "right"]}
        rows={ranges.map(({ band, smallest: low, largest: high }) => [
          <Link key={band} href={councilTaxBandPath(band)}>
            Band {band}
          </Link>,
          `${exact.format(low.cash)}, ${COUNCIL_SEARCH_NAMES[low.slug]}`,
          `${exact.format(high.cash)}, ${COUNCIL_SEARCH_NAMES[high.slug]}`,
          exact.format(high.cash / 12),
        ])}
        caption="Council tax only, for a full year before discounts or Council Tax Reduction. A month is the yearly rise divided by 12. The largest cash rise is not always in the council with the largest percentage rise, because councils start from different charges."
      />

      <H2 id="what-it-means">What the percentages mean</H2>
      <P>
        The percentage tells you how much the same council tax band changed between the two
        published years. The cash figure often makes the effect easier to understand: it is the
        extra council tax due over a full year before any discount or Council Tax Reduction is
        applied.
      </P>
      <P>
        It is not an estimate based on a council announcement. Both sides of the comparison come
        from the Scottish Government&apos;s national council tax by band workbooks, using the
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
        both views: the council tax rise on its own, then the current council tax and current
        Scottish Water charges combined into the amount that appears on the bill.
      </P>

      <H2 id="next-year">Council tax 2027/28: when the next rise is set</H2>
      <P>
        Councils set their 2027/28 council tax at budget meetings in February and early March 2027,
        once the Scottish Budget has set their funding. Bills for the new year arrive from March. I
        will add every council&apos;s 2027/28 rise here once the national figures are published.
      </P>

      <H2 id="help">Help if the increase is hard to pay</H2>
      <P>A higher rate does not have to mean a higher bill for everyone. Check these first:</P>
      <UL>
        <LI>
          <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> can take up to{" "}
          {COUNCIL_TAX_REDUCTION.maxPercent}% off the council tax part of the bill on a low income.
        </LI>
        <LI>
          The <Link href="/single-person-discount-council-tax-scotland">single person discount</Link>{" "}
          takes {SINGLE_PERSON_DISCOUNT.percent}% off if only one adult lives in the home.
        </LI>
        <LI>
          Households on Council Tax Reduction also get up to {WATER_CHARGES_REDUCTION.maxPercent}% off{" "}
          <Link href="/water-rates-scotland">water charges</Link>, applied automatically.
        </LI>
        <LI>
          If your band looks wrong for your home, <Link href="/check-council-tax-band">check your
          council tax band</Link> before you think about an appeal.
        </LI>
      </UL>
      <P>
        If you have already fallen behind, contact the council before the arrears grow and ask for
        smaller instalments.
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
