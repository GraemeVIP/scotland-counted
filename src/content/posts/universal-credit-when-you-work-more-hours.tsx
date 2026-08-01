import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";

export default function Post() {
  return (
    <Prose>
      <Lead>
        Universal Credit can be paid when you are unemployed, working a few hours or working full
        time. There is no hours cut-off. The award changes with the take-home pay counted in each
        monthly assessment period.
      </Lead>

      <H2 id="short-answer">The short answer</H2>
      <P>
        More earnings always increase total income, but Universal Credit normally falls by 55p for
        each extra £1 counted. The household keeps the wage and receives a smaller benefit
        payment. If earnings rise far enough, the Universal Credit award reaches zero.
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
        It is applied separately in each assessment period. A benefits calculator is the safest
        way to test a real household because rent, children, childcare, disability and deductions
        all change the final award.
      </P>

      <H2 id="allowance">Who gets a work allowance</H2>
      <P>
        A work allowance is an amount you can earn before the taper starts. It normally applies
        only when you or your partner is responsible for a child or has a health condition that
        affects the ability to work.
      </P>
      <UL>
        <LI>£427 a month when Universal Credit includes help with housing costs.</LI>
        <LI>£710 a month when it does not include housing help.</LI>
        <LI>No work allowance for most claimants without children or a qualifying health condition.</LI>
      </UL>

      <H2 id="example">A simple example</H2>
      <P>
        Suppose a parent gets housing help and has £1,000 of take-home earnings in the assessment
        period. The first £427 is inside the work allowance. The remaining £573 is tapered:
        £573 × 55% = £315.15. The Universal Credit award is £315.15 lower than the maximum for that
        household.
      </P>
      <P>
        If the same parent earns another £100 net, Universal Credit falls by £55 and total income
        rises by £45 before any new work costs.
      </P>

      <H2 id="changes">Why payments jump around</H2>
      <P>
        Universal Credit is monthly but many wages are weekly, fortnightly or every four weeks.
        Some assessment periods can contain an extra payday. Overtime, a bonus or a changed pay
        date can also make one month’s recorded earnings unusually high.
      </P>
      <UL>
        <LI>Check the dates at the top of the assessment period.</LI>
        <LI>Compare them with the exact dates wages reached the account.</LI>
        <LI>Report an employer error through the online journal.</LI>
        <LI>Do not assume the following month will be identical.</LI>
      </UL>
      <P>
        Private renters also need to understand the separate <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">Local
        Housing Allowance cap on rent help</Link>. More Universal Credit does not automatically mean
        the full tenancy rent is covered.
      </P>

      <PostCTA
        title="Ask why work leaves so little extra"
        body="The Universal Credit taper and work-allowance rules are decided at Westminster. Enter your postcode and we find your MP, use your local evidence and prepare the email."
        href="/take-action"
        cta="Email my MP"
      />
    </Prose>
  );
}
