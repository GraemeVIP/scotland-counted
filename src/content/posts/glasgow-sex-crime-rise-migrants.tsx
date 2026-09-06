import Link from "next/link";
import { Aside, BigStat, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import {
  april2024Index,
  arithmetic,
  arrivalsLatest,
  census2022,
  detected2023to2024,
  englandCrossSection,
  englandQuartiles,
  financialYears,
  fullYear,
  glasgowQuarterly,
  latestYear,
  panelResults,
  q3Table2024,
  quarterLabels,
  rapeAccusedNationality2025,
} from "@/lib/data/glasgowSexualCrime";

const downloads = [
  {
    href: "/data/glasgow-rape-sexual-assault-quarterly-2026.csv",
    title: "Glasgow by quarter",
    note: "Rapes and sexual assaults recorded each quarter from October 2020 to June 2026, worked out from the police year-to-date files",
  },
  {
    href: "/data/scotland-councils-rape-sexual-assault-ytd-2026.csv",
    title: "All 32 councils",
    note: "Year-to-date rape and sexual assault counts for every council area, financial years 2020/21 to 2026/27, as published by Police Scotland",
  },
  {
    href: "/data/glasgow-wards-sexual-crimes-2026.csv",
    title: "Glasgow by ward",
    note: "All sexual crimes recorded in each of Glasgow's 23 wards, 2022/23 to 2025/26",
  },
  {
    href: "/data/glasgow-arrivals-and-sexual-crime-latest-12-months-2026.csv",
    title: "The last 12 months",
    note: "Every arrivals figure and crime figure in the second test, with its source",
  },
  {
    href: "/data/england-wales-councils-asylum-sexual-offences-2026.csv",
    title: "The England test",
    note: "276 English and Welsh councils, one row each: population, asylum seekers housed, and sexual offences recorded in 2023/24 and 2024/25",
  },
  {
    href: "/data/glasgow-sexual-crime-review-results-2026.json",
    title: "The workings",
    note: "Every result on this page as it came out of the script, including the maths in the last section",
  },
] as const;

const cell = "border-b border-[var(--rule)] py-2.5 pr-4";
const cellRight = `${cell} text-right`;
const head = "border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[700]";
const headRight = `${head} text-right`;

function Table({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="min-w-full border-collapse text-[15.5px] tnum" aria-label={label}>
        {children}
      </table>
    </div>
  );
}

function Receipt({ children }: { children: React.ReactNode }) {
  return (
    <p className="not-prose mb-7 border-l-[3px] border-[var(--action)] pl-3 text-[15px] leading-[1.55] text-[var(--muted)]">
      Receipt: {children}
    </p>
  );
}

function Bar({ label, sub, value, max }: { label: string; sub: string; value: number; max: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[15px] leading-[1.45]">
        <span className="font-[620] text-[var(--ink-2)]">
          {label} <span className="text-[var(--muted)]">· {sub}</span>
        </span>
        <span className="tnum shrink-0 font-[760] text-[var(--ink)]">+{value.toFixed(1)}%</span>
      </div>
      <div className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
        <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function indexed(values: readonly number[], base: number) {
  return values.map((v) => Math.round((v / values[base]) * 1000) / 10);
}

export default function Post() {
  const baseIndex = financialYears.indexOf("2023/24");
  const rapeIdx = { glasgow: indexed(fullYear.rape.glasgow, baseIndex), rest: indexed(fullYear.rape.rest, baseIndex) };
  const saIdx = { glasgow: indexed(fullYear.sexualAssault.glasgow, baseIndex), rest: indexed(fullYear.sexualAssault.rest, baseIndex) };
  const known = rapeAccusedNationality2025.filter((r) => r.nationality !== "Not recorded or not known");
  const knownTotal = known.reduce((sum, r) => sum + r.count, 0);
  const british = known.find((r) => r.nationality === "British")!.count;
  const allEntries = rapeAccusedNationality2025.reduce((sum, r) => sum + r.count, 0);
  const notRecorded = allEntries - knownTotal;
  const ew = panelResults.englandWales;

  return (
    <Prose>
      <Lead>
        A post on X says Glasgow had a &ldquo;30% increase in sexual assaults, driven by the migrants
        that linger around at night&rdquo;. We pulled the police records, the census and the Home
        Office files. Here is what they show. Every number links to a public document.
      </Lead>

      <H2 id="number">The number is real</H2>

      <P>
        Police Scotland reported it to Glasgow&apos;s Safe Glasgow Partnership on 13 March 2025. It
        covers April to December 2024, against the same months in 2023.
      </P>

      <Table label="Crimes recorded in Glasgow City, April to December 2023 and 2024">
        <thead>
          <tr>
            <th className={head}>Crime in Glasgow City</th>
            <th className={headRight}>Apr–Dec 2023</th>
            <th className={headRight}>Apr–Dec 2024</th>
            <th className={headRight}>Change</th>
          </tr>
        </thead>
        <tbody>
          {q3Table2024.map((row) => (
            <tr key={row.crime}>
              <td className={`${cell} font-[620]`}>{row.crime}</td>
              <td className={cellRight}>{row.before}</td>
              <td className={cellRight}>{row.after}</td>
              <td className={`${cellRight} font-[700]`}>+{Math.round(row.changePct)}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://onlineservices.glasgow.gov.uk/CouncillorsandCommittees/viewSelectedDocument.asp?c=P62AFQDNNTDN812U81">
          Police Scotland, Glasgow City Q3 2024/25 report, appendix page 4
        </a>
        .
      </Receipt>

      <P>
        So the post has the size about right. It missed something bigger. Rape went up more than
        sexual assault. And it was not only Glasgow. Across Scotland, rape and attempted rape went
        up 15% in the full 2024/25 financial year. In England and Wales, all recorded sexual offences
        went up 11% over that financial year.
      </P>

      <P>
        Glasgow still stood out. Sexual assaults fell 4% across the rest of Scotland while
        Glasgow&apos;s went up 28%. That needs explaining.
      </P>

      <Figure
        n={1}
        title="Glasgow against the rest of Scotland: rape"
        sub="Full financial years, April to March. Both lines set to 100 at 2023/24."
        legend={[
          { name: "Glasgow City", colorVar: "--brand" },
          { name: "Rest of Scotland", colorVar: "--action" },
        ]}
        caption="Glasgow's rapes rose 34% in 2024/25 against 14% elsewhere, and stayed at the new level in 2025/26. Source: Police Scotland year-to-date management information."
        table={
          <DataTable
            head={["Year", "Glasgow rapes", "Rest of Scotland rapes"]}
            rows={financialYears.map((year, i) => [year, fullYear.rape.glasgow[i], fullYear.rape.rest[i].toLocaleString("en-GB")])}
          />
        }
      >
        <LineChart
          x={[...financialYears]}
          series={[
            { name: "Glasgow City", colorVar: "--brand", data: rapeIdx.glasgow },
            { name: "Rest of Scotland", colorVar: "--action", data: rapeIdx.rest },
          ]}
          yMin={80}
          yMax={140}
          yTicks={[80, 100, 120, 140]}
          decimals={0}
          ariaLabel="Rapes recorded per financial year, indexed to 2023/24 equals 100. Glasgow City rises from 100 to 134 in 2024/25 and 136 in 2025/26. The rest of Scotland rises to 114 and then 129."
        />
      </Figure>

      <Figure
        n={2}
        title="Glasgow against the rest of Scotland: sexual assault"
        sub="Full financial years, April to March. Both lines set to 100 at 2023/24."
        legend={[
          { name: "Glasgow City", colorVar: "--brand" },
          { name: "Rest of Scotland", colorVar: "--action" },
        ]}
        caption="Glasgow's sexual assaults rose 22% in 2024/25 while the rest of Scotland rose 1%, then fell back in 2025/26. 2023/24 was a low year for Glasgow, so part of the 28% is a return to earlier levels. Source: Police Scotland year-to-date management information."
        table={
          <DataTable
            head={["Year", "Glasgow sexual assaults", "Rest of Scotland sexual assaults"]}
            rows={financialYears.map((year, i) => [year, fullYear.sexualAssault.glasgow[i], fullYear.sexualAssault.rest[i].toLocaleString("en-GB")])}
          />
        }
      >
        <LineChart
          x={[...financialYears]}
          series={[
            { name: "Glasgow City", colorVar: "--brand", data: saIdx.glasgow },
            { name: "Rest of Scotland", colorVar: "--action", data: saIdx.rest },
          ]}
          yMin={80}
          yMax={140}
          yTicks={[80, 100, 120, 140]}
          decimals={0}
          ariaLabel="Sexual assaults recorded per financial year, indexed to 2023/24 equals 100. Glasgow City rises to 122 in 2024/25 and falls to 115 in 2025/26. The rest of Scotland stays near 100 to 103."
        />
      </Figure>

      <H2 id="changed">Two things changed in April 2024</H2>

      <P>The rise is visible in the April to June 2024 quarter. Two changes need to be considered when comparing these records.</P>

      <Figure
        n={3}
        title="Glasgow City, crimes recorded per quarter"
        sub="Recorded crimes, not victims. One victim can report several crimes. The jump begins in the April to June 2024 quarter."
        legend={[
          { name: "Rape", colorVar: "--brand" },
          { name: "Sexual assault", colorVar: "--action" },
        ]}
        caption="Rape stepped up in April 2024 and has stayed up. Sexual assault rose for nine months and then fell back. Source: Police Scotland management information workbooks, 2025/26 and 2026/27; quarters worked out from the year-to-date totals."
        table={
          <DataTable
            head={["Quarter", "Rape", "Sexual assault"]}
            rows={quarterLabels.map((label, i) => [label, glasgowQuarterly.rape[i], glasgowQuarterly.sexualAssault[i]])}
          />
        }
        technical={[
          `Police Scotland publishes cumulative year-to-date counts each quarter. Each quarter here is the difference between two consecutive totals, so quarters after the first in each year mix publication versions. The April 2024 change is at index ${april2024Index + 1} of ${quarterLabels.length} quarters.`,
        ]}
      >
        <LineChart
          x={[...quarterLabels]}
          series={[
            { name: "Rape", colorVar: "--brand", data: [...glasgowQuarterly.rape] },
            { name: "Sexual assault", colorVar: "--action", data: [...glasgowQuarterly.sexualAssault] },
          ]}
          yMin={0}
          yMax={250}
          yTicks={[0, 50, 100, 150, 200, 250]}
          decimals={0}
          ariaLabel="Rapes and sexual assaults recorded per quarter in Glasgow City from October 2020 to June 2026. Rapes run between 70 and 96 a quarter until March 2024, then 90 to 136 from April 2024. Sexual assaults run between 115 and 220 before April 2024, peak at 227 in April to June 2024, and range from 157 to 210 thereafter."
        />
      </Figure>

      <H3>1. The rule for what counts as evidence changed</H3>
      <P>
        A recent account of an attack, together with distress observed by another person, can help
        corroborate the account. Police Scotland told Glasgow councillors the guidance &ldquo;came into effect
        in April 2024&rdquo; and applies to &ldquo;not only domestics but all incidents&rdquo;. It
        gave this as the reason domestic abuse cases rose.
      </P>
      <Receipt>
        <a href="https://onlineservices.glasgow.gov.uk/councillorsandcommittees/viewSelectedDocument.asp?c=P62AFQDNNTNTNT0G0G">
          Police Scotland, Glasgow City Q2 2025/26 appendices, page 3
        </a>
        .
      </Receipt>

      <H3>2. The police got a new computer system for recording crime</H3>
      <P>
        It is called UNIFI. Police Scotland say it was &ldquo;fully rolled out across all Police
        Scotland divisions as of 5 December 2023&rdquo;. It replaced the old systems of eight former
        forces. From 1 April 2024 all crime figures come from it.
      </P>
      <Receipt>
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2024/march/24-0634-crime-recording-software-unifi-language-system-architecture/">
          Police Scotland FOI 24-0634
        </a>
        ;{" "}
        <a href="https://www.spa.police.uk/spa-media/b3yd2lam/item-2-1-quarterly-policing-performance-report-q4-2024-25.pdf">
          SPA performance report Q4 2024/25, appendix
        </a>
        .
      </Receipt>

      <P>
        Police Scotland has explained the domestic abuse rise by the new evidence rule, and says the
        rape rise reflects more reporting. The reports checked here give no explanation for the
        sexual assault rise and do not attribute it to migration. They do not measure how much of
        that rise came from the evidence rule or the recording-system change.
      </P>

      <H2 id="kind">What kind of crimes went up</H2>

      <P>A &ldquo;detected&rdquo; crime has an identified accused and enough evidence to justify consideration of proceedings. It is not a conviction.</P>

      <Table label="Recorded and detected rapes and sexual assaults, Glasgow City, April to December 2023 and 2024">
        <thead>
          <tr>
            <th className={head}>Glasgow City, April to December</th>
            <th className={headRight}>2023</th>
            <th className={headRight}>2024</th>
          </tr>
        </thead>
        <tbody>
          {detected2023to2024.map((row) => (
            <tr key={row.label}>
              <td className={`${cell} font-[620]`}>{row.label}</td>
              <td className={cellRight}>{row.y2023}</td>
              <td className={cellRight}>{row.y2024}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://www.scotland.police.uk/spa-media/uvggwj5v/q3-management-information-report-2025-26-aggregated-file.xlsx">
          Police Scotland Q3 2025/26 management information workbook
        </a>{" "}
        (Glasgow City rows).
      </Receipt>

      <P>
        Rape detections doubled. Recorded crimes are counted when the report is raised; detections
        are counted when the crime is detected. A detection in 2024 can therefore concern a crime
        recorded earlier. These totals do not show how many of the newly recorded crimes were
        detected, or whether the accused were partners, strangers or recent arrivals.
      </P>
      <P>
        The smaller increase in sexual-assault detections does not tell us how many of the extra
        recorded assaults had a known suspect. An undetected crime can also have a suspect without
        enough evidence to meet the detection threshold.
      </P>
      <Receipt>
        <a href="https://www.scotland.police.uk/about-us/how-we-do-it/crime-data/">
          Police Scotland, recorded and detected date definitions
        </a>
        .
      </Receipt>

      <H2 id="caught">What the accused records show</H2>

      <P>
        UNIFI provides a searchable nationality field for recent crime reports. The box is not
        compulsory. In the published tables, nationality is unknown or unrecorded for about half
        the accused entries.
      </P>
      <P>Greater Glasgow, 2025: {allEntries} accused entries linked to the detected rape-related crimes listed in the disclosure.</P>

      <Table label="Nationality of accused linked to the disclosed detected rape-related crimes, Greater Glasgow division, 2025">
        <thead>
          <tr>
            <th className={head}>Nationality</th>
            <th className={headRight}>Number</th>
          </tr>
        </thead>
        <tbody>
          {rapeAccusedNationality2025.map((row) => (
            <tr key={row.nationality}>
              <td className={`${cell} font-[620]`}>{row.nationality}</td>
              <td className={cellRight}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2026/march/26-0040-crime-stats-sexual-rape-inc-accused-nationality-glasgow-2025/">
          Police Scotland FOI 26-0040
        </a>
        . The response does not establish a count of unique people.
      </Receipt>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            value: `${Math.round((british / knownTotal) * 100)}%`,
            label: "of accused entries with a known nationality were British",
            note: `${british} of ${knownTotal} where nationality was written down`,
          },
          {
            value: `${census2022.greaterGlasgowDivision.bornOutsideUkPct.toFixed(0)}%`,
            label: "of people in the Greater Glasgow police area were born outside the UK",
            note: "2022 census · 19% in Glasgow City itself",
          },
          {
            value: `${Math.round((notRecorded / allEntries) * 100)}%`,
            label: "of accused entries had unknown or unrecorded nationality",
            note: `${notRecorded} of ${allEntries} entries`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat text-[34px] leading-none text-[var(--action)]">{stat.value}</p>
            <p className="mt-3 text-[16px] font-[700] leading-[1.4] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <P>
        Nationality and place of birth are different things, and half the forms are blank. If every
        blank form were a foreign national, the non-British share would be 63%. If every blank form
        were British, it would be 10%. So this table cannot settle whether migrants are over- or
        under-represented. Most entries with a known nationality were British; that does not tell
        us the nationality of the missing entries.
      </P>
      <P>
        A second table gives 153 accused–crime entries for Greater Glasgow rapes recorded in 2024,
        excluding restricted records. Ethnicity is recorded for 125 entries; 92 were White Scottish
        or White British. These are not unique people.
      </P>
      <P>
        Scotland-wide, for sexual crimes recorded from January 2024 to May 2025, 19% of accused
        entries with a known nationality were non-British. The census says 10% of residents were
        born outside the UK. Those measure different things and cannot establish an offending-rate
        comparison. Nationality was unknown or unrecorded for 54% of entries, and no age or sex
        adjustment has been made.
      </P>
      <Receipt>
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2025/april/25-0272-crime-stats-rape-ethnicity-suspects-inc-glasgow-2024/">
          FOI 25-0272
        </a>
        ;{" "}
        <a href="https://www.scotland.police.uk/spa-media/qlalv4si/25-1795-dl-response.docx">FOI 25-1795</a>;{" "}
        <a href="https://statistics.ukdataservice.ac.uk/dataset/scotland-s-census-2022-uv204-country-of-birth">
          Census 2022 table UV204
        </a>
        .
      </Receipt>
      <P>
        These tables do not provide a comparable nationality breakdown for 2023 and 2024. Police
        Scotland refused requests for 2023 because producing the figures would require a manual
        review of legacy records beyond the FOI cost limit. That does not mean the information was
        never recorded. Asylum status is not a readily searchable field either.
      </P>
      <Receipt>
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2024/july/24-1614-crime-stats-rape-accused-nationality-2023/">
          FOI 24-1614
        </a>
        ;{" "}
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2026/march/26-0373-crime-stats-rape-sexual-assualt-accused-nationality-british-non-british-2023-24/">
          FOI 26-0373
        </a>
        ;{" "}
        <a href="https://www.scotland.police.uk/access-to-information/freedom-of-information/disclosure-log/disclosure-log-2025/september/25-3132-crime-stats-sexual-by-accused-ethnicity-whether-asylum-seeker-5yrs/">
          FOI 25-3132
        </a>
        .
      </Receipt>

      <H2 id="arrivals">Could new arrivals have done it?</H2>

      <P>
        First, the dates. The 28% is for April to December 2024. Anyone who arrived in Glasgow after
        that cannot have caused it. So the question for the 2024 rise is who was here in 2024.
      </P>
      <P>
        Glasgow housed about 4,000 asylum seekers then, and it still does. The Home Office count was
        3,939 in December 2023, 4,193 in December 2024 and 3,938 in June 2026. What did jump was
        refugees who had just been given the right to stay, leaving Home Office housing and asking
        the council for a home. Most of them already lived in Glasgow. The council says 1,048
        households in 2024/25 came to Glasgow from elsewhere after being granted status.
      </P>
      <Receipt>
        <a href="https://www.gov.uk/government/statistical-data-sets/asylum-and-resettlement-datasets">
          Home Office asylum support by local authority, to June 2026
        </a>
        ;{" "}
        <a href="https://onlineservices.glasgow.gov.uk/councillorsandcommittees/viewSelectedDocument.asp?c=P62AFQDNNTNT2U81Z3">
          Glasgow HSCP annual report 2024/25, section 2.6.4
        </a>
        .
      </Receipt>

      <P>
        Now the sums. Glasgow recorded {arithmetic.extraCrimes} more rapes, attempted rapes and
        sexual assaults in 2024/25 than the year before. Glasgow has about{" "}
        {Math.round(arithmetic.menOver16 / 1000).toLocaleString("en-GB")},000 men aged 16 and over.
        The city&apos;s rate is {arithmetic.cityRatePer1000Men} of these crimes per 1,000 men a year.
      </P>

      <Table label="Offending rate the extra crimes would need if committed by new arrivals">
        <thead>
          <tr>
            <th className={head}>If all {arithmetic.extraCrimes} extra crimes were by…</th>
            <th className={headRight}>They would need a rate of</th>
            <th className={headRight}>That is</th>
          </tr>
        </thead>
        <tbody>
          {arithmetic.rows.map((row) => (
            <tr key={row.group}>
              <td className={cell}>{row.group}</td>
              <td className={cellRight}>{row.ratePer1000} per 1,000 men</td>
              <td className={`${cellRight} font-[700]`}>{row.multiple} times the city rate</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://www.gov.scot/publications/recorded-crime-scotland-2025-26/">
          Scottish Government, Recorded Crime in Scotland 2025-26, Table 1
        </a>
        ; National Records of Scotland, mid-2025 population estimates.
      </Receipt>
      <P>
        These are scenarios, not measurements. The group sizes are assumptions, the city rate counts
        records rather than offenders, and one person can be behind several records. Even so, at
        five times the city rate the men in the new households would account for about 7% of the
        rise, and every man among the asylum seekers about 18%.
      </P>

      <H2 id="last-year">The last 12 months: a second test</H2>

      <P>
        A lot of people believe Glasgow has had a big wave of migrants in the past year. The records
        say the wave is one particular group: refugees who have been granted the right to stay and
        then turn up homeless. The council expected about 3,500 refugee households to apply as
        homeless in 2025/26, up from 2,750 the year before. About 900 of them travelled to Glasgow
        after being granted status somewhere else. By March 2026, refugee households were 44% of new
        homeless cases and half of the live caseload.
      </P>
      <P>These measures cover different dates and populations. Support counts and homelessness applications are not direct counts of new arrivals; the small-boat figures cover the whole UK.</P>

      <Table label="Migration and support measures, with their different reporting periods">
        <thead>
          <tr>
            <th className={head}>Migration or support measure</th>
            <th className={headRight}>A year earlier</th>
            <th className={headRight}>Latest</th>
            <th className={headRight}>Change</th>
          </tr>
        </thead>
        <tbody>
          {arrivalsLatest.map((row) => (
            <tr key={row.measure}>
              <td className={cell}>{row.measure}</td>
              <td className={cellRight}>{row.earlier}</td>
              <td className={cellRight}>{row.latest}</td>
              <td className={`${cellRight} font-[700]`}>{row.change}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://glasgowcity.hscp.scot/sites/default/files/publications/Item%20No%2012%20-%20Strategic%20Plan%20Monitoring%20Report%20April%202026.pdf">
          Glasgow HSCP Strategic Plan Monitoring Report, April 2026, page 27
        </a>
        ;{" "}
        <a href="https://glasgowcity.hscp.scot/sites/default/files/publications/Item%20No%2007%20-%20Glasgow%20City%20IJB%2018-03-26%20-%20Chief%20Officer%20Update.pdf">
          HSCP Chief Officer update, March 2026
        </a>
        ;{" "}
        <a href="https://www.gov.uk/government/statistical-data-sets/asylum-and-resettlement-datasets">
          Home Office asylum support datasets, June 2026
        </a>
        ;{" "}
        <a href="https://www.nrscotland.gov.uk/media/co5ngpsp/international-migration-mid-2002-to-mid-2025.xlsx">
          NRS international migration
        </a>
        ;{" "}
        <a href="https://www.gov.uk/government/statistics/national-insurance-numbers-allocated-to-adult-overseas-nationals-to-march-2026/national-insurance-numbers-allocated-to-adult-overseas-nationals-to-march-2026">
          DWP National Insurance registrations to March 2026
        </a>
        ;{" "}
        <a href="https://www.gov.uk/government/statistics/immigration-system-statistics-year-ending-june-2026/how-many-people-come-to-the-uk-via-illegal-entry-routes">
          Home Office irregular migration, June 2026
        </a>
        .
      </Receipt>

      <P>
        The later figures provide another comparison, but they cannot identify who caused the
        earlier rise. More homelessness applications do not necessarily mean more people newly
        arriving in Glasgow. Here is what happened to recorded crime in the year to June 2026.
      </P>

      <Table label="Recorded sexual crimes in Glasgow City, year to June 2025 and year to June 2026, with the Scotland change">
        <thead>
          <tr>
            <th className={head}>Recorded crimes, year to June</th>
            <th className={headRight}>Glasgow 2025</th>
            <th className={headRight}>Glasgow 2026</th>
            <th className={headRight}>Glasgow change</th>
            <th className={headRight}>Scotland change</th>
          </tr>
        </thead>
        <tbody>
          {latestYear.map((row) => (
            <tr key={row.crime}>
              <td className={`${cell} font-[620]`}>{row.crime}</td>
              <td className={cellRight}>{row.glasgow2025.toLocaleString("en-GB")}</td>
              <td className={cellRight}>{row.glasgow2026.toLocaleString("en-GB")}</td>
              <td className={`${cellRight} font-[700]`}>{row.glasgowChange}</td>
              <td className={cellRight}>{row.scotlandChange}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Receipt>
        <a href="https://www.gov.scot/publications/recorded-crime-scotland-year-ending-june-2026/documents/">
          Scottish Government, Recorded Crime in Scotland, year ending June 2026, Table 1
        </a>
        . Police figures for April to June 2026 say the same: rape 108 against 117 a year earlier,
        sexual assault 192 against 179.
      </Receipt>

      <P>
        Rape did not go up. Sexual assault moved by the same 3% as the rest of Scotland. The 9% rise
        in all sexual crimes is online offences, mainly &ldquo;causing to view sexual images&rdquo;
        (+93) and &ldquo;communicating indecently&rdquo; (+67). Glasgow&apos;s latest year looks like
        Scotland&apos;s.
      </P>
      <P>
        Single cases in the news are real, and each one matters to the person it happened to. But a
        case is not a rate. The records above are the rate.
      </P>

      <H2 id="england">The England test</H2>

      <P>
        Here is a test with far more places in it. England and Wales count crime under one set of
        rules. Some councils have no asylum seekers on Home Office support. Some have 8 per 1,000
        people, more than Glasgow&apos;s 6 per 1,000. If asylum seekers drive sex crime, the councils
        with more of them should show bigger rises.
      </P>

      <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
          <div>
            <p className="ui text-[15px] font-[760] text-[var(--brand)]">Figure 4</p>
            <h3 className="mt-1 text-[22px] font-[760] leading-[1.25]">
              Rise in recorded sexual offences, 2023/24 to 2024/25
            </h3>
          </div>
          <p className="ui text-[15px] text-[var(--muted)]">276 English and Welsh councils in four equal groups of 69</p>
        </div>
        <div
          className="mt-6 space-y-5"
          role="img"
          aria-label={`Councils grouped by asylum seekers housed per 1,000 residents in December 2023. ${englandQuartiles
            .map((q) => `${q.group}: sexual offences up ${q.changePct.toFixed(1)}%`)
            .join(". ")}.`}
        >
          {englandQuartiles.map((q) => (
            <Bar
              key={q.group}
              label={q.group}
              sub={`${q.asylumPer1000.toFixed(1)} asylum seekers per 1,000 people, ${q.councils} councils`}
              value={q.changePct}
              max={14}
            />
          ))}
        </div>
        <figcaption className="mt-6 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
          There is no ladder. The third group rose most, and the councils with the most asylum
          seekers rose about the same as the group with the fewest. Sources: Home Office police recorded crime
          open data by council; Home Office asylum support by council, December 2023. Corrected on
          6 September 2026: the first version of this chart double-counted 55 councils.
        </figcaption>
      </figure>

      <P>
        The result is mixed. A straight-line comparison across the councils finds a small link:
        councils with more asylum seekers at the end of 2023 had slightly bigger rises on average.
        That comes mostly from a few high-asylum councils with big rises. But councils whose asylum
        numbers went up during 2024 did not see bigger rises than councils whose numbers went down.
        And the test that follows the {`${ew.councils} councils`} quarter by quarter
        does not establish a clear association. The sums are in the next section.
      </P>
      <Receipt>
        <a href="https://www.gov.uk/government/statistical-data-sets/police-recorded-crime-and-outcomes-open-data-tables">
          Home Office, police recorded crime Community Safety Partnership open data
        </a>
        ; our workings are in the downloads below.
      </Receipt>

      <H2 id="sums">How we did the sums</H2>

      <P>
        Three bits of maths sit behind this article. Here they are without the jargon. The full
        workings are in the downloads.
      </P>

      <H3>1. Was Glasgow&apos;s jump just luck?</H3>
      <P>
        Imagine every sexual assault recorded in Scotland in those nine months of 2023 and 2024 is a
        marble. Glasgow had 495 then 634. The rest of Scotland had 3,402 then 3,280. If Glasgow were
        really following the same trend as everywhere else, how often would you get a split that
        lopsided by chance? The test is called Fisher&apos;s exact test. Answer: about one time in
        84,000 under that simple model. Glasgow&apos;s recorded counts did move differently, but this
        is not the real-world odds that luck or a particular cause explains the change. The test
        assumes independent records and does not account for local effects of recording changes.
      </P>
      <P>
        We also asked how unusual it was for Glasgow. We had seven earlier years where the same
        April-to-December comparison could be made. In none of them did Glasgow pull away from the
        rest of Scotland by anything like this much. Under the old pattern, a gap this size would
        happen about once in 190 tries under the model&apos;s assumptions. With only seven earlier
        comparisons, archive gaps and recording changes, that is an illustrative check rather than
        reliable odds about underlying offending or migrant responsibility.
      </P>

      <H3>2. Do more asylum seekers mean more sex crime?</H3>
      <P>
        A correlation is a number from &minus;1 to +1. Zero means no straight-line relationship;
        other patterns can still exist. Across the {`${englandCrossSection.councils} English and Welsh councils`}, the correlation
        between how many asylum seekers a council houses and how much its sexual offences rose was{" "}
        {englandCrossSection.corrLevel.toFixed(2)}. Between the change in asylum seekers and the
        change in offences it was {englandCrossSection.corrChange.toFixed(2)}. Both are small, but the
        first is not zero. A straight line through the councils slopes slightly upwards, and that
        slope passes the usual test for chance (p = {englandCrossSection.levelPWeighted.toFixed(3)}).
        It stays when London is left out and when councils are compared only with others in the
        same police force. It is a comparison between places, and places differ in many ways.
      </P>
      <P>
        Then the within-council version. We used the available observations from {`${ew.councils} councils`} across 14 quarters. We let every
        council have its own normal level, so a big city is not compared with a village. We let
        every quarter have its own shared effect. That accounts for common changes, but a law or
        recording change can still affect places differently. Then we asked: when a council&apos;s asylum numbers
        go up, do its sexual offences go up more than everyone else&apos;s that quarter?
      </P>
      <P>
        The answer was +{ew.pctPerAsylumSeekerPer1000.toFixed(1)}% in offences for each extra asylum
        seeker per 1,000 residents, and the honest range around that answer runs from{" "}
        {ew.low.toFixed(1)}% to +{ew.high.toFixed(1)}%. That range includes zero. In plain terms: no
        clear evidence of an association within councils over time, not proof of no effect. The same test on Scotland&apos;s 32 councils gives{" "}
        {panelResults.scotlandAll.pctPerAsylumSeekerPer1000.toFixed(1)}% with Glasgow included and{" "}
        {panelResults.scotlandWithoutGlasgow.pctPerAsylumSeekerPer1000.toFixed(1)}% without. Both
        ranges include zero too.
      </P>
      <Aside title="For the statisticians">
        <p>
          Poisson regression with council and quarter fixed effects and a log population offset.
          Standard errors are clustered by council. England and Wales: {ew.rows.toLocaleString("en-GB")} council-quarters,
          December 2022 to March 2026, coefficient {ew.pctPerAsylumSeekerPer1000.toFixed(2)}% per
          asylum seeker per 1,000 (95% interval {ew.low.toFixed(2)}% to {ew.high.toFixed(2)}%, p ={" "}
          {ew.p.toFixed(2)}). Between councils, a population-weighted regression of the log change in
          offences on December 2023 support density gives {englandCrossSection.levelCoefWeighted.toFixed(3)} per
          asylum seeker per 1,000 (p = {englandCrossSection.levelPWeighted.toFixed(3)}), and{" "}
          {englandCrossSection.levelCoefForceFixedEffects.toFixed(3)} with police-force fixed effects (p ={" "}
          {englandCrossSection.levelPForceFixedEffects.toFixed(3)}); the change in density is not
          associated with the change in offences (p = {englandCrossSection.changePWeighted.toFixed(2)}).
          The divergence test is a two-sided Fisher exact test on the 2×2 table of
          Glasgow and rest-of-Scotland counts (p = 0.000012); the historical check is a Student-t
          prediction interval from seven earlier April-to-December relative changes (p = 0.0053).
          The script and every result are in the downloads.
        </p>
      </Aside>

      <H3>3. Could the new arrivals have done it?</H3>
      <P>
        This one is division. Take the 266 extra rapes, attempted rapes and sexual assaults. Divide
        by the number of men in the group being blamed. Compare with the city&apos;s own rate of 3.8
        per 1,000 men. The group would need to offend at 28 to 70 times the city rate. The group
        sizes are assumptions, so treat this as a scale check, not a measurement.
      </P>

      <H2 id="unknown">What we still do not know</H2>

      <P>
        We do not know why Glasgow&apos;s rise was bigger than the rest of Scotland&apos;s. Police
        Scotland has not explained it. Here is what they should be asked.
      </P>
      <UL>
        <LI>
          Why do officers leave the nationality box blank on half of crime reports?{" "}
          <a href="https://www.mygov.scot/arrested/when-youre-arrested">The Scottish Government says</a>{" "}
          an arrested person &ldquo;must tell the police your name, address, date and place of birth
          and nationality&rdquo;.
        </LI>
        <LI>How much of Glasgow&apos;s 2024 rise came from the April 2024 evidence rule and the new computer system?</LI>
        <LI>How many of the extra rapes were by partners or ex-partners?</LI>
      </UL>

      <BigStat
        value="139 vs 18"
        label="extra sexual assaults recorded in Glasgow in April to December 2024, against extra ones solved"
        exact="Recorded crimes and detections are counted on different dates and can concern different cases. These increases cannot tell us what share of the additional recorded assaults had an identified accused."
      />

      <P>
        Until police answer, anyone who says they know who did it, in either direction, is guessing.
        Those are the facts. What you make of them is up to you.
      </P>

      <H2 id="download">Check every number</H2>
      <P>
        Every figure on this page can be checked. Download the data, the workings and the script
        results, or open the original documents through the source list below.
      </P>
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        {downloads.map((file) => (
          <a
            key={file.href}
            href={file.href}
            download
            className="group rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline transition-colors hover:border-[var(--brand)]"
          >
            <span className="ui text-[15px] font-[760] text-[var(--brand)]">
              {file.href.endsWith(".json") ? "Download the workings" : "Download the data"} ↓
            </span>
            <span className="mt-1 block text-[17px] font-[730] leading-[1.35] text-[var(--ink)]">{file.title}</span>
            <span className="mt-2 block text-[15px] leading-[1.5] text-[var(--ink-2)]">{file.note}</span>
          </a>
        ))}
      </div>

      <H2 id="ask">The request we are sending to Police Scotland</H2>
      <Aside title="Freedom of Information request">
        <p>
          For Greater Glasgow (G) Division, for 2024 and 2025 separately: the number of accused linked
          to detected Group 2 crimes, split by category (rape, attempted rape, sexual assault, other)
          and by recorded nationality, including &ldquo;not recorded&rdquo;. Please also give the
          number of detected crimes in each category and the share of accused with nationality
          recorded.
        </p>
        <p>Police Scotland produced this breakdown for 2025 (FOI 26-0040) from the same system, so the 2024 figures should be available in the same way.</p>
      </Aside>

      <PostCTA
        title="Ask your MSP to get the answer"
        body="Police Scotland answers to the Scottish Government and to Holyrood. Your MSP can ask why half of crime reports have no nationality recorded and what changed in April 2024."
        href="/find-my-mp-and-msp"
        cta="Find your MSP and write to them"
      />

      <P>
        See also our figures on{" "}
        <Link href="/why-poverty-is-worse-in-glasgow">why poverty is worse in Glasgow</Link> and
        the <Link href="/blog/drug-deaths-scotland-deprivation">drug-deaths report</Link>, built the
        from official records with linked sources.
      </P>
    </Prose>
  );
}
