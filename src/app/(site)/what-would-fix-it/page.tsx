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
import { G } from "@/components/Glossary";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { fixes, type FixStatus } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "What would actually fix it",
  description:
    "Seven costed policies that would cut child poverty in Glasgow, what each would achieve, what each costs, and exactly where each one stands today. Modelled by JRF, IPPR Scotland and the Fraser of Allander Institute.",
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
      className={`ui inline-block rounded-full text-[12px] font-[660] px-3 py-1.5 border whitespace-nowrap ${TAG[status]}`}
      style={{ borderColor: "currentColor" }}
    >
      {label}
    </span>
  );
}

const FAQ = [
  {
    q: "Does getting more people into work reduce child poverty?",
    a: "Not on its own. Across Scotland, 69% of children in poverty live in a household where at least one adult works. Glasgow's employment rate rose nine points between 2013 and 2022 while its child poverty rate rose too. Independent modelling by JRF, IPPR Scotland and the Fraser of Allander Institute all find that income transfers, not employment programmes, drive the child poverty figure.",
  },
  {
    q: "What happened to the two-child limit?",
    a: "It ran from April 2017 and was abolished in April 2026. It withheld benefit support for third and subsequent children, and because it targeted larger families it fell hardest on places with bigger average family sizes, Glasgow among them.",
  },
  {
    q: "How much would it cost to hit Scotland's child poverty target?",
    a: "There is no single figure, but the costed components are known: about £310m a year for a targeted Scottish Child Payment supplement, £60m a year to reach full take-up, and £8-9.2bn over a parliament for a housing programme adequate to need, against £4.1bn currently planned.",
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
          eyebrow="The evidence · Seven costed measures"
          title="What would actually fix it"
          lede="This is one of the better-researched questions in Scottish politics. Three independent bodies have run the numbers, and they land in the same place."
          stat={{
            value: `${done} of ${fixes.length}`,
            label: "of the costed, evidenced measures on this page has actually been delivered",
            tone: "bad",
          }}
        />

        <InShort>
          <p>Experts agree on what works: put money directly in families' pockets.</p>
          <p>Job schemes alone do not fix child poverty.</p>
          <p>Most of the things that would work have not been done yet.</p>
        </InShort>
      </Page>

      <Slab attribution="The shared finding of JRF, IPPR Scotland and the Fraser of Allander Institute">
        Putting money directly into families&apos; hands is what works. Training and job schemes
        barely shift it.
      </Slab>

      <Page>
        <Col>
          <p>
            Not one model gets anywhere near the 2030 target through employment policy alone.
            Here is what has been costed, what each measure would achieve, who has the power to do
            it — and where each one stands today.
          </p>
        </Col>

        {/* ---------- The ledger, desktop ---------- */}
        <Reveal>
          <div className="mt-10 overflow-x-auto hidden md:block rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-2">
            <table className="w-full border-collapse text-[15px]">
              <thead>
                <tr>
                  {["What could be done", "What it would do", "What it costs", "Who decides", "Where it stands"].map(
                    (h) => (
                      <th
                        key={h}
                        className="ui text-[12.5px] font-[680] text-[var(--muted)] text-left align-bottom px-4 pt-4 pb-3 border-b-2 border-[var(--ink)]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {fixes.map((f) => (
                  <tr key={f.id} className="align-top hover:bg-[var(--surface-2)] transition-colors">
                    <td className="ui px-4 py-4 border-b border-[var(--rule)] min-w-[200px] font-[640] text-[15px] leading-[1.35]">
                      {f.what}
                    </td>
                    <td className="px-4 py-4 border-b border-[var(--rule)] text-[var(--ink-2)] text-[15px] leading-[1.55]">
                      {f.effect}
                    </td>
                    <td className="ui tnum px-4 py-4 border-b border-[var(--rule)] whitespace-nowrap text-[14px]">
                      {f.cost}
                    </td>
                    <td className="ui px-4 py-4 border-b border-[var(--rule)] whitespace-nowrap text-[14px] text-[var(--ink-2)]">
                      {f.lever}
                    </td>
                    <td className="px-4 py-4 border-b border-[var(--rule)]">
                      <StatusTag status={f.status} label={f.statusLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* ---------- The ledger, mobile ---------- */}
        <div className="mt-10 grid gap-4 md:hidden">
          {fixes.map((f, i) => (
            <Reveal key={f.id} delay={i * 40}>
              <div className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="ui font-[640] text-[16px] leading-[1.35]">{f.what}</p>
                  <StatusTag status={f.status} label={f.statusLabel} />
                </div>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mb-3.5">{f.effect}</p>
                <p className="ui tnum text-[12.5px] text-[var(--muted)]">
                  {f.cost} · decided by {f.lever}
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
              The <G t="scp">Scottish Child Payment</G> demonstrably works — and on every model, it
              is not enough by itself. That is the pattern across this table: the measures that
              exist are real, and they are smaller than the problem they are set against.
            </p>
          </Split>
        </div>

        {/* ---------- Why the cheap lever keeps winning ---------- */}
        <section className="pt-20 sm:pt-24">
          <SectionHead
            n={1}
            eyebrow="The pattern"
            title="Why employment schemes keep being chosen anyway"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Employability spending, 2026–31 plan" value="£90m">
                  A year — against £310m a year for the supplement the modelling says would lift
                  10,000 children out of poverty.
                </Note>
              }
            >
              <p>
                Because they are cheaper, and because they let a government say it is doing
                something without committing to recurring spending. The 2026&ndash;31 delivery
                plan commits about £90m a year to employability support — real money, and a
                fraction of what the effective lever costs.
              </p>
              <p>
                The difficulty is that the government&apos;s own commissioned evidence says the
                expensive lever is the one that works.{" "}
                <Link href="/accountability">That is a choice, and it is on the record.</Link>
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="pt-20 sm:pt-24">
          <SectionHead n={2} eyebrow="Questions" title="What people ask about the fixes" />
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
          <p className="label mb-6">Where the modelling comes from</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources(["jrf", "ippr", "fai", "cpag", "housing"]).map((s) => (
              <div key={s.id} className="text-[14.5px] text-[var(--ink-2)] leading-[1.55]">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
                >
                  {s.title}
                </a>
                <p className="ui text-[12.5px] text-[var(--muted)] mt-1.5 mb-1.5">
                  {s.publisher}
                </p>
                {s.used}
              </div>
            ))}
          </div>
        </section>
      </Page>

      <CTA
        title="Ask your representative which of these they support"
        body="Every measure on this page has a named decision-maker. The take-action page writes the letter for you, with the figures for your own council area already in it."
        href="/take-action"
        cta="Write to them"
        secondaryHref="/accountability"
        secondaryCta="See the record"
      />
    </>
  );
}
