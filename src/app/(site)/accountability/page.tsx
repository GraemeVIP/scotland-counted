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
  title: "Who decided this",
  description:
    "Who controls the decisions that shape poverty in Scotland: Westminster, Holyrood and councils. The national targets, the policy record and Glasgow as the local case study — sourced and cross-party.",
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
          eyebrow="The record · Cross-party"
          title="Who decided this"
          lede="Three layers of government touch poverty in Scotland: Westminster, Holyrood and local councils. The first two set national rules; Glasgow provides the detailed local record. Each can blame the others — which is exactly the accountability problem."
          stat={{
            value: "4 / 4",
            label:
              "legally binding child poverty targets for 2023/24. Scotland missed every one of them.",
            tone: "bad",
          }}
        />

        <InShort>
          <p>Scotland made child poverty targets the law. All four targets were missed.</p>
          <p>Nobody was punished, because the law has no punishment.</p>
          <p>Three governments each blame the other two.</p>
        </InShort>

        <Col className="pt-2">
          <p className="text-[15.5px] text-[var(--ink-2)]">
            What follows is a record of documented decisions and published outcomes. We do not
            attribute motives, and we do not name individual politicians. Where a party is named,
            it is because the decision was taken by a government that party formed. If you believe
            anything here is wrong,{" "}
            <Link href="/corrections">tell us and we will correct it publicly</Link>.
          </p>
        </Col>

        {/* ---------- The four missed targets ---------- */}
        <section className="pt-16 sm:pt-20">
          <SectionHead
            n={1}
            eyebrow="The Child Poverty (Scotland) Act 2017"
            title="Scotland wrote its targets into law, then missed all four"
          />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="Persistent poverty" value="23%">
                  Against a legal target of 8% — children stuck poor for three of the last four
                  years, the measure most closely linked to lasting harm.
                </Note>
              }
            >
              <p>
                The Act set legally binding interim targets for 2023/24. Here is what was
                promised, and what was delivered. Ministers have conceded there is{" "}
                <strong>no penalty for missing them</strong> — which raises a fair question about
                what the legislation was for.
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
                      <span className="ui rounded-full text-[11.5px] font-[680] text-[var(--bad)] border border-current px-2.5 py-1 whitespace-nowrap">
                        Missed
                      </span>
                    </div>
                    <p className="ui text-[14px] text-[var(--ink-2)]">
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
                          className="ui text-[12.5px] font-[680] text-[var(--muted)] text-left px-4 pt-4 pb-3 border-b-2 border-[var(--ink)]"
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
                        <td className="ui tnum px-4 py-3.5 border-b border-[var(--rule)] text-[14px] text-[var(--ink-2)]">
                          {t.target}
                        </td>
                        <td className="ui tnum px-4 py-3.5 border-b border-[var(--rule)] text-[16px] font-[700] text-[var(--bad)]">
                          {t.actual}
                        </td>
                        <td className="px-4 py-3.5 border-b border-[var(--rule)]">
                          <span className="ui rounded-full text-[12px] font-[660] text-[var(--bad)] border border-current px-3 py-1.5 whitespace-nowrap">
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
        The target is set in Edinburgh. The money is controlled in London. The consequences land
        in Glasgow. Nobody owns the outcome.
      </Slab>

      <Page>
        {/* ---------- The three tiers ---------- */}
        <section>
          <SectionHead n={2} eyebrow="Decision by decision" title="The record, by who holds the power" />
          <div className="grid gap-6 mt-10">
            {tiers.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <article className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] border-l-[4px] border-l-[var(--bad)] px-6 sm:px-9 pt-7 pb-5">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1.5">
                    <p className="label">{t.who}</p>
                    <p className="ui text-[12px] text-[var(--muted)]">{t.power}</p>
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
          <SectionHead n={3} eyebrow="What settles it" title="The data closes one argument" />
          <div className="sm:pl-[calc(2ch+2rem)] mt-8">
            <Split
              aside={
                <Note label="The natural experiment" value="2020/21">
                  Benefits rose, child poverty fell. The support was withdrawn the next year, and
                  it went straight back up.
                </Note>
              }
            >
              <p>
                Every one of the three tiers can honestly say the main levers sit with someone
                else, and every one of them is partly right. See{" "}
                <G t="reserved">reserved and devolved</G> for how the split works. But the split
                is why <strong>no single body can be removed for failing to deliver</strong> — and
                that is a design flaw, not bad luck.
              </p>
              <p>
                The data does settle one argument. Child poverty in Glasgow fell in the single
                year that payments to families went up, and rose again the moment they were
                withdrawn. Whatever Glasgow&apos;s history, that swing was not caused by it. It
                was policy, working in both directions.
              </p>
            </Split>
          </div>
        </section>

        {/* ---------- Sources ---------- */}
        <section className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-6">Where this comes from</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources(["targets", "cpag", "housing", "jrf", "fai", "migration"]).map((s) => (
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
        title="A record is only accountability if someone is shown it"
        body="Your MSP and MP both have a say in at least one of the decisions on this page. It takes about two minutes to ask them where they stand."
        href="/take-action"
        cta="Write to your representative"
        secondaryHref="/what-would-fix-it"
        secondaryCta="See the costed options"
      />
    </>
  );
}
