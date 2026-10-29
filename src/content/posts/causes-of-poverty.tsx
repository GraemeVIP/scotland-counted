import Link from "next/link";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, BigStat, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { G } from "@/components/Glossary";
import { scotlandPoverty } from "@/lib/data/scotland";
import { COUNCIL_YEARS, councils } from "@/lib/data/councils";
import { deprivationDrugDeathRates2024 } from "@/lib/data/drugDeaths";
import { pounds } from "@/lib/data/quickAnswers";
import { postPath } from "@/lib/routeMap";
import { JRF_SCOTLAND_2026 as JRF, PHS_CHILD_POVERTY as PHS, plainPeriod } from "@/lib/data/schools";

export default function Post() {
  const period = plainPeriod(scotlandPoverty.period);
  const year = COUNCIL_YEARS[COUNCIL_YEARS.length - 1];
  const byRate = [...councils].sort((a, b) => b.pcts[b.pcts.length - 1] - a.pcts[a.pcts.length - 1]);
  const highest = byRate[0];
  const lowest = byRate[byRate.length - 1];
  const rateOf = (c: (typeof councils)[number]) => c.pcts[c.pcts.length - 1];
  const mostDeprived = deprivationDrugDeathRates2024[0];
  const leastDeprived = deprivationDrugDeathRates2024[deprivationDrugDeathRates2024.length - 1];
  const times = Math.round(mostDeprived.rate / leastDeprived.rate);

  return (
    <Prose>
      <Lead>
        Poverty in Scotland isn&apos;t mainly about people making bad choices. The official evidence
        points to three things: how much people get from work, what life costs, and how much social
        security pays. In {period}, {scotlandPoverty.all.pct}% of people in Scotland,{" "}
        {scotlandPoverty.all.count.toLocaleString("en-GB")} of them, were in poverty.
      </Lead>

      <H2 id="drivers">The three drivers of poverty</H2>
      <P>
        Public Health Scotland, and the Scottish Government&apos;s child poverty plans, group the
        causes of child poverty into three drivers. Public Health Scotland says they are rooted in
        how Scottish society is structured, not in individual choices or behaviour.
      </P>
      <UL>
        <LI>
          <strong>Income from work:</strong> whether there are jobs, how many hours people get, what
          they are paid, and what stops them working more, such as childcare.
        </LI>
        <LI>
          <strong>The cost of living:</strong> housing above all, plus food, fuel, the cost of the
          school day, and the extra costs of disability or living somewhere rural.
        </LI>
        <LI>
          <strong>Income from social security:</strong> how generous benefits are, who can get them,
          and whether people actually claim them.
        </LI>
      </UL>
      <P>
        Poverty here means <G t="relative-poverty">relative poverty</G>{" "}
        <G t="ahc">after housing costs</G>: a household left with less than 60% of the typical UK
        income once the rent or mortgage is paid. If that is new to you, my{" "}
        <Link href={postPath("what-does-poverty-mean")}>what does poverty mean</Link> explainer
        covers it in five minutes.
      </P>

      <H2 id="work">Cause 1: income from work</H2>
      <BigStat
        value={`${scotlandPoverty.childrenInWorkingHouseholdsPct}%`}
        label="of children in poverty in Scotland live in a household where someone works"
        exact={`Scottish Government, ${period}.`}
      />
      <P>
        Work protects people from poverty, but not reliably. The Joseph Rowntree Foundation (JRF)
        found {JRF.peopleInPovertyWithWorkPct}% of people in poverty in Scotland had someone in work.
        What matters is how much work, and what it pays.
      </P>
      <GuideTable
        kicker={`Scotland, ${period}`}
        title="Chance of being in poverty, by work in the family"
        columns={["Family", "In poverty"]}
        align={["left", "right"]}
        rows={JRF.work.map((row) => [row.family, `${row.pct}%`])}
        caption="Joseph Rowntree Foundation, Poverty in Scotland 2026."
      />
      <P>
        Full time work protects best. Pay matters, but so do hours: a family with only part time
        work is far more exposed, and part time is often all that fits around childcare,
        caring or a disability. The JRF also points out that in many parts of Scotland people who
        want to work simply can&apos;t find jobs within reach of home. For what the legal minimum
        actually pays, see <Link href="/minimum-wage-scotland">minimum wage Scotland</Link> and{" "}
        <Link href="/real-living-wage-scotland">real Living Wage Scotland</Link>.
      </P>

      <H2 id="costs">Cause 2: the cost of living</H2>
      <P>
        Housing is the big one, because poverty is measured after rent or mortgage is paid. Two
        families on the same wage are not equally well off if one pays far more in rent.
      </P>
      <GuideTable
        kicker={`Scotland, ${period}`}
        title="Chance of being in poverty, by type of home"
        columns={["Home", "In poverty"]}
        align={["left", "right"]}
        rows={JRF.tenure.map((row) => [row.home, `${row.pct}%`])}
        caption="Joseph Rowntree Foundation, Poverty in Scotland 2026."
      />
      <P>
        The JRF found {JRF.privateRentersPulledInPct}% of all private renters in Scotland are pulled
        into poverty by their housing costs, and for {JRF.privateRentersRentDriverPct}% of private
        renters in poverty, rent is a main reason they are poor. Scotland&apos;s larger share of
        social housing has historically helped keep its poverty rate below the rest of the UK.
      </P>
      <P>
        Then there is everything else. Public Health Scotland lists food and fuel, the poverty
        premium (people on low incomes paying more for the same things), the cost of the school day,
        and the extra, unavoidable costs of disability or rural life. For the latest on bills, see{" "}
        <Link href="/energy-price-cap-scotland">the energy price cap in Scotland</Link> and{" "}
        <Link href={postPath("why-is-the-cost-of-living-so-high")}>why the cost of living is still so high</Link>.
      </P>

      <H2 id="security">Cause 3: income from social security</H2>
      <P>
        Benefits are meant to be the safety net. The JRF found {JRF.universalCreditFamiliesPct}% of
        people in families getting Universal Credit, or the benefits it replaced, were still in
        poverty in {period}. Its conclusion is that the value of social security is not enough to
        keep many families out of poverty.
      </P>
      <P>
        Disability adds its own pressure. Disability benefits are meant to cover the extra costs of
        being disabled, not everyday living. Measured that way, {JRF.disabilityBenefitFamiliesPct}% of
        people in families getting a disability benefit are in poverty, against{" "}
        {JRF.noDisabilityBenefitPct}% of people in families that don&apos;t.
      </P>
      <P>
        Most benefits, including Universal Credit, are decided by the UK Government. Scotland has its
        own payments too, the biggest for families being the{" "}
        <Link href="/scottish-child-payment">Scottish Child Payment</Link>. The{" "}
        <Link href="/who-is-responsible-for-poverty-in-scotland">who is responsible for poverty</Link>{" "}
        page sets out which government holds which lever.
      </P>

      <H2 id="who">Who is most at risk</H2>
      <P>
        The Scottish Government names six priority families, where children are at greater risk of
        poverty:
      </P>
      <UL>
        {JRF.priorityFamilies.map((family) => (
          <LI key={family}>{family}</LI>
        ))}
      </UL>
      <P>
        The JRF found {JRF.priorityShare} children in poverty are in at least one of these groups.
        The highest risks are below.
      </P>
      <GuideTable
        kicker={`Scotland, ${period}`}
        title="Child poverty in the highest risk families"
        columns={["Family", "Children in poverty"]}
        align={["left", "right"]}
        rows={[
          ...JRF.priorityRates.map((row) => [row.family, `${row.pct}%`]),
          ["All children", `${scotlandPoverty.children.pct}%`],
        ]}
        caption="Joseph Rowntree Foundation, Poverty in Scotland 2026, and Scottish Government."
      />

      <H2 id="myths">What the evidence does not support</H2>
      <UL>
        <LI>
          <strong>That poverty is mainly about people not working.</strong>{" "}
          {scotlandPoverty.childrenInWorkingHouseholdsPct}% of children in poverty have a working
          adult at home. More on that in{" "}
          <Link href={postPath("do-people-in-poverty-work")}>do people in poverty work?</Link>
        </LI>
        <LI>
          <strong>That people in poverty can&apos;t manage money.</strong> Public Health Scotland found
          low income households have similar money management skills to everyone else. They are still
          more likely to be in debt on household bills, because the money doesn&apos;t stretch.
        </LI>
      </UL>

      <H2 id="effects">Effects of poverty</H2>
      <P>
        Poverty isn&apos;t just a line on a chart. The effects spread into health, family life and
        whole communities.
      </P>
      <UL>
        <LI>
          <strong>It runs deep.</strong> People in poverty had incomes {JRF.averageGapPct}% below the
          poverty line on average. For those in very deep poverty it was {JRF.veryDeepGapPct}%. For a
          couple with two children in very deep poverty, the JRF puts the gap at around{" "}
          {pounds(JRF.veryDeepCoupleMonthlyGap)} a month.
        </LI>
        <LI>
          <strong>It shows up in health.</strong> In 2024 the drug death rate in Scotland&apos;s most
          deprived areas was {mostDeprived.rate} per 100,000 people, against {leastDeprived.rate} in
          the least deprived, about {times} times higher. See{" "}
          <Link href={postPath("drug-deaths-scotland-deprivation")}>drug deaths and deprivation</Link>.
        </LI>
        <LI>
          <strong>It depends on where you live.</strong> In {year}, child poverty ranged from{" "}
          {rateOf(highest)}% in {highest.name} to {rateOf(lowest)}% in {lowest.name}. Find any area on{" "}
          <Link href="/areas">the area pages</Link>.
        </LI>
        <LI>
          <strong>It costs everyone.</strong> Public Health Scotland says the harm poverty does to
          health also hits the economy, public services such as the NHS and schools, and government
          budgets.
        </LI>
      </UL>

      <H2 id="childhood">Effects of childhood poverty</H2>
      <P>
        Public Health Scotland&apos;s evidence on children is stark. The harm starts before birth and
        builds up over a lifetime. Poverty affects children&apos;s health, their social, emotional and
        learning development, their behaviour and how they do at school.
      </P>
      <P>It explains how this happens in two ways, both useful in a Higher essay:</P>
      <UL>
        <LI>
          <strong>The investment model:</strong> on a low income, families can&apos;t afford the
          things that help children develop well, from healthy food and a warm home to the full
          cost of taking part in school.
        </LI>
        <LI>
          <strong>The family stress model:</strong> worry about money harms parents&apos; mental
          health, and that affects family life and parenting.
        </LI>
      </UL>
      <P>
        One example: children under 16 in the lowest income households were almost four times as
        likely to have fair, bad or very bad general health as those in the highest income
        households ({PHS.poorHealth.lowestIncomePct}% against {PHS.poorHealth.highestIncomePct}%,
        Scottish Health Survey {PHS.poorHealth.year}). And it can pass on: Public Health Scotland
        says disadvantaged adults may be at greater risk of their own children growing up in poverty.
      </P>
      <Aside title="Scotland's child poverty targets">
        <p>
          The Child Poverty (Scotland) Act 2017 set a target of under {JRF.childTarget.interimPct}%
          relative child poverty by {JRF.childTarget.interimYear}, and under{" "}
          {JRF.childTarget.finalPct}% by {JRF.childTarget.finalYear}. The rate is{" "}
          {scotlandPoverty.children.pct}%. The interim target was missed, and the JRF says the final
          one is set to be missed by a wide margin. The options for closing the gap, with costs, are
          on <Link href="/solutions-to-poverty-in-scotland">solutions to poverty in Scotland</Link>.
        </p>
      </Aside>

      <H2 id="answers">Using this in a Modern Studies answer</H2>
      <P>
        Causes and effects of inequality come up at every level. A few ways to use this page:
      </P>
      <UL>
        <LI>
          <strong>National 5 explain questions:</strong> take two causes, explain each, and back each
          with one figure from this page. There is a worked example in the{" "}
          <Link href="/national-5-modern-studies#model-answers">National 5 model answers</Link>.
        </LI>
        <LI>
          <strong>Higher essays:</strong> a question like &ldquo;to what extent is low pay the main
          cause of poverty?&rdquo; needs you to weigh work against housing and social security, then
          reach a judgement. The figures above give you evidence for each side.
        </LI>
        <LI>
          <strong>Assignments and dissertations:</strong> every figure here links to its source, so
          you can quote the original and evaluate it. The{" "}
          <Link href="/modern-studies">modern studies resources</Link> page has more.
        </LI>
      </UL>
      <H3>Where the figures come from</H3>
      <P>
        The headline rates are the Scottish Government&apos;s official poverty statistics. The detail
        on work, housing, benefits and families comes from the Joseph Rowntree Foundation&apos;s
        Poverty in Scotland 2026, published {JRF.published}, which analyses the same official data.
        The drivers and the effects on children come from Public Health Scotland. All are listed in
        the sources below.
      </P>

      <PostCTA
        title="See who has the power to change it"
        body="Pay, rent rules and benefits are split between Westminster, Holyrood and your council. See which lever sits where, and who to ask."
        href="/who-is-responsible-for-poverty-in-scotland"
        cta="Who is responsible"
      />
    </Prose>
  );
}
