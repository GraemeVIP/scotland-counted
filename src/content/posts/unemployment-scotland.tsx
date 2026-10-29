import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import {
  ANNUAL_POPULATION_SURVEY as APS,
  CLAIMANT_COUNT as CC,
  COUNCIL_UNEMPLOYMENT as COUNCILS,
  LABOUR_MARKET as LM,
  LABOUR_MARKET_LATEST as LATEST,
  councilSearchName,
  pct,
  pointsChange,
} from "@/lib/data/local";

const n = (value: number) => value.toLocaleString("en-GB");
const roundThousand = (value: number) => n(Math.round(value / 1000) * 1000);

const peak = LM.junToAug.reduce((a, b) => (b.rate > a.rate ? b : a));
const low = LM.junToAug.reduce((a, b) => (b.rate < a.rate ? b : a));
const firstUnderFive = LM.junToAug.find((row) => row.year > peak.year && row.rate < 5);
const top = COUNCILS.rows[0];
const second = COUNCILS.rows[1];
const bottom = COUNCILS.rows[COUNCILS.rows.length - 1];
const widest = COUNCILS.rows.reduce((a, b) => (b.margin > a.margin ? b : a));
const previousRolling = LM.earlier2026[LM.earlier2026.length - 1];

export default function Post() {
  return (
    <Prose>
      <Lead>
        Scotland&apos;s unemployment rate was {pct(LATEST.rate)} in {LATEST.period}, against{" "}
        {pct(LM.uk.rate)} for the UK. That&apos;s about {roundThousand(LM.scotland.unemployed)}{" "}
        people who want a job and are looking for one. It&apos;s{" "}
        {pointsChange(LATEST.rateChangeOnYear)} on a year earlier, and the figures have been jumpy
        all year.
      </Lead>

      <H2 id="rate">Scotland unemployment rate</H2>
      <P>
        The headline comes from the ONS Labour Force Survey. It counts people aged 16 and over who
        don&apos;t have a job, have looked for one in the last four weeks and could start within two
        weeks. The rate is that number as a share of everyone who is either working or looking.
      </P>
      <P>
        Each figure covers three months. The latest, published on {LM.published}, is for{" "}
        {LATEST.period}. It&apos;s down from {pct(previousRolling.rate)} in{" "}
        {previousRolling.months}. The next figures are due on {LM.nextRelease}.
      </P>
      <GuideTable
        kicker="2026 so far"
        title="Scotland unemployment rate, rolling three months"
        columns={["Months", "Rate"]}
        align={["left", "right"]}
        rows={[
          ...LM.earlier2026.map((row) => [row.months, pct(row.rate)]),
          [<strong key="l">{LATEST.period.replace(" 2026", "")}</strong>, <strong key="r">{pct(LATEST.rate)}</strong>],
        ]}
        caption="People aged 16 and over, seasonally adjusted. ONS warns against reading much into short term moves like these, because the survey sample for Scotland is small."
      />

      <H2 id="trend">The trend since 2008</H2>
      <P>
        To compare like with like, the table below uses June to August in each year. Unemployment
        climbed after the 2008 crash to {pct(peak.rate)} in {peak.year}
        {firstUnderFive && <> and was back under 5% by {firstUnderFive.year}</>}. The lowest point
        here is {pct(low.rate)} in {low.year}.
      </P>
      <GuideTable
        kicker="June to August each year"
        title="Unemployment and employment in Scotland"
        columns={["Year", "Unemployment rate", "Employment rate"]}
        align={["left", "right", "right"]}
        rows={LM.junToAug.map((row) => [String(row.year), pct(row.rate), pct(row.employment)])}
        caption="Unemployment is for people aged 16 and over, employment for ages 16 to 64. ONS Labour Force Survey, Scotland, seasonally adjusted."
      />

      <H2 id="employment">Scotland employment rate</H2>
      <P>
        {pct(LATEST.employment)} of people aged 16 to 64 in Scotland were in work in{" "}
        {LATEST.period}, against {pct(LM.uk.employment)} across the UK. Scotland&apos;s figure is{" "}
        {pointsChange(LATEST.employmentChangeOnYear)} on a year earlier.
      </P>
      <P>
        Another {pct(LM.scotland.inactivity)} of that age group were neither working nor looking for
        work, against {pct(LM.uk.inactivity)} for the UK. That includes students, carers, people who
        are long term sick and people who&apos;ve retired early. They aren&apos;t counted as
        unemployed, which is one reason a low unemployment rate doesn&apos;t always mean a strong
        jobs market.
      </P>

      <H2 id="youth">Youth unemployment Scotland</H2>
      <P>
        For young people the monthly survey is too small, so the better figure is the Annual
        Population Survey, which pools a year of interviews. For {APS.period},{" "}
        {pct(APS.scotland.youth)} of 16 to 24 year olds in Scotland who were working or looking for
        work were unemployed. That&apos;s about {n(APS.scotland.youthUnemployed)} young people. The
        UK figure was {pct(APS.uk.youth)}.
      </P>
      <P>
        The Scottish figure has a margin of error of about {APS.scotland.youthMargin} points either
        way, so Scotland and the UK are effectively level. And a lot of 16 to 24 year olds are in
        full time education and not looking for work, so they aren&apos;t in the rate at all.{" "}
        {pct(APS.scotland.youthEmployment)} of the whole age group had a job.
      </P>

      <H2 id="councils">Unemployment by council</H2>
      <P>
        ONS also estimates an unemployment rate for every council, combining the survey with claimant
        figures so that small areas are less erratic. {councilSearchName(top.slug)} is highest at{" "}
        {pct(top.rate)}, then {councilSearchName(second.slug)} at {pct(second.rate)}.{" "}
        {councilSearchName(bottom.slug)} is lowest at {pct(bottom.rate)}. On the same survey, Scotland
        as a whole was {pct(APS.scotland.rate)} and the UK {pct(APS.uk.rate)}.
      </P>
      <GuideTable
        kicker={COUNCILS.period}
        title="Unemployment rate by council"
        columns={["Council", "Rate", "Margin", "Unemployed"]}
        align={["left", "right", "right", "right"]}
        rows={COUNCILS.rows.map((row) => [
          <Link key="c" href={`/areas/${row.slug}`}>
            {councilSearchName(row.slug)}
          </Link>,
          pct(row.rate),
          `± ${row.margin.toFixed(1)}`,
          n(row.unemployed),
        ])}
        caption={`People aged 16 and over, highest first. The margin is plus or minus, in percentage points, at 95% confidence. ${councilSearchName(widest.slug)}'s ${pct(widest.rate)} has a margin of ${widest.margin.toFixed(1)} points, so treat the smaller councils with care.`}
      />
      <P>
        For Glasgow&apos;s longer story, the{" "}
        <Link href="/indicators/glasgow-employment-rate">Glasgow employment rate</Link> chart goes back
        to 2004.
      </P>

      <H2 id="claimant">The claimant count</H2>
      <P>
        A quicker, rougher measure is the claimant count: people claiming benefits because
        they&apos;re out of work, mainly Universal Credit claimants who are expected to look for a
        job. In {CC.month} that was {n(CC.scotland.claimants)} people in Scotland,{" "}
        {pct(CC.scotland.rate)} of residents aged 16 to 64, against {pct(CC.uk.rate)} across the UK.
      </P>
      <P>
        It isn&apos;t the same as unemployment. Some people out of work don&apos;t claim, and some
        people who claim are working a few hours. The{" "}
        <Link href="/indicators/glasgow-claimant-count">Glasgow claimant count</Link> chart shows how
        the city compares since 2000.
      </P>

      <Aside title="How much to trust the figures">
        <p>
          The Labour Force Survey had a hard few years as fewer people took part. ONS says its
          estimates from January to March 2025 onwards include the full effect of the fixes, but
          some volatility remains, especially for smaller breakdowns like Scotland on its own. A
          staffing error in May 2026 also cut telephone interviewing for a while. ONS says it had
          minimal impact on the headline figures.
        </p>
      </Aside>

      <P>
        If you&apos;re out of work and money has run out, a{" "}
        <Link href="/crisis-grant-scotland">crisis grant</Link> from your council can help with
        essentials. And if you&apos;re weighing up a job offer, the{" "}
        <Link href="/minimum-wage-scotland">minimum wage in Scotland</Link> guide shows what it
        leaves you after tax.
      </P>

      <PostCTA
        title="Weighing up a job?"
        body="Put in the salary and see what you'd take home each month under Scottish income tax."
        href="/take-home-pay-calculator-scotland"
        cta="Take home pay calculator"
      />
    </Prose>
  );
}
