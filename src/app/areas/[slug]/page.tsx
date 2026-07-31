import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  councils,
  getCouncil,
  COUNCIL_YEARS,
  SCOTLAND_PCTS,
  COUNCIL_COUNT,
} from "@/lib/data/councils";

export function generateStaticParams() {
  return councils.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/areas/[slug]">) {
  const { slug } = await props.params;
  const c = getCouncil(slug);
  if (!c) return {};
  const last = COUNCIL_YEARS[9];
  return meta({
    title: `Child poverty in ${c.name}`,
    description: `${c.pcts[9]}% of children in ${c.name} were living in poverty in ${last} — ${c.counts[9].toLocaleString("en-GB")} children. That ranks ${c.rankLevel} of ${COUNCIL_COUNT} Scottish council areas. Ten years of figures, fully sourced.`,
    path: `/areas/${slug}`,
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

  const faq = [
    {
      q: `How many children live in poverty in ${c.name}?`,
      a: `${c.counts[9].toLocaleString("en-GB")} children — ${c.pcts[9]}% of all children in the area — were living in relative poverty after housing costs in ${last}.`,
    },
    {
      q: `Is child poverty in ${c.name} rising or falling?`,
      a: rose
        ? `Rising. The rate went from ${c.pcts[0]}% in ${first} to ${c.pcts[9]}% in ${last}, an increase of ${c.change} percentage points.`
        : `Falling. The rate went from ${c.pcts[0]}% in ${first} to ${c.pcts[9]}% in ${last}, a fall of ${Math.abs(c.change)} percentage points.`,
    },
    {
      q: `How does ${c.name} compare with the rest of Scotland?`,
      a: `${c.name} ranks ${c.rankLevel} of ${COUNCIL_COUNT} council areas by child poverty rate, where 1 is the highest. The Scottish rate in ${last} was ${SCOTLAND_PCTS[9]}%, so ${c.name} is ${Math.abs(vsScotland)} percentage points ${vsScotland > 0 ? "above" : "below"} the national figure.`,
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
          headline: `Child poverty in ${c.name}`,
          description: `${c.pcts[9]}% of children in ${c.name} live in poverty after housing costs.`,
          path: `/areas/${c.slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`Council area · ${c.code}`}
          title={`Child poverty in ${c.name}`}
          lede={
            <>
              {c.pcts[9]}% of children here were living in poverty in {last} — that is{" "}
              {c.counts[9].toLocaleString("en-GB")} children.{" "}
              {rose
                ? `The rate rose ${c.change} percentage points over the decade.`
                : `The rate fell ${Math.abs(c.change)} percentage points over the decade.`}
            </>
          }
        />

        {/* ---------- Key facts ---------- */}
        <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-9 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {[
            {
              label: `Child poverty, ${last}`,
              value: `${c.pcts[9]}%`,
              note: `${c.counts[9].toLocaleString("en-GB")} children`,
            },
            {
              label: "Change over the decade",
              value: `${rose ? "+" : ""}${c.change} pp`,
              note: `from ${c.pcts[0]}% in ${first}`,
            },
            {
              label: "Rank in Scotland",
              value: `${ordinal(c.rankLevel)}`,
              note: `of ${COUNCIL_COUNT}, where 1st is worst`,
            },
            {
              label: "Against the Scottish rate",
              value: `${vsScotland > 0 ? "+" : ""}${vsScotland} pp`,
              note: `Scotland was ${SCOTLAND_PCTS[9]}%`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--ground)] px-5 pt-5 pb-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.07em] text-[var(--muted)] leading-[1.45] mb-3 sm:min-h-[2.9em]">
                {s.label}
              </div>
              <div className="text-[30px] font-[640] tracking-[-0.028em] leading-none tnum">
                {s.value}
              </div>
              <div className="font-mono text-[12.5px] text-[var(--ink-2)] mt-2.5">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-9">
          <Figure
            title={`Children living in poverty in ${c.name}`}
            sub={`After housing costs · ${first} – ${last} · End Child Poverty / Loughborough University`}
            legend={[
              { name: c.name, colorVar: "--glasgow" },
              { name: "Scotland", colorVar: "--scotland" },
            ]}
            caption={`The dip in 2020/21 is the pandemic, when benefits were temporarily raised. The support was withdrawn and the rate went back up — a pattern visible in almost every council area.`}
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

        <Col className="pt-11">
          <h2 className="h2 mb-4">What this means</h2>
          <p>
            Child poverty here is measured <G t="ahc">after housing costs</G>: a child counts as
            poor if the household has less than 60% of typical UK income once the rent or mortgage
            is paid.
          </p>
          {isGlasgow ? (
            <p>
              Glasgow has both the highest rate in Scotland and the steepest rise. It is the
              subject of the rest of this site —{" "}
              <Link href="/why-glasgow">why it is worse here</Link> and{" "}
              <Link href="/what-would-fix-it">what would change it</Link>.
            </p>
          ) : (
            <p>
              {c.name} ranks {ordinal(c.rankLevel)} of {COUNCIL_COUNT}. For comparison, Glasgow
              City — the highest in Scotland — was at {glasgow.pcts[9]}% in {last}, having risen{" "}
              {glasgow.change} points over the same decade.{" "}
              <Link href="/why-glasgow">Why Glasgow specifically</Link> explains the drivers, most
              of which apply in some measure everywhere.
            </p>
          )}
          <p>
            The causes are national policy, not local failure: the same benefit rules, the same
            frozen <G t="lha">housing support</G> and the same labour market apply across
            Scotland.{" "}
            <Link href="/what-would-fix-it">The costed remedies are here</Link>.
          </p>
        </Col>

        <section className="pt-12">
          <h2 className="h2 mb-6">Questions people ask</h2>
          <div className="grid gap-4 lg:grid-cols-2 max-w-[1000px]">
            {faq.map((f) => (
              <div key={f.q} className="border-t border-[var(--rule)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-12">
          <p className="eyebrow mb-4">Other council areas</p>
          <div className="flex flex-wrap gap-2">
            {councils
              .filter((o) => o.slug !== c.slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/areas/${o.slug}`}
                  className="text-[14px] px-3 py-1.5 border border-[var(--rule)] rounded-[3px] bg-[var(--surface)] hover:border-[var(--glasgow)] transition-colors"
                >
                  {o.name} <span className="text-[var(--muted)] tnum">{o.pcts[9]}%</span>
                </Link>
              ))}
          </div>
        </section>

        <CTA
          title={`Ask what is being done about ${c.name}`}
          body="The letter below is pre-filled with the figures for this area. It takes about two minutes, and it goes to the people who vote on the decisions that set these numbers."
          href="/take-action"
          cta="Write to your representative"
          secondaryHref="/areas"
          secondaryCta="Compare all 32 areas"
        />
      </Page>
    </>
  );
}
