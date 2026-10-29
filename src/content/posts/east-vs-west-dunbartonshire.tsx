import Link from "@/components/IntentLink";
import { Aside, H2, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import { COMPARE_METRICS, metricById, placeScores, winner } from "@/lib/data/compareAreas";

const EAST = "east-dunbartonshire";
const WEST = "west-dunbartonshire";

/**
 * Scottish Index of Multiple Deprivation 2020 (version 2): each council's
 * data zones counted by national fifth, matched to councils with the official
 * 2011 data zone lookup. Scotland has 6,976 data zones. Source: simd-2020.
 */
const NEIGHBOURHOODS = {
  east: { total: 130, mostDeprived: 5, leastDeprived: 65, worstRank: 199 },
  west: { total: 121, mostDeprived: 48, leastDeprived: 7, worstRank: 58 },
  scotland: 6976,
};

function value(id: string, slug: string) {
  return metricById(id)?.values[slug] ?? null;
}
function shown(id: string, slug: string) {
  const metric = metricById(id);
  const v = metric?.values[slug];
  return metric && v != null ? `${metric.format(v)}${metric.unit ? ` ${metric.unit}` : ""}` : "Not published";
}
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
const oneIn = (pct: number | null) => (pct == null ? "" : `about 1 in ${Math.round(100 / pct)}`);

export default function Post() {
  const ranked = placeScores();
  const eastRank = ranked.find((r) => r.slug === EAST)!.rank;
  const westRank = ranked.find((r) => r.slug === WEST)!.rank;
  const results = COMPARE_METRICS.map((m) => winner(m, EAST, WEST)).filter((w) => w === "a" || w === "b");
  const eastWins = results.filter((w) => w === "a").length;
  const westWins = results.filter((w) => w === "b").length;

  const menEast = value("life_men", EAST)!;
  const menWest = value("life_men", WEST)!;
  const womenEast = value("life_women", EAST)!;
  const womenWest = value("life_women", WEST)!;
  const houseEast = value("house_price", EAST)!;
  const houseWest = value("house_price", WEST)!;
  const crimeEast = value("crime_total", EAST)!;
  const crimeWest = value("crime_total", WEST)!;
  const drugEast = value("drug_deaths", EAST)!;
  const drugWest = value("drug_deaths", WEST)!;
  const kidsEast = value("child_poverty", EAST);
  const kidsWest = value("child_poverty", WEST);

  /** Units sit in the row name, so the two figure columns stay narrow enough for a phone. */
  const rows: Array<[string, string]> = [
    ["life_men", "Life expectancy, men (years)"],
    ["life_women", "Life expectancy, women (years)"],
    ["pay", "Full time weekly pay"],
    ["house_price", "Average house price"],
    ["child_poverty", "Child poverty"],
    ["simd_most_deprived", "Neighbourhoods in Scotland's most deprived fifth"],
    ["crime_total", "Recorded crime, per 10,000 people"],
    ["crime_violence", "Violent crime, per 10,000 people"],
    ["drug_deaths", "Drug deaths, per 100,000 people"],
    ["leavers_higher", "School leavers with a Higher"],
    ["unemployment", "Unemployment"],
  ];
  const bare = (id: string, slug: string) => {
    const metric = metricById(id);
    const v = metric?.values[slug];
    return metric && v != null ? metric.format(v) : "Not published";
  };

  return (
    <Prose>
      <Lead>
        East Dunbartonshire and West Dunbartonshire share a name and a border. On the official figures, one is the{" "}
        {ordinal(eastRank)} best place to live in Scotland and the other is {ordinal(westRank)} out of 32. So what
        happened?
      </Lead>

      <P>
        I put the two side by side with the{" "}
        <Link href={`/compare-areas?a=${EAST}&b=${WEST}`}>compare tool</Link>, expecting a gap. I didn&apos;t expect it to
        be this wide. East Dunbartonshire comes out better on {eastWins} of the {results.length} measures where better or
        worse is clear. West Dunbartonshire comes out better on {westWins}.
      </P>

      <H2 id="short-answer">The short answer</H2>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            value: `${(menEast - menWest).toFixed(1)} years`,
            label: "longer life for men in East Dunbartonshire",
            note: `${menEast.toFixed(1)} against ${menWest.toFixed(1)} years · 2022 to 2024`,
          },
          {
            value: `${NEIGHBOURHOODS.east.mostDeprived} vs ${NEIGHBOURHOODS.west.mostDeprived}`,
            label: "neighbourhoods in Scotland's most deprived fifth",
            note: `Out of ${NEIGHBOURHOODS.east.total} in East and ${NEIGHBOURHOODS.west.total} in West · SIMD 2020`,
          },
          {
            value: `${(houseEast / houseWest).toFixed(1)} times`,
            label: "the price of the average home in East Dunbartonshire",
            note: `${shown("house_price", EAST)} against ${shown("house_price", WEST)} · ${metricById("house_price")?.period}`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat text-[34px] leading-none text-[var(--action-text)]">{stat.value}</p>
            <p className="mt-3 text-[16px] font-[580] leading-[1.4] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <P>
        The short version is this. When Scotland&apos;s councils were redrawn in 1996, the leafy commuter suburbs north of
        Glasgow went into one council, and the old industrial towns on the Clyde went into the other. One side grew up as
        the place people who worked in Glasgow chose to live. The other was built on shipyards and factories, and most of
        those have gone.
      </P>

      <H2 id="numbers">The gap in numbers</H2>

      {/* Its own table rather than GuideTable: three narrow columns that wrap, so a phone shows both councils without scrolling sideways. */}
      <figure className="not-prose my-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
        <figcaption className="border-b border-[var(--rule)] px-5 py-4 text-[19px] font-[620] leading-[1.3] sm:px-6">
          East and West Dunbartonshire side by side
        </figcaption>
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[44%] sm:w-[50%]" />
            <col className="w-[28%] sm:w-[25%]" />
            <col className="w-[28%] sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="ui border-b-2 border-[var(--ink)] text-[14px]">
              <th scope="col" className="px-5 py-3 font-[600] sm:px-6">Measure</th>
              <th scope="col" className="px-2 py-3 font-[700] text-[var(--brand)]">East</th>
              <th scope="col" className="px-2 py-3 pr-5 font-[700] text-[var(--hub-area)] sm:pr-6">West</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, label]) => (
              <tr key={id} className="border-b border-[var(--rule)] last:border-b-0">
                <th scope="row" className="px-5 py-3 text-[15px] font-[540] leading-[1.4] sm:px-6">{label}</th>
                <td className="tnum whitespace-nowrap px-2 py-3 text-[14.5px] font-[600] sm:text-[15.5px]">{bare(id, EAST)}</td>
                <td className="tnum whitespace-nowrap px-2 py-3 pr-5 text-[14.5px] font-[600] sm:pr-6 sm:text-[15.5px]">{bare(id, WEST)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-[var(--rule)] px-5 py-3 text-[14.5px] leading-[1.5] text-[var(--ink-2)] sm:px-6">
          The latest official figure for each measure. Every one is sourced on the compare page.
        </p>
      </figure>

      <P>
        Some of those gaps are big enough to stop you in your tracks. Crime is about{" "}
        {(crimeWest / crimeEast).toFixed(1)} times as high in West Dunbartonshire. So is the drug death rate. And{" "}
        {oneIn(kidsWest)} children there grow up in poverty, against {oneIn(kidsEast)} in East Dunbartonshire.
      </P>

      <PostCTA
        title="See every figure side by side"
        body="Pay, house prices, rent, crime, health, schools and how each council performs, with the source for every number."
        href={`/compare-areas?a=${EAST}&b=${WEST}`}
        cta="Compare East and West Dunbartonshire"
      />

      <H2 id="line">Same name, two councils</H2>

      <P>
        Both councils take their name from the old county of Dunbartonshire. All of West Dunbartonshire was in it, and so
        were Bearsden, Milngavie, Kirkintilloch and Lenzie. Bishopbriggs was actually in Lanarkshire, and the Campsie
        villages were in Stirlingshire.
      </P>
      <P>
        Today&apos;s councils were created in 1996, and their boundaries mostly followed the districts that already
        existed.
      </P>
      <UL>
        <LI>
          <strong>East Dunbartonshire</strong> took in Bearsden and Milngavie district and most of Strathkelvin district.
          That&apos;s Bearsden, Milngavie, Bishopbriggs, Lenzie, Kirkintilloch and the villages around them.
        </LI>
        <LI>
          <strong>West Dunbartonshire</strong> took in Clydebank district and the eastern part of Dumbarton district.
          That&apos;s Clydebank, Dumbarton and the Vale of Leven towns, such as Alexandria and Balloch. Helensburgh went to
          Argyll and Bute. The 1994 law even called the new council Dumbarton and Clydebank, until it renamed itself in
          November 1995.
        </LI>
      </UL>
      <P>
        Because the line followed the old districts, it grouped places that were already very different. The shared name
        hides that.
      </P>

      <H2 id="west">What West Dunbartonshire lost</H2>

      <P>
        Clydebank was built on two huge employers. John Brown&apos;s shipyard launched the Lusitania in 1906, the Queen
        Mary in 1934 and the QE2 in 1967. The Singer sewing machine factory opened in 1884 and, at its height, employed
        more than 15,000 people.
      </P>
      <P>
        Then came the war. The Clydebank Blitz in March 1941 killed 528 people, by the official count, and destroyed
        around 4,000 of the town&apos;s 12,000 homes outright. West Dunbartonshire Council&apos;s museum service says only
        seven houses came through intact.
      </P>
      <P>And then, over twenty years, the work went.</P>
      <UL>
        <LI>
          <strong>1960:</strong> the Blackburn aircraft factory in Dumbarton closed, and the last of the Vale of
          Leven&apos;s Turkey Red dye works shut.
        </LI>
        <LI>
          <strong>1963:</strong> the Denny shipyard in Dumbarton closed.
        </LI>
        <LI>
          <strong>1972:</strong> shipbuilding ended at John Brown&apos;s after Upper Clyde Shipbuilders collapsed. The yard
          built oil rigs until around 2001.
        </LI>
        <LI>
          <strong>1980:</strong> Singer closed. By then it was down to under 5,000 workers.
        </LI>
      </UL>
      <P>
        By December 1978, before Singer had even shut, unemployment among men around Clydebank was 12.5%, almost double the
        British rate of 6.5%. When work on that scale goes, it doesn&apos;t come back in the same numbers.
      </P>
      <P>
        You can still see it in the map of deprivation. Today {NEIGHBOURHOODS.west.mostDeprived} of West
        Dunbartonshire&apos;s {NEIGHBOURHOODS.west.total} neighbourhoods are in Scotland&apos;s most deprived fifth. One of
        the most deprived parts of Clydebank is still called Singer and Clydebank South. And two neighbourhoods in Drumry,
        in Clydebank, are among the 60 most deprived of Scotland&apos;s {NEIGHBOURHOODS.scotland.toLocaleString("en-GB")}.
      </P>
      <P>
        It isn&apos;t standing still. The old John Brown yard is now Queens Quay, with a college, a health centre and new
        homes, and the Titan Crane still stands over the river.
      </P>

      <H2 id="east">How East Dunbartonshire pulled ahead</H2>

      <P>
        Bearsden&apos;s story starts with the railway. When the line to Milngavie opened in 1863, Glasgow&apos;s business and
        professional families started moving out of the crowded city, and Bearsden grew fast around its new station.
        Milngavie began as a mill village, but by around 1900 it was a commuter suburb too.
      </P>
      <P>
        Then it feeds itself. Strong schools draw families who can afford to move for them. That pushes house prices up,
        and high prices decide who can live there. Today {NEIGHBOURHOODS.east.leastDeprived} of East Dunbartonshire&apos;s{" "}
        {NEIGHBOURHOODS.east.total} neighbourhoods, half of them, are in Scotland&apos;s least deprived fifth. And its
        school leavers do better than almost anywhere: {shown("leavers_higher", EAST)} leave with at least one Higher,
        second only to East Renfrewshire. In West Dunbartonshire it&apos;s {shown("leavers_higher", WEST)}.
      </P>

      <H2 id="health">The gap that matters most</H2>

      <P>
        Of all the numbers, this is the one that stays with me. A baby boy born in East Dunbartonshire can expect to live{" "}
        {menEast.toFixed(1)} years. In West Dunbartonshire it&apos;s {menWest.toFixed(1)}. For girls it&apos;s{" "}
        {womenEast.toFixed(1)} against {womenWest.toFixed(1)}. That&apos;s around five years of life. Bearsden and Clydebank
        are about three miles apart.
      </P>
      <P>
        Researchers at the Glasgow Centre for Population Health point to poverty, deprivation and the loss of industry as
        the main reasons the west of Scotland has such poor health. They also found Glasgow does worse than Liverpool and
        Manchester, which lost their industry too. So industry isn&apos;t the whole story, but it&apos;s a big part of it.
      </P>
      <P>
        Drug deaths show the same pattern. Over 2021 to 2025, West Dunbartonshire had {Math.round(drugWest)} drug deaths for
        every 100,000 people each year, against {Math.round(drugEast)} in East Dunbartonshire. That gap follows deprivation
        right across Scotland, as the <Link href="/blog/drug-deaths-scotland-deprivation">drug deaths and deprivation</Link>{" "}
        figures show.
      </P>

      <H2 id="averages">What the averages hide</H2>

      <P>
        These are averages for whole councils, and a council is a big place. East Dunbartonshire has its own deprived
        streets: {NEIGHBOURHOODS.east.mostDeprived} of its neighbourhoods are in Scotland&apos;s most deprived fifth, most
        of them in Hillhead in Kirkintilloch. One of them is the {ordinal(NEIGHBOURHOODS.east.worstRank)} most deprived out of{" "}
        {NEIGHBOURHOODS.scotland.toLocaleString("en-GB")} in Scotland.
      </P>
      <P>
        And West Dunbartonshire has places doing well. In parts of Dumbarton, Balloch and Old Kilpatrick,{" "}
        {NEIGHBOURHOODS.west.leastDeprived} neighbourhoods are in Scotland&apos;s least deprived fifth. So it isn&apos;t that everyone
        on one side is well off and everyone on the other is struggling. It&apos;s how many of each.
      </P>

      <Aside title="How the neighbourhood figures work">
        <p>
          Scotland is split into {NEIGHBOURHOODS.scotland.toLocaleString("en-GB")} small neighbourhoods called data zones,
          each with roughly 500 to 1,000 people. The Scottish Index of Multiple Deprivation ranks every one on income, jobs,
          health, education, housing, crime and access to services. Rank 1 is the most deprived in Scotland. The latest
          index is from 2020.
        </p>
      </Aside>

      <H2 id="who">Who can change it</H2>

      <P>
        No single body owns this. The councils run schools, local housing services and local economic development. The
        Scottish Government funds councils and the NHS, and runs Scottish benefits like the Scottish Child Payment. The UK
        Government sets most benefits and the minimum wage. If you want to know who to ask about something specific,{" "}
        <Link href="/who-decides">who decides</Link> lists it out.
      </P>
      <P>
        If you&apos;re thinking about where to live, the{" "}
        <Link href="/best-place-to-live-in-scotland">best places to live in Scotland</Link> ranking shows every area, and you
        can <Link href="/compare-areas">compare any two areas</Link> the same way I did here.
      </P>
    </Prose>
  );
}
