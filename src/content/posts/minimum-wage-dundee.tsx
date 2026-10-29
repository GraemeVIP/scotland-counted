import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { CityBudgetCompare, MinimumWagePayTable, MinimumWageRatesTable } from "@/components/MinimumWageTables";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { ASHE_2026, PAY_HELP, PRIVATE_RENTS, SCOTLAND_JOBS_HOURLY, cityBudget, livingWageGap } from "@/lib/data/money";
import { councilTaxPath } from "@/lib/routeMap";

const SLUG = "dundee-city";

export default function Post() {
  const city = cityBudget(SLUG);
  const edinburgh = cityBudget("city-of-edinburgh");
  const gap = livingWageGap(MINIMUM_WAGE.current.over21);

  return (
    <Prose>
      <Lead>
        The minimum wage in Dundee is {pounds(MINIMUM_WAGE.current.over21, true)} an hour for
        workers aged 21 and over, and it goes up to {pounds(MINIMUM_WAGE.next.over21, true)} on 1
        April 2027. It&apos;s the same rate as everywhere else in the UK. Full time jobs in Dundee
        pay a bit less than in Glasgow, Edinburgh or Aberdeen, but rent is cheaper too, and on the
        legal minimum that trade works in Dundee&apos;s favour.
      </Lead>

      <H2 id="rates">The legal rate in Dundee</H2>
      <P>
        These are the hourly rates by age. They&apos;re set by the UK Government for the whole
        country, so there&apos;s no separate Dundee or Scottish rate to look for.
      </P>
      <MinimumWageRatesTable place="Dundee" />

      <H2 id="money">What&apos;s left after rent and council tax in Dundee</H2>
      <P>
        I&apos;ll start with the bit that matters most when money is tight. The average one bedroom
        rent in the {city.rentArea} rental area was {pounds(city.rent.oneBed)} a month in{" "}
        {PRIVATE_RENTS.month}, the lowest of the four big city areas. That&apos;s about{" "}
        {Math.round(city.rentShare * 100)}% of a full time minimum wage after tax.
      </P>
      <BigStat
        value={pounds(city.left)}
        label="a month left on a full time minimum wage after rent and council tax"
        exact={`In Edinburgh the same job leaves ${pounds(edinburgh.left)}. That's ${pounds(city.left - edinburgh.left)} a month more in Dundee, on exactly the same wage.`}
      />
      <CityBudgetCompare current={SLUG} />

      <H2 id="council-tax">Dundee council tax on a low wage</H2>
      <P>
        The catch is council tax. Dundee City Council raised its charge by{" "}
        {city.councilTaxRisePct.toFixed(1)}% for 2026/27, the biggest rise of the four cities. A Band
        A bill, the lowest band, now comes to {pounds(city.councilTaxAnnual, true)} a year with
        water and waste water, about {pounds(city.councilTaxMonthly)} a month. Every band is on
        the <Link href={councilTaxPath(SLUG)}>Dundee council tax bands</Link> page.
      </P>
      <Aside title="Ways to bring the bill down">
        <p>
          If you live on your own you get 25% off the council tax part. On a low income you may
          also qualify for Council Tax Reduction, which is worked out by the council and can cover
          part or all of the bill.
        </p>
      </Aside>

      <H2 id="local-jobs">What Dundee jobs actually pay</H2>
      <P>
        The ONS earnings survey for {ASHE_2026.period} counts{" "}
        {city.jobs.count.toLocaleString("en-GB")} employee jobs in Dundee, a much smaller jobs
        market than Glasgow or Edinburgh. Across all of them, full and part time, leaving out
        overtime:
      </P>
      <UL>
        <LI>1 in 10 pays less than {pounds(city.jobs.hourlyP10, true)} an hour.</LI>
        <LI>1 in 5 pays less than {pounds(city.jobs.hourlyP20, true)} an hour.</LI>
        <LI>
          The middle job pays {pounds(city.jobs.hourlyMedian, true)} an hour, almost exactly the
          Scotland figure of {pounds(SCOTLAND_JOBS_HOURLY.hourlyMedian, true)}.
        </LI>
      </UL>
      <P>
        Full time is where Dundee falls behind. The middle full time job based in the city pays{" "}
        {pounds(city.jobs.fullTimeAnnual)} a year, the lowest of the four cities, and full time
        workers who live in Dundee earn {pounds(city.residentFullTimeAnnual ?? 0)}. The council by
        council list is in{" "}
        <Link href="/average-salary-scotland">average salary Scotland</Link>.
      </P>

      <H2 id="pay">What a full time minimum wage job takes home</H2>
      <P>
        Take home pay is the same in Dundee as in any Scottish city. Here it is for this year and
        from April 2027, worked out on Scottish income tax and National Insurance.
      </P>
      <MinimumWagePayTable />

      <H2 id="living-wage">The real Living Wage gap in Dundee</H2>
      <P>
        The real Living Wage, the voluntary rate based on what living actually costs, is{" "}
        {pounds(REAL_LIVING_WAGE.uk, true)} an hour. That&apos;s {pounds(gap.hourly, true)} an hour
        more than the legal minimum, or {pounds(gap.annual, true)} over a full time year. In
        Dundee that&apos;s more than {Math.floor(gap.annual / city.rent.oneBed)} months of average
        one bedroom rent. The{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link> guide explains who
        pays it.
      </P>

      <H2 id="underpaid">If you&apos;re paid less than the minimum wage</H2>
      <P>
        Check that every paid hour is at least the rate for your age. If it isn&apos;t, raise it
        with your employer. Acas gives free, confidential advice on{" "}
        <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>, {PAY_HELP.acasHours}, and you
        can <a href={PAY_HELP.complainUrl}>complain to HMRC</a> about an employer that won&apos;t
        pay what you&apos;re owed.
      </P>

      <PostCTA
        title="Dundee council tax, band by band"
        body="See what every band costs in Dundee this year, water included, and how much it went up."
        href={councilTaxPath(SLUG)}
        cta="Dundee council tax bands"
      />
    </Prose>
  );
}
