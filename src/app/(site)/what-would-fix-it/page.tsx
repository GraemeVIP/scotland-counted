import Link from "next/link";
import EditorialImage from "@/components/EditorialImage";
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
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { fixes, type FixStatus } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "What would help cut poverty",
  description:
    "Seven practical changes that experts say would cut poverty in Scotland, with the exact cost, likely effect and the government that can act.",
  path: "/what-would-fix-it",
});

const TAG: Record<FixStatus, string> = {
  done: "text-[var(--good)]",
  partial: "text-[var(--warn)]",
  "not-done": "text-[var(--bad)]",
};

function StatusTag({ status, label }: { status: FixStatus; label: string }) {
  return (
    <span
      className={`ui inline-block rounded-full text-[15px] font-[700] px-3 py-2 border whitespace-nowrap ${TAG[status]}`}
      style={{ borderColor: "currentColor" }}
    >
      {label}
    </span>
  );
}

const FAQ = [
  {
    q: "Does getting more people into work reduce child poverty?",
    a: "Not on its own. Three in four children in poverty live with someone who works. More Glaswegians found jobs while child poverty still rose. The research says families need enough money coming in as well as access to work.",
  },
  {
    q: "What happened to the two-child limit?",
    a: "From April 2017 to April 2026, families could not get normal benefit support for a third or later child. It hit larger families hardest, including many in Glasgow.",
  },
  {
    q: "How much would it cost to hit Scotland's child poverty target?",
    a: "There is no single price. The main estimates are £310m a year for extra Scottish Child Payment, £60m a year to make sure every eligible family receives it, and £8–9.2bn over five years for enough housing. The exact figures and sources are shown below.",
  },
];

export default function WhatWouldFixIt() {
  const done = fixes.filter((f) => f.status === "done").length;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "What would fix it", path: "/what-would-fix-it" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "What would actually fix it",
          description: metadata.description as string,
          path: "/what-would-fix-it",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Scotland · Seven practical changes"
          title="What would help cut poverty"
          lede="We do not have to guess. Independent experts have tested the main ideas. They agree that families need more money coming in, affordable housing and childcare that works around real jobs."
          stat={{
            value: `${done} of ${fixes.length}`,
            label: "of the seven changes on this page has been fully delivered",
            tone: "bad",
          }}
        />

        <InShort>
          <p><strong>Families need enough money to live on.</strong> Job schemes alone do not fix poverty.</p>
          <p>Affordable homes and childcare that fits shift work also matter.</p>
          <p>Most of the changes experts recommend have not been fully delivered.</p>
        </InShort>

        <EditorialImage
          src="/images/editorial/scotland-secure-homes.webp"
          alt="An illustrated family arriving home on a modern affordable-housing street in Scotland."
          caption="Security is the outcome: enough income and housing for families to plan ahead instead of constantly absorbing another bill."
          aspect="wide"
          className="mt-10"
          objectPosition="center 48%"
        />
      </Page>

      <Slab attribution="The shared finding of JRF, IPPR Scotland and the Fraser of Allander Institute">
        A job matters. But families also need enough money left after rent, childcare and bills.
      </Slab>

      <Page>
        <Col>
          <p>
            The research does not reach the 2030 target through job schemes alone. These are the
            seven changes experts have priced, what each could do and who can make it happen.
          </p>
        </Col>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {fixes.map((f, i) => (
            <Reveal key={f.id} delay={i * 40}>
              <div className="h-full flex flex-col rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <p className="ui font-[750] text-[18px] leading-[1.35] max-w-[30ch]">{f.what}</p>
                  <StatusTag status={f.status} label={f.statusLabel} />
                </div>
                <p className="text-[16px] text-[var(--ink-2)] leading-[1.55] mb-5">{f.effect}</p>
                <p className="ui tnum text-[15px] text-[var(--muted)] border-t border-[var(--rule)] pt-4 mt-auto">
                  <strong className="text-[var(--ink)]">Cost:</strong> {f.cost}<br />
                  <strong className="text-[var(--ink)]">Who can do it:</strong> {f.lever}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <Split
            aside={
              <Note label="Scottish Child Payment" value="£28.20">
                Per child per week from April 2026, rising to £40 for under-ones from 2027. The
                main reason Scotland&apos;s line stayed flat while England&apos;s cities climbed.
              </Note>
            }
          >
            <p>
              The <G t="scp">Scottish Child Payment</G> works. But it is not enough on its own.
              The help that exists is real; it is simply too small to match the problem.
            </p>
          </Split>
        </div>

        {/* ---------- Why the cheap lever keeps winning ---------- */}
        <section className="pt-20 sm:pt-24">
          <SectionHead
            n={1}
            eyebrow="The pattern"
            title="Why governments keep choosing cheaper ideas"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Employability spending, 2026–31 plan" value="£90m">
                  That is each year. Experts estimate £310m a year for the extra payment that could
                  lift about 10,000 children out of poverty.
                </Note>
              }
            >
              <p>
                Job support is cheaper than giving families more money every week. The 2026–31
                plan puts about £90m a year into helping people find work. That is real help, but
                it is far less than the ideas that experts say would cut poverty most.
              </p>
              <p>
                The government&apos;s own research says the more expensive option is the one that
                works better. <Link href="/accountability">That choice is on the record.</Link>
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="pt-20 sm:pt-24">
          <SectionHead n={2} eyebrow="Questions" title="What people ask about the changes" />
          <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2 mt-10">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t-2 border-[var(--ink)] pt-5">
                <h3 className="h3 mb-3 max-w-[32ch]">{f.q}</h3>
                <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[56ch]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Sources ---------- */}
        <section className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-6">The research and exact workings</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources(["sg-poverty-2026", "jrf", "ippr", "fai", "cpag", "housing"]).map((s) => (
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
      </Page>

      <CTA
        title="Ask the people who can make these changes"
        body="Enter your postcode. We find your MP and MSP, add the local facts and put the right requests into each email automatically. You do not need to choose."
        href="/take-action"
        cta="Find my MP and MSP"
        secondaryHref="/accountability"
        secondaryCta="See who decides"
      />
    </>
  );
}
