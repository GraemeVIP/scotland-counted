import Link from "next/link";
import {
  Page,
  ContentFrame,
  Slab,
  SectionHead,
  PageHeader,
  InShort,
  CTA,
  Reveal,
} from "@/components/Blocks";
import { ExplainText, G } from "@/components/Glossary";
import VoteRoundup from "@/components/VoteRoundup";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { tiers, statutoryTargets } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";

/**
 * Each tier gets its own colour and its own "who you write to", so the split of
 * powers is something a reader can see rather than something they have to hold
 * in their head. Westminster and Holyrood reuse the two series colours the rest
 * of the site already uses for MP and MSP.
 */
const TIER_STYLE: Record<string, { colorVar: string; writeTo: string }> = {
  westminster: { colorVar: "--glasgow", writeTo: "your MP" },
  holyrood: { colorVar: "--scotland", writeTo: "your MSP" },
  glasgow: { colorVar: "--ink", writeTo: "your councillors" },
};

/**
 * Glasgow child poverty either side of the pandemic, from the End Child Poverty
 * series on /indicators/glasgow-child-poverty. The middle year is the whole argument:
 * the figure moved when the money moved.
 */
const PANDEMIC = [
  {
    year: "2019/20",
    value: "32.2%",
    what: "Before",
    why: "Nine straight years of rising child poverty in Glasgow.",
    colorVar: "--flat",
  },
  {
    year: "2020/21",
    value: "29.4%",
    what: "Payments went up",
    why: "£20 a week more on Universal Credit, plus furlough. The figure fell for the first time in a decade.",
    colorVar: "--good",
  },
  {
    year: "2021/22",
    value: "32.0%",
    what: "The extra help ended",
    why: "The £20 was withdrawn in October 2021. Almost the entire fall was undone within the year.",
    colorVar: "--bad",
  },
];

export const metadata = meta({
  title: "Who Is Responsible for Poverty Policy in Scotland?",
  description:
    "See which poverty, benefit, housing, pay and council decisions belong to Westminster, the Scottish Parliament or your local council.",
  path: "/who-is-responsible-for-poverty-in-scotland",
});

