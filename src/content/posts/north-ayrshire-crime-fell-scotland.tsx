import Link from "@/components/IntentLink";
import { Aside, BigStat, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import {
  councilCrimeChanges,
  northAyrshireCrimeTypes,
  northAyrshireGroupChanges,
  northAyrshireOffences,
  northAyrshireTenYear,
  scotlandCrimeTotal,
} from "@/lib/data/northAyrshireCrime";

const fmt = (n: number) => n.toLocaleString("en-GB");
const signed = (n: number, digits = 1) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(digits)}%`;

const chartHighlights = [
  ...councilCrimeChanges.slice(0, 3),
  scotlandCrimeTotal,
  ...councilCrimeChanges.slice(-5),
];

const peerCouncils = [
  "north-ayrshire",
  "east-ayrshire",
  "north-lanarkshire",
  "glasgow-city",
  "west-dunbartonshire",
  "na-h-eileanan-siar",
  "inverclyde",
  "dundee-city",
]
  .map((slug) => councilCrimeChanges.find((row) => row.slug === slug)!)
  .sort((a, b) => a.changePct - b.changePct);

function SignedBar({
  value,
  minNeg,
  maxPos,
  colorVar,
}: {
  value: number;
  minNeg: number;
  maxPos: number;
  colorVar: string;
}) {
  const span = minNeg + maxPos;
  const zeroPct = (minNeg / span) * 100;
  const widthPct = (Math.min(Math.abs(value), value < 0 ? minNeg : maxPos) / span) * 100;
  const leftPct = value < 0 ? zeroPct - widthPct : zeroPct;
  return (
    <div className="relative h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
      <div className="absolute inset-y-0 w-px bg-[var(--rule-strong)]" style={{ left: `${zeroPct}%` }} />
      <div
        className="absolute inset-y-0 rounded-full"
        style={{
          background: `var(${colorVar})`,
          width: `${Math.max(widthPct, 1.5)}%`,
          left: `${leftPct}%`,
        }}
      />
    </div>
  );
}

function CouncilChangesChart() {
  return (
    <div className="not-prose my-8">
      <Figure
        n={1}
        title="Only three councils cut crime in 2025-26. North Ayrshire led Scotland."
        sub="Change in police recorded crime from 2024-25 to 2025-26 · the three that fell, Scotland total, and the five biggest rises"
        legend={[
          { name: "Crime fell", colorVar: "--good" },
          { name: "Scotland total", colorVar: "--brand" },
          { name: "Biggest rises", colorVar: "--action" },
        ]}
        caption={
          <>
            Police recorded crime rose in 29 of Scotland&apos;s 32 councils. Source: Scottish Government, 2025-26.{" "}
            <a href="/data/scottish-recorded-crime-by-council-2025-26.csv" download>
              Download all 32 councils (CSV)
            </a>
            .
          </>
        }
        table={
          <DataTable
            head={["Area", "2024-25", "2025-26", "Change", "Rate per 10,000", "Solved"]}
            rows={[scotlandCrimeTotal, ...councilCrimeChanges].map((row) => [
              row.area,
              fmt(row.count2024),
              fmt(row.count2025),
              signed(row.changePct, 1),
              row.rate2025.toFixed(1),
              `${row.clearUp2025.toFixed(1)}%`,
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-3"
          role="img"
          aria-label="Bar chart showing recorded crime fell in North Ayrshire by 4.1%, East Renfrewshire by 3.0% and Highland by 0.5%, while Scotland rose 5.4% and Dundee City rose 18.3%."
        >
          {chartHighlights.map((row) => {
            const isScotland = row.slug === "scotland";
            const colorVar = row.changePct < 0 ? "--good" : isScotland ? "--brand" : "--action";
            return (
              <div key={row.slug} className="grid grid-cols-[10rem_1fr_4.2rem] sm:grid-cols-[12.5rem_1fr_4.5rem] items-center gap-3">
                <span className={`text-[15px] leading-[1.35] ${row.slug === "north-ayrshire" || isScotland ? "font-[650] text-[var(--ink)]" : "text-[var(--ink-2)]"}`}>
                  {row.area}
                </span>
                <SignedBar value={row.changePct} minNeg={6} maxPos={20} colorVar={colorVar} />
                <span className="tnum text-right text-[15px] font-[620] text-[var(--ink)]">{signed(row.changePct, 1)}</span>
              </div>
            );
          })}
        </div>
      </Figure>
    </div>
  );
}

function CrimeGroupsChart() {
  return (
    <div className="not-prose my-8">
      <Figure
        n={2}
        title="Four out of five crime groups fell in North Ayrshire"
        sub="Change in recorded crime from 2024-25 to 2025-26 · North Ayrshire against Scotland"
        legend={[
          { name: "North Ayrshire", colorVar: "--good" },
          { name: "Scotland", colorVar: "--brand" },
        ]}
        caption="Violent crime, damage, crimes against society and dishonesty all dropped in North Ayrshire. Only sex crimes went up."
        table={
          <DataTable
            head={["Crime group", "North Ayrshire 2024-25", "North Ayrshire 2025-26", "North Ayrshire %", "Scotland %", "North Ayrshire solved"]}
            rows={northAyrshireGroupChanges.map((g) => [
              g.label,
              fmt(g.na2024),
              fmt(g.na2025),
              signed(g.naPct, 1),
              signed(g.scPct, 1),
              `${g.naClearUp2025.toFixed(1)}%`,
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-4"
          role="img"
          aria-label="North Ayrshire crime dropped 7.2% in violence, 5.3% in damage, 4.7% in crimes against society and 2.9% in dishonesty, while sexual crimes rose 10.4%."
        >
          {northAyrshireGroupChanges.map((g) => (
            <div key={g.label}>
              <p className="ui text-[15px] font-[580] text-[var(--ink)]">{g.label}</p>
              <div className="mt-1.5 grid grid-cols-[1fr_4.5rem] items-center gap-x-3 gap-y-1.5">
                <SignedBar value={g.naPct} minNeg={8} maxPos={12} colorVar="--good" />
                <span className="tnum text-right text-[15px] font-[620] text-[var(--ink)]">{signed(g.naPct, 1)}</span>
                <SignedBar value={g.scPct} minNeg={8} maxPos={12} colorVar="--brand" />
                <span className="tnum text-right text-[15px] text-[var(--ink-2)]">{signed(g.scPct, 1)}</span>
              </div>
            </div>
          ))}
        </div>
      </Figure>
    </div>
  );
}

function TenYearChart() {
  return (
    <div className="not-prose my-8">
      <Figure
        n={3}
        title="Ten years of crime in North Ayrshire"
        sub="Recorded crimes by group in North Ayrshire, 2016-17 to 2025-26"
        legend={[
          { name: "Dishonesty", colorVar: "--brand" },
          { name: "Violence", colorVar: "--action" },
          { name: "Crimes against society", colorVar: "--good" },
          { name: "Damage and vandalism", colorVar: "--warn" },
        ]}
        caption="Housebreaking fell 63% over ten years in North Ayrshire. Vandalism fell 42%. Violent crime rose in 2023-24, then fell back."
        table={
          <DataTable
            head={["Year", "Total crimes", "Dishonesty", "Violence", "Society", "Damage", "Sexual"]}
            rows={northAyrshireTenYear.years.map((year, i) => [
              year,
              fmt(northAyrshireTenYear.totalCrimes[i]),
              fmt(northAyrshireTenYear.dishonesty[i]),
              fmt(northAyrshireTenYear.violence[i]),
              fmt(northAyrshireTenYear.society[i]),
              fmt(northAyrshireTenYear.damage[i]),
              fmt(northAyrshireTenYear.sexual[i]),
            ])}
          />
        }
      >
        <LineChart
          x={[...northAyrshireTenYear.years]}
          series={[
            { name: "Dishonesty", colorVar: "--brand", data: [...northAyrshireTenYear.dishonesty] },
            { name: "Violence", colorVar: "--action", data: [...northAyrshireTenYear.violence] },
            { name: "Crimes against society", colorVar: "--good", data: [...northAyrshireTenYear.society] },
            { name: "Damage and vandalism", colorVar: "--warn", data: [...northAyrshireTenYear.damage] },
          ]}
          yMin={800}
          yMax={3000}
          yTicks={[1000, 1500, 2000, 2500, 3000]}
          decimals={0}
          ariaLabel="Ten year trend of recorded crime groups in North Ayrshire from 2016-17 to 2025-26."
        />
      </Figure>
    </div>
  );
}

export default function Post() {
  return (
    <Prose>
      <Lead>
        Police recorded crime went up in 29 of Scotland&apos;s 32 councils last year. It fell in just three. North Ayrshire had the biggest drop in Scotland.
      </Lead>
      <P>
        Crime across Scotland rose by 5.4% in 2025-26. That was 16,246 more crimes. In North Ayrshire, crime fell by 4.1%, from 7,598 crimes to 7,284. That is 314 fewer victims.
      </P>
      <P>
        East Renfrewshire fell by 3.0%. Highland dipped by 0.5%. All 29 other councils saw crime go up. See every council on our{" "}
        <Link href="/safest-place-to-live-in-scotland">safest places to live in Scotland</Link> page.
      </P>

      <BigStat
        value="-4.1%"
        label="Crime drop in North Ayrshire in 2025-26, the sharpest fall in Scotland"
        exact="7,598 crimes in 2024-25 down to 7,284 in 2025-26 (314 fewer). Scotland rose +5.4%."
      />

      <H2 id="three-councils">Only three councils fell</H2>
      <P>
        Most of Scotland had a bad year on police figures. Dundee City jumped by 18.3%. East Lothian rose by 16.8%. East Dunbartonshire rose by 16.4% and Inverclyde rose by 16.3%.
      </P>
      <P>
        Next door in Ayrshire, crime still went up. East Ayrshire rose by 1.6%. South Ayrshire edged up by 0.3%. Only North Ayrshire, East Renfrewshire and Highland moved down.
      </P>
      <CouncilChangesChart />

      <H2 id="what-dropped">What dropped in North Ayrshire</H2>
      <P>
        North Ayrshire did not get lucky on one odd number. Four of the five main crime groups fell at the same time.
      </P>
      <CrimeGroupsChart />
      <UL>
        <LI>
          <strong>Violent crime fell by 7.2%.</strong> It dropped from 1,895 crimes to 1,758. Common assault fell by 118 cases. Serious assault fell by 16.2%, from 74 to 62. Across Scotland, violent crime rose by 6.2%.
        </LI>
        <LI>
          <strong>Damage fell by 5.3%.</strong> It dropped from 1,003 crimes to 950. Vandalism fell from 907 cases to 848. Over ten years, vandalism is down 42%.
        </LI>
        <LI>
          <strong>Crimes against society fell by 4.7%.</strong> They dropped from 1,898 to 1,808. Drug supply fell by 14.5%, from 110 cases to 94, while Scotland rose 5.0%. Bail and court crimes fell by 6.0%.
        </LI>
        <LI>
          <strong>Dishonesty fell by 2.9%.</strong> It dropped from 2,455 crimes to 2,385. Housebreaking fell by 10.6%, from 142 to 127. Fraud fell by 14.4% and other theft fell by 7.1%.
        </LI>
      </UL>
      <P>
        Two areas went the other way. Shoplifting in North Ayrshire rose by 7.3%, from 1,054 cases to 1,131. Even so, it rose well under half as fast as Scotland&apos;s 19.3% jump. Police also solved 70.5% of shop thefts there, versus 50.6% across Scotland.
      </P>
      <P>
        Sex crimes were the only full group to rise in North Ayrshire. They rose 10.4%, from 347 to 383. That matches the 10.3% rise across Scotland. The share solved in North Ayrshire went up from 57.3% to 61.9%.
      </P>

      <Aside title="Inside the North Ayrshire numbers">
        <p>
          Domestic abuse crimes fell 6.9% in North Ayrshire, from 58 to 54, while Scotland rose 23.2%. Local police solved 94.4% of those cases. Crimes with a weapon used did rise from 111 to 126, so knives and weapons remain a real risk.
        </p>
      </Aside>

      <TenYearChart />

      <H2 id="peer-councils">How it beat similar councils</H2>
      <P>
        East Renfrewshire is one of the richest parts of Scotland. Low crime there is less of a shock. North Ayrshire sits in the most deprived group of eight councils.
      </P>
      <P>
        Every one of the seven other councils in that group saw crime rise last year. Dundee jumped 18.3%. Inverclyde rose 16.3%. West Dunbartonshire rose 6.2%, Glasgow rose 5.3% and North Lanarkshire rose 4.6%.
      </P>
      <P>
        North Ayrshire also solved 64.5% of all crimes. That is the seventh best clear up rate of all 32 councils. Scotland&apos;s rate was 56.7%. On violent crime, North Ayrshire solved 74.5%, up from 71.8% the year before.
      </P>

      <div className="not-prose my-6">
        <DataTable
          head={["Peer council", "2024-25", "2025-26", "Change", "Solved"]}
          rows={peerCouncils.map((row) => [
            row.area,
            fmt(row.count2024),
            fmt(row.count2025),
            signed(row.changePct, 1),
            `${row.clearUp2025.toFixed(1)}%`,
          ])}
        />
      </div>

      <H2 id="reasons">What seems to be behind it</H2>
      <P>
        No single report proves why North Ayrshire beat the rest of Scotland. Public records point to four clear things working side by side.
      </P>
      <H3>1. Active police checks on the roads</H3>
      <P>
        Police also log less serious offences outside the main crime count. In North Ayrshire, road traffic offences jumped by {northAyrshireOffences.roadTrafficPct.toFixed(0)}% last year, from {fmt(northAyrshireOffences.roadTraffic2024)} to {fmt(northAyrshireOffences.roadTraffic2025)}.
      </P>
      <P>
        Across Scotland, road offences rose by {northAyrshireOffences.scotlandRoadTrafficPct.toFixed(1)}%. Speeding, drink checks and car stops only show up when officers are out looking for them. Local police bosses told councillors those stops came from active patrols.
      </P>

      <H3>2. 167 council cameras linked to shops</H3>
      <P>
        North Ayrshire Council runs 167 street CCTV cameras across nine towns. They cover Ardrossan, Beith, Dalry, Irvine, Kilbirnie, Kilwinning, Largs, Saltcoats and Stevenston. Staff at Marress House in Irvine watch them day and night.
      </P>
      <P>
        In 2024-25, that team helped police make 495 arrests. They handed over 279 court video discs and checked 4,447 police radio calls. They also took 137 shop radio alerts, which helps explain the 70.5% shop theft solve rate.{" "}
        <a href="https://www.north-ayrshire.gov.uk/news/councils-cctv-is-helping-to-keep-residents-safe">
          North Ayrshire Council CCTV figures
        </a>
        .
      </P>

      <H3>3. One local team sharing work</H3>
      <P>
        The Safer North Ayrshire Partnership puts council street, housing and noise teams in the same room as police, fire, NHS, drugs workers and Women&apos;s Aid. They walk local streets together to fix dark paths and spots where trouble starts. They also use early help to keep young people out of court.{" "}
        <a href="https://northayrshire.community/about-us/safer-north-ayrshire-partnership/">
          Safer North Ayrshire Partnership
        </a>
        .
      </P>

      <H3>4. Tighter management and lower child poverty</H3>
      <P>
        On our <Link href="/best-performing-councils-scotland">2026 Scottish council ranking</Link>, North Ayrshire came first out of 32 councils for how well it is run. It also came first as a council landlord. Child poverty after housing costs fell from 29.2% to 24.3% in the latest year.
      </P>
      <P>
        That does not prove money alone cut crime. It does show local life was not getting worse while crime fell.
      </P>

      <H2 id="learn">What other councils can learn</H2>
      <P>
        If North Ayrshire cut violence, vandalism, break ins and drug supply while 29 councils rose, others should look closely. Numbers alone cannot tell us which change mattered most.
      </P>
      <P>
        To copy what worked, other councils and police teams would need clear answers on four points:
      </P>
      <UL>
        <LI>
          <strong>Patrol numbers:</strong> Did North Ayrshire keep more local beat officers on the street, or put extra shifts into hotspots like Irvine and the Three Towns?
        </LI>
        <LI>
          <strong>Cameras and shop radio:</strong> How much of the 70.5% shoplifting solve rate came from the Marress House camera room and shop links?
        </LI>
        <LI>
          <strong>Early youth help:</strong> How many young people got early help instead of charges, and did repeat crime fall?
        </LI>
        <LI>
          <strong>Weapon risk:</strong> Crimes where a weapon was used rose from 111 to 126. What is the plan to stop that?
        </LI>
      </UL>
      <P>
        You can also check our{" "}
        <Link href="/councils/north-ayrshire">North Ayrshire profile</Link> or our{" "}
        <Link href="/shoplifting-scotland-record-high">Scottish shoplifting report</Link>.
      </P>

      <PostCTA
        title="Compare North Ayrshire with any council"
        body="Put North Ayrshire side by side with your own council on crime, housebreaking, pay and rent."
        href="/compare-areas?a=north-ayrshire"
        cta="Compare two areas"
      />
    </Prose>
  );
}
