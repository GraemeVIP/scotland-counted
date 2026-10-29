import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { BAND_LETTERS, councilTaxByBand } from "@/lib/data/councilTax";
import {
  BAND_PROPOSALS,
  HIGH_VALUE_BANDS,
  SCOTTISH_ASSESSORS,
  bandValueLabel,
} from "@/lib/data/councilTaxHelp";
import { pounds } from "@/lib/data/quickAnswers";
import { councilTaxBandPath, councilTaxPath, postPath } from "@/lib/routeMap";

/** Each band as a share of Band D. The ratios are set by law, so any council gives the same answer. */
const glasgow = councilTaxByBand["glasgow-city"];
const shareOfD = (band: string) => `${Math.round((glasgow[band] / glasgow.D) * 100)}%`;

export default function Post() {
  return (
    <Prose>
      <Lead>
        Your council tax band is set by the Assessor, not the council. You can check it free on the
        Scottish Assessors Association website in about a minute, using your postcode. The
        band is also printed on your council tax bill.
      </Lead>

      <H2 id="find">Find my council tax band on the Scottish Assessors site</H2>
      <P>
        Every home in Scotland is on one public list, kept by the local Assessor. The Scottish
        Assessors Association puts the whole list online in one place.
      </P>
      <UL>
        <LI>
          Go to{" "}
          <a href={SCOTTISH_ASSESSORS.url} target="_blank" rel="noopener noreferrer">
            saa.gov.uk
          </a>
          .
        </LI>
        <LI>Use the council tax bands search on the home page. Type your postcode or address.</LI>
        <LI>Pick your home from the list. The band shows next to the address.</LI>
      </UL>
      <P>
        The list shows the band only. It doesn&apos;t show the value the Assessor put on the home,
        so you won&apos;t find a price on there.
      </P>
      <H3>If your home isn&apos;t listed</H3>
      <P>
        A new build can take a while to appear. Contact the Assessor for your area so the home gets
        added and banded. Once it is, the owner and whoever pays the bill get a banding notice in
        the post.
      </P>

      <H2 id="check-my-band">Check my council tax band against my bill</H2>
      <P>
        Your band is printed on your council tax bill. If the bill and the Assessor&apos;s list
        don&apos;t match, phone the council and ask why. You don&apos;t want to pay for a higher
        band by accident.
      </P>
      <P>
        Once you know your band, you can see exactly what it costs where you live. I&apos;ve put
        every council on its own page, for example{" "}
        <Link href={councilTaxPath("glasgow-city")}>Glasgow council tax bands</Link> and{" "}
        <Link href={councilTaxPath("city-of-edinburgh")}>Edinburgh council tax bands</Link>, with
        the water charges included.
      </P>

      <H2 id="bands">What the bands mean</H2>
      <P>
        There are eight bands, A to H. Your band depends on what the home would have sold for on
        the open market on 1 April 1991. Not what it&apos;s worth now, and not what you paid for
        it. That&apos;s why two homes worth the same today can sit in different bands.
      </P>
      <GuideTable
        kicker="Scotland only"
        title="Council tax bands and 1991 values"
        columns={["Band", "Value on 1 April 1991", "Bill compared with Band D"]}
        align={["left", "left", "right"]}
        rows={BAND_LETTERS.map((band) => [
          <Link key={band} href={councilTaxBandPath(band)}>
            Band {band}
          </Link>,
          bandValueLabel(band),
          shareOfD(band),
        ])}
        caption="Each council sets a Band D charge and the other bands are fixed shares of it. England and Wales use different values. Pick a band to see what it costs in every council."
      />
      <P>
        Band D is the one councils use as their headline figure, and the{" "}
        <Link href={councilTaxBandPath("D")}>council tax band D Scotland</Link> page compares it
        across all 32 councils.
      </P>
      <Aside title="Two new bands are on the way">
        <p>
          Lothian Valuation Joint Board says Bands I and J are due from {HIGH_VALUE_BANDS.start}.
          They only affect homes worth more than {pounds(HIGH_VALUE_BANDS.bandIFrom)} on{" "}
          {HIGH_VALUE_BANDS.valuationDate}. If your home is worth less than that, you stay in
          Bands A to H.
        </p>
      </Aside>

      <H2 id="appeal">How to appeal your council tax band</H2>
      <P>
        In Scotland an appeal is called a proposal, and it goes to the Assessor, not the council.
        You can only make one at certain times. The main ones are:
      </P>
      <UL>
        <LI>
          within {BAND_PROPOSALS.newOwnerMonths} months of becoming the owner, or the person who
          pays the bill
        </LI>
        <LI>within {BAND_PROPOSALS.newOwnerMonths} months of the Assessor changing the band</LI>
        <LI>
          within {BAND_PROPOSALS.newOwnerMonths} months of an appeal decision on a similar home
          that suggests yours is wrong too
        </LI>
        <LI>
          at any time if the home has dropped in value because part of it was knocked down, the
          area around it physically changed, or it was adapted for a disabled person
        </LI>
      </UL>
      <P>
        If you&apos;ve just moved in, that first window is the one that matters. Miss it and you
        usually can&apos;t appeal later just because you think the band is too high. A fall in
        house prices doesn&apos;t count either.
      </P>
      <H3>How to make a proposal</H3>
      <P>
        The easiest way is on the Scottish Assessors site. Find your home, click it, and use the{" "}
        &quot;Make a proposal&quot; button. You can also ask your local Assessor for a paper form.
        Before you send it, it helps to look up the bands of similar homes nearby: same type, same
        size, same street.
      </P>
      <H3>What happens next</H3>
      <UL>
        <LI>Keep paying your council tax as normal while the Assessor looks at it.</LI>
        <LI>The Assessor has {BAND_PROPOSALS.assessorMonths} months to decide.</LI>
        <LI>
          Most are settled with the Assessor. If not, you can take it to an independent tribunal,
          the {BAND_PROPOSALS.tribunal}. You have {BAND_PROPOSALS.tribunalMonths} months and{" "}
          {BAND_PROPOSALS.tribunalWeeks} weeks from the day the Assessor got your proposal.
        </LI>
      </UL>
      <Aside title="Bought a home that was extended?">
        <p>
          If the last owner built an extension or made other big changes, the Assessor can review
          the band when the home sells. It may go up from the date of sale. Work you do yourself
          doesn&apos;t change the band until the home is next sold.
        </p>
      </Aside>

      <H2 id="council-tax-check">Council tax check Scotland: is your bill right?</H2>
      <P>Once you&apos;ve got your band, these are the four things I&apos;d check on the bill.</P>
      <UL>
        <LI>
          <strong>The band.</strong> Same as the Assessor&apos;s list?
        </LI>
        <LI>
          <strong>The rate.</strong> Does it match your council&apos;s charge for that band? Every
          council is on the <Link href="/council-tax-bands-scotland">council tax bands Scotland</Link>{" "}
          checker.
        </LI>
        <LI>
          <strong>The water.</strong> Water and waste water are added to the same bill. The{" "}
          <Link href="/water-rates-scotland">water rates Scotland</Link> page shows what each band
          pays.
        </LI>
        <LI>
          <strong>The discounts.</strong> Live alone? You should get the{" "}
          <Link href="/single-person-discount-council-tax-scotland">single person discount</Link>.
          On a low income? Ask about{" "}
          <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link>.
        </LI>
      </UL>
      <P>
        If you want the full picture of how the bill fits together, my guide on{" "}
        <Link href={postPath("how-council-tax-works-scotland")}>how council tax works in Scotland</Link>{" "}
        covers it, and the <Link href="/council-tax-increase-scotland">council tax increase</Link>{" "}
        page shows how much each council put it up this year.
      </P>

      <PostCTA
        title="Know your band? See what it costs"
        body="Put in your postcode, pick your band and see council tax, water and waste water for 2026/27, by the year and by the month."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
