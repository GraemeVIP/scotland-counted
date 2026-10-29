import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { BAND_LETTERS, COUNCIL_TAX_YEAR, councilTaxByBand, waterCharges2026 } from "@/lib/data/councilTax";
import {
  BAND_PROPOSALS,
  COUNCIL_TAX_REDUCTION,
  HIGH_VALUE_BANDS,
  SCOTTISH_ASSESSORS,
  SINGLE_PERSON_DISCOUNT,
  WATER_CHARGES_REDUCTION,
  bandValueLabel,
} from "@/lib/data/councilTaxHelp";
import { bandDRange, bandFor, pounds } from "@/lib/data/quickAnswers";
import { COUNCIL_SEARCH_NAMES, councilTaxBandPath, councilTaxPath } from "@/lib/routeMap";

const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

/** The worked example: a Band C home in Glasgow. */
const EXAMPLE = { slug: "glasgow-city", band: "C" as const };

/** Councils linked from the "how much" section. */
const LINKED_COUNCILS = ["glasgow-city", "city-of-edinburgh", "fife", "north-lanarkshire", "south-lanarkshire", "aberdeen-city"];

const waterFor = (band: (typeof BAND_LETTERS)[number]) => waterCharges2026[band].water + waterCharges2026[band].wasteWater;

