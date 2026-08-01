import Link from "next/link";
import { Page, ContentFrame, PageHeader, CTA, SectionHead } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { getSources } from "@/lib/data/sources";
import { quiz } from "@/lib/data/quiz";
import Quiz from "@/components/Quiz";

export const metadata = meta({
  title: "How much do you actually know about poverty in Scotland?",
  description:
    "Six questions, about ninety seconds. Guess the real figures on child poverty, wages, council tax and what happened when payments rose. Most people are wrong.",
  path: "/quiz",
  type: "website",
});

export default function QuizPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Quiz", path: "/quiz" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow={`${quiz.length} questions · about 90 seconds`}
          title="Guess the figure"
          lede="These are official, published figures about the country you live in. Almost nobody gets them right, and the gap between what people assume and what is true is the whole problem."
        />

        <ContentFrame className="pt-4">
          <Quiz />
        </ContentFrame>

        {/* ---------- Why this exists ---------- */}
        <ContentFrame as="section" className="pt-20 sm:pt-24">
          <SectionHead
            eyebrow="Why guess at all"
            title="Being wrong about this is the normal response"
          />
          <div className="mt-6 grid gap-x-14 gap-y-6 lg:grid-cols-2">
            <p className="text-[18px] leading-[1.6] text-[var(--ink-2)]">
              People consistently underestimate how bad these numbers are, and that is not
              stupidity. The figures are published, but they sit in spreadsheets, behind words like
              &ldquo;equivalised&rdquo; and &ldquo;after housing costs&rdquo;, and nobody ever says
              them out loud in ordinary language.
            </p>
            <p className="text-[18px] leading-[1.6] text-[var(--ink-2)]">
              That matters, because pressure follows attention. A figure nobody knows cannot embarrass
              anyone. Every answer here links to the page where the same number is shown with the
              organisation that published it, so you can check any of it rather than take my word.
            </p>
          </div>
        </ContentFrame>

        {/* ---------- Sources ---------- */}
        <ContentFrame as="section" className="mt-20 pt-8 border-t-2 border-[var(--ink)]">
          <p className="label mb-6">Where the answers come from</p>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {getSources([
              "ecp",
              "sg-poverty-2026",
              "targets",
              "minimum-wage-2026",
              "scottish-tax-2026",
              "council-tax-scotland",
            ]).map((s) => (
              <div key={s.id} className="text-[15px] leading-[1.55] text-[var(--ink-2)]">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink)] underline decoration-[var(--rule-strong)] underline-offset-3 hover:decoration-[var(--brand)]"
                >
                  {s.title}
                </a>
                <p className="ui mt-1.5 mb-1.5 text-[15px] text-[var(--muted)]">{s.publisher}</p>
                {s.used}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.6] text-[var(--muted)]">
            Nothing in the quiz is written for effect. Every figure appears elsewhere on this site
            with its working shown — if you think one is wrong,{" "}
            <Link href="/corrections">tell me and I will correct it publicly</Link>.
          </p>
        </ContentFrame>
      </Page>

      <CTA
        title="Now put one of those numbers to the person who decides it"
        body="Enter your postcode. I find your MP and MSP, add the figures for your own area and write both emails. You read them and press send."
        href="/take-action"
        cta="Find my MP and MSP"
        secondaryHref="/the-numbers"
        secondaryCta="See every figure"
      />
    </>
  );
}
