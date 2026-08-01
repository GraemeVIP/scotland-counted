import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Col, PageHeader, CTA, InShort, EvidenceDetails } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import MinimumWageReality from "@/components/MinimumWageReality";
import SharePage from "@/components/SharePage";
import WhyBother from "@/components/WhyBother";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  councils,
  getCouncil,
  COUNCIL_YEARS,
  SCOTLAND_PCTS,
  COUNCIL_COUNT,
} from "@/lib/data/councils";
import {
  councilExtra,
  SCOTLAND_EXTRA,
  CC_YEARS,
  JD_YEARS,
  PAY_YEARS,
} from "@/lib/data/councilExtra";
import { asOneIn, changeInWords } from "@/lib/plain-language";
import Faq from "@/components/Faq";

export function generateStaticParams() {
  return councils.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/areas/[slug]">) {
  const { slug } = await props.params;
  const c = getCouncil(slug);
  if (!c) return {};
  return meta({
    title: `Poverty, work and pay in ${c.name}`,
    description: `${asOneIn(c.pcts[9])} children in ${c.name} are living in poverty. See the exact local figures for poverty, out-of-work benefits and pay.`,
    path: `/areas/${slug}`,
    ownImage: true,
  });
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default async function AreaPage(props: PageProps<"/areas/[slug]">) {
  const { slug } = await props.params;
  const c = getCouncil(slug);
  if (!c) notFound();

  const first = COUNCIL_YEARS[0];
  const last = COUNCIL_YEARS[9];
  const glasgow = getCouncil("glasgow-city")!;
  const isGlasgow = c.slug === "glasgow-city";
  const rose = c.change > 0;
  const vsScotland = +(c.pcts[9] - SCOTLAND_PCTS[9]).toFixed(1);
  const plainShare = asOneIn(c.pcts[9]);

  const faq = [
    {
      q: `How many children live in poverty in ${c.name}?`,
      a: `${plainShare} children. The exact figure is ${c.pcts[9]}%, or ${c.counts[9].toLocaleString("en-GB")} children, after rent or mortgage costs in ${last}.`,
    },
    {
      q: `Is child poverty in ${c.name} rising or falling?`,
      a: rose
        ? `Rising. It was ${c.pcts[0]}% in ${first} and is ${c.pcts[9]}% now.`
        : `Falling. It was ${c.pcts[0]}% in ${first} and is ${c.pcts[9]}% now.`,
    },
    {
      q: `How does ${c.name} compare with the rest of Scotland?`,
      a: `${c.name} is ${ordinal(c.rankLevel)} of ${COUNCIL_COUNT} Scottish council areas, where 1st is the worst. The exact Scottish figure is ${SCOTLAND_PCTS[9]}%, compared with ${c.pcts[9]}% here.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: c.name, path: `/areas/${c.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: `Poverty, work and pay in ${c.name}`,
          description: `${c.pcts[9]}% of children in ${c.name} live in poverty after housing costs, alongside local claimant-count and resident-pay evidence.`,
          path: `/areas/${c.slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow="Your area · Latest local figures"
          title={`Poverty and pay in ${c.name}`}
          lede={
            <>
              <strong>{plainShare} children</strong> here are growing up in poverty. That is{" "}
              {c.counts[9].toLocaleString("en-GB")} children. {rose ? "It has got worse over the last ten years." : "It has improved over the last ten years."}
            </>
          }
        />

        <div className="mt-2 mb-10">
          <InShort>
            <p>
              In {c.name}, <strong>{plainShare} children</strong> are growing up without enough
              money at home. The exact figure is {c.pcts[9]}%.
            </p>
            <p>
              {changeInWords(c.pcts[0], c.pcts[9])}{" "}
              {rose ? "Things have got worse here." : "Things have got better here."}
            </p>
            <p>
              You can also see what minimum-wage work really pays and how many people need
              out-of-work benefits. A separate ONS pay estimate is kept below, clearly marked so
              it is not mistaken for the average wage.
            </p>
          </InShort>
        </div>

        {/* ---------- Key facts ---------- */}
        <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-9 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {[
            {
              label: "Children in poverty now",
              value: plainShare,
              note: `Exactly ${c.pcts[9]}% · ${c.counts[9].toLocaleString("en-GB")} children`,
            },
            {
              label: "Over the last ten years",
              value: rose ? "Worse" : "Better",
              note: `${c.pcts[0]}% then · ${c.pcts[9]}% now`,
            },
            {
              label: "Compared with every Scottish area",
              value: `${ordinal(c.rankLevel)}`,
              note: `of ${COUNCIL_COUNT} · 1st means the worst rate`,
            },
            {
              label: "Compared with Scotland",
              value: vsScotland > 1 ? "Higher" : vsScotland < -1 ? "Lower" : "About the same",
              note: `${c.name}: ${c.pcts[9]}% · Scotland: ${SCOTLAND_PCTS[9]}%`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--paper)] px-5 pt-5 pb-6">
              <div className="ui text-[15px] font-[700] text-[var(--muted)] leading-[1.45] mb-3 sm:min-h-[2.9em]">
                {s.label}
              </div>
              <div className="text-[30px] font-[640] tracking-[-0.028em] leading-none tnum">
                {s.value}
              </div>
              <div className="ui text-[15px] text-[var(--ink-2)] mt-2.5 tnum">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <SharePage
            title={`Poverty, work and pay in ${c.name}`}
            text={`${c.pcts[9]}% of children in ${c.name} were living in poverty after housing costs in ${last}. See the sourced local evidence.`}
          />
        </div>

        <div className="mt-9">
          <Figure
            embedSlug={`area-${c.slug}`}
            title={`Children living in poverty in ${c.name}`}
            sub={`Money left after rent or mortgage · ${first} to ${last}`}
            legend={[
              { name: c.name, colorVar: "--glasgow" },
              { name: "Scotland", colorVar: "--scotland" },
            ]}
            caption="The line fell during the pandemic, when benefits were temporarily raised. When that extra help ended, the line went back up in almost every council area."
            technical={["Source: End Child Poverty and Loughborough University. The local estimates use HMRC and DWP records and are adjusted to match the official UK poverty survey."]}
            table={
              <DataTable
                head={["Year", `${c.name} %`, "Children", "Scotland %"]}
                rows={COUNCIL_YEARS.map((y, i) => [
                  y,
                  c.pcts[i].toFixed(1),
                  c.counts[i].toLocaleString("en-GB"),
                  SCOTLAND_PCTS[i].toFixed(1),
                ])}
              />
            }
          >
            <LineChart
              x={COUNCIL_YEARS}
              series={[
                { name: c.name, colorVar: "--glasgow", data: c.pcts },
                { name: "Scotland", colorVar: "--scotland", data: SCOTLAND_PCTS },
              ]}
              yMin={5}
              yMax={40}
              yTicks={[5, 10, 15, 20, 25, 30, 35, 40]}
              unit="%"
              decimals={1}
              gapBand
              extra={{
                label: "Children",
                values: c.counts.map((v) => v.toLocaleString("en-GB")),
              }}
              ariaLabel={`Child poverty in ${c.name} compared with Scotland, ${first} to ${last}.`}
            />
          </Figure>
        </div>

        {/* ---------- Labour market ---------- */}
        {(() => {
          const ex = councilExtra[c.slug];
          if (!ex) return null;
          const cc = ex.cc as number[];
          const jdLast = [...ex.jd].reverse().find((v) => v !== null) as number | null;
          const jdYear = jdLast === null ? null : JD_YEARS[ex.jd.lastIndexOf(jdLast)];
          const pay = ex.pay as number[];
          const scoPay = SCOTLAND_EXTRA.pay as number[];
          return (
            <section className="pt-14">
              <h2 className="h2 mb-4 max-w-[26ch]">Work, benefits and pay in {c.name}</h2>
              <Col>
                <p>
                  Start with the legal minimum below. The ONS pay chart further down is not what
                  the average worker earns: it covers only a selected group of full-time PAYE
                  employee jobs held by people living here.
                  {jdLast !== null && (
                    <>
                      {" "}There were also{" "}
                      <strong className="tnum">
                        {jdLast} job{jdLast === 1 ? "" : "s"} located here for every working-age
                        resident
                      </strong>{" "}
                      in {jdYear}.
                    </>
                  )}
                </p>
              </Col>

              <MinimumWageReality className="mt-8" />

              <div className="grid gap-5 lg:grid-cols-2 mt-5">
                <Figure
                  n={2}
                  title="People who need out-of-work benefits"
                  sub="Residents aged 16 to 64 · each January · 2000 to 2026"
                  legend={[
                    { name: c.name, colorVar: "--glasgow" },
                    { name: "Scotland", colorVar: "--scotland" },
                  ]}
                  table={
                    <DataTable
                      head={["January", `${c.name} %`, "Scotland %"]}
                      rows={CC_YEARS.map((y, i) => [
                        y,
                        cc[i]?.toFixed(1) ?? "—",
                        (SCOTLAND_EXTRA.cc[i] as number).toFixed(1),
                      ])}
                    />
                  }
                  technical={[
                    "From 2015 this count includes Universal Credit claimants required to look for work, a wider group than the Jobseeker's Allowance count it replaced.",
                  ]}
                >
                  <LineChart
                    x={CC_YEARS}
                    series={[
                      { name: c.name, colorVar: "--glasgow", data: cc },
                      { name: "Scotland", colorVar: "--scotland", data: SCOTLAND_EXTRA.cc as number[] },
                    ]}
                    yMin={0}
                    yMax={9}
                    yTicks={[0, 2, 4, 6, 8]}
                    unit="%"
                    decimals={1}
                    gapBand
                    ariaLabel={`Out-of-work benefit claimants in ${c.name} compared with Scotland, 2000 to 2026.`}
                  />
                </Figure>

                {ex.payComplete ? (
                  <Figure
                    n={3}
                    title="Restricted full-time employee-pay estimate"
                    sub="Not the average wage · selected PAYE jobs held by residents · 2008–2025"
                    legend={[
                      { name: c.name, colorVar: "--glasgow" },
                      { name: "Scotland", colorVar: "--scotland" },
                    ]}
                    table={
                      <DataTable
                        head={["Year", c.name, "Scotland"]}
                        rows={PAY_YEARS.map((y, i) => [
                          y,
                          `£${pay[i]?.toFixed(0)}`,
                          `£${scoPay[i]?.toFixed(0)}`,
                        ])}
                      />
                    }
                    caption="This does not show what the average worker, a minimum-wage worker or a person in poverty earns. It is the median only within a restricted sample of full-time PAYE employee jobs held by residents."
                    technical={[
                      "The series excludes every part-time job, self-employment, employees outside PAYE, junior rates and people whose pay was affected by absence. It counts employee jobs rather than necessarily counting unique people.",
                      "Gross weekly pay can include overtime, bonuses, shift premiums and allowances. The estimate relates to one April pay period in each year.",
                      "Cash terms, not adjusted for inflation — compare the two lines within a year, not along them. Residence basis means selected jobs held by people living in the area, wherever those jobs are based.",
                    ]}
                  >
                    <LineChart
                      x={PAY_YEARS}
                      series={[
                        { name: c.name, colorVar: "--glasgow", data: pay },
                        { name: "Scotland", colorVar: "--scotland", data: scoPay },
                      ]}
                      yMin={350}
                      yMax={850}
                      yTicks={[400, 500, 600, 700, 800]}
                      unit="£"
                      decimals={0}
                      gapBand
                      ariaLabel={`Restricted median gross weekly pay estimate for selected full-time PAYE employee jobs held by residents of ${c.name}, compared with Scotland, 2008 to 2025.`}
                    />
                  </Figure>
                ) : (
                  <div className="bg-[var(--surface)] border border-[var(--rule)] p-7 flex flex-col justify-center">
                    <p className="h4 mb-2">Pay data withheld</p>
                    <p className="text-[15px] text-[var(--ink-2)] leading-[1.6] max-w-[46ch]">
                      The ONS suppresses median pay for {c.name} in at least one year because the
                      survey sample is too small to publish safely. We show nothing rather than
                      estimate — see <Link href="/methods">how we handle missing data</Link>.
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        <div className="pt-11 max-w-[780px] mx-auto">
          <EvidenceDetails summary="How these local figures are counted">
            <p>
              Child poverty is counted <G t="ahc">after housing costs</G>. The exact rule is that a
              household has less than 60% of the usual UK income once rent or mortgage is paid.
            </p>
          {isGlasgow ? (
            <p>
              Glasgow has the highest rate in Scotland and the biggest rise. It therefore has a
              separate record showing <Link href="/why-glasgow">why it is worse here</Link> and{" "}
              <Link href="/what-would-fix-it">what would help</Link>.
            </p>
          ) : (
            <p>
              {c.name} is {ordinal(c.rankLevel)} of {COUNCIL_COUNT}. Glasgow City is the highest at{" "}
              {glasgow.pcts[9]}%. <Link href="/why-glasgow">Glasgow&apos;s separate story</Link> explains
              why it has been hit so hard.
            </p>
          )}
          <p>
            Benefit rules and <G t="lha">help with private rent</G> affect every Scottish area.
            <Link href="/what-would-fix-it"> See the changes experts say would help.</Link>
          </p>
          </EvidenceDetails>
        </div>

        <Faq items={faq} className="pt-12" />

        <section className="pt-12">
          <p className="label mb-4">Other council areas</p>
          <div className="flex flex-wrap gap-2">
            {councils
              .filter((o) => o.slug !== c.slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/areas/${o.slug}`}
                  className="text-[15px] px-3 py-2 border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors"
                >
                  {o.name} <span className="text-[var(--muted)] tnum">{o.pcts[9]}%</span>
                </Link>
              ))}
          </div>
        </section>

        <WhyBother className="pt-16" />

        <CTA
          title={`Email the people who represent ${c.name}`}
          body="Enter your postcode. We find your MP and MSP, add these local figures, write both emails and open them in your email app. You do not need to know who decides what."
          href="/take-action"
          cta="Find my MP and MSP"
          secondaryHref="/areas"
          secondaryCta="See all 32 areas"
        />
      </Page>
    </>
  );
}
