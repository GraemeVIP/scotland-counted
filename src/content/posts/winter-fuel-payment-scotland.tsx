import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { PENSION_AGE_WINTER_HEATING as PA, WINTER_HEATING_PAYMENT as WHP } from "@/lib/data/benefits";
import { pounds } from "@/lib/data/quickAnswers";

export default function Post() {
  return (
    <Prose>
      <Lead>
        There&apos;s no Winter Fuel Payment in Scotland any more. Scotland has its own version
        called Pension Age Winter Heating Payment, paid by Social Security Scotland instead of the
        DWP. This winter it&apos;s between {pounds(PA.min, true)} and {pounds(PA.max, true)}, and
        most people get it without applying.
      </Lead>

      <H2 id="who">Winter fuel payment for pensioners: who gets it</H2>
      <P>For winter 2026 to 2027 you need to have:</P>
      <UL>
        <LI>been born on or before {PA.bornOnOrBefore}</LI>
        <LI>lived in Scotland on at least the last day of the qualifying week, {PA.qualifyingWeek}</LI>
      </UL>
      <P>
        You can be left out if you spent the whole qualifying week and the year before it in hospital
        getting free treatment, if you were in custody for the whole week, or if your visa says no
        public funds. Some people in care homes on means tested benefits aren&apos;t eligible either.
      </P>

      <H2 id="all-pensioners">Do all pensioners get winter fuel allowance?</H2>
      <P>
        Nearly all do, but not everyone keeps it. If your own income is over{" "}
        {pounds(PA.incomeThreshold)} a year, HMRC takes the payment back through the tax system.
        That&apos;s your income alone, not you and your partner together. So a couple where each has
        £20,000 keeps it.
      </P>

      <H2 id="how-much">How much is the winter fuel payment?</H2>
      <P>It depends on your age, who you live with and whether you get certain benefits.</P>
      <GuideTable
        kicker="Winter 2026 to 2027"
        title="Pension Age Winter Heating Payment"
        columns={["Your situation in the qualifying week", "You get"]}
        align={["left", "right"]}
        rows={[
          ["Living alone, aged up to 79", pounds(PA.under80, true)],
          ["Living alone, aged 80 or over", pounds(PA.over80, true)],
          ["Living with another eligible person, no qualifying benefits, both under 80", pounds(PA.sharedUnder80, true)],
          ["Living with another eligible person, no qualifying benefits, both 80 or over", pounds(PA.bothOver80Together, true)],
          ["Couple on a joint qualifying benefit like Pension Credit, both under 80", `${pounds(PA.under80, true)} shared`],
          ["Couple on a joint qualifying benefit, either of you 80 or over", `${pounds(PA.over80, true)} shared`],
        ]}
        caption="The qualifying benefits are Pension Credit, Universal Credit, income based Jobseeker's Allowance, income related ESA and Income Support. mygov.scot has an eligibility checker for other situations, including care homes."
      />

      <H2 id="when">When is the winter fuel payment paid?</H2>
      <P>
        Payments start from {PA.paidFrom} and carry on through winter. You get a letter first telling
        you how much. The money goes into the same account as your State Pension and shows on your
        statement with {PA.bankReference} in the reference.
      </P>
      <P>
        If you haven&apos;t been paid by {PA.chaseBy}, contact Social Security Scotland. A small
        number of people do have to apply, and the checker on mygov.scot tells you if that&apos;s you.
      </P>

      <H2 id="pip">Winter fuel payment and PIP</H2>
      <P>
        Getting PIP or <Link href="/adult-disability-payment">Adult Disability Payment</Link>{" "}
        doesn&apos;t change this payment. It&apos;s based on age and where you live. Disability can
        matter for a different payment though. If you&apos;re under pension age and on certain
        benefits, look at <Link href="/winter-heating-payment">Winter Heating Payment</Link>, which
        is {pounds(WHP.amount, true)} and also automatic.
      </P>

      <Aside title="Why Scotland's is different">
        <p>
          Some DWP benefits have been devolved to the Scottish Government and replaced with Social
          Security Scotland versions. Winter Fuel Payment is one. The name changed and Social Security
          Scotland pays it, but for most pensioners it still arrives on its own each winter.
        </p>
      </Aside>

      <PostCTA
        title="Check what you'll get"
        body="The mygov.scot checker asks your date of birth, who you live with and what benefits you get, then tells you the amount and whether you need to apply."
        href="https://www.mygov.scot/pension-age-winter-heating-payment"
        cta="Pension Age Winter Heating Payment"
      />
    </Prose>
  );
}
