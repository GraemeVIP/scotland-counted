import Link from "next/link";
import { Prose, Lead, P, H2, UL, LI, Aside, PostCTA, BigStat } from "@/components/Prose";
import { GuideTable } from "@/components/GuideTable";
import { councilPerformanceRows } from "@/lib/data/councilPerformanceIndex";
import { councilShoplifting } from "@/lib/data/shoplifting";
import { latestYear as sexualCrimeLatest, q3Table2024 } from "@/lib/data/glasgowSexualCrime";
import { sourcesById } from "@/lib/data/sources";
import {
  GLASGOW_CRIME as C,
  GLASGOW_CRIME_PREVIOUS as PREVIOUS,
  changePct,
  councilSearchName,
} from "@/lib/data/local";

const n = (value: number) => value.toLocaleString("en-GB");

/* The council ranking reuses the 2025/26 rates already held for the council index. */
const ranked = [...councilPerformanceRows].sort(
  (a, b) => b.context.recordedCrimeRate - a.context.recordedCrimeRate,
);
const glasgowRank = ranked.findIndex((row) => row.slug === "glasgow-city") + 1;
const highest = ranked[0];
const lowest = ranked[ranked.length - 1];

const shoplifting = councilShoplifting.find((row) => row.area === "Glasgow City");
const allSexual = sexualCrimeLatest.find((row) => row.crime === "All sexual crimes");
const rape2024 = q3Table2024.find((row) => row.crime === "Rape");
const q3Report = sourcesById["ps-glasgow-q3-2024-25"];

const first = C.history[0];
const yearChange = changePct(PREVIOUS.glasgow, C.glasgow.crimes);
const longChange = changePct(first.glasgow, C.glasgow.crimes);
const timesScotland = (C.glasgow.rate / C.scotland.rate).toFixed(1);
const d = C.detail;

