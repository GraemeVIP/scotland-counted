import Link from "next/link";
import { Page, ContentFrame, Col, PageHeader, CTA, InShort } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { sources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Methods and sources",
  description:
    "How every figure here was obtained, what was derived rather than published, and what the data cannot tell you. Full sources, linked to the originals.",
  path: "/methods",
});

const PRINCIPLES = [
  {
    title: "Go to the original source",
    body: "Every figure comes from the organisation that published it — not a newspaper story repeating the number.",
  },
  {
    title: "Say when I did the maths",
    body: "If I calculated a number ourselves, I say so and show the calculation. I also check it against a published figure whenever possible.",
  },
  {
    title: "Do not hide weak figures",
    body: "If a figure may be unreliable, the chart uses a dotted line and explains why. Readers can decide for themselves.",
  },
  {
    title: "Say when the rules changed",
    body: "Sometimes an official figure starts counting different people. I mark the point where that happened and explain what can still be compared.",
  },
  {
    title: "Record choices, not motives",
    body: "The site says what a government did and what happened next. It does not guess why someone did it or claim to know whether they are honest.",
  },
  {
    title: "Corrections are public",
    body: "If a figure is wrong, I fix it and keep a public note of what changed.",
  },
];

const LIMITS = [
  "The main poverty survey is reliable for Scotland as a whole, but not for each council area. Local pages therefore use separate records for child poverty, out-of-work benefits and pay. They show different parts of the story and should not be treated as the same thing.",
  "There is no reliable local child-poverty series before 2014/15. Older local pages can show work and neighbourhood figures, but not the same poverty measure.",
  "Scotland's neighbourhood list ranks places from worst-off to best-off. It does not count every person in hardship. A place can improve and still move down if other places improve faster.",
  "Some job figures from 2024 onward are unreliable because too few people answered the survey. I show that part with a dotted line and a warning.",
  "An area-wide figure does not describe every street or family. Within Glasgow, estimated child poverty ranges from roughly 5% in some neighbourhoods to roughly 75% in others.",
  "The ONS pay charts are not the average wage. They cover a restricted sample of full-time PAYE employee jobs and exclude all part-time jobs, self-employment, employees outside PAYE, junior rates and pay affected by absence.",
  "Workplace and residence pay are separate medians for separate groups. The difference between them does not track the same people and cannot prove that a particular amount of wages leaves an area.",
  "Pay figures show the cash amount at the time and do not remove the effect of rising prices. Compare places within the same year, not along the line.",
  "The life-expectancy figure describes death rates across the population. It is not a prediction for any one person.",
];

export default function Methods() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Methods", path: "/methods" },
        ])}
      />

      <Page>
        <PageHeader
          eyebrow="How this was built"
          title="Methods and sources"
          lede="You should not have to trust me. This page shows where every number came from, any maths I did and what the figures cannot prove."
        />

        <ContentFrame>
          <InShort expert={false}>
            <p><strong>The simple pages tell the story. This page lets you check the working.</strong></p>
            <p>Every source is linked. Weak or missing data is labelled instead of hidden.</p>
          </InShort>

        <section className="pt-11">
          <h2 className="h2 mb-6">Six rules I follow</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-[var(--r-s)] bg-[var(--surface)] border border-[var(--rule)] p-5"
              >
                <h3 className="h3 mb-2">{p.title}</h3>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-4">What the figures cannot prove</h2>
          <Col>
            <p>
              These limits matter. If the site claims more than the figures can support, tell me.
            </p>
            <ul>
              {LIMITS.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Col>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-2">Every source</h2>
          <p className="text-[15px] text-[var(--ink-2)] mb-7 max-w-[62ch]">
            {sources.length} sources. Each entry says what I used and any calculation I made.
          </p>

          <ol className="space-y-6 max-w-[78ch]">
            {sources.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="ui text-[15px] text-[var(--muted)] pt-1 tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <a
                    href={s.url}
                    className="text-[16px] font-[560] underline decoration-[var(--baseline)] underline-offset-2 hover:decoration-current"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.title}
                  </a>
                  <p className="ui text-[15px] text-[var(--muted)] mt-0.5 mb-1.5">
                    {s.publisher}
                  </p>
                  <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">{s.used}</p>
                  {s.derivation && (
                    <p className="text-[15px] text-[var(--ink-2)] leading-[1.55] mt-1.5 pl-3 border-l-2 border-[var(--rule)]">
                      <span className="ui text-[15px] font-[650] text-[var(--muted)] block mb-0.5">
                        My calculation
                      </span>
                      {s.derivation}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <CTA
          title="Check the work yourself"
          body="Download the original extracts, open the source links and tell me if something does not match. Confirmed errors are fixed and recorded publicly."
          href="/data"
          cta="Download the data"
          secondaryHref="/corrections"
          secondaryCta="Tell me about an error"
        />

        <p className="mt-10 text-[15px] text-[var(--ink-2)] max-w-[66ch]">
          Terms are explained in the <Link href="/glossary">plain-English glossary</Link>.
        </p>
        </ContentFrame>
      </Page>
    </>
  );
}
