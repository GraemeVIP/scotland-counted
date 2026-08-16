import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, CTA } from "@/components/Blocks";
import CopyLine from "./CopyLine";
import PressPackPicker from "./PressPackPicker";
import { pressPackFor, pressPackCouncils } from "@/lib/pressPack";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { indicators } from "@/lib/data/indicators";
import { site } from "@/lib/site";
import Image from "next/image";
import { infographic } from "@/lib/data/infographic";
import { CRISIS_GRANT_CSV_URL, CRISIS_GRANT_SOURCE_URL } from "@/lib/data/crisisGrants";
import {
  CITATION,
  COUNCIL_DATA_FILE,
  COUNCIL_SOURCES,
  nationalCouncilLines,
  supersededNotes,
  worstInScotlandLines,
} from "@/lib/pressLines";

export const metadata = meta({
  title: "Scotland Poverty Data for Journalists and Reuse",
  description:
    "Download sourced Scotland poverty figures, charts and press assets, with clear citation guidance, methodology and contact details for questions or corrections.",
  path: "/press",
});

/** Pre-written lines a journalist can lift, each carrying its source. */
const STAT_LINES = [
  "Around 940,000 people, 17% of Scotland's population, were living in relative poverty after housing costs in 2022–25 (Scottish Government).",
  "Three quarters of children in relative poverty in Scotland live in a household where at least one person is in paid work (Scottish Government, 2022–25).",
  "36.1% of Glasgow's children, 39,319 children, were living in relative poverty after housing costs in 2023/24, the highest rate of any Scottish council area (End Child Poverty / Loughborough University).",
  "Child poverty in Glasgow rose 9.0 percentage points between 2014/15 and 2023/24, the steepest rise of Scotland's 32 council areas, more than double the next steepest (End Child Poverty / Loughborough University).",
  "A single adult working full time at the legal minimum reached only 76% of the UK's Minimum Income Standard in 2025; a lone parent with children aged 3 and 7 reached 69% (Joseph Rowntree Foundation / Loughborough University).",
  "All four of Scotland's legally binding interim child poverty targets for 2023/24 were missed, including persistent poverty at 23% against a target of 8% (Scottish Government progress report, 2024–25).",
  "Glasgow East has the highest constituency child poverty rate in Scotland at 34.9%; six of the seven worst Scottish seats are in Glasgow (End Child Poverty / Loughborough University, 2023/24).",
  "In 2020/21, the one year benefits were raised, child poverty in Glasgow fell from 32.2% to 29.4%. When the £20 uplift was withdrawn it rose straight back (End Child Poverty / Loughborough University).",
  "In 2025/26, 89% of decided Crisis Grant applications in Inverclyde resulted in an award, compared with 52% in Midlothian: a 37-percentage-point gap within the same national scheme (Scottish Government).",
  "The Crisis Grant gap between Inverclyde and Midlothian persisted across all five years from 2021/22 to 2025/26: Inverclyde's published rate stayed between 77% and 89%, while Midlothian's stayed between 49% and 57% (Scottish Government).",
];

