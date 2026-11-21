import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { WINTER_HEATING_PAYMENT as WHP } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Winter Heating Payment in Scotland is a single payment of {pounds(WHP.amount, true)} from
        Social Security Scotland to help people on certain low income benefits heat their home. It
        replaced Cold Weather Payment in Scotland, and you don&apos;t need to apply. If you get a
        qualifying benefit in the qualifying week, it arrives automatically.
      </Lead>

      <H2 id="who">Who gets Winter Heating Payment in Scotland</H2>
      <P>
        The qualifying week this year is {WHP.qualifyingWeek}. If you got one of these at any point
        that week, you should be paid:
      </P>
      <UL>
        <LI>Pension Credit, with no other conditions</LI>
        <LI>
          Universal Credit, if you&apos;re not working and have limited capability for work, a
          disabled child or a child under 5. If you are working, you need a child disability element.
        </LI>
        <LI>
          Income Support or income based Jobseeker&apos;s Allowance, with a child under 5 or a
          disability, severe disability, pensioner or child disability premium
        </LI>
        <LI>
          Income related Employment and Support Allowance, with a child under 5, in the support
          group or work related activity group, or with a severe or enhanced disability premium or
          pensioner premium
        </LI>
        <LI>Support for Mortgage Interest, with a child under 5 or one of the premiums above</LI>
      </UL>

      <H2 id="when">When is it paid?</H2>
      <P>
        From {WHP.paidFrom} and through the winter. It doesn&apos;t depend on how cold it gets, which
        is the big change from the old Cold Weather Payment. You get a letter or email first, and it
        shows on your bank statement as {WHP.bankReference}.
      </P>
      <P>
        It doesn&apos;t affect any other benefit you get.
      </P>

      <H2 id="cold-weather">What happened to Cold Weather Payment in Scotland?</H2>
      <P>
        Cold Weather Payment ended in Scotland and was replaced by Winter Heating Payment. In
        England, Wales and Northern Ireland, Cold Weather Payment still pays £25 only when the local
        temperature stays at or below zero for seven days in a row.
      </P>
      <P>
        In Scotland, Winter Heating Payment pays a guaranteed {pounds(WHP.amount, true)} every
        winter to everyone who qualifies, no matter what the weather does. You do not need to check
        postcode temperatures or wait for a cold snap.
      </P>

      <H2 id="allowance">Winter heating allowance and the other winter payments</H2>
      <P>
        People search for winter heating allowance, but there are really three different payments
        in Scotland and it&apos;s easy to mix them up.
      </P>
      <UL>
        <LI>
          <strong>Winter Heating Payment</strong>, this one. {pounds(WHP.amount, true)} for people on
          certain low income benefits.
        </LI>
        <LI>
          <strong>Pension Age Winter Heating Payment</strong>, which replaced Winter Fuel Payment for
          pensioners. The details are on the{" "}
          <Link href="/winter-fuel-payment-scotland">winter fuel payment Scotland</Link> page.
        </LI>
        <LI>
          <strong>Child Winter Heating Payment</strong>, for families of children who get the highest
          care rate of a disability benefit.
        </LI>
      </UL>
      <P>
        You can get more than one if you qualify for each. You should also check the{" "}
        <Link href="/warm-home-discount-scotland">£150 Warm Home Discount in Scotland</Link> (which
        requires a direct supplier application for Scotland&apos;s Broader Group), the{" "}
        <Link href="/100-energy-payment-scotland">£100 energy payment in Scotland</Link> for homes in
        council tax bands A to D,{" "}
        <Link href="/social-security-scotland-payment-dates">Social Security Scotland payment dates</Link>{" "}
        around <Link href="/scotland-bank-holidays">Scottish bank holidays</Link>, and how the{" "}
        <Link href="/energy-price-cap-scotland">energy price cap in Scotland</Link> affects winter bills.
      </P>

      <Aside title="If you think you missed it">
        <p>
          Social Security Scotland looks at your data again if it didn&apos;t trigger a payment. If
          you&apos;re still worried you should have been paid, you can send them a request through
          mygov.scot and they&apos;ll either pay you or write to explain why not.
        </p>
      </Aside>

      <PostCTA
        title="Struggling with energy bills now?"
        body="If you can't wait for winter payments, your council's crisis grant can help with heating in an emergency. Every council's number is on one page."
        href="/crisis-grant-phone-number"
        cta="Crisis grant phone numbers"
      />
    </Prose>
  );
}
