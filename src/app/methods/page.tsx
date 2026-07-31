import Link from "next/link";
import { Page, Col, PageHeader, CTA } from "@/components/Blocks";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { sources } from "@/lib/data/sources";

export const metadata = meta({
  title: "Methods and sources",
  description:
    "How every figure on this site was obtained, what was derived rather than published, and what the data cannot tell you. Full source list with links to the original publishers.",
  path: "/methods",
});

const PRINCIPLES = [
  {
    title: "Primary sources only",
    body: "Every figure was retrieved from the body that published it — ONS, DWP, the Scottish Government, End Child Poverty, or a named academic study. Nothing is cited from newspaper reporting of a statistic.",
  },
  {
    title: "Derived numbers are labelled as derived",
    body: "Where we calculated something that is not published directly, the calculation is stated and, where possible, validated against a published figure. The Scotland-wide child poverty rate is the main example: our method reproduces the official 24.5% for 2022/23.",
  },
  {
    title: "Bad data is shown, not hidden",
    body: "Where a series becomes unreliable, we plot it dotted and shaded with the reason on the chart, rather than quietly truncating it. Readers can see the weakness and judge for themselves.",
  },
  {
    title: "Definitional breaks are declared",
    body: "Where a measure changed what it counts mid-series — the claimant count in 2015, for example — the technical note under the chart says so, and says whether the comparison still holds.",
  },
  {
    title: "No individuals are named",
    body: "The accountability pages describe decisions and their measured consequences. Where a party is named it is because a government it formed took the decision. We do not attribute motives or make claims about anyone's honesty.",
  },
  {
    title: "Corrections are public",
    body: "If a figure is wrong we change it and log the change. A record that quietly edits itself is not a record.",
  },
];

const LIMITS = [
  "There is no consistent local child poverty series before 2014/15. The earlier part of the period is covered only by labour-market and neighbourhood measures.",
  "The neighbourhood deprivation ranking (SIMD) is a league table, not a headcount of hardship. A place can improve in absolute terms and still fall in the ranking.",
  "Survey-based figures from 2024 onward are unreliable at council level because response rates collapsed. We show them, dotted, rather than pretend they do not exist.",
  "Everything here is a city or council-wide average. Child poverty within Glasgow ranges from roughly 5% in some neighbourhoods to roughly 75% in others, so no single number describes anyone's street.",
  "Pay figures are in cash, not adjusted for inflation. Compare the lines with each other within a year, not along them.",
  "Life expectancy is a period measure describing death rates in a given window, not a forecast for any individual.",
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
          lede="The whole argument of this site is that the data was always public and simply hard to reach. So the working has to be visible, including the parts that weaken the case."
        />

        <section className="pt-11">
          <h2 className="h2 mb-6">Six rules we hold to</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="bg-[var(--surface)] border border-[var(--rule)] p-5"
              >
                <h3 className="h3 mb-2">{p.title}</h3>
                <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-14">
          <h2 className="h2 mb-4">What this site cannot tell you</h2>
          <Col>
            <p>
              Every one of these is a genuine limitation. If a claim on this site seems to outrun
              one of them, the claim is wrong and we want to know.
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
            {sources.length} sources. Each entry says what we took from it and any transformation
            we applied.
          </p>

          <ol className="space-y-6 max-w-[78ch]">
            {sources.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="datum text-[12px] text-[var(--muted)] pt-1 tnum">
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
                  <p className="datum text-[11.5px] text-[var(--muted)] mt-0.5 mb-1.5">
                    {s.publisher}
                  </p>
                  <p className="text-[15px] text-[var(--ink-2)] leading-[1.55]">{s.used}</p>
                  {s.derivation && (
                    <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] mt-1.5 pl-3 border-l-2 border-[var(--rule)]">
                      <span className="ui text-[10.5px] uppercase tracking-[0.1em] font-[620] text-[var(--muted)] block mb-0.5">
                        Our derivation
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
          title="Check us"
          body="The raw extracts are downloadable, the publishers are linked above, and the corrections page is not decorative. If something here is wrong, it should be found and fixed."
          href="/data"
          cta="Download the data"
          secondaryHref="/corrections"
          secondaryCta="Report an error"
        />

        <p className="mt-10 text-[15px] text-[var(--ink-2)] max-w-[66ch]">
          Terms are explained in the <Link href="/glossary">plain-English glossary</Link>.
        </p>
      </Page>
    </>
  );
}
