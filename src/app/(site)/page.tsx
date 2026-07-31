import Link from "next/link";
import EditorialImage from "@/components/EditorialImage";
import {
  Page,
  Col,
  Split,
  Note,
  Slab,
  CTA,
  Card,
  SectionHead,
  Reveal,
} from "@/components/Blocks";
import { JsonLd, articleJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { councilsByChange, councilsByLevel, SCOTLAND_PCTS } from "@/lib/data/councils";
import { scotlandPoverty } from "@/lib/data/scotland";
import { getSources } from "@/lib/data/sources";
import { site } from "@/lib/site";
import Hero from "./Hero";

export const metadata = meta({
  title: "Poverty in Scotland — evidence by area and the people with power",
  description:
    "Independent evidence on poverty, work and living standards across Scotland. Find your council, see the figures, and open an addressed email to your MP or MSP.",
  path: "/",
  type: "website",
});

const FAQ = [
  {
    q: "How many people live in poverty in Scotland?",
    a: "Around 940,000 people — 17% of Scotland's population — were living in relative poverty after housing costs in the latest official three-year period, 2022–25.",
  },
  {
    q: "Is this only about child poverty?",
    a: "No. Child poverty is the strongest comparable local income measure, but every council page also carries out-of-work claimant and resident-pay data. The Glasgow deep dive adds employment, benefits, jobs, neighbourhood deprivation and life expectancy.",
  },
  {
    q: "Why does local poverty use a child-poverty measure?",
    a: "The main official poverty survey is robust at Scotland level, not council level. Local child-poverty estimates use HMRC and DWP administrative data and can be compared consistently across all 32 councils and 57 Westminster constituencies.",
  },
  {
    q: "Who has the power to reduce poverty?",
    a: "Different decisions sit at Westminster, Holyrood and local councils. The action tool routes each request to the MP or MSP who can act on it, so the reader does not need to understand the constitutional split first.",
  },
  {
    q: "What happens to the postcode I enter?",
    a: "It is used to find the council area, MP and constituency MSP. Scotland Counted does not save it, and names or personal sentences added to a draft stay in the reader's browser and email app.",
  },
];

const COVERAGE = [
  {
    href: "/areas",
    eyebrow: "All 32 council areas",
    title: "Poverty, work and pay where you live",
    body: "Ten years of local child-poverty figures, claimant counts from 2000 and resident pay from 2008, each compared with Scotland.",
  },
  {
    href: "/constituencies",
    eyebrow: "All 57 Westminster seats",
    title: "One constituency, one answerable MP",
    body: "Every Scottish seat ranked by child poverty, with a permanent page that turns a national decision into a local question.",
  },
  {
    href: "/what-would-fix-it",
    eyebrow: "Costed policies",
    title: "What would actually change the numbers",
    body: "The measures independent researchers have modelled, what each would achieve, what it costs and which government controls it.",
  },
  {
    href: "/accountability",
    eyebrow: "Three levels of government",
    title: "Follow the power, not the blame",
    body: "Westminster, Holyrood and councils each control part of the outcome. The record shows the decisions and measured consequences.",
  },
];

export default function Home() {
  const byLevel = councilsByLevel();
  const rose = councilsByChange().filter((council) => council.change > 0).length;
  const glasgow = byLevel.find((council) => council.slug === "glasgow-city")!;
  const glasgowGap = (glasgow.pcts[9] - SCOTLAND_PCTS[9]).toFixed(1);
  const scotlandChange = (SCOTLAND_PCTS[9] - SCOTLAND_PCTS[0]).toFixed(1);
  const nationalSource = getSources([scotlandPoverty.sourceId])[0];

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: "Poverty has an address. So does power.",
          description: metadata.description as string,
          path: "/",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Hero />

      <Page>
        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={1}
            eyebrow={`Scotland · Official statistics · ${scotlandPoverty.period}`}
            title="Poverty is not one group of people"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Children in poverty living with someone in paid work" value="75%">
                  Work lowers the risk of poverty. It does not guarantee an income high enough to
                  escape it.
                </Note>
              }
            >
              <p>
                Poverty means having less than 60% of typical UK household income after housing
                costs. It reaches children, working-age adults and pensioners — and it reaches
                households where somebody is working.
              </p>
              <p>
                The national figures below come from the Scottish Government&apos;s Family Resources
                Survey analysis. Local pages use administrative data because that survey cannot
                produce reliable council-level poverty rates.
              </p>
            </Split>
          </div>

          <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              scotlandPoverty.all,
              scotlandPoverty.children,
              scotlandPoverty.workingAge,
              scotlandPoverty.pensioners,
            ].map((group) => (
              <div key={group.label} className="bg-[var(--paper)] px-6 py-7">
                <p className="ui text-[14px] font-[620] text-[var(--ink-2)] min-h-[2.8em]">
                  {group.label}
                </p>
                <p className="figure-num text-[48px] text-[var(--action)] mt-3">{group.pct}%</p>
                {"count" in group && (
                  <p className="ui text-[14px] text-[var(--muted)] mt-2">
                    {group.count.toLocaleString("en-GB")} people
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 text-[15px] text-[var(--ink-2)]">
            Source:{" "}
            <a href={nationalSource.url} target="_blank" rel="noopener noreferrer">
              {nationalSource.title}, {nationalSource.publisher}
            </a>
            .
          </p>
        </section>

        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={2}
            eyebrow="The evidence, made local"
            title="Start with where you live"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Col>
              <p>
                Every Scottish council area has its own evidence page. Child poverty, out-of-work
                claims and resident pay sit together, so no place is reduced to one number.
              </p>
              <p>
                The child-poverty ranking still reveals a hard national pattern: {rose} of 32
                council areas worsened over the decade. {byLevel[0].name} is highest at{" "}
                {byLevel[0].pcts[9]}%; {byLevel[31].name} is lowest at {byLevel[31].pcts[9]}%.
              </p>
            </Col>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-10">
            {COVERAGE.map((card, index) => (
              <Reveal key={card.href} delay={index * 45}>
                <Card {...card} />
              </Reveal>
            ))}
          </div>
        </section>
      </Page>

      <Slab attribution="Scottish Government, Poverty and Income Inequality in Scotland 2022–25">
        Three quarters of children in poverty live in a household where somebody works.
      </Slab>

      <Page>
        <section>
          <SectionHead
            n={3}
            eyebrow="Poverty and the labour market"
            title="A job matters. It is not the whole answer."
          />
          <EditorialImage
            src="/images/editorial/scotland-working-family.webp"
            alt="An illustrated working parent walking home with a child and groceries on a rainy Scottish evening."
            caption="Three quarters of children in poverty live with someone who works. Housing, food, travel and energy costs can still overwhelm a wage."
            aspect="wide"
            className="mt-10 sm:ml-[calc(2ch+2rem)]"
            objectPosition="center 42%"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Local evidence">
                    Every council page compares claimant rates and resident pay with the Scottish
                    line across time.
                  </Note>
                  <Note label="National evidence">
                    The latest official poverty release separates children, working-age adults and
                    pensioners, before and after housing costs.
                  </Note>
                </div>
              }
            >
              <p>
                Calling poverty an unemployment problem misses low pay, insecure hours, rent and
                the value of social security. That is why this record places work and pay beside
                income poverty rather than treating any one measure as the answer.
              </p>
              <p>
                The local series are deliberately separate: claimant count is not the same thing
                as unemployment, pay is shown in cash terms, and child poverty is measured after
                housing costs. <Link href="/methods">The limits are stated, not hidden.</Link>
              </p>
            </Split>
          </div>
        </section>

        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={4}
            eyebrow="National outlier · dedicated record"
            title="Glasgow is Scotland's starkest child-poverty outlier"
          />
          <EditorialImage
            src="/images/editorial/glasgow-everyday-street.webp"
            alt="An illustrated everyday Glasgow tenement street with residents walking home after rain."
            caption="Glasgow's figures are not an abstract city average. They describe tens of thousands of children growing up across ordinary streets and neighbourhoods."
            aspect="wide"
            className="mt-10"
            objectPosition="center 56%"
          />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] mt-5">
            <div className="rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] p-7 sm:p-10">
              <p className="label !text-[var(--deep-ink)] opacity-60 mb-5">Glasgow · 2000–2026</p>
              <h3 className="display text-[clamp(27px,3.2vw,44px)] font-[750] max-w-[22ch]">
                {glasgow.pcts[9]}%. {glasgow.counts[9].toLocaleString("en-GB")} children. Highest
                of all 32 council areas.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.6] opacity-80 max-w-[58ch]">
                Glasgow is {glasgowGap} percentage points above the Scottish rate. Over the decade
                its rate rose {glasgow.change.toFixed(1)} points, compared with {scotlandChange} in
                Scotland. Scotland-wide coverage does not fold those figures into an average: the
                city keeps a separate six-measure record of what changed and why.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/the-numbers" className="btn btn-primary">
                  See the Glasgow record
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/why-glasgow" className="btn border-current/35 text-current hover:bg-white/10">
                  Why Glasgow is different
                </Link>
              </div>
            </div>
            <div className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-7 sm:p-8">
              <p className="label mb-5">Why Glasgow has its own record</p>
              <div className="grid grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)] mb-6">
                <div className="bg-[var(--paper)] p-4">
                  <p className="figure-num text-[31px] text-[var(--action)]">+{glasgow.change.toFixed(1)}</p>
                  <p className="text-[15px] text-[var(--ink-2)] mt-1">point rise in Glasgow</p>
                </div>
                <div className="bg-[var(--paper)] p-4">
                  <p className="figure-num text-[31px]">+{scotlandChange}</p>
                  <p className="text-[15px] text-[var(--ink-2)] mt-1">point rise in Scotland</p>
                </div>
              </div>
              <ul className="space-y-4 text-[16px] text-[var(--ink-2)] leading-[1.5]">
                <li>Employment and claimant trends since 2000</li>
                <li>Resident pay against workplace pay</li>
                <li>Neighbourhood deprivation and life expectancy</li>
                <li>Four evidenced causes specific to the city</li>
                <li>Decisions across Westminster, Holyrood and the council</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pt-20 sm:pt-28">
          <SectionHead n={5} eyebrow="Questions" title="What people ask first" />
          <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2 mt-10">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t-2 border-[var(--ink)] pt-5">
                <h3 className="h3 mb-3 max-w-[34ch]">{item.q}</h3>
                <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[58ch]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Page>

      <CTA
        title="The evidence is local. The responsibility is named."
        body="Enter your postcode once. The site finds your area, fills in the official figures, routes each request to the right level of government and opens the addressed email in your own email app."
        href="/take-action"
        cta="Find who can act"
        secondaryHref="/areas"
        secondaryCta="Explore every area"
      />

      <Page>
        <p className="ui mt-12 text-[15px] text-[var(--muted)]">
          {site.name} — a personal public-interest project by {site.author.name} at{" "}
          {site.organisation.name}. No party affiliation, no funding, no paywall.
        </p>
      </Page>
    </>
  );
}
