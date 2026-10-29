import Link from "next/link";
import CouncilPerformanceTable from "@/components/CouncilPerformanceTable";
import { Aside, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import {
  councilPerformanceBySlug,
  councilPerformanceRows,
  evidenceFamilyCount,
  headlineMeasureCount,
  performancePillars,
  robustnessRunCount,
} from "@/lib/data/councilPerformanceIndex";

const winner = councilPerformanceRows[0];
const topTen = councilPerformanceRows.slice(0, 10);
const uncertaintyCouncils = [
  councilPerformanceBySlug["east-renfrewshire"],
  councilPerformanceBySlug["south-ayrshire"],
  councilPerformanceBySlug["east-lothian"],
  councilPerformanceBySlug["city-of-edinburgh"],
  councilPerformanceBySlug["east-dunbartonshire"],
];

const evidenceGroups = [
  {
    name: "What residents said · 25%",
    items: [
      "Satisfaction with local schools",
      "Satisfaction with culture and leisure",
      "Satisfaction with bins and street cleaning",
      "Adult-care users' and carers' experience",
    ],
  },
  {
    name: "Services and results · 40%",
    items: [
      "Positive destinations after school",
      "Primary literacy and numeracy",
      "Attainment gaps",
      "Early-years quality",
      "Attendance and exclusions",
      "Stability for looked-after children",
      "Street cleanliness",
      "Road condition",
      "Recycling",
      "Adult-care quality",
      "Readmissions and delayed discharge",
    ],
  },
  {
    name: "How the council is run · 20%",
    items: [
      "Council gender pay gap",
      "Staff sickness absence",
      "Council-tax collection and invoice payment",
      "Planning speed",
      "Condition and suitability of council buildings",
      "Spending close to budget",
    ],
  },
  {
    name: "Value for money · 10%",
    items: [
      "Waste",
      "Street cleaning",
      "Roads",
      "Schools",
      "Culture and leisure",
      "Planning",
      "Adult care",
    ],
  },
  {
    name: "Council emissions · 5%",
    items: ["Council transport and electricity emissions"],
  },
] as const;

const downloads = [
  {
    href: "/data/scottish-council-performance-index-2026.csv",
    title: "All 32 results",
    note: "Every score and rank, how much data was available, and how far each council moved when we changed the rules",
  },
  {
    href: "/data/scottish-council-performance-methodology-2026.md",
    title: "How we worked it out",
    note: "Every rule we used, what counted, what did not, and how much weight each part received",
  },
  {
    href: "/data/scottish-council-performance-validation-2026.md",
    title: "A separate check of the maths",
    note: "A second calculation checked the source files, council matches, scores and warnings",
  },
  {
    href: "/data/scottish-council-performance-evidence-2026.csv",
    title: "All 29 groups of figures",
    note: "The score for every council in every topic, with the official figures used",
  },
  {
    href: "/data/scottish-council-performance-indicators-2026.csv",
    title: "Every official figure used",
    note: "The number, year and score behind each part of the ranking",
  },
  {
    href: "/data/scottish-council-performance-robustness-2026.csv",
    title: "What happened in 10,000 reruns",
    note: "Each council's usual rank, full range, and how often it made the top five or top ten",
  },
  {
    href: "/data/scottish-council-performance-context-2026.csv",
    title: "Place and accountability context",
    note: "Poverty, crime, housing, budget gaps, drug deaths and Crisis Grants, kept outside the score",
  },
  {
    href: "/data/scottish-council-resident-verdict-2024.csv",
    title: "Residents' five-question verdict",
    note: "All five published perception estimates, their equal-weight average, rank and local survey base",
  },
  {
    href: "/data/scottish-council-landlord-index-2026.csv",
    title: "Council landlord comparison",
    note: "Four housing-management measures across the 26 councils with comparable housing stock",
  },
  {
    href: "/data/scottish-council-performance-indicator-audit-2026.csv",
    title: "Checks on every measure",
    note: "What we used, the year it covers, what the number means and how many councils had data",
  },
  {
    href: "/data/scottish-council-performance-source-manifest-2026.json",
    title: "Full source list",
    note: "Who published each file, where it came from, when we saved it and its digital fingerprint",
  },
] as const;

function TopTenChart() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[15px] font-[760] text-[var(--brand)]">Our main ranking</p>
        <h3 className="mt-1 text-[24px] font-[780] leading-[1.25]">The top ten councils</h3>
      </div>
      <ol className="mt-5 space-y-3">
        {topTen.map((row) => (
          <li key={row.code} className="grid grid-cols-[2ch_minmax(0,1fr)_4ch] items-center gap-3">
            <span className="ui tnum text-right text-[15px] text-[var(--muted)]">{row.overallRank}</span>
            <div className="min-w-0">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <Link href={`/councils/${row.slug}`} className="truncate text-[15.5px] font-[680] text-[var(--ink)]">
                  {row.name}
                </Link>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                <div
                  className={`h-full rounded-full ${row.overallRank === 1 ? "bg-[var(--action)]" : "bg-[var(--brand)]"}`}
                  style={{ width: `${row.overallScore}%` }}
                />
              </div>
            </div>
            <span className="tnum text-right text-[16px] font-[760] text-[var(--ink)]">{row.overallScore.toFixed(1)}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
        These scores only compare Scotland&apos;s 32 councils with each other. They are not percentages, pass marks or official grades. The full table below lets you change the comparison.
      </figcaption>
    </figure>
  );
}

function RankUncertainty() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--deep)] p-5 text-white sm:p-7">
      <p className="ui text-[15px] font-[760] text-[#9db2ff]">How solid is the result?</p>
      <h3 className="mt-1 text-[24px] font-[780] leading-[1.25]">We changed the rules 10,000 sensible ways</h3>
      <p className="mt-3 max-w-[64ch] text-[16px] leading-[1.6] text-[#d7deed]">
        The line shows where each council finished in the middle 90% of those reruns. A short line means its place barely moved. A long line means the result depends more on the choices we made.
      </p>

      <div className="mt-6 space-y-5">
        {uncertaintyCouncils.map((row) => {
          const left = ((row.rankLow - 1) / 31) * 100;
          const width = Math.max(((row.rankHigh - row.rankLow) / 31) * 100, 1.5);
          const median = ((row.medianRank - 1) / 31) * 100;
          return (
            <div key={row.code}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <Link href={`/councils/${row.slug}`} className="text-[15.5px] font-[700] text-white underline decoration-white/30 underline-offset-4">
                  {row.name}
                </Link>
                <span className="ui tnum text-[15px] text-[#d7deed]">#{row.rankLow}–{row.rankHigh} · top five {row.topFiveProbability.toFixed(1)}%</span>
              </div>
              <div
                className="relative h-5 rounded-full bg-white/10"
                role="img"
                aria-label={`${row.name}: usually rank ${row.medianRank}, with most results between rank ${row.rankLow} and rank ${row.rankHigh}`}
              >
                <div className="absolute top-[7px] h-[6px] rounded-full bg-[#7f9cff]" style={{ left: `${left}%`, width: `${width}%` }} />
                <span
                  className="absolute top-[3px] h-[14px] w-[14px] -translate-x-1/2 rounded-full border-2 border-white bg-[var(--action)]"
                  style={{ left: `${median}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="ui mt-4 flex justify-between text-[15px] text-[#b8c3d8]" aria-hidden="true">
        <span>Rank 1</span><span>Rank 32</span>
      </div>
      <figcaption className="mt-5 border-t border-white/15 pt-4 text-[15px] leading-[1.55] text-[#d7deed]">
        East Renfrewshire finished first in 82.4% of the reruns and in the top five in 94.5%. That shows how steady its result was. It does not mean there is an 82.4% chance it is objectively Scotland&apos;s best council.
      </figcaption>
    </figure>
  );
}

function PillarWinners() {
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
      {performancePillars.map((pillar) => {
        const leader = [...councilPerformanceRows].sort(
          (a, b) => a.pillars[pillar.key].rank - b.pillars[pillar.key].rank,
        )[0];
        return (
          <div key={pillar.key} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 last:sm:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="ui text-[15px] font-[720] text-[var(--brand)]">{pillar.label} · {pillar.weight}%</p>
                <Link href={`/councils/${leader.slug}`} className="mt-1 block text-[20px] font-[760] leading-[1.25] text-[var(--ink)]">
                  {leader.name}
                </Link>
              </div>
              <p className="tnum text-[27px] font-[800] leading-none text-[var(--action)]">{leader.pillars[pillar.key].score.toFixed(1)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PeerMovements() {
  const rows = [
    councilPerformanceBySlug.inverclyde,
    councilPerformanceBySlug["west-dunbartonshire"],
    councilPerformanceBySlug["north-ayrshire"],
    councilPerformanceBySlug["east-dunbartonshire"],
    councilPerformanceBySlug["shetland-islands"],
    councilPerformanceBySlug["perth-and-kinross"],
  ];

  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[15px] font-[760] text-[var(--brand)]">All councils → similar councils</p>
        <h3 className="mt-1 text-[24px] font-[780] leading-[1.25]">What changes in a fairer match-up?</h3>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const movement = row.overallRank - row.peerRank;
          return (
            <Link key={row.code} href={`/councils/${row.slug}`} className="flex items-center justify-between gap-4 rounded-[var(--r-s)] bg-[var(--surface-2)] p-4 no-underline">
              <span>
                <span className="block text-[15.5px] font-[700] text-[var(--ink)]">{row.name}</span>
                <span className={`ui mt-1 block text-[15px] font-[680] ${movement > 0 ? "text-[var(--good-text)]" : "text-[var(--bad-text)]"}`}>
                  {movement > 0 ? `rises ${movement} places` : `falls ${Math.abs(movement)} places`}
                </span>
              </span>
              <span className="tnum shrink-0 text-[18px] font-[780] text-[var(--ink)]">#{row.overallRank} <span aria-hidden="true">→</span> #{row.peerRank}</span>
            </Link>
          );
        })}
      </div>
      <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.55] text-[var(--ink-2)]">
        This second list is a clue, not the final answer. It can spot councils doing well in harder conditions. But it can also hide real differences that residents feel.
      </figcaption>
    </figure>
  );
}

function DownloadGrid() {
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
      {downloads.map((file) => (
        <a
          key={file.href}
          href={file.href}
          download
          className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline transition-colors hover:border-[var(--brand)]"
        >
          <span className="ui text-[15px] font-[760] text-[var(--brand)]">
            {file.href.endsWith(".md") ? "Read the checks" : file.href.endsWith(".json") ? "Source list" : "Download the data"} ↓
          </span>
          <span className="mt-1 block text-[17px] font-[730] leading-[1.35] text-[var(--ink)]">{file.title}</span>
          <span className="mt-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">{file.note}</span>
        </a>
      ))}
    </div>
  );
}

export default function Post() {
  const eastRenfrewshire = councilPerformanceBySlug["east-renfrewshire"];
  const shetland = councilPerformanceBySlug["shetland-islands"];
  const northAyrshire = councilPerformanceBySlug["north-ayrshire"];

  return (
    <Prose>
      <Lead>
        East Renfrewshire comes first in our new ranking of all 32 Scottish councils. It is number one for services and results. It also stayed first in all ten extra checks. East Lothian is second. Edinburgh is third.
      </Lead>

      <P>
        But there is no single meaning of &quot;best&quot;. Shetland&apos;s residents rate their council highest. North Ayrshire is best for how the council is run and comes first in our separate council-landlord list. Inverclyde jumps from 12th to third when it is compared with councils facing similar problems.
      </P>

      <H2 id="answer">The answer in four numbers</H2>

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        {[
          { value: "#1", label: winner.name, note: `${winner.overallScore.toFixed(1)} comparison score · #1 for services and results` },
          { value: "94.5%", label: "stayed in the top five", note: "when we changed the rules 10,000 sensible ways" },
          { value: `${headlineMeasureCount}`, label: "official figures checked", note: `put into ${evidenceFamilyCount} topics so no one service can take over the score` },
          { value: "32", label: "councils compared", note: "with a like-for-like rank and usual rank range for every one" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat tnum text-[40px] leading-none text-[var(--action)]">{stat.value}</p>
            <p className="mt-3 text-[17px] font-[730] leading-[1.35] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <Aside title="What first place really means">
        <p>
          East Renfrewshire did best across the official figures we checked. This is not a government award. It does not mean every service is excellent. And 68.6 is a comparison score, not 68.6% of perfect.
        </p>
      </Aside>

      <TopTenChart />

      <H2 id="winner">Why East Renfrewshire comes first</H2>
      <P>
        It does well across the board. East Renfrewshire is first for services and results. It is fourth for what residents said, second for value for money and fourth for the council&apos;s own emissions. Its weak spot is how the council is run, where it ranks only 24th.
      </P>
      <P>
        That weak spot matters. Hiding it would turn a useful finding into an advert. East Renfrewshire&apos;s lead is big enough to survive it. But 24th place still tells residents where to start asking questions.
      </P>

      <div className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
          <div>
            <p className="ui text-[15px] font-[760] text-[var(--brand)]">East Renfrewshire</p>
            <h3 className="mt-1 text-[24px] font-[780]">Why it finished first</h3>
          </div>
          <Link href="/councils/east-renfrewshire" className="ui text-[15px] font-[700]">Open council profile →</Link>
        </div>
        <div className="mt-5 space-y-4">
          {performancePillars.map((pillar) => {
            const result = eastRenfrewshire.pillars[pillar.key];
            return (
              <div key={pillar.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[15.5px] font-[680] text-[var(--ink)]">{pillar.label} <span className="font-[500] text-[var(--muted)]">({pillar.weight}%)</span></span>
                    <span className="ui tnum text-[15px] text-[var(--muted)]">rank #{result.rank}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                    <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${result.score}%` }} />
                  </div>
                </div>
                <span className="tnum w-[3.2ch] text-right text-[17px] font-[760]">{result.score.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <H2 id="uncertainty">Does East Renfrewshire still win if we change the rules?</H2>
      <P>
        No ranking is perfect. We had to decide how much each part should count and how to turn very different figures into one score. So we changed those choices {robustnessRunCount.toLocaleString("en-GB")} sensible ways and ran the ranking again.
      </P>

      <RankUncertainty />

      <P>
        East Renfrewshire has the strongest claim to first place. The next four are more of a leading pack. South Ayrshire is fifth in our main list, but usually finished third and made the top five in 93.0% of the reruns. East Lothian made the top five in 91.5%.
      </P>

      <H2 id="all-councils">Every Scottish council ranked</H2>
      <P>
        Choose what you want to see: all councils, councils facing similar conditions, or what residents said. Search for your council or open its full page. The usual rank range is more honest than pretending one exact place tells the whole story.
      </P>

      <CouncilPerformanceTable />

      <H2 id="different-winners">There is more than one kind of good council</H2>
      <P>
        Services and results count most in our main score. What residents and service users said comes next. We also count how the council is run, value for money and its own emissions. Looking at each part stops one final rank from hiding the real story.
      </P>

      <PillarWinners />

      <P>
        East Lothian wins twice: it is first for value for money and council emissions. North Ayrshire&apos;s result is just as striking. It comes first for how the council is run. That covers its staff, paying bills, planning decisions, public buildings and keeping spending close to budget. It does not reward the area for being richer.
      </P>

      <H2 id="peer-groups">Who does well against councils like them?</H2>
      <P>
        Councils do not all face the same job. The like-for-like list compares each one with an official group facing similar poverty levels, population and rural challenges. East Renfrewshire and East Lothian stay first and second. Inverclyde jumps from 12th to third.
      </P>

      <PeerMovements />

      <P>
        This is where easy assumptions fall apart. West Dunbartonshire and North Ayrshire also jump up the list. Perth and Kinross falls from sixth to 21st. East Dunbartonshire falls from fourth to 12th. The like-for-like list is not the one &quot;true&quot; answer. It shows how much the choice of comparison matters.
      </P>

      <H2 id="residents">Residents do not always agree with the figures</H2>
      <P>
        Shetland comes first for what residents said in our main score. It also wins the separate five-question survey list. Its average is 52.1% across questions about good services, value for money, action, influence and respectful treatment. Perth and Kinross is second at 45.5%.
      </P>
      <P>
        East Renfrewshire is only eighth in that survey list, even though it wins overall. The two lists only partly match. Official figures miss things people feel every day, such as trust, tone and how easy it is to get help. And with only a few hundred answers in each area, small gaps may be down to chance.
      </P>

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
        {[
          { name: "Shetland Islands", big: "#1", label: "what residents said", note: `main rank #${shetland.overallRank}` },
          { name: "East Renfrewshire", big: "#1", label: "main ranking", note: `resident survey rank #${eastRenfrewshire.residentVerdict.rank}` },
          { name: "North Ayrshire", big: "#1", label: "how the council is run", note: `resident survey rank #${northAyrshire.residentVerdict.rank}` },
        ].map((card) => (
          <div key={card.name} className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="tnum text-[34px] font-[820] leading-none text-[var(--action)]">{card.big}</p>
            <p className="mt-3 text-[16px] font-[720] leading-[1.35]">{card.name}</p>
            <p className="mt-1 text-[15px] text-[var(--ink-2)]">{card.label}</p>
            <p className="ui mt-3 border-t border-[var(--rule)] pt-3 text-[15px] text-[var(--muted)]">{card.note}</p>
          </div>
        ))}
      </div>

      <Aside title="Do not make too much of tiny survey gaps">
        <p>
          Between roughly 200 and 870 people answered in each council area. A one or two-point gap may be chance. We show the published figures and the number of people who answered. We do not pretend every tiny gap is real.
        </p>
      </Aside>

      <H2 id="surprises">The result that needs its own investigation</H2>
      <P>
        North Ayrshire is first for how the council is run. It is also first among the 26 councils that still own enough homes to compare fairly. Yet only 87% of surveyed residents said their neighbourhood was a good place to live, the lowest figure in Scotland. And 33% reported loneliness, the highest.
      </P>
      <P>
        Both things can be true. A council can run parts of its own operation well while people in the area still struggle. Poverty, housing, health, transport, national policy and decades of lost jobs all shape daily life. Any honest &quot;best council&quot; story has to show both sides.
      </P>

      <div className="not-prose my-8 rounded-[var(--r-m)] border-l-[5px] border-l-[var(--action)] bg-[var(--surface-2)] p-5 sm:p-7">
        <p className="ui text-[15px] font-[760] text-[var(--brand)]">North Ayrshire&apos;s contradiction</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { value: "#1", label: "how the council is run" },
            { value: "#1", label: "council landlord, 26 eligible" },
            { value: `${northAyrshire.context.goodPlaceToLive.toFixed(0)}%`, label: "say their neighbourhood is a good place to live" },
            { value: `${northAyrshire.context.loneliness.toFixed(0)}%`, label: "report loneliness" },
          ].map((item) => (
            <div key={item.label}>
              <p className="tnum text-[29px] font-[820] leading-none text-[var(--ink)]">{item.value}</p>
              <p className="mt-2 text-[15px] leading-[1.45] text-[var(--ink-2)]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <H2 id="not-in-score">What we did not use to judge councils</H2>
      <P>
        Child poverty, crime, drug deaths, life expectancy, loneliness, housing, budget gaps and Crisis Grant decisions all matter. But they do not all show what the council itself did. Putting them into the score would reward councils simply for serving richer or healthier areas.
      </P>
      <UL>
        <LI><strong>Poverty and health</strong> are shown beside the result as facts about the area. They do not add or remove points.</LI>
        <LI><strong>Budget gaps</strong> are kept out because councils count and close them in different ways.</LI>
        <LI><strong>Crisis Grant award rates</strong> stay separate because national figures do not show who applied or why each claim was refused.</LI>
        <LI><strong>Watchdog finding counts</strong> are kept out because councils are checked at different times and in different depth.</LI>
        <LI><strong>Council landlord results</strong> have their own 26-council table because six councils do not own comparable housing stock.</LI>
      </UL>

      <P>
        This also protects councils serving harder places. Dundee comes last in our main ranking. That does not mean Dundee is Scotland&apos;s worst place to live. It does not mean the council caused the city&apos;s poverty or health problems. It means Dundee had the weakest overall result in the latest council figures we could compare fairly.
      </P>

      <H2 id="method">How we worked it out</H2>
      <P>
        The official council data published in July 2026 has 109 measures. We used the {headlineMeasureCount} that can fairly compare performance across councils. We put similar figures into {evidenceFamilyCount} topics, then used those topics to build the five parts of the score. This stops schools or surveys taking over simply because more figures are published about them.
      </P>

      <div className="not-prose my-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
        <div className="p-5 sm:p-7">
          <p className="ui text-[15px] font-[760] text-[var(--brand)]">The rules we published</p>
          <h3 className="mt-1 text-[24px] font-[780]">What counts, and how much</h3>
        </div>
        <div className="divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
          {performancePillars.map((pillar) => (
            <div key={pillar.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-7">
              <div>
                <p className="text-[16px] font-[690]">{pillar.label}</p>
                <div className="mt-2 h-2.5 max-w-[420px] overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                  <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${(pillar.weight / 40) * 100}%` }} />
                </div>
              </div>
              <p className="tnum text-[22px] font-[800]">{pillar.weight}%</p>
            </div>
          ))}
        </div>
      </div>

      <H3>Costs never win on their own</H3>
      <P>
        We matched every cost with a result. Cheap bin collection with poor recycling does not count as good value. Great results bought at a very high price do not either. Value for money is only 10% of the final score. Remote areas and different local needs can push costs up.
      </P>

      <H3>Missing data is not failure</H3>
      <P>
        If the official source had no figure, we gave the council the middle score of 50, not zero. We also show how much data was available. East Renfrewshire had 98.2%. A total of 24 councils had every figure. Moray had the least, at 93.0%.
      </P>

      <H3>We show the year for every figure</H3>
      <P>
        Most figures are for 2024/25. The latest adult-care and road figures are for 2025/26. Some satisfaction figures combine more than one year of survey answers. The download shows the date beside every number.
      </P>

      <details className="not-prose my-8 overflow-hidden rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)]">
        <summary className="cursor-pointer list-none px-5 py-5 text-[17px] font-[730] text-[var(--ink)] hover:bg-[var(--surface-2)] sm:px-7">
          See all {evidenceFamilyCount} groups of figures <span aria-hidden="true" className="ml-2 text-[var(--brand)]">+</span>
        </summary>
        <div className="grid gap-6 border-t border-[var(--rule)] p-5 sm:grid-cols-2 sm:p-7">
          {evidenceGroups.map((group) => (
            <section key={group.name}>
              <h4 className="text-[16px] font-[740] text-[var(--brand)]">{group.name}</h4>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] leading-[1.45] text-[var(--ink-2)]"><span aria-hidden="true">•</span><span>{item}</span></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </details>

      <Aside title="Why no secret formula">
        <p>
          It would be easy to rig a ranking by changing the rules after seeing the winner. We published every rule, every weight, what we left out and what we did when a figure was missing. You can disagree with our choices without having to guess what they were.
        </p>
      </Aside>

      <H2 id="download">Check every number</H2>
      <P>
        We have published far more than the final list. You can download every score, every official figure, its year, the source files and the result of all 10,000 reruns. Journalists can also download the poverty, crime, housing, budget and Crisis Grant figures that we kept out of the score.
      </P>

      <DownloadGrid />

      <P>
        Most council service figures come from the Improvement Service. What residents said comes from the Scottish Household Survey. Housing, crime, poverty, drug deaths and Crisis Grant figures keep their own official sources, all linked below.
      </P>

      <H2 id="questions">What councils now need to answer</H2>
      <P>
        The list matters only if it leads to answers. Councils near the top should explain what they are doing better, not just celebrate. Councils near the bottom should say what they can fix and what they cannot control.
      </P>
      <UL>
        <LI>Why is East Renfrewshire first for services and results but only 24th for how the council is run?</LI>
        <LI>What is Inverclyde doing that lifts it to third against similar councils?</LI>
        <LI>Why does North Ayrshire run its council and housing so well while getting Scotland&apos;s weakest neighbourhood rating?</LI>
        <LI>Why do Shetland&apos;s residents rate their council highest when it ranks 29th for value and last for council emissions?</LI>
        <LI>Which services place Dundee at the bottom, and what changed after the latest reporting period?</LI>
      </UL>

      <P>
        Scotland Counted will publish any serious council response beside these findings. We will correct any number that does not match the official source. We may add new figures next time, but we will not quietly change the rules to get a neater headline.
      </P>

      <PostCTA
        title="See what your own council does"
        body="Open the local accountability profile for spending, performance, Crisis Grants, councillors and the decisions residents can challenge."
        href="/councils"
        cta="Choose a council"
      />
    </Prose>
  );
}
