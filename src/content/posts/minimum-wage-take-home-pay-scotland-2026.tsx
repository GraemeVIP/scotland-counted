import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import ToolCTA from "@/components/ToolCTA";
import { minimumWageTakeHome } from "@/lib/data/livingCosts";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { CITY_ORDER, CITY_PAY, FULL_TIME, PAY_HELP, minimumWageNext, minimumWageNow } from "@/lib/data/money";
import { calculate } from "@/lib/tax/engine";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const { current, next, history } = MINIMUM_WAGE;

const pence = (from: number, to: number) => `${Math.round((to - from) * 100)}p`;

const rateRows = [
  ["21 and over", current.over21, next.over21],
  ["18 to 20", current.age18to20, next.age18to20],
  ["16 and 17", current.under18, next.under18],
  ["Apprentice", current.apprentice, next.apprentice],
] as const;

/** Paid hours a week for the yearly pay table. */
const HOURS = [16, 20, 25, 30, FULL_TIME.hours, 40];

export default function Post() {
  const hourRows = HOURS.map((hours) => {
    const gross = current.over21 * hours * FULL_TIME.weeks;
    const result = calculate(gross, "scotland");
    return [
      `${hours} hours`,
      pounds(current.over21 * hours, true),
      pounds(gross),
      pounds(result.net),
      pounds(result.net / 12),
    ];
  });

  const historyRows = history.map((row, i) => [
    `1 April ${row.year}`,
    pounds(row.rate, true),
    i === 0 ? "" : pence(history[i - 1].rate, row.rate),
    pounds(row.rate * FULL_TIME.hours * FULL_TIME.weeks),
  ]);

  const englandTax = calculate(minimumWageNow.annual, "ruk").tax.total;
  const scottishSaving = englandTax - minimumWageNow.tax;

  return (
    <Prose>
      <Lead>
        The minimum wage in Scotland is {pounds(current.over21, true)} an hour from 1 April 2026 for
        workers aged 21 and over, and it rises to {pounds(next.over21, true)} on 1 April 2027.
        Scotland does not set a separate minimum wage, so the UK rates apply, but Scottish income
        tax bands change what you take home.
      </Lead>

      <H2 id="rates">Minimum wage Scotland 2026: every rate</H2>
      <P>
        Your rate depends on your age and whether you are an apprentice. These are the lowest
        hourly amounts any employer in Scotland can legally pay, before tax.
      </P>
      <GuideTable
        kicker="National Minimum Wage and National Living Wage"
        title="Minimum wage rates in Scotland"
        columns={["Who", "From 1 April 2026", "From 1 April 2027"]}
        align={["left", "right", "right"]}
        rows={rateRows.map(([label, now, then]) => [label, pounds(now, true), pounds(then, true)])}
        caption="Rates published on GOV.UK. The same rates apply in Scotland, England, Wales and Northern Ireland."
      />
      <P>
        The apprentice rate applies when someone is under 19, or is 19 or over and still in the
        first year of the apprenticeship. After that, an apprentice aged 19 or over is due the
        minimum for their age.
      </P>

      <H2 id="by-age">Minimum wage Scotland by age, from 16 to over 25</H2>
      <UL>
        <LI>
          <strong>Age 16 and 17:</strong> {pounds(current.under18, true)} an hour. You have to be
          past school leaving age to get the minimum wage.
        </LI>
        <LI>
          <strong>Age 18, 19 and 20:</strong> {pounds(current.age18to20, true)} an hour, rising to{" "}
          {pounds(next.age18to20, true)} in April 2027.
        </LI>
        <LI>
          <strong>Age 21 and over:</strong> {pounds(current.over21, true)} an hour. This top rate
          is the one officially called the National Living Wage.
        </LI>
        <LI>
          <strong>Over 25:</strong> there is no separate rate any more. Everyone aged 21 or over
          is due the same {pounds(current.over21, true)}.
        </LI>
      </UL>
      <P>
        The UK Government has said it wants to remove the lower adult rate, so that workers aged
        18 to 20 get the same as everyone over 21. It has left the pace of that change to the Low
        Pay Commission, so for now the 18 to 20 rate is still lower.
      </P>

      <H2 id="national-minimum-wage">National minimum wage Scotland and the National Living Wage</H2>
      <P>
        The National Minimum Wage and the National Living Wage are the same law. National Living
        Wage is just the name for the rate paid to workers aged 21 and over. The UK Government sets
        every rate for the whole UK each year, after advice from the Low Pay Commission.
      </P>
      <P>
        The adult rate is pegged to two thirds of typical hourly earnings across the UK. The
        Scottish Parliament cannot set a higher minimum wage, because employment law is reserved
        to Westminster.
      </P>
      <P>
        The real Living Wage is something else: a voluntary rate of {pounds(REAL_LIVING_WAGE.uk, true)}{" "}
        an hour worked out from living costs. See{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link> for how the two
        compare.
      </P>

      <H2 id="april-2027">What changes in April 2027</H2>
      <P>The UK Government has published the rates that apply from 1 April 2027:</P>
      <UL>
        <LI>Age 21 and over: {pounds(next.over21, true)} an hour, up {pence(current.over21, next.over21)}.</LI>
        <LI>Age 18 to 20: {pounds(next.age18to20, true)} an hour.</LI>
        <LI>Under 18: {pounds(next.under18, true)} an hour.</LI>
        <LI>Apprentices covered by the apprentice rate: {pounds(next.apprentice, true)} an hour.</LI>
      </UL>
      <P>
        On the same {FULL_TIME.hours} hour week, {pounds(next.over21, true)} an hour is{" "}
        {pounds(minimumWageNext.annual, true)} a year before tax,{" "}
        {pounds(minimumWageNext.annual - minimumWageNow.annual)} more than at the 2026 rate. What
        reaches the bank in 2027/28 also depends on the Scottish income tax bands, which the
        Scottish Government sets in its Budget. The full detail is on the{" "}
        <Link href="/minimum-wage-2027">minimum wage 2027</Link> page.
      </P>
      <GuideTable
        kicker="Age 21 and over"
        title="How the adult minimum wage has risen"
        columns={["From", "Hourly rate", "Rise", "Full time year"]}
        align={["left", "right", "right", "right"]}
        rows={historyRows}
        caption={`Full time year is ${FULL_TIME.hours} paid hours a week for ${FULL_TIME.weeks} weeks, before tax. Rates from GOV.UK.`}
      />

      <H2 id="full-time">Minimum wage Scotland yearly: full time and part time pay</H2>
      <P>
        There is no official &ldquo;minimum wage salary&rdquo; because the law sets an hourly rate.
        To make it useful, I use {FULL_TIME.hours} paid hours a week for all {FULL_TIME.weeks} weeks.
      </P>
      <BigStat
        value={pounds(minimumWageNow.annual, true)}
        label={`pay before tax for a full year at ${pounds(current.over21, true)} × ${FULL_TIME.hours} hours × ${FULL_TIME.weeks} weeks`}
        exact={`That is ${pounds(minimumWageNow.weekly, true)} a week or ${pounds(minimumWageNow.monthly, true)} a month before tax, on average.`}
      />
      <P>
        Many people on the minimum wage work part time. This table runs each week through the
        same tax engine as the site&apos;s calculator.
      </P>
      <GuideTable
        kicker={`At ${pounds(current.over21, true)} an hour, 2026/27`}
        title="Minimum wage pay in Scotland by hours worked"
        columns={["Hours a week", "A week", "A year before tax", "A year after tax", "A month after tax"]}
        align={["left", "right", "right", "right", "right"]}
        rows={hourRows}
        caption="After tax means after 2026/27 Scottish income tax and employee National Insurance, on a standard 1257L tax code with no pension or student loan. Paid for 52 weeks."
      />
      <P>
        Below £12,570 a year there is no income tax or National Insurance to pay, which is why
        the 16 hour row keeps every penny. For a fixed salary, see{" "}
        <Link href="/25000-after-tax-scotland">£25,000 after tax in Scotland</Link> or the{" "}
        <Link href="/average-salary-scotland">average salary in Scotland</Link>.
      </P>

      <H2 id="take-home">Minimum wage take home pay in Scotland</H2>
      <P>
        On the full time example, Scottish income tax is about {money.format(minimumWageTakeHome.tax)}{" "}
        and employee National Insurance is about {money.format(minimumWageTakeHome.ni)} for the
        year. The result is:
      </P>
      <BigStat
        value={money.format(minimumWageTakeHome.monthly)}
        label="average monthly take home pay"
        exact={`${money.format(minimumWageTakeHome.annual)} for the year after tax and employee National Insurance.`}
      />
      <P>
        Scotland&apos;s 19% starter rate means a full time worker on the minimum wage pays about{" "}
        {money.format(scottishSaving)} a year less income tax than the same worker in England.
        National Insurance is the same everywhere in the UK.
      </P>
      <Aside title="This is an illustration, not a payslip promise">
        <p>
          Payroll is calculated in pay periods and can differ by a few pounds because of rounding,
          pension contributions, student loans, tax codes or other deductions. The important part
          is that every input and step here is shown.
        </p>
        <p>
          To put your own hours, pension, student loan or tax code in, use the{" "}
          <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>. It runs
          the same sum as this page, from the same tested code.
        </p>
      </Aside>

      <ToolCTA tool="take-home" className="my-10" />

      <H2 id="hours">Why your pay may be lower</H2>
      <P>
        &ldquo;Full time&rdquo; does not guarantee {FULL_TIME.hours} paid hours every week. Retail,
        care, hospitality and cleaning jobs often use changing rotas. Unpaid breaks reduce the paid
        hours. Sick days, a quiet week or a contract with no guaranteed hours can reduce the annual
        total.
      </P>
      <P>
        Check paid hours rather than the length of the shift. If the hourly rate is below the legal
        minimum after allowed deductions, follow the steps below.
      </P>

      <H2 id="underpaid">What to do if you are paid below the minimum wage</H2>
      <UL>
        <LI>
          Work out your hourly rate: pay before tax for the pay period, divided by the paid hours in
          that period.
        </LI>
        <LI>
          Take off anything you had to buy for the job and were not paid back for, such as a
          uniform or tools. That counts against your pay when the minimum wage is checked.
        </LI>
        <LI>Keep payslips, rotas and messages about your hours.</LI>
        <LI>
          Call the Acas helpline on <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>,{" "}
          {PAY_HELP.acasHours}. The advice is free and confidential.
        </LI>
        <LI>
          <a href={PAY_HELP.complainUrl}>Complain through GOV.UK</a>. Minimum wage complaints go to
          HMRC, which can make the employer pay back arrears straight away. The employer also faces
          a fine and can be named by the government.
        </LI>
      </UL>

      <H2 id="cities">Minimum wage in Glasgow and other Scottish cities</H2>
      <P>
        The legal minimum is the same in every part of Scotland. What changes from city to city is
        rent, so the same wage stretches further in some places than others. Average one bedroom
        rents from the ONS for September 2026:
      </P>
      <UL>
        {CITY_ORDER.map((slug) => {
          const city = CITY_PAY[slug];
          return (
            <LI key={slug}>
              <Link href={city.path}>Minimum wage in {city.name}</Link>: one bedroom rent averages{" "}
              {pounds(city.rent.oneBed)} a month in the {city.rentArea} area.
            </LI>
          );
        })}
      </UL>

      <H2 id="enough">Is it enough to live on?</H2>
      <P>
        A legal wage can still be below the cost of a decent basic life. Minimum Income Standard
        research found that a single adult working full time at the legal minimum reached only 76%
        of the amount the public considered necessary in 2025. A lone parent with two young
        children reached 69%.
      </P>
      <P>
        That is the difference between &ldquo;the employer obeyed the wage law&rdquo; and &ldquo;the
        household has enough&rdquo;. Read how the <Link href="/real-living-wage-scotland">real Living
        Wage</Link> tries to close that gap, or see why <Link href="/blog/universal-credit-when-you-work-more-hours">Universal
        Credit changes as earnings rise</Link>.
      </P>

      <PostCTA
        title="Put the pay beside real Glasgow bills"
        body="The site works the same wage against rent, council tax, water and energy so the argument is based on the whole household budget, not one impressive looking salary figure."
        href="/why-poverty-is-worse-in-glasgow"
        cta="See the Glasgow evidence"
      />
    </Prose>
  );
}
