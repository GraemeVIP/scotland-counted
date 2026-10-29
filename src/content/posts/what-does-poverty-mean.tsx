import Link from "@/components/IntentLink";
import { Prose, Lead, P, H2, H3, UL, LI, Aside, PostCTA } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { G } from "@/components/Glossary";
import { scotlandPoverty } from "@/lib/data/scotland";
import { plainPeriod } from "@/lib/data/schools";
import { postPath } from "@/lib/routeMap";

/**
 * The UK poverty line after housing costs, 2024/25, in pounds a week.
 * Trust for London's poverty thresholds table (updated August 2026), which
 * applies the DWP Households Below Average Income 2024/25 definition: 60% of
 * median household income after housing costs. Replaces the 2022/23 figures
 * still held in povertyLine in indicators.ts.
 */
const UK_POVERTY_LINE = {
  year: "2024/25",
  rows: [
    { who: "Single adult, working age or pension age", weekly: 212 },
    { who: "Single parent with one child aged one", weekly: 285 },
    { who: "Couple with no children, working age or pension age", weekly: 365 },
    { who: "Couple with two children aged three and seven", weekly: 519 },
  ],
};

/** DWP, Households Below Average Income FYE 2025, published 26 March 2026. Relative low income after housing costs. */
const UK_RATES = { year: "2024/25", allPct: 20, childrenPct: 27, workingAgePct: 19 };

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
const single = UK_POVERTY_LINE.rows[0].weekly;
const familyOfFour = UK_POVERTY_LINE.rows[3].weekly;
const exampleRent = 110;

