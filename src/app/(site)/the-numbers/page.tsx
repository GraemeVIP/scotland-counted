import Link from "next/link";
import { Page, Col, PageHeader, DirectionChip, CTA, InShort, Reveal } from "@/components/Blocks";
import Spark from "@/components/charts/Spark";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";

export const metadata = meta({
  title: "Glasgow — what changed since 2000",
  description:
    "See what changed in Glasgow since 2000: child poverty, work, out-of-work benefits, pay, neighbourhoods and how long people live.",
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
          { name: "The Glasgow record", path: "/the-numbers" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Poverty indicators for Glasgow, 2000–2026",
          description:
            "Six time series covering child poverty after housing costs, employment, out-of-work benefit claims, restricted full-time employee-pay estimates, neighbourhood deprivation and life expectancy at birth.",
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
          spatialCoverage: "Glasgow, Scotland",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Glasgow · Six parts of the story · 2000–2026"
          title="What changed in Glasgow"
          lede="Glasgow has Scotland's worst child-poverty rate and the biggest ten-year rise. These six pages show the wider story: children, work, benefits, wages, neighbourhoods and how long people live."
          stat={{
            value: "6",
            label: "parts of Glasgow's story, each with an easy summary and the exact proof",
            tone: "neutral",
          }}
        />

        <InShort>
          <p><strong>Start with any card.</strong> It gives the simple answer first.</p>
          <p>If you want to check it, open the chart, exact figures and original source on the same page.</p>
        </InShort>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 60}>
              <Link
                href={`/indicators/${c.slug}`}
                className="group flex flex-col h-full rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6 sm:p-7 transition-all duration-300 hover:border-[var(--brand)] hover:-translate-y-1 hover:shadow-[var(--shadow-2)]"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <p className="ui text-[15px] font-[700] text-[var(--muted)]">{c.label}</p>
                  {c.slug !== "pay" && <DirectionChip direction={c.direction} />}
                </div>
                <h2 className="h3 mb-3 group-hover:text-[var(--brand)] transition-colors">
                  {c.title}
                </h2>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mb-6">{c.summary}</p>
                <div className="mt-auto pt-2">
                  <Spark data={c.spark} />
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="ui text-[15px] text-[var(--muted)]">{c.sparkNote}</span>
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

        {/* This page is an index, not a charts page. The squiggle on each card
            is a preview; the chart itself lives on the measure's own page. The
            copy here used to read as instructions for charts that were not on
            the screen. */}
        <section className="pt-20 sm:pt-24">
          <Col>
            <h2 className="h2 mb-5">Each measure has its own chart</h2>
            <p>
              The small line on every card above is a preview. Open a card and you get the full
              chart, ten years of figures and the source it came from.
            </p>
            <p>
              On those charts, blue is Glasgow and orange is Scotland. Any other line is named
              above it. If a figure may be unreliable the line is dotted and the reason is given,
              and every chart has a “See the numbers behind this chart” button with the exact
              values.
            </p>
            <p>
              The simple version comes first, but nobody has to take our word for it. Journalists
              and researchers can <Link href="/data">download all the data</Link>.
            </p>
          </Col>
        </section>

        <CTA
          title="Want the figures for your own council area?"
          body="Every Scottish council area has its own page with a clear summary first and the exact local figures underneath."
          href="/areas"
          cta="Find your area"
          secondaryHref="/methods"
          secondaryCta="Check how it was counted"
        />
      </Page>
    </>
  );
}
