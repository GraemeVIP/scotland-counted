import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import {
  CITY_ORDER,
  CITY_PAY,
  FULL_TIME,
  SCOTLAND_JOBS_HOURLY,
  fullTimePay,
  livingWageGap,
  minimumWageNext,
  minimumWageNow,
} from "@/lib/data/money";

const { current, next } = MINIMUM_WAGE;
const year = (hourly: number) => pounds(hourly * FULL_TIME.hours * FULL_TIME.weeks, true);
const pence = (amount: number) => `${Math.round(amount * 100)}p`;

export default function Post() {
  const realLivingWage = fullTimePay(REAL_LIVING_WAGE.uk);
  const gapNow = livingWageGap(current.over21);
  const gapNext = livingWageGap(next.over21);
  const takeHomeGap = realLivingWage.net - minimumWageNow.net;

  const cityRows = CITY_ORDER.map((slug) => {
    const city = CITY_PAY[slug];
    return [
      <Link key={slug} href={city.path}>
        {city.name}
      </Link>,
      pounds(city.jobs.hourlyP10, true),
      pounds(city.jobs.hourlyP20, true),
    ];
  });

  return (
    <Prose>
      <Lead>
        The real Living Wage in Scotland is {pounds(REAL_LIVING_WAGE.uk, true)} an hour, the rate
        announced on 15 October 2026. It is voluntary: the legal minimum for workers aged 21 and
        over is {pounds(current.over21, true)}, which the UK Government calls the National Living
        Wage. The names make a simple difference needlessly confusing.
      </Lead>

      <H2 id="short-answer">The short answer</H2>
      <UL>
        <LI>
          The legal minimum is {pounds(current.over21, true)} an hour for workers aged 21 and over
          from April 2026. It rises to {pounds(next.over21, true)} on 1 April 2027.
        </LI>
        <LI>
          The real Living Wage is {pounds(REAL_LIVING_WAGE.uk, true)} an hour outside London and{" "}
          {pounds(REAL_LIVING_WAGE.london, true)} in London. The new rates were announced on 15
          October 2026, and accredited employers have until 1 May 2027 to pay them.
        </LI>
        <LI>Every employer must pay the legal minimum. Paying the real Living Wage is voluntary.</LI>
      </UL>

      <H2 id="rates">Real Living Wage Scotland 2026 rates</H2>
      <P>
        There is no separate Scottish living wage. Scotland uses the same real Living Wage as the
        rest of the UK outside London.
      </P>
      <GuideTable
        kicker="Hourly rates and what they add up to"
        title="Real Living Wage and the legal minimum"
        columns={["Rate", "An hour", "A year at 37.5 hours", "Must employers pay it?"]}
        align={["left", "right", "right", "left"]}
        rows={[
          ["Real Living Wage, Scotland and UK outside London", pounds(REAL_LIVING_WAGE.uk, true), year(REAL_LIVING_WAGE.uk), "No, it is voluntary"],
          ["Real Living Wage, London", pounds(REAL_LIVING_WAGE.london, true), year(REAL_LIVING_WAGE.london), "No, it is voluntary"],
          ["Legal minimum, 21 and over, from April 2026", pounds(current.over21, true), year(current.over21), "Yes, by law"],
          ["Legal minimum, 21 and over, from April 2027", pounds(next.over21, true), year(next.over21), "Yes, by law"],
        ]}
        caption={`Yearly figures are before tax, for ${FULL_TIME.hours} paid hours a week over ${FULL_TIME.weeks} weeks. The previous real Living Wage was £13.45 outside London, so the new rate is 65p higher.`}
      />

      <H2 id="vs-minimum-wage">Living wage vs minimum wage Scotland</H2>
      <P>Side by side, the two rates differ in almost every way except the name.</P>
      <GuideTable
        title="How the two rates compare"
        columns={["", "Legal minimum (National Living Wage)", "Real Living Wage"]}
        rows={[
          ["Rate now", `${pounds(current.over21, true)} an hour`, `${pounds(REAL_LIVING_WAGE.uk, true)} an hour`],
          ["Who sets it", "UK Government, advised by the Low Pay Commission", "Living Wage Foundation"],
          ["How it is worked out", "Two thirds of typical hourly earnings", "The cost of a decent basic life"],
          ["Who it covers", "Workers aged 21 and over, with lower rates for younger workers", "Workers aged 18 and over"],
          ["Must it be paid?", "Yes, by every employer", "Only if the employer has signed up or agreed to it"],
          ["Next change", `${pounds(next.over21, true)} from 1 April 2027`, `Employers have until 1 May 2027 to pay ${pounds(REAL_LIVING_WAGE.uk, true)}`],
        ]}
      />

      <H2 id="legal">National Living Wage Scotland: the legal minimum</H2>
      <P>
        Minimum wage law covers Scotland, England, Wales and Northern Ireland. The UK Government
        sets the rates after advice from the Low Pay Commission. The adult rate is linked to a
        share of typical hourly earnings, not to a shopping basket showing what a household needs.
      </P>
      <P>
        An employer cannot choose to pay less because the business is small or because the worker
        agrees. Age and apprenticeship rules can produce a lower legal rate, which is why two
        adults doing similar work may lawfully receive different hourly pay. Every age rate is on
        the <Link href="/minimum-wage-scotland">minimum wage Scotland</Link> page.
      </P>

      <H2 id="real">How the real Living Wage is worked out</H2>
      <P>
        The Living Wage Foundation commissions a separate calculation based on the Minimum Income
        Standard. Researchers price the goods and services the public agrees are needed for a
        decent basic life, then turn that into an hourly rate.
      </P>
      <Aside title="The word “real” does not make it law">
        <p>
          It distinguishes the cost based Living Wage from the government&apos;s legal rate with a
          similar name. An accredited employer promises to pay it, but the legal minimum wage
          remains the floor that every employer must meet.
        </p>
      </Aside>

      <H2 id="difference">What the gap is worth</H2>
      <BigStat
        value={`${pounds(gapNow.hourly, true)} an hour`}
        label={`the difference between ${pounds(REAL_LIVING_WAGE.uk, true)} and ${pounds(current.over21, true)}`}
        exact={`At ${FULL_TIME.hours} paid hours a week for ${FULL_TIME.weeks} weeks, that is ${pounds(gapNow.annual, true)} before tax over a year.`}
      />
      <P>
        After Scottish income tax and National Insurance, a full time worker keeps about{" "}
        {pounds(takeHomeGap)} of that a year, or {pounds(takeHomeGap / 12)} a month. Take home pay
        is {pounds(realLivingWage.netMonthly)} a month on the real Living Wage against{" "}
        {pounds(minimumWageNow.netMonthly)} on the legal minimum.
      </P>
      <P>
        The gap narrows on 1 April 2027, when the legal minimum rises to{" "}
        {pounds(minimumWageNext.hourly, true)}. It is then {pence(gapNext.hourly)} an hour, or{" "}
        {pounds(gapNext.annual, true)} a year before tax on the same hours.
      </P>
      <P>
        That does not solve every household budget. Rent, children, disability, travel and benefit
        rules change what a household needs and keeps. It does show why a small looking hourly gap
        matters across a full year.
      </P>

      <H2 id="glasgow">Living wage Glasgow, Edinburgh and the rest of Scotland</H2>
      <P>
        The real Living Wage is the same {pounds(REAL_LIVING_WAGE.uk, true)} in Glasgow,
        Edinburgh, Aberdeen, Dundee and everywhere else in Scotland. Only London has a higher rate.
      </P>
      <P>
        How many jobs pay less? ONS figures for April 2026 show the lowest paid tenth of jobs in
        Scotland paid {pounds(SCOTLAND_JOBS_HOURLY.hourlyP10, true)} an hour or less, and the
        lowest paid fifth paid {pounds(SCOTLAND_JOBS_HOURLY.hourlyP20, true)} or less. So somewhere
        between one job in ten and one in five paid less than the new{" "}
        {pounds(REAL_LIVING_WAGE.uk, true)}. The four big cities look much the same:
      </P>
      <GuideTable
        kicker="Jobs based in each city, April 2026"
        title="Low pay in Scotland’s cities"
        columns={["City", "Lowest tenth paid up to", "Lowest fifth paid up to"]}
        align={["left", "right", "right"]}
        rows={cityRows}
        caption="ONS Annual Survey of Hours and Earnings 2026, provisional. Hourly pay leaving out overtime, for all employee jobs, full and part time."
      />

      <H2 id="compulsory">Is the real Living Wage compulsory in Scotland?</H2>
      <P>
        No. Most employers in Scotland only have to pay the legal minimum. The exception is money
        from the public purse: under the Scottish Government&apos;s Fair Work First policy, most
        discretionary public sector grants awarded since 1 July 2023 come with a condition that
        the employer pays at least the real Living Wage.
      </P>
      <P>
        An employer can also promise the real Living Wage in a contract or pay policy, or sign up
        with the Living Wage Foundation as an accredited employer. Once it has done that, the
        promise matters, but the law itself still only enforces the legal minimum.
      </P>

      <H2 id="check">How to check your employer</H2>
      <P>
        First check the legal rate for your age and apprenticeship year. Then divide pay before tax by
        the paid hours in the pay period. Do not count unpaid breaks as paid work, but do include
        time the law treats as working time.
      </P>
      <P>
        If the employer advertises itself as a Living Wage employer, check the Living Wage
        Foundation&apos;s employer directory. If it is only paying the legal minimum, that may be
        lawful even though it falls short of the voluntary rate.
      </P>
      <P>
        See <Link href="/minimum-wage-scotland">what the legal minimum
        becomes after Scottish tax and National Insurance</Link> before comparing it with rent and
        bills, or work out your own pay with the{" "}
        <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>.
      </P>

      <PostCTA
        title="Low pay is a decision, not a mystery"
        body="Westminster sets the legal minimum. Employers decide whether to stop there. I can find your MP automatically and prepare the right email without asking you to understand the political split."
        href="/email-your-mp-and-msp"
        cta="Email my MP"
      />
    </Prose>
  );
}
