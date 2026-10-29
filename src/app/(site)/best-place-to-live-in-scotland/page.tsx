import Link from "next/link";
import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import ComparePromo from "@/components/ComparePromo";
import { RankedList, Freshness, RankingLinks, areaName } from "@/components/AreaRanking";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  CITY_SLUGS,
  FAMILY_THEMES,
  LIVING_THEMES,
  THEMES,
  metricById,
  placeScores,
  rankAreas,
  type ThemeId,
} from "@/lib/data/compareAreas";

/**
 * "Best place to live in Scotland": all 32 council areas ranked on the
 * official figures the compare tool already holds.
 *
 * The ranking is the site's own and says so: six parts of life, each scored
 * 0 to 100 against the best and worst council and averaged, with every
 * measure and source listed. Every sentence with a figure in it is built
 * from the data, so the page updates itself when the figures do.
 */

const UPDATED = "2026-10-29";
const CHECKED = "2026-10-29";

export const metadata = meta({
  title: "Best Place to Live in Scotland: All 32 Areas Ranked on Official Data",
  description:
    "The best place to live in Scotland, ranked on official figures for pay, jobs, poverty, crime, health and schools across all 32 council areas. See where your area comes, and why.",
  path: "/best-place-to-live-in-scotland",
});

const SHORT: Record<ThemeId, string> = {
  money: "pay",
  work: "jobs",
  poverty: "poverty",
  safety: "crime",
  health: "health",
  schools: "schools",
  services: "council services",
  people: "population",
};

const ranked = placeScores();
const family = placeScores(FAMILY_THEMES);
const [first, second, third] = ranked;
const cities = ranked.filter((r) => CITY_SLUGS.includes(r.slug));
const outOf100 = (n: number) => `${Math.round(n)} out of 100`;

function strongestAndWeakest(themes: Partial<Record<ThemeId, number | null>>) {
  const present = (Object.entries(themes) as Array<[ThemeId, number | null]>).filter((e): e is [ThemeId, number] => e[1] != null);
  if (present.length < 2) return undefined;
  const sorted = [...present].sort((x, y) => y[1] - x[1]);
  return `Strongest on ${SHORT[sorted[0][0]]} · weakest on ${SHORT[sorted[sorted.length - 1][0]]}`;
}

const safest = rankAreas("crime_total", "asc")[0];
const cheapest = rankAreas("house_price", "asc")[0];
const crime = metricById("crime_total");
const house = metricById("house_price");

