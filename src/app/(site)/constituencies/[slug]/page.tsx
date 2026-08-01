import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Col, PageHeader, CTA, InShort, EvidenceDetails } from "@/components/Blocks";
import Figure, { DataTable } from "@/components/charts/Figure";
import LineChart from "@/components/charts/LineChart";
import { G } from "@/components/Glossary";
import SharePage from "@/components/SharePage";
import WhoDoesWhat from "@/components/WhoDoesWhat";
import WhyBother from "@/components/WhyBother";
import VotingRecord from "@/components/VotingRecord";
import ConstituencyLetter from "./ConstituencyLetter";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import {
  constituencies,
  getConstituency,
  CONSTITUENCY_YEARS,
  CONSTITUENCY_COUNT,
} from "@/lib/data/constituencies";
import { SCOTLAND_PCTS } from "@/lib/data/councils";
import { asOneIn, changeInWords } from "@/lib/plain-language";
import Faq from "@/components/Faq";

export function generateStaticParams() {
  return constituencies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = getConstituency(slug);
  if (!c) return {};
  return meta({
    title: `Child poverty in ${c.name}`,
    description: `${asOneIn(c.pcts[9])} children in the area represented by the ${c.name} MP are living in poverty. See the figures and email your MP.`,
    path: `/constituencies/${slug}`,
    ownImage: true,
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
  const plainShare = asOneIn(c.pcts[9]);
  const plainShareSentence = plainShare.charAt(0).toUpperCase() + plainShare.slice(1);

  const faq = [
    {
      q: `How many children live in poverty in ${c.name}?`,
      a: `${plainShare} children. The exact figure is ${c.pcts[9]}%, or ${c.counts[9].toLocaleString("en-GB")} children, after rent or mortgage costs in ${last}.`,
    },
    {
      q: `How does ${c.name} compare with other Scottish constituencies?`,
      a: `${c.name} is ${c.rankLevel} of ${CONSTITUENCY_COUNT} MP areas in Scotland, where 1 is the worst. The exact Scottish figure was ${SCOTLAND_PCTS[9]}%.`,
    },
    {
      q: `What can the MP for ${c.name} actually do about child poverty?`,
      a: `Your MP votes on Universal Credit and help with private rent. These choices change how much money a family has left each week. Enter your postcode and we will find the MP and write the email for you.`,
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
          eyebrow="The area represented by one MP"
          title={`Child poverty in ${c.name}`}
          lede={
            <>
              One MP represents this area. <strong>{plainShare} children</strong> here are growing
              up in poverty — {c.counts[9].toLocaleString("en-GB")} children in total.
            </>
          }
          stat={{
            value: plainShare.replace(/^(about|more than|almost)\s+/, ""),
            label: `${plainShareSentence} children in ${c.name} are growing up in poverty. Exact figure: ${c.pcts[9]}% in ${last}.`,
            tone: rose ? "bad" : "good",
          }}
        />

        <div className="mt-2 mb-10">
          <InShort>
            <p>
              In {c.name}, <strong>{plainShare} children</strong> are growing up without enough
              money at home. The exact figure is {c.pcts[9]}%.
            </p>
            <p>
              One MP speaks for this area in the UK Parliament, in London. They help decide
              benefits and help with rent. <strong>We already know who they are</strong> — you can
              send them an email from this page without entering anything.
            </p>
            <p>
              {changeInWords(c.pcts[0], c.pcts[9])} {rose ? "It has got worse." : "It has improved."}
            </p>
          </InShort>
        </div>

        <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-2 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {[
            {
              label: "Compared with every MP area in Scotland",
              value: ordinal(c.rankLevel),
              note: `of ${CONSTITUENCY_COUNT} · 1st means the worst rate`,
            },
            {
              label: "Over the last ten years",
              value: rose ? "Worse" : "Better",
              note: `${c.pcts[0]}% then · ${c.pcts[9]}% now`,
            },
            {
              label: "Compared with Scotland",
              value: vsScotland > 1 ? "Higher" : vsScotland < -1 ? "Lower" : "About the same",
              note: `${c.name}: ${c.pcts[9]}% · Scotland: ${SCOTLAND_PCTS[9]}%`,
            },
            {
              label: "Children in poverty now",
              value: plainShare,
              note: `Exactly ${c.pcts[9]}% · ${c.counts[9].toLocaleString("en-GB")} children`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--paper)] px-5 pt-5 pb-6">
              <div className="ui text-[15px] font-[700] text-[var(--ink-2)] leading-[1.45] mb-3 sm:min-h-[2.9em]">{s.label}</div>
              <div className="figure-num text-[30px] tnum">{s.value}</div>
              <div className="ui text-[15px] text-[var(--ink-2)] mt-2.5 tnum">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <SharePage
            title={`Child poverty in ${c.name}`}
            text={`${c.pcts[9]}% of children in ${c.name} were living in poverty after housing costs in ${last}. See the sourced constituency evidence.`}
          />
        </div>

        <div className="mt-9">
          <Figure
            n={1}
            embedSlug={`mp-${c.slug}`}
            title={`Children living in poverty in ${c.name}`}
            sub={`Money left after rent or mortgage · ${first} to ${last}`}
            legend={[
              { name: c.name, colorVar: "--glasgow" },
              { name: "Scotland", colorVar: "--scotland" },
            ]}
            caption="The line fell during the pandemic, when benefits were temporarily raised. When that extra help ended, the line went back up in almost every MP area in Scotland."
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
              "The technical name for an MP area is a constituency. These figures use the 2024 boundaries throughout. They come from HMRC and DWP records and are adjusted to match the official national poverty survey.",
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

        <VotingRecord slug={c.slug} constituency={c.name} className="mt-16" />

        {/* The action follows the evidence: the reader has just seen the chart
            and the record, which is the moment to offer them the email. */}
        <div className="mt-12">
          <ConstituencyLetter
            slug={c.slug}
            area={{
              name: c.name,
              pct: c.pcts[9],
              count: c.counts[9],
              firstPct: c.pcts[0],
              firstYear: first,
              scotlandPct: SCOTLAND_PCTS[9],
            }}
          />
        </div>

        <WhyBother className="mt-14" />

        <WhoDoesWhat className="mt-14" />

        <Col className="pt-14">
          <h2 className="h2 mb-4">What your MP can vote on</h2>
          <p>
            The MP for {c.name} votes on Universal Credit and <G t="lha">help with private rent</G>.
            These choices decide how much money many families have left each week after housing.
          </p>
          <p>
            A fair question is:{" "}
            <strong>
              what do you expect this area&apos;s child-poverty figure to be in five years, and what
              are you doing to bring it down?
            </strong>{" "}
            <Link href="#email-your-mp">We have already written that email for you.</Link>
          </p>
        </Col>

        <EvidenceDetails className="mt-8 max-w-[780px] mx-auto" summary="See the exact definition used here">
          <p>
            A child is counted as living in relative poverty after housing costs when the family
            has less than 60% of the usual UK household income once rent or mortgage is paid.
          </p>
        </EvidenceDetails>

        <Faq items={faq} className="pt-12" />

        <section className="pt-12">
          <p className="label mb-4">Every Scottish constituency</p>
          <div className="flex flex-wrap gap-2">
            {constituencies
              .filter((o) => o.slug !== c.slug)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/constituencies/${o.slug}`}
                  className="ui text-[15px] px-3 py-2 border border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--brand)] transition-colors"
                >
                  {o.name} <span className="text-[var(--muted)] tnum">{o.pcts[9]}%</span>
                </Link>
              ))}
          </div>
        </section>

        <CTA
          title={`Email the MP for ${c.name}`}
          body="You do not need to enter anything. We know who your MP is, and the email is already written with these exact local figures."
          href="#email-your-mp"
          cta="Write my email to the MP"
          secondaryHref="/constituencies"
          secondaryCta="See every MP area"
        />
      </Page>
    </>
  );
}
