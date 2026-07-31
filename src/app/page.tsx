import Link from "next/link";
import { Page, Col, StatStrip, Callout, CTA, SectionHead } from "@/components/Blocks";
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

      <Page>
        {/* ---------- Hero ---------- */}
        <header className="pt-12 sm:pt-20 pb-9 border-b-2 border-[var(--ink)]">
          <p className="eyebrow mb-5">
            Glasgow City · 2000–2026 · Independent and fully sourced
          </p>
          <h1 className="h1 max-w-[16ch] mb-6">
            Poverty in Glasgow has not fallen. It has changed shape.
          </h1>
          <p className="lede max-w-[60ch]">
            Since 2000 far more Glaswegians have got into work, and far fewer live in the
            country&apos;s worst-off neighbourhoods. Both are real gains. But over the same years
            the share of the city&apos;s children growing up poor{" "}
            <strong className="text-[var(--ink)] font-[600]">
              rose by nine percentage points
            </strong>{" "}
            — the biggest rise of any council area in Scotland.
          </p>
        </header>

        {/* ---------- Hero number ---------- */}
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3 py-9 border-b border-[var(--rule)]">
          <div className="text-[clamp(62px,12vw,104px)] leading-[0.86] font-[660] tracking-[-0.045em] text-[var(--glasgow)]">
            36.1%
          </div>
          <div className="max-w-[42ch]">
            <p className="text-[18px] font-[560] mb-1.5">
              of Glasgow&apos;s children were living in poverty in 2023/24, counted after the rent
              is paid.
            </p>
            <p className="text-[16px] text-[var(--ink-2)] leading-[1.5]">
              That is 39,319 children — more than one in three. Ten years earlier it was 29,527,
              or 27.1%. Across Scotland the figure barely moved, from 21.6% to 23.3%.
            </p>
          </div>
        </div>

        <StatStrip stats={headlineStats} />

        {/* ---------- Plain-English primer ---------- */}
        <section
          className="border border-[var(--rule)] border-t-[3px] border-t-[var(--glasgow)] bg-[var(--surface)] rounded-b-[3px] p-6 sm:p-8 mt-9"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <h2 className="text-[21px] font-[640] tracking-[-0.02em] mb-3">
            What &ldquo;poverty&rdquo; means on this site
          </h2>
          <div className="prose">
            <p>
              A household counts as poor if its income is less than 60% of what a typical UK
              household has — and we count that <G t="ahc">after housing costs</G>, meaning after
              the rent or mortgage is paid. What is left is what a family actually has for food,
              heating, shoes and bus fares.
            </p>
            <p>In cash, in {povertyLine.year}, the line sat roughly here:</p>
          </div>

          <div className="grid gap-3.5 my-5 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
            {povertyLine.rows.map((r) => (
              <div key={r.amount} className="bg-[var(--surface-2)] rounded-[3px] px-4 py-3.5">
                <div className="text-[14px] text-[var(--ink-2)] leading-[1.4]">{r.who}</div>
                <div className="text-[22px] font-[640] tracking-[-0.02em] mt-1.5">{r.amount}</div>
              </div>
            ))}
          </div>

          <div className="prose">
            <p>
              Below that, you are counted as being in poverty. Counting after rent matters
              enormously in Glasgow, because rents here have risen faster than the help available
              to pay them.
            </p>
            <p className="text-[15px] text-[var(--ink-2)]">
              Anything <G t="pp">underlined like this</G> can be tapped for a plain explanation,
              plus the technical detail if you want it. Every chart has a data table with the raw
              numbers, and <Link href="/methods">every figure is sourced</Link>.
            </p>
          </div>
        </section>

        {/* ---------- The headline chart ---------- */}
        <section className="pt-14">
          <SectionHead title="The number that moved" direction="worsening" />
          <Col>
            <p>
              In 2014/15, Glasgow was 5.5 <G t="pp">percentage points</G> worse than Scotland as a
              whole. By 2023/24 the difference had more than doubled, to 12.8 points. Glasgow
              climbed; Scotland roughly held steady.
            </p>
            <p>
              Scotland held steady largely because of the <G t="scp">Scottish Child Payment</G>,
              which does not exist in England. Cities south of the border rose faster still.
            </p>
          </Col>

          <div className="mt-6">
            <Figure
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
        </section>

        {/* ---------- The pivot ---------- */}
        <section className="pt-14">
          <SectionHead title="What actually changed" />
          <Col>
            <p>
              Two measures improved. One improved and then stalled. One got much worse. That is
              not a contradiction — it is the answer.
            </p>
          </Col>

          <Callout>
            <p>
              <strong>
                In 2000, Glasgow&apos;s problem was that there wasn&apos;t enough work. In 2026,
                the problem is that work doesn&apos;t reliably keep you out of poverty.
              </strong>
            </p>
            <p>
              Across Scotland, 69% of children in poverty now live in a household where at least
              one adult has a job. Getting people into work — which moved every other number on
              this site — has stopped being enough on its own.
            </p>
          </Callout>

          <Col>
            <p>
              The clearest proof is in the chart above. In 2020/21, benefits went up and child
              poverty fell. In 2021/22, the support was withdrawn and it went straight back up.
              Nothing about Glasgow&apos;s history explains a two-year swing like that.{" "}
              <strong>Policy does — in both directions.</strong>
            </p>
          </Col>
        </section>

        {/* ---------- Signpost cards ---------- */}
        <section className="pt-14">
          <h2 className="h2 mb-6">Start anywhere</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                eyebrow: "Do something",
                title: "Take action",
                body: "Write to your MSP or MP in two minutes, with the figures for your own area filled in automatically.",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group block bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-5 hover:border-[var(--glasgow)] transition-colors"
                style={{ boxShadow: "var(--shadow)" }}
              >
                <p className="eyebrow mb-2.5">{c.eyebrow}</p>
                <p className="text-[19px] font-[620] tracking-[-0.012em] mb-2 group-hover:text-[var(--glasgow)] transition-colors">
                  {c.title}
                </p>
                <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.5]">{c.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <CTA
          title="These figures are only useful if someone has to answer for them"
          body="Every chart here is public data that already existed — it was just spread across a dozen government portals in formats nobody reads. Now it is in one place, in plain English. Use it."
          href="/take-action"
          cta="Write to your representative"
          secondaryHref="/data"
          secondaryCta="Download the data"
        />

        {/* ---------- FAQ, also feeds structured data ---------- */}
        <section className="pt-16">
          <h2 className="h2 mb-6">Common questions</h2>
          <div className="grid gap-4 lg:grid-cols-2 max-w-[1000px]">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t border-[var(--rule)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-14 mb-4 font-mono text-[11.5px] text-[var(--muted)]">
          {site.name} is a personal project by {site.author.name} at {site.organisation.name}. No
          party affiliation, no funding, no paywall.
        </p>
      </Page>
    </>
  );
}
