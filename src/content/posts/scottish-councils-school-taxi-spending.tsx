import Link from "@/components/IntentLink";
import { Aside, BigStat, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import Figure, { DataTable } from "@/components/charts/Figure";
import SchoolTaxiExplorer from "@/components/SchoolTaxiExplorer";
import { schoolTaxiCouncils, schoolTaxiSummary } from "@/lib/data/schoolTaxis";

const reportingUrl = schoolTaxiSummary.reportingUrl;
const morayFoiUrl =
  "https://www.moray.gov.uk/information-governance-access-to-information-requests/foi-requests-responses/foi-requests-by-month-2025/foi-request-taxi-costs/";
const pupilCensusUrl =
  "https://www.gov.scot/publications/pupil-census-supplementary-statistics/";
const asnFoiUrl = "https://www.gov.scot/publications/foi-202500484033/";
const nacPolicyUrl = "https://www.north-ayrshire.gov.uk/documents/school-transport-policy";
const nacAwardUrl =
  "https://www.publiccontractsscotland.gov.uk/search/show/search_view.aspx?ID=AUG512048";

const fmtM = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(2)}m` : `£${Math.round(n).toLocaleString("en-GB")}`;

const top10Total = [...schoolTaxiCouncils]
  .filter((c) => c.allTaxiGbp !== null && c.schoolTaxiGbp !== null)
  .sort((a, b) => (b.allTaxiGbp ?? 0) - (a.allTaxiGbp ?? 0))
  .slice(0, 10);

const perPupilHighlights = [
  ...schoolTaxiCouncils
    .filter((c) => c.perPupilGbp !== null)
    .sort((a, b) => (b.perPupilGbp ?? 0) - (a.perPupilGbp ?? 0))
    .slice(0, 7),
  ...["glasgow-city", "aberdeen-city", "orkney-islands", "argyll-and-bute", "dundee-city"].map(
    (slug) => schoolTaxiCouncils.find((c) => c.slug === slug)!
  ),
];

const asnComparisonSlugs = [
  "east-ayrshire",
  "north-lanarkshire",
  "clackmannanshire",
  "west-lothian",
  "aberdeenshire",
  "city-of-edinburgh",
  "glasgow-city",
  "aberdeen-city",
  "dundee-city",
];
const asnComparison = asnComparisonSlugs.map(
  (slug) => schoolTaxiCouncils.find((c) => c.slug === slug)!
);

const topNonSchool = [...schoolTaxiCouncils]
  .filter((c) => (c.nonSchoolGbp ?? 0) > 0)
  .sort((a, b) => (b.nonSchoolGbp ?? 0) - (a.nonSchoolGbp ?? 0))
  .slice(0, 9);

function TopTenStackedChart() {
  const maxVal = 12_500_000;
  return (
    <div className="not-prose my-8">
      <Figure
        n={1}
        title="North Lanarkshire spends more on taxis than Glasgow or Edinburgh"
        sub="Top 10 Scottish councils by total taxi spend in 2024/25, split by school runs and other journeys"
        legend={[
          { name: "School runs", colorVar: "--brand" },
          { name: "Other taxis", colorVar: "--action" },
        ]}
        caption={
          <>
            Figures from 2024/25 council FOI returns reported by the Sunday Mail. Some councils rounded their totals.{" "}
            <a href={schoolTaxiSummary.csvUrl} download>
              Download all 32 councils (CSV)
            </a>
            .
          </>
        }
        table={
          <DataTable
            head={["Council", "Total taxis", "School runs", "Other taxis", "Band D homes"]}
            rows={top10Total.map((row) => [
              row.council,
              fmtM(row.allTaxiGbp!),
              fmtM(row.schoolTaxiGbp!),
              fmtM(row.nonSchoolGbp!),
              row.bandDHomesAll!.toLocaleString("en-GB"),
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-3.5"
          role="img"
          aria-label="Horizontal stacked bar chart showing North Lanarkshire leading Scotland at £12.25 million, ahead of Edinburgh at £10.60 million, Aberdeenshire at £9.34 million and Glasgow at £9.23 million."
        >
          {top10Total.map((row) => {
            const schoolW = ((row.schoolTaxiGbp ?? 0) / maxVal) * 100;
            const nonW = ((row.nonSchoolGbp ?? 0) / maxVal) * 100;
            return (
              <div
                key={row.slug}
                className="grid grid-cols-[9.5rem_1fr_4.5rem] sm:grid-cols-[12rem_1fr_5rem] items-center gap-3"
              >
                <Link
                  href={`/councils/${row.slug}`}
                  className="text-[14.5px] font-[580] leading-[1.3] text-[var(--ink)] hover:underline"
                >
                  {row.council}
                </Link>
                <div className="flex h-4 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                  <div
                    className="h-full"
                    style={{ width: `${schoolW}%`, background: "var(--brand)" }}
                  />
                  {nonW > 0 && (
                    <div
                      className="h-full"
                      style={{ width: `${Math.max(nonW, 1.2)}%`, background: "var(--action)" }}
                    />
                  )}
                </div>
                <span className="tnum text-right text-[14.5px] font-[640] text-[var(--ink)]">
                  {fmtM(row.allTaxiGbp!)}
                </span>
              </div>
            );
          })}
        </div>
      </Figure>
    </div>
  );
}

function PerPupilChart() {
  const maxVal = 265;
  return (
    <div className="not-prose my-8">
      <Figure
        n={2}
        title="The £223 gap: same job, wildly different bills"
        sub="School taxi spend per pupil on the school roll in 2024/25 · top seven councils vs five low-spend cities and rural areas"
        legend={[
          { name: "Over £150 a pupil", colorVar: "--action" },
          { name: "Under £150 a pupil", colorVar: "--brand" },
        ]}
        caption={
          <>
            Divides each council&apos;s school taxi bill by all pupils on its September 2024 school roll. Midlothian (£0.42) and South Ayrshire (£0.93) are excluded here because their tiny reported school splits likely reflect different coding.
          </>
        }
        table={
          <DataTable
            head={["Council", "Per pupil", "School taxi bill", "Pupils on roll"]}
            rows={perPupilHighlights.map((row) => [
              row.council,
              `£${Math.round(row.perPupilGbp!)}`,
              fmtM(row.schoolTaxiGbp!),
              row.pupils.toLocaleString("en-GB"),
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-3"
          role="img"
          aria-label="Bar chart showing East Ayrshire at £256 per pupil and North Lanarkshire at £253 per pupil, compared to £49 in Aberdeen, £39 in Argyll and Bute, and £33 in Dundee."
        >
          {perPupilHighlights.map((row) => {
            const val = row.perPupilGbp ?? 0;
            const high = val >= 150;
            return (
              <div
                key={row.slug}
                className="grid grid-cols-[9.5rem_1fr_4rem] sm:grid-cols-[12rem_1fr_4.5rem] items-center gap-3"
              >
                <span className="text-[14.5px] font-[560] leading-[1.3] text-[var(--ink)]">
                  {row.council}
                </span>
                <div className="h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((val / maxVal) * 100, 2)}%`,
                      background: high ? "var(--action)" : "var(--brand)",
                    }}
                  />
                </div>
                <span className="tnum text-right text-[14.5px] font-[640] text-[var(--ink)]">
                  £{Math.round(val)}
                </span>
              </div>
            );
          })}
        </div>
      </Figure>
    </div>
  );
}

