import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Download the data",
  description:
    "Every dataset behind Scotland Counted, free to download: poverty rates for all 32 council areas, employment, claimant count, pay and life expectancy.",
  path: "/data",
});

const FILES = [
  {
    file: "scotland-poverty-headline-2022-25.csv",
    title: "Scotland-wide poverty headline",
    body: "The latest official relative-poverty rates after housing costs for all people, children, working-age adults and pensioners, 2022–25.",
    size: "<1 KB",
  },
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
    title: "Restricted full-time pay — workplace basis (raw)",
    body: "ASHE median gross weekly pay for selected full-time PAYE employee jobs located in Glasgow and Scotland. This is not the average wage of everyone working there.",
    size: "2 KB",
  },
  {
    file: "nomis-ashe-pay-residence.csv",
    title: "Restricted full-time pay — residence basis (raw)",
    body: "ASHE median gross weekly pay for selected full-time PAYE employee jobs held by Glasgow and Scottish residents. Part-time jobs and self-employment are excluded.",
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
          name: "Scotland Counted — full dataset",
          description:
            "National poverty rates, council child poverty, employment, benefit claims, pay, jobs density and life expectancy data for Scotland, including the Glasgow deep series, 2000–2026.",
          path: "/data",
          keywords: ["poverty", "open data", "Scotland", "CSV", "child poverty", "Glasgow"],
          temporalCoverage: "2000/2026",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Free to download and reuse"
          title="Download the data"
          lede="This is the proof behind the simple pages. Download the clean files we prepared or the original files exactly as the publisher supplied them."
        />

        <ContentFrame>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {FILES.map((f) => (
            <a
              key={f.file}
              href={`/data/${f.file}`}
              download
              className="group block rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-5 hover:border-[var(--brand)] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-[16.5px] font-[620] leading-[1.3] group-hover:text-[var(--brand)] transition-colors">
                  {f.title}
                </h2>
                <span className="ui text-[15px] text-[var(--muted)] shrink-0 pt-1">
                  {f.size}
                </span>
              </div>
              <p className="text-[15px] text-[var(--ink-2)] leading-[1.5] mb-2.5">{f.body}</p>
              <p className="ui text-[15px] font-[620] text-[var(--brand)]">Download · {f.file}</p>
            </a>
          ))}
        </div>

        <Col className="pt-12">
          <h2 className="h2 mb-4">Can I reuse it?</h2>
          <p>
            Yes. The original data belongs to ONS, DWP, the Scottish Government, End Child Poverty
            and Loughborough University. Their licence rules still apply to the original files.
          </p>
          <p>
            Our cleaned files, charts and words are free to reuse if you credit {site.name}. You do
            not need permission. Journalists and researchers can ask for a different file format.
          </p>
          <p>
            Any calculation we made is explained on the <Link href="/methods">how we counted it page</Link>.
          </p>
        </Col>

        <CTA
          title="If a number does not match, tell us"
          body="People can make mistakes when copying or cleaning data. We check reported errors, fix confirmed mistakes and keep a public record."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="See how it was counted"
        />
        </ContentFrame>
      </Page>
    </>
  );
}
