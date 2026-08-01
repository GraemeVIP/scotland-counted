import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        From 1 July to 30 September 2026, Ofgem’s headline price-cap figure is £1,862 a year for a
        typical dual-fuel household paying by Direct Debit. A home can still pay much more or much
        less.
      </Lead>

      <H2 id="not-a-bill-cap">Why it is not a cap on the bill</H2>
      <P>
        Ofgem limits the unit rate for each kilowatt hour and the daily standing charge on a
        default tariff. The £1,862 figure applies those rates to an assumed amount of gas and
        electricity. It is a comparison tool, not a maximum invoice.
      </P>
      <UL>
        <LI>Use more energy and the bill can be higher than £1,862.</LI>
        <LI>Use less and it can be lower.</LI>
        <LI>A fixed tariff follows the contract rate instead of changing with this cap period.</LI>
      </UL>

      <H2 id="rates">The current rates</H2>
      <BigStat
        value="13% higher"
        label="the typical-use cap illustration from July 2026 compared with the previous quarter"
        exact="Ofgem's typical annual figure is £1,862 for July to September 2026."
      />
      <P>
        The average Direct Debit rates used by Ofgem are 26.11p per kWh for electricity and 7.33p
        for gas. Actual regional rates differ, and prepayment or paying on receipt of a bill can
        produce different numbers.
      </P>

      <H2 id="standing">The standing charge</H2>
      <P>
        A standing charge is paid for each day the supply is connected, even if almost no energy
        is used. The July 2026 averages are 57.19p a day for electricity and 29.04p for gas. That
        is roughly £315 a year before buying a unit of energy.
      </P>
      <Aside title="Why turning everything off cannot make the bill zero">
        <p>
          Cutting use reduces the unit part. It does not remove the standing charge. That matters
          most to a low-use household because the fixed daily amount takes a larger share of the
          bill.
        </p>
      </Aside>

      <H2 id="who">Who the cap covers</H2>
      <P>
        The cap covers domestic default tariffs in Scotland, England and Wales. It does not set the
        price of heating oil, bottled gas or communal heat networks. A fixed deal is also governed
        by its contract while it lasts.
      </P>
      <P>
        Check the tariff name, payment method, unit rates and standing charges on the bill. Do not
        compare only the monthly Direct Debit: suppliers can change that payment to catch up with
        debt or build credit even when the tariff rates stay the same.
      </P>

      <H2 id="help">If you cannot afford energy</H2>
      <UL>
        <LI>Contact the supplier early and ask for an affordable repayment plan.</LI>
        <LI>Ask whether grants, hardship funds or the Warm Home Discount apply.</LI>
        <LI>Give meter readings so estimates do not hide the real position.</LI>
        <LI>In an immediate emergency, check the <Link href="/blog/crisis-grant-scotland-how-to-apply">Scottish Crisis Grant</Link>.</LI>
      </UL>
      <P>
        Lower inflation does not undo the price rises already built into energy, food and rent.
        Read <Link href="/blog/why-food-prices-stay-high-when-inflation-falls">why prices stay high
        when inflation falls</Link>.
      </P>

      <PostCTA
        title="Energy rules are set at Westminster"
        body="Ofgem and UK energy policy sit with your MP. Enter your postcode and we find the right person, add the facts and prepare the email."
        href="/take-action"
        cta="Email my MP"
      />
    </Prose>
  );
}
