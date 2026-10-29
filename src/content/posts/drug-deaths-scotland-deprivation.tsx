import Link from "@/components/IntentLink";
import { Aside, BigStat, H2, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import { councils } from "@/lib/data/councils";
import {
  councilDrugDeathRates2021to2025,
  councilPeriodRate2021to2025,
  deprivationDrugDeathRates2025,
  drugDeathHeadline2025,
  implicatedSubstances2025,
  ukDrugPoisoningRates2024,
} from "@/lib/data/drugDeaths";

const councilSlugs = new Map(councils.map((council) => [council.name, council.slug]));

function RateBar({
  label,
  rate,
  max,
  highlight = false,
  note,
}: {
  label: string;
  rate: number;
  max: number;
  highlight?: boolean;
  note?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[15px] leading-[1.45]">
        <span className={highlight ? "font-[620] text-[var(--ink)]" : "font-[540] text-[var(--ink-2)]"}>
          {label}
        </span>
        <span className="tnum shrink-0 font-[620] text-[var(--ink)]">{rate.toFixed(1)}</span>
      </div>
      <div className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-[var(--surface-2)]" aria-hidden="true">
        <div
          className={`h-full rounded-full ${highlight ? "bg-[var(--action)]" : "bg-[var(--brand)]"}`}
          style={{ width: `${(rate / max) * 100}%` }}
        />
      </div>
      {note && <p className="mt-1.5 text-[15px] leading-[1.45] text-[var(--muted)]">{note}</p>}
    </div>
  );
}

function DeprivationChart() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="ui text-[15px] font-[620] text-[var(--brand)]">The deprivation gradient</p>
          <h3 className="mt-1 text-[22px] font-[620] leading-[1.25]">Drug use death rate by SIMD fifth</h3>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">Deaths per 100,000 · 2025</p>
      </div>

      <div className="mt-6 space-y-5" role="img" aria-label="Age standardised drug use death rates by deprivation fifth in Scotland in 2025: 54.5 in the most deprived fifth, 29.5 in the second fifth, 14.2 in the middle fifth, 7.2 in the fourth fifth and 3.6 in the least deprived fifth.">
        {deprivationDrugDeathRates2025.map((row, index) => (
          <RateBar
            key={row.area}
            label={row.area}
            rate={row.rate}
            max={60}
            highlight={index === 0}
            note={`${row.deaths.toLocaleString("en-GB")} registered deaths · 95% confidence interval ${row.lower95.toFixed(1)} to ${row.upper95.toFixed(1)}`}
          />
        ))}
      </div>

      <figcaption className="mt-6 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Age standardised rates allow areas with different age profiles to be compared. SIMD describes
        the neighbourhood where somebody lived, not their personal income. Source: National Records
        of Scotland, Table 9.
      </figcaption>
    </figure>
  );
}

