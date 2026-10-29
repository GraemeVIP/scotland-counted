import Link from "@/components/IntentLink";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import ComparePromo from "@/components/ComparePromo";
import { RankedList, Freshness, RankingLinks, areaName } from "@/components/AreaRanking";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { CITY_SLUGS, metricById, rankAreas } from "@/lib/data/compareAreas";
import { COMPARE_EXTRA } from "@/lib/data/compareAreasData";

/**
 * "Safest place to live in Scotland": every council area ranked by crime
 * recorded by the police for every 10,000 people, with violent crime, break
 * ins and the change on the year before alongside. Every sentence with a
 * figure is built from the data.
 */

const UPDATED = "2026-10-29";
const CHECKED = "2026-10-29";

export const metadata = meta({
  title: "Safest Place to Live in Scotland: All 32 Areas Ranked by Crime",
  description:
    "The safest place to live in Scotland, with every council area ranked by recorded crime for every 10,000 people, plus violent crime, housebreaking and whether crime is rising.",
  path: "/safest-place-to-live-in-scotland",
});

const crime = metricById("crime_total")!;
const violence = metricById("crime_violence")!;
const housebreaking = metricById("crime_housebreaking")!;
const previous = COMPARE_EXTRA.find((m) => m.id === "crime_total_prev");

const bySafety = rankAreas("crime_total", "asc");
const maxCrime = Math.max(...bySafety.map((r) => r.value));
const [safest, second, third] = bySafety;
const highest = [...bySafety].reverse().slice(0, 3);
const scotland = crime.scotland ?? 0;
const cities = bySafety.filter((r) => CITY_SLUGS.includes(r.slug));
const whole = (v: number) => Math.round(v).toLocaleString("en-GB");

function change(slug: string) {
  const now = crime.values[slug];
  const before = previous?.values[slug];
  if (now == null || before == null || before === 0) return null;
  return ((now - before) / before) * 100;
}
const changeText = (c: number | null) => (c == null ? "Not published" : `${c > 0 ? "Up" : c < 0 ? "Down" : "No change"} ${Math.abs(c).toFixed(0)}%`);
const rose = bySafety.filter((r) => (change(r.slug) ?? 0) > 0.5).length;
const fell = bySafety.filter((r) => (change(r.slug) ?? 0) < -0.5).length;
const comparedWithScotland =
  safest.value < scotland / 2 ? "under half the Scottish rate" : `${Math.round((1 - safest.value / scotland) * 100)}% below the Scottish rate`;

const FAQ = [
  {
    q: "What is the safest place to live in Scotland?",
    a: `${areaName(safest.slug)} has the lowest recorded crime of Scotland's 32 council areas: ${whole(safest.value)} crimes for every 10,000 people in ${crime.period}, ${comparedWithScotland} of ${whole(scotland)}. ${areaName(second.slug)} and ${areaName(third.slug)} are next.`,
  },
  {
    q: "What is the safest city in Scotland?",
    a: `Of the four cities, ${areaName(cities[0].slug)} has the lowest recorded crime, ${whole(cities[0].value)} for every 10,000 people. ${cities
      .slice(1)
      .map((c) => `${areaName(c.slug)} has ${whole(c.value)}`)
      .join(", ")}. Cities draw in shoppers, workers and nights out, which pushes their rates up.`,
  },
  {
    q: "Where is crime highest in Scotland?",
    a: `${areaName(highest[0].slug)} has the highest recorded crime, ${whole(highest[0].value)} for every 10,000 people, followed by ${areaName(highest[1].slug)} at ${whole(highest[1].value)} and ${areaName(highest[2].slug)} at ${whole(highest[2].value)}.`,
  },
  {
    q: "Is crime going up in Scotland?",
    a: `Recorded crime rose in ${rose} of the 32 council areas between ${previous?.period ?? "the year before"} and ${crime.period}, and fell in ${fell}. Across Scotland it went from ${whole(previous?.scotland ?? 0)} to ${whole(scotland)} crimes for every 10,000 people.`,
  },
  {
    q: "What is the safest place to live in Scotland for families?",
    a: "Crime is one part of it. The best places to live in Scotland for families also weighs school results, child poverty and health, and ranks every area.",
  },
];

