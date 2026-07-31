import Link from "next/link";
import { Page, Col, PageHeader, DirectionChip, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { indicators, lifeExpectancy, deprivation } from "@/lib/data/indicators";

export const metadata = meta({
  title: "The numbers",
  description:
    "Six measures of poverty in Glasgow charted from 2000: child poverty, employment, out-of-work benefits, pay, neighbourhood deprivation and life expectancy. Every figure sourced, every data table downloadable.",
  path: "/the-numbers",
});

const CARDS = [
  ...indicators.map((i) => ({
    slug: i.slug,
    label: i.label,
    title: i.title,
    summary: i.summary,
    direction: i.direction,
  })),
  {
    slug: deprivation.slug,
    label: deprivation.label,
    title: deprivation.title,
    summary: deprivation.summary,
    direction: deprivation.direction,
  },
  {
    slug: lifeExpectancy.slug,
    label: lifeExpectancy.label,
    title: lifeExpectancy.title,
    summary: lifeExpectancy.summary,
    direction: lifeExpectancy.direction,
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
        />

        <div className="grid gap-4 sm:grid-cols-2 mt-9">
          {CARDS.map((c) => (
            <Link
              key={c.slug}
              href={`/indicators/${c.slug}`}
              className="group block bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-5 sm:p-6 hover:border-[var(--glasgow)] transition-colors"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="eyebrow">{c.label}</p>
                <DirectionChip direction={c.direction} />
              </div>
              <h2 className="text-[20px] font-[620] tracking-[-0.015em] leading-[1.25] mb-2.5 group-hover:text-[var(--glasgow)] transition-colors">
                {c.title}
              </h2>
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.5]">{c.summary}</p>
            </Link>
          ))}
        </div>

        <section className="pt-14">
          <Col>
            <h2 className="h2 mb-4">How to read a chart on this site</h2>
            <p>
              Blue is always Glasgow. Orange is always Scotland. Where a third line appears it is
              labelled in the legend.
            </p>
            <p>
              Where data is unreliable we show it rather than hide it — dotted, shaded, and
              labelled with the reason. Where a series has a break in definition, the technical
              note under the chart says so. Every chart has a data table with the underlying
              numbers, and you can{" "}
              <Link href="/data">download the whole dataset</Link> as CSV.
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
