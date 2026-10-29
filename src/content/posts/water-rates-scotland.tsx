import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { BAND_LETTERS, waterCharges2026 } from "@/lib/data/councilTax";
import {
  SCOTTISH_WATER,
  SINGLE_PERSON_DISCOUNT,
  WATER_CHARGES_2025,
  WATER_CHARGES_REDUCTION,
} from "@/lib/data/councilTaxHelp";
import { bandDRange, pounds } from "@/lib/data/quickAnswers";
import { COUNCIL_SEARCH_NAMES, councilTaxBandPath, councilTaxPath } from "@/lib/routeMap";

const percent = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

const rows = BAND_LETTERS.map((band) => {
  const now = waterCharges2026[band];
  const before = WATER_CHARGES_2025[band];
  const total = now.water + now.wasteWater;
  const previous = before.water + before.wasteWater;
  return { band, ...now, total, previous, rise: total - previous, risePct: ((total - previous) / previous) * 100 };
});

export default function Post() {
  const a = rows[0];
  const d = rows[3];
  const { lowest, highest } = bandDRange();
  const shareOf = (bill: number) => `${percent.format((d.total / bill) * 100)}%`;
  const reducedA = a.total * (1 - WATER_CHARGES_REDUCTION.maxPercent / 100);

  return (
    <Prose>
      <Lead>
        In Scotland you don&apos;t get a separate water bill. Scottish Water charges for your water
        and for taking waste water away, the amount depends on your council tax band, and your
        council collects it on the council tax bill. For 2026/27 a Band D home pays{" "}
        {pounds(d.total, true)}.
      </Lead>

      <H2 id="charges">Water rates in Scotland by band for 2026/27</H2>
      <P>
        People still call them water rates. Officially they&apos;re Scottish Water&apos;s unmetered
        household charges, and there are two parts: water supply and waste water collection. These
        are the charges from 1 April 2026 to 31 March 2027.
      </P>
      <GuideTable
        kicker="2026/27"
        title="Water and waste water charges by band"
        columns={["Band", "Water", "Waste water", "Total a year", "About a month"]}
        align={["left", "right", "right", "right", "right"]}
        rows={rows.map((r) => [
          <Link key={r.band} href={councilTaxBandPath(r.band)}>
            Band {r.band}
          </Link>,
          pounds(r.water, true),
          pounds(r.wasteWater, true),
          pounds(r.total, true),
          pounds(r.total / 12, true),
        ])}
        caption="Scottish Water's unmetered household charges. A month is the yearly total divided by 12."
      />
      <P>
        If you&apos;re not sure which band you&apos;re in, you can{" "}
        <Link href="/check-council-tax-band">check your council tax band</Link> free by postcode.
      </P>

      <H2 id="same-everywhere">The same in every council</H2>
      <P>
        Council tax changes from one council to the next. Water doesn&apos;t. A Band D home pays{" "}
        {pounds(d.total, true)} for water in Shetland and exactly the same in Glasgow.
      </P>
      <P>
        Because council tax varies, water makes up a bigger slice of the bill in some places than
        others. At Band D it&apos;s {shareOf(lowest.total)} of the full bill in{" "}
        <Link href={councilTaxPath(lowest.slug)}>{COUNCIL_SEARCH_NAMES[lowest.slug]}</Link>, where
        the total is lowest, and {shareOf(highest.total)} in{" "}
        <Link href={councilTaxPath(highest.slug)}>{COUNCIL_SEARCH_NAMES[highest.slug]}</Link>, where
        it&apos;s highest. It&apos;s also why figures you see elsewhere often look too low. They quote
        the council tax and leave the water out.
      </P>

      <H2 id="rise">How much water rates went up this year</H2>
      <P>
        Every band went up by {percent.format(d.risePct)}% on last year. At Band D that&apos;s{" "}
        {pounds(d.rise, true)} more, from {pounds(d.previous, true)} in 2025/26 to{" "}
        {pounds(d.total, true)} now.
      </P>
      <GuideTable
        kicker="2025/26 to 2026/27"
        title="The rise in water charges"
        columns={["Band", "2025/26", "2026/27", "Rise"]}
        align={["left", "right", "right", "right"]}
        rows={rows.map((r) => [
          `Band ${r.band}`,
          pounds(r.previous, true),
          pounds(r.total, true),
          `${pounds(r.rise, true)} (${percent.format(r.risePct)}%)`,
        ])}
        caption="Water and waste water together. Council tax rose separately; each council set its own increase."
      />
      <P>
        The council tax part went up by different amounts in each council. The{" "}
        <Link href="/council-tax-increase-scotland">council tax increase</Link> page has every one.
      </P>

      <H2 id="help">Help with water charges</H2>
      <P>
        Most discounts on your council tax come off the water charges as well. Your council sorts
        that out, not Scottish Water.
      </P>
      <UL>
        <LI>
          <strong>Live alone?</strong> The {SINGLE_PERSON_DISCOUNT.percent}%{" "}
          <Link href="/single-person-discount-council-tax-scotland">single person discount</Link>{" "}
          comes off the water and waste water too.
        </LI>
        <LI>
          <strong>On a low income?</strong>{" "}
          <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> doesn&apos;t
          cover water. Even if your council tax drops to nothing, you still pay for water. But
          anyone getting it can get up to {WATER_CHARGES_REDUCTION.maxPercent}% off the water
          charges through the Water Charges Reduction Scheme. You don&apos;t apply. The council
          does it for you.
        </LI>
        <LI>
          <strong>All students?</strong> Full time students don&apos;t pay water charges, so a home
          where everyone is a full time student pays none.
        </LI>
        <LI>
          <strong>Adapted for a disabled person?</strong> If your council charges you one band
          lower because of a disability, the water charge drops to that lower band too.
        </LI>
      </UL>
      <BigStat
        value={pounds(reducedA, true)}
        label={`Band A water with the full ${WATER_CHARGES_REDUCTION.maxPercent}% reduction`}
        exact={`Down from ${pounds(a.total, true)} a year. This is the most the Water Charges Reduction Scheme takes off.`}
      />

      <H2 id="not-connected">Not on mains water or sewers?</H2>
      <P>
        You only pay for the services you get. If your home isn&apos;t connected to the public
        water supply, there should be no water charge. If it has a septic tank and nothing drains
        to a public sewer, there should be no waste water charge.
      </P>
      <P>
        Watch the small print, though. If the septic tank&apos;s outflow runs into a public sewer, or rain
        water from the property drains into one, you can still be charged for waste water.
      </P>
      <P>
        If you think you&apos;re paying for something you don&apos;t get, ask Scottish Water to
        check. It calls this a verification of service. If your septic tank is registered with
        SEPA, have that to hand, as it helps. If a charge is taken off with backdated effect and
        you&apos;re up to date with your council tax, you&apos;d normally get a refund. The details
        are on Scottish Water&apos;s{" "}
        <a href={SCOTTISH_WATER.faqUrl} target="_blank" rel="noopener noreferrer">
          charges questions page
        </a>
        .
      </P>

      <H2 id="meters">Water meters</H2>
      <P>
        You can ask for a water meter and pay for what you use instead. Scottish Water then bills
        you directly, not through the council.
      </P>
      <Aside title="Think before you switch">
        <p>
          Discounts, reductions and exemptions don&apos;t apply to metered charges. If you live
          alone or get Council Tax Reduction, you&apos;d lose that help on your water. Ring Scottish
          Water first on <a href={SCOTTISH_WATER.helplineHref}>{SCOTTISH_WATER.helpline}</a>, open{" "}
          {SCOTTISH_WATER.hours}.
        </p>
      </Aside>

      <PostCTA
        title="See your whole bill"
        body="Put in your postcode and pick your band. You'll see council tax, water and waste water for 2026/27, by the year and by the month."
        href="/council-tax-bands-scotland"
        cta="Check my council tax"
      />
    </Prose>
  );
}