export default function SafestPlacePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "Safest place to live in Scotland", path: "/safest-place-to-live-in-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Page>
        <PageHeader
          eyebrow="Your area · Rankings"
          title="Safest place to live in Scotland"
          lede={`${areaName(safest.slug)} is the safest place to live in Scotland on police figures: ${whole(safest.value)} recorded crimes for every 10,000 people in ${crime.period}, against ${whole(scotland)} across Scotland. Here is every council area, with violent crime, break ins and the change on last year.`}
        >
          <Freshness updated={UPDATED} checked={CHECKED} />
        </PageHeader>
        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Safest place to live in Scotland",
              value: areaName(safest.slug),
              detail: `${whole(safest.value)} crimes for every 10,000 people in ${crime.period}, the lowest of Scotland's 32 council areas and ${comparedWithScotland} of ${whole(scotland)}.`,
              rows: bySafety.slice(0, 5).map((r) => ({ label: `${r.rank}. ${areaName(r.slug)}`, value: `${whole(r.value)} per 10,000` })),
              asOf: `Recorded crime, ${crime.period}`,
              source: { publisher: crime.source.publisher, url: crime.source.url },
            }}
          />

          <section className="pt-14" aria-labelledby="all-areas">
            <SectionHead eyebrow="The full ranking" title="All 32 areas, safest first" id="all-areas" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Ranked by every crime the police recorded, for every 10,000 people living there. Violent crime is mostly common
              assault. The last column compares {crime.period} with {previous?.period ?? "the year before"}.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Crimes per 10,000"
                columns={["Violent crime", "Housebreaking", "On last year"]}
                rows={bySafety.map((r) => ({
                  slug: r.slug,
                  rank: r.rank,
                  main: whole(r.value),
                  bar: r.value / maxCrime,
                  cells: [
                    violence.values[r.slug] == null ? "Not published" : whole(violence.values[r.slug]!),
                    housebreaking.values[r.slug] == null ? "Not published" : whole(housebreaking.values[r.slug]!),
                    changeText(change(r.slug)),
                  ],
                }))}
              />
            </div>
          </section>

          <section className="pt-16" aria-labelledby="cities">
            <SectionHead eyebrow="Cities" title="Safest city in Scotland" id="cities" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              {areaName(cities[0].slug)} has the lowest recorded crime of the four cities, with {whole(cities[0].value)}{" "}
              crimes for every 10,000 people.{" "}
              {cities
                .slice(1)
                .map((c) => `${areaName(c.slug)} has ${whole(c.value)}`)
                .join(", ")}
              . For the two biggest side by side, see <Link href="/glasgow-vs-edinburgh">Glasgow vs Edinburgh</Link>.
            </p>
          </section>

          <section className="pt-16 max-w-[760px]" aria-labelledby="worth-knowing">
            <SectionHead eyebrow="Method" title="Worth knowing" id="worth-knowing" />
            <ul className="mt-5 grid gap-3 text-[17px] leading-[1.65] text-[var(--ink-2)]">
              <li>
                <strong className="text-[var(--ink)]">Recorded crime</strong> counts crimes reported to and recorded by the
                police, from the Scottish Government&apos;s Recorded Crime in Scotland, {crime.period}. Crimes nobody reports
                are not in it.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Cities look worse</strong> because their rates are per resident, but
                shoppers, workers and nights out bring in far more people than live there.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Small numbers move a lot.</strong> The island councils have very few
                crimes, so a handful either way changes their rate.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Safety is not the only thing.</strong> See the{" "}
                <Link href="/best-place-to-live-in-scotland">best places to live in Scotland</Link> for pay, jobs, poverty,
                health and schools too.
              </li>
            </ul>
          </section>

          <ComparePromo className="mt-16" />

          <section className="pt-16" aria-labelledby="more-rankings">
            <SectionHead eyebrow="More rankings" title="Keep exploring" id="more-rankings" />
            <div className="mt-6">
              <RankingLinks current="/safest-place-to-live-in-scotland" />
            </div>
          </section>

          <Faq items={FAQ} className="pt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