const FAQ = [
  {
    q: "What is the best place to live in Scotland?",
    a: `On the official figures for pay, jobs, poverty, crime, health and schools, ${areaName(first.slug)} comes out top of Scotland's 32 council areas, scoring ${outOf100(first.score)}. ${areaName(second.slug)} is second and ${areaName(third.slug)} third. The best place for you depends on what matters most, so the full ranking shows where each area is strongest and weakest.`,
  },
  {
    q: "What is the best city to live in Scotland?",
    a: `Of the four city council areas, ${areaName(cities[0].slug)} ranks highest, ${ordinal(cities[0].rank)} of 32 overall. ${cities
      .slice(1)
      .map((c) => `${areaName(c.slug)} is ${ordinal(c.rank)}`)
      .join(", ")}. Cities tend to score lower than the areas around them on crime and poverty, and higher on jobs.`,
  },
  {
    q: "Where is the best place to live in Scotland for families?",
    a: `Weighting school results, child poverty, crime and life expectancy, ${areaName(family[0].slug)} comes top for families, then ${areaName(family[1].slug)} and ${areaName(family[2].slug)}.`,
  },
  {
    q: "What is the safest place to live in Scotland?",
    a:
      safest && crime
        ? `${areaName(safest.slug)} has the lowest recorded crime of any council area: ${crime.format(safest.value)} crimes for every 10,000 people in ${crime.period}, against ${crime.format(crime.scotland ?? 0)} across Scotland.`
        : "See the safest places to live in Scotland for every area ranked by recorded crime.",
  },
  {
    q: "What is the cheapest place to live in Scotland?",
    a:
      cheapest && house
        ? `${areaName(cheapest.slug)} has the lowest average house price in Scotland, ${house.format(cheapest.value)} in ${house.period}, against ${house.format(house.scotland ?? 0)} across Scotland.`
        : "See the cheapest places to live in Scotland for every area ranked by house prices and rent.",
  },
  {
    q: "How is this ranking worked out?",
    a: "Each area gets a score from 0 to 100 on every measure, where 100 is the best council in Scotland and 0 the worst. The measures are grouped into six parts of life, each part counts the same, and the overall score is the average. Every figure is the latest official one. House prices, rents and council tax are left out, because cheaper is not better for everyone.",
  },
];

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function BestPlaceToLivePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "Best place to live in Scotland", path: "/best-place-to-live-in-scotland" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Page>
        <PageHeader
          eyebrow="Your area · Rankings"
          title="Best place to live in Scotland"
          lede={`${areaName(first.slug)} comes out top on the official figures, followed by ${areaName(second.slug)} and ${areaName(third.slug)}. Here is every council area in Scotland ranked on pay, jobs, poverty, crime, health and schools.`}
        >
          <Freshness updated={UPDATED} checked={CHECKED} />
        </PageHeader>
        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Best place to live in Scotland",
              value: areaName(first.slug),
              detail: `${areaName(first.slug)} scores ${outOf100(first.score)} across pay, jobs, poverty, crime, health and schools, the highest of Scotland's 32 council areas. ${areaName(second.slug)} and ${areaName(third.slug)} come next.`,
              rows: ranked.slice(0, 5).map((r) => ({ label: `${r.rank}. ${areaName(r.slug)}`, value: outOf100(r.score) })),
              asOf: "Latest official figures, checked 29 October 2026",
            }}
          />

          <section className="pt-14" aria-labelledby="all-areas">
            <SectionHead eyebrow="The full ranking" title="All 32 areas, best first" id="all-areas" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              The score is out of 100. Under each area is the part of life it does best on, and the one it does worst on, so
              you can see why it lands where it does. Tap an area for all its figures.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Score"
                rows={ranked.map((r) => ({
                  slug: r.slug,
                  rank: r.rank,
                  main: outOf100(r.score),
                  bar: r.score / 100,
                  note: strongestAndWeakest(r.themes),
                }))}
              />
            </div>
          </section>

          <section className="pt-16" aria-labelledby="families">
            <SectionHead eyebrow="For families" title="Best place to live in Scotland for families" id="families" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              The same idea, weighted to what families ask about most: how school leavers do, how many children grow up in
              poverty, crime, and how long people live.
            </p>
            <div className="mt-6">
              <RankedList
                mainLabel="Family score"
                columns={["Leavers with a Higher", "Child poverty", "Recorded crime"]}
                rows={family.slice(0, 10).map((r) => {
                  const higher = metricById("leavers_higher");
                  const kids = metricById("child_poverty");
                  const c = metricById("crime_total");
                  const show = (m: typeof higher, unit = "") => {
                    const v = m?.values[r.slug];
                    return v == null || !m ? "Not published" : `${m.format(v)}${unit}`;
                  };
                  return {
                    slug: r.slug,
                    rank: r.rank,
                    main: outOf100(r.score),
                    bar: r.score / 100,
                    cells: [show(higher), show(kids), show(c, " per 10,000")],
                  };
                })}
              />
            </div>
          </section>

          <section className="pt-16" aria-labelledby="cities">
            <SectionHead eyebrow="Cities" title="Best city to live in Scotland" id="cities" />
            <p className="mt-4 max-w-[64ch] text-[17px] leading-[1.6] text-[var(--ink-2)]">
              Of the four cities, {areaName(cities[0].slug)} ranks highest, {ordinal(cities[0].rank)} of 32 overall.{" "}
              {cities
                .slice(1)
                .map((c) => `${areaName(c.slug)} is ${ordinal(c.rank)}`)
                .join(", ")}
              . For the two biggest side by side, see <Link href="/glasgow-vs-edinburgh">Glasgow vs Edinburgh</Link>.
            </p>
          </section>

          <section className="pt-16 max-w-[760px]" aria-labelledby="how-it-works">
            <SectionHead eyebrow="Method" title="How this ranking works" id="how-it-works" />
            <div className="mt-5 grid gap-4 text-[17px] leading-[1.65] text-[var(--ink-2)]">
              <p>
                Every area gets a score from 0 to 100 on each measure: 100 for the best council in Scotland, 0 for the worst,
                and the rest in between. The measures sit in six parts of life, each part counts the same however many
                measures it has, and the overall score is the average of the six.
              </p>
              <ul className="grid gap-2.5">
                {(Object.entries(LIVING_THEMES) as Array<[ThemeId, string[]]>).map(([theme, ids]) => (
                  <li key={theme}>
                    <strong className="text-[var(--ink)]">{THEMES.find((t) => t.id === theme)?.label}:</strong>{" "}
                    {ids
                      .map((id) => metricById(id))
                      .filter((m) => m != null)
                      .map((m) => `${m.label.toLowerCase()} (${m.period}, ${m.source.publisher})`)
                      .join("; ")}
                    .
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-[var(--ink)]">Left out on purpose:</strong> house prices, rents and council tax,
                because cheaper is not better for everyone. They have their own ranking on the{" "}
                <Link href="/cheapest-place-to-live-in-scotland">cheapest places to live</Link>.
              </p>
              <p>
                <strong className="text-[var(--ink)]">Worth knowing:</strong> a council area is big, and the figures are
                averages across all of it, so a single street or town can be very different. The island councils are small,
                so a few events move their figures a lot. Nothing here covers weather, scenery or transport.
              </p>
            </div>
          </section>

          <ComparePromo className="mt-16" />

          <section className="pt-16" aria-labelledby="more-rankings">
            <SectionHead eyebrow="More rankings" title="Keep exploring" id="more-rankings" />
            <div className="mt-6">
              <RankingLinks current="/best-place-to-live-in-scotland" />
            </div>
          </section>

          <Faq items={FAQ} className="pt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