function AsnMythChart() {
  const maxPerAsn = 860;
  return (
    <div className="not-prose my-8">
      <Figure
        n={3}
        title="More ASN pupils does not mean a bigger taxi bill"
        sub="School taxi spend per ASN pupil vs share of pupils with ASN (September 2024 census)"
        legend={[
          { name: "Spend per ASN pupil", colorVar: "--action" },
        ]}
        caption={
          <>
            Glasgow has Scotland&apos;s highest ASN share (51.7%) yet spends £210 per ASN pupil. East Ayrshire has one of the lowest ASN shares (30.9%) yet spends £827 per ASN pupil.
          </>
        }
        table={
          <DataTable
            head={["Council", "Spend per ASN pupil", "ASN share of roll", "ASN pupils"]}
            rows={asnComparison.map((row) => [
              row.council,
              `£${row.perAsnPupilGbp!.toLocaleString("en-GB")}`,
              `${row.asnSharePct.toFixed(1)}%`,
              row.asnPupils.toLocaleString("en-GB"),
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-3.5"
          role="img"
          aria-label="Bar chart showing East Ayrshire spends £827 per ASN pupil despite a 30.9% ASN rate, while Glasgow has a 51.7% ASN rate and spends £210 per ASN pupil."
        >
          {asnComparison.map((row) => {
            const perAsn = row.perAsnPupilGbp ?? 0;
            return (
              <div
                key={row.slug}
                className="grid grid-cols-[9.5rem_1fr_7.5rem] sm:grid-cols-[12rem_1fr_9rem] items-center gap-3"
              >
                <span className="text-[14.5px] font-[560] leading-[1.3] text-[var(--ink)]">
                  {row.council}
                </span>
                <div className="h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((perAsn / maxPerAsn) * 100, 3)}%`,
                      background: perAsn >= 450 ? "var(--action)" : "var(--brand)",
                    }}
                  />
                </div>
                <span className="tnum text-right text-[14px] text-[var(--ink-2)]">
                  <strong className="font-[640] text-[var(--ink)]">£{perAsn}</strong>{" "}
                  <span>({row.asnSharePct.toFixed(0)}% ASN)</span>
                </span>
              </div>
            );
          })}
        </div>
      </Figure>
    </div>
  );
}

function NonSchoolChart() {
  const maxVal = 2_400_000;
  return (
    <div className="not-prose my-8">
      <Figure
        n={4}
        title="The £10.2 million taxi bill that has nothing to do with school runs"
        sub="Reported non-school taxi spend in 2024/25 across the nine biggest spenders"
        legend={[{ name: "Non-school taxi spend", colorVar: "--action" }]}
        caption={
          <>
            Calculated as total reported taxi spend minus reported school run taxi spend. Six councils reported £0 outside school runs, which may mean other departments were not counted.
          </>
        }
        table={
          <DataTable
            head={["Council", "Non-school taxis", "Share of total bill", "Total taxi bill"]}
            rows={topNonSchool.map((row) => [
              row.council,
              fmtM(row.nonSchoolGbp!),
              `${(100 - (row.schoolSharePct ?? 0)).toFixed(1)}%`,
              fmtM(row.allTaxiGbp!),
            ])}
          />
        }
      >
        <div
          className="mt-6 space-y-3"
          role="img"
          aria-label="Bar chart showing Edinburgh spent £2.28 million on non-school taxis, Fife £1.69 million, Glasgow £1.41 million, Aberdeenshire £910,000 and Midlothian £800,000."
        >
          {topNonSchool.map((row) => {
            const val = row.nonSchoolGbp ?? 0;
            return (
              <div
                key={row.slug}
                className="grid grid-cols-[9.5rem_1fr_4.8rem] sm:grid-cols-[12rem_1fr_5.5rem] items-center gap-3"
              >
                <span className="text-[14.5px] font-[560] leading-[1.3] text-[var(--ink)]">
                  {row.council}
                </span>
                <div className="h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max((val / maxVal) * 100, 3)}%`,
                      background: "var(--action)",
                    }}
                  />
                </div>
                <span className="tnum text-right text-[14.5px] font-[640] text-[var(--ink)]">
                  {fmtM(val)}
                </span>
              </div>
            );
          })}
        </div>
      </Figure>
    </div>
  );
}

