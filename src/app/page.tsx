import Link from "next/link";
import {
  Page,
  Col,
  Split,
  Note,
  Slab,
  StatStrip,
  CTA,
  Card,
  SectionHead,
  Reveal,
  FullBleed,
} from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  getIndicator,
  headlineStats,
  povertyLine,
  jobsDensity,
  GLASGOW_CHILD_COUNTS,
} from "@/lib/data/indicators";
import { councilsByLevel } from "@/lib/data/councils";
import { site } from "../../site.config";

export const metadata = meta({
  title: "Poverty in Glasgow, counted properly",
  description:
    "More than one in three Glasgow children lives in poverty — the steepest rise of any Scottish council area. An independent, fully sourced record of what changed since 2000, why, and who decided it.",
  path: "/",
  type: "website",
});

const FAQ = [
  {
    q: "How many children live in poverty in Glasgow?",
    a: "39,319 children — 36.1% of all children in the city — were living in relative poverty after housing costs in 2023/24. That is more than one in three, and up from 27.1% in 2014/15.",
  },
  {
    q: "Is child poverty in Glasgow getting better or worse?",
    a: "Worse. Glasgow's child poverty rate rose by 9.0 percentage points between 2014/15 and 2023/24, the largest increase of any of Scotland's 32 council areas. Over the same period the Scottish rate rose by 1.7 points.",
  },
  {
    q: "Why is poverty worse in Glasgow than elsewhere in Scotland?",
    a: "Four reasons: a historical inheritance created by post-war policy decisions; a commuter economy in which the city's better-paid jobs are largely held by people who live outside it; a concentration of the household types most exposed to benefit cuts; and housing costs that rose faster than the support available to meet them.",
  },
  {
    q: "What would actually reduce child poverty in Glasgow?",
    a: "Independent modelling by the Joseph Rowntree Foundation, IPPR Scotland and the Fraser of Allander Institute agrees that income transfers do the heavy lifting and employment programmes do not. Scrapping the two-child limit, expanding the Scottish Child Payment, restoring housing benefit to real local rents and building enough housing are the measures with costed, evidenced effects.",
  },
];

