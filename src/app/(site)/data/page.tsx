import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, datasetJsonLd, meta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Download Scotland Poverty Data: CSV and Sources",
  description:
    "Download the Scotland Counted poverty, pay, benefit and local-area data as CSV files, with dates, definitions and links to every original source.",
  path: "/data",
});

/**
 * Every file, with the two things the page never used to say: what format it is
 * and whether we touched it.
 *
 * "prepared" means we built the file — tidied into one row per observation,
 * given column names a person can read, with the source attached. "original"
 * means it is the publisher's own output, saved and served unaltered, down to
 * the shouted NOMIS column names.
 *
 * Sizes and row counts are the real ones, measured from public/data.
 */
type DataFile = {
  file: string;
  title: string;
  body: string;
  format: "CSV" | "XLSX";
  size: string;
  /** Row count excluding the header. Absent for the spreadsheet. */
  rows?: string;
  /** What the columns are. Only worth showing where we chose them. */
  columns?: string;
  kind: "prepared" | "original";
};

const FILES: DataFile[] = [
  {
    file: "scotland-poverty-headline-2022-25.csv",
    title: "Scotland-wide poverty headline",
    body: "The latest official relative-poverty rates after housing costs for all people, children, working-age adults and pensioners, 2022–25.",
    format: "CSV",
    size: "252 B",
    rows: "4 rows",
    columns: "period, group, relative_poverty_after_housing_costs_pct, people, source",
    kind: "prepared",
  },
  {
    file: "glasgow-poverty-indicators.csv",
    title: "All headline indicators",
    body: "Every series plotted on this site in one tidy file, with the source and any caveat attached to each row.",
    format: "CSV",
    size: "5 KB",
    rows: "61 rows",
    columns: "indicator, period, glasgow, scotland, glasgow_count, source, note",
    kind: "prepared",
  },
  {
    file: "scottish-councils-child-poverty.csv",
    title: "Child poverty, all 32 council areas",
    body: "Ten years of rates for every Scottish council area, ranked by current level, with the change over the decade.",
    format: "CSV",
    size: "3 KB",
    rows: "32 rows",
    columns: "council, area_code, then one column per year from 2014/15 to 2023/24",
    kind: "prepared",
  },
  {
    file: "scottish-councils-benchmarks.csv",
    title: "Council performance and budgets, all 32 councils",
    body: "Every council on the seven measures they all report the same way, plus the extra money each said it needed for 2026/27. A Scotland row sits at the bottom to compare against. Regenerate with npm run data:build:councils.",
    format: "CSV",
    size: "4 KB",
    rows: "32 councils plus a Scotland row",
    columns:
      "council, council_code, budget_gap_2026_27_gbp_m, then a value and a rank for each measure. Years are in the column names because the road figures are a year fresher than the rest.",
    kind: "prepared",
  },
  {
    file: "ons-life-expectancy-glasgow-scotland.csv",
    title: "Life expectancy",
    body: "Life expectancy at birth by sex for Glasgow and Scotland, 2001–03 to 2017–19, pulled out of the 22 MB ONS release so you do not have to open it.",
    format: "CSV",
    size: "615 B",
    rows: "17 rows",
    columns: "period, glasgow_male, glasgow_female, scotland_male, scotland_female",
    kind: "prepared",
  },
  {
    file: "nomis-employment-aps-2004-2025.csv",
    title: "Employment",
    body: "Annual Population Survey table T01 for Glasgow and Scotland, exactly as returned by the NOMIS API.",
    format: "CSV",
    size: "29 KB",
    rows: "344 rows",
    kind: "original",
  },
  {
    file: "nomis-claimant-count-2000-2026.csv",
    title: "Claimant count",
    body: "Claimants as a share of residents aged 16–64, each January from 2000 to 2026.",
    format: "CSV",
    size: "2 KB",
    rows: "54 rows",
    kind: "original",
  },
  {
    file: "nomis-ashe-pay-workplace.csv",
    title: "Restricted full-time pay | workplace basis",
    body: "ASHE median gross weekly pay for selected full-time PAYE employee jobs located in Glasgow and Scotland. This is not the average wage of everyone working there.",
    format: "CSV",
    size: "1 KB",
    rows: "58 rows",
    kind: "original",
  },
  {
    file: "nomis-ashe-pay-residence.csv",
    title: "Restricted full-time pay | residence basis",
    body: "ASHE median gross weekly pay for selected full-time PAYE employee jobs held by Glasgow and Scottish residents. Part-time jobs and self-employment are excluded.",
    format: "CSV",
    size: "1 KB",
    rows: "48 rows",
    kind: "original",
  },
  {
    file: "nomis-jobs-density-2000-2024.csv",
    title: "Jobs density",
    body: "Jobs per working-age resident for Glasgow and Scotland. Glasgow is published to 2021.",
    format: "CSV",
    size: "1 KB",
    rows: "50 rows",
    kind: "original",
  },
  {
    file: "end-child-poverty-AHC-2015-2024.xlsx",
    title: "End Child Poverty source workbook",
    body: "The publisher's own spreadsheet, covering every UK local authority and constituency. Several sheets, and the figures are not on the first one.",
    format: "XLSX",
    size: "272 KB",
    kind: "original",
  },
];

