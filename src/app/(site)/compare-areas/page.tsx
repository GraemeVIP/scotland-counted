import { redirect } from "next/navigation";
import { Page, ContentFrame, PageHeader, SectionHead, HeaderFacts } from "@/components/Blocks";
import { RankingLinks } from "@/components/AreaRanking";
import AreaComparePicker from "@/components/AreaComparePicker";
import AreaComparison from "@/components/AreaComparison";
import SharePage from "@/components/SharePage";
import { meta } from "@/lib/seo";
import { councils } from "@/lib/data/councils";
import { COMPARE_DEFAULTS, COMPARE_METRICS, winner } from "@/lib/data/compareAreas";
import Breadcrumbs from "@/components/Breadcrumbs";
import NextStepStrip from "@/components/NextStepStrip";
import { councilTaxPath } from "@/lib/routeMap";

/**
 * Compare any two of Scotland's 32 council areas.
 *
 * The chosen pair lives in the address (?a=…&b=…) so a comparison can be
 * shared, but every pair is the same page to search engines: the canonical
 * stays /compare-areas, so 496 near identical pairings are never indexed.
 */

export const metadata = meta({
  title: "Compare Areas in Scotland: Two Council Areas Side by Side",
  description:
    "Compare any two Scottish council areas, or two postcodes, on pay, house prices, crime, poverty, health, schools and council services, using the latest official figures.",
  path: "/compare-areas",
});

const valid = (slug: string | undefined) => (slug && councils.some((c) => c.slug === slug) ? slug : undefined);

export default async function CompareAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const params = await searchParams;
  const rawA = valid(params.a);
  const rawB = valid(params.b);

  if ((params.a && !rawA) || (params.b && !rawB)) {
    redirect("/compare-areas");
  }

  const a = rawA ?? COMPARE_DEFAULTS.a;
  let b = rawB ?? COMPARE_DEFAULTS.b;
  if (b === a) {
    b = a === COMPARE_DEFAULTS.b ? COMPARE_DEFAULTS.a : COMPARE_DEFAULTS.b;
    if (rawA && rawB && rawA === rawB) {
      redirect(`/compare-areas?a=${a}&b=${b}`);
    }
  }

  if (rawA && rawB && [a, b].sort().join() === "city-of-edinburgh,glasgow-city") {
    redirect("/glasgow-vs-edinburgh");
  }

  const nameOf = (slug: string) => councils.find((c) => c.slug === slug)?.name ?? slug;
  // The same tally the comparison's scoreboard shows below.
  const results = COMPARE_METRICS.map((m) => winner(m, a, b)).filter((w) => w === "a" || w === "b");
  const aWins = results.filter((w) => w === "a").length;
  const bWins = results.filter((w) => w === "b").length;

  return (
    <>
      <Breadcrumbs crumbs={[
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "Compare areas", path: "/compare-areas" },
        ]} />
      <Page>
        <PageHeader
          eyebrow="Your area · Compare"
          title="Compare areas in Scotland"
          lede="Pick any two council areas, or type two postcodes, and see them side by side: pay, homes, jobs, crime, poverty, health, schools and how the council performs. Every figure is the latest official one, with its source."
          panel={
            <HeaderFacts
              items={[
                { value: `${aWins} of ${results.length}`, label: `measures where ${nameOf(a)} comes out better` },
                { value: `${bWins} of ${results.length}`, label: `measures where ${nameOf(b)} comes out better` },
              ]}
            />
          }
        >
          <SharePage
            title={`${councils.find((c) => c.slug === a)?.name ?? a} vs ${councils.find((c) => c.slug === b)?.name ?? b}`}
            text={`Side by side official figures for ${councils.find((c) => c.slug === a)?.name ?? a} vs ${councils.find((c) => c.slug === b)?.name ?? b}: pay, house prices, council tax, crime and schools.`}
            path={`/compare-areas?a=${a}&b=${b}`}
            label="Share this comparison"
            className="mt-4"
          />
        </PageHeader>
        <ContentFrame>
          <div className="pb-10">
            <AreaComparePicker key={`${a}-${b}`} a={a} b={b} />
          </div>
        </ContentFrame>
      </Page>
      {/*
        Outside Page on purpose: Page runs its children through the glossary
        annotator, and on a tree this large the server and browser annotate
        different parts of it, which breaks hydration. The rows are written
        in plain words, so they do not need it.
      */}
      <div className="max-w-[1232px] mx-auto px-5 sm:px-8 lg:px-14">
        <ContentFrame className="pb-16">
          <AreaComparison a={a} b={b} />
          {/* The comparison is the answer. The best next click is the bill
              people pay in each place, then a check on one street. */}
          <NextStepStrip
            heading="Your next check"
            className="mt-12"
            items={[
              {
                href: councilTaxPath(a),
                label: `Council tax in ${nameOf(a)}`,
                blurb: "Every band, with the water charge most sites leave out.",
              },
              {
                href: councilTaxPath(b),
                label: `Council tax in ${nameOf(b)}`,
                blurb: "Same house, different council, different bill. See by how much.",
              },
              {
                href: "/simd-postcode-checker",
                label: "Check one street",
                blurb: "A whole council can hide big gaps. See how one postcode ranks.",
              },
            ]}
          />
          <section className="pt-16" aria-labelledby="rankings">
            <SectionHead eyebrow="Rankings" title="Every area, ranked" id="rankings" />
            <div className="mt-6">
              <RankingLinks current="/compare-areas" />
            </div>
          </section>
        </ContentFrame>
      </div>
    </>
  );
}
