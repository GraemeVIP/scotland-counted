import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import CopyLine from "./CopyLine";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { indicators } from "@/lib/data/indicators";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Press and reuse",
  description:
    "Charts as downloadable images, pre-written sourced stat lines, embeddable live charts and the reuse terms. Everything a journalist, researcher or campaigner needs to cite Glasgow Counted in one place.",
  path: "/press",
});

/** Pre-written lines a journalist can lift, each carrying its source. */
const STAT_LINES = [
  "36.1% of Glasgow's children — 39,319 children — were living in relative poverty after housing costs in 2023/24, the highest rate of any Scottish council area (End Child Poverty / Loughborough University).",
  "Child poverty in Glasgow rose 9.0 percentage points between 2014/15 and 2023/24 — the steepest rise of Scotland's 32 council areas, more than double the next steepest (End Child Poverty / Loughborough University).",
  "Glasgow has more jobs than working-age adults — 1.08 jobs per resident aged 16–64 in 2021 — yet the median full-time worker living in the city earns £51 a week less than the median job located in it pays (ONS, jobs density and ASHE 2025).",
  "All four of Scotland's legally binding interim child poverty targets for 2023/24 were missed, including persistent poverty at 23% against a target of 8% (Scottish Government progress report, 2024–25).",
  "Glasgow East has the highest constituency child poverty rate in Scotland at 34.9%; six of the seven worst Scottish seats are in Glasgow (End Child Poverty / Loughborough University, 2023/24).",
  "In 2020/21 — the one year benefits were raised — child poverty in Glasgow fell, from 32.2% to 29.4%. When the £20 uplift was withdrawn it rose straight back (End Child Poverty / Loughborough University).",
];

export default function Press() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Press", path: "/press" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="For journalists, researchers and campaigners"
          title="Cite us in one minute"
          lede="Everything here is free to reuse with attribution. The numbers come from official published data, the derivations are documented, and corrections are logged in public — so citing this site is safe."
        />

        {/* ---------- Stat lines ---------- */}
        <section className="pt-4">
          <h2 className="h2 mb-3">Lines you can lift</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[62ch]">
            Pre-written, each with its source attached. Copy, paste, done.
          </p>
          <div className="grid gap-3 max-w-[860px]">
            {STAT_LINES.map((t) => (
              <CopyLine key={t.slice(0, 40)} text={t} />
            ))}
          </div>
        </section>

        {/* ---------- Chart images ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-3">Charts as images</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[62ch]">
            1200×630 PNG cards, drawn from the same data as the live charts. Right-click and save,
            or link directly.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {indicators.map((i) => (
              <a
                key={i.slug}
                href={`/press-img/${i.slug}`}
                download={`glasgow-counted-${i.slug}.png`}
                className="group block rounded-[var(--r-m)] overflow-hidden border border-[var(--rule)] bg-[var(--surface)] p-3 hover:border-[var(--brand)] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/press-img/${i.slug}`}
                  alt={`${i.chartTitle} — downloadable chart`}
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="ui flex items-center justify-between text-[13px] font-[620] px-2 pt-2.5 pb-1 text-[var(--ink-2)] group-hover:text-[var(--brand)] transition-colors">
                  {i.chartTitle}
                  <span aria-hidden="true">↓ PNG</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- Live embeds ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-3">Live embeds</h2>
          <Col>
            <p>
              Every indicator chart can be embedded with an iframe and stays current as the data
              updates. The embed button sits under each chart on{" "}
              <Link href="/the-numbers">the indicator pages</Link>, or point an iframe at{" "}
              <code className="datum text-[14px] bg-[var(--paper-2)] px-1.5 py-0.5">
                {site.url}/embed/child-poverty
              </code>{" "}
              and swap the final segment for any indicator.
            </p>
          </Col>
        </section>

        {/* ---------- Boilerplate ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-3">About, in one paragraph</h2>
          <div className="max-w-[860px]">
            <CopyLine
              text={`Glasgow Counted (${site.url.replace("https://", "")}) is an independent, fully sourced record of poverty in Glasgow since 2000, built from ONS, DWP, Scottish Government and academic data. It is a personal project by ${site.author.name} of ${site.organisation.name}, with no party affiliation or funding. Every figure links to its original publisher and corrections are logged publicly.`}
            />
          </div>
        </section>

        {/* ---------- Terms ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-4">Reuse terms</h2>
          <Col>
            <p>
              Charts, stat lines and analysis: free for any use with attribution to Glasgow
              Counted. The underlying data belongs to its original publishers, almost all under
              the Open Government Licence — <Link href="/methods">sources here</Link>,{" "}
              <Link href="/data">raw files here</Link>.
            </p>
            <p>
              Interviews, data requests or a series in a different shape:{" "}
              <Link href="/contact?reason=press">the contact form</Link>. If you are on a deadline,
              say so in the first line — those get read first.
            </p>
          </Col>
        </section>

        <CTA
          title="Something here wrong? That outranks everything"
          body="A public correction beats a citation. If a figure does not match its source, report it and it will be fixed and logged the same day."
          href="/corrections"
          cta="Report an error"
          secondaryHref="/methods"
          secondaryCta="Methods and sources"
        />
      </Page>
    </>
  );
}
