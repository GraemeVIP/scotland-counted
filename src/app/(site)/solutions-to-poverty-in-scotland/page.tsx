import Link from "next/link";
import EditorialImage from "@/components/EditorialImage";
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
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { fixes, type FixStatus } from "@/lib/data/policy";
import { getSources } from "@/lib/data/sources";
import Faq from "@/components/Faq";

export const metadata = meta({
  title: "Solutions to Poverty in Scotland: What Would Help",
  description:
    "See practical, costed policies that could reduce poverty in Scotland, what each would change and whether Westminster, Holyrood or councils control it.",
  path: "/solutions-to-poverty-in-scotland",
});

const TAG: Record<FixStatus, string> = {
  done: "text-[var(--good-text)]",
  partial: "text-[var(--warn-text)]",
  "not-done": "text-[var(--bad-text)]",
};

const STATUS_VAR: Record<FixStatus, string> = {
  done: "--good",
  partial: "--warn",
  "not-done": "--bad",
};

/** Who holds the power, in the same two colours the rest of the site uses for MP and MSP. */
const LEVER_STYLE: Record<string, { colorVar: string; writeTo: string; blurb: string }> = {
  Westminster: {
    colorVar: "--glasgow",
    writeTo: "your MP",
    blurb: "The UK Government sets Universal Credit and help with private rent.",
  },
  Holyrood: {
    colorVar: "--scotland",
    writeTo: "your MSP",
    blurb: "The Scottish Government sets the Scottish Child Payment, housing and childcare.",
  },
  "Glasgow City Council": {
    colorVar: "--ink",
    writeTo: "your councillors",
    blurb: "The council runs homelessness services and local support.",
  },
};

const LEVER_ORDER = ["Westminster", "Holyrood", "Glasgow City Council"] as const;

const SCORE: { status: FixStatus; label: string; blurb: string }[] = [
  {
    status: "done",
    label: "Delivered",
    blurb: "The two-child limit was finally scrapped in April 2026, nine years after it started.",
  },
  {
    status: "partial",
    label: "Started, not finished",
    blurb: "Money has been committed, but well below what the costings say is needed.",
  },
  {
    status: "not-done",
    label: "Not done",
    blurb: "Costed, published and recommended by independent experts. Still not funded.",
  },
];

/**
 * The two figures side by side. Employability spending is what the 2026–31 plan
 * actually commits each year; the other is what the costings say the payment
 * that lifts around 10,000 children would need. Bars are drawn against £310m.
 */
