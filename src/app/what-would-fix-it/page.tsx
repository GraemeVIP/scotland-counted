import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
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
          eyebrow="The evidence"
          title="What would actually fix it"
          lede="This is one of the better-researched questions in Scottish politics. Three separate independent bodies have run the numbers and landed in the same place."
        />

        <Col className="pt-9">
          <p className="text-[19px] leading-[1.5]">
            <strong>
              Putting money directly into families&apos; hands is what works. Training and job
              schemes barely shift it.
            </strong>{" "}
            Not one model gets anywhere near the 2030 target through employment policy alone.
          </p>
          <p>Here is what has been costed, and where each measure stands today.</p>
        </Col>

        {/* ---------- Desktop table ---------- */}
        <div className="mt-8 overflow-x-auto hidden md:block">
          <table className="w-full border-collapse text-[14.5px]">
            <thead>
              <tr>
                {["What could be done", "What it would do", "What it costs", "Who decides", "Where it stands"].map(
                  (h) => (
                    <th
                      key={h}
                      className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--muted)] font-normal text-left align-bottom pr-4 pb-3 border-b border-[var(--rule)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {fixes.map((f) => (
                <tr key={f.id} className="align-top">
                  <td className="pr-4 py-3.5 border-b border-[var(--rule)] min-w-[190px] font-[560]">
                    {f.what}
                  </td>
                  <td className="pr-4 py-3.5 border-b border-[var(--rule)] text-[var(--ink-2)]">
                    {f.effect}
                  </td>
                  <td className="pr-4 py-3.5 border-b border-[var(--rule)] whitespace-nowrap tnum">
                    {f.cost}
                  </td>
                  <td className="pr-4 py-3.5 border-b border-[var(--rule)] whitespace-nowrap text-[var(--ink-2)]">
                    {f.lever}
                  </td>
                  <td className="py-3.5 border-b border-[var(--rule)]">
                    <span
                      className={`inline-block font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] px-2 py-1 border rounded-[2px] whitespace-nowrap ${TAG[f.status]}`}
                      style={{ borderColor: "currentColor" }}
                    >
                      {f.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile cards ---------- */}
        <div className="mt-8 grid gap-3 md:hidden">
          {fixes.map((f) => (
            <div
              key={f.id}
              className="bg-[var(--surface)] border border-[var(--rule)] rounded-[3px] p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-[600] text-[15.5px] leading-[1.35]">{f.what}</p>
                <span
                  className={`shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-1 border rounded-[2px] ${TAG[f.status]}`}
                  style={{ borderColor: "currentColor" }}
                >
                  {f.statusLabel}
                </span>
              </div>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.5] mb-2.5">{f.effect}</p>
              <p className="font-mono text-[12px] text-[var(--muted)]">
                {f.cost} · decided by {f.lever}
              </p>
            </div>
          ))}
        </div>

        <Col className="pt-9">
          <p className="text-[15px] text-[var(--ink-2)]">
            The <G t="scp">Scottish Child Payment</G> reached £28.20 per child per week in April
            2026, and rises to £40 for under-ones from 2027. It is the main reason Scotland&apos;s
            line stayed flat while England&apos;s cities climbed. It demonstrably works — and on
            every model, it is not enough by itself.
          </p>
        </Col>

        <section className="pt-14">
          <h2 className="h2 mb-5">Why employment schemes keep being chosen anyway</h2>
          <Col>
            <p>
              Because they are cheaper, and because they let a government say it is doing
              something without committing to recurring spending. The 2026&ndash;31 delivery plan
              commits about £90m a year to employability support — real money, and a fraction of
              the £310m a year that a targeted Scottish Child Payment supplement would cost.
            </p>
            <p>
              The difficulty is that the government&apos;s own commissioned evidence says the
              expensive lever is the one that works.{" "}
              <Link href="/accountability">That is a choice, and it is on the record.</Link>
            </p>
          </Col>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-6">Common questions</h2>
          <div className="grid gap-4 lg:grid-cols-2 max-w-[1000px]">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t border-[var(--rule)] pt-4">
                <h3 className="h3 mb-2">{f.q}</h3>
                <p className="text-[15.5px] text-[var(--ink-2)] leading-[1.55]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 pt-6 border-t border-[var(--rule)]">
          <p className="eyebrow mb-4">Where the modelling comes from</p>
          <ul className="space-y-4 max-w-[74ch]">
            {getSources(["jrf", "ippr", "fai", "cpag", "housing"]).map((s) => (
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
              </li>
            ))}
          </ul>
        </section>

        <CTA
          title="Ask your representative which of these they support"
          body="Every measure on this page has a named decision-maker. The take-action page writes the letter for you, with the figures for your own council area already in it."
          href="/take-action"
          cta="Write to them"
          secondaryHref="/accountability"
          secondaryCta="See the record"
        />
      </Page>
    </>
  );
}
