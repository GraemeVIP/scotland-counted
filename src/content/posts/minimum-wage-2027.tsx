import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { FULL_TIME, PAY_HELP, CITY_ORDER, CITY_PAY, livingWageGap, minimumWageNext, minimumWageNow } from "@/lib/data/money";
import { calculate } from "@/lib/tax/engine";

const { current, next } = MINIMUM_WAGE;

const pct = (from: number, to: number) => `${(((to - from) / from) * 100).toFixed(1)}%`;
const pence = (from: number, to: number) => `${Math.round((to - from) * 100)}p`;

const rateRows = [
  ["21 and over", current.over21, next.over21],
  ["18 to 20", current.age18to20, next.age18to20],
  ["Under 18", current.under18, next.under18],
  ["Apprentice", current.apprentice, next.apprentice],
] as const;

export default function Post() {
  const grossRise = minimumWageNext.annual - minimumWageNow.annual;
  const netRise = minimumWageNext.net - minimumWageNow.net;
  const keptPerPound = Math.round((netRise / grossRise) * 100);
  const england = calculate(minimumWageNext.annual, "ruk");
  const scotlandGain = england.tax.total - minimumWageNext.tax;
  const gap = livingWageGap(next.over21);

  return (
    <Prose>
      <Lead>
        From 1 April 2027 the legal minimum for anyone aged 21 or over goes up to{" "}
        {pounds(next.over21, true)} an hour. That&apos;s {pence(current.over21, next.over21)} more than
        now. Every other rate goes up as well, and I&apos;ve set them all out below with what they
        mean for a pay packet in Scotland.
      </Lead>

      <H2 id="rates">Every minimum wage rate from 1 April 2027</H2>
      <P>
        The rate you get depends on your age, and whether you&apos;re an apprentice. Here&apos;s
        what each one is now and what it will be from April.
      </P>
      <GuideTable
        kicker="From 1 April 2027"
        title="The new hourly rates"
        columns={["Who", "Now", "From April 2027", "Rise"]}
        align={["left", "right", "right", "right"]}
        rows={rateRows.map(([label, now, then]) => [
          label,
          pounds(now, true),
          pounds(then, true),
          `${pence(now, then)} (${pct(now, then)})`,
        ])}
        caption="Rates as published on GOV.UK. Each one rises by about the same share."
      />
      <P>
        The apprentice rate is for apprentices under 19, and for those aged 19 or over in the
        first year of their apprenticeship. Once you&apos;re 19 or over and past that first year,
        you&apos;re due the rate for your age.
      </P>

      <H2 id="yearly">What {pounds(next.over21, true)} an hour adds up to</H2>
      <P>
        The law sets an hourly rate, not a salary. To turn it into something you can plan with,
        I use {FULL_TIME.hours} paid hours a week for all {FULL_TIME.weeks} weeks of the year.
      </P>
      <BigStat
        value={pounds(minimumWageNext.annual, true)}
        label={`a year before tax at ${pounds(next.over21, true)} an hour, ${FULL_TIME.hours} hours a week`}
        exact={`That's ${pounds(minimumWageNext.weekly, true)} a week or ${pounds(minimumWageNext.monthly, true)} a month, and ${pounds(grossRise)} more than the same hours at ${pounds(current.over21, true)}.`}
      />

      <H2 id="take-home">Take home pay in Scotland at {pounds(next.over21, true)}</H2>
      <P>
        I&apos;ve run both rates through the same tax engine as the site&apos;s take home pay
        calculator. One thing to know: the Scottish Government hasn&apos;t set its income tax bands
        for 2027/28 yet. So this uses this year&apos;s rules. If the bands move, the answer moves a
        little with them.
      </P>
      <GuideTable
        kicker={`Full time, ${FULL_TIME.hours} hours a week`}
        title="What reaches the bank"
        columns={["", `Now (${pounds(current.over21, true)})`, `April 2027 (${pounds(next.over21, true)})`]}
        align={["left", "right", "right"]}
        rows={[
          ["Pay before tax, a year", pounds(minimumWageNow.annual, true), pounds(minimumWageNext.annual, true)],
          ["Scottish income tax", pounds(minimumWageNow.tax, true), pounds(minimumWageNext.tax, true)],
          ["National Insurance", pounds(minimumWageNow.ni, true), pounds(minimumWageNext.ni, true)],
          ["Take home, a year", pounds(minimumWageNow.net, true), pounds(minimumWageNext.net, true)],
          ["Take home, a month", pounds(minimumWageNow.netMonthly, true), pounds(minimumWageNext.netMonthly, true)],
        ]}
        caption="2026/27 Scottish income tax bands and employee National Insurance, standard 1257L tax code, no pension or student loan."
      />
      <P>
        So of the {pounds(grossRise)} rise, about {pounds(netRise)} reaches the bank. You keep
        roughly {keptPerPound}p of every extra pound at this level of pay, and the rest goes in tax
        and National Insurance.
      </P>
      <P>
        Scotland&apos;s lower starter rate helps a bit here. On the same pay, someone in England
        would pay about {pounds(scotlandGain)} a year more in income tax. To put in your own hours,
        pension or tax code, use the{" "}
        <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>.
      </P>

      <H2 id="scotland">Does Scotland set its own minimum wage?</H2>
      <P>
        No. The UK Government sets one minimum wage for the whole of the UK, on advice from the
        Low Pay Commission. So {pounds(next.over21, true)} will be the rate in Glasgow, Lerwick
        and London alike. What Scotland does control is income tax, which is why the take home
        figures above are worked out on Scottish bands.
      </P>
      <P>
        Because the rate is the same everywhere, the real difference from place to place is what
        the money buys. I&apos;ve done that sum, rent and council tax included, for four cities:
      </P>
      <UL>
        {CITY_ORDER.map((slug) => (
          <LI key={slug}>
            <Link href={CITY_PAY[slug].path}>Minimum wage in {CITY_PAY[slug].name}</Link>
          </LI>
        ))}
      </UL>
      <P>
        For this year&apos;s rates and the full working on take home pay, see my{" "}
        <Link href="/minimum-wage-scotland">minimum wage Scotland</Link> guide.
      </P>

      <H2 id="living-wage">Minimum wage 2027 against the real Living Wage</H2>
      <P>
        The real Living Wage is a different thing. It&apos;s a voluntary rate, worked out from what
        a basic life actually costs, and employers sign up to pay it. The latest rate,{" "}
        {pounds(REAL_LIVING_WAGE.uk, true)} an hour, was announced in October 2026.
      </P>
      <P>
        Once the legal minimum reaches {pounds(next.over21, true)}, the gap between the two is{" "}
        {pounds(gap.hourly, true)} an hour. Over a full time year that&apos;s{" "}
        {pounds(gap.annual, true)} before tax. More on how the two compare in my{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link> guide.
      </P>

      <H2 id="check">If your pay doesn&apos;t go up</H2>
      <P>
        The new rates start on 1 April 2027. If you&apos;re paid monthly, it can take a payslip to
        show, depending on when your pay period starts. If it still hasn&apos;t appeared after that,
        ask your employer first. It&apos;s often a payroll slip rather than anything deliberate.
      </P>
      <Aside title="Still not sorted?">
        <p>
          Acas gives free, confidential advice on <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>,{" "}
          {PAY_HELP.acasHours}. You can also{" "}
          <a href={PAY_HELP.complainUrl}>complain to HMRC</a>, which enforces the minimum wage and
          can make an employer pay back what you&apos;re owed.
        </p>
      </Aside>

      <PostCTA
        title="Work out your own pay for April"
        body="Put in your hours, pension and tax code and see what the new rate means for your payslip, on the same Scottish tax rules as this page."
        href="/take-home-pay-calculator-scotland"
        cta="Open the calculator"
      />
    </Prose>
  );
}
