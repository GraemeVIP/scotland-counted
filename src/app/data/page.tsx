import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";

export const metadata = meta({
  title: "Download the data",
  description:
    "Every dataset behind this site, free to download as CSV. Child poverty for all 32 Scottish council areas, employment, claimant count, pay, jobs density and life expectancy.",
  path: "/data",
});

const FILES = [
  {
    file: "glasgow-poverty-indicators.csv",
    title: "All headline indicators",
    body: "Every series plotted on this site in one tidy file, with the source and any caveat attached to each row.",
    size: "5 KB",
  },
  {
    file: "scottish-councils-child-poverty.csv",
    title: "Child poverty, all 32 council areas",
    body: "Ten years of rates for every Scottish council area, ranked by current level, with the change over the decade.",
    size: "3 KB",
  },
  {
    file: "ons-life-expectancy-glasgow-scotland.csv",
    title: "Life expectancy",
    body: "Life expectancy at birth by sex for Glasgow and Scotland, 2001–03 to 2017–19, extracted from the 22 MB ONS release.",
    size: "1 KB",
  },
  {
    file: "nomis-employment-aps-2004-2025.csv",
    title: "Employment (raw NOMIS extract)",
    body: "Annual Population Survey table T01 for Glasgow and Scotland, exactly as returned by the NOMIS API.",
    size: "30 KB",
  },
  {
    file: "nomis-claimant-count-2000-2026.csv",
    title: "Claimant count (raw NOMIS extract)",
    body: "Claimants as a share of residents aged 16–64, each January from 2000 to 2026.",
    size: "2 KB",
  },
  {
    file: "nomis-ashe-pay-workplace.csv",
    title: "Pay — workplace basis (raw)",
    body: "Median gross weekly pay for full-time jobs located in Glasgow, and in Scotland.",
    size: "2 KB",
  },
  {
    file: "nomis-ashe-pay-residence.csv",
    title: "Pay — residence basis (raw)",
    body: "Median gross weekly pay for full-time jobs held by Glasgow residents, and by Scottish residents.",
    size: "1 KB",
  },
  {
    file: "nomis-jobs-density-2000-2024.csv",
    title: "Jobs density (raw)",
    body: "Jobs per working-age resident for Glasgow and Scotland. Glasgow is published to 2021.",
    size: "1 KB",
  },
  {
    file: "end-child-poverty-AHC-2015-2024.xlsx",
    title: "End Child Poverty source workbook",
    body: "The original publisher's spreadsheet, unmodified, covering every UK local authority and constituency.",
    size: "272 KB",
  },
];

export default function Data() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Data", path: "/data" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Glasgow Counted — full dataset",
          description:
            "Child poverty, employment, benefit claims, pay, jobs density and life expectancy data for Glasgow and Scotland, 2000–2026, as CSV.",
          path: "/data",
          keywords: ["Glasgow", "poverty", "open data", "Scotland", "CSV", "child poverty"],
          temporalCoverage: "2000/2026",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Free to download and reuse"
          title="Download the data"
          lede="Two kinds of file: tidy extracts we prepared, and the raw pulls exactly as the publisher returned them. Both are here so you can check our working rather than take it on trust."
        />

        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {FILES.map((f) => (
            <a
              key={f.file}
              href={`/data/${f.file}`}
              download
              className="group block bg-[var(--surface)] border border-[var(--rule)] p-5 hover:border-[var(--brand)] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-[16.5px] font-[620] leading-[1.3] group-hover:text-[var(--brand)] transition-colors">
                  {f.title}
                </h2>
                <span className="font-mono text-[11px] text-[var(--muted)] shrink-0 pt-1">
                  {f.size}
                </span>
              </div>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.5] mb-2.5">{f.body}</p>
              <p className="font-mono text-[11.5px] text-[var(--brand)]">↓ {f.file}</p>
            </a>
          ))}
        </div>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Licence and attribution</h2>
          <p>
            The underlying data belongs to its original publishers — ONS, DWP, the Scottish
            Government, End Child Poverty and Loughborough University — and is almost all
            available under the Open Government Licence. Their terms apply to the raw files.
          </p>
          <p>
            Our derived files, charts and analysis are free to reuse with attribution to Glasgow
            Counted. No permission needed. If you are a journalist or researcher and want a series
            in a different shape, ask and we will prepare it.
          </p>
          <p>
            The derivations we applied are documented on the{" "}
            <Link href="/methods">methods page</Link>, source by source.
          </p>
        </Col>

        <CTA
          title="If our numbers do not match the publisher's, tell us"
          body="Everything here was retrieved from primary sources, but retrieval and transcription can both go wrong. A confirmed error gets fixed the day it is reported and logged in public."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="Read the methods"
        />
      </Page>
    </>
  );
}