const SPEND = [
  {
    m: 90,
    label: "What the 2026–31 plan spends on helping people find work",
    colorVar: "--flat",
    note: "Real help, and worth having. It is not what the research says shifts the poverty figure most.",
  },
  {
    m: 310,
    label: "What experts cost the extra Scottish Child Payment at",
    colorVar: "--brand",
    note: "Estimated to lift around 10,000 children out of poverty. Not funded.",
  },
];

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
          { name: "What would fix it", path: "/solutions-to-poverty-in-scotland" },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          headline: "What would help cut poverty in Scotland",
          description: metadata.description as string,
          path: "/solutions-to-poverty-in-scotland",
        })}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      <Page>
        <PageHeader
          eyebrow="Scotland · Seven practical changes"
          title="What would help cut poverty in Scotland"
          lede="I do not have to guess. Independent experts have tested the main ideas. They agree that families need more money coming in, affordable housing and childcare that works around real jobs."
          stat={{
            value: `${done} of ${fixes.length}`,
            label:
              "changes on this page has been fully delivered. The rest are costed, published and still waiting.",
            tone: "bad",
          }}
        />

        <InShort>
          <p><strong>Families need enough money to live on.</strong> Job schemes alone do not fix poverty.</p>
          <p>Affordable homes and childcare that fits shift work also matter.</p>
          <p>Most of the changes experts recommend have not been fully delivered.</p>
        </InShort>

        <ContentFrame>
          <EditorialImage
            src="/images/editorial/scotland-secure-homes.webp"
            alt="An illustrated family arriving home on a modern affordable-housing street in Scotland."
            caption="Security is the outcome: enough income and housing for families to plan ahead instead of constantly absorbing another bill."
            aspect="wide"
            className="mt-10"
            objectPosition="center 48%"
          />
        </ContentFrame>
      </Page>

      <Slab attribution="The shared finding of JRF, IPPR Scotland and the Fraser of Allander Institute">
        A job matters. But families also need enough money left after rent, childcare and bills.
      </Slab>

      <Page>
        {/* ---------- Where the seven stand ---------- */}
        <ContentFrame as="section">
          <SectionHead eyebrow="The scoreboard" title="Where the seven changes stand today" />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            The research does not reach the 2030 target through job schemes alone. These are the
            seven changes experts have costed. This is how many have actually happened.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-[980px]">
            {SCORE.map((s) => {
              const n = fixes.filter((f) => f.status === s.status).length;
              return (
                <div
                  key={s.status}
                  className="rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] px-6 py-6"
                  style={{ borderTop: `4px solid var(${STATUS_VAR[s.status]})` }}
                >
                  <p
                    className="display-stat text-[clamp(40px,4.6vw,58px)]"
                    style={{ color: `var(${STATUS_VAR[s.status]})` }}
                  >
                    {n}
                  </p>
                  <p className="ui text-[17px] font-[750] mt-1.5">{s.label}</p>
                  <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] mt-1.5">
                    {s.blurb}
                  </p>
                </div>
              );
            })}
          </div>
        </ContentFrame>

        {/* ---------- Grouped by who can act ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <SectionHead eyebrow="Sorted by who can act" title="Each change, and the person to ask" />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            Nothing on this list can be delivered by wanting it. Each one sits with a specific
            government, which means each one has a specific person you can write to.
          </p>

          <div className="mt-10 space-y-14">
            {LEVER_ORDER.map((lever) => {
              const group = fixes.filter((f) => f.lever === lever);
              if (group.length === 0) return null;
              const style = LEVER_STYLE[lever];

              return (
                <div key={lever}>
                  <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 mb-6 border-b-2"
                    style={{ borderColor: `var(${style.colorVar})` }}
                  >
                    <h3
                      className="text-[24px] sm:text-[29px] font-[790] leading-[1.1]"
                      style={{ color: `var(${style.colorVar})` }}
                    >
                      {lever}
                    </h3>
                    <p className="ui text-[16px] font-[720] text-[var(--ink-2)]">
                      {group.length} {group.length === 1 ? "change" : "changes"} · write to{" "}
                      {style.writeTo}
                    </p>
                  </div>
                  <p className="ui text-[15.5px] leading-[1.55] text-[var(--muted)] max-w-[62ch] mb-6">
                    {style.blurb}
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    {group.map((f, i) => (
                      <Reveal key={f.id} delay={i * 40}>
                        <div
                          className="h-full flex flex-col rounded-[var(--r-m)] bg-[var(--surface)] border border-[var(--rule)] p-6"
                          style={{ boxShadow: "var(--shadow-1)" }}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <p className="ui font-[750] text-[18px] leading-[1.35] max-w-[30ch]">
                              {f.what}
                            </p>
                            <StatusTag status={f.status} label={f.statusLabel} />
                          </div>
                          <p className="text-[16px] text-[var(--ink-2)] leading-[1.55] mb-5">
                            {f.effect}
                          </p>
                          <p className="ui tnum text-[15px] text-[var(--muted)] border-t border-[var(--rule)] pt-4 mt-auto">
                            <strong className="text-[var(--ink)]">Cost:</strong> {f.cost}
                          </p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-[var(--r-m)] border-l-[5px] border-[var(--brand)] bg-[var(--surface-2)] px-6 sm:px-8 py-6 max-w-[880px]">
            <p className="ui text-[15px] font-[750] text-[var(--brand)] mb-2">
              The help that already exists
            </p>
            <p className="text-[19px] sm:text-[21px] leading-[1.45] font-[660] max-w-[52ch]">
              The <G t="scp">Scottish Child Payment</G> is £28.20 per child per week, rising to £40
              for under-ones from 2027.
            </p>
            <p className="text-[16.5px] leading-[1.6] text-[var(--ink-2)] mt-3 max-w-[62ch]">
              It works. It is the main reason Scotland&apos;s line stayed flat while England&apos;s
              cities climbed. It is simply too small on its own to match the size of the problem.
            </p>
          </div>
        </ContentFrame>

        {/* ---------- Why the cheap lever keeps winning ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <SectionHead
            eyebrow="The pattern"
            title="Governments keep picking the cheaper idea"
          />
          <p className="mt-6 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[62ch]">
            Helping people find work costs less than putting money in their hands every week. So
            that is what gets funded, even though the government&apos;s own research says the
            expensive option is the one that moves the poverty figure.
          </p>

          <Reveal>
            <div className="mt-9 max-w-[880px] space-y-7">
              {SPEND.map((s) => (
                <div key={s.label}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2.5">
                    <p className="ui text-[16.5px] font-[740] max-w-[46ch]">{s.label}</p>
                    <p
                      className="figure-num text-[30px] sm:text-[36px] tnum"
                      style={{ color: `var(${s.colorVar})` }}
                    >
                      £{s.m}m
                    </p>
                  </div>
                  <div className="h-[18px] w-full rounded-[var(--r-pill)] bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-[var(--r-pill)]"
                      style={{ width: `${(s.m / 310) * 100}%`, background: `var(${s.colorVar})` }}
                    />
                  </div>
                  <p className="text-[15.5px] leading-[1.55] text-[var(--ink-2)] mt-2.5 max-w-[62ch]">
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <p className="mt-8 text-[18px] leading-[1.6] text-[var(--ink-2)] max-w-[66ch]">
            Both figures are a year. Both are real choices made by the same government.{" "}
            <Link href="/who-is-responsible-for-poverty-in-scotland">That choice is on the record</Link>, and it is a fair thing
            to ask your MSP about.
          </p>
        </ContentFrame>

        {/* ---------- FAQ ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <Faq items={FAQ} kicker="Questions" title="What people ask about the changes" />
        </ContentFrame>

        {/* ---------- Sources ---------- */}
        <ContentFrame as="section" className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
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
                <ExplainText>{s.used}</ExplainText>
              </div>
            ))}
          </div>
        </ContentFrame>
      </Page>

      <CTA
        title="Ask the people who can make these changes"
        body="Enter your postcode. I find your MP and MSP, add the local facts and put the right requests into each email automatically. You do not need to choose."
        href="/email-your-mp-and-msp"
        cta="Find my MP and MSP"
        secondaryHref="/who-is-responsible-for-poverty-in-scotland"
        secondaryCta="See who decides"
      />
    </>
  );
}
