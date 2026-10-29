import Link from "next/link";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import ComparePromo from "@/components/ComparePromo";
import { RankedList, Freshness, RankingLinks, areaName } from "@/components/AreaRanking";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { CITY_SLUGS, metricById, rankAreas } from "@/lib/data/compareAreas";

/**
 * "Cheapest place to live in Scotland": every council area ranked by what a
 * home costs, with rent, council tax and a plain affordability measure (years
 * of local full time pay to buy the average home) alongside. Every sentence
 * with a figure is built from the data.
 */

const UPDATED = "2026-10-29";
const CHECKED = "2026-10-29";

export const metadata = meta({
  title: "Cheapest Place to Live in Scotland: All 32 Areas by House Price and Rent",
  description:
    "The cheapest place to live in Scotland, with every council area ranked by average house price, plus private rent, council tax and how many years of local pay the average home costs.",
  path: "/cheapest-place-to-live-in-scotland",
});

const house = metricById("house_price")!;
const rent = metricById("rent")!;
const tax = metricById("council_tax")!;
const pay = metricById("pay")!;

const pounds = (v: number) => `£${Math.round(v).toLocaleString("en-GB")}`;
const byHouse = rankAreas("house_price", "asc");
const maxHouse = Math.max(...byHouse.map((r) => r.value));
const [cheapest, second, third] = byHouse;
const dearest = byHouse[byHouse.length - 1];
const scotlandHouse = house.scotland ?? 0;
const belowScotland = Math.round((1 - cheapest.value / scotlandHouse) * 100);

/** Years of local full time pay the average home costs: price over a year's median full time pay. */
function yearsOfPay(slug: string) {
  const price = house.values[slug];
  const weekly = pay.values[slug];
  return price == null || weekly == null ? null : price / (weekly * 52);
}
const affordable = byHouse
  .map((r) => ({ slug: r.slug, years: yearsOfPay(r.slug) }))
  .filter((r): r is { slug: string; years: number } => r.years != null)
  .sort((x, y) => x.years - y.years);

const show = (m: typeof house, slug: string) => {
  const v = m.values[slug];
  return v == null ? "Not published" : `${m.format(v)}${m.unit ? ` ${m.unit}` : ""}`;
};
const yearsText = (y: number | null) => (y == null ? "Not published" : `${y.toFixed(1)} years`);

const byRent = rankAreas("rent", "asc");
const byTax = rankAreas("council_tax", "asc");
const cities = byHouse.filter((r) => CITY_SLUGS.includes(r.slug));

const FAQ = [
  {
    q: "What is the cheapest place to live in Scotland?",
    a: `${areaName(cheapest.slug)} has the lowest average house price of Scotland's 32 council areas: ${pounds(cheapest.value)} in ${house.period}, ${belowScotland}% below the Scottish average of ${pounds(scotlandHouse)}. ${areaName(second.slug)} and ${areaName(third.slug)} are next.`,
  },
  {
    q: "What is the cheapest city to live in Scotland?",
    a: `Of the four cities, ${areaName(cities[0].slug)} has the lowest average house price, ${pounds(cities[0].value)}. ${cities
      .slice(1)
      .map((c) => `${areaName(c.slug)} is ${pounds(c.value)}`)
      .join(", ")}.`,
  },
  {
    q: "Where is the cheapest place to rent in Scotland?",
    a: `${areaName(byRent[0].slug)}, where the average private rent is ${show(rent, byRent[0].slug)}, against ${pounds(rent.scotland ?? 0)} a month across Scotland. Rents are published for 18 areas, so some neighbouring councils share a figure.`,
  },
  {
    q: "Which council has the lowest council tax in Scotland?",
    a: `${areaName(byTax[0].slug)}, where a Band D home pays ${pounds(byTax[0].value)} a year in ${tax.period}, before water and sewerage charges. The highest is ${areaName(byTax[byTax.length - 1].slug)} at ${pounds(byTax[byTax.length - 1].value)}.`,
  },
  {
    q: "What is the most expensive place to live in Scotland?",
    a: `${areaName(dearest.slug)}, where the average house price is ${pounds(dearest.value)}, more than ${(dearest.value / cheapest.value).toFixed(1)} times the price in ${areaName(cheapest.slug)}.`,
  },
  {
    q: "Where are homes most affordable compared with local pay?",
    a: `${areaName(affordable[0].slug)}. The average home there costs ${affordable[0].years.toFixed(1)} years of a local full time worker's pay, the lowest in Scotland. ${areaName(affordable[affordable.length - 1].slug)} is the least affordable at ${affordable[affordable.length - 1].years.toFixed(1)} years.`,
  },
];

