import { Page, ContentFrame, PageHeader, SectionHead } from "@/components/Blocks";
import QuickAnswer from "@/components/QuickAnswer";
import Faq from "@/components/Faq";
import AreaComparePicker from "@/components/AreaComparePicker";
import AreaComparison from "@/components/AreaComparison";
import { Freshness, RankingLinks } from "@/components/AreaRanking";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { COMPARE_METRICS, metricById, winner } from "@/lib/data/compareAreas";

/**
 * Glasgow vs Edinburgh: the most searched pairing, with a page of its own.
 *
 * The comparison itself is the same component as /compare-areas. This page
 * adds the plain answer to the question people type, built from the figures
 * so it stays true when they change. /compare-areas no longer opens on this
 * pairing, so the two pages do not compete in search.
 */

const UPDATED = "2026-10-29";
const CHECKED = "2026-10-29";
const G = "glasgow-city";
const E = "city-of-edinburgh";

export const metadata = meta({
  title: "Glasgow vs Edinburgh: Which Is Better to Live In? The Official Figures",
  description:
    "Glasgow vs Edinburgh side by side: pay, house prices, rent, council tax, crime, poverty, health and schools, from the latest official figures, in plain words.",
  path: "/glasgow-vs-edinburgh",
});

/** A figure for one city, formatted with its unit; "not published" when missing. */
function shown(id: string, slug: string) {
  const m = metricById(id);
  const v = m?.values[slug];
  if (!m || v == null) return "not published";
  return `${m.format(v)}${m.unit ? ` ${m.unit}` : ""}`;
}
function diff(id: string) {
  const m = metricById(id);
  const g = m?.values[G];
  const e = m?.values[E];
  if (!m || g == null || e == null) return null;
  return { higher: g > e ? "Glasgow" : "Edinburgh", lower: g > e ? "Edinburgh" : "Glasgow", gap: m.formatDiff(Math.abs(g - e)) };
}

const scored = COMPARE_METRICS.map((m) => winner(m, G, E)).filter((w) => w === "a" || w === "b");
const glasgowWins = scored.filter((w) => w === "a").length;
const edinburghWins = scored.filter((w) => w === "b").length;
const house = diff("house_price");
const rent = diff("rent");
const tax = diff("council_tax");
const pay = diff("pay");
const crime = diff("crime_total");
const lifeMen = diff("life_men");

const verdict = `Edinburgh comes out better on ${edinburghWins} of the ${scored.length} measures where better or worse is clear, and Glasgow on ${glasgowWins}.`;
/** "about £107,000": a six figure gap reads better rounded. */
const roughly = (id: string) => {
  const m = metricById(id);
  const g = m?.values[G];
  const e = m?.values[E];
  return g == null || e == null ? "" : `about £${(Math.round(Math.abs(g - e) / 1000) * 1000).toLocaleString("en-GB")}`;
};
const cost =
  house && rent
    ? `Glasgow is the cheaper place to live: homes cost ${roughly("house_price")} less on average, and private rent is ${rent.gap} less.`
    : "";
const crimeG = metricById("crime_total")?.values[G];
const crimeE = metricById("crime_total")?.values[E];
const violenceG = metricById("crime_violence")?.values[G];
const violenceE = metricById("crime_violence")?.values[E];

