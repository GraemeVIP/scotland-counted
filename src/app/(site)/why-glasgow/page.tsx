import Link from "next/link";
import {
  Page,
  Col,
  Split,
  Note,
  Slab,
  SectionHead,
  PageHeader,
  InShort,
  CTA,
  Reveal,
} from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { getIndicator, jobsDensity } from "@/lib/data/indicators";
import { getCouncil } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Glasgow deep dive — why the city is different",
  description:
    "Glasgow has more jobs than working-age adults, yet the highest child poverty in Scotland. Four evidenced reasons: a policy-made historical inheritance, a commuter economy, a concentration of exposed households, and housing costs.",
  path: "/why-glasgow",
});

function SourceStrip({ ids }: { ids: string[] }) {
  return (
    <section className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
      <p className="label mb-6">Where this comes from</p>
      <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {getSources(ids).map((s) => (
          <div key={s.id} className="text-[14.5px] text-[var(--ink-2)] leading-[1.55]">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
            >
              {s.title}
            </a>
            <p className="ui text-[12.5px] text-[var(--muted)] mt-1.5 mb-1.5">
              {s.publisher}
            </p>
            {s.used}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function WhyGlasgow() {
  const pay = getIndicator("pay")!;
  const er = getCouncil("east-renfrewshire")!;
  const ed = getCouncil("east-dunbartonshire")!;
  const n = pay.x.length - 1;
  const gap = (pay.series[0].data[n] - pay.series[1].data[n]).toFixed(2);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Glasgow deep dive", path: "/why-glasgow" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Glasgow deep dive — why the city is different",
          description: metadata.description as string,
          path: "/why-glasgow",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="The founding deep dive · Four reasons"
          title="Why Glasgow is different"
          lede="Scotland Counted covers every council area. Glasgow is the founding and most detailed case study because its evidence poses a hard question: the city is full of jobs, yet its child-poverty rate is Scotland's highest and rose fastest."
          stat={{
            value: jobsDensity.glasgow.toFixed(2),
            label: `Jobs in Glasgow for every working-age adult living here (${jobsDensity.year}). Scotland: ${jobsDensity.scotland}`,
            tone: "neutral",
          }}
        />

        <InShort>
          <p>Glasgow is poorer than other places for clear reasons — not bad luck.</p>
          <p>Big decisions made long ago left the city with deep problems. Today Glasgow is full of jobs, but the best-paid ones mostly go to people who live outside it.</p>
          <p>
            And rent takes a bigger share of a family&apos;s money here than almost anywhere in
            Scotland.
          </p>
        </InShort>

        {/* ---------- 1 ---------- */}
        <section className="pt-4">
          <SectionHead
            n={1}
            eyebrow="Reason one"
            title="The damage was done deliberately, decades ago"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Deaths above Liverpool and Manchester" value="+15%">
                    Across all ages, after adjusting for deprivation. For people under 65 the gap
                    is about 30%.
                  </Note>
                  <Note label="Factory jobs lost, 1971–1983" value="45%">
                    The same collapse hit the English cities. The outcome here was worse.
                  </Note>
                </div>
              }
            >
              <p>
                Here is the striking thing. Even when you compare Glasgow with places that are just
                as poor, Glasgow does worse. Set against Liverpool and Manchester — matched for
                deprivation — deaths in Glasgow run about <strong>15% higher</strong> across all
                ages, and about <strong>30% higher</strong> for people under 65.
              </p>
              <p>
                Researchers spent years on why, and the answer is not culture, weather or diet. It
                is decisions:
              </p>
              <ul>
                <li>
                  Glasgow was overcrowded far longer and far worse than comparable cities, and the
                  damage from that carried down the generations.
                </li>
                <li>
                  Post-war planning moved younger, skilled workers and their families out to the{" "}
                  <G t="newtowns">New Towns</G>. The people left behind were older, sicker and
                  poorer. Liverpool and Manchester were not hollowed out the same way.
                </li>
                <li>
                  Slum clearance replaced tenements with big, isolated estates on the city&apos;s
                  edge, cut off from work and services.
                </li>
                <li>
                  When the 1980s recession hit, Glasgow&apos;s council responded differently — and
                  less protectively — than councils in the English cities.
                </li>
              </ul>
              <p>
                None of that is the fault of anyone currently in office. But it is the hand they
                were dealt, and it explains why the same national policy does more damage here.
              </p>
            </Split>
          </div>
        </section>
      </Page>

      {/* ---------- 2 ---------- */}
      <Slab attribution="ONS jobs density and Annual Survey of Hours and Earnings, 2021 and 2025">
        There are more jobs in Glasgow than there are adults in Glasgow. Glaswegians are not the
        ones in them.
      </Slab>

      <Page>
        <section>
          <SectionHead
            n={2}
            eyebrow="Reason two"
            title="A commuter economy that exports its wages"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label={`Weekly pay leaving the city, ${pay.x[n]}`} value={`£${gap}`}>
                    The difference between what jobs in Glasgow pay and what Glaswegians earn.
                  </Note>
                  <Note label="Scotland's two lowest child poverty rates">
                    <strong className="text-[var(--ink)]">{er.name}</strong> at {er.pcts[9]}% and{" "}
                    <strong className="text-[var(--ink)]">{ed.name}</strong> at {ed.pcts[9]}%. Both
                    border Glasgow.
                  </Note>
                </div>
              }
            >
              <p>
                Glasgow is not short of work. In {jobsDensity.year} there were{" "}
                <strong>
                  {jobsDensity.glasgow} jobs inside the city for every working-age person living in
                  it
                </strong>{" "}
                — against {jobsDensity.scotland} for Scotland as a whole.
              </p>
              <p>
                But look at who gets paid what. In {pay.x[n]}, the typical full-time job{" "}
                <em>based in</em> Glasgow paid{" "}
                <strong>£{pay.series[0].data[n].toFixed(2)} a week</strong> — better than the
                Scottish average of £{pay.series[2].data[n].toFixed(2)}. The typical full-time
                worker <em>living in</em> Glasgow took home{" "}
                <strong>£{pay.series[1].data[n].toFixed(2)}</strong> — worse than the Scottish
                average.
              </p>
              <p>
                The city hosts the region&apos;s well-paid work and sends the wages home to the
                suburbs. So when Glasgow&apos;s employment rate rose after 2013, residents were
                mostly moving into the bottom half of that labour market, not the top. That is why{" "}
                <Link href="/indicators/work">the employment chart</Link> and{" "}
                <Link href="/indicators/child-poverty">the child poverty chart</Link> point in
                opposite directions.
              </p>
            </Split>

            <div className="mt-10">
              <Figure
                n={2}
                title="The jobs in Glasgow pay more than Glaswegians earn"
                sub={pay.chartSub}
                legend={pay.series.map((s) => ({ name: s.name, colorVar: s.colorVar }))}
                caption={pay.caption}
                technical={pay.technical}
                table={
                  <DataTable
                    head={["Year", "Jobs in Glasgow", "Glasgow residents", "Gap", "Scotland"]}
                    rows={pay.x.map((y, i) => [
                      y,
                      `£${pay.series[0].data[i].toFixed(2)}`,
                      `£${pay.series[1].data[i].toFixed(2)}`,
                      `£${(pay.series[0].data[i] - pay.series[1].data[i]).toFixed(2)}`,
                      `£${pay.series[2].data[i].toFixed(2)}`,
                    ])}
                  />
                }
              >
                <LineChart
                  x={pay.x}
                  series={pay.series}
                  yMin={pay.yMin}
                  yMax={pay.yMax}
                  yTicks={pay.yTicks}
                  unit="£"
                  decimals={0}
                  extra={{
                    label: "Gap",
                    values: pay.x.map(
                      (_, i) => `£${(pay.series[0].data[i] - pay.series[1].data[i]).toFixed(1)}`
                    ),
                  }}
                  ariaLabel="Median weekly pay for jobs based in Glasgow stays above pay for people living in Glasgow throughout 2008 to 2025, and Glasgow residents earn below the Scottish median."
                />
              </Figure>
            </div>
          </div>
        </section>

        {/* ---------- 3 ---------- */}
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={3}
            eyebrow="Reason three"
            title="The families hit hardest are concentrated here"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Children in poverty with a disabled household member" value="Over half">
                    The single largest priority group in Scotland.
                  </Note>
                  <Note label="Scotland's dispersed asylum seekers housed in Glasgow" value="~95%">
                    Around 4,000–4,500 people, barred from working and unable to claim benefits.
                  </Note>
                </div>
              }
            >
              <p>
                Poverty in Scotland is not spread evenly. It clusters in particular households:
                those with a disabled member, single-parent families, larger families, and families
                from minority ethnic backgrounds.
              </p>
              <p>
                Glasgow has more of every single one of those than the Scottish average. So a
                UK-wide benefit cut aimed at any of those groups lands harder here than anywhere
                else in Scotland.{" "}
                <strong>
                  It is not that Glasgow is treated differently — it is that being treated the same
                  hurts more.
                </strong>
              </p>
              <p>
                The city is also the destination for almost all of Scotland&apos;s dispersed asylum
                seekers, placed here by a government department that does not pay for the
                consequences.
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- 4 ---------- */}
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={4}
            eyebrow="Reason four"
            title="Rent, which is why the numbers moved at all"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Spent on temporary accommodation" value="£4.5m">
                    Every month, on hotels and B&amp;Bs — the most expensive possible way to house
                    people badly.
                  </Note>
                  <Note label="Unfunded homelessness gap by 2027/28" value="£73m">
                    Up from £27m in 2024/25. The council expects to be breaching homelessness law
                    into the early 2030s.
                  </Note>
                </div>
              }
            >
              <p>
                Every child poverty figure on this site is counted{" "}
                <G t="ahc">after housing costs</G>. Glasgow&apos;s rents rose faster than the help
                available to pay them, because{" "}
                <G t="lha">housing benefit for private renters</G> has been frozen for most of the
                past decade.
              </p>
              <p>
                The council declared a <strong>housing emergency in November 2023</strong>. It is
                now carrying a shortfall it cannot close on its own, in the one policy area that
                moves the headline measure most directly.
              </p>
            </Split>
          </div>
        </section>

        <SourceStrip ids={["gcph", "scotpho", "ashe", "jobs-density", "housing", "migration", "ug"]} />
      </Page>

      <CTA
        title="Knowing why is only useful if it changes what gets done"
        body="The causes are settled. The remedies are costed. What is missing is anyone being made to choose between them."
        href="/what-would-fix-it"
        cta="What would fix it"
        secondaryHref="/accountability"
        secondaryCta="Who decided this"
      />

      <Page>
        <Reveal>
          <Col className="mt-14">
            <p className="text-[15px] text-[var(--ink-2)]">
              Every claim on this page is drawn from a named published source. If you think one of
              them is wrong, <Link href="/corrections">tell us and we will correct it publicly</Link>.
            </p>
          </Col>
        </Reveal>
      </Page>
    </>
  );
}
