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
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { tiers, statutoryTargets } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Who decides what",
  description:
    "A plain-English guide to what the UK Government, Scottish Government and councils can do about poverty, with the exact record and sources.",
  path: "/accountability",
});

export default function Accountability() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accountability", path: "/accountability" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Who decided this",
          description: metadata.description as string,
          path: "/accountability",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Politics explained simply"
          title="Who decides what"
          lede="The UK Government, Scottish Government and councils each control different things. You should not need a politics degree to know who to ask. This page explains the split and shows the exact record."
          stat={{
            value: "4 / 4",
            label: "legal child-poverty promises for 2023/24 were missed. Every one of them.",
            tone: "bad",
          }}
        />

        <InShort>
          <p><strong>Scotland put four child-poverty promises into law. All four were missed.</strong></p>
          <p>The UK Government controls most benefits. The Scottish Government controls the Scottish Child Payment, housing and childcare. Councils deal with homelessness and local services.</p>
          <p>Enter your postcode and we send the right question to the right person automatically.</p>
        </InShort>

        <Col className="pt-2">
          <p className="text-[15.5px] text-[var(--ink-2)]">
            This page records decisions and what happened next. It does not guess what a politician
            intended. A party is named only when it formed the government that made the decision.
            If anything here is wrong,{" "}
            <Link href="/corrections">tell us and we will correct it publicly</Link>.
          </p>
        </Col>

        {/* ---------- The four missed targets ---------- */}
        <section className="pt-16 sm:pt-20">
          <SectionHead
            n={1}
            eyebrow="Four promises written into law"
            title="Scotland missed every child-poverty target"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Children poor for years" value="23%">
                  The legal target was below 8%. This means children were poor in at least three of
                  the last four years.
                </Note>
              }
            >
              <p>
                The law set four targets for 2023/24. The table shows the exact promise and what
                actually happened. Ministers have said there is <strong>no punishment for missing
                them</strong>.
              </p>
            </Split>

            <Reveal>
              {/* Phone: one card per target, nothing cut off */}
              <div className="sm:hidden mt-8 grid gap-3">
                {statutoryTargets.map((t) => (
                  <div
                    key={t.measure}
                    className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="ui font-[660] text-[15.5px] leading-[1.3]">{t.measure}</p>
                      <span className="ui rounded-full text-[15px] font-[700] text-[var(--bad)] border border-current px-3 py-2 whitespace-nowrap">
                        Missed
                      </span>
                    </div>
                    <p className="ui text-[15px] text-[var(--ink-2)]">
                      The law said {t.target}. What happened:{" "}
                      <strong className="text-[var(--bad)] font-[700]">{t.actual}</strong>
                    </p>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block mt-8 overflow-x-auto rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-2 max-w-[780px]">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr>
                      {["Measure", "The legal target", "What happened", ""].map((h, i) => (
                        <th
                          key={i}
                          className="ui text-[15px] font-[700] text-[var(--muted)] text-left px-4 pt-4 pb-3 border-b-2 border-[var(--ink)]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statutoryTargets.map((t) => (
                      <tr key={t.measure} className="hover:bg-[var(--surface-2)] transition-colors">
                        <td className="ui px-4 py-3.5 border-b border-[var(--rule)] font-[640] text-[15px]">
                          {t.measure}
                        </td>
                        <td className="ui tnum px-4 py-3.5 border-b border-[var(--rule)] text-[15px] text-[var(--ink-2)]">
                          {t.target}
                        </td>
                        <td className="ui tnum px-4 py-3.5 border-b border-[var(--rule)] text-[16px] font-[700] text-[var(--bad)]">
                          {t.actual}
                        </td>
                        <td className="px-4 py-3.5 border-b border-[var(--rule)]">
                          <span className="ui rounded-full text-[15px] font-[700] text-[var(--bad)] border border-current px-3 py-2 whitespace-nowrap">
                            Missed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      </Page>

      <Slab attribution="The structure, not an accident of politics">
        London, Edinburgh and councils control different parts. That makes blame easy and change hard.
      </Slab>

      <Page>
        {/* ---------- The three tiers ---------- */}
        <section>
          <SectionHead n={2} eyebrow="Government by government" title="Who can do what" />
          <div className="grid gap-6 mt-10">
            {tiers.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <article className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] border-l-[4px] border-l-[var(--bad)] px-6 sm:px-9 pt-7 pb-5">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1.5">
                    <p className="label">{t.who}</p>
                    <p className="ui text-[15px] text-[var(--muted)]">{t.power}</p>
                  </div>
                  <h3 className="h3 mb-5 max-w-[36ch]">{t.heading}</h3>
                  <ul className="space-y-3.5 mb-2">
                    {t.points.map((p, j) => (
                      <li
                        key={j}
                        className="relative pl-6 text-[15.5px] leading-[1.6] text-[var(--ink-2)] max-w-[74ch] before:content-[''] before:absolute before:left-0 before:top-[0.72em] before:w-[11px] before:h-[2px] before:bg-[var(--bad)]"
                      >
                        {p.emphasis && (
                          <strong className="text-[var(--ink)] font-[600]">{p.emphasis} </strong>
                        )}
                        {p.text}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- The structural point ---------- */}
        <section className="pt-20 sm:pt-24">
          <SectionHead n={3} eyebrow="One clear lesson" title="Extra money to families reduced child poverty" />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="What happened in the pandemic" value="2020/21">
                  Benefits went up and child poverty fell. The extra help ended the next year and
                  poverty went back up.
                </Note>
              }
            >
              <p>
                Each government can point to something another government controls, and each is
                partly right. <G t="reserved">See the exact split here.</G> The problem is that no
                single government owns the whole result.
              </p>
              <p>
                One thing is clear. Child poverty in Glasgow fell when payments to families went
                up. It rose again when that extra support ended. Government choices changed the
                figure in both directions.
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- Sources ---------- */}
        <section className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-6">Where this comes from</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources(["targets", "cpag", "housing", "jrf", "fai", "migration"]).map((s) => (
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
        title="Ask the right people without working out the politics"
        body="Enter your postcode. We find your MP and MSP and put the right request into each email automatically."
        href="/take-action"
        cta="Find my MP and MSP"
        secondaryHref="/what-would-fix-it"
        secondaryCta="See what would help"
      />
    </>
  );
}
