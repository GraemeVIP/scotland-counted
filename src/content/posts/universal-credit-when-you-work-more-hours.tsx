import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { benefitsComparison, universalCredit } from "@/lib/data/livingCosts";
import { MINIMUM_WAGE, pounds } from "@/lib/data/quickAnswers";
import { minimumWageNow } from "@/lib/data/money";

const TAPER = universalCredit.taper;
const WITH_HOUSING = benefitsComparison.workAllowanceWithHousing;
const WITHOUT_HOUSING = benefitsComparison.workAllowanceWithoutHousing;

/** The hours a week most claimants are expected to work or look for (Universal Credit Regulations 2013, reg 88). */
const EXPECTED_HOURS = 35;

/** Childcare costs element, GOV.UK, checked 29 October 2026. */
const CHILDCARE = { share: 85, oneChild: 1071.09, twoOrMore: 1836.16 };

const cut = (earnings: number, allowance: number) => Math.max(0, earnings - allowance) * TAPER;

export default function Post() {
  const exampleRows = [500, 1000, 1500, 2000].map((earnings) => [
    pounds(earnings),
    pounds(cut(earnings, 0), true),
    pounds(cut(earnings, WITH_HOUSING), true),
    pounds(cut(earnings, WITHOUT_HOUSING), true),
  ]);

  const net = minimumWageNow.netMonthly;
  const singleMax = universalCredit.standardAllowance;
  const singleCut = cut(net, 0);
  const parentMax = universalCredit.standardAllowance + universalCredit.childElement * 2;
  const parentCut = cut(net, WITH_HOUSING);
  const parentAward = Math.max(0, parentMax - parentCut);

  const threshold = (MINIMUM_WAGE.current.over21 * EXPECTED_HOURS * 52) / 12;

  return (
    <Prose>
      <Lead>
        There is no limit to how many hours you can work on Universal Credit. Your payment is
        worked out again each month from your take home pay, and it normally falls by 55p for each
        extra £1 you earn, so more hours always raise your total income. If earnings rise far
        enough, the award reaches zero.
      </Lead>

      <H2 id="short-answer">The short answer</H2>
      <P>
        Universal Credit can be paid when you are unemployed, working a few hours or working full
        time. More earnings always increase total income, but Universal Credit normally falls by
        55p for each extra £1 counted. The household keeps the wage and receives a smaller benefit
        payment.
      </P>
      <Aside title="This is why both sides of the argument can sound true">
        <p>
          It is wrong to say a person is financially better off refusing every extra hour. It is
          fair to say the reward can feel small: after the taper, only 45p of an extra £1 remains
          before travel, childcare or other work costs.
        </p>
      </Aside>

      <H2 id="taper">How the 55% taper works</H2>
      <BigStat
        value="55p"
        label="normally removed from Universal Credit for each £1 of counted earnings"
        exact="The household still keeps the other 45p, so working more raises total income."
      />
      <P>
        The calculation uses net earnings reported through payroll, not the headline gross salary.
        It is applied separately in each monthly assessment period. A benefits calculator is the
        safest way to test a real household because rent, children, childcare, disability and
        deductions all change the final award.
      </P>

      <H2 id="allowance">Who gets a work allowance</H2>
      <P>
        A work allowance is an amount you can earn before the taper starts. It normally applies
        only when you or your partner is responsible for a child or has a health condition that
        affects the ability to work.
      </P>
      <GuideTable
        kicker="2026/27"
        title="Universal Credit work allowance"
        columns={["Your situation", "You can earn, a month", "Then the taper starts"]}
        align={["left", "right", "left"]}
        rows={[
          ["Child or qualifying health condition, with help for housing costs", pounds(WITH_HOUSING), "55p off for each £1 above it"],
          ["Child or qualifying health condition, no help for housing costs", pounds(WITHOUT_HOUSING), "55p off for each £1 above it"],
          ["No children and no qualifying health condition", "£0", "55p off from the first £1"],
        ]}
        caption="GOV.UK. Earnings here mean take home pay after tax, National Insurance and pension contributions."
      />

      <H2 id="example">Worked examples</H2>
      <P>
        Suppose a parent gets housing help and has £1,000 of take home earnings in the assessment
        period. The first £427 is inside the work allowance. The remaining £573 is tapered:
        £573 × 55% = £315.15. The Universal Credit award is £315.15 lower than the maximum for that
        household.
      </P>
      <P>
        If the same parent earns another £100 net, Universal Credit falls by £55 and total income
        rises by £45 before any new work costs.
      </P>
      <GuideTable
        kicker="How much Universal Credit falls"
        title="The cut at different monthly earnings"
        columns={["Take home pay a month", "No work allowance", `${pounds(WITH_HOUSING)} allowance`, `${pounds(WITHOUT_HOUSING)} allowance`]}
        align={["left", "right", "right", "right"]}
        rows={exampleRows}
        caption="The figure is how much lower the award is than the household's maximum Universal Credit. Whatever is left of the maximum is still paid."
      />
      <P>
        Two households working full time at the legal minimum of{" "}
        {pounds(MINIMUM_WAGE.current.over21, true)} an hour, with about {pounds(net)} a month take
        home pay, show how different the result can be:
      </P>
      <UL>
        <LI>
          <strong>A single adult aged 25 or over, no children:</strong> no work allowance, so
          Universal Credit falls by about {pounds(singleCut)}. That is more than the{" "}
          {pounds(singleMax, true)} standard allowance, so nothing is paid unless there is help
          with rent on top.
        </LI>
        <LI>
          <strong>A single parent with two children and housing help:</strong> the maximum before
          rent is {pounds(parentMax, true)}, or a little more if the older child was born before
          6 April 2017. After the work allowance the cut is about{" "}
          {pounds(parentCut)}, so about {pounds(parentAward)} a month is still paid before any
          help with rent.
        </LI>
      </UL>

      <H2 id="working-hours">Universal Credit and working hours: what the jobcentre expects</H2>
      <P>
        The hours rule people worry about is not a cap on work. It is about how much work your work
        coach can ask you to look for.
      </P>
      <P>
        Most claimants are expected to work, or look for work, for {EXPECTED_HOURS} hours a week.
        Once you earn at least what {EXPECTED_HOURS} hours at the minimum wage for your age would
        pay, you normally have no work search requirements. For someone aged 21 or over in
        2026/27, that is about {pounds(threshold)} a month before tax. Earn less and your work
        coach can ask you to look for more hours or better paid work.
      </P>
      <P>
        The expected hours can be lower. A parent of a child under school age, or a carer, should
        only be asked to work hours that fit their caring. A parent of a child aged up to 12 should
        only be asked to work within school hours, including travel. Someone with a health
        condition or disability should only be asked to work hours that are reasonable for them.
      </P>

      <H2 id="overtime">Does overtime affect Universal Credit?</H2>
      <P>
        Yes. Overtime, bonuses and extra shifts all count as earnings in the assessment period they
        are paid in. A month with a lot of overtime usually means a smaller Universal Credit
        payment for that month.
      </P>
      <P>
        The taper still applies: for every extra £1 of take home overtime pay, Universal Credit
        falls by 55p and you keep 45p. If one big month takes your award to zero, the claim is not
        lost. If your earnings drop again within 6 months of your last payment, payments restart
        automatically without a new claim. After 6 months you need to apply again.
      </P>

      <H2 id="pay-rise">Getting a job or pay rise while on Universal Credit</H2>
      <UL>
        <LI>
          Your employer reports your pay to HMRC, and that feeds into your Universal Credit. You do
          not normally report each payslip yourself unless you are self employed, but check the
          earnings on your statement match your payslip.
        </LI>
        <LI>Tell the DWP through your online journal when you start a new job.</LI>
        <LI>Your payment falls as your pay rises, and stops when you earn enough.</LI>
        <LI>
          If you pay for childcare so you can work, Universal Credit can cover up to{" "}
          {CHILDCARE.share}% of the cost, up to {pounds(CHILDCARE.oneChild, true)} a month for one
          child or {pounds(CHILDCARE.twoOrMore, true)} for two or more.
        </LI>
        <LI>
          Check help that depends on Universal Credit. The{" "}
          <Link href="/scottish-child-payment">Scottish Child Payment</Link> needs a qualifying
          benefit such as Universal Credit, so ask Social Security Scotland what happens if your
          Universal Credit stops.{" "}
          <Link href="/council-tax-reduction-scotland">Council tax reduction</Link> is worked out
          separately, so check that too.
        </LI>
      </UL>

      <H2 id="changes">Why payments jump around</H2>
      <P>
        Universal Credit is monthly but many wages are weekly, fortnightly or every four weeks.
        Some assessment periods can contain an extra payday. Overtime, a bonus or a changed pay
        date can also make one month&apos;s recorded earnings unusually high.
      </P>
      <UL>
        <LI>Check the dates at the top of the assessment period.</LI>
        <LI>Compare them with the exact dates wages reached the account.</LI>
        <LI>Report an employer error through the online journal.</LI>
        <LI>Do not assume the following month will be identical.</LI>
      </UL>
      <P>
        In Scotland you can also ask for Universal Credit to be paid twice a month instead of once,
        and for the housing part to go straight to your landlord. These are called Scottish
        choices. They are offered after your first payment, and you can ask for them or change back
        through your journal.
      </P>
      <P>
        Private renters also need to understand the separate <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">Local
        Housing Allowance cap on rent help</Link>. More Universal Credit does not automatically mean
        the full tenancy rent is covered. For other help, see the guide to{" "}
        <Link href="/benefits">benefits in Scotland</Link>.
      </P>

      <PostCTA
        title="Ask why work leaves so little extra"
        body="The Universal Credit taper and work allowance rules are decided at Westminster. Enter your postcode and I find your MP, use your local evidence and prepare the email."
        href="/email-your-mp-and-msp"
        cta="Email my MP"
      />
    </Prose>
  );
}
