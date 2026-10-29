import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, BigStat, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { G } from "@/components/Glossary";
import { scotlandPoverty } from "@/lib/data/scotland";
import { JRF_SCOTLAND_2026 as JRF, plainPeriod } from "@/lib/data/schools";
import { MINIMUM_WAGE } from "@/lib/data/quickAnswers";
import { postPath } from "@/lib/routeMap";

/**
 * Worked example only. The poverty line is the UK line after housing costs for
 * a couple with two children aged three and seven, 2024/25 (Trust for London,
 * from DWP Households Below Average Income). Income and rents are made up.
 */
const EXAMPLE = {
  povertyLine: 519,
  income: 650,
  rents: [
    { family: "Family A", monthly: 300 },
    { family: "Family B", monthly: 700 },
  ],
};

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

export default function Post() {
  const period = plainPeriod(scotlandPoverty.period);
  const fullTime = JRF.work.find((row) => row.family.startsWith("At least one adult"));
  const partTime = JRF.work.find((row) => row.family.startsWith("Only part time"));
  const noWork = JRF.work.find((row) => row.family.startsWith("No one works"));
  const allFullTime = JRF.work.find((row) => row.family.startsWith("Everyone"));
  const exampleRows = EXAMPLE.rents.map((row) => {
    const weeklyRent = Math.round((row.monthly * 12) / 52);
    const left = EXAMPLE.income - weeklyRent;
    return [
      row.family,
      gbp(EXAMPLE.income),
      `${gbp(row.monthly)} a month (${gbp(weeklyRent)} a week)`,
      gbp(left),
      left < EXAMPLE.povertyLine ? "Below the line" : "Above the line",
    ];
  });

  return (
    <Prose>
      <Lead>
        Yes, most people in poverty in Scotland live in a household where someone works. Three in
        four children in poverty ({scotlandPoverty.childrenInWorkingHouseholdsPct}%) have a working
        adult at home, and about two in three people in poverty ({JRF.peopleInPovertyWithWorkPct}%)
        have someone in work. That is in work poverty, and it is now the normal kind.
      </Lead>

      <P>
        Say the word poverty and someone will tell you that people should get a job. It is the
        oldest answer there is. It is also, for most families in poverty in Scotland, describing
        something they already did.
      </P>

      <BigStat
        value={`${scotlandPoverty.childrenInWorkingHouseholdsPct}%`}
        label="of children in poverty in Scotland live in a household where somebody works"
        exact={`Roughly 3 in every 4. Scottish Government, ${period}.`}
      />

      <P>
        That is the whole argument in one number. Three quarters of the children counted as poor in
        Scotland have a parent who gets up and goes to work. Not a small minority. The clear
        majority.
      </P>

      <P>
        It means the common explanation for poverty, that it is caused by people not working, does
        not fit the facts. Something else is going on.
      </P>

      <H2 id="what-is-in-work-poverty">What is in work poverty?</H2>

      <P>
        In work poverty means living in a household that is below the poverty line even though at
        least one adult in it has a paid job.
      </P>

      <P>
        Poverty is measured for the whole household, not the worker. The test is whether the
        household has less than 60% of typical UK income once rent or mortgage is paid, the{" "}
        <Link href={postPath("what-does-poverty-mean")}>UK poverty line</Link>. One wage has to
        stretch across everyone in the home, so a job that would be enough for one person can leave
        a family of four below the line.
      </P>

      <H2 id="in-work-poverty-scotland">In work poverty in Scotland: the figures</H2>

      <P>
        The Joseph Rowntree Foundation (JRF), using the official figures for {period}, found{" "}
        {JRF.peopleInPovertyWithWorkPct}% of people in poverty in Scotland had someone in work. The
        table shows how the chance of being in poverty changes with the amount of work in a family.
      </P>

      <GuideTable
        kicker={`Scotland, ${period}`}
        title="Chance of being in poverty, by work in the family"
        columns={["Family", "In poverty"]}
        align={["left", "right"]}
        rows={JRF.work.map((row) => [row.family, `${row.pct}%`])}
        caption="Joseph Rowntree Foundation, Poverty in Scotland 2026. After housing costs."
      />

      <P>
        Two things are true at once, and it is worth holding both.
      </P>

      <UL>
        <LI>
          <strong>Work cuts the risk a lot.</strong> {noWork?.pct}% of people in families where
          nobody works are in poverty. Where at least one adult works full time it is{" "}
          {fullTime?.pct}%, and where every adult works full time it is {allFullTime?.pct}%.
        </LI>
        <LI>
          <strong>Most people in poverty still work.</strong> Most families have someone in a job,
          so even a lower risk spread across all of them adds up to most of the people in poverty.
        </LI>
      </UL>

      <P>
        The kind of work matters as much as having a job. {partTime?.pct}% of people in families
        with only part time work are in poverty, more than double the rate where someone works full
        time.
      </P>

      <H2 id="why-work-does-not-fix-it">So why does the work not fix it?</H2>

      <P>Three things, and they stack on top of each other.</P>

      <UL>
        <LI>
          <strong>Wages have not kept up.</strong> A job that covered the bills fifteen years ago
          may not cover them now. The price of food, energy and rent moved faster than pay did. The
          legal minimum for workers aged 21 and over is £{MINIMUM_WAGE.current.over21.toFixed(2)} an
          hour from April 2026, see <Link href="/minimum-wage-scotland">minimum wage Scotland</Link>,
          and the voluntary <Link href="/real-living-wage-scotland">real Living Wage</Link> is higher.
        </LI>
        <LI>
          <strong>The hours are not always there.</strong> Part time work, short contracts and
          shifts that change week to week all mean the money changes week to week too. You cannot
          budget for a wage you cannot predict. And part time is often all that fits around
          childcare, caring or a disability.
        </LI>
        <LI>
          <strong>Housing takes the difference.</strong> This is the big one, and it is the reason
          the official measure works the way it does.
        </LI>
      </UL>

      <H2 id="housing-costs">Why housing changes the picture</H2>

      <P>
        Poverty in these figures is measured <G t="ahc">after housing costs</G>. Rent or mortgage
        comes off first, and what is left is what counts.
      </P>

      <P>
        That is deliberate, and it is the fairer way round. Two families can earn exactly the same
        wage, and the one paying £700 a month in rent has far less to live on than the one paying
        £300. Measuring before housing would call them equally well off. They are not.
      </P>

      <GuideTable
        kicker="Worked example, made up numbers"
        title="Same income, different rent"
        columns={["Family", "Coming in each week", "Rent", "Left after rent", `Against the ${gbp(EXAMPLE.povertyLine)} line`]}
        align={["left", "right", "right", "right", "left"]}
        rows={exampleRows}
        caption={
          <>
            Both are couples with two children aged three and seven, with the same income after tax
            and council tax. The poverty line for that family was {gbp(EXAMPLE.povertyLine)} a week
            after housing costs in 2024/25 (Trust for London, from DWP figures).
          </>
        }
      />

      <Aside title="What this means in practice">
        <p>
          A pay rise that is swallowed by a rent rise does not move a family out of poverty. On
          paper they earn more. In the kitchen, nothing changed.
        </p>
      </Aside>

      <H2 id="what-this-changes">What this changes about the argument</H2>

      <P>
        If poverty were mostly about worklessness, the fix would be jobs. Scotland does not have a
        jobs problem of that kind,{" "}
        <Link href="/why-poverty-is-worse-in-glasgow">Glasgow has more jobs than working age residents</Link>,
        and it still has the worst child poverty rate in the country.
      </P>

      <P>
        What moves the number is how much money families are left with: what they earn, what they
        get in support, and what housing takes. Those are decisions, and they are made by people
        you can name and write to. The{" "}
        <Link href="/causes-of-poverty">causes of poverty</Link> guide sets out all three drivers.
      </P>

      <H2 id="what-helps">What can help a working family</H2>

      <P>If you are in work and still short each week, some help is designed for exactly that.</P>

      <UL>
        <LI>
          <strong>Universal Credit</strong> is paid to people in work as well as out of it, and
          tops up low pay. The <Link href="/benefits">benefits guide</Link> explains what you can
          claim.
        </LI>
        <LI>
          <strong>The <Link href="/scottish-child-payment">Scottish Child Payment</Link></strong>{" "}
          is paid for each child under 16 in a low income family getting a qualifying benefit such
          as Universal Credit, whether the parents work or not.
        </LI>
        <LI>
          <strong>The <Link href="/best-start-grant">Best Start Grant</Link></strong> helps with
          the costs of pregnancy and young children.
        </LI>
        <LI>
          <strong><Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link></strong>{" "}
          can lower your bill on a low income, in work or not.
        </LI>
        <LI>
          <strong>Check your pay.</strong> The{" "}
          <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link> shows what
          should reach the bank after tax.
        </LI>
      </UL>

      <PostCTA
        title="Find out what it looks like where you live"
        body="Enter your postcode and see the figure for your own area, then send a ready written email to the people who decide. It takes about a minute and you do not need to know anything about politics."
        href="/email-your-mp-and-msp"
        cta="See my area and email my MP"
      />

      <H2 id="modern-studies">Using in work poverty in a Modern Studies answer</H2>

      <P>
        In work poverty is one of the strongest pieces of evidence for the social inequality topic,
        because it challenges the idea that poverty is only about people not working.
      </P>

      <H3>A paragraph you could write</H3>

      <P>
        <strong>Point:</strong> having a job does not always protect a family from poverty.{" "}
        <strong>Evidence:</strong> {scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in
        poverty in Scotland live in a household where someone works (Scottish Government, {period}).{" "}
        <strong>Explain:</strong> low pay, part time hours and high rents can leave a working family
        below the poverty line. <strong>Balance:</strong> work still lowers the risk a lot, since{" "}
        {noWork?.pct}% of people in families where nobody works are in poverty, against{" "}
        {fullTime?.pct}% where at least one adult works full time (Joseph Rowntree Foundation).
      </P>

      <P>
        There is a full National 5 example in the{" "}
        <Link href="/national-5-modern-studies#model-answers">National 5 Modern Studies model answers</Link>,
        and more up to date evidence on the{" "}
        <Link href="/higher-modern-studies#evidence">Higher Modern Studies</Link> page. The{" "}
        <Link href="/modern-studies">Modern Studies resources</Link> page lists everything on this
        site for pupils and teachers, including the{" "}
        <Link href="/poverty-in-scotland-quiz">poverty quiz</Link>.
      </P>

      <P>
        Every figure here is published and sourced. You can{" "}
        <Link href="/data">download the data</Link> or{" "}
        <Link href="/methods">read exactly how it was counted</Link>.
      </P>
    </Prose>
  );
}