export default function Press() {
  /*
   * Built here, on the server, so the client gets 32 short packs of text
   * instead of the datasets needed to write them.
   */
  const packs = pressPackCouncils()
    .map((c) => pressPackFor(c.slug))
    .filter((p): p is NonNullable<typeof p> => p !== null);

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
          title="Scotland poverty data for journalists"
          lede="Every council and constituency has a permanent local evidence page. Charts and lines are free to reuse with attribution, derivations are documented, and corrections are logged in public."
        />

        <ContentFrame>
          {/* ---------- Stat lines ---------- */}
          <section className="pt-4">
          <h2 className="h2 mb-3">Lines you can lift</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[62ch]">
            Pre-written, each with its source attached. Copy, paste, done.
          </p>
          <div className="grid gap-3">
            {STAT_LINES.map((t) => (
              <CopyLine key={t.slice(0, 40)} text={t} />
            ))}
          </div>
        </section>

        {/* ---------- Councils ----------
            Added after the accountability work: the council section is the
            part with a story attached to a specific newsroom's patch, so it
            gets its own lines, its own spreadsheet and a citation a reporter
            can paste without emailing first. */}
        <section id="councils" className="scroll-mt-24 pt-16">
          <h2 className="h2 mb-3">Councils: worst in Scotland</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[65ch]">
            One line for each measure every Scottish council reports the same way, naming the
            council at the bottom of it. Like-for-like, so the comparison holds up.
          </p>
          <div className="grid gap-3">
            {worstInScotlandLines().map((t) => (
              <CopyLine key={t.slice(0, 40)} text={t} />
            ))}
          </div>

          {/* Say what is deliberately absent. A journalist who spots the gap
              should find the reason here rather than assume it was missed. */}
          {supersededNotes().length > 0 && (
            <div className="mt-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-5">
              <p className="ui text-[15px] font-[680] mb-2">Held back on purpose</p>
              <ul className="grid gap-2">
                {supersededNotes().map((note) => (
                  <li key={note.measure} className="text-[15.5px] leading-[1.6] text-[var(--ink-2)]">
                    <strong className="text-[var(--ink)]">{note.measure}</strong> is on the council
                    pages but not in the lines above. A newer official series has overtaken it:{" "}
                    {note.newer}. Use that for anything you publish.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="h3 mt-12 mb-3">Councils: the national picture</h3>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[65ch]">
            The 2026/27 budget round, including the part that answers the obvious question about
            why the gap appears every year.
          </p>
          <div className="grid gap-3">
            {nationalCouncilLines().map((t) => (
              <CopyLine key={t.slice(0, 40)} text={t} />
            ))}
          </div>

          <div className="mt-12 rounded-[var(--r-m)] border border-[var(--rule)] border-l-4 border-l-[var(--action)] bg-[var(--surface-2)] p-6 sm:p-7">
            <p className="label mb-2">New investigation · 2025/26</p>
            <h3 className="h3">The 37-point Crisis Grant postcode gap</h3>
            <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
              The disparity involves thousands of decisions and persists across five years. The
              figures show different outcomes, not their cause, so the reporting pack includes the
              questions councils need to answer and every methodological caveat.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/blog/crisis-grant-acceptance-rates-scotland-councils" className="btn btn-primary">
                Read and share the investigation <span aria-hidden="true">→</span>
              </Link>
              <a href={CRISIS_GRANT_CSV_URL} download className="btn btn-secondary">
                Download all 32 councils <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="ui mt-4 text-[15px] leading-[1.55] text-[var(--muted)]">
              Primary source: <a href={CRISIS_GRANT_SOURCE_URL}>Scottish Government, Scottish Welfare Fund statistics to 31 March 2026</a>.
            </p>
          </div>

          {/*
            A finished package for any of the 32, built from the same data the
            council pages render. Every claim carries its source, every ranking
            claim is one the data supports, and the caveats travel with the
            figures rather than sitting somewhere a busy reporter will not look.
          */}
          <div className="mt-14">
            <h3 className="h3 mb-2">Or take a whole pack for one council</h3>
            <p className="mb-5 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--ink-2)]">
              Headline, figures, sources, notes to editors and the citation. Generated from the
              data, so it is never out of step with the record it points at.
            </p>
            <PressPackPicker packs={packs} />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <a
              href={COUNCIL_DATA_FILE}
              download
              className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 no-underline transition-colors hover:border-[var(--brand)]"
            >
              <span className="label">CSV · 32 councils plus Scotland</span>
              <strong className="block text-[20px] mt-3">The whole comparison as a spreadsheet</strong>
              <span className="block text-[15px] leading-[1.55] text-[var(--ink-2)] mt-2">
                Seven measures, a rank for each, and the extra money every council said it needed
                for 2026/27.
              </span>
              <span className="ui block text-[15px] text-[var(--brand)] font-[650] mt-4">
                Download the CSV →
              </span>
            </a>
            <Link
              href="/councils"
              className="rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--brand)]"
            >
              <span className="label">32 permanent council records</span>
              <strong className="block text-[20px] mt-3">Budgets, audits and broken promises</strong>
              <span className="block text-[15px] leading-[1.55] text-[var(--ink-2)] mt-2">
                Every figure on every page links to the official document it came from.
              </span>
              <span className="ui block text-[15px] text-[var(--brand)] font-[650] mt-4">
                Find a council →
              </span>
            </Link>
          </div>

          <div className="mt-8 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface-2)] p-6">
            <p className="ui text-[15px] font-[680] mb-3">How to credit it</p>
            <CopyLine text={CITATION} />
            <p className="text-[15px] leading-[1.6] text-[var(--ink-2)] mt-4 max-w-[62ch]">
              That is all that is needed. The underlying figures belong to the{" "}
              <a href={COUNCIL_SOURCES[0]} target="_blank" rel="noopener noreferrer">
                Improvement Service
              </a>{" "}
              and{" "}
              <a href={COUNCIL_SOURCES[1]} target="_blank" rel="noopener noreferrer">
                Audit Scotland
              </a>
              , and citing them directly is welcome too, every council page links to the exact
              document behind each number.
            </p>
          </div>
        </section>

        <section className="pt-16">
          <h2 className="h2 mb-3">A local link for every Scottish story</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[65ch]">
            Link readers to the place in the story, not a generic homepage. Each local page carries
            its own share control, source trail and direct route to the representatives who can act.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
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

        {/* ---------- The summary graphic ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-3">The one-page summary</h2>
          <p className="text-[15.5px] text-[var(--ink-2)] mb-7 max-w-[62ch]">
            Portrait, made for a phone screen and for social posts. Free to reuse with credit.
          </p>
          <a
            href={infographic.src}
            download={infographic.downloadName}
            className="group flex flex-wrap items-center gap-6 rounded-[var(--r-m)] border border-[var(--rule)] bg-[var(--surface)] p-4 no-underline transition-colors hover:border-[var(--brand)] sm:flex-nowrap"
          >
            <Image
              src={infographic.src}
              alt={infographic.alt}
              width={infographic.width}
              height={infographic.height}
              sizes="150px"
              className="h-auto w-[110px] shrink-0 rounded-[var(--r-s)] border border-[var(--rule)] sm:w-[150px]"
            />
            <span className="min-w-0">
              <span className="ui block text-[17px] font-[720] transition-colors group-hover:text-[var(--brand)]">
                {infographic.title}
              </span>
              <span className="ui mt-1.5 block text-[15px] text-[var(--muted)] tnum">
                WebP · {infographic.width}×{infographic.height} · 148 KB
              </span>
              <span className="mt-3 block max-w-[52ch] text-[15.5px] leading-[1.55] text-[var(--ink-2)]">
                Poverty rates for all people, children, working-age adults and pensioners, the
                working-poverty figure, and Glasgow&apos;s ten-year rise.
              </span>
              <span className="ui mt-3 block text-[15px] font-[650] text-[var(--brand)]">
                ↓ Download
              </span>
            </span>
          </a>
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
                  alt={`${i.chartTitle}, downloadable chart`}
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
              The four Glasgow time-series charts can be embedded with an iframe and stay current
              as the data updates. The embed button sits under each supported chart on the{" "}
              <Link href="/glasgow-poverty-statistics">indicator pages</Link>. For example, point an iframe at{" "}
              <code className="datum text-[15px] bg-[var(--paper-2)] px-1.5 py-0.5">
                {site.url}/embed/glasgow-child-poverty
              </code>.
            </p>
          </Col>
        </section>

        {/* ---------- Boilerplate ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-3">About, in one paragraph</h2>
          <div>
            <CopyLine
              text={`${site.name} (${site.url.replace("https://", "")}) is an independent evidence-to-action service covering poverty, work and living standards across all 32 Scottish council areas and all 57 Scottish Westminster constituencies, with Glasgow as its detailed historical case study. Built from ONS, DWP, Scottish Government and academic data, it finds a reader's MP and MSP and prepares addressed emails without storing the postcode. It is written and published by ${site.author.name} of ${site.organisation.name}, with no party affiliation or funding.`}
            />
          </div>
        </section>

        {/* ---------- Terms ---------- */}
        <section id="reuse-terms" className="scroll-mt-24 pt-16">
          <h2 className="h2 mb-4">Reuse terms</h2>
          <Col>
            <p>
              Charts, stat lines and analysis: free for any use with attribution to {site.name}.
              The underlying data belongs to its original publishers, almost all under
              the Open Government Licence, <Link href="/methods">sources here</Link>,{" "}
              <Link href="/data">raw files here</Link>.
            </p>
            <p>
              Interviews, data requests or a series in a different shape:{" "}
              <Link href="/contact?reason=press">the contact form</Link>. If you are on a deadline,
              say so in the first line, those get read first.
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
        </ContentFrame>
      </Page>
    </>
  );
}
