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
  title: "Why poverty is worse in Glasgow",
  description:
    "Glasgow has Scotland's worst child-poverty rate. Four clear reasons explain why: past decisions, who gets the better-paid jobs, which families are hit hardest and rent.",
  path: "/why-glasgow",
});

function SourceStrip({ ids }: { ids: string[] }) {
  return (
    <section className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
      <p className="label mb-6">Where this comes from</p>
      <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {getSources(ids).map((s) => (
          <div key={s.id} className="text-[15px] text-[var(--ink-2)] leading-[1.55]">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
            >
              {s.title}
            </a>
            <p className="ui text-[15px] text-[var(--muted)] mt-1.5 mb-1.5">
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
          eyebrow="Glasgow · Four clear reasons"
          title="Why poverty is worse in Glasgow"
          lede="More than 1 in 3 Glasgow children are growing up in poverty. That is the worst rate in Scotland, and it rose faster here than anywhere else. Glasgow keeps its own detailed record so those facts are never watered down."
          stat={{
            value: jobsDensity.glasgow.toFixed(2),
            label: `jobs in Glasgow for every working-age adult living here. There are more jobs than adults. Scotland: ${jobsDensity.scotland}.`,
            tone: "neutral",
          }}
        />

        <InShort>
          <p><strong>Glasgow&apos;s figures are not bad luck, and they are not the fault of ordinary Glaswegians.</strong></p>
          <p>Decisions made long ago left lasting damage. Today the city is full of jobs, but many of the better-paid workers live outside Glasgow.</p>
          <p>
            Benefit cuts hit Glasgow harder because more of the families most affected live here.
            High rent then leaves less money for everything else.
          </p>
        </InShort>

        {/* ---------- 1 ---------- */}
        <section className="pt-4">
          <SectionHead
            n={1}
            eyebrow="Reason one"
            title="Past decisions did lasting damage"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="More deaths than similar UK cities" value="15% more">
                    This is after comparing Glasgow with Liverpool and Manchester and allowing for
                    how poor each city is. For people under 65, it is about 30% more.
                  </Note>
                  <Note label="Factory jobs lost from 1971 to 1983" value="Almost half">
                    Liverpool and Manchester lost many jobs too, but the lasting harm was worse in Glasgow.
                  </Note>
                </div>
              }
            >
              <p>
                Glasgow does worse even when it is compared with cities that are just as poor.
                There are about <strong>15% more deaths</strong> than in Liverpool and Manchester,
                rising to about <strong>30% more</strong> among people under 65.
              </p>
              <p>
                Researchers spent years asking why. The answer is not Glaswegian culture, weather
                or diet. It is what happened to the city:
              </p>
              <ul>
                <li>
                  Glasgow stayed badly overcrowded for longer than similar cities. The harm was
                  passed down through families.
                </li>
                <li>
                  After the war, plans moved many younger workers and families to the{" "}
                  <G t="newtowns">New Towns</G>. The people left in Glasgow were more likely to be
                  older, ill or poor.
                </li>
                <li>
                  Tenements were replaced by large housing estates far from jobs and services.
                </li>
                <li>
                  When factory jobs disappeared in the 1980s, Glasgow&apos;s response protected people
                  less than the response in the English cities.
                </li>
              </ul>
              <p>
                People in Glasgow today did not cause this. But the damage helps explain why the
                same cut can hurt Glasgow more than another place.
              </p>
            </Split>
          </div>
        </section>
      </Page>

      {/* ---------- 2 ---------- */}
      <Slab attribution="ONS jobs density and Annual Survey of Hours and Earnings, 2021 and 2025">
        Glasgow has more jobs than working-age adults. Too many of the better-paid workers live elsewhere.
      </Slab>

      <Page>
        <section>
          <SectionHead
            n={2}
            eyebrow="Reason two"
            title="Glasgow has jobs. Local people miss out on too many of the better-paid ones."
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label={`Weekly pay gap, ${pay.x[n]}`} value={`£${gap}`}>
                    This is the gap between what a typical job in Glasgow pays and what a typical
                    full-time worker living in Glasgow earns.
                  </Note>
                  <Note label="Two of Scotland's lowest child-poverty rates">
                    <strong className="text-[var(--ink)]">{er.name}</strong> at {er.pcts[9]}% and{" "}
                    <strong className="text-[var(--ink)]">{ed.name}</strong> at {ed.pcts[9]}%. Both
                    border Glasgow.
                  </Note>
                </div>
              }
            >
              <p>
                Glasgow is not short of jobs. In {jobsDensity.year} there were{" "}
                <strong>
                  {jobsDensity.glasgow} jobs inside the city for every working-age person living in
                  it
                </strong>{" "}
                — against {jobsDensity.scotland} for Scotland as a whole.
              </p>
              <p>
                The problem is who gets the better-paid work. In {pay.x[n]}, a typical full-time
                job <em>based in</em> Glasgow paid{" "}
                <strong>£{pay.series[0].data[n].toFixed(2)} a week</strong> — better than the
                Scottish average of £{pay.series[2].data[n].toFixed(2)}. The typical full-time
                worker <em>living in</em> Glasgow took home{" "}
                <strong>£{pay.series[1].data[n].toFixed(2)}</strong> — worse than the Scottish
                average.
              </p>
              <p>
                Many better wages leave the city every payday. More Glaswegians found work after
                2013, but too many of those jobs were lower-paid. That is why{" "}
                <Link href="/indicators/work">the employment chart</Link> and{" "}
                <Link href="/indicators/child-poverty">the child poverty chart</Link> point in
                opposite directions.
              </p>
            </Split>

            <div className="mt-10">
              <Figure
                n={2}
                title="The jobs in Glasgow pay more than Glaswegians earn"
                sub={`Typical full-time weekly pay before tax · ${pay.x[0]} to ${pay.x[n]}`}
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
            title="Cuts hit Glasgow families harder"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Poor children living with a disabled family member" value="More than half">
                    This is the largest group of children at special risk of poverty in Scotland.
                  </Note>
                  <Note label="Asylum seekers sent to Glasgow" value="About 95%">
                    Almost all people sent to Scotland through the UK asylum scheme are housed in
                    Glasgow. Most cannot work or claim normal benefits.
                  </Note>
                </div>
              }
            >
              <p>
                Some families are much more likely to be poor: families with a disabled person,
                single parents, larger families and some minority ethnic families.
              </p>
              <p>
                Glasgow has more of these families than the Scottish average. So a UK-wide benefit
                cut can hurt more people here.{" "}
                <strong>
                  The rule may be the same everywhere, but the harm is not.
                </strong>
              </p>
              <p>
                Glasgow also houses almost all asylum seekers sent to Scotland through the UK
                scheme. The UK department that sends people here does not cover all the costs for
                the city.
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- 4 ---------- */}
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={4}
            eyebrow="Reason four"
            title="Rent leaves families with too little"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Spent on hotels and B&Bs" value="£4.5m a month">
                    Temporary rooms cost a huge amount and still give families a poor place to live.
                  </Note>
                  <Note label="Homelessness funding missing by 2027/28" value="£73m">
                    The gap was £27m in 2024/25. The council expects it will keep breaking its legal
                    duty to house people into the early 2030s.
                  </Note>
                </div>
              }
            >
              <p>
                The figures look at money left <G t="ahc">after rent or mortgage</G>. Glasgow rents
                rose faster than the <G t="lha">help private renters can get</G>. Families have to
                fill the gap using money meant for food, heating and everything else.
              </p>
              <p>
                Glasgow declared a <strong>housing emergency in November 2023</strong>. The council
                says it does not have enough money to meet its legal duty to house people. Because
                poverty is counted after rent, housing has a direct effect on the figure.
              </p>
            </Split>
          </div>
        </section>

        <SourceStrip ids={["gcph", "scotpho", "ashe", "jobs-density", "housing", "migration", "ug"]} />
      </Page>

      <CTA
        title="The reasons are clear. Now ask what will change."
        body="See the practical changes experts say would help, then enter your postcode and email the people who can make them happen."
        href="/what-would-fix-it"
        cta="See what would help"
        secondaryHref="/accountability"
        secondaryCta="See who decides"
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
