import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Col, PageHeader, DirectionChip, CTA, InShort } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import {
  indicators,
  lifeExpectancy,
  deprivation,
  getIndicator,
  GLASGOW_CHILD_COUNTS,
} from "@/lib/data/indicators";
import { getSources } from "@/lib/data/sources";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";

export function generateStaticParams() {
  return [
    ...indicators.map((i) => ({ slug: i.slug })),
    { slug: lifeExpectancy.slug },
    { slug: deprivation.slug },
  ];
}

type Meta = { title: string; summary: string; sourceIds: string[] };

/** The plain-English opening for each measure — short sentences, no jargon. */
const IN_SHORT: Record<string, string[]> = {
  "child-poverty": [
    "More than 1 in 3 children in Glasgow are growing up poor. That is 39,319 children.",
    "Ten years ago it was about 1 in 4. Things are getting worse, not better.",
  ],
  work: [
    "Far more people in Glasgow have a job now than 20 years ago. That part is good news.",
    "But for many families, a job is no longer a way out of poverty.",
  ],
  benefits: [
    "Fewer people claim out-of-work benefits than in 2000.",
    "The number jumped in the pandemic, then came back down.",
  ],
  pay: [
    "Glasgow is full of good jobs. But most of the best-paid ones go to people who live outside the city.",
    "Money made in Glasgow leaves Glasgow every payday.",
  ],
  "life-expectancy": [
    "People in Glasgow live shorter lives than anywhere else in Scotland.",
    "Lives were getting longer until about 2012. Then it stopped.",
  ],
  neighbourhoods: [
    "Fewer Glasgow neighbourhoods are among Scotland's poorest than in 2004. That is real progress.",
    "But nearly half the city still lives in Scotland's poorest fifth.",
  ],
};

/** The single figure each page leads with, pinned beside the headline. */
const HEADER_STAT: Record<
  string,
  { value: string; label: string; tone: "bad" | "good" | "neutral" }
> = {
  "child-poverty": {
    value: "36.1%",
    label: "of Glasgow's children in poverty in 2023/24, after housing costs",
    tone: "bad",
  },
  work: {
    value: "71.2%",
    label: "of working-age Glaswegians in work in 2023 — up from 62.7% in 2004",
    tone: "good",
  },
  benefits: {
    value: "4.5%",
    label: "claiming out-of-work benefits in January 2026 — down from 6.0% in 2000",
    tone: "good",
  },
  pay: {
    value: "£51",
    label: "a week — the gap between what jobs in Glasgow pay and what Glaswegians take home (2025)",
    tone: "bad",
  },
  "life-expectancy": {
    value: "73.6",
    label: "years — male life expectancy at birth, the lowest of Scotland's 32 council areas",
    tone: "bad",
  },
  neighbourhoods: {
    value: "29%",
    label: "of Glaswegians in Scotland's worst-off tenth of neighbourhoods — down from 46% in 2004",
    tone: "good",
  },
};

function lookup(slug: string): Meta | null {
  const i = getIndicator(slug);
  if (i) return { title: i.title, summary: i.summary, sourceIds: i.sourceIds };
  if (slug === lifeExpectancy.slug) return lifeExpectancy;
  if (slug === deprivation.slug) return deprivation;
  return null;
}

export async function generateMetadata(props: PageProps<"/indicators/[slug]">) {
  const { slug } = await props.params;
  const m = lookup(slug);
  if (!m) return {};
  return meta({ title: m.title, description: m.summary, path: `/indicators/${slug}` });
}