function CouncilChart() {
  const topTen = councilDrugDeathRates2021to2025.slice(0, 10);

  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="ui text-[15px] font-[620] text-[var(--brand)]">Across Scotland</p>
          <h3 className="mt-1 text-[22px] font-[620] leading-[1.25]">The ten highest council area rates</h3>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">Per 100,000 · 2021 to 2025</p>
      </div>

      <div className="mt-6 space-y-4" role="img" aria-label="Glasgow City had the highest age standardised drug use death rate in Scotland in 2021 to 2025 at 38.0 per 100,000, followed by Dundee City at 34.0 and North Ayrshire at 31.0.">
        {topTen.map((row, index) => (
          <RateBar
            key={row.area}
            label={`${index + 1}. ${row.area}`}
            rate={row.rate!}
            max={45}
            highlight={index === 0}
          />
        ))}
        <div className="border-t border-dashed border-[var(--rule-strong)] pt-4">
          <RateBar
            label="Scotland"
            rate={councilPeriodRate2021to2025.rate}
            max={45}
            note="Same five year, age standardised measure"
          />
        </div>
      </div>

      <details className="group mt-6 border-t border-[var(--rule)] pt-2">
        <summary className="ui flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 py-3 text-[15px] font-[560] text-[var(--ink-2)] hover:text-[var(--brand)]">
          <span aria-hidden="true" className="transition-transform group-open:rotate-90">▸</span>
          See every council rate and confidence interval
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-[15px] tnum">
            <thead>
              <tr>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[580]">#</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[580]">Council area</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[580]">Rate</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[580]">95% interval</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 text-right font-[580]">Deaths</th>
              </tr>
            </thead>
            <tbody>
              {councilDrugDeathRates2021to2025.map((row, index) => {
                const slug = councilSlugs.get(row.area);
                const rank = row.rate === null ? "n/a" : String(index + 1);
                return (
                  <tr key={row.area} className={row.area === "Glasgow City" ? "bg-[var(--glasgow-wash)]" : undefined}>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-[var(--muted)]">{rank}</td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 font-[540]">
                      {slug ? <Link href={`/areas/${slug}`}>{row.area}</Link> : row.area}
                    </td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right font-[580]">
                      {row.rate === null ? "Not published" : row.rate.toFixed(1)}
                    </td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">
                      {row.lower95 === null || row.upper95 === null
                        ? "Fewer than 10 deaths"
                        : `${row.lower95.toFixed(1)} to ${row.upper95.toFixed(1)}`}
                    </td>
                    <td className="border-b border-[var(--rule)] py-2.5 text-right text-[var(--ink-2)]">
                      {row.deaths.toLocaleString("en-GB")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Five years are combined because single year council rates would be less reliable. Orkney had
        five deaths, so NRS did not calculate a rate. The bars show estimates; the table includes the
        uncertainty around each one. Source: NRS Table C4.
      </figcaption>
    </figure>
  );
}

function SubstanceChart() {
  return (
    <figure className="not-prose my-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--rule)] pb-4">
        <p className="ui text-[15px] font-[620] text-[var(--brand)]">Substances implicated</p>
        <h3 className="mt-1 text-[22px] font-[620] leading-[1.25]">Four headline categories, all overlapping</h3>
      </div>
      <div className="mt-6 space-y-5">
        {implicatedSubstances2025.map((row) => (
          <div key={row.label}>
            <RateBar label={row.label} rate={row.pct} max={100} />
            <p className="mt-1.5 text-[15px] leading-[1.45] text-[var(--muted)]">
              {row.deaths.toLocaleString("en-GB")} deaths · {row.pct}% · {row.kind}
            </p>
          </div>
        ))}
      </div>
      <figcaption className="mt-6 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Do not add these rows. One death can involve several drugs, and the opioid and benzodiazepine
        rows are broad parent classes. Source: NRS Table 3.
      </figcaption>
    </figure>
  );
}

export default function Post() {
  const mostDeprived = deprivationDrugDeathRates2025[0];
  const leastDeprived = deprivationDrugDeathRates2025.at(-1)!;
  const deprivationRatio = mostDeprived.rate / leastDeprived.rate;
  const glasgow = councilDrugDeathRates2021to2025[0];
  const headline = drugDeathHeadline2025;
  const changeInDeaths = headline.deaths - headline.previousDeaths;

  return (
    <Prose>
      <Lead>
        Drug deaths are not spread evenly across Scotland. In 2025, the age standardised rate in
        the most deprived fifth of neighbourhoods was about 15 times the rate in the least
        deprived fifth. Glasgow City also had the highest council area rate in the latest reliable
        comparison.
      </Lead>

      <P>
        That makes this part of Scotland&apos;s poverty story. It does not mean poverty alone caused
        every death, or that everyone who died had a low income. The official statistics show a
        very strong inequality between places. They do not turn an area level pattern into a
        diagnosis of any individual life.
      </P>

      <H2 id="short-answer">Drug deaths in Scotland: the answer in three numbers</H2>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            value: `${deprivationRatio.toFixed(1)}×`,
            label: "higher rate in the most deprived fifth",
            note: `${mostDeprived.rate} against ${leastDeprived.rate} per 100,000 · 2025`,
          },
          {
            value: glasgow.rate!.toFixed(1),
            label: "deaths per 100,000 in Glasgow City",
            note: "Highest council area rate · age standardised · 2021 to 2025",
          },
          {
            value: headline.deaths.toLocaleString("en-GB"),
            label: "drug use deaths registered in Scotland",
            note: `${headline.changePct.toFixed(0)}% more than 2024 · 2025, the latest complete year`,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat text-[34px] leading-none text-[var(--action-text)]">{stat.value}</p>
            <p className="mt-3 text-[16px] font-[580] leading-[1.4] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <Aside title="What NRS means by a “drug use death”">
        <p>
          This is a specific statistical definition. It includes deaths from mental and behavioural
          disorders due to controlled drug use, and poisoning deaths where a controlled drug was
          present. It excludes deaths caused indirectly by drug use and deaths from chronic
          conditions caused by drug use. NRS called these “drug misuse deaths” in earlier reports
          and changed the name for its 2025 figures after feedback from users. The definition did
          not change. The ordinary language title on this page does not change that underlying
          definition.
        </p>
      </Aside>

      <H2 id="deprivation">Drug deaths and deprivation: the divide is not a small difference</H2>

      <P>
        Scotland is split into five equal population groups using the Scottish Index of Multiple
        Deprivation. The rate falls at every step from the most deprived fifth to the least. This
        is a gradient across the whole distribution, not simply one unusually high group.
      </P>

      <DeprivationChart />

      <P>
        Almost half of all deaths, 559 of 1,133, were among people living in the most deprived
        fifth of neighbourhoods. The rate is the fairer comparison because each fifth contains the
        same share of Scotland&apos;s population and the calculation adjusts for different age profiles.
      </P>

      <P>
        The relationship is still more complicated than “poverty causes drug deaths”. Scottish
        Government evidence describes poverty and disadvantage interacting with trauma, poor
        mental health and other risks. Those factors can accumulate. The mortality statistics show
        where the burden lands; they cannot separate every route that brought a person there.
      </P>

      <H2 id="glasgow">Drug deaths in Glasgow: where the city sits</H2>

      <P>
        NRS combines five years of deaths for council comparisons. On that matched measure,
        Glasgow City recorded an age standardised rate of <strong>38.0 per 100,000</strong> in
        2021 to 2025, compared with <strong>21.6 across Scotland</strong>. Glasgow&apos;s estimate is
        therefore about 1.8 times the national rate for the same period.
      </P>

      <CouncilChart />

      <P>
        The city&apos;s annual count rose in 2025, from 185 to 196, an increase of 11 deaths. That
        followed a fall of 61 in 2024. The largest increases in 2025 were in East Ayrshire (27 more
        deaths) and North Ayrshire (25 more). Counts are affected by population size, however, so
        the five year age standardised rate is the right measure for comparing places.
      </P>

      <P>
        This belongs beside Glasgow&apos;s wider record on{" "}
        <Link href="/life-expectancy-glasgow">life expectancy</Link>,{" "}
        <Link href="/indicators/glasgow-deprivation">neighbourhood deprivation</Link> and the
        evidence on <Link href="/why-poverty-is-worse-in-glasgow">why poverty hits the city so hard</Link>.
        It is not proof that one measure explains all the others. It is evidence that severe health
        harm and deprivation are concentrated in many of the same places.
      </P>

      <H2 id="rise">Drug deaths rose in 2025 after the fall in 2024</H2>

      <BigStat
        value={headline.deaths.toLocaleString("en-GB")}
        label="drug use deaths registered in Scotland in 2025"
        exact={`${changeInDeaths} more than 2024 · up ${headline.changePct.toFixed(0)}% · below the ${headline.peakYear} peak of ${headline.peakDeaths.toLocaleString("en-GB")}`}
      />

      <P>
        Deaths rose by 116 after the 2024 fall to 1,017. NRS says the increase was driven by male
        deaths, which rose by 131 to 830, while female deaths fell by 15 to 303. The number peaked
        at 1,339 in 2020 and has moved up and down since, staying below that peak every year.
      </P>

      <P>
        The age standardised rate rose from 19.1 to 21.4 per 100,000. NRS says this is not a
        statistically significant increase, because the 95% confidence intervals around the two
        years overlap (17.9 to 20.3 in 2024, 20.1 to 22.6 in 2025). The 2025 rate was still about four
        times the rate at the start of the NRS series in 2000.
      </P>

      <P>
        The age profile also challenges the idea that this is mainly a story about young people.
        The average age was 46 in 2025, and 65% of deaths were among people aged 35 to 54. Scotland
        is dealing with a long running, ageing public health crisis as well as new drug threats.
      </P>

      <H2 id="substances">What the substance figures mean</H2>

      <P>
        The headline substance rows are useful for understanding the drug supply and treatment
        challenge, but they are not separate causes that can be ranked and added. More than one drug
        was implicated in 78% of deaths in 2025.
      </P>

      <SubstanceChart />

      <Aside title="Why the hierarchy matters">
        <p>
          The 881 opioid deaths are a parent category. Methadone, heroin or morphine, nitazenes and
          other opioids sit inside it and can overlap with one another. The same death may also
          involve benzodiazepines, cocaine, pregabalin or alcohol. NRS also warns that testing for
          nitazenes was limited before 2023, so the earlier trend is not fully comparable.
        </p>
      </Aside>

      <H2 id="uk">The safe way to compare Scotland with the UK</H2>

      <P>
        Scotland, England and Wales, and Northern Ireland publish different headline definitions.
        Putting their 2025 totals in one league table would mix drug use, drug poisoning and drug
        related deaths. NRS instead uses the common <strong>drug poisoning</strong> definition
        and the latest year available across all countries, which was 2024 when this release was
        prepared.
      </P>

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        {ukDrugPoisoningRates2024.map((row) => (
          <div key={row.area} className={`rounded-[var(--r-s)] border p-5 ${row.area === "Scotland" ? "border-[var(--action)] bg-[var(--action-tint)]" : "border-[var(--rule)] bg-[var(--surface)]"}`}>
            <p className="ui text-[15px] font-[580] text-[var(--muted)]">{row.area}</p>
            <p className="mt-2 figure-num text-[30px] text-[var(--ink)]">{row.rate.toFixed(1)}</p>
            <p className="mt-1 text-[15px] text-[var(--ink-2)]">deaths per 100,000 · age standardised</p>
          </div>
        ))}
      </div>

      <P>
        On that consistent measure, Scotland&apos;s rate in 2024 was about 2.4 times the rate in
        England, 1.6 times the rate in Northern Ireland and 1.5 times the rate in Wales. This
        comparison is one year older than the main Scotland analysis because accuracy matters more
        than forcing unlike 2025 totals into the same chart.
      </P>

      <H2 id="limits">What the figures can and cannot prove</H2>

      <UL>
        <LI>
          They <strong>can</strong> show that drug deaths are far more common in deprived areas and
          that Glasgow has the highest recent council area rate.
        </LI>
        <LI>
          They <strong>cannot</strong>{" "}tell us an individual&apos;s income from the deprivation score of
          the neighbourhood where they lived.
        </LI>
        <LI>
          They <strong>cannot</strong>{" "}prove that deprivation alone caused a death. Trauma, mental
          and physical health, the drug supply, treatment, housing and social isolation can interact.
        </LI>
        <LI>
          They <strong>cannot</strong> turn every detected substance into a separate death or show
          that one listed drug acted alone.
        </LI>
        <LI>
          They <strong>can</strong> settle one narrower question: drug mortality is a profound health
          inequality, so it belongs in any honest account of poverty in Scotland.
        </LI>
      </UL>

      <PostCTA
        title="Put this beside Glasgow's wider record"
        body="The drug death figures are one part of a longer pattern involving life expectancy, insecure work, housing and decisions made over decades. See the evidence together, with every source linked."
        href="/why-poverty-is-worse-in-glasgow"
        cta="See why poverty is worse in Glasgow"
      />

      <P>
        You can <a href="https://www.nrscotland.gov.uk/media/kppfvirf/drug-related-deaths-main-tables.xlsx">download the NRS main tables workbook for 2025</a>{" "}
        from National Records of Scotland, or read the official publication through the source list
        below. Every rate on this page comes from that workbook; none was modelled or inferred from
        the chart.
      </P>
    </Prose>
  );
}