export default function Post() {
  return (
    <Prose>
      <Lead>
        Glasgow&apos;s recorded crime rate was {n(C.glasgow.rate)} crimes per 10,000 people in{" "}
        {C.year}, against {n(C.scotland.rate)} for Scotland as a whole.{" "}
        {glasgowRank === 2 && <>Only {councilSearchName(highest.slug)} was higher. </>}
        Crime in the city is far below where it was in the 1990s, but it went up {yearChange}% last
        year.
      </Lead>

      <H2 id="rate">Glasgow against the rest of Scotland</H2>
      <BigStat
        value={n(C.glasgow.rate)}
        label="Recorded crimes per 10,000 people in Glasgow"
        exact={`${C.year}, April to March. ${n(C.glasgow.crimes)} crimes. Scotland ${n(C.scotland.rate)} per 10,000.`}
      />
      <P>
        Police in Glasgow City recorded {n(C.glasgow.crimes)} crimes in the year to March 2026.
        Per head, that&apos;s about {timesScotland} times Scotland&apos;s rate. Across Scotland
        there were {n(C.scotland.crimes)}, the most since 2014/15.
      </P>
      <GuideTable
        kicker={C.year}
        title="Highest recorded crime rates in Scotland"
        columns={["Council", "Crimes per 10,000 people"]}
        align={["left", "right"]}
        rows={[
          ...ranked.slice(0, 8).map((row) => [
            <Link key="c" href={`/councils/${row.slug}`}>
              {councilSearchName(row.slug)}
            </Link>,
            n(Math.round(row.context.recordedCrimeRate)),
          ]),
          ["Scotland", n(C.scotland.rate)],
        ]}
        caption={`The 8 highest of 32 councils. The lowest was ${councilSearchName(lowest.slug)}, at ${n(Math.round(lowest.context.recordedCrimeRate))}. Scottish Government, Recorded Crime in Scotland.`}
      />

      <H2 id="types">Crime stats Glasgow by type</H2>
      <P>
        The official figures sort crimes into five groups. Glasgow is above the Scottish rate in
        every one of them, but by very different amounts.
      </P>
      <GuideTable
        kicker={C.year}
        title="Recorded crime in Glasgow by type"
        columns={["Type", "Glasgow crimes", "Glasgow per 10,000", "Scotland per 10,000"]}
        align={["left", "right", "right", "right"]}
        rows={C.groups.map((row) => [row.group, n(row.glasgow), n(row.glasgowRate), n(row.scotlandRate)])}
        caption="Rates as published by the Scottish Government, rounded to whole numbers."
      />
      <P>
        Theft and other dishonesty is the biggest group, {n(C.groups[2].glasgow)} crimes.
        {shoplifting && (
          <>
            {" "}Nearly half of that is shoplifting, {n(shoplifting.y2025)} cases, which I&apos;ve
            looked at in{" "}
            <Link href="/blog/shoplifting-scotland-record-high">shoplifting hits a record high</Link>.
          </>
        )}{" "}
        There were also {n(d.housebreaking)} housebreakings and {n(d.fraud)} frauds.
      </P>
      <P>
        Violence that isn&apos;t sexual came to {n(C.groups[0].glasgow)} crimes. Most were common
        assaults ({n(d.commonAssault)}). There were {n(d.seriousAssaultAndAttemptedMurder)} serious
        assaults or attempted murders, {n(d.robbery)} robberies and{" "}
        {n(d.murderAndCulpableHomicide)} murders or culpable homicides.
      </P>
      <P>
        Crimes against society run at nearly twice the Scottish rate. These are mostly crimes the
        police find themselves, like carrying drugs ({n(d.drugsPossession)}) or a weapon, rather than
        crimes a victim reports. So the count reflects how much proactive policing there is as well
        as how much crime.
      </P>
      <P>
        Sexual crimes came to {n(C.groups[1].glasgow)}.
        {allSexual && (
          <>
            {" "}In the year to June 2026 they rose from {n(allSexual.glasgow2025)} to{" "}
            {n(allSexual.glasgow2026)}, up{" "}
            {changePct(allSexual.glasgow2025, allSexual.glasgow2026)}%, the same rise as Scotland.
          </>
        )}{" "}
        I went through what is behind the recent rise, and what the records can and can&apos;t
        tell us, in{" "}
        <Link href="/blog/glasgow-sex-crime-rise-migrants">Glasgow sex crimes went up 28%</Link>.
      </P>

      <H2 id="years">Crime in Glasgow by year</H2>
      <P>
        In {first.year} the city recorded {n(first.glasgow)} crimes, a rate of{" "}
        {n(first.glasgowRate)} per 10,000. Since then the number has fallen by{" "}
        {Math.abs(longChange)}%. Most of that fall came before 2016/17. The rate in {C.year} was
        higher than in any of the four years before it.
      </P>
      <GuideTable
        kicker="April to March"
        title="Recorded crime in Glasgow and Scotland"
        columns={["Year", "Glasgow crimes", "Glasgow per 10,000", "Scotland per 10,000"]}
        align={["left", "right", "right", "right"]}
        rows={[
          ...C.history.map((row) => [row.year, n(row.glasgow), n(row.glasgowRate), n(row.scotlandRate)]),
          [C.year, n(C.glasgow.crimes), n(C.glasgow.rate), n(C.scotland.rate)],
        ]}
        caption="Scottish Government, Recorded Crimes and Offences open data, updated August 2026. Selected years."
      />

      <H2 id="caveats">What the rate leaves out</H2>
      <UL>
        <LI>
          It&apos;s per resident. Lots of people from the surrounding councils work, shop and go out
          in Glasgow, so crimes involving visitors still count against the city&apos;s own population.
        </LI>
        <LI>It only counts crime the police recorded. Plenty is never reported.</LI>
        <LI>
          Crimes and offences are counted separately. On top of the crimes, Glasgow police recorded{" "}
          {n(C.glasgow.offences)} offences in {C.year}, things like threatening behaviour, drink
          driving and speeding. That&apos;s {n(C.glasgow.offenceRate)} per 10,000, against{" "}
          {n(C.scotland.offenceRate)} for Scotland.
        </LI>
        <LI>
          Recording changes. Every police division was on one national recording system by April
          2024, and new guidance on evidence in domestic abuse cases came in the same month. Both
          can affect comparisons with earlier years.
        </LI>
      </UL>

      <H2 id="local">The local police reports</H2>
      <P>
        Police Scotland reports on Glasgow&apos;s local policing plan every quarter to the Safe
        Glasgow Partnership, and the papers are public on the council&apos;s committee website. They
        come out sooner than the official statistics but use police counts.
        {rape2024 && q3Report && (
          <>
            {" "}The{" "}
            <a href={q3Report.url}>report for April to December 2024</a>, for example, showed recorded
            rapes up from {n(rape2024.before)} to {n(rape2024.after)} on the same months a year
            earlier.
          </>
        )}
      </P>

      <Aside title="What a crime rate can and can't tell you">
        <p>
          It&apos;s a count of crimes recorded for every 10,000 people who live in the city. It
          isn&apos;t the chance of you being a victim, and it says nothing about which streets the
          crimes happened on. What it does show well is the direction: Glasgow records{" "}
          {Math.abs(longChange)}% fewer crimes than it did in {first.year}.
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
