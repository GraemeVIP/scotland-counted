import Link from "next/link";
import { Page, Col, PageHeader, CTA, Callout } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { getIndicator, jobsDensity } from "@/lib/data/indicators";
import { getCouncil } from "@/lib/data/councils";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Why Glasgow and not somewhere else",
  description:
    "Glasgow has more jobs than working-age adults, yet the highest child poverty in Scotland. Four evidenced reasons: a policy-made historical inheritance, a commuter economy, a concentration of exposed households, and housing costs.",
  path: "/why-glasgow",
});

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
          { name: "Why Glasgow", path: "/why-glasgow" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Why Glasgow and not somewhere else",
          description: metadata.description as string,
          path: "/why-glasgow",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="The causes"
          title="Why Glasgow and not somewhere else"
          lede="Dundee is poorer on some measures. Inverclyde and North Ayrshire lost their industries too. Neither has Glasgow's rate, and neither has its direction of travel. Four things set the city apart."
        />

        {/* ---------- 1 ---------- */}
        <section className="pt-12">
          <p className="eyebrow mb-3">Reason one</p>
          <h2 className="h2 mb-5 max-w-[22ch]">
            The damage was done deliberately, decades ago
          </h2>
          <Col>
            <p>
              Here is the striking thing. Even when you compare Glasgow with places that are just
              as poor, Glasgow does worse. Set against Liverpool and Manchester — matched for
              deprivation — deaths in Glasgow run about <strong>15% higher</strong> across all
              ages, and about <strong>30% higher</strong> for people under 65. Same poverty, same
              collapse of industry (Glasgow lost 45% of its factory jobs between 1971 and 1983),
              worse outcome.
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
          </Col>
        </section>

        {/* ---------- 2 ---------- */}
        <section className="pt-14">
          <p className="eyebrow mb-3">Reason two</p>
          <h2 className="h2 mb-5 max-w-[24ch]">
            The city is full of good jobs. Glaswegians aren&apos;t the ones in them.
          </h2>
          <Col>
            <p>This is the part that gets missed, and the numbers are blunt about it.</p>
            <p>
              Glasgow is not short of work. In {jobsDensity.year} there were{" "}
              <strong>
                {jobsDensity.glasgow} jobs inside the city for every working-age person living in
                it
              </strong>{" "}
              — against {jobsDensity.scotland} for Scotland as a whole. There are more jobs in
              Glasgow than there are adults in Glasgow.
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
          </Col>

          <Callout>
            <p>
              <strong>
                The city hosts the region&apos;s well-paid work and sends £{gap} a week home to
                the suburbs.
              </strong>
            </p>
            <p>
              And it shows: the two council areas with the <em>lowest</em> child poverty in
              Scotland — {er.name} at {er.pcts[9]}% and {ed.name} at {ed.pcts[9]}% — sit right on
              Glasgow&apos;s boundary and supply a lot of the people filling its better jobs.
            </p>
          </Callout>

          <Col>
            <p>
              So when Glasgow&apos;s employment rate rose after 2013, residents were mostly moving
              into the bottom half of that labour market, not the top. That is why{" "}
              <Link href="/indicators/work">the employment chart</Link> and{" "}
              <Link href="/indicators/child-poverty">the child poverty chart</Link> point in
              opposite directions.
            </p>
          </Col>

          <div className="mt-7">
            <Figure
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
        </section>

        {/* ---------- 3 ---------- */}
        <section className="pt-14">
          <p className="eyebrow mb-3">Reason three</p>
          <h2 className="h2 mb-5 max-w-[24ch]">The families hit hardest are concentrated here</h2>
          <Col>
            <p>
              Poverty in Scotland is not spread evenly. It clusters in particular households:
              those with a disabled member (over half of all children in poverty), single-parent
              families, larger families, and families from minority ethnic backgrounds.
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
              Glasgow also takes roughly 95% of Scotland&apos;s dispersed asylum seekers, around
              4,000 to 4,500 people, who are barred from working and cannot claim benefits. They
              were placed here by a government department that does not pay for the consequences.
            </p>
          </Col>
        </section>

        {/* ---------- 4 ---------- */}
        <section className="pt-14">
          <p className="eyebrow mb-3">Reason four</p>
          <h2 className="h2 mb-5 max-w-[24ch]">Rent, which is why the numbers moved at all</h2>
          <Col>
            <p>
              Every child poverty figure on this site is counted{" "}
              <G t="ahc">after housing costs</G>. Glasgow&apos;s rents rose faster than the help
              available to pay them, because <G t="lha">housing benefit for private renters</G>{" "}
              has been frozen for most of the past decade.
            </p>
            <p>
              The council declared a <strong>housing emergency in November 2023</strong> and
              spends about <strong>£4.5 million a month</strong> putting homeless households in
              hotels and B&amp;Bs. The shortfall between what that costs and what it is funded
              runs £27m in 2024/25, rising to £73m by 2027/28. On the council&apos;s own
              projections, it will be breaking homelessness law until the early 2030s.
            </p>
          </Col>
        </section>

        <section className="mt-14 pt-6 border-t border-[var(--rule)]">
          <p className="eyebrow mb-4">Where this comes from</p>
          <ul className="space-y-4 max-w-[74ch]">
            {getSources(["gcph", "scotpho", "ashe", "jobs-density", "housing", "migration", "ug"]).map(
              (s) => (
                <li key={s.id} className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
                  <a
                    href={s.url}
                    className="text-[var(--ink)] underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
                  >
                    {s.title}
                  </a>
                  <span className="text-[var(--muted)]"> — {s.publisher}</span>
                  <br />
                  {s.used}
                </li>
              )
            )}
          </ul>
        </section>

        <CTA
          title="Knowing why is only useful if it changes what gets done"
          body="The causes are settled. The remedies are costed. What is missing is anyone being made to choose between them."
          href="/what-would-fix-it"
          cta="What would fix it"
          secondaryHref="/accountability"
          secondaryCta="Who decided this"
        />
      </Page>
    </>
  );
}
