import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { CityBudgetCompare, MinimumWagePayTable, MinimumWageRatesTable } from "@/components/MinimumWageTables";
import { MINIMUM_WAGE, REAL_LIVING_WAGE, pounds } from "@/lib/data/quickAnswers";
import { ASHE_2026, CITY_ORDER, CITY_PAY, PAY_HELP, PRIVATE_RENTS, asheCouncil, cityBudget, livingWageGap } from "@/lib/data/money";
import { councilTaxPath } from "@/lib/routeMap";

const SLUG = "aberdeen-city";

export default function Post() {
  const city = cityBudget(SLUG);
  const gap = livingWageGap(MINIMUM_WAGE.current.over21);
  const shire = asheCouncil("aberdeenshire");
  const timesMinimum = city.jobs.hourlyMedian / MINIMUM_WAGE.current.over21;

  return (
    <Prose>
      <Lead>
        The minimum wage in Aberdeen is {pounds(MINIMUM_WAGE.current.over21, true)} an hour for
        anyone 21 or over, going up to {pounds(MINIMUM_WAGE.next.over21, true)} on 1 April 2027.
        That&apos;s the UK rate, so it&apos;s no different here than in Glasgow or Cardiff. What is
        different about Aberdeen is that its jobs pay more than Glasgow&apos;s, Edinburgh&apos;s or
        Dundee&apos;s, while its rents are far lower than in Edinburgh or Glasgow.
      </Lead>

      <H2 id="rates">The legal rate in Aberdeen</H2>
      <P>
        Every employer in Aberdeen has to pay at least these rates, by age. Nobody in Scotland sets
        a separate rate. The UK Government decides it each year, on advice from the Low Pay
        Commission.
      </P>
      <MinimumWageRatesTable place="Aberdeen" />

      <H2 id="local-jobs">What Aberdeen jobs actually pay</H2>
      <P>
        Aberdeen is a city where the legal minimum is a long way below what most jobs pay. The ONS
        earnings survey for {ASHE_2026.period} counts {city.jobs.count.toLocaleString("en-GB")}{" "}
        employee jobs in the city, and the middle one pays {pounds(city.jobs.hourlyMedian, true)} an
        hour, about {timesMinimum.toFixed(1)} times the minimum wage.
      </P>
      <GuideTable
        kicker={`Jobs based in each city, ${ASHE_2026.period}`}
        title="Hourly pay, full and part time"
        columns={["City", "1 in 10 jobs pays less than", "The middle job"]}
        align={["left", "right", "right"]}
        rows={CITY_ORDER.map((slug) => [
          slug === SLUG ? <strong key="c">{CITY_PAY[slug].name}</strong> : <Link key="c" href={CITY_PAY[slug].path}>{CITY_PAY[slug].name}</Link>,
          pounds(CITY_PAY[slug].jobs.hourlyP10, true),
          pounds(CITY_PAY[slug].jobs.hourlyMedian, true),
        ])}
        caption="ONS Annual Survey of Hours and Earnings 2026, provisional, Table 7. Hourly pay leaving out overtime, by where the job is based."
      />
      <P>
        Full time jobs based in Aberdeen pay {pounds(city.jobs.fullTimeAnnual)} a year in the middle.
        Full time workers who live in the city earn {pounds(city.residentFullTimeAnnual ?? 0)}, and
        those living in Aberdeenshire {pounds(shire.annual ?? 0)}. So some of the best paid city
        jobs look to be going to people who live outside it.
      </P>
      <P>
        One word of caution. The survey has the middle full time weekly wage in Aberdeen jumping
        a lot in a year, and a city sample this size can swing about. I&apos;d treat the level as
        solid and any single year&apos;s change with care.
      </P>

      <H2 id="rent">Aberdeen rent on a minimum wage</H2>
      <P>
        Here&apos;s the part that surprises people from the central belt. The average one bedroom
        rent in the {city.rentArea} rental area was {pounds(city.rent.oneBed)} a month in{" "}
        {PRIVATE_RENTS.month}, against {pounds(PRIVATE_RENTS.scotland.oneBed)} for Scotland as a
        whole. Across all sizes of home, average rents in the area were{" "}
        {Math.abs(city.rent.allChangePct).toFixed(1)}% {city.rent.allChangePct < 0 ? "lower" : "higher"}{" "}
        than a year before, the only one of the four big city areas where they fell.
      </P>
      <BigStat
        value={pounds(city.left)}
        label="a month left on a full time minimum wage after rent and council tax"
        exact={`${pounds(city.takeHome)} take home, less ${pounds(city.rent.oneBed)} average one bedroom rent and ${pounds(city.councilTaxMonthly)} for a Band A council tax and water bill.`}
      />

      <H2 id="money">Council tax and what&apos;s left in Aberdeen</H2>
      <P>
        Aberdeen City Council put council tax up {city.councilTaxRisePct.toFixed(1)}% for 2026/27.
        A Band A bill, the lowest band, comes to {pounds(city.councilTaxAnnual, true)} a year with
        water and waste water. That&apos;s the highest Band A bill of the four cities, but
        it&apos;s rent that decides the month. All the bands are on the{" "}
        <Link href={councilTaxPath(SLUG)}>Aberdeen council tax bands</Link> page.
      </P>
      <CityBudgetCompare current={SLUG} />
      <Aside title="Remember this is the floor">
        <p>
          These sums assume the lowest legal wage and 37.5 paid hours every week. Plenty of minimum
          wage work in hospitality and retail is part time or on changing rotas, which can leave a
          lot less than this.
        </p>
      </Aside>

      <H2 id="pay">What a full time minimum wage job takes home</H2>
      <P>
        Take home pay doesn&apos;t change between Scottish cities. It comes down to the wage,
        your hours, Scottish income tax and National Insurance.
      </P>
      <MinimumWagePayTable />

      <H2 id="living-wage">The real Living Wage gap in Aberdeen</H2>
      <P>
        The real Living Wage is {pounds(REAL_LIVING_WAGE.uk, true)} an hour. It&apos;s a voluntary
        rate that employers can sign up to, based on what life actually costs. The gap to the legal
        minimum is {pounds(gap.hourly, true)} an hour, or {pounds(gap.annual, true)} a year full
        time. With most Aberdeen jobs already paying well above both, it&apos;s worth asking an
        employer which one they pay before you take a job. More in{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link>.
      </P>

      <H2 id="underpaid">If you&apos;re paid less than the minimum wage</H2>
      <P>
        Start with your payslip and your paid hours. If something is short, ask your employer. If
        that doesn&apos;t fix it, call Acas free and in confidence on{" "}
        <a href={PAY_HELP.acasPhoneHref}>{PAY_HELP.acasPhone}</a>, {PAY_HELP.acasHours}, or{" "}
        <a href={PAY_HELP.complainUrl}>complain to HMRC</a>. HMRC can make an employer pay back
        arrears and fine them.
      </P>

      <PostCTA
        title="Aberdeen council tax, band by band"
        body="See what every band costs in Aberdeen this year, water included, and how much it went up."
        href={councilTaxPath(SLUG)}
        cta="Aberdeen council tax bands"
      />
    </Prose>
  );
}