export default function CheapestPlacePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "Cheapest place to live in Scotland", path: "/cheapest-place-to-live-in-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Page>
        <PageHeader
          eyebrow="Your area · Rankings"
          title="Cheapest place to live in Scotland"
          lede={`${areaName(cheapest.slug)} is the cheapest place to live in Scotland for buying a home: ${pounds(cheapest.value)} on average, against ${pounds(scotlandHouse)} across Scotland. Here is every council area, with rent, council tax and how many years of local pay a home costs.`}
        >
          <Freshness updated={UPDATED} checked={CHECKED} />
        </PageHeader>
        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Cheapest place to live in Scotland",
              value: areaName(cheapest.slug),
              detail: `The average home in ${areaName(cheapest.slug)} costs ${pounds(cheapest.value)}, ${belowScotland}% less than the Scottish average of ${pounds(scotlandHouse)}. ${areaName(second.slug)} and ${areaName(third.slug)} are next cheapest.`,
              rows: byHouse.slice(0, 5).map((r) => ({ label: `${r.rank}. ${areaName(r.slug)}`, value: pounds(r.value) })),
              asOf: `Average house prices, ${house.period}`,
              source: { publisher: house.source.publisher, url: house.source.url },
            }}
          />

          <section className="pt-14" aria-labelledby="all-areas">
            <SectionHead eyebrow="The full ranking" title="All 32 areas, cheapest first" id="all-areas" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Ranked by the average price paid for a home. &ldquo;Years of pay&rdquo; is the price divided by a year&apos;s
              full time pay for people living there: the lower it is, the easier a home is to afford on a local wage.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Average house price"
                columns={["Private rent", "Council tax, Band D", "Years of pay"]}
                rows={byHouse.map((r) => ({
                  slug: r.slug,
                  rank: r.rank,
                  main: pounds(r.value),
                  bar: r.value / maxHouse,
                  cells: [show(rent, r.slug), show(tax, r.slug), yearsText(yearsOfPay(r.slug))],
                }))}
              />
            </div>
            <p className="mt-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">
              Rents are published for 18 areas rather than 32 councils, so some neighbouring councils share a figure.
            </p>
          </section>

          <section className="pt-16" aria-labelledby="rent">
            <SectionHead eyebrow="Renting" title="Cheapest places to rent" id="rent" />
            <div className="mt-6">
              <RankedList
                mainLabel="Average private rent"
                rows={byRent.slice(0, 8).map((r) => ({
                  slug: r.slug,
                  rank: r.rank,
                  main: show(rent, r.slug),
                  bar: r.value / Math.max(...byRent.map((x) => x.value)),
                  note: rent.groups?.[r.slug] ? `Shared figure for the ${rent.groups[r.slug]} rental area` : undefined,
                }))}
              />
            </div>
          </section>

          <section className="pt-16" aria-labelledby="pay">
            <SectionHead eyebrow="Affordability" title="Cheapest compared with local pay" id="pay" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              A low price is only cheap if local wages go far. These are the areas where the average home costs the fewest
              years of a local full time worker&apos;s pay.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Years of pay"
                columns={["Average house price", "Full time weekly pay"]}
                rows={affordable.slice(0, 8).map((r, i) => ({
                  slug: r.slug,
                  rank: i + 1,
                  main: `${r.years.toFixed(1)} years`,
                  bar: r.years / affordable[affordable.length - 1].years,
                  cells: [show(house, r.slug), show(pay, r.slug)],
                }))}
              />
            </div>
          </section>

          <section className="pt-16" aria-labelledby="council-tax">
            <SectionHead eyebrow="Council tax" title="Lowest council tax" id="council-tax" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Band D bills for {tax.period}, before water and sewerage. For every band in every council, see{" "}
              <Link href="/council-tax-bands-scotland">council tax bands in Scotland</Link>.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Band D, a year"
                rows={byTax.slice(0, 5).map((r) => ({
                  slug: r.slug,
                  rank: r.rank,
                  main: pounds(r.value),
                  bar: r.value / Math.max(...byTax.map((x) => x.value)),
                }))}
              />
            </div>
          </section>

          <section className="pt-16 max-w-[760px]" aria-labelledby="worth-knowing">
            <SectionHead eyebrow="Method" title="Worth knowing" id="worth-knowing" />
            <ul className="mt-5 grid gap-3 text-[17px] leading-[1.65] text-[var(--ink-2)]">
              <li>
                <strong className="text-[var(--ink)]">House prices</strong> are the UK House Price Index average for{" "}
                {house.period}, from HM Land Registry and Registers of Scotland. The newest month is a first estimate and is
                often revised.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Rents</strong> are the ONS average private rent for {rent.period},
                mostly from advertised new lets.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Averages hide a lot.</strong> Each council covers towns and villages
                with very different prices, and an average moves with the mix of homes sold. The island councils sell only a
                few homes a month, so their figures jump around.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Cheap is not the whole story.</strong> See the{" "}
                <Link href="/best-place-to-live-in-scotland">best places to live in Scotland</Link> for pay, jobs, crime,
                health and schools.
              </li>
            </ul>
          </section>

          <ComparePromo className="mt-16" />

          <section className="pt-16" aria-labelledby="more-rankings">
            <SectionHead eyebrow="More rankings" title="Keep exploring" id="more-rankings" />
            <div className="mt-6">
              <RankingLinks current="/cheapest-place-to-live-in-scotland" />
            </div>
          </section>

          <Faq items={FAQ} className="pt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
