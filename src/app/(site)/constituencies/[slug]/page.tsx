import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  constituencies,
  getConstituency,
  CONSTITUENCY_YEARS,
  CONSTITUENCY_COUNT,
} from "@/lib/data/constituencies";
import { SCOTLAND_PCTS } from "@/lib/data/councils";

export function generateStaticParams() {
  return constituencies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = getConstituency(slug);
  if (!c) return {};
  const last = CONSTITUENCY_YEARS[9];
  return meta({
    title: `Child poverty in ${c.name}`,
    description: `${c.pcts[9]}% of children in the ${c.name} constituency were living in poverty in ${last} — ${c.counts[9].toLocaleString("en-GB")} children, ranked ${c.rankLevel} of ${CONSTITUENCY_COUNT} Scottish seats. The figures your MP is answerable for.`,
    path: `/constituencies/${slug}`,
  });
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default async function ConstituencyPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = getConstituency(slug);
  if (!c) notFound();

  const first = CONSTITUENCY_YEARS[0];
  const last = CONSTITUENCY_YEARS[9];
  const rose = c.change > 0;
  const vsScotland = +(c.pcts[9] - SCOTLAND_PCTS[9]).toFixed(1);

  const faq = [
    {
      q: `How many children live in poverty in ${c.name}?`,
      a: `${c.counts[9].toLocaleString("en-GB")} children — ${c.pcts[9]}% of children in the constituency — were living in relative poverty after housing costs in ${last}.`,
    },
    {
      q: `How does ${c.name} compare with other Scottish constituencies?`,
      a: `${c.name} ranks ${c.rankLevel} of ${CONSTITUENCY_COUNT} Scottish UK Parliament constituencies by child poverty rate, where 1 is the highest. The Scottish average in ${last} was ${SCOTLAND_PCTS[9]}%.`,
    },
    {
      q: `What can the MP for ${c.name} actually do about child poverty?`,
      a: `The largest levers are reserved to Westminster, where the MP votes: Universal Credit rates, Local Housing Allowance, and the successor arrangements to the two-child limit abolished in April 2026. Independent modelling shows these transfers, not employment programmes, drive the child poverty rate.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Constituencies", path: "/constituencies" },
          { name: c.name, path: `/constituencies/${c.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: `Child poverty in ${c.name}`,
          description: `${c.pcts[9]}% of children in ${c.name} live in poverty after housing costs.`,
          path: `/constituencies/${c.slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <Page>
        <PageHeader
          eyebrow={`UK Parliament constituency · ${c.code}`}
          title={`Child poverty in ${c.name}`}
          lede={
            <>
              One MP represents this seat, and this is the number they are answerable for:{" "}
              {c.counts[9].toLocaleString("en-GB")} children in poverty in {last}.{" "}
              {rose
                ? `The rate rose ${c.change} percentage points over the decade.`
                : `The rate fell ${Math.abs(c.change)} percentage points over the decade.`}
            </>
          }
          stat={{
            value: `${c.pcts[9]}%`,
            label: `of children in ${c.name}, after housing costs, ${last}`,
            tone: rose ? "bad" : "good",
          }}
        />

        <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-2 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {[
            {
              label: "Rank in Scotland",
              value: ordinal(c.rankLevel),
              note: `of ${CONSTITUENCY_COUNT} seats, where 1st is worst`,
            },
            {
              label: "Change over the decade",
              value: `${rose ? "+" : ""}${c.change} pp`,
              note: `from ${c.pcts[0]}% in ${first}`,
            },
            {
              label: "Against the Scottish rate",
              value: `${vsScotland > 0 ? "+" : ""}${vsScotland} pp`,
              note: `Scotland was ${SCOTLAND_PCTS[9]}%`,
            },
            {
              label: "Children in poverty",
              value: c.counts[9].toLocaleString("en-GB"),
              note: `in ${last}`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--paper)] px-5 pt-5 pb-6">
              <div className="label label-quiet leading-[1.45] mb-3 sm:min-h-[2.9em]">{s.label}</div>
              <div className="figure-num text-[30px] tnum">{s.value}</div>
              <div className="datum text-[12px] text-[var(--ink-2)] mt-2.5">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-9">
          <Figure
            n={1}
            title={`Children living in poverty in ${c.name}`}
            sub={`After housing costs · ${first} – ${last} · End Child Poverty / Loughborough University · 2024 boundaries`}
            legend={[
              { name: c.name, colorVar: "--glasgow" },
              { name: "Scotland", colorVar: "--scotland" },
            ]}
            caption="The dip in 2020/21 is the pandemic, when benefits were temporarily raised. The support was withdrawn and the rate went back up — visible in almost every seat in Scotland."
            table={
              <DataTable
                head={["Year", `${c.name} %`, "Children", "Scotland %"]}
                rows={CONSTITUENCY_YEARS.map((y, i) => [
                  y,
                  c.pcts[i].toFixed(1),
                  c.counts[i].toLocaleString("en-GB"),
                  SCOTLAND_PCTS[i].toFixed(1),
                ])}
              />
            }
            technical={[
              "Constituency figures use the 2024 Westminster boundaries throughout, so the whole series is comparable. The estimates come from HMRC and DWP administrative data calibrated to the national poverty surveys.",
            ]}
          >
            <LineChart
              x={CONSTITUENCY_YEARS}
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
          <h2 className="h2 mb-4">What your MP controls</h2>
          <p>
            Child poverty here is measured <G t="ahc">after housing costs</G>. The policies that
            move it most are <G t="reserved">reserved</G> — decided at Westminster, where the MP
            for {c.name} votes: Universal Credit rates, <G t="lha">housing benefit</G> levels, and
            what replaces the <G t="tcl">two-child limit</G> era.
          </p>
          <p>
            That makes this page a fair question to put to them:{" "}
            <strong>
              what do you expect this constituency&apos;s rate to be in five years, and what have
              you voted for that gets it there?
            </strong>{" "}
            <Link href="/take-action">The letter tool</Link> will write it with you in two minutes.
          </p>
        </Col>

        <section className="pt-12">
          <h2 className="h2 mb-6">Questions people ask</h2>
          <div className="grid gap-4 lg:grid-cols-2 max-w-[1000px]">
            {faq.map((f) => (
              <div key={f.q} className="border-t-2 border-[var(--ink)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-12">
          <p className="label mb-4">Every Scottish constituency</p>
          <div className="flex flex-wrap gap-2">
            {constituencies
              .filter((o) => o.slug !== c.slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/constituencies/${o.slug}`}
                  className="ui text-[13.5px] px-3 py-1.5 border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors"
                >
                  {o.name} <span className="text-[var(--muted)] tnum">{o.pcts[9]}%</span>
                </Link>
              ))}
          </div>
        </section>

        <CTA
          title={`Ask the MP for ${c.name} where they stand`}
          body="The letter is pre-filled with this constituency's figures and the specific reserved policies the modelling says would move them. It takes about two minutes."
          href="/take-action"
          cta="Write the letter"
          secondaryHref="/constituencies"
          secondaryCta="All 57 seats ranked"
        />
      </Page>
    </>
  );
}