export default function Post() {
  return (
    <Prose>
      <Lead>
        Scottish councils spent at least £94.2 million on taxis in one year. That is £258,200
        every day. Five councils gave no number at all. The real bill is almost surely past £100
        million. <a href={reportingUrl}>Sunday Mail FOI data, December 2025</a>.
      </Lead>

      <P>
        Ten years ago, councils spent about £30 million a year on taxis. The bill has more than
        tripled. At the same time, councils put up council tax and cut local services.
      </P>

      <P>
        To see the size of £94.2 million, put it next to your own bill. It takes the full Band D
        council tax of 56,707 homes. Every penny of their tax just pays for taxis.
      </P>

      <BigStat
        value="£94.2m"
        label="Spent on taxis by just 27 Scottish councils in 2024/25"
        exact="£81.30m went on school runs in 25 councils (£427,903 each school day). £10.22m went on other taxis. Five councils gave no number."
      />

      <P>
        Most of the cash goes on school runs. Many kids with additional support needs rely on safe
        rides to get to class. Few people would ever question helping a child who needs it.
      </P>

      <Aside title="Who pays the £94.2 million bill?">
        Taxpayers pay virtually all of it. Parents pay nothing for statutory school taxis. The
        money comes out of each council&apos;s main budget, funded by Scottish Government tax
        grants (around 75% to 80%) and local council tax (around 15% to 20%). There is no separate
        pot. Every extra million comes from the same public budget that funds teachers, roads, bins
        and libraries.
      </Aside>

      <P>
        The real question is not whether councils should help kids get to school. It is why bills
        vary so wildly across Scotland, what £10.2 million outside schools pays for, and why
        taxpayers cannot see what each route costs.
      </P>

      <H2 id="north-lanarkshire-shocker">
        North Lanarkshire spends more than Glasgow or Edinburgh
      </H2>

      <P>
        You would expect Scotland&apos;s biggest cities to top the taxi table. They do not.
      </P>

      <P>
        <Link href="/councils/north-lanarkshire">North Lanarkshire</Link> spent £12.25 million on
        taxis in 2024/25. That is the highest bill in Scotland. It eats up the Band D council tax
        of 7,880 local homes.
      </P>

      <P>
        Compare that with <Link href="/councils/glasgow-city">Glasgow</Link>. Glasgow has 71,957
        pupils on its school roll. North Lanarkshire has 48,345. Yet North Lanarkshire spent £4.43
        million more on school taxis than Glasgow.
      </P>

      <P>
        It also beat <Link href="/councils/city-of-edinburgh">Edinburgh</Link>. Edinburgh has
        5,718 more pupils and spent £8.32 million on school runs (£10.60 million in all). Rural{" "}
        <Link href="/councils/aberdeenshire">Aberdeenshire</Link> spent £9.34 million in all. That
        is nearly £3 million less than North Lanarkshire.
      </P>

      <TopTenStackedChart />

      <P>
        Just six councils make up over half of all known taxi spend. North Lanarkshire, Edinburgh,
        Aberdeenshire, Glasgow, <Link href="/councils/fife">Fife</Link> and{" "}
        <Link href="/councils/south-lanarkshire">South Lanarkshire</Link> spent £56.86 million in
        total.
      </P>

      <H2 id="check-your-council">Check your own council</H2>

      <P>
        We put every council&apos;s FOI reply in one place. We matched it with the{" "}
        <a href={pupilCensusUrl}>September 2024 pupil census</a> and{" "}
        <a href={asnFoiUrl}>ASN counts</a>. Pick your council below to see your bill.
      </P>

      <SchoolTaxiExplorer />

      <H2 id="postcode-lottery">The postcode lottery across council borders</H2>

      <P>
        Big councils have more kids, so totals only tell half the tale. Divide each school taxi
        bill by the full school roll. The table turns upside down.
      </P>

      <P>
        Across the 25 councils with a school figure, the mean is £136 per pupil. Look what happens
        when you cross one council line:
      </P>

      <UL>
        <LI>
          <strong>Lanarkshire split:</strong> North Lanarkshire spent £253 per pupil (£12.25m).
          South Lanarkshire is next door. It has almost the same roll (45,990 vs 48,345) and ASN
          rate (34.9% vs 35.4%). Yet it spent £139 per pupil (£6.40m). That is £5.85 million less.
        </LI>
        <LI>
          <strong>Ayrshire gap:</strong>{" "}
          <Link href="/councils/east-ayrshire">East Ayrshire</Link> topped Scotland at £256 per
          pupil (£4.10m). Next door, <Link href="/councils/north-ayrshire">North Ayrshire</Link>{" "}
          spent £144 (£2.45m). Next door again,{" "}
          <Link href="/councils/south-ayrshire">South Ayrshire</Link> gave a school taxi sum of
          just £13,000 (93p a pupil). A gap that huge points to a different way of logging the
          bill, not empty taxis.
        </LI>
        <LI>
          <strong>Four cities, four worlds:</strong> Edinburgh spent £154 per pupil. Glasgow spent
          £109. <Link href="/councils/aberdeen-city">Aberdeen</Link> spent £49.{" "}
          <Link href="/councils/dundee-city">Dundee</Link> spent £33. Edinburgh spends nearly five
          times as much per pupil as Dundee.
        </LI>
      </UL>

      <PerPupilChart />

      <Aside title="Why South Ayrshire (£13,000) and Midlothian (£6,000) look so low">
        South Ayrshire reported £13,000 for school taxis out of £180,600. Midlothian reported
        £6,000 out of £806,000. That does not mean they stopped taking kids to school. It shows
        how patchy council FOI data is. Some councils count every private-hire contract, while
        others log school rides under bus contracts, regional transport bodies or their own
        minibuses.
      </Aside>

      <H2 id="the-rules">46-year-old rules, and where should the line be?</H2>

      <P>
        Scotland&apos;s school travel law is 46 years old. It comes from the Education (Scotland)
        Act 1980. Under that law, councils must fund free travel when a child under 8 lives over
        two miles from their catchment school. For older pupils, the legal rule is over three
        miles.
      </P>

      <P>
        Councils must also step in when a walking route is unsafe, or when a child has medical or
        additional support needs.
      </P>

      <P>
        Two miles and three miles are only the legal floor. The 1980 Act lets councils be more
        generous if councillors choose to. Several big spenders still set shorter limits than the
        law requires:
      </P>

      <UL>
        <LI>
          <strong>1 mile for primary pupils:</strong> North Lanarkshire (Scotland&apos;s top taxi
          spender), Fife and South Lanarkshire all set a one-mile limit for primary schools.
        </LI>
        <LI>
          <strong>1.2 to 1.5 miles for primary pupils:</strong> Glasgow uses 1.2 miles. East
          Ayrshire (top spender per pupil) and West Lothian use 1.5 miles.
        </LI>
        <LI>
          <strong>No income test:</strong> Free school travel is not means-tested. A family&apos;s
          pay is never checked. A high earning home gets the exact same free travel as a low
          income family.
        </LI>
      </UL>

      <Aside title="1980 rules in a 2026 world">
        Scotland has changed hugely since 1980. Far more homes now own a car. Every young person
        aged 5 to 21 in Scotland now gets free public bus travel. And recorded ASN needs have
        grown to 40.5% of the school roll. Yet councils still run a £94.2 million bill on 1980
        rules, with no income checks and no public split of what each taxi pays for.
      </Aside>

      <div className="not-prose my-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5">
          <p className="ui text-[14px] font-[640] uppercase tracking-[0.04em] text-[var(--good)]">
            Where most people see a clear need
          </p>
          <ul className="mt-3 space-y-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <li>A child who needs a wheelchair accessible vehicle to reach school.</li>
            <li>A pupil with complex medical or sensory needs who cannot safely share a bus.</li>
            <li>A child living miles down a dark rural road with no safe pavement.</li>
          </ul>
        </div>
        <div className="rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5">
          <p className="ui text-[14px] font-[640] uppercase tracking-[0.04em] text-[var(--action-text)]">
            Where harder questions start
          </p>
          <ul className="mt-3 space-y-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
            <li>Taxpayer-funded taxis for well-off families, because income is never checked.</li>
            <li>Councils funding short trips from one mile away, below the two-mile legal rule.</li>
            <li>Solo taxis costing thousands a year where a shared ride, free bus pass or fuel grant could work.</li>
          </ul>
        </div>
      </div>

      <P>
        Most people can spot the gap between vital support and avoidable cost. The problem is that
        councils do not publish how many trips sit on each side. Without that split, taxpayers
        cannot judge for themselves whether the £94.2 million is being spent fairly.
      </P>

      <H2 id="excuses-tested">What councils say drives the bill, and what the data shows</H2>

      <P>
        When taxi bills make the news, councils give two main reasons. First, they point to rising
        ASN needs. Second, they point to long rural roads. We checked both against the facts.
      </P>

      <H3>Reason 1: Rising additional support needs</H3>

      <P>
        More kids do have logged needs. Across Scotland, 284,148 pupils had an ASN record in
        September 2024. That is 40.5% of the roll. It drives real need for safe rides.
      </P>

      <P>
        Still, ASN rates do not explain why one council pays £256 a pupil and another pays £33.
        Across all 25 councils, the link between ASN rate and taxi spend per pupil is near zero.
      </P>

      <P>
        Look at both ends. Glasgow has Scotland&apos;s top ASN share at 51.7% (37,224 pupils). It
        spends £210 per ASN pupil. East Ayrshire has one of the lowest shares at 30.9% (4,957
        pupils). Yet it spends £827 per ASN pupil, nearly four times Glasgow.
      </P>

      <AsnMythChart />

      <P>
        North Lanarkshire shows the same thing. Its ASN share (35.4%) sits below the Scottish
        mean. Yet it spends £715 per ASN pupil. That is over triple Glasgow and nine times Dundee
        (£79).
      </P>

      <H3>Reason 2: Long rural roads</H3>

      <P>
        Long rural trips do cost more. Aberdeenshire (£233 per pupil) and{" "}
        <Link href="/councils/dumfries-and-galloway">Dumfries and Galloway</Link> (£223) cover big
        areas with spread-out towns.
      </P>

      <P>
        Yet rural size does not explain the top of the chart.{" "}
        <Link href="/councils/clackmannanshire">Clackmannanshire</Link> is the smallest mainland
        council in Scotland. It spent £205 per pupil (£1.33m), fifth highest in Scotland. Urban
        North Lanarkshire spent £253. <Link href="/councils/west-lothian">West Lothian</Link> spent
        £200.
      </P>

      <P>
        At the same time, <Link href="/councils/argyll-and-bute">Argyll and Bute</Link> covers
        remote glens and islands. It spent just £39 per pupil (£384,000).{" "}
        <Link href="/councils/orkney-islands">Orkney</Link> spent £43 (£116,500). Roads play a
        part, but how councils buy routes counts far more.
      </P>

      <H2 id="non-school-taxis">
        The £10.2 million taxi bill outside the school gates
      </H2>

      <P>
        Most news stories treat council taxis as a school-run bill. Look closer at the 25 councils
        that split their totals. School runs made up 88.8% of the bill (£81.30m of £91.52m).
      </P>

      <P>
        That still leaves £10.22 million spent on taxis that were not school runs.
      </P>

      <NonSchoolChart />

      <P>
        Edinburgh spent £2.28 million on non-school taxis. That is over a fifth of its £10.60
        million bill. Fife spent £1.69 million (20%). Glasgow spent £1.41 million (15%). Aberdeen
        City spent £550,000, almost a third of its bill.
      </P>

      <P>
        Some of that pays for social work trips or care visits. Some pays for homeless families
        placed far from home. Some pays for staff travel. The public gets no split of what went to
        people in need and what went to council staff.
      </P>

      <P>
        Stranger still: six councils, like North Lanarkshire and West Lothian, put 100% of their
        bill under school runs. Did their staff and social workers take zero taxis all year? Or
        were those bills left out?
      </P>

      <H2 id="missing-councils">
        The black hole: five councils that will not say or do not know
      </H2>

      <P>
        The £94.2 million total is only a floor. Seven of Scotland&apos;s 32 councils gave no
        school taxi figure. They teach 101,354 kids, or one in seven pupils in Scotland.
      </P>

      <UL>
        <LI>
          <strong>Three do not track it:</strong>{" "}
          <Link href="/councils/highland">Highland</Link> (29,973 pupils),{" "}
          <Link href="/councils/perth-and-kinross">Perth and Kinross</Link> (17,778 pupils), and{" "}
          <Link href="/councils/shetland-islands">Shetland</Link> (3,196 pupils) said they do not
          log taxi spend on its own.
        </LI>
        <LI>
          <strong>Two did not reply:</strong> <Link href="/councils/angus">Angus</Link> (14,637
          pupils) and <Link href="/councils/na-h-eileanan-siar">Na h-Eileanan Siar</Link> (3,139
          pupils) gave no answer.
        </LI>
        <LI>
          <strong>Two gave one lump sum:</strong>{" "}
          <Link href="/councils/east-dunbartonshire">East Dunbartonshire</Link> (£2.42m) and{" "}
          <Link href="/councils/east-lothian">East Lothian</Link> (£303,800) gave a total with no
          school split.
        </LI>
      </UL>

      <P>
        If those five missing councils spend near the Scottish mean, the true bill is past £100
        million a year. How can a council rein in a huge cost if it does not even know the bill?
      </P>

      <H2 id="paper-trail">
        Case study: where the paper trail goes dark
      </H2>

      <P>
        Even when a council gives a total, taxpayers hit a brick wall. You still cannot check if
        you got a fair price.
      </P>

      <P>
        Take North Ayrshire. It sits near the middle at £2.83 million (£2.45m for school runs,
        £144 per pupil). We checked its public files to see what that cash bought.
      </P>

      <UL>
        <LI>
          <strong>Zero-pound contract lines:</strong> Its{" "}
          <a href="https://maps-north-ayrshire.opendata.arcgis.com/datasets/02d5148515024fb1bf338705de49c831_34/explore">
            contracts list
          </a>{" "}
          has 86 lines under its transport deal (NAC/5051). One shows the multi-year estimate
          (£12.58m before VAT). The other 85 lines show £0 and no route names.{" "}
          <a href="https://www.find-tender.service.gov.uk/Notice/002285-2021">Tender notice</a> ·{" "}
          <a href={nacAwardUrl}>Award rules</a>.
        </LI>
        <LI>
          <strong>Blank payment rows:</strong> Its{" "}
          <a href="https://www.north-ayrshire.gov.uk/council-voting-elections/performance-and-spending/payments-to-suppliers">
            payments over £25,000
          </a>{" "}
          show the firm, date and sum. There is no job note, bill number or route code.
        </LI>
        <LI>
          <strong>Costs still climbing:</strong> Scottish Government{" "}
          <a href="https://www.gov.scot/publications/local-government-2025-26-provisional-outturn-and-2026-27-budget-estimates/documents/">
            budget files
          </a>{" "}
          show North Ayrshire&apos;s wider school transport line rose from £5.18m in 2024/25 to
          £5.87m in 2025/26. That is a 13% jump in one year.
        </LI>
      </UL>

      <P>
        Only one council in our file, <Link href="/councils/moray">Moray</Link>, put exact
        to-the-pound figures on its own <a href={morayFoiUrl}>FOI log</a> (£1,446,047 total,
        £1,284,117 for school runs). Across the rest of Scotland, route rates and fees stay shut
        inside council books.
      </P>

      <H2 id="five-questions">Five questions every councillor should answer</H2>

      <P>
        A big total proves nothing on its own. High spend can mean safe care for kids with high
        needs. Or it can mean poor buying, empty seats and steep price rises. Every council should
        answer five plain tests:
      </P>

      <H3>1. Was a solo taxi really needed?</H3>
      <P>
        Councils must get eligible kids to school. Most rules also allow shared rides, council
        minibuses and parent fuel grants. Ask when each route was last checked and why a solo taxi
        was picked. <a href={nacPolicyUrl}>See North Ayrshire&apos;s school travel rules</a>.
      </P>

      <H3>2. Did taxpayers pay for empty seats or missed trips?</H3>
      <P>
        Pick a few routes and check the daily rate against the bills. Look for credits, wait fees
        and missed days that were still paid in full.
      </P>

      <H3>3. How many firms bid for each route?</H3>
      <P>
        When only one firm bids, prices shoot up. Ask how many firms bid on the top routes, and
        what the next best quote cost.
      </P>

      <H3>4. Who got the money?</H3>
      <P>
        Councils can share total kids carried, total trips and sums paid to each firm. They do not
        need to name a single child or home address.
      </P>

      <H3>5. What was cut to pay the taxi bill?</H3>
      <P>
        When a taxi budget runs millions over, the cash comes from somewhere. Ask which pot filled
        the gap and what local service took the hit.
      </P>

      <H2 id="how-to-check">How to check your own council</H2>

      <P>
        Anyone in Scotland can ask their council for the facts under FOI law. Councils normally
        have 20 working days to reply. Ask for four clear things:
      </P>

      <UL>
        <LI>The exact sum spent on taxis in 2024/25 and 2025/26, split by team.</LI>
        <LI>The total count of unique kids carried by taxi in the year.</LI>
        <LI>The top 10 paid taxi firms and what each one got.</LI>
        <LI>How much was paid for missed trips or no-shows.</LI>
      </UL>

      <P>
        None of those four facts names a single child. Every council in Scotland should publish
        them as standard.
      </P>

      <PostCTA
        title="See how your council spends the rest of your money"
        body="Compare council tax rises, school budgets, crisis grants and service scores across all 32 Scottish councils."
        href="/councils"
        cta="Explore all 32 councils"
      />
    </Prose>
  );
}
