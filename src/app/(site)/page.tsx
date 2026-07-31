import Link from "next/link";
import {
  Page,
  Col,
  Split,
  Note,
  Slab,
  CTA,
  Card,
  SectionHead,
  EvidenceDetails,
  Reveal,
} from "@/components/Blocks";
import { JsonLd, articleJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { councilsByChange, councilsByLevel, SCOTLAND_PCTS } from "@/lib/data/councils";
import { scotlandPoverty } from "@/lib/data/scotland";
import { getSources } from "@/lib/data/sources";
import { site } from "@/lib/site";
import AreaGrid from "@/components/AreaGrid";
import WhyBother from "@/components/WhyBother";
import Hero from "./Hero";

export const metadata = meta({
  title: "Poverty in Scotland, explained clearly",
  description:
    "See what poverty means where you live, find your MP and MSP automatically, and open ready-written emails. Every figure is sourced.",
  path: "/",
  type: "website",
});

const FAQ = [
  {
    q: "How many people live in poverty in Scotland?",
    a: "About 1 in 6 people. The exact figure is 17%, or around 940,000 people, after rent or mortgage costs in 2022–25.",
  },
  {
    q: "Is this only about child poverty?",
    a: "No. The site also covers adults, pensioners, work, out-of-work benefits, pay, housing and health. Child poverty is used for local comparisons because it is the best reliable local measure available.",
  },
  {
    q: "Why do local pages lead with child poverty?",
    a: "The main poverty survey can tell us about Scotland as a whole, but not each local area safely. Child-poverty figures use benefit and tax records, so every council area can be compared in the same way.",
  },
  {
    q: "Who has the power to reduce poverty?",
    a: "The UK Government, Scottish Government and councils each decide different things. You do not need to know which is which: enter your postcode and the site sends each request to the right person.",
  },
  {
    q: "What happens to the postcode I enter?",
    a: "It is used only to find your area, MP and MSP. The site does not save it. Anything you add stays in your browser and your own email app.",
  },
];

const COVERAGE = [
  {
    href: "/areas",
    eyebrow: "Find your place",
    title: "See what is happening in your area",
    body: "Choose any Scottish council area. Start with the simple answer, then open the full figures and sources if you want them.",
  },
  {
    href: "/constituencies",
    eyebrow: "Find your MP",
    title: "See the facts for the area your MP represents",
    body: "There is one MP for each area. Enter your postcode and we will find yours — you do not need to know their name or political area.",
  },
  {
    href: "/what-would-fix-it",
    eyebrow: "What would help",
    title: "See the changes experts say would work",
    body: "A short list of practical changes, how much they would help, what they cost and who can make them happen.",
  },
  {
    href: "/accountability",
    eyebrow: "Who decides",
    title: "See which government is responsible for what",
    body: "The UK Government, Scottish Government and councils control different parts. This page explains the split without expecting you to know politics.",
  },
];

export default function Home() {
  const byLevel = councilsByLevel();
  const rose = councilsByChange().filter((council) => council.change > 0).length;
  const glasgow = byLevel.find((council) => council.slug === "glasgow-city")!;
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
        <AreaGrid className="pt-16 sm:pt-20" />

        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={1}
            eyebrow={`Scotland · Latest official figures · ${scotlandPoverty.period}`}
            title="What poverty looks like in Scotland"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Children in poverty who have a working parent" value="3 in 4">
                  Having a job helps, but many wages still do not cover rent, food, heating and
                  other basics.
                </Note>
              }
            >
              <p>
                Poverty is not only rough sleeping or having no food. It can mean working, paying
                the rent, and still not having enough left for heating, travel, clothes or an
                unexpected bill.
              </p>
              <p>
                It affects children, adults and pensioners. It also affects families where someone
                works. The cards below give the easy-to-picture number first and the exact figure
                underneath.
              </p>
            </Split>
          </div>

          <div className="grid gap-px bg-[var(--rule)] border-y border-[var(--rule)] mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { ...scotlandPoverty.all, plain: "About 1 in 6" },
              { ...scotlandPoverty.children, plain: "About 1 in 5" },
              { ...scotlandPoverty.workingAge, plain: "About 1 in 6" },
              { ...scotlandPoverty.pensioners, plain: "About 1 in 8" },
            ].map((group) => (
              <div key={group.label} className="bg-[var(--paper)] px-6 py-7">
                <p className="ui text-[15px] font-[700] text-[var(--ink-2)] min-h-[2.8em]">
                  {group.label}
                </p>
                <p className="display text-[31px] text-[var(--action)] mt-3 leading-none">{group.plain}</p>
                <p className="ui text-[15px] font-[650] text-[var(--ink-2)] mt-3">Exact: {group.pct}%</p>
                {"count" in group && (
                  <p className="ui text-[15px] text-[var(--muted)] mt-1">
                    {group.count.toLocaleString("en-GB")} people
                  </p>
                )}
              </div>
            ))}
          </div>

          <EvidenceDetails className="mt-5 max-w-[780px]">
            <p>
              The official measure calls this <strong>relative poverty after housing costs</strong>.
              It means a household has less than 60% of the usual UK income after rent or mortgage
              costs. The source is{" "}
              <a href={nationalSource.url} target="_blank" rel="noopener noreferrer">
                {nationalSource.title}, {nationalSource.publisher}
              </a>.
            </p>
          </EvidenceDetails>
        </section>

        <WhyBother className="pt-20 sm:pt-28" />

        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={2}
            eyebrow="Your place"
            title="See what is happening where you live"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Col>
              <p>
                Every Scottish council area has its own page. It starts with a short answer, then
                shows child poverty, people needing out-of-work benefits and typical pay.
              </p>
              <p>
                The pattern is clear: things got worse in {rose} of Scotland&apos;s 32 council
                areas over the last ten years. Glasgow is worst. We keep that story visible rather
                than hiding it inside a Scotland-wide average.
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

      <Slab attribution="Official Scottish Government figures, 2022–25">
        3 in 4 children in poverty live with someone who works.
      </Slab>

      <Page>
        <section>
          <SectionHead
            n={3}
            eyebrow="Work and wages"
            title="Having a job does not always mean having enough money"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <div className="grid gap-6">
                  <Note label="Your area">
                    Every council page shows how many people need out-of-work benefits and what a
                    typical full-time worker earns.
                  </Note>
                  <Note label="Across Scotland">
                    The official figures show children, working-age adults and pensioners
                    separately, so no group disappears inside one total.
                  </Note>
                </div>
              }
            >
              <p>
                A job can be low-paid, have too few hours or change from week to week. Rent, food
                and energy can rise faster than wages. Benefits can also fall short. That is why a
                simple message to “get a job” does not answer the problem.
              </p>
              <p>
                We show work, pay and poverty together, but do not pretend they are the same thing.
                <Link href="/methods"> You can see exactly how every figure was counted.</Link>
              </p>
            </Split>
          </div>
        </section>

        <section className="pt-20 sm:pt-28">
          <SectionHead
            n={4}
            eyebrow="Glasgow · Its own record"
            title="Glasgow needs its own spotlight"
          />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] mt-5">
            <div className="rounded-[var(--r-m)] bg-[var(--deep)] text-[var(--deep-ink)] p-7 sm:p-10">
              <p className="label !text-[var(--deep-ink)] opacity-60 mb-5">Glasgow · 2000–2026</p>
              <h3 className="display text-[clamp(27px,3.2vw,44px)] font-[750] max-w-[22ch]">
                More than 1 in 3 children in Glasgow are growing up in poverty.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.6] opacity-80 max-w-[58ch]">
                The exact figure is {glasgow.pcts[9]}%, or {glasgow.counts[9].toLocaleString("en-GB")} children.
                It is the highest rate in Scotland. It also rose more than anywhere else over the
                last ten years. Scotland-wide coverage will not be allowed to water that down.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/the-numbers" className="btn btn-primary">
                  See Glasgow&apos;s full story
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/why-glasgow" className="btn border-current/35 text-current hover:bg-white/10">
                  Why it is worse here
                </Link>
              </div>
            </div>
            <div className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-7 sm:p-8">
              <p className="label mb-5">Why Glasgow stands out</p>
              <div className="grid grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)] mb-6">
                <div className="bg-[var(--paper)] p-4">
                  <p className="figure-num text-[31px] text-[var(--action)]">+{glasgow.change.toFixed(1)}</p>
                  <p className="text-[15px] text-[var(--ink-2)] mt-1">rise in Glasgow</p>
                </div>
                <div className="bg-[var(--paper)] p-4">
                  <p className="figure-num text-[31px]">+{scotlandChange}</p>
                  <p className="text-[15px] text-[var(--ink-2)] mt-1">rise across Scotland</p>
                </div>
              </div>
              <ul className="space-y-4 text-[16px] text-[var(--ink-2)] leading-[1.5]">
                <li>Work and out-of-work benefits since 2000</li>
                <li>What jobs in Glasgow pay, and what Glaswegians earn</li>
                <li>Neighbourhoods and how long people live</li>
                <li>Four clear reasons Glasgow is hit harder</li>
                <li>Which government made which decisions</li>
              </ul>
            </div>
          </div>
        </section>

      </Page>

      <CTA
        title="You do not need to know politics to ask for change"
        body="Enter your postcode once. We find your MP and MSP, add the official figures for your area, write both emails and open them in your own email app."
        href="/take-action"
        cta="Find my MP and MSP"
        secondaryHref="/areas"
        secondaryCta="See every area"
      />

      <Page>
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
        <p className="ui mt-12 text-[15px] text-[var(--muted)]">
          {site.name} — a personal public-interest project by {site.author.name} at{" "}
          {site.organisation.name}. No party affiliation, no funding, no paywall.
        </p>
      </Page>
    </>
  );
}