export default function Accountability() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Accountability", path: "/who-is-responsible-for-poverty-in-scotland" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "Who is responsible for poverty policy in Scotland?",
          description: metadata.description as string,
          path: "/who-is-responsible-for-poverty-in-scotland",
        })}
      />

      <Page>
        <PageHeader
          eyebrow="Politics explained simply"
          title="Who is responsible for poverty in Scotland?"
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
          <p>Enter your postcode and I send the right question to the right person automatically.</p>
        </InShort>

        <ContentFrame className="pt-4">
          <p className="text-[15.5px] leading-[1.6] text-[var(--ink-2)] max-w-[70ch]">
            This page records decisions and what happened next. It does not guess what a politician
            intended. A party is named only when it formed the government that made the decision.
            If anything here is wrong,{" "}
            <Link href="/corrections">tell me and I will correct it publicly</Link>.
          </p>
        </ContentFrame>

        {/* ---------- The four missed targets ---------- */}
        <ContentFrame as="section" className="pt-16 sm:pt-20">
          <SectionHead
            eyebrow="Four promises written into law"
            title="Scotland missed every child-poverty target"
          />
          <div className="mt-6">
            <p className="text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
              These were not aims or ambitions. Parliament wrote four numbers into law and gave
              itself until 2023/24 to hit them. The widest miss was persistent poverty, children
              poor in at least three of the last four years, which came in at{" "}
              <strong className="text-[var(--ink)]">23% against a target below 8%</strong>.
            </p>

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
                      <span className="ui rounded-full text-[15px] font-[700] text-[var(--bad-text)] border border-current px-3 py-2 whitespace-nowrap">
                        Missed
                      </span>
                    </div>
                    <p className="ui text-[15px] text-[var(--ink-2)]">
                      The law said {t.target}. What happened:{" "}
                      <strong className="text-[var(--bad-text)] font-[700]">{t.actual}</strong>
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
                        <td className="ui tnum px-4 py-3.5 border-b border-[var(--rule)] text-[16px] font-[700] text-[var(--bad-text)]">
                          {t.actual}
                        </td>
                        <td className="px-4 py-3.5 border-b border-[var(--rule)]">
                          <span className="ui rounded-full text-[15px] font-[700] text-[var(--bad-text)] border border-current px-3 py-2 whitespace-nowrap">
                            Missed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <p className="mt-8 max-w-[860px] rounded-[var(--r-m)] border-l-[5px] border-[var(--bad)] bg-[var(--surface-2)] px-6 sm:px-8 py-6 text-[20px] sm:text-[23px] leading-[1.45] font-[680]">
              Ministers have confirmed there is no penalty for missing them. Nothing happens next.
              That is what makes this a question worth putting to the people who voted for the law.
            </p>
          </div>
        </ContentFrame>
      </Page>

      <Slab attribution="The structure, not an accident of politics">
        London, Edinburgh and councils control different parts. That makes blame easy and change hard.
      </Slab>

      <Page>
        {/* ---------- The three tiers ---------- */}
        <ContentFrame as="section">
          <SectionHead eyebrow="Government by government" title="Who can do what" />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            Three different governments hold three different sets of powers over the same families.
            Each can point at another and be partly right. That is exactly why nothing gets fixed, 
            and why it matters that you write to the one who can actually act.
          </p>
          <div className="grid gap-5 mt-9">
            {tiers.map((t, i) => {
              const tier = TIER_STYLE[t.id] ?? TIER_STYLE.westminster;
              return (
                <Reveal key={t.id} delay={i * 60}>
                  <article
                    className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] px-6 sm:px-9 pt-7 pb-7"
                    style={{ borderTop: `4px solid var(${tier.colorVar})`, boxShadow: "var(--shadow-1)" }}
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                      <p
                        className="ui text-[15px] font-[760] rounded-[var(--r-pill)] px-3.5 py-1.5 border"
                        style={{ color: `var(${tier.colorVar})`, borderColor: "currentColor" }}
                      >
                        {t.who}
                      </p>
                      <p className="ui text-[15px] font-[700] text-[var(--muted)]">
                        Write to {tier.writeTo}
                      </p>
                    </div>
                    <p className="ui text-[15.5px] text-[var(--muted)] leading-[1.5] mb-4 max-w-[70ch]">
                      {t.power}
                    </p>
                    <h3 className="text-[24px] sm:text-[29px] font-[780] leading-[1.15] mb-6 max-w-[34ch]">
                      {t.heading}
                    </h3>
                    <ul className="space-y-3.5">
                      {t.points.map((p, j) => (
                        <li
                          key={j}
                          className="relative pl-6 text-[16px] leading-[1.6] text-[var(--ink-2)] max-w-[74ch]"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-[0.7em] w-[11px] h-[2px]"
                            style={{ background: `var(${tier.colorVar})` }}
                          />
                          {p.emphasis && (
                            <strong className="text-[var(--ink)] font-[640]">{p.emphasis} </strong>
                          )}
                          {p.text}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </ContentFrame>

        {/* ---------- The record ---------- */}
        <ContentFrame>
          <VoteRoundup className="pt-20 sm:pt-24" />
        </ContentFrame>

        {/* ---------- The structural point ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <SectionHead
            eyebrow="The one thing that has been proved"
            title="When payments went up, child poverty fell"
          />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            This is not a theory. It already happened, and it happened in Glasgow. During the
            pandemic, Universal Credit went up by £20 a week and furlough kept wages coming in.
            Child poverty fell. The next year the extra help stopped, and it went straight back up.
          </p>

          <Reveal>
            <ol className="mt-9 grid gap-4 sm:grid-cols-3 max-w-[980px]">
              {PANDEMIC.map((p) => (
                <li
                  key={p.year}
                  className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] px-6 py-7"
                  style={{ borderTop: `4px solid var(${p.colorVar})` }}
                >
                  <p className="ui text-[15px] font-[720] text-[var(--muted)] tnum">{p.year}</p>
                  <p
                    className="display-stat text-[clamp(38px,4.4vw,54px)] mt-2"
                    style={{ color: `var(${p.colorVar})` }}
                  >
                    {p.value}
                  </p>
                  <p className="ui text-[16px] font-[740] mt-2.5">{p.what}</p>
                  <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] mt-2">{p.why}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <p className="mt-7 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[68ch]">
            Government choices moved the figure in both directions inside two years. Nobody has to
            argue about whether this works. <G t="reserved">The powers are split</G>, and no single
            government owns the whole result, but the lever itself is not in doubt.{" "}
            <Link href="/indicators/glasgow-child-poverty">See the full ten-year chart</Link>.
          </p>
        </ContentFrame>

        {/* ---------- Sources ---------- */}
        <ContentFrame as="section" className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
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
                <ExplainText>{s.used}</ExplainText>
              </div>
            ))}
          </div>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask the right people without working out the politics"
        body="Enter your postcode. I find your MP and MSP and put the right request into each email automatically."
        href="/email-your-mp-and-msp"
        cta="Find my MP and MSP"
        secondaryHref="/solutions-to-poverty-in-scotland"
        secondaryCta="See what would help"
      />
    </>
  );
}