const GROUPS = [
  {
    kind: "prepared" as const,
    title: "Files I prepared",
    blurb:
      "Built from the sources below and tidied so they open cleanly in a spreadsheet: one row per observation, column names you can read, and the source named in the file. Start here unless you specifically need the raw output.",
  },
  {
    kind: "original" as const,
    title: "Original files, exactly as published",
    blurb:
      "Saved and served unaltered, down to the publisher's own column names — NOMIS uses DATE_NAME, GEOGRAPHY_NAME and OBS_VALUE. Nothing has been renamed, reordered, rounded or filtered. Use these to check my working.",
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
          title="Download Scotland poverty data"
          lede="This is the proof behind the simple pages. Nine CSVs and one Excel workbook, all free. Four I prepared and tidied so they open cleanly in a spreadsheet; the other six are the publishers' own files, served exactly as they came, so you can check my working against them."
        />

        <ContentFrame>
          {GROUPS.map((group) => (
            <section key={group.kind} className="pt-10 first:pt-6">
              <h2 className="h2 mb-3">{group.title}</h2>
              <p className="max-w-[68ch] text-[16.5px] leading-[1.6] text-[var(--ink-2)]">
                {group.blurb}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {FILES.filter((f) => f.kind === group.kind).map((f) => (
                  <a
                    key={f.file}
                    href={`/data/${f.file}`}
                    download
                    className="group block rounded-[var(--r-s)] border border-[var(--rule)] bg-[var(--surface)] p-5 no-underline transition-colors hover:border-[var(--brand)]"
                  >
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <h3 className="text-[16.5px] font-[680] leading-[1.3] transition-colors group-hover:text-[var(--brand)]">
                        {f.title}
                      </h3>
                      <span
                        className={`ui shrink-0 rounded-[var(--r-pill)] border px-2.5 py-1 text-[13px] font-[750] ${
                          f.format === "CSV"
                            ? "border-[var(--brand)] text-[var(--brand)]"
                            : "border-[var(--good-text)] text-[var(--good-text)]"
                        }`}
                      >
                        {f.format}
                      </span>
                    </div>

                    <p className="mb-3 text-[15px] leading-[1.55] text-[var(--ink-2)]">{f.body}</p>

                    {f.columns && (
                      <p className="mb-3 rounded-[var(--r-s)] bg-[var(--surface-2)] px-3 py-2 text-[14px] leading-[1.5] text-[var(--muted)]">
                        <span className="ui font-[700]">Columns:</span> {f.columns}
                      </p>
                    )}

                    <p className="ui tnum text-[14.5px] text-[var(--muted)]">
                      {f.size}
                      {f.rows ? ` · ${f.rows}` : ""} · {f.file}
                    </p>
                    <p className="ui mt-1.5 text-[15px] font-[650] text-[var(--brand)]">
                      Download <span aria-hidden="true">↓</span>
                    </p>
                  </a>
                ))}
              </div>
            </section>
          ))}

        <Col className="pt-12">
          <h2 className="h2 mb-4">Can I reuse it?</h2>
          <p>
            Yes. The original data belongs to ONS, DWP, the Scottish Government, End Child Poverty
            and Loughborough University. Their licence rules still apply to the original files.
          </p>
          <p>
            My cleaned files, charts and words are free to reuse if you credit {site.name}. You do
            not need permission. Journalists and researchers can ask for a different file format.
          </p>
          <p>
            Any calculation I made is explained on the <Link href="/methods">how I counted it page</Link>.
          </p>
        </Col>

        <CTA
          title="If a number does not match, tell me"
          body="People can make mistakes when copying or cleaning data. I check reported errors, fix confirmed mistakes and keep a public record."
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
