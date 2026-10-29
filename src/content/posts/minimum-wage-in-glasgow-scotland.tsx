import Link from "next/link";
import { Prose, Lead, P, H2, Aside, PostCTA, BigStat } from "@/components/Prose";
import { CityBudgetCompare, MinimumWagePayTable, MinimumWageRatesTable } from "@/components/MinimumWageTables";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { ASHE_2026, PAY_HELP, PRIVATE_RENTS, SCOTLAND_JOBS_HOURLY, asheCouncil, cityBudget, livingWageGap } from "@/lib/data/money";
import { councilTaxPath } from "@/lib/routeMap";

const SLUG = "glasgow-city";

export default function Post() {
  const city = cityBudget(SLUG);
  const gap = livingWageGap(MINIMUM_WAGE.current.over21);
  const eastRen = asheCouncil("east-renfrewshire");
  const eastDun = asheCouncil("east-dunbartonshire");

  return (
    <Prose>
      <Lead>
        The minimum wage in Glasgow is {pounds(MINIMUM_WAGE.current.over21, true)} an hour if
        you&apos;re 21 or over. It&apos;s exactly the same as in Edinburgh, Inverness or London,
        because the UK Government sets one rate for the whole country. What changes in Glasgow is
        how far that money goes, and what other jobs in the city pay.
      </Lead>

      <H2 id="rates">The legal rate in Glasgow</H2>
      <P>
        There&apos;s no Glasgow rate and no Scottish rate. Every employer in the city has to pay at
        least the figure for your age, whether it&apos;s a shop on Buchanan Street or a care
        agency in the East End. The rates go up again on 1 April 2027.
      </P>
      <MinimumWageRatesTable place="Glasgow" />

      <H2 id="pay">What a full time minimum wage job pays</H2>
      <P>
        Working {pounds(MINIMUM_WAGE.current.over21, true)} an hour for 37.5 hours a week comes to{" "}
        {pounds(city.takeHome)} a month in your bank once Scottish income tax and National
        Insurance are off. That figure is the same anywhere in Scotland. Here&apos;s the full
        working, this year and next.
      </P>
      <MinimumWagePayTable />

      <H2 id="local-jobs">What Glasgow jobs actually pay</H2>
      <P>
        Glasgow has {city.jobs.count.toLocaleString("en-GB")} employee jobs, the most of any
        Scottish council, according to the ONS earnings survey for {ASHE_2026.period}. Very few of
        them sit right on the legal minimum. This is what the hourly rate looks like across all of
        them, full and part time, leaving out overtime.
      </P>
      <BigStat
        value={pounds(city.jobs.hourlyP10, true)}
        label="an hour: 1 in 10 Glasgow jobs pays less than this"
        exact={`1 in 5 pays less than ${pounds(city.jobs.hourlyP20, true)}. The middle Glasgow job pays ${pounds(city.jobs.hourlyMedian, true)} an hour, against ${pounds(SCOTLAND_JOBS_HOURLY.hourlyMedian, true)} across Scotland.`}
      />
      <P>
        There&apos;s an odd split in the city&apos;s pay. Full time jobs based in Glasgow pay{" "}
        {pounds(city.jobs.fullTimeAnnual)} a year in the middle, above the Scotland figure. But
        full time workers who actually live in Glasgow earn{" "}
        {pounds(city.residentFullTimeAnnual ?? 0)}, below it. People living in East Renfrewshire
        earn {pounds(eastRen.annual ?? 0)} and in East Dunbartonshire {pounds(eastDun.annual ?? 0)}.
        That suggests plenty of the city&apos;s better paid jobs go to people who live in the
        suburbs round it. I&apos;ve gone into why that matters in{" "}
        <Link href="/why-poverty-is-worse-in-glasgow">why poverty is worse in Glasgow</Link>.
      </P>

      <H2 id="money">What&apos;s left after rent and council tax in Glasgow</H2>
      <P>
        Rent is where Glasgow bites. The average one bedroom home in the {city.rentArea} rental
        area cost {pounds(city.rent.oneBed)} a month in {PRIVATE_RENTS.month}, up{" "}
        {city.rent.oneBedChangePct.toFixed(1)}% on a year. On a full time minimum wage that&apos;s{" "}
        {Math.round(city.rentShare * 100)}% of take home pay gone before anything else.
      </P>
      <P>
        Add a Band A council tax bill, the lowest band, with water and waste water on top, and
        that&apos;s another {pounds(city.councilTaxMonthly)} a month. Glasgow put council tax up{" "}
        {city.councilTaxRisePct.toFixed(1)}% this year. The other bands are on the{" "}
        <Link href={councilTaxPath(SLUG)}>Glasgow council tax bands</Link> page.
      </P>
      <CityBudgetCompare current={SLUG} />
      <P>
        So a single person on the legal minimum in Glasgow has about {pounds(city.left)} a month
        for food, energy, travel and everything else. That&apos;s more than in Edinburgh, but a
        good bit less than in Aberdeen or Dundee, on exactly the same wage.
      </P>
      <Aside title="Live on your own?">
        <p>
          You get 25% off the council tax part of the bill. If your income is low you may also get
          Council Tax Reduction on top, so it&apos;s worth checking with Glasgow City Council.
        </p>
      </Aside>

      <H2 id="living-wage">The real Living Wage gap in Glasgow</H2>
      <P>
        The real Living Wage is a voluntary rate that employers sign up to, worked out from what a
        basic life costs. It&apos;s {pounds(REAL_LIVING_WAGE.uk, true)} an hour, the same in Glasgow
        as anywhere outside London. Against the legal minimum that&apos;s{" "}
        {pounds(gap.hourly, true)} an hour, or {pounds(gap.annual, true)} a year at full time
        hours. In a city where rent takes nearly half of take home pay, that gap matters. More in{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link>.
      </P>

      <H2 id="underpaid">If you&apos;re paid less than the minimum wage</H2>
      <P>
        Check your payslip against your paid hours, not the length of your shift. If it&apos;s
        short, speak to your employer first. If that goes nowhere, Acas gives free, confidential
        advice on <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>, {PAY_HELP.acasHours}.
        You can also <a href={PAY_HELP.complainUrl}>complain to HMRC</a>, which can make an
        employer pay back what you&apos;re owed.
      </P>

      <PostCTA
        title="Glasgow's council tax, band by band"
        body="See what every band costs in Glasgow this year, water included, and how much it went up."
        href={councilTaxPath(SLUG)}
        cta="Glasgow council tax bands"
      />
    </Prose>
  );
}