function SourceList({ ids }: { ids: string[] }) {
  const list = getSources(ids);
  if (!list.length) return null;
  return (
    <section className="mt-12 pt-6 border-t border-[var(--rule)]">
      <p className="label mb-4">Where this comes from</p>
      <ul className="space-y-4 max-w-[74ch]">
        {list.map((s) => (
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
            {s.derivation && (
              <>
                {" "}
                <span className="text-[var(--muted)]">{s.derivation}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function IndicatorPage(props: PageProps<"/indicators/[slug]">) {
  const { slug } = await props.params;
  const m = lookup(slug);
  if (!m) notFound();

  const crumbs = (
    <JsonLd
      data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "The numbers", path: "/the-numbers" },
        { name: m.title, path: `/indicators/${slug}` },
      ])}
    />
  );
  const article = (
    <JsonLd
      data={articleJsonLd({
        headline: m.title,
        description: m.summary,
        path: `/indicators/${slug}`,
      })}
    />
  );

  /* ---------- Life expectancy: two panels ---------- */
  if (slug === lifeExpectancy.slug) {
    const le = lifeExpectancy;
    const n = le.x.length - 1;
    return (
      <>
        {crumbs}
        {article}
        <Page>
          <PageHeader eyebrow="Life expectancy" title={le.title} lede={le.summary} stat={HEADER_STAT[slug]}>
            <div className="mt-5">
              <DirectionChip direction={le.direction} />
            </div>
          </PageHeader>

          <InShort>
            {IN_SHORT[slug].map((t) => (
              <p key={t}>{t}</p>
            ))}
          </InShort>

          <Col className="pt-9">
            <p>
              Between 2001 and 2012, Glasgow men gained more than four years of life. Then it
              stopped. Since 2012 the line is flat for men and slightly falling for women — the
              same stall seen across Scotland, arriving alongside a decade of cuts to working-age
              benefits.
            </p>
            <p>
              A boy born in Glasgow in 2017–19 could expect {le.glaM[n]} years. That is the lowest
              of Scotland&apos;s 32 council areas: {(le.scoM[n] - le.glaM[n]).toFixed(1)} years
              below the Scottish average, and 6.9 years behind East Dunbartonshire, ten miles up
              the road.
            </p>
          </Col>

          <div className="grid gap-4 lg:grid-cols-2 mt-7">
            {[
              { title: "Men", gla: le.glaM, sco: le.scoM },
              { title: "Women", gla: le.glaF, sco: le.scoF },
            ].map((p) => (
              <Figure
                key={p.title}
                n={p.title === "Men" ? 1 : 2}
                title={`${p.title} — life expectancy at birth`}
                sub="Years · 2001–03 to 2017–19 · ONS"
                legend={[
                  { name: "Glasgow", colorVar: "--glasgow" },
                  { name: "Scotland", colorVar: "--scotland" },
                ]}
                caption={`Glasgow is ${(p.sco[n] - p.gla[n]).toFixed(1)} years behind the Scottish average at the end of the series. Both panels use the same scale so the two gaps can be compared directly.`}
              >
                <LineChart
                  x={le.x}
                  series={[
                    { name: "Glasgow", colorVar: "--glasgow", data: p.gla },
                    { name: "Scotland", colorVar: "--scotland", data: p.sco },
                  ]}
                  yMin={68}
                  yMax={82}
                  yTicks={[68, 70, 72, 74, 76, 78, 80, 82]}
                  unit=""
                  decimals={1}
                  ariaLabel={`${p.title}: life expectancy at birth in Glasgow compared with Scotland, 2001-03 to 2017-19.`}
                />
              </Figure>
            ))}
          </div>

          <Figure
            className="mt-4"
            n={3}
            title="All four series"
            sub="Life expectancy at birth, years"
            table={
              <DataTable
                head={["Period", "Glasgow men", "Scotland men", "Glasgow women", "Scotland women"]}
                rows={le.x.map((y, i) => [
                  y,
                  le.glaM[i].toFixed(1),
                  le.scoM[i].toFixed(1),
                  le.glaF[i].toFixed(1),
                  le.scoF[i].toFixed(1),
                ])}
              />
            }
            technical={[
              "This is life expectancy at birth, averaged over three years at a time to smooth out random variation. It is not a prediction about any individual — it describes death rates in the population over those years, applied to a hypothetical newborn.",
              "More recent ONS releases put Glasgow male life expectancy at 74.3 years for 2022–24, still the lowest or second-lowest in Great Britain. That release uses a different vintage of population estimates, so it is quoted here rather than spliced onto the chart.",
            ]}
          >
            <p className="text-[15px] text-[var(--ink-2)] py-2">
              Open the data table for every figure in both panels.
            </p>
          </Figure>

          <SourceList ids={le.sourceIds} />
          <CTA
            title="This is what poverty costs, measured in years"
            body="Life expectancy is the slowest indicator to move and the hardest to argue with. It is also the one that shows the 2012 stall most clearly."
            href="/what-would-fix-it"
            cta="What would change it"
            secondaryHref="/the-numbers"
            secondaryCta="All six measures"
          />
        </Page>
      </>
    );
  }

  /* ---------- Neighbourhood deprivation: then and now ---------- */
  if (slug === deprivation.slug) {
    const d = deprivation;
    return (
      <>
        {crumbs}
        {article}
        <Page>
          <PageHeader eyebrow="Neighbourhoods" title={d.title} lede={d.summary} stat={HEADER_STAT[slug]}>
            <div className="mt-5">
              <DirectionChip direction={d.direction} />
            </div>
          </PageHeader>

          <InShort>
            {IN_SHORT[slug].map((t) => (
              <p key={t}>{t}</p>
            ))}
          </InShort>

          <Col className="pt-9">
            <p>
              Scotland ranks every small neighbourhood in the country from worst-off to best-off.
              In 2004, 46% of Glaswegians lived in the worst-off tenth. By 2020 that was down to
              29% — about 185,000 people. That is a genuine improvement, and a big one.
            </p>
            <p>
              But read it carefully. This is a <em>league table</em>, not a headcount. Glasgow can
              move up it because Glasgow got better, or because other places got worse, or both.
              And even after the improvement, {d.stillIn20pct.pct}% of the city —{" "}
              {d.stillIn20pct.people.toLocaleString("en-GB")} people — still live in
              Scotland&apos;s worst-off fifth.
            </p>
          </Col>

          <Figure
            className="mt-7"
            n={1}
            title="Share of Glaswegians in Scotland's worst-off 10% of neighbourhoods"
            sub="2004 compared with 2020 · Scottish Government"
            technical={[
              "The ranking was also published in 2006, 2009, 2012 and 2016. Those years are omitted because neighbourhood boundaries were redrawn between the 2001 and 2011 censuses, so the middle points cannot be compared like for like with either end.",
              "The ranking cannot tell you whether anyone got richer or poorer in cash terms. Large-scale demolition and rehousing moved people between neighbourhoods during this period, which shifts the figures without necessarily changing anyone's income.",
            ]}
          >
            <div className="grid gap-5 py-3">
              {d.rows.map((r) => (
                <div key={r.year} className="grid grid-cols-[84px_1fr] gap-x-4 gap-y-2 items-center">
                  <span className="datum text-[13px] text-[var(--ink-2)] tracking-[0.04em]">
                    {r.year}
                  </span>
                  <div className="bg-[var(--surface-2)] h-[42px] relative">
                    <div
                      className="h-full bg-[var(--glasgow)] flex items-center justify-end pr-3 text-white text-[16px] font-[640] tnum"
                      style={{ width: `${(r.pct / 50) * 100}%` }}
                    >
                      {r.pct}%
                    </div>
                  </div>
                  <span className="col-start-2 datum text-[12px] text-[var(--muted)] -mt-0.5">
                    {r.note}
                  </span>
                </div>
              ))}
            </div>
            <p className="datum text-[11.5px] text-[var(--muted)]">Bars drawn to a 50% scale.</p>
          </Figure>

          <SourceList ids={d.sourceIds} />
          <CTA
            title="Fewer bad neighbourhoods, more poor children"
            body="Glasgow's neighbourhoods improved on the national ranking at the same time as its child poverty rate rose faster than anywhere in Scotland. Both are true, and the reason matters."
            href="/why-glasgow"
            cta="Why that happened"
            secondaryHref="/the-numbers"
            secondaryCta="All six measures"
          />
        </Page>
      </>
    );
  }

  /* ---------- Standard line-chart indicator ---------- */
  const ind = getIndicator(slug)!;
  const isChildPoverty = slug === "child-poverty";
  const isPay = slug === "pay";

  return (
    <>
      {crumbs}
      {article}
      <Page>
        <PageHeader eyebrow={ind.label} title={ind.title} lede={ind.summary} stat={HEADER_STAT[slug]}>
          <div className="mt-5">
            <DirectionChip direction={ind.direction} />
          </div>
        </PageHeader>

        <InShort>
          {IN_SHORT[slug].map((t) => (
            <p key={t}>{t}</p>
          ))}
        </InShort>

        <div className="pt-9">
          <Figure
            n={1}
            embedSlug={ind.slug}
            title={ind.chartTitle}
            sub={ind.chartSub}
            legend={ind.series.map((s) => ({ name: s.name, colorVar: s.colorVar }))}
            caption={ind.caption}
            technical={ind.technical}
            table={
              <DataTable
                head={[ind.xLabel, ...ind.series.map((s) => s.name)]}
                rows={ind.x.map((y, i) => [
                  y,
                  ...ind.series.map((s) =>
                    ind.unit === "£"
                      ? `£${s.data[i].toFixed(ind.decimals)}`
                      : `${s.data[i].toFixed(ind.decimals)}${ind.unit === "%" ? "%" : ""}`
                  ),
                ])}
              />
            }
          >
            <LineChart
              x={ind.x}
              series={ind.series}
              yMin={ind.yMin}
              yMax={ind.yMax}
              yTicks={ind.yTicks}
              unit={ind.unit === "years" ? "" : ind.unit}
              decimals={ind.decimals}
              gapBand={ind.series.length === 2}
              provisionalFrom={ind.provisionalFrom}
              provisionalLabel={ind.provisionalLabel}
              extra={
                isChildPoverty
                  ? {
                      label: "Glasgow children",
                      values: GLASGOW_CHILD_COUNTS.map((v) => v.toLocaleString("en-GB")),
                    }
                  : isPay
                    ? {
                        label: "Gap",
                        values: ind.x.map(
                          (_, i) =>
                            `£${(ind.series[0].data[i] - ind.series[1].data[i]).toFixed(1)}`
                        ),
                      }
                    : undefined
              }
              ariaLabel={ind.summary}
            />
          </Figure>
        </div>

        {isChildPoverty && (
          <Col className="pt-10">
            <h2 className="h2 mb-4">Where Glasgow sits</h2>
            <p>
              Glasgow&apos;s 9.0 percentage point rise is the largest of Scotland&apos;s 32 council
              areas — more than double the next steepest. It also has the highest rate.{" "}
              <Link href="/areas">See every council area ranked</Link>.
            </p>
          </Col>
        )}

        {isPay && (
          <Col className="pt-10">
            <h2 className="h2 mb-4">Why this chart matters</h2>
            <p>
              The gap between the green and blue lines is the single clearest piece of evidence on
              this site. Glasgow hosts the region&apos;s well-paid work and sends the wages home to
              the suburbs — which is why raising the city&apos;s employment rate did not reduce its
              child poverty. <Link href="/why-glasgow">The full argument is here</Link>.
            </p>
          </Col>
        )}

        <SourceList ids={ind.sourceIds} />

        <CTA
          title="Every number here is checkable"
          body="Open the data table above, or download the whole dataset. If you find an error, we will correct it and say so publicly."
          href="/data"
          cta="Download the data"
          secondaryHref="/corrections"
          secondaryCta="Report an error"
        />
      </Page>
    </>
  );
}
