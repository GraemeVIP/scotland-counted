import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import {
  BANK_HOLIDAY_PAYMENT_DATES,
  PENSION_AGE_WINTER_HEATING as PA,
  SOCIAL_SECURITY_SCOTLAND as SSS,
  WINTER_HEATING_PAYMENT as WHP,
} from "@/lib/data/benefits";

const christmas = BANK_HOLIDAY_PAYMENT_DATES.filter(({ due }) => /December 2026|January 2027/.test(due));

export default function Post() {
  return (
    <Prose>
      <Lead>
        Social Security Scotland pays most benefits every four weeks, on a date set by when your
        award started. When that date lands on a bank holiday, you&apos;re paid early. Over
        Christmas 2026, anything due from 24 to 28 December comes on Wednesday 23 December, and
        anything due on 1 or 4 January comes on Thursday 31 December.
      </Lead>

      <H2 id="christmas">Christmas 2026 payment dates</H2>
      <GuideTable
        kicker="Christmas and New Year"
        title="Payments moved for the holidays"
        columns={["Due on", "Paid on"]}
        rows={christmas.map(({ due, paid }) => [due, paid])}
        caption="Covers Adult Disability Payment, Carer Support Payment, Child Disability Payment, Pension Age Disability Payment, Scottish Child Payment and Scottish Adult DLA."
      />
      <P>
        The early payment is the same money, not extra. That means a longer gap until the next one in
        January, which catches a lot of people out. I&apos;d plan for the money landing on the 23rd
        to last into the middle of January.
      </P>

      <H2 id="all">Every bank holiday change to 2028</H2>
      <GuideTable
        title="All published bank holiday dates"
        columns={["Due on", "Paid on"]}
        rows={BANK_HOLIDAY_PAYMENT_DATES.map(({ due, paid }) => [due, paid])}
      />

      <H2 id="normal">How your normal payment date works</H2>
      <UL>
        <LI>
          <Link href="/adult-disability-payment">Adult Disability Payment</Link>: every four weeks,
          in arrears. Weekly in advance if you&apos;re terminally ill.
        </LI>
        <LI>
          <Link href="/carer-support-payment">Carer Support Payment</Link>: every four weeks, at the
          end of the four weeks, with the Scottish Carer Supplement included.
        </LI>
        <LI>
          <Link href="/scottish-child-payment">Scottish Child Payment</Link>: every four weeks.
        </LI>
        <LI>
          Best Start Foods: every four weeks onto your card. Bank holidays don&apos;t move it.
        </LI>
        <LI>
          <Link href="/winter-fuel-payment-scotland">Pension Age Winter Heating Payment</Link>: once,
          from {PA.paidFrom}.
        </LI>
        <LI>
          <Link href="/winter-heating-payment">Winter Heating Payment</Link>: once, from{" "}
          {WHP.paidFrom}.
        </LI>
      </UL>
      <P>
        Your own date is on your award letter. If you&apos;ve lost it, ring {SSS.phone} and they can
        tell you.
      </P>

      <Aside title="UK government benefits are separate">
        <p>
          Universal Credit, State Pension and other DWP benefits follow the DWP&apos;s own bank holiday
          dates, not these. Check those on GOV.UK.
        </p>
      </Aside>

      <PostCTA
        title="Short of money before payday?"
        body="If the gap after Christmas leaves you without food or heating, your council can give a crisis grant you don't pay back."
        href="/crisis-grant-phone-number"
        cta="Find your council's number"
      />
    </Prose>
  );
}