const FAQ = [
  {
    q: "Which is better, Glasgow or Edinburgh?",
    a: `${verdict} Edinburgh has higher pay, less crime, fewer children in poverty and longer lives. ${cost} Which is better for you depends on what you need from a place.`,
  },
  {
    q: "Is it cheaper to live in Glasgow or Edinburgh?",
    a: `Glasgow, for homes. The average house price is ${shown("house_price", G)} in Glasgow against ${shown("house_price", E)} in Edinburgh, and the average private rent is ${shown("rent", G)} against ${shown("rent", E)}. ${
      tax ? `Council tax is the exception: Band D is ${shown("council_tax", G)} in Glasgow and ${shown("council_tax", E)} in Edinburgh, so ${tax.higher}'s is ${tax.gap} higher.` : ""
    }`,
  },
  {
    q: "Is Edinburgh safer than Glasgow?",
    a:
      crimeG != null && crimeE != null && crime
        ? `On police figures, yes. Glasgow recorded ${Math.round(crimeG)} crimes for every 10,000 people in ${metricById("crime_total")?.period}, against ${Math.round(crimeE)} in Edinburgh, so ${Math.round(Math.abs(crimeG - crimeE))} more for every 10,000 people.${
            violenceG != null && violenceE != null ? ` For violent crime it was ${Math.round(violenceG)} against ${Math.round(violenceE)}.` : ""
          }`
        : "The crime figures for one of the cities are not published.",
  },
  {
    q: "Where is pay higher, Glasgow or Edinburgh?",
    a: pay
      ? `${pay.higher}. The middle full time weekly pay of people living there is ${shown("pay", G)} in Glasgow and ${shown("pay", E)} in Edinburgh, a gap of ${pay.gap}.`
      : "The pay figures for one of the cities are not published.",
  },
  {
    q: "Do people live longer in Glasgow or Edinburgh?",
    a: lifeMen
      ? `Edinburgh. A baby boy born there can expect to live ${shown("life_men", E)}, against ${shown("life_men", G)} in Glasgow. For girls it is ${shown("life_women", E)} against ${shown("life_women", G)}.`
      : "The figures for one of the cities are not published.",
  },
  {
    q: "Which has better school results, Glasgow or Edinburgh?",
    a: `${shown("leavers_higher", E)} of Edinburgh's school leavers left with at least one Higher, against ${shown("leavers_higher", G)} in Glasgow. ${shown("leavers_positive", E)} and ${shown("leavers_positive", G)} went on to work, study or training.`,
  },
];

export default function GlasgowVsEdinburghPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare areas", path: "/compare-areas" },
          { name: "Glasgow vs Edinburgh", path: "/glasgow-vs-edinburgh" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Page>
        <PageHeader eyebrow="Compare areas" title="Glasgow vs Edinburgh" lede={`${verdict} ${cost}`}>
          <Freshness updated={UPDATED} checked={CHECKED} />
        </PageHeader>
        <ContentFrame>
          <QuickAnswer
            answer={{
              label: "Glasgow vs Edinburgh",
              detail: `${verdict} ${cost}`,
              rows: [
                { label: "Average house price", value: `${shown("house_price", G)} vs ${shown("house_price", E)}` },
                { label: "Private rent, a month", value: `${shown("rent", G).replace(" a month", "")} vs ${shown("rent", E).replace(" a month", "")}` },
                { label: "Full time weekly pay", value: `${shown("pay", G)} vs ${shown("pay", E)}` },
                { label: "Crime per 10,000 people", value: `${shown("crime_total", G).replace(" per 10,000", "")} vs ${shown("crime_total", E).replace(" per 10,000", "")}` },
              ],
              asOf: "Glasgow first, Edinburgh second · latest official figures",
            }}
          />
          <div className="pt-12 pb-10">
            <SectionHead eyebrow="Try another pair" title="Compare either city with anywhere" />
            <div className="mt-6">
              <AreaComparePicker a={G} b={E} />
            </div>
          </div>
        </ContentFrame>
      </Page>
      {/* Outside Page for the same reason as on /compare-areas: the glossary annotator breaks hydration on a tree this size. */}
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
        <ContentFrame className="pb-4">
          <AreaComparison a={G} b={E} />
        </ContentFrame>
      </div>
      <Page>
        <ContentFrame>
          <section className="pt-14" aria-labelledby="more-rankings">
            <SectionHead eyebrow="More rankings" title="Keep exploring" id="more-rankings" />
            <div className="mt-6">
              <RankingLinks current="/glasgow-vs-edinburgh" />
            </div>
          </section>
          <Faq items={FAQ} className="pt-16" />
        </ContentFrame>
      </Page>
    </>
  );
}
