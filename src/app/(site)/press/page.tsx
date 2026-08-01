import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import CopyLine from "./CopyLine";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { indicators } from "@/lib/data/indicators";
import { site } from "@/lib/site";

export const metadata = meta({
  title: "Press and reuse",
  description:
    "Scotland-wide local poverty pages, downloadable chart images, sourced stat lines, live embeds and reuse terms. Everything needed to cite Scotland Counted in one place.",
  path: "/press",
});

/** Pre-written lines a journalist can lift, each carrying its source. */
const STAT_LINES = [
  "Around 940,000 people — 17% of Scotland's population — were living in relative poverty after housing costs in 2022–25 (Scottish Government).",
  "Three quarters of children in relative poverty in Scotland live in a household where at least one person is in paid work (Scottish Government, 2022–25).",
  "36.1% of Glasgow's children — 39,319 children — were living in relative poverty after housing costs in 2023/24, the highest rate of any Scottish council area (End Child Poverty / Loughborough University).",
  "Child poverty in Glasgow rose 9.0 percentage points between 2014/15 and 2023/24 — the steepest rise of Scotland's 32 council areas, more than double the next steepest (End Child Poverty / Loughborough University).",
  "A single adult working full time at the legal minimum reached only 76% of the UK's Minimum Income Standard in 2025; a lone parent with children aged 3 and 7 reached 69% (Joseph Rowntree Foundation / Loughborough University).",
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
          title="Cite Scotland in one minute"
          lede="Every council and constituency has a permanent local evidence page. Charts and lines are free to reuse with attribution, derivations are documented, and corrections are logged in public."
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

        <section className="pt-16">
          <h2 className="h2 mb-3">A local link for every Scottish story</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[65ch]">
            Link readers to the place in the story, not a generic homepage. Each local page carries
            its own share control, source trail and direct route to the representatives who can act.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 max-w-[860px]">
            <Link
              href="/areas"
              className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-colors"
            >
              <span className="label">32 permanent council pages</span>
              <strong className="block text-[20px] mt-3">Poverty, work and pay by area</strong>
              <span className="ui block text-[15px] text-[var(--brand)] font-[650] mt-4">
                Find a council page →
              </span>
            </Link>
            <Link
              href="/constituencies"
              className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-colors"
            >
              <span className="label">57 permanent constituency pages</span>
              <strong className="block text-[20px] mt-3">Child poverty by MP seat</strong>
              <span className="ui block text-[15px] text-[var(--brand)] font-[650] mt-4">
                Find a constituency page →
              </span>
            </Link>
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
                download={`scotland-counted-${i.slug}.png`}
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
                <span className="ui flex items-center justify-between text-[15px] font-[620] px-2 pt-2.5 pb-1 text-[var(--ink-2)] group-hover:text-[var(--brand)] transition-colors">
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
              <code className="datum text-[15px] bg-[var(--paper-2)] px-1.5 py-0.5">
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
              text={`${site.name} (${site.url.replace("https://", "")}) is an independent evidence-to-action project covering poverty, work and living standards across all 32 Scottish council areas and all 57 Scottish Westminster constituencies, with Glasgow as its detailed historical case study. Built from ONS, DWP, Scottish Government and academic data, it finds a reader's MP and MSP and prepares addressed emails without storing the postcode. It is a personal project by ${site.author.name} of ${site.organisation.name}, with no party affiliation or funding.`}
            />
          </div>
        </section>

        {/* ---------- Terms ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-4">Reuse terms</h2>
          <Col>
            <p>
              Charts, stat lines and analysis: free for any use with attribution to {site.name}.
              The underlying data belongs to its original publishers, almost all under
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