export default function Post() {
  const period = plainPeriod(scotlandPoverty.period);

  return (
    <Prose>
      <Lead>
        The UK poverty line is 60% of the typical household income in the UK, counted after rent or
        mortgage is paid. In {UK_POVERTY_LINE.year} that meant {gbp(single)} a week for a single
        adult and {gbp(familyOfFour)} a week for a couple with two young children, left over for
        everything except housing.
      </Lead>

      <P>
        When a report says a million people are in poverty, it is not a figure of speech. There is
        an exact test behind it. Once you know the test, every other number on this site becomes
        readable.
      </P>

      <H2 id="what-is-poverty">What is poverty? The UK definition of poverty</H2>

      <P>
        In everyday language, poverty means not having enough money to cover the basics and take
        part in ordinary life: a warm home, enough food, clothes that fit, a bus fare, a school trip.
      </P>

      <P>
        The official UK measure turns that into a test. A household is counted as being in poverty
        when it has <strong>less than 60% of what a typical household in the UK has</strong> to
        live on, once rent or mortgage is paid. &ldquo;Typical&rdquo; here means the{" "}
        <G t="median">median</G>, the household in the middle if you lined everyone up from lowest
        income to highest.
      </P>

      <P>
        That is it. It is a comparison. It asks whether a family has fallen a long way behind what
        is normal in the country they live in. It is not a test of whether people are starving.
      </P>

      <H2 id="uk-poverty-line">What is the UK poverty line?</H2>

      <P>
        Percentages are hard to picture, so here is the same line in pounds a week. This is the
        money left <G t="ahc">after housing costs</G> in {UK_POVERTY_LINE.year}, the latest year
        published. A household with less than this is below the UK poverty line.
      </P>

      <GuideTable
        kicker={`UK poverty line, ${UK_POVERTY_LINE.year}`}
        title="The poverty line in pounds, after rent or mortgage"
        columns={["Household", "A week", "A year"]}
        align={["left", "right", "right"]}
        rows={UK_POVERTY_LINE.rows.map((row) => [row.who, gbp(row.weekly), gbp(row.weekly * 52)])}
        caption={
          <>
            Trust for London, from the Department for Work and Pensions Households Below Average
            Income {UK_POVERTY_LINE.year}. The yearly figure is the weekly one times 52. It is
            income after tax and after rent, so it is not the same as a salary.
          </>
        }
      />

      <P>
        That money has to cover everything that is not rent: food, gas, electricity, travel, school
        shoes, a birthday. If a family has less than that, they are in poverty by the official
        measure.
      </P>

      <P>
        Bigger households need more, but not double. The official method assumes a second adult or
        an older child adds to costs, while some costs, like a cooker or a fridge, are shared.
        Children aged 14 and over count for more than younger children, so the line is higher for
        a family with teenagers.
      </P>

      <H2 id="single-person">UK poverty line for a single person</H2>

      <P>
        For one adult living alone the line was {gbp(single)} a week in {UK_POVERTY_LINE.year},
        about {gbp(single * 52)} a year, after tax and after housing costs. The same figure applies
        to a single pensioner.
      </P>

      <Aside title="Worked example">
        <p>
          Say you live alone and pay {gbp(exampleRent)} a week in rent. To reach the poverty line
          you need {gbp(single)} left after rent, so {gbp(single + exampleRent)} a week coming in
          after tax, National Insurance and council tax, including any benefits. Less than that and
          you are below the line. These numbers are made up to show the sum, so use your own.
        </p>
      </Aside>

      <P>
        For what a wage actually leaves you with, the{" "}
        <Link href="/take-home-pay-calculator-scotland">take home pay calculator</Link> works it
        out, and pages like <Link href="/20000-after-tax-scotland">£20,000 after tax in Scotland</Link>{" "}
        show the sums for common salaries.
      </P>

      <H2 id="am-i-below">Am I below the poverty line?</H2>

      <P>You can check it roughly in four steps.</P>

      <UL>
        <LI>
          <strong>Add up what comes in each week.</strong> Wages after tax and National Insurance,
          plus benefits such as Universal Credit, Child Benefit and the{" "}
          <Link href="/scottish-child-payment">Scottish Child Payment</Link>, plus any pension.
        </LI>
        <LI>
          <strong>Take off council tax.</strong> The official measure counts income after council
          tax.
        </LI>
        <LI>
          <strong>Take off your housing costs.</strong> That means rent (before any housing
          benefit), water charges, and for owners the interest part of the mortgage. In Scotland
          water charges come on your council tax bill, see{" "}
          <Link href="/water-rates-scotland">water rates in Scotland</Link>.
        </LI>
        <LI>
          <strong>Compare what is left</strong> with the line for a household like yours in the
          table above.
        </LI>
      </UL>

      <P>
        If you are close to or under the line, check what you are entitled to. The{" "}
        <Link href="/benefits">benefits guide</Link> covers the main Scottish and UK payments,{" "}
        <Link href="/council-tax-reduction-scotland">Council Tax Reduction</Link> can cut your bill,
        and a <Link href="/crisis-grant-scotland">Crisis Grant</Link> can help in an emergency.
      </P>

      <H2 id="after-housing-costs">Before and after housing costs</H2>

      <P>
        You will see two versions of poverty figures, before housing costs and after. This site
        uses after, and so does the Scottish Government headline.
      </P>

      <P>
        The reason is simple. Rent is not optional and it is not the same everywhere. Two families
        on identical wages are not equally well off if one hands over £700 a month and the other
        £300. Counting the money that is actually left is closer to how life works.
      </P>

      <P>
        The choice changes the answer. Across the UK in {UK_RATES.year}, 16% of people were in
        relative poverty before housing costs and {UK_RATES.allPct}% after. Housing costs push
        hardest on renters and families with children.
      </P>

      <Aside title="One thing worth knowing">
        <p>
          Because the line moves with what is normal, relative poverty can fall in a bad year. If
          everyone&apos;s income drops together, the line drops too. That is why serious reporting
          reads it alongside other measures, and why I show ten years rather than one.
        </p>
      </Aside>

      <H2 id="relative-absolute">Relative poverty and absolute poverty in the UK</H2>

      <P>Three words get used, and they measure different things.</P>

      <GuideTable
        title="The three main measures of poverty"
        columns={["Measure", "What it asks", "Below the line if"]}
        rows={[
          [
            "Relative poverty",
            "Has this household fallen far behind what is normal today?",
            "Income is under 60% of this year's median",
          ],
          [
            "Absolute poverty",
            "Are living standards improving over time?",
            "Income is under 60% of the median in a fixed past year, raised only with prices",
          ],
          [
            "Persistent poverty",
            "Is poverty lasting?",
            "The household was in relative poverty in three or more of the last four years",
          ],
        ]}
        caption="Each can be counted before or after housing costs. The Scottish headline figures on this site are after housing costs."
      />

      <UL>
        <LI>
          <strong><G t="relative-poverty">Relative poverty</G></strong> is the main headline
          measure. When people say &ldquo;the poverty line&rdquo;, this is usually what they mean.
        </LI>
        <LI>
          <strong><G t="absolute-poverty">Absolute poverty</G></strong> holds the line still and only
          adjusts it for prices. If absolute poverty falls, people at the bottom really are better
          off than they were.
        </LI>
        <LI>
          <strong><G t="persistent">Persistent poverty</G></strong> does the most damage, because
          short spells can be recovered from and long ones cannot. Families run out of savings and
          things to sell.
        </LI>
      </UL>

      <H2 id="poverty-in-the-uk">Poverty in the UK and Scotland: the latest figures</H2>

      <P>
        Across the UK, {UK_RATES.allPct}% of people were below the poverty line after housing costs
        in {UK_RATES.year}, according to the Department for Work and Pensions. For children it was{" "}
        {UK_RATES.childrenPct}%.
      </P>

      <P>
        In Scotland, {scotlandPoverty.all.pct}% of people,{" "}
        {scotlandPoverty.all.count.toLocaleString("en-GB")} of them, were below the same line on
        average over {period}. For children it was {scotlandPoverty.children.pct}%.
      </P>

      <GuideTable
        kicker="Relative poverty after housing costs"
        title="Scotland compared with the UK"
        columns={["Group", `Scotland, ${period}`, `UK, ${UK_RATES.year}`]}
        align={["left", "right", "right"]}
        rows={[
          ["All people", `${scotlandPoverty.all.pct}%`, `${UK_RATES.allPct}%`],
          ["Children", `${scotlandPoverty.children.pct}%`, `${UK_RATES.childrenPct}%`],
          ["Working age adults", `${scotlandPoverty.workingAge.pct}%`, `${UK_RATES.workingAgePct}%`],
          ["Pensioners", `${scotlandPoverty.pensioners.pct}%`, "Not compared here"],
        ]}
        caption={
          <>
            Scottish Government, Poverty and Income Inequality in Scotland, and Department for Work
            and Pensions, Households Below Average Income. Scotland&apos;s figure is an average of
            three years because its survey sample is smaller, so compare the two with care.
          </>
        }
      />

      <P>
        Those are national figures. The number where you live can be very different, and in some
        places it is far worse. The <Link href="/poverty-in-scotland">poverty in Scotland</Link>{" "}
        page has the full picture, and the <Link href="/causes-of-poverty">causes of poverty</Link>{" "}
        guide explains why some families fall below the line.
      </P>

      <PostCTA
        title="See the figure for your own area"
        body="Every council area and every MP area in Scotland has its own page, with ten years of figures and the source underneath."
        href="/areas"
        cta="Find my area"
      />

      <H2 id="modern-studies">Using the poverty line in Modern Studies</H2>

      <P>
        Poverty comes up in the social inequality part of National 5, Higher and Advanced Higher
        Modern Studies. Markers want the right word, a figure, and where the figure came from.
      </P>

      <GuideTable
        kicker="Key terms"
        title="Poverty words to know"
        columns={["Term", "What it means"]}
        rows={[
          ["Poverty line", "60% of median UK household income. Below it, a household counts as poor."],
          ["Median", "The middle income when everyone is lined up from lowest to highest."],
          ["Relative poverty", "Below 60% of this year's median income."],
          ["Absolute poverty", "Below 60% of the median in a fixed past year, adjusted for prices."],
          ["Persistent poverty", "In relative poverty for three of the last four years or more."],
          ["After housing costs", "Income once rent or mortgage interest and water charges are paid."],
          [
            "In work poverty",
            <>
              Being in poverty even though someone in the household has a job. See{" "}
              <Link href={postPath("do-people-in-poverty-work")}>in work poverty in Scotland</Link>.
            </>,
          ],
        ]}
      />

      <H3>A paragraph you could write</H3>

      <P>
        <strong>Point:</strong> poverty in Scotland is lower than in the UK as a whole.{" "}
        <strong>Evidence:</strong> {scotlandPoverty.all.pct}% of people in Scotland were in relative
        poverty after housing costs over {period} (Scottish Government), against {UK_RATES.allPct}%
        across the UK in {UK_RATES.year} (Department for Work and Pensions).{" "}
        <strong>Explain:</strong> one reason is lower housing costs for many families, because
        Scotland has more social housing. <strong>Evaluate:</strong> the Scottish figure is a three
        year average and the UK one is a single year, so the gap should be read as a rough guide.
      </P>

      <P>
        For more, see <Link href="/modern-studies">Modern Studies resources</Link>, the{" "}
        <Link href="/national-5-modern-studies">National 5 Modern Studies</Link> revision notes and
        model answers, the{" "}
        <Link href="/higher-modern-studies">Higher Modern Studies</Link> evidence for each section,
        and the six question <Link href="/poverty-in-scotland-quiz">poverty quiz</Link>.
      </P>

      <P>
        The full definitions are in the <Link href="/glossary">plain English glossary</Link>, and
        the exact method is on the <Link href="/methods">methods page</Link>.
      </P>
    </Prose>
  );
}
