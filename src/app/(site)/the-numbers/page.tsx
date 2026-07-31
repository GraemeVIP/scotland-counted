import Link from "next/link";
import { Page, Col, PageHeader, DirectionChip, CTA, Reveal } from "@/components/Blocks";
import Spark from "@/components/charts/Spark";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";

export const metadata = meta({
  title: "The numbers",
  description:
    "Six measures of poverty in Glasgow charted from 2000: child poverty, employment, out-of-work benefits, pay, neighbourhood deprivation and life expectancy. Every figure sourced, every data table downloadable.",
  path: "/the-numbers",
});

/** Card data, including the miniature series each card draws. */
const CARDS = [
  ...indicators.map((i) => ({
    slug: i.slug,
    label: i.label,
    title: i.title,
    summary: i.summary,
    direction: i.direction,
    spark: i.series[0].data,
    sparkNote: `${i.x[0]} – ${i.x[i.x.length - 1]}`,
  })),
  {
    slug: deprivation.slug,
    label: deprivation.label,
    title: deprivation.title,
    summary: deprivation.summary,
    direction: deprivation.direction,
    spark: deprivation.rows.map((r) => r.pct),
    sparkNote: "SIMD 2004 – 2020",
  },
  {
    slug: lifeExpectancy.slug,
    label: lifeExpectancy.label,
    title: lifeExpectancy.title,
    summary: lifeExpectancy.summary,
    direction: lifeExpectancy.direction,
    spark: lifeExpectancy.glaM,
    sparkNote: "Men, 2001–03 – 2017–19",
  },
];

export default function TheNumbers() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "The numbers", path: "/the-numbers" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Poverty indicators for Glasgow, 2000–2026",
          description:
            "Six time series covering child poverty after housing costs, employment, out-of-work benefit claims, median pay on workplace and residence bases, neighbourhood deprivation and life expectancy at birth.",
          path: "/the-numbers",
          keywords: [
            "Glasgow",
            "poverty",
            "child poverty",
            "employment",
            "life expectancy",
            "deprivation",
            "Scotland",
          ],
          temporalCoverage: "2000/2026",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Six measures · 2000–2026"
          title="The numbers"
          lede="Poverty is not one thing, and Glasgow's measures do not all point the same way. Two improved, one stalled, and one got substantially worse. Here is each of them, with the data behind it."
          stat={{
            value: "6",
            label: "measures, each with its chart, its raw data, and its sources",
            tone: "neutral",
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 60}>
              <Link
                href={`/indicators/${c.slug}`}
                className="group flex flex-col h-full bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 transition-all duration-300 hover:border-[var(--brand)] hover:-translate-y-1 hover:shadow-[var(--shadow-2)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <p className="label label-quiet">{c.label}</p>
                  <DirectionChip direction={c.direction} />
                </div>
                <h2 className="h3 mb-3 group-hover:text-[var(--brand)] transition-colors">
                  {c.title}
                </h2>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mb-6">{c.summary}</p>
                <div className="mt-auto pt-2">
                  <Spark data={c.spark} />
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="datum text-[10.5px] text-[var(--muted)]">{c.sparkNote}</span>
                    <span
                      aria-hidden="true"
                      className="text-[var(--action)] text-[17px] group-hover:translate-x-1.5 transition-transform"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <section className="pt-20 sm:pt-24">
          <Col>
            <h2 className="h2 mb-5">How to read a chart on this site</h2>
            <p>
              Blue is always Glasgow. Orange is always Scotland. Where a third line appears it is
              labelled in the legend.
            </p>
            <p>
              Where data is unreliable we show it rather than hide it — dotted, shaded, and
              labelled with the reason. Where a series has a break in definition, the technical
              note under the chart says so. Every chart has a data table with the underlying
              numbers, and you can <Link href="/data">download the whole dataset</Link> as CSV.
            </p>
            <p>
              We do this because the point of the site is that you should not have to take our
              word for anything.
            </p>
          </Col>
        </section>

        <CTA
          title="Want the figures for your own council area?"
          body="Every one of Scotland's 32 council areas has its own page, with ten years of child poverty data, its rank, and how it compares with Glasgow."
          href="/areas"
          cta="Find your area"
          secondaryHref="/methods"
          secondaryCta="Read the methods"
        />
      </Page>
    </>
  );
}
