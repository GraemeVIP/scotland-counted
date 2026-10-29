import Link from "next/link";
import { Prose, Lead, P, H2, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import {
  LIFE_EXPECTANCY as LE,
  LIFE_EXPECTANCY_LATEST as LATEST,
  councilSearchName,
  years,
} from "@/lib/data/local";

const gap = (a: number, b: number) => years(Math.abs(b - a));

const glasgow = LATEST.glasgow;
const scotland = LATEST.scotland;
const first = LE.trend[0];
const highest = LE.councils[LE.councils.length - 1];
const fifths = LE.glasgowByDeprivation.rows;
const mostDeprived = fifths[0];
const leastDeprived = fifths[fifths.length - 1];
const preCovid = LE.trend.find((row) => row.period === "2017 to 2019");
const pandemicLow = LE.trend.find((row) => row.period === "2020 to 2022");

const fifthLabel = (fifth: number) =>
  fifth === 1 ? "1, most deprived" : fifth === 5 ? "5, least deprived" : String(fifth);

export default function Post() {
  return (
    <Prose>
      <Lead>
        Life expectancy in Glasgow is {years(glasgow.men)} years for men and{" "}
        {years(glasgow.women)} for women. Both are the lowest of Scotland&apos;s 32 council areas.
        The figures are rising again after the pandemic, but the gap inside the city is far bigger
        than the gap between Glasgow and the rest of Scotland.
      </Lead>

      <H2 id="average">Average life expectancy Glasgow</H2>
      <P>
        These are the latest National Records of Scotland figures, for {LATEST.period}, published on{" "}
        {LE.published}. They&apos;re worked out over three years so that one good or bad year
        doesn&apos;t swing them.
      </P>
      <GuideTable
        kicker={LATEST.period}
        title="Life expectancy at birth"
        columns={["", "Glasgow", "Scotland", "Gap"]}
        align={["left", "right", "right", "right"]}
        rows={[
          ["Men", `${years(glasgow.men)} years`, `${years(scotland.men)} years`, `${gap(glasgow.men, scotland.men)} years`],
          ["Women", `${years(glasgow.women)} years`, `${years(scotland.women)} years`, `${gap(glasgow.women, scotland.women)} years`],
        ]}
        caption={`Scotland here is worked out the same way as the council figures, so the two compare fairly. The official national headline, from fuller tables, is ${LE.scotlandHeadline.men} for men and ${LE.scotlandHeadline.women} for women.`}
      />
      <P>
        NRS doesn&apos;t publish one figure for men and women together, so any single number you see
        for everyone in Glasgow isn&apos;t an official one.
      </P>
      <P>
        It&apos;s also worth knowing what the number means. It&apos;s how long a baby would live, on
        average, if the death rates at each age stayed as they were in those three years. It
        isn&apos;t a forecast for anyone in particular.
      </P>

      <H2 id="men">Glasgow male life expectancy</H2>
      <BigStat
        value={`${years(glasgow.men)} years`}
        label="Life expectancy for men in Glasgow, the lowest in Scotland"
        exact={`${LATEST.period}. Scotland ${years(scotland.men)}, ${councilSearchName(highest.slug)} ${years(highest.men)}.`}
      />
      <P>
        That&apos;s {gap(glasgow.men, scotland.men)} years less than Scotland as a whole, and{" "}
        {gap(glasgow.men, highest.men)} years less than {councilSearchName(highest.slug)}, which
        borders the city and has the highest figure in Scotland.
      </P>
      <P>
        It has moved a lot. In {first.period} it was {years(first.glasgow.men)}.
        {preCovid && pandemicLow && (
          <>
            {" "}It rose to {years(preCovid.glasgow.men)} by {preCovid.period}, fell back to{" "}
            {years(pandemicLow.glasgow.men)} over the pandemic years, and is now the highest NRS
            has recorded for the city.
          </>
        )}{" "}
        For women the picture is flatter: {years(glasgow.women)} now, about where it was ten years
        ago.
      </P>
      <GuideTable
        kicker="Three year periods"
        title="Glasgow and Scotland over time"
        columns={["Period", "Glasgow men", "Glasgow women", "Scotland men", "Scotland women"]}
        align={["left", "right", "right", "right", "right"]}
        rows={LE.trend.map((row) => [
          row.period,
          years(row.glasgow.men),
          years(row.glasgow.women),
          years(row.scotland.men),
          years(row.scotland.women),
        ])}
        caption="Life expectancy at birth in years. NRS revised the figures from 2009 to 2011 onwards in December 2025 to use updated population estimates, so older copies can differ slightly."
      />

      <H2 id="gap">The gap inside Glasgow</H2>
      <P>
        The bigger story is inside the city. NRS splits Glasgow&apos;s own neighbourhoods into five
        equal groups by how deprived they are. Over {LE.glasgowByDeprivation.period}, men in the most
        deprived fifth could expect {years(mostDeprived.men)} years. In the least deprived fifth it
        was {years(leastDeprived.men)}. That&apos;s a gap of {gap(mostDeprived.men, leastDeprived.men)}{" "}
        years, inside one city.
      </P>
      <P>
        For women it was {years(mostDeprived.women)} against {years(leastDeprived.women)}, a gap of{" "}
        {gap(mostDeprived.women, leastDeprived.women)} years.
      </P>
      <GuideTable
        kicker={LE.glasgowByDeprivation.period}
        title="Life expectancy across Glasgow, by deprivation"
        columns={["Fifth of Glasgow", "Men", "Women"]}
        align={["left", "right", "right"]}
        rows={fifths.map((row) => [fifthLabel(row.fifth), years(row.men), years(row.women)])}
        caption="Each fifth is 20% of Glasgow's own neighbourhoods, ranked by the Scottish Index of Multiple Deprivation. Five year period, published by NRS in March 2026."
      />
      <P>
        So where you live in Glasgow matters far more for how long you live than whether you live in
        Glasgow at all. Across Scotland, the gap between the most and least deprived tenth of areas is{" "}
        {gap(LE.scotlandByDeprivation.mostDeprived.men, LE.scotlandByDeprivation.leastDeprived.men)}{" "}
        years for men and{" "}
        {gap(LE.scotlandByDeprivation.mostDeprived.women, LE.scotlandByDeprivation.leastDeprived.women)}{" "}
        for women.
      </P>
      <P>
        The
        poverty side of the story is in{" "}
        <Link href="/glasgow-poverty-statistics">Glasgow poverty statistics</Link> and{" "}
        <Link href="/why-poverty-is-worse-in-glasgow">why poverty is worse in Glasgow</Link>. Drug
        deaths follow the same pattern, and I&apos;ve covered them in{" "}
        <Link href="/blog/drug-deaths-scotland-deprivation">drug deaths and deprivation</Link>.
      </P>

      <H2 id="councils">Glasgow against every other council</H2>
      <GuideTable
        kicker={LATEST.period}
        title="Life expectancy by council area"
        columns={["Council", "Men", "Women"]}
        align={["left", "right", "right"]}
        rows={LE.councils.map((row) => [
          <Link key="c" href={`/areas/${row.slug}`}>
            {councilSearchName(row.slug)}
          </Link>,
          years(row.men),
          years(row.women),
        ])}
        caption="Life expectancy at birth in years, lowest for men first. Smaller councils, the islands especially, have wider margins of error, so small differences between them mean little."
      />

      <H2 id="at-65">At 65</H2>
      <P>
        The gap doesn&apos;t close later in life. A Glasgow man who reaches 65 can expect about{" "}
        {years(LE.at65.glasgow.men)} more years, against {years(LE.at65.scotland.men)} across
        Scotland. For women it&apos;s {years(LE.at65.glasgow.women)} against{" "}
        {years(LE.at65.scotland.women)}.
      </P>

      <Aside title="Older figures you might see">
        <p>
          You&apos;ll still see older numbers quoted, from the ONS series that ended at 2017 to
          2019, or the 2021 to 2023 figures, when Glasgow men were at{" "}
          {years(LE.trend[LE.trend.length - 2].glasgow.men)}. The {LATEST.period} figures above
          replace both.
        </p>
      </Aside>

      <PostCTA
        title="See the rest of Glasgow's figures"
        body="Child poverty, pay, the council's budget and the cost of living, for Glasgow in one place."
        href="/areas/glasgow-city"
        cta="Glasgow in numbers"
      />
    </Prose>
  );
}