export default function Post() {
  const glasgow = councilTaxByBand[EXAMPLE.slug];
  const shares = BAND_LETTERS.map((band) => ({ band, share: (glasgow[band] / glasgow.D) * 100 }));
  const example = bandFor(EXAMPLE.slug, EXAMPLE.band);
  const exampleWater = waterCharges2026[EXAMPLE.band];
  const exampleName = COUNCIL_SEARCH_NAMES[EXAMPLE.slug];
  const { lowest, highest, count } = bandDRange();
  const singleShare = 1 - SINGLE_PERSON_DISCOUNT.percent / 100;

  return (
    <Prose>
      <Lead>
        Council tax in Scotland works in three steps. The Assessor puts your home in a band from A
        to H based on what it was worth on 1 April 1991, your council sets a yearly charge for each
        band, and Scottish Water adds water and waste water charges to the same bill. Discounts and
        Council Tax Reduction then come off.
      </Lead>

      <Aside title="Want the price, not the explanation?">
        <p>
          Use the <Link href="/council-tax-bands-scotland">Scottish council tax checker</Link>.
          Enter your postcode to find your council automatically, then choose the band shown on
          your bill or on the Scottish Assessors website.
        </p>
      </Aside>

      <H2 id="what-it-pays-for">1. What council tax pays for</H2>
      <P>
        Council tax goes to your local council. It helps pay for local services such as bin
        collections, roads, schools, social care and keeping public places running. It does not
        buy you a personal share of each service. It is a local tax used across the council area.
      </P>
      <P>
        Councils also receive money from the Scottish Government and other sources. That is why
        the council tax bill is important, but it is not the whole council budget.
      </P>

      <H2 id="who-pays">2. Who pays: is council tax per person or household?</H2>
      <P>
        Council tax is charged per home, not per person. A full bill assumes at least two adults
        live there. If only one adult counts, the bill drops by {SINGLE_PERSON_DISCOUNT.percent}%,
        but a third or fourth adult does not make it any higher.
      </P>
      <P>
        Usually the adults who own or rent and live in the property are responsible. Couples who
        live together can both be responsible even when only one name appears first on the letter.
        In a house where separate households rent individual rooms and share facilities, the owner
        may be responsible instead. If a bill names the wrong person, contact the council rather
        than ignoring it.
      </P>

      <H2 id="band">3. What determines your council tax band</H2>
      <P>
        Every home sits in a band from A to H. Band A is the lowest and H is the highest. In
        Scotland the band is based on what the property could have sold for on 1 April 1991, not
        what it is worth today and not what you paid for it. The band then sets what share of the
        council&apos;s Band D charge you pay.
      </P>
      <GuideTable
        kicker="Every Scottish council"
        title="Council tax bands in Scotland"
        columns={["Band", "Value on 1 April 1991", "Share of the Band D charge"]}
        align={["left", "left", "right"]}
        rows={shares.map(({ band, share }) => [
          <Link key={band} href={councilTaxBandPath(band)}>
            Band {band}
          </Link>,
          bandValueLabel(band),
          `${percent.format(share)}%`,
        ])}
        caption="The shares are set nationally and are the same in every council. The values are the open market value of the home in 1991."
      />
      <P>
        A postcode cannot tell you the exact band because neighbouring properties can differ. Look
        up the address free on the <a href={SCOTTISH_ASSESSORS.url}>Scottish Assessors</a> website,
        or follow the steps to <Link href="/check-council-tax-band">check your council tax band</Link>.
      </P>
      <P>
        Lothian Valuation Joint Board says two new bands, I and J, are due from{" "}
        {HIGH_VALUE_BANDS.start} for homes worth more than {pounds(HIGH_VALUE_BANDS.bandIFrom)} on{" "}
        {HIGH_VALUE_BANDS.valuationDate}. Every other home stays in its current band.
      </P>

      <H2 id="bill">4. How is council tax calculated in Scotland?</H2>
      <P>
        Each council sets one main figure: its Band D charge. Every other band is a fixed share of
        Band D, shown in the table above. A Band A home pays two thirds of the Band D charge and a
        Band H home pays almost two and a half times it. The shares are national, but each council
        chooses its own Band D starting point.
      </P>
      <GuideTable
        kicker="Worked example"
        title={`Band ${EXAMPLE.band} in ${exampleName}, ${COUNCIL_TAX_YEAR}`}
        columns={["Line on the bill", "Amount"]}
        align={["left", "right"]}
        rows={[
          ["Council tax", pounds(example.councilTax, true)],
          ["Water", pounds(exampleWater.water, true)],
          ["Waste water", pounds(exampleWater.wasteWater, true)],
          ["Total for the year", pounds(example.total, true)],
          ["Each of 10 monthly payments", pounds(example.total / 10, true)],
          ["Each of 12 monthly payments", pounds(example.total / 12, true)],
          [`Total with the ${SINGLE_PERSON_DISCOUNT.percent}% single person discount`, pounds(example.total * singleShare, true)],
        ]}
        caption="Before any Council Tax Reduction. The single person discount also comes off the water charges."
      />
      <P>
        Most councils collect the bill in 10 monthly payments, from April to January. Many, such as
        Highland, will spread it over 12 months if you ask in advance.
      </P>

      <H2 id="how-much">5. How much is council tax in Scotland?</H2>
      <P>
        There is no single Scottish figure, because each council sets its own rate. In{" "}
        {COUNCIL_TAX_YEAR}, the full Band D bill with water runs from{" "}
        {pounds(lowest.total, true)} in {lowest.name} to {pounds(highest.total, true)} in{" "}
        {highest.name}, across all {count} councils.
      </P>
      <P>
        See every band for{" "}
        {LINKED_COUNCILS.map((slug, i) => (
          <span key={slug}>
            {i > 0 && (i === LINKED_COUNCILS.length - 1 ? " and " : ", ")}
            <Link href={councilTaxPath(slug)}>{COUNCIL_SEARCH_NAMES[slug]}</Link>
          </span>
        ))}
        , or use the <Link href="/council-tax-bands-scotland">council tax checker</Link> for all 32
        councils. This year&apos;s changes are in the{" "}
        <Link href="/council-tax-increase-scotland">council tax increase in every council</Link>.
      </P>

      <H2 id="water">6. Is water included in council tax in Scotland?</H2>
      <P>
        It is on the same bill, but it is not council tax. Most Scottish households pay Scottish
        Water through the council tax bill. The council collects the money, but Scottish Water sets
        the water and waste water charges. In {COUNCIL_TAX_YEAR} they add{" "}
        {pounds(waterFor("A"), true)} a year at Band A and {pounds(waterFor("D"), true)} at Band D.
        The full table is in{" "}
        <Link href="/water-rates-scotland">water rates Scotland</Link>.
      </P>
      <Aside title="Why online figures often look too low">
        <p>
          Many pages quote only the council tax part. The bill through your door normally includes
          council tax, water and waste water. My calculator shows all three separately and then
          gives the total.
        </p>
      </Aside>

      <H2 id="discounts">7. Discounts and exemptions</H2>
      <P>You may not owe the full bill. Common routes include:</P>
      <UL>
        <LI>
          A {SINGLE_PERSON_DISCOUNT.percent}% discount when only one adult in the home is counted.
          See the{" "}
          <Link href="/single-person-discount-council-tax-scotland">single person discount</Link>{" "}
          guide.
        </LI>
        <LI>No council tax when every resident is a qualifying full time student.</LI>
        <LI>A lower band charge when the home has qualifying disability adaptations.</LI>
        <LI>Discounts or exemptions where someone has a severe mental impairment.</LI>
      </UL>
      <P>
        The council will not always know automatically. Ask it to check every discount and
        exemption that may fit the household, and tell it when circumstances change.
      </P>

      <H2 id="reduction">8. Help when your income is low</H2>
      <P>
        Council Tax Reduction is means tested help run by your council under a Scottish scheme. It
        can remove up to {COUNCIL_TAX_REDUCTION.maxPercent}% of the council tax charge. The decision
        depends on income, savings, benefits, children, disability and who else lives with you.
        Savings over {pounds(COUNCIL_TAX_REDUCTION.savingsLimit)} usually rule you out, unless you
        get Guarantee Credit. The{" "}
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction Scotland</Link> guide
        explains who qualifies and how to claim.
      </P>
      <P>
        A zero council tax charge does not always mean a zero bill because water can remain.
        Households receiving Council Tax Reduction can also get up to{" "}
        {WATER_CHARGES_REDUCTION.maxPercent}% off water and waste water through a scheme the council
        applies automatically.
      </P>

      <H2 id="challenge">9. Challenging a band</H2>
      <P>
        The Assessor sets the band, not the council. A challenge in Scotland is called a proposal.
        One clear route is to submit it within {BAND_PROPOSALS.newOwnerMonths} months of becoming
        the owner or the person responsible for the bill. Other routes exist after a banding
        notice, a relevant tribunal decision or a material change to the property or area.
      </P>
      <P>
        Compare genuinely similar homes before applying: same type, size, position and history. A
        review can leave the band unchanged and can expose evidence that another property should
        move up, so do not submit a guess based only on a current online valuation. The steps are
        in <Link href="/check-council-tax-band">check council tax band</Link>.
      </P>

      <H2 id="moving">10. Moving home or missing payments</H2>
      <H3>When you move</H3>
      <P>
        Tell the old and new councils promptly. Give the moving date, both addresses and the names
        of the adults moving. Owners should also say whether the old home is empty, sold or rented
        out. Keep the closing and opening bills so overlapping dates can be corrected.
      </P>
      <H3>If you cannot pay</H3>
      <P>
        Council tax is a priority debt. Contact the council as soon as you know a payment will be
        missed. Ask for smaller instalments and a full check of reduction, discounts and
        exemptions. If the emergency is immediate, a <Link href="/crisis-grant-scotland">crisis
        grant</Link> may help with food or heating while you deal with the bill.
      </P>

      <H2 id="empty-homes">11. Empty homes and second homes</H2>
      <P>
        Councils have discretion over many empty and second home charges. A home empty for long
        enough can face an increase of up to 100%, but important exemptions remain, including
        some homes being sold or let, properties under structural repair, and homes left empty
        because the owner is in long term care, hospital or prison.
      </P>
      <P>
        These rules depend on the reason, dates and the council&apos;s policy. Tell the council
        rather than assuming an empty property owes nothing.
      </P>

      <PostCTA
        title="See the bill for your own area"
        body="Enter your postcode, choose your band and see council tax, water, waste water and the monthly total. The calculator covers every Scottish council without making you know the council name first."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