export default function Home() {
  const cp = getIndicator("child-poverty")!;
  const worst = councilsByLevel().slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Poverty in Glasgow has not fallen. It has changed shape.",
          description: metadata.description as string,
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      {/* ================= HERO ================= */}
      <FullBleed className="border-b border-[var(--rule)]">
        <div className="bg-[var(--ground-2)] relative overflow-hidden">
          <div
            className="absolute inset-y-0 right-0 w-1/2 tick-rail opacity-40 pointer-events-none hidden lg:block"
            aria-hidden="true"
          />
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-16 pb-14 sm:pt-24 sm:pb-20 relative">
            <Reveal>
              <p className="eyebrow mb-8">
                Glasgow City · 2000&ndash;2026 · Independent and fully sourced
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="h1 max-w-[13ch] mb-10">
                Poverty in Glasgow has not fallen. It changed shape.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <p className="lede max-w-[52ch]">
                  Far more Glaswegians are in work than in 2000, and far fewer live in the
                  country&apos;s worst-off neighbourhoods. Both are real gains. Over the same years
                  the share of the city&apos;s children growing up poor rose by nine percentage
                  points &mdash; the steepest rise of any council area in Scotland.
                </p>

                <div className="lg:border-l lg:border-[var(--rule-strong)] lg:pl-14 shrink-0">
                  <div className="figure-num text-[clamp(84px,13vw,168px)] text-[var(--bad)]">
                    36.1%
                  </div>
                  <p className="text-[16px] leading-[1.5] text-[var(--ink-2)] max-w-[30ch] mt-5">
                    of Glasgow&apos;s children were living in poverty in 2023/24, counted after the
                    rent is paid. That is{" "}
                    <strong className="text-[var(--ink)] font-[600]">39,319 children</strong>.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </FullBleed>

      <Page>
        <StatStrip stats={headlineStats} />

        {/* ================= PRIMER ================= */}
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={1}
            eyebrow="Start here"
            title="What &ldquo;poverty&rdquo; means on this site"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-3">
                  {povertyLine.rows.map((r) => (
                    <div
                      key={r.amount}
                      className="border border-[var(--rule)] bg-[var(--surface)] px-5 py-4"
                    >
                      <div className="text-[14px] text-[var(--ink-2)] leading-[1.45]">{r.who}</div>
                      <div className="figure-num text-[30px] mt-2">{r.amount}</div>
                    </div>
                  ))}
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-[var(--muted)] mt-1">
                    Poverty line, {povertyLine.year}, after housing costs
                  </p>
                </div>
              }
            >
              <p>
                A household counts as poor if its income is less than 60% of what a typical UK
                household has &mdash; and we count that <G t="ahc">after housing costs</G>, meaning
                after the rent or mortgage is paid. What is left is what a family actually has for
                food, heating, shoes and bus fares.
              </p>
              <p>
                Counting after rent matters enormously in Glasgow, because rents here have risen
                faster than the help available to pay them.
              </p>
              <p className="text-[16px] text-[var(--ink-2)]">
                Anything <G t="pp">underlined like this</G> can be tapped for a plain explanation,
                plus the technical detail if you want it. Every chart has the raw numbers
                underneath, and <Link href="/methods">every figure is sourced</Link>.
              </p>
            </Split>
          </div>
        </section>

        {/* ================= THE CHART ================= */}
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={2}
            eyebrow="The measure that moved"
            title="Glasgow climbed while Scotland held steady"
            direction="worsening"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="The gap with Scotland" value="5.5 → 12.8">
                  Percentage points between Glasgow and the Scottish rate. It more than doubled in
                  nine years.
                </Note>
              }
            >
              <p>
                Scotland held steady largely because of the <G t="scp">Scottish Child Payment</G>,
                which does not exist in England. Cities south of the border rose faster still.
              </p>
            </Split>

            <div className="mt-10">
              <Figure
                n={1}
                title={cp.chartTitle}
                sub={cp.chartSub}
                legend={cp.series.map((s) => ({ name: s.name, colorVar: s.colorVar }))}
                caption={cp.caption}
                technical={cp.technical}
                table={
                  <DataTable
                    head={["Year", "Glasgow %", "Glasgow children", "Scotland %", "Gap (pp)"]}
                    rows={cp.x.map((y, i) => [
                      y,
                      cp.series[0].data[i].toFixed(1),
                      GLASGOW_CHILD_COUNTS[i].toLocaleString("en-GB"),
                      cp.series[1].data[i].toFixed(1),
                      `+${(cp.series[0].data[i] - cp.series[1].data[i]).toFixed(1)}`,
                    ])}
                  />
                }
              >
                <LineChart
                  x={cp.x}
                  series={cp.series}
                  yMin={cp.yMin}
                  yMax={cp.yMax}
                  yTicks={cp.yTicks}
                  unit="%"
                  decimals={1}
                  gapBand
                  extra={{
                    label: "Glasgow children",
                    values: GLASGOW_CHILD_COUNTS.map((v) => v.toLocaleString("en-GB")),
                  }}
                  ariaLabel="Glasgow child poverty rises from 27.1% in 2014/15 to 36.1% in 2023/24, while Scotland moves from 21.6% to 23.3%."
                />
              </Figure>
            </div>
          </div>
        </section>
      </Page>

      {/* ================= THE ARGUMENT ================= */}
      <Slab attribution="Across Scotland, 69% of children in poverty live in a working household">
        In 2000 the problem was that there wasn&apos;t enough work. In 2026 the problem is that
        work doesn&apos;t reliably keep you out of poverty.
      </Slab>

      <Page>
        <Col>
          <p>
            Two of the measures on this site improved. One improved and then stalled. One got much
            worse. That is not a contradiction &mdash; it is the answer.
          </p>
          <p>
            The clearest proof is in the chart above. In 2020/21, benefits went up and child
            poverty fell. In 2021/22, the support was withdrawn and it went straight back up.
            Nothing about Glasgow&apos;s history explains a two-year swing like that.{" "}
            <strong>Policy does &mdash; in both directions.</strong>
          </p>
        </Col>

        {/* ================= SIGNPOSTS ================= */}
        <section className="pt-20 sm:pt-28">
          <SectionHead n={3} eyebrow="Six measures, four causes, one record" title="Start anywhere" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {[
              {
                href: "/the-numbers",
                eyebrow: "Six measures",
                title: "The numbers",
                body: "Child poverty, work, benefits, pay, neighbourhoods and life expectancy — charted from 2000, with the data behind each one.",
              },
              {
                href: "/why-glasgow",
                eyebrow: "The causes",
                title: "Why Glasgow",
                body: `There are ${jobsDensity.glasgow} jobs in Glasgow for every working-age adult who lives here. So why is the city poor? Four reasons, evidenced.`,
              },
              {
                href: "/what-would-fix-it",
                eyebrow: "The evidence",
                title: "What would fix it",
                body: "Seven costed policies, what each would achieve, what each costs, and exactly where each one currently stands.",
              },
              {
                href: "/accountability",
                eyebrow: "The record",
                title: "Who decided this",
                body: "Three layers of government, the decisions each made, and the measured consequences. Sourced, and cross-party.",
              },
              {
                href: "/areas",
                eyebrow: "All 32 councils",
                title: "Your area",
                body: `Every Scottish council area, ranked. ${worst[0].name} is worst at ${worst[0].pcts[9]}%, followed by ${worst[1].name} and ${worst[2].name}.`,
              },
              {
                href: "/take-action",
                eyebrow: "Two minutes",
                title: "Take action",
                body: "Write to your MSP or MP with the figures for your own area filled in automatically, and a specific question they have to answer.",
              },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 40}>
                <Card {...c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="pt-20 sm:pt-28">
          <SectionHead n={4} eyebrow="Questions" title="What people ask first" />
          <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2 mt-10">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t-2 border-[var(--ink)] pt-5">
                <h3 className="h3 mb-3 max-w-[32ch]">{f.q}</h3>
                <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[56ch]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </Page>

      <CTA
        title="These figures are only useful if someone has to answer for them"
        body="Every chart here is public data that already existed — it was just spread across a dozen government portals in formats nobody reads. Now it is in one place, in plain English. Use it."
        href="/take-action"
        cta="Write to your representative"
        secondaryHref="/data"
        secondaryCta="Download the data"
      />

      <Page>
        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--muted)]">
          {site.name} — a personal project by {site.author.name} at {site.organisation.name}. No
          party affiliation, no funding, no paywall.
        </p>
      </Page>
    </>
  );
}
