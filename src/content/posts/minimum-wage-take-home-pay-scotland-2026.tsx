import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import ToolCTA from "@/components/ToolCTA";
import { minimumWageTakeHome } from "@/lib/data/livingCosts";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function Post() {
  return (
    <Prose>
      <Lead>
        From 1 April 2026, the legal minimum for a worker aged 21 or over is £12.71 an hour.
        Scotland does not set a separate minimum wage, but Scottish income-tax bands change the
        take-home calculation.
      </Lead>

      <H2 id="rates">The 2026 hourly rates</H2>
      <UL>
        <LI>Age 21 and over: £12.71 an hour.</LI>
        <LI>Age 18 to 20: £10.85 an hour.</LI>
        <LI>Under 18: £8 an hour.</LI>
        <LI>Eligible apprentices: £8 an hour.</LI>
      </UL>
      <P>
        The apprentice rate applies when someone is under 19, or is 19 or over and still in the
        first year of the apprenticeship. After that, an apprentice aged 19 or over is due the
        minimum for their age.
      </P>

      <H2 id="full-time">What full-time adds up to</H2>
      <P>
        There is no official “minimum wage salary” because the law sets an hourly rate. To make it
        useful, I use 37.5 paid hours a week for all 52 weeks.
      </P>
      <BigStat
        value="£24,784.50"
        label="gross pay for a full year at £12.71 × 37.5 hours × 52 weeks"
        exact="That is £476.63 gross a week or £2,065.38 gross a month on average."
      />

      <H2 id="take-home">What reaches the bank</H2>
      <P>
        On that example, Scottish income tax is about {money.format(minimumWageTakeHome.tax)} and
        employee National Insurance is about {money.format(minimumWageTakeHome.ni)} for the year.
        The result is:
      </P>
      <BigStat
        value={money.format(minimumWageTakeHome.monthly)}
        label="average monthly take-home pay"
        exact={`${money.format(minimumWageTakeHome.annual)} for the year after tax and employee National Insurance.`}
      />
      <Aside title="This is an illustration, not a payslip promise">
        <p>
          Payroll is calculated in pay periods and can differ by a few pounds because of rounding,
          pension contributions, student loans, tax codes or other deductions. The important part
          is that every input and step here is shown.
        </p>
        <p>
          To put your own hours, pension, student loan or tax code in, use the{" "}
          <Link href="/take-home-pay-calculator-scotland">take-home pay calculator</Link>. It runs
          the same sum as this page, from the same tested code.
        </p>
      </Aside>

      <ToolCTA tool="take-home" className="my-10" />

      <H2 id="hours">Why your pay may be lower</H2>
      <P>
        “Full time” does not guarantee 37.5 paid hours every week. Retail, care, hospitality and
        cleaning jobs often use changing rotas. Unpaid breaks reduce the paid hours. Sick days,
        a quiet week or a contract with no guaranteed hours can reduce the annual total.
      </P>
      <P>
        Check paid hours rather than the length of the shift. If the hourly rate is below the legal
        minimum after allowed deductions, use the official pay checker or speak to Acas.
      </P>

      <H2 id="enough">Is it enough to live on?</H2>
      <P>
        A legal wage can still be below the cost of a decent basic life. Minimum Income Standard
        research found that a single adult working full time at the legal minimum reached only 76%
        of the amount the public considered necessary in 2025. A lone parent with two young
        children reached 69%.
      </P>
      <P>
        That is the difference between “the employer obeyed the wage law” and “the household has
        enough”. Read how the <Link href="/blog/real-living-wage-vs-minimum-wage-scotland">real Living
        Wage</Link> tries to close that gap, or see why <Link href="/blog/universal-credit-when-you-work-more-hours">Universal
        Credit changes as earnings rise</Link>.
      </P>

      <PostCTA
        title="Put the pay beside real Glasgow bills"
        body="The site works the same wage against rent, council tax, water and energy so the argument is based on the whole household budget, not one impressive-looking salary figure."
        href="/why-poverty-is-worse-in-glasgow"
        cta="See the Glasgow evidence"
      />
    </Prose>
  );
}
