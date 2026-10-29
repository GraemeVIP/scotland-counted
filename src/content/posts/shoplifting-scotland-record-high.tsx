import Link from "next/link";
import { Aside, BigStat, H2, H3, Lead, LI, P, PostCTA, Prose, UL } from "@/components/Prose";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { councils } from "@/lib/data/councils";
import {
  councilShoplifting,
  crisisGrantApplications,
  dishonestyCategories,
  edinburghVsGlasgow,
  foodPricesAndShoplifting,
  indexedTheft,
  scotlandVsEnglandWales,
  shopliftingByPovertyThird,
  shopliftingJustice,
  shopliftingLongRun,
} from "@/lib/data/shoplifting";

const councilSlugs = new Map(councils.map((council) => [council.name, council.slug]));
const fmt = (n: number) => n.toLocaleString("en-GB");
const signed = (n: number, digits = 0) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(digits)}%`;

/** Bars that can go either side of zero, so a fall reads as a fall. */
function SignedBar({ value, max, colorVar, muted = false }: { value: number; max: number; colorVar: string; muted?: boolean }) {
  const width = (Math.min(Math.abs(value), max) / max) * 50;
  return (
    <div className="relative h-3 rounded-full bg-[var(--surface-2)]" aria-hidden="true">
      <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--rule-strong)]" />
      <div
        className="absolute inset-y-0 rounded-full"
        style={{
          background: `var(${colorVar})`,
          opacity: muted ? 0.35 : 1,
          width: `${width}%`,
          left: value >= 0 ? "50%" : `${50 - width}%`,
        }}
      />
    </div>
  );
}

function FoodPricesChart() {
  return (
    <div className="not-prose my-8">
      <Figure
        n={8}
        title="In years when food prices rose faster, shoplifting rose faster"
        sub="Change on the year before · UK food prices (April to March average) and recorded shoplifting in Scotland"
        legend={[
          { name: "Food prices", colorVar: "--brand" },
          { name: "Shoplifting", colorVar: "--action" },
        ]}
        caption="The two Covid years are faded. Shops were shut for long spells, so shoplifting fell and bounced back for reasons that had nothing to do with prices. Sources: ONS consumer price index for food and non-alcoholic drinks; Scottish Government recorded crime."
        table={
          <DataTable
            head={["Year", "Food prices", "Shoplifting"]}
            rows={foodPricesAndShoplifting.map((row) => [
              row.covid ? `${row.year} (Covid)` : row.year,
              signed(row.foodInflationPct, 1),
              signed(row.shopliftingChangePct, 1),
            ])}
          />
        }
        technical={[
          "Correlation across the 11 non-Covid years from 2013-14 to 2025-26: 0.82. We shuffled the years 20,000 times; a link this strong turned up by chance about 2 times in 1,000. Dropping any single year leaves it between 0.75 and 0.88. Dropping both big crisis years (2022-23 and 2023-24) leaves 0.56.",
          "A straight line fitted to the non-Covid years up to 2023-24 gives: shoplifting growth ≈ 2% + 2 × food price growth. It predicts rises of 6.4% in 2024-25 and 10.6% in 2025-26. The recorded rises were 15.7% and 19.3%.",
        ]}
      >
        <div
          className="mt-6 space-y-4"
          role="img"
          aria-label="Year-on-year change in UK food prices and in recorded shoplifting in Scotland, 2013-14 to 2025-26. The largest shoplifting rises, 25% in 2022-23 and 35% in 2023-24, came when food prices rose 14% and 11%. In 2024-25 and 2025-26 food prices rose 2% and 4% while shoplifting rose 16% and 19%."
        >
          {foodPricesAndShoplifting.map((row) => (
            <div key={row.year} className={row.covid ? "opacity-60" : undefined}>
              <p className="ui text-[15px] font-[680] text-[var(--ink-2)]">
                {row.year}
                {row.covid && <span className="font-[520] text-[var(--muted)]"> · Covid</span>}
              </p>
              <div className="mt-1.5 grid grid-cols-[1fr_4.5rem] items-center gap-x-3 gap-y-1.5">
                <SignedBar value={row.foodInflationPct} max={36} colorVar="--brand" muted={row.covid} />
                <span className="tnum text-right text-[15px] text-[var(--ink-2)]">{signed(row.foodInflationPct, 1)}</span>
                <SignedBar value={row.shopliftingChangePct} max={36} colorVar="--action" muted={row.covid} />
                <span className="tnum text-right text-[15px] font-[700] text-[var(--ink)]">{signed(row.shopliftingChangePct, 1)}</span>
              </div>
            </div>
          ))}
        </div>
      </Figure>
    </div>
  );
}

function RateBar({ label, rate, max, highlight = false, note }: { label: string; rate: number; max: number; highlight?: boolean; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[15px] leading-[1.45]">
        <span className={highlight ? "font-[760] text-[var(--ink)]" : "font-[620] text-[var(--ink-2)]"}>{label}</span>
        <span className="tnum shrink-0 font-[760] text-[var(--ink)]">{rate.toFixed(1)}</span>
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

function CouncilChart() {
  const topTen = councilShoplifting.slice(0, 10);
  const scotland = scotlandVsEnglandWales.at(-1)!;
  return (
    <figure id="find-your-council" className="not-prose my-8 scroll-mt-24 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="ui text-[15px] font-[760] text-[var(--brand)]">Figure 6 · Find your council</p>
          <h3 className="mt-1 text-[22px] font-[760] leading-[1.25]">The ten highest shoplifting rates</h3>
        </div>
        <p className="ui text-[15px] text-[var(--muted)]">Per 10,000 people · 2025-26</p>
      </div>

      <div
        className="mt-6 space-y-4"
        role="img"
        aria-label="Dundee City had the highest recorded shoplifting rate in 2025-26 at 211.8 per 10,000 people, followed by the City of Edinburgh at 199.6 and Glasgow City at 149.5. The Scotland rate was 96.3."
      >
        {topTen.map((row, index) => (
          <RateBar
            key={row.area}
            label={`${index + 1}. ${row.area}`}
            rate={row.rate2025}
            max={220}
            highlight={index === 0}
            note={`${row.rate2019.toFixed(1)} in 2019-20 · crimes ${signed(row.changePct)} · ${row.solved2025}% solved`}
          />
        ))}
        <div className="border-t border-dashed border-[var(--rule-strong)] pt-4">
          <RateBar label="Scotland" rate={scotland.scotlandPer1000 * 10} max={220} note="56.7 in 2019-20 · crimes +74% · 50.6% solved" />
        </div>
      </div>

      <details className="group mt-6 border-t border-[var(--rule)] pt-2">
        <summary className="ui flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 py-3 text-[15px] font-[680] text-[var(--ink-2)] hover:text-[var(--brand)]">
          <span aria-hidden="true" className="transition-transform group-open:rotate-90">▸</span>
          See all 32 councils
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-[15px] tnum">
            <thead>
              <tr>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[700]">Council area</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">2019-20</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">2025-26</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">Change</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">Per 10,000</th>
                <th className="border-b-2 border-[var(--ink)] pb-2 text-right font-[700]">Solved</th>
              </tr>
            </thead>
            <tbody>
              {councilShoplifting.map((row) => {
                const slug = councilSlugs.get(row.area);
                return (
                  <tr key={row.area}>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 font-[620]">
                      {slug ? <Link href={`/areas/${slug}`}>{row.area}</Link> : row.area}
                    </td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">{fmt(row.y2019)}</td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">{fmt(row.y2025)}</td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right font-[700]">{signed(row.changePct)}</td>
                    <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right">{row.rate2025.toFixed(1)}</td>
                    <td className="border-b border-[var(--rule)] py-2.5 text-right text-[var(--ink-2)]">{row.solved2025}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      <figcaption className="mt-5 border-t border-[var(--rule)] pt-4 text-[15px] leading-[1.6] text-[var(--ink-2)]">
        Crimes are counted where the shop is, not where the thief lives, so city centres with big
        shopping streets have high rates. Island counts are small: Shetland went from 48 to 6.
        “Solved” is the official clear-up rate for 2025-26. Source: Scottish Government recorded crime.
      </figcaption>
    </figure>
  );
}

export default function Post() {
  const latest = shopliftingLongRun.at(-1)!;
  const preCovid = shopliftingLongRun.find((row) => row.year === "2019-20")!;
  const justiceNow = shopliftingJustice.at(-1)!;
  const justicePre = shopliftingJustice.find((row) => row.year === "2019-20")!;
  const courtLatest = shopliftingJustice.find((row) => row.year === "2023-24")!;
  const ukNow = scotlandVsEnglandWales.at(-1)!;
  const ukPre = scotlandVsEnglandWales.find((row) => row.year === "2019-20")!;
  const ukGapPct = (ukNow.scotlandPer1000 / ukNow.englandWalesPer1000 - 1) * 100;
  const convictionFallPct = (1 - courtLatest.convicted! / justicePre.convicted!) * 100;
  const cityNow = edinburghVsGlasgow.at(-1)!;
  const cgPeak = crisisGrantApplications.find((row) => row.year === "2022-23")!;
  const cgNow = crisisGrantApplications.at(-1)!;
  const courtYears = shopliftingJustice.filter((row) => row.convictionsPer100 !== null);
  const cityYears = edinburghVsGlasgow.filter((row) => row.year >= "2005-06");

  return (
    <Prose>
      <Lead>
        Scotland now has more shoplifting per person than England and Wales, by the biggest margin
        in figures going back to 2002. Police recorded {fmt(latest.shoplifting)} shoplifting
        crimes in 2025-26, the most since records began in 1971. Over the same years, the number of
        shoplifters convicted in court has nearly halved.
      </Lead>

      <P>
        We went through 30 years of police figures, court records, food prices and data for all 32
        councils to find out what is going on. Some of it fits the cost of living story. Some of it
        does not.
      </P>

      <H2 id="short-answer">Four things the figures show</H2>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            value: fmt(latest.shoplifting),
            label: "shoplifting crimes recorded in 2025-26",
            note: `Highest since 1971 · up 74% from ${fmt(preCovid.shoplifting)} in 2019-20`,
          },
          {
            value: `${Math.round(ukGapPct)}% higher`,
            label: "shoplifting rate than England and Wales",
            note: `${ukNow.scotlandPer1000.toFixed(1)} against ${ukNow.englandWalesPer1000.toFixed(1)} crimes per 1,000 people · Scotland's biggest lead since at least 2002`,
          },
          {
            value: `${Math.round(convictionFallPct)}% fewer`,
            label: "people convicted of shoplifting",
            note: `${fmt(justicePre.convicted!)} in 2019-20 · ${fmt(courtLatest.convicted!)} in 2023-24, the latest year published`,
          },
          {
            value: fmt(cityNow.edinburgh),
            label: `shoplifting crimes in Edinburgh, more than Glasgow's ${fmt(cityNow.glasgow)}`,
            note: "Glasgow had more every year from 1996 until Covid",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-5">
            <p className="display-stat text-[34px] leading-none text-[var(--action)]">{stat.value}</p>
            <p className="mt-3 text-[16px] font-[700] leading-[1.4] text-[var(--ink)]">{stat.label}</p>
            <p className="mt-2 text-[15px] leading-[1.5] text-[var(--muted)]">{stat.note}</p>
          </div>
        ))}
      </div>

      <H2 id="uk">Scotland has overtaken England and Wales</H2>

      <div className="not-prose my-8">
        <Figure
          n={1}
          title="Scotland's shoplifting rate has overtaken England and Wales"
          sub="Police-recorded shoplifting per 1,000 people · years run April to March"
          legend={[
            { name: "Scotland", colorVar: "--scotland" },
            { name: "England and Wales", colorVar: "--brand" },
          ]}
          caption="Scotland was slightly higher in most years from 2004-05 to 2011-12, by 6% at most. In 2025-26 it is 17% higher. Sources: Scottish Government recorded crime; ONS Crime in England and Wales, year ending March 2026, tables A5a and A7."
          table={
            <DataTable
              head={["Year", "Scotland", "England and Wales", "Scotland crimes", "England and Wales crimes"]}
              rows={scotlandVsEnglandWales.map((row) => [
                row.year,
                row.scotlandPer1000.toFixed(2),
                row.englandWalesPer1000.toFixed(2),
                fmt(row.scotlandCount),
                fmt(row.englandWalesCount),
              ])}
            />
          }
        >
          <LineChart
            x={scotlandVsEnglandWales.map((row) => row.year)}
            series={[
              { name: "Scotland", colorVar: "--scotland", data: scotlandVsEnglandWales.map((row) => row.scotlandPer1000) },
              { name: "England and Wales", colorVar: "--brand", data: scotlandVsEnglandWales.map((row) => row.englandWalesPer1000) },
            ]}
            yMin={0}
            yMax={10}
            yTicks={[0, 2, 4, 6, 8, 10]}
            decimals={1}
            ariaLabel="Shoplifting per 1,000 people, 2013-14 to 2025-26. Scotland was below England and Wales every year until 2025-26, when Scotland reached 9.6 and England and Wales fell to 8.2."
          />
        </Figure>
      </div>

      <P>
        Before Covid, Scotland had less shoplifting per person: {ukPre.scotlandPer1000.toFixed(1)} crimes
        per 1,000 people against {ukPre.englandWalesPer1000.toFixed(1)} in England and Wales. Both rose
        sharply after 2022. Then they split. In 2025-26, shoplifting in England and Wales fell by 4%.
        In Scotland it rose by 19%.
      </P>

      <P>
        England and Wales also had the “£200 rule” from 2014, which critics said made low-value theft
        a lower priority. Scotland never had it. Yet Scotland&apos;s rise has been bigger.
      </P>

      <H2 id="record">A record, and it is almost all shoplifting</H2>

      <div className="not-prose my-8">
        <Figure
          n={2}
          title="Recorded shoplifting in Scotland, 1996-97 to 2025-26"
          sub="Crimes per year, in thousands · years run April to March"
          legend={[{ name: "Shoplifting", colorVar: "--action" }]}
          caption="For 25 years shoplifting moved between about 26,000 and 34,000 a year. It fell when shops closed in Covid, then rose every year from 2021-22. Source: Scottish Government recorded crime."
          table={
            <DataTable
              head={["Year", "Shoplifting", "All other theft and dishonesty"]}
              rows={shopliftingLongRun.map((row) => [row.year, fmt(row.shoplifting), fmt(row.otherDishonesty)])}
            />
          }
        >
          <LineChart
            x={shopliftingLongRun.map((row) => row.year)}
            series={[{ name: "Shoplifting", colorVar: "--action", data: shopliftingLongRun.map((row) => row.shoplifting / 1000) }]}
            yMin={0}
            yMax={60}
            yTicks={[0, 10, 20, 30, 40, 50, 60]}
            unit="k"
            decimals={1}
            ariaLabel="Recorded shoplifting in Scotland from 1996-97 to 2025-26. It stayed between about 26,000 and 34,000 a year until Covid, fell to 20,557 in 2020-21 and then rose every year to 53,369 in 2025-26."
          />
        </Figure>
      </div>

      <P>
        The old high was 33,523 in 2018-19. The 2025-26 figure is 59% above it. Shoplifting now
        makes up 45% of all theft and dishonesty crime in Scotland. In 2019-20 it was 28%.
      </P>

      <P>Almost everything else in the same crime group went the other way:</P>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-[15px] tnum">
          <thead>
            <tr>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-left font-[700]">Crime</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">2019-20</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 pr-4 text-right font-[700]">2025-26</th>
              <th className="border-b-2 border-[var(--ink)] pb-2 text-right font-[700]">Change</th>
            </tr>
          </thead>
          <tbody>
            {dishonestyCategories.map((row) => (
              <tr key={row.label} className={row.label === "Shoplifting" ? "bg-[var(--action-tint)]" : undefined}>
                <td className="border-b border-[var(--rule)] py-2.5 pr-4 font-[620]">{row.label}</td>
                <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">{fmt(row.y2019)}</td>
                <td className="border-b border-[var(--rule)] py-2.5 pr-4 text-right text-[var(--ink-2)]">{fmt(row.y2025)}</td>
                <td className="border-b border-[var(--rule)] py-2.5 text-right font-[700]">{signed((row.y2025 / row.y2019 - 1) * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <P>
        Add the other seven types together and they fell by 20%, from 80,721 to 64,671. Break-ins
        to homes and other buildings are at their lowest level since 1971.
      </P>

      <div className="not-prose my-8">
        <Figure
          n={3}
          title="Shoplifting went one way. Other theft went the other."
          sub="Recorded crimes, indexed so that 2019-20 = 100"
          legend={[
            { name: "Shoplifting", colorVar: "--action" },
            { name: "Other theft", colorVar: "--brand" },
            { name: "Housebreaking", colorVar: "--workplace" },
          ]}
          caption="“Other theft” covers things like stolen bikes, phones and goods from gardens and workplaces. Housebreaking includes homes, sheds and businesses. Source: Scottish Government recorded crime."
          table={
            <DataTable
              head={["Year", "Shoplifting", "Other theft", "Housebreaking"]}
              rows={indexedTheft.years.map((year, i) => [year, indexedTheft.shoplifting[i], indexedTheft.otherTheft[i], indexedTheft.housebreaking[i]])}
            />
          }
        >
          <LineChart
            x={[...indexedTheft.years]}
            series={[
              { name: "Shoplifting", colorVar: "--action", data: [...indexedTheft.shoplifting] },
              { name: "Other theft", colorVar: "--brand", data: [...indexedTheft.otherTheft] },
              { name: "Housebreaking", colorVar: "--workplace", data: [...indexedTheft.housebreaking] },
            ]}
            yMin={0}
            yMax={180}
            yTicks={[0, 30, 60, 90, 120, 150, 180]}
            decimals={0}
            ariaLabel="Shoplifting, other theft and housebreaking in Scotland indexed to 2019-20 equals 100. By 2025-26 shoplifting was at 174, other theft at 73 and housebreaking at 54."
          />
        </Figure>
      </div>

      <H3 id="why-shops">Why shops, and not homes?</H3>

      <P>
        Some people point to the fall in other theft as proof that hardship is not behind this. That
        does not follow. Taking food from a big supermarket is a very different act from breaking
        into a home. It is quick. The chance of being stopped is low. The food can be eaten the same
        day. Breaking into a home means a victim, a real risk of violence and a long prison sentence.
        Someone under money pressure might do the first and never the second.
      </P>

      <P>
        Shops have changed too. In a December 2024 report, Police Scotland listed self-service tills,
        fewer staff and shops&apos; “non-confrontation” policies among the things driving retail theft.
        Many big retailers tell staff not to tackle shoplifters, to keep them safe. Those are the
        shops&apos; own rules. We found no government policy telling staff to let thieves walk out.
      </P>

      <Aside title="What Police Scotland says is driving it">
        <p>
          Its report to the Scottish Police Authority names six things: the cost of living crisis,
          serious organised crime, changes in shops, the criminal justice system, peer pressure, and
          mental health and addiction. It found 36.7% of shoplifters committed more than one
          shoplifting in the year. And 663 thirteen-year-olds were named in shoplifting crimes in
          2023-24, 61% more than in 2019-20.
        </p>
      </Aside>

      <H2 id="caught">Fewer shoplifters are being convicted</H2>

      <P>
        Research on crime finds that the chance of being caught matters more than how harsh the
        punishment is. On that measure, the trend in Scotland is stark.
      </P>

      <div className="not-prose my-8">
        <Figure
          n={4}
          title="Fewer shoplifting crimes are solved, and far fewer lead to a conviction"
          sub="Scotland · share of recorded shoplifting solved by police, and people convicted per 100 crimes recorded"
          legend={[
            { name: "Solved by police (%)", colorVar: "--brand" },
            { name: "Convictions per 100 crimes", colorVar: "--action" },
          ]}
          caption={`Court figures stop at 2023-24. The solved rate was ${shopliftingJustice.at(-2)!.clearUpPct}% in 2024-25 and ${justiceNow.clearUpPct}% in 2025-26. Convictions per 100 is our own division of people convicted by crimes recorded in the same year. Court delays mean they are not the same cases, so read it as a guide to direction. Sources: Recorded Crime in Scotland 2025-26, Table 3; Criminal Proceedings in Scotland 2023-24, Tables 4b, 9b and 10c.`}
          table={
            <DataTable
              head={["Year", "Recorded", "Solved", "Convicted", "Per 100", "Jailed", "Average jail term"]}
              rows={shopliftingJustice.map((row) => [
                row.year,
                fmt(row.recorded),
                `${row.clearUpPct}%`,
                row.convicted === null ? "Not yet published" : fmt(row.convicted),
                row.convictionsPer100 === null ? "–" : row.convictionsPer100.toFixed(1),
                row.custodyPct === null ? "–" : `${row.custodyPct}%`,
                row.custodyDays === null ? "–" : `${row.custodyDays} days`,
              ])}
            />
          }
        >
          <LineChart
            x={courtYears.map((row) => row.year)}
            series={[
              { name: "Solved by police (%)", colorVar: "--brand", data: courtYears.map((row) => row.clearUpPct) },
              { name: "Convictions per 100 crimes", colorVar: "--action", data: courtYears.map((row) => row.convictionsPer100 as number) },
            ]}
            yMin={0}
            yMax={80}
            yTicks={[0, 20, 40, 60, 80]}
            decimals={1}
            ariaLabel="From 2014-15 to 2023-24 the share of shoplifting crimes solved by police in Scotland fell from 74.6% to 50.3%, and people convicted per 100 recorded shoplifting crimes fell from 25.4 to 7.4."
          />
        </Figure>
      </div>

      <P>
        In 2019-20, {fmt(justicePre.convicted!)} people were convicted with shoplifting as their main
        crime. In 2023-24 it was {fmt(courtLatest.convicted!)}, even though recorded shoplifting had
        risen by a quarter. For every 100 shoplifting crimes recorded, about 18 people were convicted
        in 2019-20. By 2023-24 it was about 7. A decade earlier, in 2014-15, it was 25.
      </P>

      <P>
        Police solve a smaller share too: 74.6% in 2014-15, 66.3% in 2019-20, and about half every
        year since 2022-23. In fairness, officers are solving more cases than before, roughly 27,000
        in 2025-26 against 20,300 in 2019-20. They have not kept pace with the rise.
      </P>

      <P>
        The people who are convicted are not being let off more lightly. The share sent to prison
        rose from {justicePre.custodyPct}% in 2019-20 to {courtLatest.custodyPct}% in 2023-24, and the
        average prison sentence stayed at about four months. What has changed is how many people
        are caught and convicted in the first place.
      </P>

      <H3 id="council-test">A council-by-council check</H3>

      <P>
        If a falling chance of getting caught leads to more theft, the places where it fell most
        should later see the biggest rises. We checked. Councils where the solved rate fell most
        between 2019-20 and 2021-22 did go on to see bigger shoplifting rises up to 2025-26. The
        link is moderate and unlikely to be chance. But it weakens a lot if you pick slightly
        different years. Treat it as a hint, not proof.
      </P>

      <Aside title="What changed in policing, courts and prisons">
        <p><strong>July 2019:</strong> courts must avoid prison sentences of 12 months or less unless nothing else is suitable. The limit had been three months.</p>
        <p><strong>2020–2022:</strong> Covid closes courts for long spells and leaves a large backlog.</p>
        <p><strong>May–June 2024:</strong> Police Scotland rolls out its “proportionate response to crime”. Low-risk crimes with no leads can be closed without investigation. Police would not say how many were shoplifting.</p>
        <p><strong>June–July 2024:</strong> 477 prisoners released early to ease overcrowding.</p>
        <p><strong>February 2025:</strong> short-term prisoners released after 40% of their sentence instead of 50%.</p>
        <p><strong>April 2025:</strong> a police Retail Crime Taskforce starts work, funded with £3 million a year.</p>
        <p><strong>November 2025 to April 2026:</strong> 614 more prisoners released early.</p>
        <p><strong>December 2025:</strong> a faster court process extended to shoplifting cases.</p>
        <p><strong>May 2026:</strong> the release point moves to 30% of the sentence.</p>
      </Aside>

      <P>
        The early releases cover all short-term prisoners. The published figures do not say how
        many were shoplifters, so their effect on shoplifting cannot be measured yet.
      </P>

      <H2 id="councils">Edinburgh has overtaken Glasgow</H2>

      <div className="not-prose my-8">
        <Figure
          n={5}
          title="Edinburgh now records more shoplifting than Glasgow"
          sub="Recorded shoplifting crimes per year, in thousands"
          legend={[
            { name: "City of Edinburgh", colorVar: "--action" },
            { name: "Glasgow City", colorVar: "--glasgow" },
          ]}
          caption="Glasgow recorded more shoplifting than Edinburgh every year from 1996-97 to 2019-20. Edinburgh was briefly higher in the 2020-21 lockdown year, and has been higher every year since 2023-24. Source: Scottish Government recorded crime."
          table={
            <DataTable
              head={["Year", "Edinburgh", "Glasgow"]}
              rows={edinburghVsGlasgow.map((row) => [row.year, fmt(row.edinburgh), fmt(row.glasgow)])}
            />
          }
        >
          <LineChart
            x={cityYears.map((row) => row.year)}
            series={[
              { name: "City of Edinburgh", colorVar: "--action", data: cityYears.map((row) => row.edinburgh / 1000) },
              { name: "Glasgow City", colorVar: "--glasgow", data: cityYears.map((row) => row.glasgow / 1000) },
            ]}
            yMin={0}
            yMax={12}
            yTicks={[0, 3, 6, 9, 12]}
            unit="k"
            decimals={1}
            ariaLabel="Recorded shoplifting in Edinburgh and Glasgow, 2005-06 to 2025-26. Glasgow was higher every year until Covid. Edinburgh rose from 3,969 in 2019-20 to 10,595 in 2025-26, above Glasgow's 9,722."
          />
        </Figure>
      </div>

      <P>
        Edinburgh&apos;s shoplifting rose from 3,969 crimes in 2019-20 to 10,595 in 2025-26, up 167%.
        Glasgow&apos;s rose from 4,573 to 9,722, up 113%. The two cities alone make up more than half of
        Scotland&apos;s whole increase.
      </P>

      <P>
        They also have some of the lowest solved rates. Police solved 38.4% of shoplifting in
        Edinburgh in 2025-26, down from 53.1% in 2019-20. Only East Lothian was lower, at 33.0%. In
        Glasgow it was 39.3%, down from 57.0%.
      </P>

      <P>
        Across the country, shoplifting rose in 29 of the 32 council areas. The typical council saw
        a rise of 56%. Dundee has the highest rate for its size.
      </P>

      <CouncilChart />

      <H3 id="poverty">Is it worst in the poorest places?</H3>

      <P>If people are stealing to get by, you might expect the rise to be biggest in poorer areas. We tested that several ways.</P>

      <UL>
        <LI>
          <strong>Poorer areas have more shoplifting per person.</strong> That was true before the
          price rises and it is still true. The strength of the link has barely changed.
        </LI>
        <LI>
          <strong>The rise itself was not bigger in poorer areas.</strong> We split councils into
          three groups by child poverty before the crisis. Shoplifting rose 87% in the least poor
          group, 59% in the middle and 64% in the poorest. Edinburgh drives the least poor group.
          Leave out the four big cities and the poorest group rose least, by 34%.
        </LI>
        <LI>
          <strong>Where child poverty got worse, shoplifting rose more.</strong> This link is
          moderate, but it leans on Glasgow and Edinburgh and weakens without them.
        </LI>
        <LI>
          <strong>Changes in Crisis Grant applications showed no link</strong> with changes in
          shoplifting.
        </LI>
      </UL>

      <div className="not-prose my-8">
        <Figure
          n={7}
          title="The rise happened in richer and poorer areas alike"
          sub="Shoplifting per 10,000 people · councils grouped into thirds by child poverty in 2019-20"
          legend={[
            { name: "Poorest third", colorVar: "--action" },
            { name: "Middle third", colorVar: "--workplace" },
            { name: "Least poor third", colorVar: "--brand" },
          ]}
          caption="Each group holds 10 or 11 councils. Edinburgh is in the least poor group and Glasgow in the poorest. Child poverty is the share of children in poverty after housing costs. Sources: Scottish Government recorded crime; End Child Poverty and Loughborough University."
          table={
            <DataTable
              head={["Year", "Poorest third", "Middle third", "Least poor third"]}
              rows={shopliftingByPovertyThird.years.map((year, i) => [
                year,
                shopliftingByPovertyThird.poorest[i],
                shopliftingByPovertyThird.middle[i],
                shopliftingByPovertyThird.leastPoor[i],
              ])}
            />
          }
          technical={[
            `Poorest third: ${shopliftingByPovertyThird.members.poorest.join(", ")}.`,
            `Middle third: ${shopliftingByPovertyThird.members.middle.join(", ")}.`,
            `Least poor third: ${shopliftingByPovertyThird.members.leastPoor.join(", ")}.`,
            "Tests across the 32 councils used rank correlations with 20,000 random shuffles. Rise from 2019-20 against child poverty: 0.28, could easily be chance. Level in 2025-26 against child poverty: 0.56, very unlikely to be chance. Rise against the change in child poverty: 0.44, about 1 in 100 by chance, falling to 0.32 once the four cities and three island councils are removed.",
            "Solved-rate test: the fall in the solved rate from 2019-20 to 2021-22 against the rise in shoplifting from 2021-22 to 2025-26 gives −0.40 (about 2 in 100 by chance), or −0.47 without the island councils. It holds after allowing for the Covid bounce-back, but falls to −0.21 using 2022-23 as the split year.",
          ]}
        >
          <LineChart
            x={[...shopliftingByPovertyThird.years]}
            series={[
              { name: "Poorest third", colorVar: "--action", data: [...shopliftingByPovertyThird.poorest] },
              { name: "Middle third", colorVar: "--workplace", data: [...shopliftingByPovertyThird.middle] },
              { name: "Least poor third", colorVar: "--brand", data: [...shopliftingByPovertyThird.leastPoor] },
            ]}
            yMin={0}
            yMax={120}
            yTicks={[0, 20, 40, 60, 80, 100, 120]}
            decimals={1}
            ariaLabel="Shoplifting per 10,000 people by council poverty group, 2013-14 to 2025-26. In 2025-26 the poorest third had 108.3, the middle third 69.0 and the least poor third 103.0, up from 66.2, 43.5 and 55.1 in 2019-20."
          />
        </Figure>
      </div>

      <P>
        One big caution. Shoplifting is counted where the shop is, not where the thief lives. City
        centres and retail parks draw people from far and wide, including organised gangs. So
        council figures are only a rough guide to local need.
      </P>

      <H2 id="food-prices">Food prices explain the surge, up to a point</H2>

      <P>
        UK food prices rose 39% between April 2021 and March 2026. The yearly rise peaked at 19.2%
        in March 2023. If people are stealing because they cannot afford food, shoplifting should
        rise fastest when prices rise fastest. That is what we tested.
      </P>

      <FoodPricesChart />

      <P>
        For most of the period, the fit is strong. The biggest jumps in shoplifting, 25% in 2022-23
        and 35% in 2023-24, came exactly when food prices were rising fastest. Across 11 years,
        leaving out the two Covid years, the match between the two scores 0.82 on a scale where 1 is
        a perfect match. A match that close would happen by chance only about 2 times in 1,000.
      </P>

      <P>
        Then it breaks. Food price rises slowed to 2.2% in 2024-25 and 4.3% in 2025-26. Shoplifting
        still grew by 16% and then 19%. Prices did not fall back; they just stopped rising as fast.
        Households still pay far more than in 2021, which could keep shoplifting high. It is harder
        to see why that alone would keep it speeding up.
      </P>

      <BigStat
        value="About 7,900"
        label="more shoplifting crimes in 2025-26 than food prices alone would predict"
        exact="Predicted about 45,500 · recorded 53,369 · based on the pattern from 2013-14 to 2023-24"
      />

      <P>
        Two other signs of hardship eased over the same years. Crisis Grant applications, the
        emergency cash councils give people with no money for essentials, peaked at{" "}
        {fmt(cgPeak.applications)} in 2022-23. There were {fmt(cgNow.applications)} in 2025-26. Trussell
        food banks in Scotland gave out 218,838 food parcels in 2025. That is 13% fewer than in 2024
        and 8% fewer than in 2019. Scotland is the only part of the UK below its 2019 level. Neither
        measure is perfect: councils ration grants, and some people now use other food aid. But
        neither shows hardship getting worse over the last two years.
      </P>

      <Aside title="Shoplifting was already creeping up before prices rose">
        <p>
          Between 2013-14 and 2018-19, shoplifting grew by about 900 crimes a year. If that trend had
          simply carried on, we would expect around 37,400 in 2025-26. The real figure is about
          16,000 higher.
        </p>
      </Aside>

      <H2 id="reporting">Are shops just reporting more?</H2>

      <P>
        Some of the latest rise probably is more reporting. The Scottish Government funds the police
        Retail Crime Taskforce, which started in April 2025 and works mainly in Edinburgh, Glasgow
        and Lanarkshire. In the Scottish Grocers&apos; Federation&apos;s yearly survey, the share of shops
        saying they were unlikely to report shoplifting fell from 48.2% to 10.9%. A Police Scotland
        inspector said the latest increase is “perhaps not reflective of a huge increase in offences”.
      </P>

      <P>
        But reporting cannot explain all of it. Edinburgh and Glasgow were already rising fast in
        2024-25, before the taskforce began. In 2025-26 the rest of Scotland, outside the taskforce
        areas, still rose 16%. And North and South Lanarkshire, both taskforce areas, barely changed.
      </P>

      <H2 id="who-is-in-charge">Who is responsible?</H2>

      <P>
        Policing, courts, prisons and criminal law in Scotland are run by the Scottish Parliament and
        the Scottish Government, not Westminster. The SNP has led the Scottish Government since 2007.
        The early release schemes, the sentencing rules and police funding in the timeline above are
        all Scottish decisions. The UK Labour government, elected in July 2024, runs policing in
        England and Wales only.
      </P>

      <P>
        Labour&apos;s Crime and Policing Act 2026 scraps England and Wales&apos;s £200 rule and creates a new
        offence of assaulting a shop worker. None of it applies in Scotland, and those parts were
        not yet in force when we checked. Scotland&apos;s own shop worker protection law dates from 2021.
        The timing matters too: Scotland&apos;s biggest jumps, in 2022-23 and 2023-24, came before the
        change of UK government.
      </P>

      <H2 id="verdict">So what is driving it?</H2>

      <P>No single cause fits every fact. Our best reading of the evidence:</P>

      <UL>
        <LI>
          <strong>The cost of living crisis</strong> fits the timing of the biggest jumps, in
          2022-23 and 2023-24, very closely.
        </LI>
        <LI>
          <strong>A falling chance of being caught and convicted</strong> fits too. It started
          before the price rises and carried on through them.
        </LI>
        <LI>
          <strong>More reporting</strong> explains part of the latest increase, especially in 2025-26.
        </LI>
        <LI>
          <strong>Organised gangs and addiction</strong> are named by police and retailers. No
          reliable figures split the rise between people stealing to eat, to sell on or to fund a habit.
        </LI>
      </UL>

      <H2 id="limits">What the figures can and cannot prove</H2>

      <UL>
        <LI>
          They <strong>can</strong> show that recorded shoplifting is at a record high, higher per
          person than England and Wales, while other theft is falling.
        </LI>
        <LI>
          They <strong>can</strong> show that the rise tracked food price rises closely until 2024,
          and that far fewer shoplifting crimes now end in a conviction.
        </LI>
        <LI>
          They <strong>cannot</strong> say why any one person stole. Crime figures count crimes, not
          reasons.
        </LI>
        <LI>
          They <strong>cannot</strong> fully separate a real rise from more reporting.
        </LI>
        <LI>
          Our tests use 11 years and 32 councils. Those are small numbers, so we treat the results
          as evidence, not proof.
        </LI>
      </UL>

      <PostCTA
        title="Why food still costs so much"
        body="Food price rises have slowed, but prices have not come back down. See what happened to the cost of a weekly shop and why."
        href="/blog/why-food-prices-stay-high-when-inflation-falls"
        cta="Read why food prices stay high"
      />

      <P>
        You can{" "}
        <a href="/data/scottish-shoplifting-by-council-2013-2026.csv" download>
          download our council-by-council table
        </a>{" "}
        of shoplifting, other theft, break-ins, Crisis Grant applications and child poverty from
        2013-14 to 2025-26. Every figure comes from the official sources listed below. The tests and
        predictions are our own and are labelled as such.
      </P>
    </Prose>
  );
}
