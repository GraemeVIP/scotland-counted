import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { WINTER_HEATING_PAYMENT as WHP } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Winter Heating Payment is a single payment of {pounds(WHP.amount, true)} from Social
        Security Scotland to help people on certain low income benefits heat their home. You
        don&apos;t apply. If you get the right benefit in the qualifying week, it just arrives.
      </Lead>

      <H2 id="who">Who gets winter heating payment</H2>
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
      <P>You can get more than one if you qualify for each.</P>

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
