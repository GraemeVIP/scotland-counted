import { Page, ContentFrame, PageHeader } from "@/components/Blocks";
import AreaComparePicker from "@/components/AreaComparePicker";
import AreaComparison from "@/components/AreaComparison";
import { JsonLd, breadcrumbJsonLd, meta } from "@/lib/seo";
import { councils } from "@/lib/data/councils";
import { COMPARE_DEFAULTS } from "@/lib/data/compareAreas";

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
  const a = valid(params.a) ?? COMPARE_DEFAULTS.a;
  let b = valid(params.b) ?? COMPARE_DEFAULTS.b;
  if (b === a) b = a === COMPARE_DEFAULTS.b ? COMPARE_DEFAULTS.a : COMPARE_DEFAULTS.b;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Your area", path: "/areas" },
          { name: "Compare areas", path: "/compare-areas" },
        ])}
      />
      <Page>
        <PageHeader
          eyebrow="Your area · Compare"
          title="Compare areas in Scotland"
          lede="Pick any two council areas, or type two postcodes, and see them side by side: pay, homes, jobs, crime, poverty, health, schools and how the council performs. Every figure is the latest official one, with its source."
        />
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
        </ContentFrame>
      </div>
    </>
  );
}
