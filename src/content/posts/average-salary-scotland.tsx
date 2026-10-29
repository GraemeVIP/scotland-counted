import Link from "next/link";
import { Prose, Lead, P, H2, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { pounds } from "@/lib/data/quickAnswers";
import { ASHE_2026, ASHE_2026_COUNCILS, CITY_PAY, PRIVATE_RENTS, asheCouncil, minimumWageNow } from "@/lib/data/money";
import { COUNCIL_SEARCH_NAMES, salaryPath } from "@/lib/routeMap";
import { calculate } from "@/lib/tax/engine";

const S = ASHE_2026.scotland;

/** ONS says to use an estimate with caution once its margin of error passes this. */
const CAUTION_CV = 10;

const ranked = [...ASHE_2026_COUNCILS].sort((a, b) => (b.annual ?? -1) - (a.annual ?? -1));
const withAnnual = ranked.filter((council) => council.annual !== null);
const top = withAnnual[0];
const bottom = withAnnual[withAnnual.length - 1];

export default function Post() {
  const takeHome = calculate(S.annual, "scotland");
  const edinburgh = asheCouncil("city-of-edinburgh");
  const aberdeen = asheCouncil("aberdeen-city");
  const aberdeenshire = asheCouncil("aberdeenshire");
  const edinburghJobs = CITY_PAY["city-of-edinburgh"].jobs;
  const aberdeenJobs = CITY_PAY["aberdeen-city"].jobs;

  return (
    <Prose>
      <Lead>
        The average full time salary in Scotland is {pounds(S.annual)} a year. That&apos;s the
        middle figure from the ONS earnings survey for {ASHE_2026.period}, published on{" "}
        {ASHE_2026.released}. Half of full time workers who live in Scotland earn more than that,
        and half earn less.
      </Lead>

      <H2 id="average-wage">The average wage in Scotland, by the week and by the hour</H2>
      <P>
        The same survey gives the middle full time wage as {pounds(S.weekly, true)} a week before
        tax, or {pounds(S.hourly, true)} an hour leaving out overtime. The yearly figure was up{" "}
        {S.annualChangePct}% on April 2025.
      </P>
      <P>
        You might notice {pounds(S.weekly, true)} times 52 comes to more than {pounds(S.annual)}.
        That&apos;s because the yearly figure only counts people who&apos;ve been in the same job for
        at least a year, so it leaves out people who&apos;ve just started somewhere new.
      </P>
      <Aside title="Median or mean?">
        <p>
          Add up everyone&apos;s pay and divide by the number of people and you get{" "}
          {pounds(S.annualMean)}. That&apos;s the mean. A small number of very high earners pull it
          up, so I use the middle figure, the median, because it&apos;s much closer to what an
          ordinary full time job pays.
        </p>
      </Aside>
      <P>
        Scotland comes out slightly ahead of the UK as a whole on this measure. The UK middle full
        time salary is {pounds(ASHE_2026.uk.annual)}, so Scotland is{" "}
        {pounds(S.annual - ASHE_2026.uk.annual)} higher.
      </P>

      <H2 id="councils">Average salary in every Scottish council</H2>
      <P>
        Where you live makes a real difference. These are the middle full time salaries for
        people living in each council area, highest first.
      </P>
      <GuideTable
        kicker={`${ASHE_2026.period}, provisional`}
        title="Middle full time salary by council"
        columns={["Council", "A year", "A week"]}
        align={["left", "right", "right"]}
        rows={ranked.map((council) => [
          <Link key="c" href={`/councils/${council.slug}`}>
            {COUNCIL_SEARCH_NAMES[council.slug]}
          </Link>,
          council.annual === null
            ? "Not published"
            : `${pounds(council.annual)}${(council.annualCv ?? 0) > CAUTION_CV ? " *" : ""}`,
          pounds(council.weekly, true),
        ])}
        caption="ONS Annual Survey of Hours and Earnings 2026, Table 8. Full time employees, by the council they live in. * A small sample, so ONS says to use with caution. Orkney's yearly figure isn't published because the sample is too small."
      />
      <P>
        {COUNCIL_SEARCH_NAMES[top.slug]} is top at {pounds(top.annual ?? 0)}.{" "}
        {COUNCIL_SEARCH_NAMES[bottom.slug]} is lowest at {pounds(bottom.annual ?? 0)}, a gap of{" "}
        {pounds((top.annual ?? 0) - (bottom.annual ?? 0))} a year between the two. The two
        commuter areas next to Glasgow, East Renfrewshire and East Dunbartonshire, lead the table.
        The bottom end is mostly rural: Dumfries and Galloway, Moray and the Borders.
      </P>

      <H2 id="edinburgh">Average salary in Edinburgh</H2>
      <P>
        Full time workers who live in Edinburgh earn {pounds(edinburgh.annual ?? 0)} in the middle,
        or {pounds(edinburgh.weekly, true)} a week. Jobs based in the city pay a bit more,{" "}
        {pounds(edinburghJobs.fullTimeAnnual)}. That second figure counts jobs by where the work
        is, so it includes everyone who travels in from outside the city.
      </P>
      <P>
        Edinburgh pay comes with Edinburgh rents, though. A one bedroom flat in the Lothian area
        averaged {pounds(CITY_PAY["city-of-edinburgh"].rent.oneBed)} a month in{" "}
        {PRIVATE_RENTS.month}, the most of Scotland&apos;s four big cities. I&apos;ve worked through what that leaves on
        the lowest wage in{" "}
        <Link href={CITY_PAY["city-of-edinburgh"].path}>minimum wage in Edinburgh</Link>.
      </P>

      <H2 id="aberdeen">Average salary in Aberdeen</H2>
      <P>
        Aberdeen residents working full time earn {pounds(aberdeen.annual ?? 0)} in the middle. But
        jobs based in Aberdeen pay {pounds(aberdeenJobs.fullTimeAnnual)}, the highest of
        Scotland&apos;s four big cities. Next door, people living in Aberdeenshire earn{" "}
        {pounds(aberdeenshire.annual ?? 0)}. That suggests a good share of the better paid city
        jobs go to people who live outside it.
      </P>
      <P>
        Rents in the Aberdeen area are far lower than in Edinburgh or Glasgow, which changes the
        picture for lower paid workers. More in{" "}
        <Link href={CITY_PAY["aberdeen-city"].path}>minimum wage in Aberdeen</Link>.
      </P>

      <H2 id="take-home">What the average salary takes home</H2>
      <P>
        On {pounds(S.annual)}, with Scottish income tax and National Insurance for 2026/27 and no
        pension or student loan, you take home:
      </P>
      <BigStat
        value={pounds(takeHome.net / 12)}
        label="a month after tax and National Insurance"
        exact={`${pounds(takeHome.net)} a year. Income tax ${pounds(takeHome.tax.total)}, National Insurance ${pounds(takeHome.ni.total)}.`}
      />
      <P>
        For round numbers either side, see{" "}
        <Link href={salaryPath(40000)}>£40,000 after tax in Scotland</Link> and{" "}
        <Link href={salaryPath(45000)}>£45,000 after tax in Scotland</Link>, or put in your own
        salary on the <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link>.
      </P>

      <H2 id="spread">What the lowest and highest paid earn</H2>
      <P>
        One average hides a wide spread. This is how full time pay in Scotland lines up, from the
        bottom tenth to the top tenth.
      </P>
      <GuideTable
        kicker={`Full time, ${ASHE_2026.period}`}
        title="The spread of full time pay in Scotland"
        columns={["Where you sit", "Earns less than this", "A year"]}
        align={["left", "left", "right"]}
        rows={[
          ["Lowest tenth", "1 in 10 earn less", pounds(S.spread.p10)],
          ["Lowest fifth", "1 in 5 earn less", pounds(S.spread.p20)],
          ["Lowest quarter", "1 in 4 earn less", pounds(S.spread.p25)],
          ["The middle", "Half earn less", pounds(S.annual)],
          ["Top quarter", "1 in 4 earn more", pounds(S.spread.p75)],
          ["Top tenth", "1 in 10 earn more", pounds(S.spread.p90)],
        ]}
        caption="ONS Annual Survey of Hours and Earnings 2026, Table 8.7a. People living in Scotland, in the same job for at least a year."
      />
      <P>
        A full time job on the legal minimum comes to {pounds(minimumWageNow.annual)} a year, below
        even the lowest tenth here. That&apos;s partly because a lot of minimum wage work is part
        time, and part time jobs aren&apos;t in these figures at all. Count everyone, full and part
        time, and the middle salary drops to {pounds(S.allEmployeesAnnual)}. The rates and take home
        pay at the bottom end are in my{" "}
        <Link href="/minimum-wage-scotland">minimum wage Scotland</Link> guide.
      </P>

      <H2 id="source">Where these figures come from</H2>
      <P>
        The pay figures on this page come from the ONS Annual Survey of Hours and Earnings. Each
        April it asks employers about 1% of employees, picked from PAYE records. I think it&apos;s
        the best picture of pay by council that&apos;s published. It doesn&apos;t cover the self
        employed, and full time means more than 30 paid hours a week.
      </P>
      <P>
        The 2026 figures are provisional. ONS revises them when next year&apos;s figures come out.
        Council figures come from smaller samples than the Scotland figure, so treat small
        differences between neighbouring councils with care.
      </P>

      <PostCTA
        title="See what your salary takes home"
        body="Put in your salary, pension and tax code and see your monthly take home pay on Scottish tax rules."
        href="/take-home-pay-calculator-scotland"
        cta="Open the calculator"
      />
    </Prose>
  );
}
