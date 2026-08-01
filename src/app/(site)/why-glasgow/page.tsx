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
import DecadeScroll from "../DecadeScroll";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { getIndicator, jobsDensity } from "@/lib/data/indicators";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Why poverty is worse in Glasgow",
  description:
    "Glasgow has Scotland's worst child-poverty rate. Four clear reasons explain why: past decisions, work that can still leave people short, which families are hit hardest and rent.",
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
          <p>Decisions made long ago left lasting damage. Today the city is full of jobs, but a job can still mean low pay, too few hours or an insecure rota.</p>
          <p>
            Benefit cuts hit Glasgow harder because more of the families most affected live here.
            High rent then leaves less money for everything else.
          </p>
        </InShort>
      </Page>

      <DecadeScroll />

      <Page>
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
      <Slab attribution="ONS jobs density; UK minimum-wage rates; JRF / Loughborough minimum-income research">
        Glasgow has more jobs than working-age adults. A job can still leave a family without enough to live on.
      </Slab>

      <Page>
        <section>
          <SectionHead
            n={2}
            eyebrow="Reason two"
            title="There are plenty of jobs. Pay and hours can still leave people short."
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Adult legal minimum now" value="£12.71 an hour">
                    At 37.5 paid hours every week, that is about £24,785 a year before tax — not
                    £41,000. Fewer or changing hours mean less.
                  </Note>
                  <Note label="Single adult, full-time legal minimum" value="76%">
                    That was how much of a basic, decent living standard the pay covered in 2025.
                    For a lone parent with children aged 3 and 7 it covered 69%.
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
                More jobs does not automatically mean enough money. The legal minimum for someone
                aged 21 or over is £12.71 an hour. At 37.5 paid hours a week for a full year, that
                is <strong>£24,784.50 before tax</strong>. Many people get fewer hours, changing
                shifts or unpaid gaps and receive less.
              </p>
              <p>
                Minimum Income Standard research found that in 2025 a single adult working full
                time at the legal minimum reached only 76% of what the public agreed was needed
                for a basic, decent life. A lone parent with children aged 3 and 7 reached only
                69%. That
                helps explain why{" "}
                <Link href="/indicators/work">the employment chart</Link> and{" "}
                <Link href="/indicators/child-poverty">the child poverty chart</Link> point in
                opposite directions.
              </p>
              <p>
                The pay chart below is narrower. Its £796.50 figure is for a selected sample of
                full-time PAYE employee jobs based in Glasgow in one April 2025 pay period. It is
                not the average Glasgow wage, and it excludes part-time jobs, self-employment and
                other workers. The two lines describe separate groups, so their £51 difference
                does not prove that £51 of wages leaves the city.
              </p>
            </Split>

            <div className="mt-10">
              <Figure
                n={2}
                title={pay.chartTitle}
                sub={pay.chartSub}
                legend={pay.series.map((s) => ({ name: s.name, colorVar: s.colorVar }))}
                caption={pay.caption}
                technical={pay.technical}
                table={
                  <DataTable
                    head={["Year", "Selected jobs in Glasgow", "Selected jobs held by Glasgow residents", "Selected jobs held by Scottish residents"]}
                    rows={pay.x.map((y, i) => [
                      y,
                      `£${pay.series[0].data[i].toFixed(2)}`,
                      `£${pay.series[1].data[i].toFixed(2)}`,
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
                  ariaLabel="Restricted median gross weekly pay estimates for selected full-time PAYE employee jobs based in Glasgow, held by Glasgow residents and held by Scottish residents, 2008 to 2025."
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

        <SourceStrip ids={["gcph", "scotpho", "minimum-wage-2026", "mis-2025", "ashe", "ashe-guide", "jobs-density", "housing", "migration", "ug"]} />
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
