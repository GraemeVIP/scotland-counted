import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { CityBudgetCompare, MinimumWagePayTable, MinimumWageRatesTable } from "@/components/MinimumWageTables";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { FULL_TIME, PAY_HELP, PRIVATE_RENTS, cityBudget, cityBudgets, livingWageGap, minimumWageNext } from "@/lib/data/money";
import { councilTaxPath } from "@/lib/routeMap";

const SLUG = "city-of-edinburgh";

export default function Post() {
  const city = cityBudget(SLUG);
  const all = cityBudgets();
  const cheapestLeft = [...all].sort((a, b) => b.left - a.left)[0];
  const gap = livingWageGap(MINIMUM_WAGE.current.over21);
  const hoursInMonth = (FULL_TIME.hours * FULL_TIME.weeks) / 12;
  const hoursForRent = city.rentShare * hoursInMonth;

  return (
    <Prose>
      <Lead>
        If you&apos;re 21 or over, the minimum wage in Edinburgh is{" "}
        {pounds(MINIMUM_WAGE.current.over21, true)} an hour. It rises to{" "}
        {pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027. The rate is the same right across
        the UK, so an Edinburgh employer pays no more by law than one in Dundee. The difference is
        rent. Edinburgh sits in the most expensive rental area in Scotland, and that eats the wage
        faster than anywhere else.
      </Lead>

      <H2 id="rates">The legal rate in Edinburgh</H2>
      <P>
        These are the rates every employer in the city has to pay, by age. There&apos;s no higher
        legal rate for Edinburgh, or for London for that matter.
      </P>
      <MinimumWageRatesTable place="Edinburgh" />

      <H2 id="rent">Edinburgh rent against a minimum wage</H2>
      <P>
        The ONS puts the average one bedroom rent in the {city.rentArea} rental area, which takes
        in Edinburgh, at {pounds(city.rent.oneBed)} a month in {PRIVATE_RENTS.month}. That&apos;s
        the highest of any rental area in Scotland, and it&apos;s up{" "}
        {city.rent.oneBedChangePct.toFixed(1)}% on a year, and these are mostly asking rents on
        homes coming up to let, so it&apos;s what you&apos;d pay if you moved now.
      </P>
      <BigStat
        value={`${Math.round(city.rentShare * 100)}%`}
        label="of full time minimum wage take home pay goes on an average one bedroom rent"
        exact={`${pounds(city.rent.oneBed)} rent out of ${pounds(city.takeHome)} take home a month. Put another way, about ${Math.round(hoursForRent)} of the ${Math.round(hoursInMonth)} hours you work each month go on rent.`}
      />

      <H2 id="money">What&apos;s left after rent and council tax in Edinburgh</H2>
      <P>
        Edinburgh does have the lowest council tax of Scotland&apos;s four big cities. A Band A bill,
        the lowest band, with water and waste water, comes to {pounds(city.councilTaxAnnual, true)}{" "}
        for 2026/27, or {pounds(city.councilTaxMonthly)} a month. The council put its share up{" "}
        {city.councilTaxRisePct.toFixed(1)}% this year. Every band is on the{" "}
        <Link href={councilTaxPath(SLUG)}>Edinburgh council tax bands</Link> page.
      </P>
      <P>
        It doesn&apos;t make up for the rent, though. Here&apos;s the month on a full time minimum
        wage, side by side with the other cities.
      </P>
      <CityBudgetCompare current={SLUG} />
      <P>
        That leaves about {pounds(city.left)} a month in Edinburgh for food, energy, travel and
        everything else. In {cheapestLeft.name} the same wage leaves {pounds(cheapestLeft.left)}.
        Same law, same hourly rate, very different month.
      </P>
      <Aside title="Two things that can help">
        <p>
          Living on your own takes 25% off the council tax part of the bill. And if rent is
          swallowing most of your pay, check whether you can get help with housing costs through
          Universal Credit. My guide to the{" "}
          <Link href="/blog/local-housing-allowance-rent-shortfall-scotland">Local Housing Allowance</Link>{" "}
          explains the limits.
        </p>
      </Aside>

      <H2 id="pay">What a full time minimum wage job takes home</H2>
      <P>
        Take home pay is the same in Edinburgh as anywhere else in Scotland, because it comes down
        to Scottish income tax and National Insurance. From April 2027 it goes up to about{" "}
        {pounds(minimumWageNext.netMonthly)} a month, on this year&apos;s tax rules.
      </P>
      <MinimumWagePayTable />

      <H2 id="local-jobs">What Edinburgh jobs actually pay</H2>
      <P>
        Most Edinburgh jobs pay well above the legal floor. The ONS earnings survey for April 2026
        counts {city.jobs.count.toLocaleString("en-GB")} employee jobs in the city. Across all of
        them, full and part time:
      </P>
      <UL>
        <LI>1 in 10 pays less than {pounds(city.jobs.hourlyP10, true)} an hour.</LI>
        <LI>1 in 5 pays less than {pounds(city.jobs.hourlyP20, true)} an hour.</LI>
        <LI>The middle job pays {pounds(city.jobs.hourlyMedian, true)} an hour.</LI>
        <LI>
          The middle full time job pays {pounds(city.jobs.fullTimeAnnual)} a year, and full time
          workers who live in the city earn {pounds(city.residentFullTimeAnnual ?? 0)}.
        </LI>
      </UL>
      <P>
        So Edinburgh is a well paid city with a long tail of low paid work underneath. If you want
        the wider picture, I&apos;ve covered it in{" "}
        <Link href="/average-salary-scotland">average salary Scotland</Link>.
      </P>

      <H2 id="living-wage">The real Living Wage gap in Edinburgh</H2>
      <P>
        The real Living Wage is {pounds(REAL_LIVING_WAGE.uk, true)} an hour outside London. It&apos;s
        voluntary, and it&apos;s calculated from living costs rather than set by law. The gap to
        the legal minimum is {pounds(gap.hourly, true)} an hour, worth {pounds(gap.annual, true)} a
        year on full time hours. In Edinburgh, that&apos;s{" "}
        {(gap.annual / city.rent.oneBed).toFixed(1)} months of rent. The{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link> guide has more.
      </P>

      <H2 id="underpaid">If you&apos;re paid less than the minimum wage</H2>
      <P>
        Your employer has to pay the rate for every hour you work. Watch for costs you pay out of
        your own pocket for the job, like a uniform or tools you aren&apos;t paid back for. GOV.UK
        says those come off your pay when checking the minimum wage, so they can take you under
        it. If the sums don&apos;t add up, raise it with your employer first. Then Acas gives free, confidential advice on{" "}
        <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>, {PAY_HELP.acasHours}, and you
        can <a href={PAY_HELP.complainUrl}>complain to HMRC</a>, which enforces the minimum wage.
      </P>

      <PostCTA
        title="Edinburgh council tax, band by band"
        body="See what every band costs in Edinburgh this year, water included, and how it compares with the rest of Scotland."
        href={councilTaxPath(SLUG)}
        cta="Edinburgh council tax bands"
      />
    </Prose>
  );
}
